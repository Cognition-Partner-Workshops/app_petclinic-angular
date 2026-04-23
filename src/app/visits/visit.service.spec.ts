import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpResponse } from '@angular/common/http';
import { Type } from '@angular/core';

import { VisitService } from './visit.service';
import { Visit } from './visit';
import { HttpErrorHandler } from '../error.service';
import { environment } from '../../environments/environment';

describe('VisitService', () => {
  let httpTestingController: HttpTestingController;
  let visitService: VisitService;
  const entityUrl = environment.REST_API_URL + 'visits';

  const testVisit: Visit = {
    id: 1,
    date: '2016-09-07',
    description: 'rabies shot',
    pet: {
      id: 1,
      name: 'Leo',
      birthDate: '2010-09-07',
      type: { id: 1, name: 'cat' },
      ownerId: 1,
      owner: null,
      visits: null,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService, HttpErrorHandler],
    });
    httpTestingController = TestBed.inject<HttpTestingController>(
      HttpTestingController as Type<HttpTestingController>
    );
    visitService = TestBed.inject(VisitService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return expected visits (getVisits)', () => {
    const expectedVisits: Visit[] = [testVisit];

    visitService.getVisits().subscribe(
      (visits) => expect(visits).toEqual(expectedVisits),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(expectedVisits);
  });

  it('should return a visit by id (getVisitById)', () => {
    visitService.getVisitById('1').subscribe(
      (visit) => expect(visit).toEqual(testVisit),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('GET');
    req.flush(testVisit);
  });

  it('should add a visit under the correct owner/pet URL (addVisit)', () => {
    const newVisit: Visit = { ...testVisit, id: null };
    const visitsUrl = environment.REST_API_URL + 'owners/1/pets/1/visits';

    visitService.addVisit(newVisit).subscribe(
      (visit) => expect(visit).toEqual(newVisit),
      fail
    );

    const req = httpTestingController.expectOne(visitsUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(newVisit);
    const expectedResponse = new HttpResponse({
      status: 201,
      statusText: 'Created',
      body: newVisit,
    });
    req.event(expectedResponse);
  });

  it('should update a visit (updateVisit)', () => {
    const updatedVisit: Visit = { ...testVisit, description: 'updated desc' };

    visitService.updateVisit('1', updatedVisit).subscribe(
      (visit) => expect(visit).toEqual(updatedVisit),
      fail
    );

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updatedVisit);
    const expectedResponse = new HttpResponse({
      status: 204,
      statusText: 'No Content',
      body: updatedVisit,
    });
    req.event(expectedResponse);
  });

  it('should delete a visit (deleteVisit)', () => {
    visitService.deleteVisit('1').subscribe();

    const req = httpTestingController.expectOne(entityUrl + '/1');
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.body).toEqual(null);
    req.flush(null);
  });
});
