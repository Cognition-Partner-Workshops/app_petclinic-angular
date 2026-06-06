import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VetService } from './vet.service';
import { HttpErrorHandler } from '../error.service';
import { Vet } from './vet';
import { environment } from '../../environments/environment';

describe('VetService', () => {
  let service: VetService;
  let httpMock: HttpTestingController;
  const entityUrl = environment.REST_API_URL + 'vets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VetService, HttpErrorHandler]
    });
    service = TestBed.inject(VetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return vets on getVets', () => {
    const mockVets: Vet[] = [
      { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] },
      { id: 2, firstName: 'Helen', lastName: 'Leary', specialties: [] }
    ];
    service.getVets().subscribe(vets => {
      expect(vets).toEqual(mockVets);
      expect(vets.length).toBe(2);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockVets);
  });

  it('should return a vet by id on getVetById', () => {
    const mockVet: Vet = { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] };
    service.getVetById('1').subscribe(vet => {
      expect(vet).toEqual(mockVet);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockVet);
  });

  it('should update a vet on updateVet', () => {
    const mockVet: Vet = { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] };
    service.updateVet('1', mockVet).subscribe(vet => {
      expect(vet).toEqual(mockVet);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockVet);
    req.flush(mockVet);
  });

  it('should add a vet on addVet', () => {
    const mockVet: Vet = { id: null, firstName: 'New', lastName: 'Vet', specialties: [] };
    const returnVet: Vet = { id: 3, firstName: 'New', lastName: 'Vet', specialties: [] };
    service.addVet(mockVet).subscribe(vet => {
      expect(vet).toEqual(returnVet);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockVet);
    req.flush(returnVet);
  });

  it('should delete a vet on deleteVet', () => {
    service.deleteVet('1').subscribe(response => {
      expect(response).toBe(204);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(204);
  });
});
