import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PetEditComponent} from './pet-edit.component';
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

describe('PetEditComponent', () => {
  let component: PetEditComponent;
  let fixture: ComponentFixture<PetEditComponent>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockPetTypeService: jasmine.SpyObj<PetTypeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOwner: Owner = {id: 1, firstName: 'George', lastName: 'Franklin', address: '', city: '', telephone: '', pets: []};
  const mockPet: Pet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 1, visits: []};

  beforeEach(waitForAsync(() => {
    mockPetService = jasmine.createSpyObj('PetService', ['getPetById', 'updatePet']);
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById']);
    mockPetTypeService = jasmine.createSpyObj('PetTypeService', ['getPetTypes']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPetTypeService.getPetTypes.and.returnValue(of([{id: 1, name: 'cat'}]));
    mockPetService.getPetById.and.returnValue(of(mockPet));
    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [PetEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: PetService, useValue: mockPetService},
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: PetTypeService, useValue: mockPetTypeService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet types on init', () => {
    expect(component.petTypes.length).toBe(1);
  });

  it('should load pet and owner on init', () => {
    expect(mockPetService.getPetById).toHaveBeenCalledWith('1' as any);
    expect(component.pet).toEqual(mockPet);
    expect(component.currentOwner).toEqual(mockOwner);
  });

  it('should handle error loading pet types', () => {
    mockPetTypeService.getPetTypes.and.returnValue(throwError('types error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('types error');
  });

  it('should handle error loading pet', () => {
    mockPetService.getPetById.and.returnValue(throwError('pet error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('pet error');
  });

  it('should submit updated pet', () => {
    mockPetService.updatePet.and.returnValue(of(mockPet));
    component.currentOwner = mockOwner;
    component.currentType = {id: 1, name: 'cat'};
    component.onSubmit({id: 1, name: 'Leo', birthDate: '2020-01-01', type: null, owner: null, ownerId: 1, visits: []});
    expect(mockPetService.updatePet).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });

  it('should handle submit error', () => {
    mockPetService.updatePet.and.returnValue(throwError('update error'));
    component.currentType = {id: 1, name: 'cat'};
    component.onSubmit({id: 1, name: 'Leo', birthDate: '2020-01-01', type: null, owner: null, ownerId: 1, visits: []});
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate to owner detail', () => {
    component.gotoOwnerDetail(mockOwner);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });
});
