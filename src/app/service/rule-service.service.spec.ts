import { TestBed, inject } from '@angular/core/testing';

import { RuleServiceService } from './rule-service.service';

describe('RuleServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuleServiceService]
    });
  });

  it('should be created', inject([RuleServiceService], (service: RuleServiceService) => {
    expect(service).toBeTruthy();
  }));
});
