import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {OwnerEditComponent} from './owner-edit.component';
import {FormsModule} from '@angular/forms';
import {OwnerService} from '../owner.service';
import {Router, ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';

describe('OwnerEditComponent', () => {
  let component: OwnerEditComponent;
  let fixture: ComponentFixture<OwnerEditComponent>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOwner: Owner = {id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty', city: 'Madison', telephone: '6085551023', pets: []};

  beforeEach(waitForAsync(() => {
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById', 'updateOwner']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [OwnerEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load owner on init', () => {
    expect(mockOwnerService.getOwnerById).toHaveBeenCalledWith('1' as any);
    expect(component.owner).toEqual(mockOwner);
  });

  it('should handle error loading owner', () => {
    mockOwnerService.getOwnerById.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit updated owner', () => {
    mockOwnerService.updateOwner.and.returnValue(of(mockOwner));
    component.onSubmit(mockOwner);
    expect(mockOwnerService.updateOwner).toHaveBeenCalledWith('1', mockOwner);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });

  it('should handle submit error', () => {
    mockOwnerService.updateOwner.and.returnValue(throwError('update error'));
    component.onSubmit(mockOwner);
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate to owner detail', () => {
    component.gotoOwnerDetail(mockOwner);
    expect(component.errorMessage).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });
});
