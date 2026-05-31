import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {VisitService} from './visit.service';
import {HttpErrorHandler} from '../error.service';
import {Visit} from './visit';
import {environment} from '../../environments/environment';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.REST_API_URL + 'visits';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService, HttpErrorHandler]
    });
    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all visits', () => {
    const mockVisits: Visit[] = [{id: 1, date: '2020-01-01', description: 'checkup', pet: {id: 1, name: 'Leo', birthDate: '', type: null, owner: null, ownerId: 1, visits: []}}];
    service.getVisits().subscribe(visits => expect(visits).toEqual(mockVisits));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVisits);
  });

  it('should get visit by id', () => {
    const mockVisit: Visit = {id: 1, date: '2020-01-01', description: 'checkup', pet: null};
    service.getVisitById('1').subscribe(visit => expect(visit).toEqual(mockVisit));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockVisit);
  });

  it('should add a visit', () => {
    const mockVisit: Visit = {id: null, date: '2020-01-01', description: 'new visit', pet: {id: 2, name: 'Rex', birthDate: '', type: null, owner: null, ownerId: 3, visits: []}};
    service.addVisit(mockVisit).subscribe(visit => expect(visit).toEqual(mockVisit));
    const req = httpMock.expectOne(environment.REST_API_URL + 'owners/3/pets/2/visits');
    expect(req.request.method).toBe('POST');
    req.flush(mockVisit);
  });

  it('should update a visit', () => {
    const mockVisit: Visit = {id: 1, date: '2020-01-01', description: 'updated', pet: null};
    service.updateVisit('1', mockVisit).subscribe(visit => expect(visit).toEqual(mockVisit));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockVisit);
  });

  it('should delete a visit', () => {
    service.deleteVisit('1').subscribe(result => expect(result).toBe(0));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(0);
  });

  it('should handle error on getVisits', () => {
    service.getVisits().subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
    const req = httpMock.expectOne(baseUrl);
    req.flush('error', {status: 500, statusText: 'Server Error'});
  });
});
