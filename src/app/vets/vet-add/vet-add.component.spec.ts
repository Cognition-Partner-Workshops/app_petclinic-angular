import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VetAddComponent } from './vet-add.component';
import { FormsModule } from '@angular/forms';
import { VetService } from '../vet.service';
import { SpecialtyService } from '../../specialties/specialty.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, RouterStub } from '../../testing/router-stubs';
import { Vet } from '../vet';
import { Specialty } from '../../specialties/specialty';
import { Observable, of, throwError } from 'rxjs';

class VetServiceStub {
  addVet(vet: Vet): Observable<Vet> {
    return of(vet);
  }
}

class SpecialtyServiceStub {
  getSpecialties(): Observable<Specialty[]> {
    return of([{ id: 1, name: 'radiology' }, { id: 2, name: 'surgery' }]);
  }
}

describe('VetAddComponent', () => {
  let component: VetAddComponent;
  let fixture: ComponentFixture<VetAddComponent>;
  let vetService: VetService;
  let router: RouterStub;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VetAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        { provide: VetService, useClass: VetServiceStub },
        { provide: SpecialtyService, useClass: SpecialtyServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetAddComponent);
    component = fixture.componentInstance;
    vetService = fixture.debugElement.injector.get(VetService);
    router = fixture.debugElement.injector.get(Router) as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load specialties on init', () => {
    expect(component.specialtiesList.length).toBe(2);
  });

  it('should set errorMessage on ngOnInit error', () => {
    const specialtyService = fixture.debugElement.injector.get(SpecialtyService);
    spyOn(specialtyService, 'getSpecialties').and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit vet with selected specialty', () => {
    spyOn(router, 'navigate');
    const returnVet: Vet = { id: 3, firstName: 'New', lastName: 'Vet', specialties: [{ id: 1, name: 'radiology' }] };
    spyOn(vetService, 'addVet').and.returnValue(of(returnVet));
    component.selectedSpecialty = { id: 1, name: 'radiology' };
    component.onSubmit({ id: null, firstName: 'New', lastName: 'Vet', specialties: [] });
    expect(component.vet).toEqual(returnVet);
    expect(router.navigate).toHaveBeenCalledWith(['/vets']);
  });

  it('should submit vet without specialty when none selected', () => {
    spyOn(router, 'navigate');
    const returnVet: Vet = { id: 3, firstName: 'New', lastName: 'Vet', specialties: [] };
    spyOn(vetService, 'addVet').and.returnValue(of(returnVet));
    component.selectedSpecialty = {} as Specialty;
    component.onSubmit({ id: null, firstName: 'New', lastName: 'Vet', specialties: [] });
    expect(router.navigate).toHaveBeenCalledWith(['/vets']);
  });

  it('should set errorMessage on submit error', () => {
    spyOn(vetService, 'addVet').and.returnValue(throwError('submit error'));
    component.selectedSpecialty = {} as Specialty;
    component.onSubmit({ id: null, firstName: 'New', lastName: 'Vet', specialties: [] });
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to vet list on gotoVetList', () => {
    spyOn(router, 'navigate');
    component.gotoVetList();
    expect(router.navigate).toHaveBeenCalledWith(['/vets']);
  });
});
