import { TestBed, inject } from '@angular/core/testing';

import { ProfileServiceService } from './profile-service.service';

describe('ProfileServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileServiceService]
    });
  });

  it('should be created', inject([ProfileServiceService], (service: ProfileServiceService) => {
    expect(service).toBeTruthy();
  }));
});
