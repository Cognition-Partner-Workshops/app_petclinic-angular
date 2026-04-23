import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {PettypeEditComponent} from './pettype-edit.component';
import {PetTypeService} from '../pettype.service';
import {PetType} from '../pettype';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub, RouterStub} from '../../testing/router-stubs';
import {FormsModule} from '@angular/forms';
import {Observable, of, throwError} from 'rxjs';
import Spy = jasmine.Spy;

class PetTypeServiceStub {
  getPetTypeById(typeId: string): Observable<PetType> {
    return of();
  }
  updatePetType(typeId: string, petType: PetType): Observable<PetType> {
    return of();
  }
}


describe('PettypeEditComponent', () => {
  let component: PettypeEditComponent;
  let fixture: ComponentFixture<PettypeEditComponent>;
  let pettypeService: PetTypeService;
  let spy: Spy;
  let testPettype: PetType;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PettypeEditComponent ],
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
    fixture = TestBed.createComponent(PettypeEditComponent);
    component = fixture.componentInstance;
    testPettype = {
      id: 1,
      name: 'test'
    };

    pettypeService = fixture.debugElement.injector.get(PetTypeService);
    spy = spyOn(pettypeService, 'getPetTypeById')
      .and.returnValue(of(testPettype));

    fixture.detectChanges();
  });

  it('should create PettypeEditComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load pettype on init', () => {
    spy.and.returnValue(of(testPettype));
    component.ngOnInit();
    expect(component.pettype).toEqual(testPettype);
  });

  it('should set errorMessage on getPetTypeById error', () => {
    spy.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit pettype and navigate back', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    spyOn(pettypeService, 'updatePetType').and.returnValue(of(testPettype));
    component.onSubmit(testPettype);
    expect(router.navigate).toHaveBeenCalledWith(['/pettypes']);
  });

  it('should set errorMessage on submit error', () => {
    spyOn(pettypeService, 'updatePetType').and.returnValue(throwError('update error'));
    component.onSubmit(testPettype);
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate back on onBack', () => {
    const router = fixture.debugElement.injector.get(Router);
    spyOn(router, 'navigate');
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['/pettypes']);
  });
});
