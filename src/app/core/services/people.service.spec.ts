import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PeopleService } from './people.service';

describe('PeopleService', () => {
  let service: PeopleService;
  let http: HttpTestingController;
  beforeEach(() => { TestBed.configureTestingModule({ providers: [PeopleService, provideHttpClient(), provideHttpClientTesting()] }); service = TestBed.inject(PeopleService); http = TestBed.inject(HttpTestingController); });
  afterEach(() => http.verify());
  it('requests the people endpoint', () => { service.list().subscribe(); const request = http.expectOne((item) => item.url.endsWith('/people')); expect(request.request.method).toBe('GET'); request.flush([]); });
});
