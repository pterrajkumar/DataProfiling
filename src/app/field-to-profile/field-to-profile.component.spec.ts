import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldToProfileComponent } from './field-to-profile.component';

describe('FieldToProfileComponent', () => {
  let component: FieldToProfileComponent;
  let fixture: ComponentFixture<FieldToProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldToProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldToProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
