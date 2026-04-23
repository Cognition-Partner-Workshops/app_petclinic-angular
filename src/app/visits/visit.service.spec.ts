import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VisitService } from './visit.service';
import { HttpErrorHandler } from '../error.service';
import { Visit } from './visit';
import { environment } from '../../environments/environment';

describe('VisitService', () => {
  let service: VisitService;
  let httpMock: HttpTestingController;
  const entityUrl = environment.REST_API_URL + 'visits';

  const mockPet = { id: 1, name: 'Leo', birthDate: '2010-09-07', type: { id: 1, name: 'cat' }, owner: { id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: [] }, ownerId: 1, visits: [] };
  const mockVisit: Visit = { id: 1, date: '2020-01-01', description: 'Checkup', pet: mockPet };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VisitService, HttpErrorHandler]
    });
    service = TestBed.inject(VisitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return visits on getVisits', () => {
    service.getVisits().subscribe(visits => {
      expect(visits.length).toBe(1);
      expect(visits[0].description).toBe('Checkup');
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockVisit]);
  });

  it('should return a visit by id on getVisitById', () => {
    service.getVisitById('1').subscribe(visit => {
      expect(visit).toEqual(mockVisit);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockVisit);
  });

  it('should add a visit on addVisit', () => {
    service.addVisit(mockVisit).subscribe(visit => {
      expect(visit).toEqual(mockVisit);
    });
    const expectedUrl = environment.REST_API_URL + 'owners/1/pets/1/visits';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockVisit);
  });

  it('should update a visit on updateVisit', () => {
    service.updateVisit('1', mockVisit).subscribe(visit => {
      expect(visit).toEqual(mockVisit);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockVisit);
  });

  it('should delete a visit on deleteVisit', () => {
    service.deleteVisit('1').subscribe(response => {
      expect(response).toBe(204);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(204);
  });
});
