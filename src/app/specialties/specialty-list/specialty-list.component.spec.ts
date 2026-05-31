import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {SpecialtyListComponent} from './specialty-list.component';
import {SpecialtyService} from '../specialty.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Specialty} from '../specialty';
import {FormsModule} from '@angular/forms';

describe('SpecialtyListComponent', () => {
  let component: SpecialtyListComponent;
  let fixture: ComponentFixture<SpecialtyListComponent>;
  let mockSpecialtyService: jasmine.SpyObj<SpecialtyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockSpecialtyService = jasmine.createSpyObj('SpecialtyService', ['getSpecialties', 'deleteSpecialty']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockSpecialtyService.getSpecialties.and.returnValue(of([{id: 1, name: 'radiology'}, {id: 2, name: 'surgery'}]));

    TestBed.configureTestingModule({
      declarations: [SpecialtyListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: SpecialtyService, useValue: mockSpecialtyService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialtyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load specialties on init', () => {
    expect(component.specialties.length).toBe(2);
    expect(component.isSpecialitiesDataReceived).toBe(true);
  });

  it('should handle error loading specialties', () => {
    mockSpecialtyService.getSpecialties.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
    expect(component.isSpecialitiesDataReceived).toBe(true);
  });

  it('should delete specialty', () => {
    mockSpecialtyService.deleteSpecialty.and.returnValue(of(0));
    component.deleteSpecialty({id: 1, name: 'radiology'});
    expect(component.specialties.length).toBe(1);
    expect(component.specialties[0].name).toBe('surgery');
  });

  it('should handle delete error', () => {
    mockSpecialtyService.deleteSpecialty.and.returnValue(throwError('delete error'));
    component.deleteSpecialty({id: 1, name: 'radiology'});
    expect(component.errorMessage).toBe('delete error');
  });

  it('should add new specialty to list', () => {
    component.onNewSpecialty({id: 3, name: 'dentistry'});
    expect(component.specialties.length).toBe(3);
  });

  it('should toggle add component', () => {
    expect(component.isInsert).toBe(false);
    component.showAddSpecialtyComponent();
    expect(component.isInsert).toBe(true);
    component.showAddSpecialtyComponent();
    expect(component.isInsert).toBe(false);
  });

  it('should navigate to edit specialty', () => {
    component.showEditSpecialtyComponent({id: 1, name: 'radiology'});
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/specialties', '1', 'edit']);
  });

  it('should navigate to home', () => {
    component.gotoHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/welcome']);
  });
});
