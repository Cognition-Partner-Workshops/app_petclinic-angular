import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VetEditComponent } from './vet-edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { VetService } from '../vet.service';
import { SpecialtyService } from '../../specialties/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterStub } from '../../testing/router-stubs';
import { Vet } from '../vet';
import { Specialty } from '../../specialties/specialty';
import { Observable, of, throwError } from 'rxjs';

class VetServiceStub {
  updateVet(vetId: string, vet: Vet): Observable<Vet> {
    return of(vet);
  }
}

class SpecialtyServiceStub {
  getSpecialties(): Observable<Specialty[]> {
    return of([{ id: 1, name: 'radiology' }, { id: 2, name: 'surgery' }]);
  }
}

const mockVet: Vet = { id: 1, firstName: 'James', lastName: 'Carter', specialties: [{ id: 1, name: 'radiology' }] };
const mockSpecs: Specialty[] = [{ id: 1, name: 'radiology' }, { id: 2, name: 'surgery' }];

describe('VetEditComponent', () => {
  let component: VetEditComponent;
  let fixture: ComponentFixture<VetEditComponent>;
  let vetService: VetService;
  let router: RouterStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VetEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, MatSelectModule, NoopAnimationsModule],
      providers: [
        { provide: VetService, useClass: VetServiceStub },
        { provide: SpecialtyService, useClass: SpecialtyServiceStub },
        { provide: Router, useClass: RouterStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { id: '1' },
              data: {
                vet: { ...mockVet },
                specs: [...mockSpecs]
              }
            }
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetEditComponent);
    component = fixture.componentInstance;
    vetService = fixture.debugElement.injector.get(VetService);
    router = fixture.debugElement.injector.get(Router) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vet data and specialties on init', () => {
    expect(component.vet.firstName).toBe('James');
    expect(component.specList.length).toBe(2);
  });

  it('should initialize form values from vet', () => {
    expect(component.firstNameCtrl.value).toBe('James');
    expect(component.lastNameCtrl.value).toBe('Carter');
  });

  it('should compare specialties correctly', () => {
    const spec1: Specialty = { id: 1, name: 'radiology' };
    const spec2: Specialty = { id: 1, name: 'radiology' };
    const spec3: Specialty = { id: 2, name: 'surgery' };
    expect(component.compareSpecFn(spec1, spec2)).toBe(true);
    expect(component.compareSpecFn(spec1, spec3)).toBe(false);
    expect(component.compareSpecFn(null, null)).toBe(true);
    expect(component.compareSpecFn(null, spec1)).toBe(false);
  });

  it('should submit vet and navigate to vet list', () => {
    spyOn(router, 'navigate');
    spyOn(vetService, 'updateVet').and.returnValue(of(mockVet));
    component.onSubmit(mockVet);
    expect(router.navigate).toHaveBeenCalledWith(['/vets']);
  });

  it('should set errorMessage on submit error', () => {
    spyOn(vetService, 'updateVet').and.returnValue(throwError('update error'));
    component.onSubmit(mockVet);
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate to vet list on gotoVetList', () => {
    spyOn(router, 'navigate');
    component.gotoVetList();
    expect(router.navigate).toHaveBeenCalledWith(['/vets']);
  });
});
