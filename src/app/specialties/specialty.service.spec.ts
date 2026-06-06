import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SpecialtyService } from './specialty.service';
import { HttpErrorHandler } from '../error.service';
import { Specialty } from './specialty';
import { environment } from '../../environments/environment';

describe('SpecialtyService', () => {
  let service: SpecialtyService;
  let httpMock: HttpTestingController;
  const entityUrl = environment.REST_API_URL + 'specialties';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecialtyService, HttpErrorHandler]
    });
    service = TestBed.inject(SpecialtyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return specialties on getSpecialties', () => {
    const mockSpecialties: Specialty[] = [
      { id: 1, name: 'radiology' },
      { id: 2, name: 'surgery' }
    ];
    service.getSpecialties().subscribe(specialties => {
      expect(specialties.length).toBe(2);
      expect(specialties).toEqual(mockSpecialties);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecialties);
  });

  it('should return a specialty by id on getSpecialtyById', () => {
    const mockSpecialty: Specialty = { id: 1, name: 'radiology' };
    service.getSpecialtyById('1').subscribe(specialty => {
      expect(specialty).toEqual(mockSpecialty);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockSpecialty);
  });

  it('should add a specialty on addSpecialty', () => {
    const mockSpecialty: Specialty = { id: null, name: 'dentistry' };
    const returnSpecialty: Specialty = { id: 3, name: 'dentistry' };
    service.addSpecialty(mockSpecialty).subscribe(specialty => {
      expect(specialty).toEqual(returnSpecialty);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('POST');
    req.flush(returnSpecialty);
  });

  it('should update a specialty on updateSpecialty', () => {
    const mockSpecialty: Specialty = { id: 1, name: 'radiology updated' };
    service.updateSpecialty('1', mockSpecialty).subscribe(specialty => {
      expect(specialty).toEqual(mockSpecialty);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockSpecialty);
  });

  it('should delete a specialty on deleteSpecialty', () => {
    service.deleteSpecialty('1').subscribe(response => {
      expect(response).toBe(204);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(204);
  });
});
