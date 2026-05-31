import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PetTypeService} from './pettype.service';
import {HttpErrorHandler} from '../error.service';
import {PetType} from './pettype';
import {environment} from '../../environments/environment';

describe('PetTypeService', () => {
  let service: PetTypeService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.REST_API_URL + 'pettypes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetTypeService, HttpErrorHandler]
    });
    service = TestBed.inject(PetTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all pet types', () => {
    const mock: PetType[] = [{id: 1, name: 'cat'}, {id: 2, name: 'dog'}];
    service.getPetTypes().subscribe(types => expect(types).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should get pet type by id', () => {
    const mock: PetType = {id: 1, name: 'cat'};
    service.getPetTypeById('1').subscribe(t => expect(t).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mock);
  });

  it('should add a pet type', () => {
    const mock: PetType = {id: null, name: 'bird'};
    service.addPetType(mock).subscribe(t => expect(t).toEqual(mock));
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mock);
  });

  it('should update a pet type', () => {
    const mock: PetType = {id: 1, name: 'updated'};
    service.updatePetType('1', mock).subscribe(t => expect(t).toEqual(mock));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mock);
  });

  it('should delete a pet type', () => {
    service.deletePetType('1').subscribe(r => expect(r).toBe(0));
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(0);
  });

  it('should handle error on getPetTypes', () => {
    service.getPetTypes().subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
    const req = httpMock.expectOne(baseUrl);
    req.flush('error', {status: 500, statusText: 'Server Error'});
  });
});
