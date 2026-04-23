import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';

import { PetTypeService } from './pettype.service';
import { PetType } from './pettype';
import { HttpErrorHandler } from '../error.service';
import { environment } from '../../environments/environment';

describe('PetTypeService', () => {
  let httpTestingController: HttpTestingController;
  let petTypeService: PetTypeService;
  const entityUrl = environment.REST_API_URL + 'pettypes';

  const testPetType: PetType = {
    id: 1,
    name: 'cat',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetTypeService, HttpErrorHandler],
    });
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    petTypeService = TestBed.inject(PetTypeService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return expected pet types (getPetTypes)', () => {
    const expectedPetTypes: PetType[] = [testPetType];

    petTypeService.getPetTypes().subscribe(
      (petTypes) => expect(petTypes).toEqual(expectedPetTypes),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedPetTypes);
  });

  it('should return a pet type by id (getPetTypeById)', () => {
    petTypeService.getPetTypeById('1').subscribe(
      (petType) => expect(petType).toEqual(testPetType),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testPetType);
  });

  it('should add a pet type (addPetType)', () => {
    const newPetType: PetType = { ...testPetType, id: null };

    petTypeService.addPetType(newPetType).subscribe(
      (petType) => expect(petType).toEqual(newPetType),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newPetType);
    const expectedResponse = new HttpResponse({
      status: 201,
      statusText: 'Created',
      body: newPetType,
    });
    req.event(expectedResponse);
  });

  it('should update a pet type (updatePetType)', () => {
    const updatedPetType: PetType = { ...testPetType, name: 'dog' };

    petTypeService.updatePetType('1', updatedPetType).subscribe(
      (petType) => expect(petType).toEqual(updatedPetType),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedPetType);
    const expectedResponse = new HttpResponse({
      status: 204,
      statusText: 'No Content',
      body: updatedPetType,
    });
    req.event(expectedResponse);
  });

  it('should delete a pet type (deletePetType)', () => {
    petTypeService.deletePetType('1').subscribe();

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);
    req.flush(null);
  });
});
