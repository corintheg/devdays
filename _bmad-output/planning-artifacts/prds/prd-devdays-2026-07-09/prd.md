---
title: DevDays 2027 — App Visiteur (périmètre Carte & Partenaires)
status: final
created: 2026-07-09
updated: 2026-07-09
---

# PRD: DevDays 2027 — App Visiteur (périmètre Carte & Partenaires)
*Titre de travail — à confirmer.*

## 0. Objet du document

Ce PRD couvre le périmètre de développement pris en charge par Corinthe sur le projet école DevDays 2027 : les fonctionnalités **Carte du site** et **Partenaires**. Le projet est réalisé à deux, sur la base d'un cahier des charges commun (`INFOS/CAHIER_DES_CHARGES.md`) et d'une maquette HTML partagée (`INFOS/DevDays 2027 (standalone).html`) qui couvrent l'ensemble de l'app (Programme, Détail événement, Carte, Favoris, Partenaires, Nuit Blanche). Les fonctionnalités Programme, Détail événement, Favoris et Nuit Blanche sont hors périmètre de ce document — elles relèvent du second membre de l'équipe.

Le document est structuré en fonctionnalités, chacune portant des exigences fonctionnelles (FR) numérotées globalement. Les hypothèses tranchées sans confirmation explicite sont marquées `[ASSUMPTION]` et récapitulées en §9. Ce PRD sert de base à l'architecture technique et au découpage en stories pour le périmètre Carte & Partenaires.

## 1. Vision

DevDays 2027 est un festival musical et culturel de 4 jours (9 → 12 juillet), attendu à 2,5M de festivaliers. L'app visiteur doit permettre de s'orienter sur le site et de découvrir les partenaires sans dégrader l'expérience du festival — le tout sans connexion réseau fiable, puisque l'app fonctionne en offline-first avec des données embarquées (contrainte imposée par l'absence de backend fourni par le prestataire infra).

Sur le périmètre Carte : le visiteur doit pouvoir se repérer visuellement sur le site (scènes, stands, points d'intérêt pratiques) sans dépendre d'une géolocalisation ou d'une connexion — une carte illustrée stylisée, cohérente avec la charte graphique du festival, avec des points d'intérêt cliquables menant à l'information utile (programmation d'une scène, détail d'un partenaire).

Sur le périmètre Partenaires : donner une visibilité claire et engageante aux sponsors du festival, en cohérence avec l'objectif du CDC de "donner une visibilité aux sponsors sans dégrader l'expérience" — sans que ça ressemble à de la publicité intrusive.

## 2. Utilisateur cible

### 2.1 Jobs To Be Done
- En tant que visiteur sur site, je veux savoir où se trouvent les scènes et les points pratiques (eau, secours, sorties, restauration) pour m'orienter rapidement dans la foule.
- En tant que visiteur curieux, je veux découvrir ce que proposent les partenaires (stands, animations, bons plans) sans avoir à les chercher activement.
- En tant que visiteur pressé, je veux passer de "je vois un marker sur la carte" à "je sais quoi en faire" en un ou deux taps, sans lecture longue.

### 2.2 Non-Utilisateurs (v1)
- Organisateurs / staff festival (pas de vue "backoffice" ou de gestion des points d'intérêt dans l'app).
- Visiteurs cherchant une navigation GPS turn-by-turn — la carte est un plan illustré, pas un outil de guidage précis.

### 2.3 Parcours utilisateur clés

- **UJ-1. Marco cherche les toilettes les plus proches en pleine after-midi.**
  - **Persona + contexte :** Marco, venu entre amis, cherche rapidement un point WC sans réseau fiable (foule dense).
  - **État d'entrée :** sur l'écran Carte, arrivé depuis la tab bar.
  - **Parcours :** ouvre l'app → onglet Carte → repère la légende → identifie le pictogramme "WC" → tape sur le marker le plus proche visuellement.
  - **Climax :** une fiche s'ouvre avec le nom et la description du point, confirmant qu'il a trouvé le bon.
  - **Résolution :** ferme la fiche, retourne à la carte, s'oriente vers le point repéré.

- **UJ-2. Léa veut savoir ce que propose un stand partenaire qu'elle vient de croiser sur la carte.**
  - **Persona + contexte :** Léa explore la carte de manière exploratoire avant l'ouverture des portes.
  - **État d'entrée :** écran Carte.
  - **Parcours :** tape sur un marker de type partenaire → une fiche s'ouvre avec nom + catégorie → tape sur "Voir les partenaires" → arrive sur la liste Partenaires → tape sur la card du partenaire concerné → consulte le détail (stand, horaires, activation).
  - **Climax :** elle découvre une animation/bon plan au stand qu'elle ne connaissait pas.
  - **Résolution :** tape "Voir sur la carte" pour repérer à nouveau le stand, ou revient en arrière vers la carte.
  - **Cas limite :** le partenaire n'a pas systématiquement de marker individuel — modèle hybride confirmé (voir §3, §9) : certains partenaires ont leur propre marker, les autres sont regroupés sous le marker "Village Partenaires". Dans ce dernier cas, "Voir sur la carte" pointe vers le marker groupé.

- **UJ-3. Sami tape sur une scène pour voir qui y joue.**
  - **Persona + contexte :** Sami regarde la carte pour choisir sa prochaine scène.
  - **État d'entrée :** écran Carte.
  - **Parcours :** tape sur un marker de type scène → fiche avec nom de la scène → tape sur "Voir la programmation".
  - **Climax :** redirigé vers l'écran Programme (hors périmètre de ce PRD), filtré ou non sur la scène — l'interface exacte de ce lien est une dépendance à clarifier avec le développeur du module Programme.
  - **Résolution :** consulte la programmation de cette scène.

## 3. Glossaire

- **Point d'intérêt (POI)** — Élément positionné sur la Carte : Scène, Stand de restauration, Partenaire, Entrée/Sortie, Point eau/WC, Poste de secours, Parking. Porté par un champ `type` unique (pas une hiérarchie d'entités séparées).
- **Marker** — Représentation visuelle d'un POI sur la Carte : icône + couleur selon `type`, avec le nom du POI affiché en permanence au-dessus de l'icône (pas seulement au tap), style "sticker" (contour marine 3-4px, ombre dure décalée 4px×4px, sans flou), conforme à la maquette de référence.
- **Fiche POI** — Panneau (bottom sheet) affiché au tap sur un Marker : nom, type, description, et bouton d'action contextuel le cas échéant.
- **Scène** — POI de type scène, associé à une programmation (Événements) gérée par le module Programme (hors périmètre).
- **Partenaire / Sponsor** — Entreprise sponsor du festival, avec un Stand associé sur la Carte et une fiche détail dans l'écran Partenaires. Porte : nom, catégorie, couleur de marque, initiales (badge), et optionnellement un logo/niveau de partenariat (champs hérités du CDC, non illustrés dans la maquette qui utilise un badge initiales en remplacement du logo).
- **Village Partenaires** — Marker groupé sur la Carte représentant plusieurs Partenaires qui n'ont pas de marker individuel dédié — modèle hybride confirmé par la maquette (voir §9) : certains partenaires ont un marker propre, les autres sont rattachés au Village Partenaires.
- **Écran Partenaires** — Liste des Partenaires du festival, point d'entrée vers le détail de chacun.
- **Fiche Partenaire** — Détail d'un Partenaire : nom, catégorie, description du stand, activation/animation proposée, horaires, emplacement.

## 4. Fonctionnalités

### 4.1 Carte du site

**Description :** Écran affichant un plan illustré et stylisé du site (image de fond fixe, charte graphique du festival), sur lequel sont positionnés des Markers représentant les Points d'intérêt (16 dans les données de démo). Le visiteur peut zoomer/dézoomer via des boutons dédiés (pas de vraie carte géographique — `[ASSUMPTION confirmée]`, voir §9) et taper sur un Marker pour ouvrir sa Fiche POI. Une légende récapitule les types de Markers en bas d'écran. Réalise UJ-1, UJ-2, UJ-3.

**Exigences fonctionnelles :**

#### FR-1 : Affichage de la carte illustrée avec points d'intérêt

Le visiteur peut consulter une carte illustrée du site affichant tous les Points d'intérêt actifs.

**Conséquences (testables) :**
- La carte affiche une image de fond représentant le site du festival.
- Chaque POI présent dans les données embarquées est représenté par un Marker positionné en coordonnées relatives (%, x/y) sur l'image de fond.
- Le nom du POI est affiché en permanence au-dessus (ou à côté) de son icône, sans nécessiter de tap (conforme à la maquette).
- Le rendu reste lisible avec au moins 16 Markers simultanés (volume de la démo).

#### FR-2 : Distinction visuelle des types de points d'intérêt

Le visiteur peut distinguer immédiatement le type d'un POI à son apparence.

**Conséquences (testables) :**
- Les 7 types de POI (scène, restauration, partenaire, entrée/sortie, eau/WC, secours, parking) ont chacun une icône et une couleur dédiées, cohérentes avec la charte graphique (§ palette : orange bombe, vert terrain, marine nuit, corail flash, cyan volt, craie, gris béton). Les markers de type partenaire utilisent la couleur générique du type (cyan), pas la couleur de marque individuelle du sponsor — conforme à la maquette.
- Chaque Marker respecte le style "sticker" de la charte : contour marine 3-4px, ombre dure décalée 4px×4px sans flou, coins arrondis 16-24px pour les fiches associées.
- Le contraste entre chaque couleur de Marker et le fond de carte respecte un ratio minimum de 4.5:1 (seuil WCAG AA texte), vérifié en particulier pour l'orange et le vert sur fond marine nuit.
- Une légende est accessible sur l'écran Carte, listant les 7 types avec leur pictogramme.

#### FR-3 : Zoom sur la carte

Le visiteur peut zoomer et dézoomer sur la carte via des contrôles dédiés.

**Conséquences (testables) :**
- Deux boutons fixes (+ / −) modifient le niveau de zoom de l'affichage.
- Le zoom ne fait pas apparaître ou disparaître de Markers (mêmes POI visibles à tout niveau de zoom, dans la limite de l'écran).

**Hors périmètre :** Zoom par pincement (pinch-to-zoom) natif — exception assumée par rapport à la maquette (dont le texte d'aide mentionne "pince pour zoomer"), les boutons +/- suffisent pour la V1 démo.

#### FR-4 : Consultation d'un point d'intérêt

Le visiteur peut taper sur un Marker pour ouvrir sa Fiche POI.

**Conséquences (testables) :**
- Le tap sur un Marker ouvre un panneau affichant : nom du POI, type, description.
- Le panneau se ferme au tap en dehors ou via un bouton de fermeture explicite.

#### FR-5 : Navigation contextuelle depuis un point d'intérêt

Le visiteur peut accéder directement au contenu associé à un POI depuis sa Fiche POI, quand ce contenu existe.

**Conséquences (testables) :**
- Une Fiche POI de type "scène" propose un bouton "Voir la programmation" menant à l'écran Programme (module hors périmètre — l'interface de navigation exacte, ex. paramètre de scène transmis, est une **dépendance à clarifier avec le développeur du module Programme**, voir §8).
- Une Fiche POI de type "partenaire" propose un bouton "Voir les partenaires" menant à l'écran Partenaires (§4.2).
- Les autres types de POI (entrée/sortie, eau/WC, secours, parking) n'ont pas de bouton d'action — description seule suffisante.

**Exigences non fonctionnelles spécifiques :**
- Les données de la carte (POI, coordonnées, types) sont embarquées en JSON local — aucun appel réseau requis pour afficher la carte.

### 4.2 Partenaires

**Description :** Écran listant les partenaires/sponsors du festival, avec accès au détail de chacun (stand, description, horaires, activation proposée). Objectif du CDC : donner de la visibilité aux sponsors sans dégrader l'expérience visiteur — présentation valorisante plutôt que publicitaire. Réalise UJ-2.

**Exigences fonctionnelles :**

#### FR-6 : Liste des partenaires

Le visiteur peut consulter la liste de tous les partenaires du festival.

**Conséquences (testables) :**
- La liste affiche, par partenaire : pastille avec initiales (badge, couleur de marque du partenaire), nom, catégorie (ex. "Partenaire officiel", "Bar & boissons", "Mobilité", "Cashless", "Éco-responsable", "Audio"), et un lien vers le détail.
- La liste gère les 6 partenaires de la démo via `FlatList` (cohérent avec la contrainte de performance du CDC).

#### FR-7 : Détail d'un partenaire

Le visiteur peut consulter le détail d'un partenaire depuis la liste.

**Conséquences (testables) :**
- Le header de la fiche détail reprend la couleur de marque et le badge initiales du partenaire.
- La fiche détail affiche : nom, catégorie, description du stand/de l'activation proposée, emplacement, horaires d'ouverture.
- Un bouton "Voir sur la carte" ramène vers l'écran Carte (§4.1), positionné sur le Marker individuel du partenaire s'il en a un, sinon sur le marker "Village Partenaires" (modèle hybride, voir §3, §9).

#### FR-8 : Accès à l'écran Partenaires

Le visiteur peut atteindre l'écran Partenaires depuis la navigation principale de l'app et depuis la Carte.

**Conséquences (testables) :**
- L'écran Partenaires est accessible via un onglet permanent dans la tab bar principale (4 items : Programme / Carte / Favoris / Partenaires), conforme à la maquette de référence.
- L'écran Partenaires est également accessible depuis la Fiche POI d'un Marker partenaire sur la Carte (FR-5).

**Notes :**
- `[NOTE FOR PM]` La tab bar est un composant de navigation partagé avec le module Programme/Favoris (hors périmètre) — la structure à 4 items est calée sur la maquette, mais son intégration finale doit être synchronisée avec le développeur de ces modules.

## 5. Non-Goals (explicites)

- Pas de carte géoréférencée / GPS réelle : la Carte est un plan illustré stylisé, pas une intégration `react-native-maps` avec coordonnées lat/lng.
- Pas de géolocalisation de l'utilisateur sur la carte ("vous êtes ici") — exclu explicitement par le CDC.
- Pas de mise à jour réseau des données (partenaires, POI) — tout est embarqué au moment de la compilation.
- Pas de compte utilisateur ni de fonctionnalité liée à un profil sur les écrans Carte/Partenaires.
- Pas de contenu publicitaire dynamique ou de placement payant additionnel pour les partenaires (au-delà de leur présence dans la liste et sur la carte).

## 6. Périmètre MVP

### 6.1 Dans le périmètre
- Carte illustrée avec les 16 POI de démo, 7 types différenciés visuellement, noms affichés en permanence, style "sticker" de la charte graphique.
- Zoom +/- sur la carte.
- Fiche POI au tap, avec navigation contextuelle (scène → Programme, partenaire → Partenaires).
- Légende des types de Markers.
- Modèle hybride de markers partenaires (certains individuels, les autres regroupés sous "Village Partenaires"), conforme à la maquette.
- Liste des 6 partenaires de démo avec catégorie, couleur de marque, badge initiales.
- Fiche détail partenaire (stand, horaires, activation, description).
- Tab bar à 4 items avec Partenaires en onglet permanent.
- Aller-retour Carte ↔ Partenaires.

### 6.2 Hors périmètre MVP
- Pinch-to-zoom sur la carte (boutons suffisent pour la démo — exception assumée par rapport au texte d'aide de la maquette).
- Logo réel par partenaire (la démo utilise un badge initiales, pas d'asset image).
- Toute logique de recommandation ou de tri des partenaires (ordre = ordre des données embarquées).

## 7. Critères de succès

Projet école à enjeu simulé réel — les métriques restent qualitatives, orientées démo :

**Primaire**
- **SM-1** : Un membre du jury peut, sans aide, repérer un point d'intérêt sur la carte, ouvrir sa fiche, et naviguer vers l'écran Partenaires en moins de 3 taps. Valide FR-1, FR-2, FR-4, FR-5.
- **SM-2** : La carte reste lisible (contrastes, taille des Markers) sur un device réel en extérieur / forte luminosité. Valide FR-2, exigence non fonctionnelle §4.1.

**Secondaire**
- **SM-3** : Le passage Carte → Fiche Partenaire → retour Carte fonctionne sans backend, hors ligne. Valide FR-5, FR-7.

**Contre-métriques (à ne pas optimiser)**
- **SM-C1** : Ne pas surcharger la carte de texte ou d'éléments au point de la rendre illisible sur petit écran — la densité d'information ne doit pas être optimisée au détriment de la lisibilité (contrebalance SM-2).

## 8. Questions ouvertes

1. **Interface de navigation Carte → Programme** (FR-5) : quel paramètre exact transmettre à l'écran Programme depuis une Fiche POI de type scène (ID de scène ? filtre pré-appliqué ?) et retour attendu du tap "Voir la programmation" côté marker partenaire — dépendance vers le module du second développeur, à clarifier avec lui avant l'architecture.
2. **Synchronisation de la tab bar à 4 items** avec le développeur du module Programme/Favoris — la structure suit la maquette, mais le composant de navigation est partagé et doit être aligné entre les deux modules.
3. **Notification locale de rappel favori** (mentionnée au CDC §5.2 comme bonus) : hors périmètre Carte/Partenaires — à vérifier qu'elle est bien couverte côté module Favoris.

## 9. Index des hypothèses

- §1/§4.1 — La Carte est une illustration stylisée avec positions en pourcentage (x/y), pas une carte géoréférencée `react-native-maps` avec coordonnées lat/lng réelles. *(Confirmé par l'utilisateur — décision.)*
- §3/§4.1 (FR-2) — Le modèle de données des POI suit le modèle enrichi de la maquette (7 types sous un champ `type` unique) plutôt que les 3 entités distinctes (Scene/Stand/Sponsor) du cahier des charges initial. *(Confirmé par l'utilisateur.)*
- §2.3 (UJ-2), §3, §4.1 (FR-5), §4.2 (FR-7) — Granularité des Markers partenaires : modèle hybride (certains partenaires individuels, les autres regroupés sous "Village Partenaires"), conforme à la maquette. *(Décision : reproduire la maquette à l'identique sur ce point.)*
- §4.2 (FR-8) — Tab bar à 4 items, Partenaires en onglet permanent, conforme à la maquette. *(Décision : reproduire la maquette — reste à synchroniser avec le développeur du module Programme/Favoris, voir Question 2 en §8.)*
- §4.1 (FR-3) — Zoom par boutons +/- uniquement (pas de pinch-to-zoom natif), malgré le texte d'aide de la maquette qui mentionne le pincement. *(Décision explicite de l'utilisateur : c'est l'une des rares exceptions où on ne reproduit pas la maquette à l'identique.)*
- §4.1 (FR-2) — Les markers partenaires sur la carte utilisent la couleur générique du type (cyan), pas la couleur de marque individuelle du sponsor, conforme à la maquette.
