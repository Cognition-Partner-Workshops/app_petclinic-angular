import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PettypeListComponent} from './pettype-list.component';
import {PetTypeService} from '../pettype.service';
import {PetType} from '../pettype';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {FormsModule} from '@angular/forms';
import {Observable, of, throwError} from 'rxjs';
import Spy = jasmine.Spy;

class PetTypeServiceStub {
  deletePetType(typeId: string): Observable<number> {
    return of();
  }
  getPetTypes(): Observable<PetType[]> {
    return of();
  }
}


describe('PettypeListComponent', () => {
  let component: PettypeListComponent;
  let fixture: ComponentFixture<PettypeListComponent>;
  let pettypeService: PetTypeService;
  let spy: Spy;
  let testPettypes: PetType[];
  let responseStatus: number;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PettypeListComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: PetTypeService, useClass: PetTypeServiceStub},
        {provide: Router, useClass: RouterStub},
        {provide: ActivatedRoute, useClass: ActivatedRouteStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PettypeListComponent);
    component = fixture.componentInstance;

    testPettypes = [{
      id: 1,
      name: 'test'
    }];

    pettypeService = fixture.debugElement.injector.get(PetTypeService);
    responseStatus = 204; // success delete return NO_CONTENT
    component.pettypes = testPettypes;

    spy = spyOn(pettypeService, 'deletePetType')
      .and.returnValue(of(responseStatus));

    fixture.detectChanges();
  });

  it('should create PettypeListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call deletePetType() method', () => {
    fixture.detectChanges();
    component.deletePettype(component.pettypes[0]);
    expect(spy.calls.any()).toBe(true, 'deletePetType called');
  });

  it('should remove pettype from list on successful delete', () => {
    component.deletePettype(testPettypes[0]);
    expect(component.pettypes.length).toBe(0);
  });

  it('should set errorMessage on deletePettype error', () => {
    spy.and.returnValue(throwError('delete error'));
    component.deletePettype(testPettypes[0]);
    expect(component.errorMessage).toBe('delete error');
  });

  it('should load pettypes on init', () => {
    const mockTypes: PetType[] = [{ id: 1, name: 'cat' }, { id: 2, name: 'dog' }];
    spyOn(pettypeService, 'getPetTypes').and.returnValue(of(mockTypes));
    component.ngOnInit();
    expect(component.pettypes).toEqual(mockTypes);
    expect(component.isPetTypesDataReceived).toBe(true);
  });

  it('should add pettype to list on onNewPettype', () => {
    const newType: PetType = { id: 3, name: 'bird' };
    component.onNewPettype(newType);
    expect(component.pettypes).toContain(newType);
  });

  it('should toggle isInsert on showAddPettypeComponent', () => {
    expect(component.isInsert).toBe(false);
    component.showAddPettypeComponent();
    expect(component.isInsert).toBe(true);
    component.showAddPettypeComponent();
    expect(component.isInsert).toBe(false);
  });

  it('should navigate to edit pettype on showEditPettypeComponent', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.showEditPettypeComponent(testPettypes[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/pettypes', '1', 'edit']);
  });

  it('should navigate to home on gotoHome', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.gotoHome();
    expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
  });
});
