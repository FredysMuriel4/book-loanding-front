import { TestBed } from '@angular/core/testing';

import { CaseConverterService } from './case-converter.service';

describe('CaseConverterService', () => {
  let service: CaseConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
