import { TestBed } from '@angular/core/testing';

import { HEntTacheService } from './h-ent-tache.service';

describe('HEntTacheService', () => {
  let service: HEntTacheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HEntTacheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
