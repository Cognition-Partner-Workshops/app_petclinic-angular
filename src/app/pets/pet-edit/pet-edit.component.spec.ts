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

import {PetEditComponent} from './pet-edit.component';
import {FormsModule} from '@angular/forms';
import {PetService} from '../pet.service';
import {OwnerService} from '../../owners/owner.service';
import {PetTypeService} from '../../pettypes/pettype.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {Pet} from '../pet';
import {Observable, of, throwError} from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {PetType} from '../../pettypes/pettype';
import Spy = jasmine.Spy;

class OwnerServiceStub {
  getOwnerById(ownerId: string): Observable<any> {
    return of();
  }
}

class PetServiceStub {
  updatePet(petId: string, pet: Pet): Observable<Pet> {
    return of();
  }
  getPetById(petId: string): Observable<Pet> {
    return of();
  }
}

class PetTypeServiceStub {
  getPetTypes(): Observable<PetType[]> {
    return of();
  }
}

describe('PetEditComponent', () => {
  let component: PetEditComponent;
  let fixture: ComponentFixture<PetEditComponent>;
  let petService: PetService;
  let testPet: Pet;
  let spy: Spy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PetEditComponent],
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
    fixture = TestBed.createComponent(PetEditComponent);
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
    spy = spyOn(petService, 'updatePet')
      .and.returnValue(of(testPet));

    fixture.detectChanges();
  });

  it('should create PetEditComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet types on init', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    const mockPetTypes: PetType[] = [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' }];
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of(mockPetTypes));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    spyOn(petService, 'getPetById').and.returnValue(of(testPet));
    component.ngOnInit();
    expect(component.petTypes).toEqual(mockPetTypes);
  });

  it('should load pet and owner on init', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of([]));
    const ownerService = fixture.debugElement.injector.get(OwnerService);
    spyOn(ownerService, 'getOwnerById').and.returnValue(of(testPet.owner));
    spyOn(petService, 'getPetById').and.returnValue(of(testPet));
    component.ngOnInit();
    expect(component.pet).toEqual(testPet);
    expect(component.currentOwner).toEqual(testPet.owner);
    expect(component.currentType).toEqual(testPet.type);
  });

  it('should set errorMessage on getPetById error', () => {
    const petTypeService = fixture.debugElement.injector.get(PetTypeService);
    spyOn(petTypeService, 'getPetTypes').and.returnValue(of([]));
    spyOn(petService, 'getPetById').and.returnValue(throwError('pet error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('pet error');
  });

  it('should submit pet and navigate to owner detail', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.currentType = testPet.type;
    component.currentOwner = testPet.owner;
    spy.and.returnValue(of(testPet));
    component.onSubmit({ ...testPet, birthDate: '2010-09-07' });
    expect(router.navigate).toHaveBeenCalledWith(['/owners', testPet.owner.id]);
  });

  it('should set errorMessage on submit error', () => {
    component.currentType = testPet.type;
    spy.and.returnValue(throwError('update error'));
    component.onSubmit({ ...testPet, birthDate: '2010-09-07' });
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate to owner detail on gotoOwnerDetail', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.gotoOwnerDetail(testPet.owner);
    expect(router.navigate).toHaveBeenCalledWith(['/owners', testPet.owner.id]);
  });
});
