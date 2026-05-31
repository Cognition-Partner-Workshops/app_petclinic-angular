import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VisitEditComponent} from './visit-edit.component';
import {FormsModule} from '@angular/forms';
import {VisitService} from '../visit.service';
import {PetService} from '../../pets/pet.service';
import {OwnerService} from '../../owners/owner.service';
import {Router, ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';

describe('VisitEditComponent', () => {
  let component: VisitEditComponent;
  let fixture: ComponentFixture<VisitEditComponent>;
  let mockVisitService: jasmine.SpyObj<VisitService>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 2, visits: []};
  const mockOwner = {id: 2, firstName: 'George', lastName: 'Franklin', address: '', city: '', telephone: '', pets: []};
  const mockVisit = {id: 1, date: '2020-01-01', description: 'checkup', pet: mockPet, petId: 1};

  beforeEach(waitForAsync(() => {
    mockVisitService = jasmine.createSpyObj('VisitService', ['getVisitById', 'updateVisit']);
    mockPetService = jasmine.createSpyObj('PetService', ['getPetById']);
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockVisitService.getVisitById.and.returnValue(of(mockVisit));
    mockPetService.getPetById.and.returnValue(of(mockPet));
    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [VisitEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: VisitService, useValue: mockVisitService},
        {provide: PetService, useValue: mockPetService},
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load visit, pet and owner on init', () => {
    expect(mockVisitService.getVisitById).toHaveBeenCalledWith('1');
    expect(mockPetService.getPetById).toHaveBeenCalled();
    expect(mockOwnerService.getOwnerById).toHaveBeenCalled();
  });

  it('should handle error loading visit', () => {
    mockVisitService.getVisitById.and.returnValue(throwError('visit error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('visit error');
  });

  it('should submit updated visit', () => {
    mockVisitService.updateVisit.and.returnValue(of(mockVisit));
    component.currentPet = mockPet;
    component.currentOwner = mockOwner;
    component.onSubmit({id: 1, date: '2020-01-01', description: 'updated', pet: null});
    expect(mockVisitService.updateVisit).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 2]);
  });

  it('should handle submit error', () => {
    mockVisitService.updateVisit.and.returnValue(throwError('update error'));
    component.currentPet = mockPet;
    component.onSubmit({id: 1, date: '2020-01-01', description: 'test', pet: null});
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate to owner detail', () => {
    component.currentOwner = mockOwner;
    component.gotoOwnerDetail();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 2]);
  });
});
