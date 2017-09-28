import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardrulesComponent } from './standardrules.component';

describe('StandardrulesComponent', () => {
  let component: StandardrulesComponent;
  let fixture: ComponentFixture<StandardrulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardrulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardrulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
