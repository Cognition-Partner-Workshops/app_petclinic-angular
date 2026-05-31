import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {OwnerDetailComponent} from './owner-detail.component';
import {OwnerService} from '../owner.service';
import {Router, ActivatedRoute} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';

describe('OwnerDetailComponent', () => {
  let component: OwnerDetailComponent;
  let fixture: ComponentFixture<OwnerDetailComponent>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOwner: Owner = {id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty', city: 'Madison', telephone: '6085551023', pets: []};

  beforeEach(waitForAsync(() => {
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwnerById']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockOwnerService.getOwnerById.and.returnValue(of(mockOwner));

    TestBed.configureTestingModule({
      declarations: [OwnerDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerDetailComponent);
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

  it('should navigate to owners list', () => {
    component.gotoOwnersList();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners']);
  });

  it('should navigate to edit owner', () => {
    component.owner = mockOwner;
    component.editOwner();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1, 'edit']);
  });

  it('should navigate to add pet', () => {
    component.addPet(mockOwner);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1, 'pets', 'add']);
  });
});
