# Galactic Archives

SPA Angular 21 pour explorer l'univers Star Wars via l'API REST Spring Boot documentee dans Swagger (`http://localhost:8080/swagger-ui/index.html`). L'interface adopte une direction cyberpunk: fond spatial, grille technique, cyan electrique, violet neon et typographies Orbitron / Exo 2.

## Installation

```bash
npm install
```

L'URL du backend est centralisee dans `src/environments/environment.ts` (`http://localhost:8080/api`). Le backend doit etre accessible avant le lancement pour obtenir les donnees reelles.

## Lancement

```bash
npm start
```

Puis ouvrir `http://localhost:4200`. Les quatre modules disponibles sont Personnages, Planetes, Films et Vaisseaux. Chaque module propose une recherche, une pagination, une liste et un detail.

## Build et tests

```bash
npm run build
npm test
npx cypress open
```

Les tests unitaires utilisent le runner Angular/Vitest fourni par Angular 21. Le dossier `cypress/e2e` contient les parcours E2E de navigation et de recherche.

## Architecture

```text
src/app
  core/                 constants, interceptors, models, services
  features/
    people/             people-list et people-detail
    planets/            planets-list et planets-detail
    films/              films-list et films-detail
    starships/          starships-list et starships-detail
    dashboard/          accueil et acces rapides
    error-page/         fallback 404
  shared/components/    loading et error reutilisables
  app.routes.ts         routes standalone et lazy loading
```

Chaque ressource possede ses propres composants standalone de liste et de detail avec leurs fichiers TypeScript, HTML et SCSS dans le meme dossier. Les composants sont en OnPush, utilisent des signals et le control flow Angular natif (`@if`, `@for`). HttpClient et un interceptor fonctionnel sont fournis dans `app.config.ts`. Angular Material/CDK sont installes pour les evolutions de composants accessibles.

## API couverte

- `GET /api/people`, `/api/people/{id}`, `/api/people/search`
- `GET /api/planets`, `/api/planets/{id}`, `/api/planets/search`
- `GET /api/films`, `/api/films/{id}`
- `GET /api/starships`, `/api/starships/{id}`, `/api/starships/search`

Les liens de detail et les listes associees sont prepares par le modele generique et pourront etre etendus avec les endpoints relationnels documentes.

## Tests E2E

Les scénarios couvrent l'ouverture des modules depuis le dashboard, la recherche personnage et la navigation vers un détail. Les scénarios film et vaisseau suivent le même contrat de liste et peuvent être étendus avec des fixtures backend.

## Captures attendues

Capturer le dashboard desktop avec sidebar, la liste responsive sur mobile avec menu hamburger, puis un détail avec les spécifications API et l'état d'erreur hors ligne.
