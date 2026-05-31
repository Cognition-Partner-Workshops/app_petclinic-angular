import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VetListComponent} from './vet-list.component';
import {VetService} from '../vet.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Vet} from '../vet';

describe('VetListComponent', () => {
  let component: VetListComponent;
  let fixture: ComponentFixture<VetListComponent>;
  let mockVetService: jasmine.SpyObj<VetService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockVetService = jasmine.createSpyObj('VetService', ['getVets', 'deleteVet']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockVetService.getVets.and.returnValue(of([
      {id: 1, firstName: 'James', lastName: 'Carter', specialties: []},
      {id: 2, firstName: 'Helen', lastName: 'Leary', specialties: []}
    ]));

    TestBed.configureTestingModule({
      declarations: [VetListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: VetService, useValue: mockVetService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vets on init', () => {
    expect(component.vets.length).toBe(2);
    expect(component.isVetDataReceived).toBe(true);
  });

  it('should handle error loading vets', () => {
    mockVetService.getVets.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
    expect(component.isVetDataReceived).toBe(true);
  });

  it('should delete vet', () => {
    mockVetService.deleteVet.and.returnValue(of(0));
    component.deleteVet({id: 1, firstName: 'James', lastName: 'Carter', specialties: []});
    expect(component.vets.length).toBe(1);
  });

  it('should handle delete error', () => {
    mockVetService.deleteVet.and.returnValue(throwError('delete error'));
    component.deleteVet({id: 1, firstName: 'James', lastName: 'Carter', specialties: []});
    expect(component.errorMessage).toBe('delete error');
  });

  it('should navigate to home', () => {
    component.gotoHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/welcome']);
  });

  it('should navigate to add vet', () => {
    component.addVet();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets/add']);
  });

  it('should navigate to edit vet', () => {
    component.editVet({id: 1, firstName: 'James', lastName: 'Carter', specialties: []});
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/vets', 1, 'edit']);
  });
});
