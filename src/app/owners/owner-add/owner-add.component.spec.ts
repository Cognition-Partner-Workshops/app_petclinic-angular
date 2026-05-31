import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {OwnerAddComponent} from './owner-add.component';
import {FormsModule} from '@angular/forms';
import {OwnerService} from '../owner.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';

describe('OwnerAddComponent', () => {
  let component: OwnerAddComponent;
  let fixture: ComponentFixture<OwnerAddComponent>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['addOwner']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [OwnerAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit owner and navigate', () => {
    const newOwner: Owner = {id: 1, firstName: 'John', lastName: 'Doe', address: '123 Main', city: 'City', telephone: '555', pets: []};
    mockOwnerService.addOwner.and.returnValue(of(newOwner));
    component.onSubmit({id: null, firstName: 'John', lastName: 'Doe', address: '123 Main', city: 'City', telephone: '555', pets: []});
    expect(mockOwnerService.addOwner).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners']);
  });

  it('should handle submit error', () => {
    mockOwnerService.addOwner.and.returnValue(throwError('submit error'));
    component.onSubmit({id: null, firstName: 'John', lastName: 'Doe', address: '', city: '', telephone: '', pets: []});
    expect(component.errorMessage).toBe('submit error');
  });

  it('should navigate to owners list', () => {
    component.gotoOwnersList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners']);
  });
});
