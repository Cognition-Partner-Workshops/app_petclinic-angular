/*
 *
 *  * Copyright 2016-2017 the original author or authors.
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

import {VisitAddComponent} from './visit-add.component';
import {FormsModule} from '@angular/forms';
import {VisitService} from '../visit.service';
import {PetService} from '../../pets/pet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {Pet} from '../../pets/pet';
import {Observable, of, throwError} from 'rxjs';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import Spy = jasmine.Spy;
import {OwnerService} from '../../owners/owner.service';

class PetServiceStub {
  addPet(pet: Pet): Observable<Pet> {
    return of();
  }
  getPetById(petId: string): Observable<Pet> {
    return of();
  }
}

class OwnerServiceStub {
  getOwnerById(ownerId: string): Observable<any> {
    return of();
  }
}

class VisitServiceStub {
  addVisit(visit: any): Observable<any> {
    return of();
  }
}

describe('VisitAddComponent', () => {
  let component: VisitAddComponent;
  let fixture: ComponentFixture<VisitAddComponent>;
  let petService: PetService;
  let visitService: VisitService;
  let testPet: Pet;
  let spy: Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VisitAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: PetService, useClass: PetServiceStub},
        {provide: VisitService, useClass: VisitServiceStub},
        {provide: OwnerService, useClass: OwnerServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitAddComponent);
    component = fixture.componentInstance;
    testPet = {
      id: 1,
      name: 'Leo',
      birthDate: '2010-09-07',
      type: {id: 1, name: 'cat'},
      ownerId: 1,
      owner: {
        id: 1,
        firstName: 'George',
        lastName: 'Franklin',
        address: '110 W. Liberty St.',
        city: 'Madison',
        telephone: '6085551023',
        pets: null
      },
      visits: null
    };
    petService = fixture.debugElement.injector.get(PetService);
    visitService = fixture.debugElement.injector.get(VisitService);
    spy = spyOn(petService, 'addPet')
      .and.returnValue(of(testPet));

    fixture.detectChanges();
  });

  it('should create VisitAddComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet and owner on init', () => {
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    spyOn(petService, 'getPetById').and.returnValue(of(testPet));
    component.ngOnInit();
    expect(component.currentPet).toEqual(testPet);
    expect(component.currentOwner).toEqual(testPet.owner);
    expect(component.currentPetType).toEqual(testPet.type);
  });

  it('should set errorMessage on getPetById error', () => {
    spyOn(petService, 'getPetById').and.returnValue(throwError('pet error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('pet error');
  });

  it('should submit visit and navigate to owner detail', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.currentOwner = testPet.owner;
    spyOn(visitService, 'addVisit').and.returnValue(of({ id: 1, date: '2016-09-07', description: 'test', pet: testPet }));
    component.onSubmit({ id: null, date: '2016-09-07', description: 'test', pet: testPet });
    expect(component.addedSuccess).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/owners', testPet.owner.id]);
  });

  it('should set errorMessage on submit error', () => {
    component.currentOwner = testPet.owner;
    spyOn(visitService, 'addVisit').and.returnValue(throwError('submit error'));
    component.onSubmit({ id: null, date: '2016-09-07', description: 'test', pet: testPet });
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to owner detail on gotoOwnerDetail', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.currentOwner = { id: 5 } as any;
    component.gotoOwnerDetail();
    expect(router.navigate).toHaveBeenCalledWith(['/owners', 5]);
  });
});
