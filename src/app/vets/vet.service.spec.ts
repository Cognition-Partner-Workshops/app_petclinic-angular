import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';

import { VetService } from './vet.service';
import { Vet } from './vet';
import { HttpErrorHandler } from '../error.service';
import { environment } from '../../environments/environment';

describe('VetService', () => {
  let httpTestingController: HttpTestingController;
  let vetService: VetService;
  const entityUrl = environment.REST_API_URL + 'vets';

  const testVet: Vet = {
    id: 1,
    firstName: 'James',
    lastName: 'Carter',
    specialties: [{ id: 1, name: 'radiology' }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VetService, HttpErrorHandler],
    });
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    vetService = TestBed.inject(VetService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return expected vets (getVets)', () => {
    const expectedVets: Vet[] = [testVet];

    vetService.getVets().subscribe(
      (vets) => expect(vets).toEqual(expectedVets),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedVets);
  });

  it('should return a vet by id (getVetById)', () => {
    vetService.getVetById('1').subscribe(
      (vet) => expect(vet).toEqual(testVet),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testVet);
  });

  it('should add a vet (addVet)', () => {
    const newVet: Vet = { ...testVet, id: null };

    vetService.addVet(newVet).subscribe(
      (vet) => expect(vet).toEqual(newVet),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newVet);
    const expectedResponse = new HttpResponse({
      status: 201,
      statusText: 'Created',
      body: newVet,
    });
    req.event(expectedResponse);
  });

  it('should update a vet (updateVet)', () => {
    const updatedVet: Vet = { ...testVet, firstName: 'Jim' };

    vetService.updateVet('1', updatedVet).subscribe(
      (vet) => expect(vet).toEqual(updatedVet),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedVet);
    const expectedResponse = new HttpResponse({
      status: 204,
      statusText: 'No Content',
      body: updatedVet,
    });
    req.event(expectedResponse);
  });

  it('should delete a vet (deleteVet)', () => {
    vetService.deleteVet('1').subscribe();

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);
    req.flush(null);
  });
});
