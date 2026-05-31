import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {OwnerListComponent} from './owner-list.component';
import {OwnerService} from '../owner.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Owner} from '../owner';
import {FormsModule} from '@angular/forms';

describe('OwnerListComponent', () => {
  let component: OwnerListComponent;
  let fixture: ComponentFixture<OwnerListComponent>;
  let mockOwnerService: jasmine.SpyObj<OwnerService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockOwners: Owner[] = [
    {id: 1, firstName: 'George', lastName: 'Franklin', address: '110 W. Liberty St.', city: 'Madison', telephone: '6085551023', pets: []},
    {id: 2, firstName: 'Betty', lastName: 'Davis', address: '638 Cardinal Ave.', city: 'Sun Prairie', telephone: '6085551749', pets: []}
  ];

  beforeEach(waitForAsync(() => {
    mockOwnerService = jasmine.createSpyObj('OwnerService', ['getOwners', 'searchOwners']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockOwnerService.getOwners.and.returnValue(of(mockOwners));

    TestBed.configureTestingModule({
      declarations: [OwnerListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: OwnerService, useValue: mockOwnerService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load owners on init', () => {
    expect(component.owners.length).toBe(2);
    expect(component.isOwnersDataReceived).toBe(true);
  });

  it('should handle error loading owners', () => {
    mockOwnerService.getOwners.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
    expect(component.isOwnersDataReceived).toBe(true);
  });

  it('should navigate to owner on select', () => {
    component.onSelect(mockOwners[0]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners', 1]);
  });

  it('should navigate to add owner', () => {
    component.addOwner();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/owners/add']);
  });

  it('should search by last name with empty string', () => {
    mockOwnerService.getOwners.and.returnValue(of(mockOwners));
    component.searchByLastName('');
    expect(mockOwnerService.getOwners).toHaveBeenCalled();
  });

  it('should search by last name with non-empty string', () => {
    const searchResults = [mockOwners[0]];
    mockOwnerService.searchOwners.and.returnValue(of(searchResults));
    component.searchByLastName('Frank');
    expect(mockOwnerService.searchOwners).toHaveBeenCalledWith('Frank');
    expect(component.owners).toEqual(searchResults);
  });

  it('should handle search error', () => {
    mockOwnerService.searchOwners.and.returnValue(throwError('search error'));
    component.searchByLastName('Unknown');
    expect(component.owners).toBeNull();
  });
});
