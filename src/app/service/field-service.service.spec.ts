import { TestBed, inject } from '@angular/core/testing';

import { FieldServiceService } from './field-service.service';

describe('FieldServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldServiceService]
    });
  });

  it('should be created', inject([FieldServiceService], (service: FieldServiceService) => {
    expect(service).toBeTruthy();
  }));
});
