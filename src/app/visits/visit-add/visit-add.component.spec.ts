import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VisitAddComponent} from './visit-add.component';
import {FormsModule} from '@angular/forms';
import {VisitService} from '../visit.service';
import {PetService} from '../../pets/pet.service';
import {OwnerService} from '../../owners/owner.service';
import {Router, ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

describe('VisitAddComponent', () => {
  let component: VisitAddComponent;
  let fixture: ComponentFixture<VisitAddComponent>;
  let mockVisitService: jasmine.SpyObj<VisitService>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 2, visits: []};
  const mockOwner = {id: 2, firstName: 'George', lastName: 'Franklin', address: '', city: '', telephone: '', pets: []};

  beforeEach(waitForAsync(() => {
    mockVisitService = jasmine.createSpyObj('VisitService', ['addVisit']);
    mockPetService = jasmine.createSpyObj('PetService', ['getPetById']);
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPetService.getPetById.and.returnValue(of(mockPet));
    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [VisitAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: VisitService, useValue: mockVisitService},
        {provide: PetService, useValue: mockPetService},
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 1}}, parent: null}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet and owner on init', () => {
    expect(mockPetService.getPetById).toHaveBeenCalledWith(1);
    expect(mockOwnerService.getOwnerById).toHaveBeenCalledWith(2);
    expect(component.currentPet).toEqual(mockPet);
    expect(component.currentOwner).toEqual(mockOwner);
  });

  it('should handle error loading pet', () => {
    mockPetService.getPetById.and.returnValue(throwError('pet error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('pet error');
  });

  it('should submit visit and navigate', () => {
    const newVisit = {id: 1, date: '2020-01-01', description: 'checkup', pet: mockPet};
    mockVisitService.addVisit.and.returnValue(of(newVisit));
    component.currentOwner = mockOwner;
    component.onSubmit({id: null, date: '2020-01-01', description: 'checkup', pet: mockPet});
    expect(mockVisitService.addVisit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 2]);
  });

  it('should handle submit error', () => {
    mockVisitService.addVisit.and.returnValue(throwError('submit error'));
    component.onSubmit({id: null, date: '2020-01-01', description: 'test', pet: mockPet});
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to owner detail', () => {
    component.currentOwner = mockOwner;
    component.gotoOwnerDetail();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 2]);
  });
});
