import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {VetService} from './vet.service';
import {HttpErrorHandler} from '../error.service';
import {Vet} from './vet';
import {environment} from '../../environments/environment';

describe('VetService', () => {
  let service: VetService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.REST_API_URL + 'vets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VetService, HttpErrorHandler]
    });
    service = TestBed.inject(VetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all vets', () => {
    const mock: Vet[] = [{id: 1, firstName: 'James', lastName: 'Carter', specialties: []}];
    service.getVets().subscribe(vets => expect(vets).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should get vet by id', () => {
    const mock: Vet = {id: 1, firstName: 'James', lastName: 'Carter', specialties: []};
    service.getVetById('1').subscribe(vet => expect(vet).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should add a vet', () => {
    const mock: Vet = {id: null, firstName: 'New', lastName: 'Vet', specialties: []};
    service.addVet(mock).subscribe(vet => expect(vet).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  it('should update a vet', () => {
    const mock: Vet = {id: 1, firstName: 'Updated', lastName: 'Vet', specialties: []};
    service.updateVet('1', mock).subscribe(vet => expect(vet).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('should delete a vet', () => {
    service.deleteVet('1').subscribe(result => expect(result).toBe(0));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(0);
  });

  it('should handle error on getVets', () => {
    service.getVets().subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
    const req = httpMock.expectOne(baseUrl);
    req.flush('error', {status: 500, statusText: 'Server Error'});
  });
});
