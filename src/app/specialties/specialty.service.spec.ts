import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {SpecialtyService} from './specialty.service';
import {HttpErrorHandler} from '../error.service';
import {Specialty} from './specialty';
import {environment} from '../../environments/environment';

describe('SpecialtyService', () => {
  let service: SpecialtyService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.REST_API_URL + 'specialties';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecialtyService, HttpErrorHandler]
    });
    service = TestBed.inject(SpecialtyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all specialties', () => {
    const mock: Specialty[] = [{id: 1, name: 'radiology'}];
    service.getSpecialties().subscribe(s => expect(s).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should get specialty by id', () => {
    const mock: Specialty = {id: 1, name: 'radiology'};
    service.getSpecialtyById('1').subscribe(s => expect(s).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should add a specialty', () => {
    const mock: Specialty = {id: null, name: 'surgery'};
    service.addSpecialty(mock).subscribe(s => expect(s).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  it('should update a specialty', () => {
    const mock: Specialty = {id: 1, name: 'updated'};
    service.updateSpecialty('1', mock).subscribe(s => expect(s).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('should delete a specialty', () => {
    service.deleteSpecialty('1').subscribe(r => expect(r).toBe(0));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(0);
  });

  it('should handle error on getSpecialties', () => {
    service.getSpecialties().subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
    const req = httpMock.expectOne(baseUrl);
    req.flush('error', {status: 500, statusText: 'Server Error'});
  });
});
