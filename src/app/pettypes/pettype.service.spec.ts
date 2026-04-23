import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PetTypeService } from './pettype.service';
import { HttpErrorHandler } from '../error.service';
import { PetType } from './pettype';
import { environment } from '../../environments/environment';

describe('PetTypeService', () => {
  let service: PetTypeService;
  let httpMock: HttpTestingController;
  const entityUrl = environment.REST_API_URL + 'pettypes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PetTypeService, HttpErrorHandler]
    });
    service = TestBed.inject(PetTypeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return pet types on getPetTypes', () => {
    const mockPetTypes: PetType[] = [
      { id: 1, name: 'cat' },
      { id: 2, name: 'dog' }
    ];
    service.getPetTypes().subscribe(petTypes => {
      expect(petTypes.length).toBe(2);
      expect(petTypes).toEqual(mockPetTypes);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockPetTypes);
  });

  it('should return a pet type by id on getPetTypeById', () => {
    const mockPetType: PetType = { id: 1, name: 'cat' };
    service.getPetTypeById('1').subscribe(petType => {
      expect(petType).toEqual(mockPetType);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockPetType);
  });

  it('should update a pet type on updatePetType', () => {
    const mockPetType: PetType = { id: 1, name: 'cat updated' };
    service.updatePetType('1', mockPetType).subscribe(petType => {
      expect(petType).toEqual(mockPetType);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('PUT');
    req.flush(mockPetType);
  });

  it('should add a pet type on addPetType', () => {
    const mockPetType: PetType = { id: null, name: 'bird' };
    const returnPetType: PetType = { id: 3, name: 'bird' };
    service.addPetType(mockPetType).subscribe(petType => {
      expect(petType).toEqual(returnPetType);
    });
    const req = httpMock.expectOne(entityUrl);
    expect(req.request.method).toBe('POST');
    req.flush(returnPetType);
  });

  it('should delete a pet type on deletePetType', () => {
    service.deletePetType('1').subscribe(response => {
      expect(response).toBe(204);
    });
    const req = httpMock.expectOne(entityUrl + '/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(204);
  });
});
