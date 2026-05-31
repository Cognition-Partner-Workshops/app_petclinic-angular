import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PetAddComponent} from './pet-add.component';
import {FormsModule} from '@angular/forms';
import {PetService} from '../pet.service';
import {OwnerService} from '../../owners/owner.service';
import {PetTypeService} from '../../pettypes/pettype.service';
import {Router, ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {Pet} from '../pet';
import {Owner} from '../../owners/owner';

describe('PetAddComponent', () => {
  let component: PetAddComponent;
  let fixture: ComponentFixture<PetAddComponent>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockPetTypeService: jasmine.SpyObj<PetTypeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOwner: Owner = {id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: []};

  beforeEach(waitForAsync(() => {
    mockPetService = jasmine.createSpyObj('PetService', ['addPet']);
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById']);
    mockPetTypeService = jasmine.createSpyObj('PetTypeService', ['getPetTypes']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPetTypeService.getPetTypes.and.returnValue(of([{id: 1, name: 'cat'}, {id: 2, name: 'dog'}]));
    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [PetAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: PetService, useValue: mockPetService},
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: PetTypeService, useValue: mockPetTypeService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: 1}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet types on init', () => {
    expect(mockPetTypeService.getPetTypes).toHaveBeenCalled();
    expect(component.petTypes.length).toBe(2);
  });

  it('should load owner on init', () => {
    expect(mockOwnerService.getOwnerById).toHaveBeenCalledWith(1);
    expect(component.currentOwner).toEqual(mockOwner);
  });

  it('should handle error loading pet types', () => {
    mockPetTypeService.getPetTypes.and.returnValue(throwError('types error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('types error');
  });

  it('should handle error loading owner', () => {
    mockOwnerService.getOwnerById.and.returnValue(throwError('owner error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('owner error');
  });

  it('should submit pet and navigate', () => {
    const newPet: Pet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: mockOwner, ownerId: 1, visits: []};
    mockPetService.addPet.and.returnValue(of(newPet));
    component.currentOwner = mockOwner;
    component.onSubmit({id: null, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: null, visits: []});
    expect(mockPetService.addPet).toHaveBeenCalled();
    expect(component.addedSuccess).toBe(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });

  it('should handle submit error', () => {
    mockPetService.addPet.and.returnValue(throwError('add error'));
    component.currentOwner = mockOwner;
    component.onSubmit({id: null, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: null, visits: []});
    expect(component.errorMessage).toBe('add error');
  });

  it('should navigate to owner detail', () => {
    component.currentOwner = mockOwner;
    component.gotoOwnerDetail();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });
});
