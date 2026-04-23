import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';

import { PetService } from './pet.service';
import { Pet } from './pet';
import { HttpErrorHandler } from '../error.service';
import { environment } from '../../environments/environment';

describe('PetService', () => {
  let httpTestingController: HttpTestingController;
  let petService: PetService;
  const entityUrl = environment.REST_API_URL + 'pets';

  const testPet: Pet = {
    id: 1,
    name: 'Leo',
    birthDate: '2010-09-07',
    type: { id: 1, name: 'cat' },
    ownerId: 1,
    owner: {
      id: 1,
      firstName: 'George',
      lastName: 'Franklin',
      address: '110 W. Liberty St.',
      city: 'Madison',
      telephone: '6085551023',
      pets: [],
    },
    visits: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService, HttpErrorHandler],
    });
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    petService = TestBed.inject(PetService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return expected pets (getPets)', () => {
    const expectedPets: Pet[] = [testPet];

    petService.getPets().subscribe(
      (pets) => expect(pets).toEqual(expectedPets),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedPets);
  });

  it('should return a pet by id (getPetById)', () => {
    petService.getPetById(1).subscribe(
      (pet) => expect(pet).toEqual(testPet),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testPet);
  });

  it('should add a pet under the correct owner URL (addPet)', () => {
    const newPet: Pet = { ...testPet, id: null };
    const ownersUrl = environment.REST_API_URL + 'owners/1/pets';

    petService.addPet(newPet).subscribe(
      (pet) => expect(pet).toEqual(newPet),
      fail
    );

    const req = httpTestingController.expectOne(ownersUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newPet);
    const expectedResponse = new HttpResponse({
      status: 201,
      statusText: 'Created',
      body: newPet,
    });
    req.event(expectedResponse);
  });

  it('should update a pet (updatePet)', () => {
    const updatedPet: Pet = { ...testPet, name: 'Leopold' };

    petService.updatePet('1', updatedPet).subscribe(
      (pet) => expect(pet).toEqual(updatedPet),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedPet);
    const expectedResponse = new HttpResponse({
      status: 204,
      statusText: 'No Content',
      body: updatedPet,
    });
    req.event(expectedResponse);
  });

  it('should delete a pet (deletePet)', () => {
    petService.deletePet('1').subscribe();

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);
    req.flush(null);
  });
});
