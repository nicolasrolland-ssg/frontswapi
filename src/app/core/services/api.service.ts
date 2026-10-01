import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiPayload, ResourceRecord } from '../models/resource.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T extends ResourceRecord>(resource: string, page = 0, size = 12, search = ''): Observable<ApiPayload<T>> {
    let params = new HttpParams().set('page', page).set('size', size);
    const term = search.trim().toLowerCase();
    const endpoint = term && resource !== 'films' ? `${this.baseUrl}/${resource}/search` : `${this.baseUrl}/${resource}`;
    if (term && resource !== 'films') params = params.set('name', search.trim());
    if (term && resource === 'films') {
      params = new HttpParams().set('page', 0).set('size', 100);
      return this.http.get<ApiPayload<T>>(endpoint, { params }).pipe(map((payload) => this.filterPayload(payload, term)));
    }
    return this.http.get<ApiPayload<T>>(endpoint, { params });
  }

  getById<T extends ResourceRecord>(resource: string, id: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${resource}/${id}`);
  }

  search<T extends ResourceRecord>(resource: string, query: string): Observable<ApiPayload<T>> {
    return this.get(resource, 0, 12, query);
  }

  related<T extends ResourceRecord>(resource: string, id: string, relation: string): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}/${resource}/${id}/${relation}`);
  }

  private filterPayload<T extends ResourceRecord>(payload: ApiPayload<T>, term: string): ApiPayload<T> {
    if (Array.isArray(payload)) return payload.filter((record) => this.labelOf(record).includes(term));
    const items = payload.content ?? payload.data ?? payload.results ?? [];
    const filtered = items.filter((record) => this.labelOf(record).includes(term));
    return { ...payload, content: filtered, data: undefined, results: undefined, totalElements: filtered.length, total: filtered.length };
  }

  private labelOf(record: ResourceRecord): string { return String(record.name ?? record.title ?? '').toLowerCase(); }
}
