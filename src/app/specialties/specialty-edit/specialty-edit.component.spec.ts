import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SpecialtyEditComponent} from './specialty-edit.component';
import {FormsModule} from '@angular/forms';
import {SpecialtyService} from '../specialty.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';

describe('SpecialtyEditComponent', () => {
  let component: SpecialtyEditComponent;
  let fixture: ComponentFixture<SpecialtyEditComponent>;
  let mockSpecialtyService: jasmine.SpyObj<SpecialtyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockSpecialtyService = jasmine.createSpyObj('SpecialtyService', ['getSpecialtyById', 'updateSpecialty']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockSpecialtyService.getSpecialtyById.and.returnValue(of({id: 1, name: 'radiology'}));

    TestBed.configureTestingModule({
      declarations: [SpecialtyEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: SpecialtyService, useValue: mockSpecialtyService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load specialty on init', () => {
    expect(mockSpecialtyService.getSpecialtyById).toHaveBeenCalledWith('1');
    expect(component.specialty).toEqual({id: 1, name: 'radiology'});
  });

  it('should handle error loading specialty', () => {
    mockSpecialtyService.getSpecialtyById.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit updated specialty', () => {
    const spec: Specialty = {id: 1, name: 'updated'};
    mockSpecialtyService.updateSpecialty.and.returnValue(of(spec));
    component.onSubmit(spec);
    expect(mockSpecialtyService.updateSpecialty).toHaveBeenCalledWith('1', spec);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/specialties']);
  });

  it('should handle submit error', () => {
    mockSpecialtyService.updateSpecialty.and.returnValue(throwError('update error'));
    component.onSubmit({id: 1, name: 'test'});
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate back', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/specialties']);
  });
});
