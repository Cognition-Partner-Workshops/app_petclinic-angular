import { TestBed } from '@angular/core/testing';
import { SpecResolver } from './spec-resolver';
import { SpecialtyService } from './specialty.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../error.service';
import { of } from 'rxjs';
import { Specialty } from './specialty';

describe('SpecResolver', () => {
  let resolver: SpecResolver;
  let specialtyService: SpecialtyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SpecResolver, SpecialtyService, HttpErrorHandler]
    });
    resolver = TestBed.inject(SpecResolver);
    specialtyService = TestBed.inject(SpecialtyService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve specialties', () => {
    const mockSpecialties: Specialty[] = [
      { id: 1, name: 'radiology' },
      { id: 2, name: 'surgery' }
    ];
    spyOn(specialtyService, 'getSpecialties').and.returnValue(of(mockSpecialties));
    const result = resolver.resolve();
    expect(specialtyService.getSpecialties).toHaveBeenCalled();
  });
});
