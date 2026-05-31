import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VetEditComponent} from './vet-edit.component';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {VetService} from '../vet.service';
import {SpecialtyService} from '../../specialties/specialty.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Vet} from '../vet';
import {MatSelectModule} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('VetEditComponent', () => {
  let component: VetEditComponent;
  let fixture: ComponentFixture<VetEditComponent>;
  let mockVetService: jasmine.SpyObj<VetService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockVet: Vet = {id: 1, firstName: 'James', lastName: 'Carter', specialties: [{id: 1, name: 'radiology'}]};
  const mockSpecs = [{id: 1, name: 'radiology'}, {id: 2, name: 'surgery'}];

  beforeEach(waitForAsync(() => {
    mockVetService = jasmine.createSpyObj('VetService', ['updateVet']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [VetEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, ReactiveFormsModule, MatSelectModule, NoopAnimationsModule],
      providers: [
        {provide: VetService, useValue: mockVetService},
        {provide: SpecialtyService, useValue: {}},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {data: {vet: mockVet, specs: mockSpecs}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with vet data', () => {
    expect(component.firstNameCtrl.value).toBe('James');
    expect(component.lastNameCtrl.value).toBe('Carter');
    expect(component.specList.length).toBe(2);
  });

  it('should submit updated vet', () => {
    mockVetService.updateVet.and.returnValue(of(mockVet));
    component.onSubmit(mockVet);
    expect(mockVetService.updateVet).toHaveBeenCalledWith('1', mockVet);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets']);
  });

  it('should handle submit error', () => {
    mockVetService.updateVet.and.returnValue(throwError('update error'));
    component.onSubmit(mockVet);
    expect(component.errorMessage).toBe('update error');
  });

  it('should compare specialties correctly', () => {
    expect(component.compareSpecFn({id: 1, name: 'a'}, {id: 1, name: 'b'})).toBe(true);
    expect(component.compareSpecFn({id: 1, name: 'a'}, {id: 2, name: 'a'})).toBe(false);
    expect(component.compareSpecFn(null, null)).toBe(true);
  });

  it('should navigate to vet list', () => {
    component.gotoVetList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets']);
  });
});
