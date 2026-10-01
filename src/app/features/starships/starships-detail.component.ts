import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ResourceRecord } from '../../core/models/resource.models';
import { ErrorComponent } from '../../shared/components/error/error.component';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

@Component({
    selector: 'app-starships-detail',
    imports: [RouterLink, LoadingComponent, ErrorComponent],
    templateUrl: './starships-detail.component.html',
    styleUrl: './starships-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarshipsDetailComponent {

    private readonly api = inject(ApiService);
    private readonly route = inject(ActivatedRoute);
    protected readonly record = signal<ResourceRecord | null>(null);
    protected readonly imagePath = "" + this.record.name;
    protected readonly error = signal('');
    protected readonly loading = signal(true);

    constructor() {
        this.load();
    }

    protected load(): void {
        this.loading.set(true);
        this.api.getById<ResourceRecord>('starships', this.route.snapshot.paramMap.get('id') ?? '1')
            .pipe(catchError(
                (err: { message?: string }) => {
                    this.error.set(err.message ?? 'Transmission interrompue.');
                    this.loading.set(false);
                    return of(null);
                }))
            .subscribe((item) => { this.record.set(item); this.loading.set(false); });
    }

    protected title(): string {
        return String(this.record()?.name ?? 'SIGNATURE INCONNUE');
    }

    protected imgPath(): string {
        return this.record()?.id ? "/assets/img/starships/" + this.record()?.id + ".jpg" : '';
    }

    protected display(value: unknown): string {
        return value === null
            || value === undefined
            || value === '' ? '—' : Array.isArray(value) ? `${value.length} éléments liés` : String(value);
    }

    protected entries(): [string, unknown][] {
        const item = this.record();
        return item ? Object.entries(item).filter(
            ([key]) => key !== 'id' && key !== 'name').slice(0, 12) : [];
    }

}
