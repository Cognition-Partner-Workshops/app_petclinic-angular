import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Specialty } from '../specialty';
import { SpecialtyAddComponent } from './specialty-add.component';
import { SpecialtyService } from '../specialty.service';
import { FormsModule } from '@angular/forms';
import { waitForAsync } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, RouterStub } from '../../testing/router-stubs';
import { Observable, of, throwError } from 'rxjs';
import Spy = jasmine.Spy;

class SpecialityServiceStub {
  addSpecialty(specialty: Specialty): Observable<Specialty> {
    return of();
  }
}

describe('SpecialtyAddComponent', () => {
  let component: SpecialtyAddComponent;
  let fixture: ComponentFixture<SpecialtyAddComponent>;
  let specialtyService: SpecialtyService;
  let spy: Spy;
  let testSpecialty: Specialty;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SpecialtyAddComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [FormsModule],
        providers: [
          { provide: SpecialtyService, useClass: SpecialityServiceStub },
          { provide: Router, useClass: RouterStub },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        ],
      }).compileComponents();
    })
  );
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SpecialtyAddComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        imports: [FormsModule],
        providers: [
          { provide: SpecialtyService, useClass: SpecialityServiceStub },
          { provide: Router, useClass: RouterStub },
          { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyAddComponent);
    component = fixture.componentInstance;
    testSpecialty = {
      id: 1,
      name: 'test',
    };

    specialtyService = fixture.debugElement.injector.get(SpecialtyService);
    spy = spyOn(specialtyService, 'addSpecialty').and.returnValue(
      of(testSpecialty)
    );

    fixture.detectChanges();
  });

  it('should create SpecialtyAddComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should submit specialty and emit newSpeciality event', () => {
    spyOn(component.newSpeciality, 'emit');
    component.onSubmit(testSpecialty);
    expect(component.addedSuccess).toBe(true);
    expect(component.newSpeciality.emit).toHaveBeenCalledWith(testSpecialty);
  });

  it('should set errorMessage on submit error', () => {
    spy.and.returnValue(throwError('submit error'));
    component.onSubmit(testSpecialty);
    expect(component.errorMessage).toBe('submit error');
  });
});
