import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PettypeListComponent} from './pettype-list.component';
import {PetTypeService} from '../pettype.service';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';
import {FormsModule} from '@angular/forms';

describe('PettypeListComponent', () => {
  let component: PettypeListComponent;
  let fixture: ComponentFixture<PettypeListComponent>;
  let mockPetTypeService: jasmine.SpyObj<PetTypeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockPetTypeService = jasmine.createSpyObj('PetTypeService', ['getPetTypes', 'deletePetType']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPetTypeService.getPetTypes.and.returnValue(of([{id: 1, name: 'cat'}, {id: 2, name: 'dog'}]));

    TestBed.configureTestingModule({
      declarations: [PettypeListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: PetTypeService, useValue: mockPetTypeService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PettypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet types on init', () => {
    expect(component.pettypes.length).toBe(2);
    expect(component.isPetTypesDataReceived).toBe(true);
  });

  it('should handle error loading pet types', () => {
    mockPetTypeService.getPetTypes.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
    expect(component.isPetTypesDataReceived).toBe(true);
  });

  it('should delete pet type', () => {
    mockPetTypeService.deletePetType.and.returnValue(of(0));
    component.deletePettype({id: 1, name: 'cat'});
    expect(component.pettypes.length).toBe(1);
    expect(component.pettypes[0].name).toBe('dog');
  });

  it('should handle delete error', () => {
    mockPetTypeService.deletePetType.and.returnValue(throwError('delete error'));
    component.deletePettype({id: 1, name: 'cat'});
    expect(component.errorMessage).toBe('delete error');
  });

  it('should add new pet type to list', () => {
    component.onNewPettype({id: 3, name: 'bird'});
    expect(component.pettypes.length).toBe(3);
  });

  it('should toggle add component', () => {
    expect(component.isInsert).toBe(false);
    component.showAddPettypeComponent();
    expect(component.isInsert).toBe(true);
  });

  it('should navigate to edit pet type', () => {
    component.showEditPettypeComponent({id: 1, name: 'cat'});
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pettypes', '1', 'edit']);
  });

  it('should navigate to home', () => {
    component.gotoHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/welcome']);
  });
});
