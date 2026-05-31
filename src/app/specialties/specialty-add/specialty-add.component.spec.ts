import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SpecialtyAddComponent} from './specialty-add.component';
import {FormsModule} from '@angular/forms';
import {SpecialtyService} from '../specialty.service';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';

describe('SpecialtyAddComponent', () => {
  let component: SpecialtyAddComponent;
  let fixture: ComponentFixture<SpecialtyAddComponent>;
  let mockSpecialtyService: jasmine.SpyObj<SpecialtyService>;

  beforeEach(waitForAsync(() => {
    mockSpecialtyService = jasmine.createSpyObj('SpecialtyService', ['addSpecialty']);

    TestBed.configureTestingModule({
      declarations: [SpecialtyAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: SpecialtyService, useValue: mockSpecialtyService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit specialty and emit event', () => {
    const newSpec: Specialty = {id: 1, name: 'radiology'};
    mockSpecialtyService.addSpecialty.and.returnValue(of(newSpec));
    spyOn(component.newSpeciality, 'emit');
    component.onSubmit({id: null, name: 'radiology'});
    expect(component.speciality).toEqual(newSpec);
    expect(component.addedSuccess).toBe(true);
    expect(component.newSpeciality.emit).toHaveBeenCalledWith(newSpec);
  });

  it('should handle submit error', () => {
    mockSpecialtyService.addSpecialty.and.returnValue(throwError('error'));
    component.onSubmit({id: null, name: 'test'});
    expect(component.errorMessage).toBe('error');
  });
});
