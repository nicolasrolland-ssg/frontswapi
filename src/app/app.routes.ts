import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{ path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent) },
	{ path: 'error', loadComponent: () => import('./features/error-page/error-page.component').then((m) => m.ErrorPageComponent) },
	{ path: 'people', loadComponent: () => import('./features/people/people-list.component').then((m) => m.PeopleListComponent) },
	{ path: 'people/:id', loadComponent: () => import('./features/people/people-detail.component').then((m) => m.PeopleDetailComponent) },
	{ path: 'planets', loadComponent: () => import('./features/planets/planets-list.component').then((m) => m.PlanetsListComponent) },
	{ path: 'planets/:id', loadComponent: () => import('./features/planets/planets-detail.component').then((m) => m.PlanetsDetailComponent) },
	{ path: 'films', loadComponent: () => import('./features/films/films-list.component').then((m) => m.FilmsListComponent) },
	{ path: 'films/:id', loadComponent: () => import('./features/films/films-detail.component').then((m) => m.FilmsDetailComponent) },
	{ path: 'starships', loadComponent: () => import('./features/starships/starships-list.component').then((m) => m.StarshipsListComponent) },
	{ path: 'starships/:id', loadComponent: () => import('./features/starships/starships-detail.component').then((m) => m.StarshipsDetailComponent) },
	{ path: '**', redirectTo: 'dashboard' }
];
