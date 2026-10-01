import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard', imports: [RouterLink], templateUrl: './dashboard.component.html', styleUrl: './dashboard.component.scss', changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly cards = [
    { key: 'people', label: 'Personnages', count: '—', icon: '◈', text: 'Profils biologiques et historiques' },
    { key: 'planets', label: 'Planètes', count: '—', icon: '◉', text: 'Territoires cartographiés' },
    { key: 'films', label: 'Films', count: '—', icon: '▣', text: 'Chronologie cinématographique' },
    { key: 'starships', label: 'Vaisseaux', count: '—', icon: '✦', text: 'Flotte et ingénierie spatiale' }
  ];
}
