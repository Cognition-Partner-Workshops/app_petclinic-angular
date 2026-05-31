import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {PetService} from './pet.service';
import {HttpErrorHandler} from '../error.service';
import {Pet} from './pet';
import {environment} from '../../environments/environment';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.REST_API_URL + 'pets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetService, HttpErrorHandler]
    });
    service = TestBed.inject(PetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all pets', () => {
    const mockPets: Pet[] = [
      {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 1, visits: []}
    ];
    service.getPets().subscribe(pets => {
      expect(pets).toEqual(mockPets);
    });
    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPets);
  });

  it('should get pet by id', () => {
    const mockPet: Pet = {id: 1, name: 'Leo', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 1, visits: []};
    service.getPetById(1).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  it('should add a pet', () => {
    const mockPet: Pet = {id: null, name: 'Rex', birthDate: '2021-05-01', type: {id: 2, name: 'dog'}, owner: {id: 1, firstName: 'A', lastName: 'B', address: '', city: '', telephone: '', pets: []}, ownerId: 1, visits: []};
    service.addPet(mockPet).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpMock.expectOne(environment.REST_API_URL + 'owners/1/pets');
    expect(req.request.method).toBe('POST');
    req.flush(mockPet);
  });

  it('should update a pet', () => {
    const mockPet: Pet = {id: 1, name: 'Leo Updated', birthDate: '2020-01-01', type: {id: 1, name: 'cat'}, owner: null, ownerId: 1, visits: []};
    service.updatePet('1', mockPet).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockPet);
  });

  it('should delete a pet', () => {
    service.deletePet('1').subscribe(result => {
      expect(result).toBe(0);
    });
    const req = httpMock.expectOne(baseUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(0);
  });

  it('should handle error on getPets', () => {
    service.getPets().subscribe({
      next: () => fail('should error'),
      error: err => expect(err).toContain('server returned code 500')
    });
    const req = httpMock.expectOne(baseUrl);
    req.flush('error', {status: 500, statusText: 'Server Error'});
  });
});
