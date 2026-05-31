import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {VisitListComponent} from './visit-list.component';
import {VisitService} from '../visit.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Visit} from '../visit';

describe('VisitListComponent', () => {
  let component: VisitListComponent;
  let fixture: ComponentFixture<VisitListComponent>;
  let mockVisitService: jasmine.SpyObj<VisitService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockVisitService = jasmine.createSpyObj('VisitService', ['deleteVisit']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [VisitListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: VisitService, useValue: mockVisitService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should edit visit', () => {
    const visit: Visit = {id: 1, date: '2020-01-01', description: 'test', pet: null};
    component.editVisit(visit);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/visits', 1, 'edit']);
  });

  it('should delete visit and remove from list', () => {
    const visit: Visit = {id: 1, date: '2020-01-01', description: 'test', pet: null};
    component.visits = [visit];
    mockVisitService.deleteVisit.and.returnValue(of(0));
    component.deleteVisit(visit);
    expect(component.visits.length).toBe(0);
    expect(component.noVisits).toBe(true);
  });

  it('should delete visit but keep others', () => {
    const visit1: Visit = {id: 1, date: '2020-01-01', description: 'test1', pet: null};
    const visit2: Visit = {id: 2, date: '2020-01-02', description: 'test2', pet: null};
    component.visits = [visit1, visit2];
    mockVisitService.deleteVisit.and.returnValue(of(0));
    component.deleteVisit(visit1);
    expect(component.visits.length).toBe(1);
    expect(component.noVisits).toBe(false);
  });

  it('should handle delete error', () => {
    const visit: Visit = {id: 1, date: '2020-01-01', description: 'test', pet: null};
    component.visits = [visit];
    mockVisitService.deleteVisit.and.returnValue(throwError('delete error'));
    component.deleteVisit(visit);
    expect(component.errorMessage).toBe('delete error');
  });
});
