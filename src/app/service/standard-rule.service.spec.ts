import { TestBed, inject } from '@angular/core/testing';

import { StandardRuleService } from './standard-rule.service';

describe('StandardRuleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StandardRuleService]
    });
  });

  it('should be created', inject([StandardRuleService], (service: StandardRuleService) => {
    expect(service).toBeTruthy();
  }));
});
