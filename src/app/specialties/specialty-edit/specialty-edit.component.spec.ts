/*
 *
 *  * Copyright 2017-2018 the original author or authors.
 *  *
 *  * Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  *      http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  * Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  * limitations under the License.
 *
 */

/* tslint:disable:no-unused-variable */

/**
 * @author Vitaliy Fedoriv
 */

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {Specialty} from '../specialty';
import {SpecialtyEditComponent} from './specialty-edit.component';
import {SpecialtyService} from '../specialty.service';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {Observable, of, throwError} from 'rxjs';
import Spy = jasmine.Spy;

class SpecialityServiceStub {
  getSpecialtyById(specId: string): Observable<Specialty> {
    return of();
  }
  updateSpecialty(specId: string, specialty: Specialty): Observable<Specialty> {
    return of();
  }
}

describe('SpecialtyEditComponent', () => {
  let component: SpecialtyEditComponent;
  let fixture: ComponentFixture<SpecialtyEditComponent>;
  let specialtyService: SpecialtyService;
  let spy: Spy;
  let testSpecialty: Specialty;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialtyEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: SpecialtyService, useClass: SpecialityServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyEditComponent);
    component = fixture.componentInstance;
    testSpecialty = {
      id: 1,
      name: 'test'
    };

    specialtyService = fixture.debugElement.injector.get(SpecialtyService);
    spy = spyOn(specialtyService, 'getSpecialtyById')
      .and.returnValue(of(testSpecialty));

    fixture.detectChanges();
  });

  it('should create SpecialtyEditComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load specialty on init', () => {
    spy.and.returnValue(of(testSpecialty));
    component.ngOnInit();
    expect(component.specialty).toEqual(testSpecialty);
  });

  it('should set errorMessage on getSpecialtyById error', () => {
    spy.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit specialty and navigate back', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    spyOn(specialtyService, 'updateSpecialty').and.returnValue(of(testSpecialty));
    component.onSubmit(testSpecialty);
    expect(router.navigate).toHaveBeenCalledWith(['/specialties']);
  });

  it('should set errorMessage on submit error', () => {
    spyOn(specialtyService, 'updateSpecialty').and.returnValue(throwError('update error'));
    component.onSubmit(testSpecialty);
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate back on onBack', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/specialties']);
  });
});
