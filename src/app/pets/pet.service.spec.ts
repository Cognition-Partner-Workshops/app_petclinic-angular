import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetService } from './pet.service';
import { HttpErrorHandler } from '../error.service';
import { Pet } from './pet';
import { environment } from '../../environments/environment';

describe('PetService', () => {
  let service: PetService;
  let httpMock: HttpTestingController;
  const entityUrl = environment.REST_API_URL + 'pets';

  const mockOwner = { id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: [] };
  const mockPet: Pet = { id: 1, name: 'Leo', birthDate: '2010-09-07', type: { id: 1, name: 'cat' }, owner: mockOwner, ownerId: 1, visits: [] };

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

  it('should return pets on getPets', () => {
    service.getPets().subscribe(pets => {
      expect(pets.length).toBe(1);
      expect(pets[0].name).toBe('Leo');
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('GET');
    req.flush([mockPet]);
  });

  it('should return a pet by id on getPetById', () => {
    service.getPetById(1).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPet);
  });

  it('should add a pet on addPet', () => {
    const newPet = { ...mockPet, id: null };
    service.addPet(newPet as any).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const expectedUrl = environment.REST_API_URL + 'owners/1/pets';
    const req = httpMock.expectOne(expectedUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockPet);
  });

  it('should update a pet on updatePet', () => {
    service.updatePet('1', mockPet).subscribe(pet => {
      expect(pet).toEqual(mockPet);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockPet);
  });

  it('should delete a pet on deletePet', () => {
    service.deletePet('1').subscribe(response => {
      expect(response).toBe(204);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(204);
  });
});
