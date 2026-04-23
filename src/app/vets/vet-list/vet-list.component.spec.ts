import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VetListComponent } from './vet-list.component';
import { FormsModule } from '@angular/forms';
import { VetService } from '../vet.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteStub, RouterStub } from '../../testing/router-stubs';
import { Vet } from '../vet';
import { Observable, of, throwError } from 'rxjs';
import Spy = jasmine.Spy;

class VetServiceStub {
  getVets(): Observable<Vet[]> {
    return of([]);
  }
  deleteVet(vetId: string): Observable<number> {
    return of(204);
  }
}

describe('VetListComponent', () => {
  let component: VetListComponent;
  let fixture: ComponentFixture<VetListComponent>;
  let vetService: VetService;
  let router: RouterStub;
  let testVets: Vet[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VetListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        { provide: VetService, useClass: VetServiceStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VetListComponent);
    component = fixture.componentInstance;
    vetService = fixture.debugElement.injector.get(VetService);
    router = fixture.debugElement.injector.get(Router) as any;
    testVets = [
      { id: 1, firstName: 'James', lastName: 'Carter', specialties: [] },
      { id: 2, firstName: 'Helen', lastName: 'Leary', specialties: [] }
    ];
    spyOn(vetService, 'getVets').and.returnValue(of(testVets));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load vets on init', () => {
    expect(component.vets.length).toBe(2);
    expect(component.isVetDataReceived).toBe(true);
  });

  it('should delete a vet and remove from list', () => {
    spyOn(vetService, 'deleteVet').and.returnValue(of(204));
    component.deleteVet(testVets[0]);
    expect(component.vets.length).toBe(1);
    expect(component.vets[0].id).toBe(2);
  });

  it('should set errorMessage on deleteVet error', () => {
    spyOn(vetService, 'deleteVet').and.returnValue(throwError('delete error'));
    component.deleteVet(testVets[0]);
    expect(component.errorMessage).toBe('delete error');
  });

  it('should navigate to home on gotoHome', () => {
    spyOn(router, 'navigate');
    component.gotoHome();
    expect(router.navigate).toHaveBeenCalledWith(['/welcome']);
  });

  it('should navigate to add vet on addVet', () => {
    spyOn(router, 'navigate');
    component.addVet();
    expect(router.navigate).toHaveBeenCalledWith(['/vets/add']);
  });

  it('should navigate to edit vet on editVet', () => {
    spyOn(router, 'navigate');
    component.editVet(testVets[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/vets', 1, 'edit']);
  });
});
