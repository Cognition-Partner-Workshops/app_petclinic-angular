import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PetListComponent} from './pet-list.component';
import {PetService} from '../pet.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Pet} from '../pet';

describe('PetListComponent', () => {
  let component: PetListComponent;
  let fixture: ComponentFixture<PetListComponent>;
  let mockPetService: jasmine.SpyObj<PetService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockPetService = jasmine.createSpyObj('PetService', ['deletePet']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [PetListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: PetService, useValue: mockPetService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetListComponent);
    component = fixture.componentInstance;
    component.pet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 1, visits: []};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to edit pet', () => {
    const pet: Pet = {id: 1, name: 'Leo', birthDate: '', type: null, owner: null, ownerId: 1, visits: []};
    component.editPet(pet);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pets', 1, 'edit']);
  });

  it('should delete pet successfully', () => {
    const pet: Pet = {id: 1, name: 'Leo', birthDate: '', type: null, owner: null, ownerId: 1, visits: []};
    mockPetService.deletePet.and.returnValue(of(0));
    component.deletePet(pet);
    expect(component.deleteSuccess).toBe(true);
  });

  it('should handle delete error', () => {
    const pet: Pet = {id: 1, name: 'Leo', birthDate: '', type: null, owner: null, ownerId: 1, visits: []};
    mockPetService.deletePet.and.returnValue(throwError('delete error'));
    component.deletePet(pet);
    expect(component.errorMessage).toBe('delete error');
  });

  it('should navigate to add visit', () => {
    const pet: Pet = {id: 1, name: 'Leo', birthDate: '', type: null, owner: null, ownerId: 1, visits: []};
    component.addVisit(pet);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pets', 1, 'visits', 'add']);
  });
});
