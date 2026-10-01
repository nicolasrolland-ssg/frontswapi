import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { PlanetService } from './planet.service';

describe('PlanetService', () => { it('is provided and targets planets', () => { TestBed.configureTestingModule({ providers: [PlanetService, provideHttpClient(), provideHttpClientTesting()] }); const service = TestBed.inject(PlanetService); const http = TestBed.inject(HttpTestingController); service.list().subscribe(); const request = http.expectOne((item) => item.url.endsWith('/planets')); expect(request.request.method).toBe('GET'); request.flush([]); http.verify(); }); });
