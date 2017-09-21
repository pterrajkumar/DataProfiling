import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityTreeComponent } from './entity-tree.component';

describe('EntityTreeComponent', () => {
  let component: EntityTreeComponent;
  let fixture: ComponentFixture<EntityTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntityTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
