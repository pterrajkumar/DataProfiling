import { TestBed, inject } from '@angular/core/testing';

import { FieldToProfileServiceService } from './field-to-profile-service.service';

describe('FieldToProfileServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FieldToProfileServiceService]
    });
  });

  it('should be created', inject([FieldToProfileServiceService], (service: FieldToProfileServiceService) => {
    expect(service).toBeTruthy();
  }));
});
