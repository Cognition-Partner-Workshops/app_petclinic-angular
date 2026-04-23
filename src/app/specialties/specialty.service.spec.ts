import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';

import { SpecialtyService } from './specialty.service';
import { Specialty } from './specialty';
import { HttpErrorHandler } from '../error.service';
import { environment } from '../../environments/environment';

describe('SpecialtyService', () => {
  let httpTestingController: HttpTestingController;
  let specialtyService: SpecialtyService;
  const entityUrl = environment.REST_API_URL + 'specialties';

  const testSpecialty: Specialty = {
    id: 1,
    name: 'radiology',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecialtyService, HttpErrorHandler],
    });
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    specialtyService = TestBed.inject(SpecialtyService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return expected specialties (getSpecialties)', () => {
    const expectedSpecialties: Specialty[] = [testSpecialty];

    specialtyService.getSpecialties().subscribe(
      (specialties) => expect(specialties).toEqual(expectedSpecialties),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedSpecialties);
  });

  it('should return a specialty by id (getSpecialtyById)', () => {
    specialtyService.getSpecialtyById('1').subscribe(
      (specialty) => expect(specialty).toEqual(testSpecialty),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testSpecialty);
  });

  it('should add a specialty (addSpecialty)', () => {
    const newSpecialty: Specialty = { ...testSpecialty, id: null };

    specialtyService.addSpecialty(newSpecialty).subscribe(
      (specialty) => expect(specialty).toEqual(newSpecialty),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newSpecialty);
    const expectedResponse = new HttpResponse({
      status: 201,
      statusText: 'Created',
      body: newSpecialty,
    });
    req.event(expectedResponse);
  });

  it('should update a specialty (updateSpecialty)', () => {
    const updatedSpecialty: Specialty = { ...testSpecialty, name: 'surgery' };

    specialtyService.updateSpecialty('1', updatedSpecialty).subscribe(
      (specialty) => expect(specialty).toEqual(updatedSpecialty),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedSpecialty);
    const expectedResponse = new HttpResponse({
      status: 204,
      statusText: 'No Content',
      body: updatedSpecialty,
    });
    req.event(expectedResponse);
  });

  it('should delete a specialty (deleteSpecialty)', () => {
    specialtyService.deleteSpecialty('1').subscribe();

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);
    req.flush(null);
  });
});
