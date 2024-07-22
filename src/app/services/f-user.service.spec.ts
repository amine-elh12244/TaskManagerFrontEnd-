import { TestBed } from '@angular/core/testing';

import { FUserService } from './f-user.service';

describe('FUserService', () => {
  let service: FUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
