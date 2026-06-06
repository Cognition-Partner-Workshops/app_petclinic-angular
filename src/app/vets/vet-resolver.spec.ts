import { TestBed } from '@angular/core/testing';
import { VetResolver } from './vet-resolver';
import { VetService } from './vet.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../error.service';
import { of } from 'rxjs';
import { Vet } from './vet';
import { ActivatedRouteSnapshot } from '@angular/router';

describe('VetResolver', () => {
  let resolver: VetResolver;
  let vetService: VetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VetResolver, VetService, HttpErrorHandler]
    });
    resolver = TestBed.inject(VetResolver);
    vetService = TestBed.inject(VetService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve a vet by id', () => {
    const mockVet: Vet = { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] };
    spyOn(vetService, 'getVetById').and.returnValue(of(mockVet));
    const route = { paramMap: { get: (key: string) => '1' } } as any;
    const result = resolver.resolve(route, {} as any);
    expect(vetService.getVetById).toHaveBeenCalledWith('1');
  });
});
