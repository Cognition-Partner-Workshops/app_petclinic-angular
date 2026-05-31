import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {PettypeAddComponent} from './pettype-add.component';
import {FormsModule} from '@angular/forms';
import {PetTypeService} from '../pettype.service';
import {of, throwError} from 'rxjs';
import {PetType} from '../pettype';

describe('PettypeAddComponent', () => {
  let component: PettypeAddComponent;
  let fixture: ComponentFixture<PettypeAddComponent>;
  let mockPetTypeService: jasmine.SpyObj<PetTypeService>;

  beforeEach(waitForAsync(() => {
    mockPetTypeService = jasmine.createSpyObj('PetTypeService', ['addPetType']);

    TestBed.configureTestingModule({
      declarations: [PettypeAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [FormsModule],
      providers: [
        {provide: PetTypeService, useValue: mockPetTypeService}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PettypeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit pettype and emit event', () => {
    const newType: PetType = {id: 1, name: 'bird'};
    mockPetTypeService.addPetType.and.returnValue(of(newType));
    spyOn(component.newPetType, 'emit');
    component.onSubmit({id: null, name: 'bird'});
    expect(component.pettype).toEqual(newType);
    expect(component.newPetType.emit).toHaveBeenCalledWith(newType);
  });

  it('should handle submit error', () => {
    mockPetTypeService.addPetType.and.returnValue(throwError('error'));
    component.onSubmit({id: null, name: 'test'});
    expect(component.errorMessage).toBe('error');
  });
});
