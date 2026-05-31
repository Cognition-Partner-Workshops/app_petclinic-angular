import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VetAddComponent} from './vet-add.component';
import {FormsModule} from '@angular/forms';
import {VetService} from '../vet.service';
import {SpecialtyService} from '../../specialties/specialty.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Vet} from '../vet';
import {Specialty} from '../../specialties/specialty';

describe('VetAddComponent', () => {
  let component: VetAddComponent;
  let fixture: ComponentFixture<VetAddComponent>;
  let mockVetService: jasmine.SpyObj<VetService>;
  let mockSpecialtyService: jasmine.SpyObj<SpecialtyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockVetService = jasmine.createSpyObj('VetService', ['addVet']);
    mockSpecialtyService = jasmine.createSpyObj('SpecialtyService', ['getSpecialties']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockSpecialtyService.getSpecialties.and.returnValue(of([{id: 1, name: 'radiology'}]));

    TestBed.configureTestingModule({
      declarations: [VetAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: VetService, useValue: mockVetService},
        {provide: SpecialtyService, useValue: mockSpecialtyService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load specialties on init', () => {
    expect(mockSpecialtyService.getSpecialties).toHaveBeenCalled();
    expect(component.specialtiesList.length).toBe(1);
  });

  it('should handle error loading specialties', () => {
    mockSpecialtyService.getSpecialties.and.returnValue(throwError('error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('error');
  });

  it('should submit vet without specialty', () => {
    const newVet: Vet = {id: 1, firstName: 'John', lastName: 'Doe', specialties: []};
    mockVetService.addVet.and.returnValue(of(newVet));
    component.selectedSpecialty = {} as Specialty;
    component.onSubmit({id: null, firstName: 'John', lastName: 'Doe', specialties: []} as Vet);
    expect(mockVetService.addVet).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets']);
  });

  it('should submit vet with specialty', () => {
    const spec: Specialty = {id: 1, name: 'radiology'};
    const newVet: Vet = {id: 1, firstName: 'John', lastName: 'Doe', specialties: [spec]};
    mockVetService.addVet.and.returnValue(of(newVet));
    component.selectedSpecialty = spec;
    component.onSubmit({id: null, firstName: 'John', lastName: 'Doe', specialties: []} as Vet);
    expect(mockVetService.addVet).toHaveBeenCalled();
  });

  it('should handle submit error', () => {
    mockVetService.addVet.and.returnValue(throwError('submit error'));
    component.selectedSpecialty = {} as Specialty;
    component.onSubmit({id: null, firstName: 'John', lastName: 'Doe', specialties: []} as Vet);
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to vet list', () => {
    component.gotoVetList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets']);
  });
});
