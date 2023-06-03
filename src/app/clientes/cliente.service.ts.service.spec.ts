import { TestBed } from '@angular/core/testing';

import { ClienteServiceTsService } from './cliente.service.ts.service';

describe('ClienteServiceTsService', () => {
  let service: ClienteServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
