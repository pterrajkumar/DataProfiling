import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueIdentifierFieldComponent } from './unique-identifier-field.component';

describe('UniqueIdentifierFieldComponent', () => {
  let component: UniqueIdentifierFieldComponent;
  let fixture: ComponentFixture<UniqueIdentifierFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UniqueIdentifierFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UniqueIdentifierFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
