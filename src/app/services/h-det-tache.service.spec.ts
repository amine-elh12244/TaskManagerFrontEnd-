import { TestBed } from '@angular/core/testing';

import { HDetTacheService } from './h-det-tache.service';

describe('HDetTacheService', () => {
  let service: HDetTacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HDetTacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
