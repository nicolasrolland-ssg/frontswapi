import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// commentairess
@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly menuOpen = signal(false);
  protected readonly navItems = [
    { label: 'Dashboard', icon: '⌂', route: '/dashboard' },
    { label: 'Personnages', icon: '◈', route: '/people' },
    { label: 'Planètes', icon: '◉', route: '/planets' },
    { label: 'Films', icon: '▣', route: '/films' },
    { label: 'Vaisseaux', icon: '✦', route: '/starships' }
  ];

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }
}
