import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ApiPayload, ResourceRecord } from '../../core/models/resource.models';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
    selector: 'app-people-list',
    imports: [RouterLink, LoadingComponent, ErrorComponent],
    templateUrl: './people-list.component.html',
    styleUrl: './people-list.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleListComponent {
    private readonly api = inject(ApiService);
    protected readonly records = signal<ResourceRecord[]>([]);
    protected readonly loading = signal(true);
    protected readonly error = signal('');
    protected readonly search = signal('');
    protected readonly page = signal(0);
    protected readonly total = signal(0);

    constructor() { this.load(); }
    protected load(): void {
        
        this.loading.set(true);
        this.error.set('');
        this.api.get<ResourceRecord>('people',
            this.page(), 12,
            this.search()).pipe(catchError(
                (err: { message?: string }) => {
                    this.error.set(err.message ?? 'Transmission interrompue.');
                    this.loading.set(false);
                    return of([] as ResourceRecord[]);
                })).subscribe(
                    (payload) => {
                        const result = this.unpack(payload);
                        this.records.set(result.items);
                        this.total.set(result.total);
                        this.loading.set(false);
                    });
    }
    protected setSearch(event: Event): void { this.search.set((event.target as HTMLInputElement).value); this.page.set(0); this.load(); }
    protected nextPage(): void { if ((this.page() + 1) * 12 < this.total()) { this.page.update((value) => value + 1); this.load(); } }
    protected previousPage(): void { if (this.page() > 0) { this.page.update((value) => value - 1); this.load(); } }
    protected display(record: ResourceRecord): string {
        return String(record.name ?? record.title ?? 'UNKNOWN');
    }
    private unpack(payload: ApiPayload<ResourceRecord>): { items: ResourceRecord[]; total: number } { if (Array.isArray(payload)) return { items: payload, total: payload.length }; const items = payload.content ?? payload.data ?? payload.results ?? []; return { items, total: payload.totalElements ?? payload.total ?? items.length }; }
}
