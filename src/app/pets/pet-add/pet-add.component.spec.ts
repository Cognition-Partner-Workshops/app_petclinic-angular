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

import {PetAddComponent} from './pet-add.component';
import {FormsModule} from '@angular/forms';
import {PetService} from '../pet.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {Observable, of, throwError} from 'rxjs';
import {Pet} from '../pet';
import {OwnerService} from '../../owners/owner.service';
import {PetTypeService} from '../../pettypes/pettype.service';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {Owner} from '../../owners/owner';
import {PetType} from '../../pettypes/pettype';
import Spy = jasmine.Spy;

class OwnerServiceStub {
  getOwnerById(): Observable<Owner> {
    return of();
  }
}

class PetServiceStub {
  getPetById(petId: string): Observable<Pet> {
    return of();
  }
  addPet(pet: Pet): Observable<Pet> {
    return of();
  }
}

class PetTypeServiceStub {
  getPetTypes(): Observable<PetType[]> {
    return of();
  }
}

describe('PetAddComponent', () => {
  let component: PetAddComponent;
  let fixture: ComponentFixture<PetAddComponent>;
  let petService: PetService;
  let testPet: Pet;
  let spy: Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PetAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule, MatDatepickerModule, MatMomentDateModule],
      providers: [
        {provide: PetService, useClass: PetServiceStub},
        {provide: OwnerService, useClass: OwnerServiceStub},
        {provide: PetTypeService, useClass: PetTypeServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetAddComponent);
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
    spy = spyOn(petService, 'getPetById')
      .and.returnValue(of(testPet));

    fixture.detectChanges();
  });

  it('should create PetAddComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet types on init', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    const mockPetTypes: PetType[] = [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' }];
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of(mockPetTypes));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    component.ngOnInit();
    expect(component.petTypes).toEqual(mockPetTypes);
  });

  it('should load current owner on init', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of([]));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    component.ngOnInit();
    expect(component.currentOwner).toEqual(testPet.owner);
  });

  it('should set errorMessage on getPetTypes error', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    spyOn(petTypeService, 'getPetTypes').and.returnValue(throwError('type error'));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    component.ngOnInit();
    expect(component.errorMessage).toBe('type error');
  });

  it('should set errorMessage on getOwnerById error', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of([]));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(throwError('owner error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('owner error');
  });

  it('should submit pet and navigate to owner detail', () => {
    const petServiceLocal = fixture.debugElement.injector.get(PetService);
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.currentOwner = testPet.owner;
    spyOn(petServiceLocal, 'addPet').and.returnValue(of(testPet));
    component.onSubmit({ ...testPet, birthDate: '2010-09-07' });
    expect(component.addedSuccess).toBe(true);
    expect(router.navigate).toHaveBeenCalledWith(['/owners', testPet.owner.id]);
  });

  it('should set errorMessage on submit error', () => {
    const petServiceLocal = fixture.debugElement.injector.get(PetService);
    component.currentOwner = testPet.owner;
    spyOn(petServiceLocal, 'addPet').and.returnValue(throwError('submit error'));
    component.onSubmit({ ...testPet, birthDate: '2010-09-07' });
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to owner detail on gotoOwnerDetail', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.currentOwner = { id: 5 } as Owner;
    component.gotoOwnerDetail();
    expect(router.navigate).toHaveBeenCalledWith(['/owners', 5]);
  });
});
