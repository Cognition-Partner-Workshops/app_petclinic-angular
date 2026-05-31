import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PettypeEditComponent} from './pettype-edit.component';
import {FormsModule} from '@angular/forms';
import {PetTypeService} from '../pettype.service';
import {ActivatedRoute, Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';

describe('PettypeEditComponent', () => {
  let component: PettypeEditComponent;
  let fixture: ComponentFixture<PettypeEditComponent>;
  let mockPetTypeService: jasmine.SpyObj<PetTypeService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(waitForAsync(() => {
    mockPetTypeService = jasmine.createSpyObj('PetTypeService', ['getPetTypeById', 'updatePetType']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockPetTypeService.getPetTypeById.and.returnValue(of({id: 1, name: 'cat'}));

    TestBed.configureTestingModule({
      declarations: [PettypeEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: PetTypeService, useValue: mockPetTypeService},
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: {snapshot: {params: {id: '1'}}}}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PettypeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load pet type on init', () => {
    expect(mockPetTypeService.getPetTypeById).toHaveBeenCalledWith('1');
    expect(component.pettype).toEqual({id: 1, name: 'cat'});
  });

  it('should handle error loading pet type', () => {
    mockPetTypeService.getPetTypeById.and.returnValue(throwError('load error'));
    component.ngOnInit();
    expect(component.errorMessage).toBe('load error');
  });

  it('should submit updated pet type', () => {
    const pt: PetType = {id: 1, name: 'updated'};
    mockPetTypeService.updatePetType.and.returnValue(of(pt));
    component.onSubmit(pt);
    expect(mockPetTypeService.updatePetType).toHaveBeenCalledWith('1', pt);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pettypes']);
  });

  it('should handle submit error', () => {
    mockPetTypeService.updatePetType.and.returnValue(throwError('update error'));
    component.onSubmit({id: 1, name: 'test'});
    expect(component.errorMessage).toBe('update error');
  });

  it('should navigate back', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/pettypes']);
  });
});
