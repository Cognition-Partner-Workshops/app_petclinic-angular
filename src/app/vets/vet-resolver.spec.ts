import {TestBed} from '@angular/core/testing';
import {VetResolver} from './vet-resolver';
import {VetService} from './vet.service';
import {of} from 'rxjs';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Vet} from './vet';

describe('VetResolver', () => {
  let resolver: VetResolver;
  let mockVetService: jasmine.SpyObj<VetService>;

  beforeEach(() => {
    mockVetService = jasmine.createSpyObj('VetService', ['getVetById']);

    TestBed.configureTestingModule({
      providers: [
        VetResolver,
        {provide: VetService, useValue: mockVetService}
      ]
    });
    resolver = TestBed.inject(VetResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve vet by id from route params', () => {
    const mockVet: Vet = {id: 1, firstName: 'James', lastName: 'Carter', specialties: []};
    mockVetService.getVetById.and.returnValue(of(mockVet));

    const route = {paramMap: {get: (key: string) => '1'}} as unknown as ActivatedRouteSnapshot;
    const state = {} as RouterStateSnapshot;

    resolver.resolve(route, state);
    expect(mockVetService.getVetById).toHaveBeenCalledWith('1');
  });
});
