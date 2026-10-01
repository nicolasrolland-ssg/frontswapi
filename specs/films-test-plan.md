# Plan de tests - Films

## Application Overview

Application Angular d’archives Star Wars. Le module Films propose un index avec chargement paginé par 12, recherche par titre, accès à une fiche détaillée et retour à l’index. Les données viennent de l’API sous /api. Exécuter les scénarios indépendamment avec un contexte navigateur vierge; pour les cas négatifs, intercepter l’API afin de maîtriser les réponses et les erreurs.

## Test Scenarios

### 1. Films - Index et recherche

**Seed:** `tests/seed.spec.ts`

#### 1.1. Accéder à l’index Films et afficher les premiers résultats

**File:** `tests/films/films-index.spec.ts`

**Steps:**
  1. Depuis un contexte navigateur vierge, ouvrir le tableau de bord puis sélectionner « Films » dans la navigation principale. Attendre la fin de la requête GET /api/films.
    - expect: L’URL devient /films et le titre « Films » est visible.
    - expect: Pendant la requête, un état de chargement est présenté sans erreur de console non liée.
    - expect: Une fois chargé, les films renvoyés par l’API sont présentés sous forme de cartes avec titre, identifiant, épisode et réalisateur lorsque ces valeurs existent.
    - expect: Le compteur reflète le nombre total communiqué par l’API; la première page affiche au plus 12 cartes.
    - expect: Le bouton « Précédent » est désactivé sur la première page.
  2. Vérifier les titres et métadonnées visibles sur plusieurs cartes.
    - expect: Les valeurs affichées correspondent à la réponse API; les champs manquants sont remplacés par un tiret ou la valeur de repli prévue.
    - expect: Chaque carte propose un accès « INSPECTER » et mène à une fiche du film correspondant.

#### 1.2. Parcourir les pages de l’index et vérifier les bornes

**File:** `tests/films/films-pagination.spec.ts`

**Steps:**
  1. Préparer une réponse API de plus de 12 films, puis ouvrir /films dans un contexte vierge.
    - expect: La première page affiche 12 films et indique PAGE 1.
    - expect: Le bouton « Précédent » est désactivé et « Suivant » est actif.
  2. Cliquer sur « Suivant » et attendre la réponse correspondant à la page suivante.
    - expect: L’index affiche PAGE 2 avec les films de la deuxième page, sans doublons dus à la page précédente.
    - expect: Le bouton « Précédent » devient actif.
  3. Cliquer sur « Précédent », puis avancer jusqu’à la dernière page et vérifier les commandes.
    - expect: Le retour affiche les résultats de la première page.
    - expect: La dernière page n’affiche que les résultats restants et le bouton « Suivant » est désactivé.
    - expect: Cliquer sur « Suivant » lorsqu’il est désactivé ne change ni la page ni les résultats.

#### 1.3. Rechercher un film sans tenir compte de la casse ou des espaces

**File:** `tests/films/films-search.spec.ts`

**Steps:**
  1. Ouvrir /films avec un jeu de données contenant un titre connu, puis saisir dans le champ « Rechercher un film » ce titre entouré d’espaces et avec une casse différente.
    - expect: La liste est rechargée selon la recherche et ne conserve que les titres correspondant au terme sans distinction de casse.
    - expect: La recherche est appliquée dès la saisie; l’index revient à la première page.
    - expect: Le compteur et les cartes correspondent aux résultats filtrés.
  2. Remplacer le texte par un terme sans correspondance.
    - expect: Aucune carte n’est affichée et le message « AUCUNE SIGNATURE DETECTEE » apparaît.
    - expect: Aucune erreur n’est présentée pour un résultat vide normal.
    - expect: Le compteur indique zéro résultat.
  3. Effacer le champ de recherche.
    - expect: La liste complète est de nouveau affichée depuis la première page.
    - expect: Le compteur reprend le total de l’index.

#### 1.4. Gérer une erreur de chargement de l’index et relancer

**File:** `tests/films/films-index-error.spec.ts`

**Steps:**
  1. Intercepter GET /api/films pour renvoyer une erreur HTTP 500 lors de la première requête, puis configurer la requête suivante pour réussir; ouvrir /films.
    - expect: L’état de chargement disparaît après l’échec.
    - expect: Un panneau d’erreur accessible avec le titre « Signal perdu » et un message apparaît.
    - expect: Le bouton « RELANCER LA TRANSMISSION » est disponible.
  2. Cliquer sur « RELANCER LA TRANSMISSION ».
    - expect: Une nouvelle requête GET /api/films est envoyée.
    - expect: Le panneau d’erreur disparaît après la réussite et la liste des films apparaît.

### 2. Films - Fiches détaillées

**Seed:** `tests/seed.spec.ts`

#### 2.1. Ouvrir une fiche depuis l’index puis revenir à la liste

**File:** `tests/films/films-detail-navigation.spec.ts`

**Steps:**
  1. Avec au moins un film disponible, ouvrir /films dans un contexte vierge puis sélectionner « INSPECTER » sur sa carte.
    - expect: L’URL correspond à /films/{id} pour le film sélectionné.
    - expect: Le titre de la fiche correspond au titre sélectionné et les informations du film sont visibles.
  2. Cliquer sur « RETOUR À L’INDEX ».
    - expect: L’URL redevient /films.
    - expect: L’index Films est affiché et peut être parcouru à nouveau.

#### 2.2. Afficher les propriétés disponibles sur une fiche film

**File:** `tests/films/films-detail-fields.spec.ts`

**Steps:**
  1. Intercepter GET /api/films/42 avec une réponse contenant un titre, des propriétés simples, une valeur nulle, une chaîne vide et un tableau de relations; ouvrir directement /films/42.
    - expect: La fiche charge le film demandé et affiche son titre.
    - expect: Les propriétés sont rendues dans la section « SPECIFICATIONS »; l’identifiant et le titre ne sont pas répétés dans la liste des propriétés.
    - expect: Une valeur nulle ou vide est affichée sous forme de tiret.
    - expect: Un tableau relationnel est résumé par son nombre d’éléments liés.
    - expect: Au plus 12 propriétés sont affichées.

#### 2.3. Gérer une erreur lors de l’ouverture d’une fiche et relancer

**File:** `tests/films/films-detail-error.spec.ts`

**Steps:**
  1. Intercepter GET /api/films/999 pour renvoyer HTTP 404, puis ouvrir /films/999 dans un contexte vierge.
    - expect: L’état de chargement disparaît après la réponse.
    - expect: Le panneau « Signal perdu » affiche un message d’erreur et ne montre pas de fiche vide comme si le film avait été trouvé.
    - expect: Le bouton « RELANCER LA TRANSMISSION » est disponible.
  2. Configurer la requête suivante pour réussir, puis cliquer sur « RELANCER LA TRANSMISSION ».
    - expect: Une nouvelle requête pour l’identifiant 999 est envoyée.
    - expect: Si l’API renvoie un film, sa fiche s’affiche et le panneau d’erreur disparaît; si le 404 persiste, l’erreur reste visible sans bloquer le retour à l’index.
