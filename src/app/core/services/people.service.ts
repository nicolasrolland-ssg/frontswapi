import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiPayload, ResourceRecord } from '../models/resource.models';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class PeopleService {
  private readonly api = inject(ApiService);
  list(page = 0, search = ''): Observable<ApiPayload<ResourceRecord>> { return this.api.get('people', page, 12, search); }
  getById(id: string): Observable<ResourceRecord> { return this.api.getById('people', id); }
  starships(id: string): Observable<ResourceRecord[]> { return this.api.related('people', id, 'starships'); }
  films(id: string): Observable<ResourceRecord[]> { return this.api.related('people', id, 'films'); }
}
