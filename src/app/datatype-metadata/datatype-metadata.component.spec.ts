import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatypeMetadataComponent } from './datatype-metadata.component';

describe('DatatypeMetadataComponent', () => {
  let component: DatatypeMetadataComponent;
  let fixture: ComponentFixture<DatatypeMetadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatypeMetadataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatypeMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
