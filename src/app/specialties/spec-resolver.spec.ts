import {TestBed} from '@angular/core/testing';
import {SpecResolver} from './spec-resolver';
import {SpecialtyService} from './specialty.service';
import {of} from 'rxjs';
import {Specialty} from './specialty';

describe('SpecResolver', () => {
  let resolver: SpecResolver;
  let mockSpecialtyService: jasmine.SpyObj<SpecialtyService>;

  beforeEach(() => {
    mockSpecialtyService = jasmine.createSpyObj('SpecialtyService', ['getSpecialties']);

    TestBed.configureTestingModule({
      providers: [
        SpecResolver,
        {provide: SpecialtyService, useValue: mockSpecialtyService}
      ]
    });
    resolver = TestBed.inject(SpecResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve all specialties', () => {
    const mockSpecs: Specialty[] = [{id: 1, name: 'radiology'}];
    mockSpecialtyService.getSpecialties.and.returnValue(of(mockSpecs));

    resolver.resolve();
    expect(mockSpecialtyService.getSpecialties).toHaveBeenCalled();
  });
});
