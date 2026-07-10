# Cahier des charges — Application mobile DevDays 2027

**Version** 1.0 — Étape 2/5 (livrable fin de jour 1)
**Prestataire** [binôme] — **Client** DevDays

---

## 1. Contexte

Les DevDays 2027 sont un événement musical et culturel de 4 jours minimum (2,5M visiteurs sur l'édition précédente). Le prestataire a en charge deux volets liés : la conception de la programmation (édition 2027) et l'application mobile visiteur qui l'expose.

**Périmètre confirmé du prestataire :** l'app côté visiteur uniquement. Infrastructure serveur, billetterie, gestion de la masse de visiteurs = hors périmètre (autre prestataire).

**Hypothèse structurante (à valider client) :** aucune API n'est fournie par le prestataire infra pour la programmation. Vu la stack imposée (Expo Go, exécution sans build, testable en salle), l'app fonctionne avec **des données statiques embarquées (JSON local)**, pas d'appel réseau à un backend. Conséquence directe : toute modification de programmation après compilation du JSON = nouvelle version de l'app. C'est acceptable pour une V1 de démo vendredi, mais c'est un vrai risque produit à signaler au client si l'app doit vivre pendant l'événement réel (planning qui bouge, artiste qui annule).

## 2. Objectifs

- Permettre au visiteur de consulter la programmation (concerts + animations) et de s'y retrouver.
- Donner une vision spatiale de l'événement (scènes, stands, points d'intérêt).
- Permettre de mémoriser les événements qui intéressent le visiteur.
- Donner une visibilité aux sponsors sans dégrader l'expérience.

## 3. Utilisateur cible

Visiteur sur site, sur son téléphone, souvent en extérieur, en mobilité, parfois avec mauvaise connexion (foule de 2,5M personnes = réseau mobile saturé en réalité → argument supplémentaire pour du offline-first, données embarquées).

## 4. Modèle de données (proposé)

| Entité | Champs clés |
| --- | --- |
| **Event** (concert ou animation) | id, titre, type (concert/animation), description, artiste (nullable), sceneId ou standId, jour, heure_debut, heure_fin, style/catégorie, image |
| **Scene** | id, nom, coordonnées (lat/lng), capacité (optionnel) |
| **Stand** | id, nom, type (restauration/boutique/sponsor/info), coordonnées |
| **Sponsor** | id, nom, logo, niveau (optionnel), lien vers stand |
| **Favori** | eventId (stocké localement via AsyncStorage, pas de compte utilisateur) |

Pas de notion de compte / authentification : les favoris sont liés à l'appareil, pas à un profil.

## 5. Fonctionnalités

### 5.1 Indispensable (V1 — démo vendredi)

Reprend les minimums imposés par le brief, retenus tels quels :

- Liste de la programmation (concerts + animations)
- Détail d'un événement (horaire, lieu, artiste, description)
- Au moins un filtre fonctionnel (proposition : filtre par jour)
- Carte avec les scènes, stands et points d'intérêt (react-native-maps, pas de géolocalisation utilisateur)
- Favoris persistés sur l'appareil (AsyncStorage)
- Affichage simple des sponsors (proposition : écran ou section dédiée listant logos + noms)

### 5.2 Conseillé (valeur ajoutée, à justifier en soutenance)

- **Filtres combinés** jour + style + catégorie — justification : avec 12+ concerts et 8+ stands sur 3 scènes , un filtre unique devient vite insuffisant pour s'y retrouver.
- **Mise en avant de la Nuit Blanche** : écran ou bandeau dédié, car c'est le temps fort signature de l'événement explicitement mentionné dans le brief — le traiter comme un événement lambda serait une erreur de conception.
- **Intégration sponsors contextuelle** : logo sponsor affiché sur le stand associé sur la carte + un stand "sponsor" cliquable, plutôt qu'un simple écran de logos qui n'apporte rien au visiteur.
- **Notification locale de rappel** pour un favori (ex. "commence dans 15 min") — reste faisable sans backend, purement local.

### 5.3 Explicitement hors périmètre V1 (à trancher avec le client si temps)

- Compte utilisateur / synchronisation cross-device des favoris
- Mise à jour de la programmation en temps réel (implique un backend, hors stack imposée)
- Géolocalisation du visiteur sur la carte (exclue par le brief lui-même)

## 6. Écrans principaux

1. **Accueil / Programme** — liste des événements, filtre(s)
2. **Détail événement** — infos complètes + bouton favori
3. **Carte** — scènes, stands, points d'intérêt
4. **Favoris** — liste des événements enregistrés
5. **Sponsors / Partenaires** — mise en avant des partenaires
6. **Nuit Blanche** — écran dédié au temps fort

Navigation proposée : tab bar (Programme / Carte / Favoris) via Expo Router, écran Détail en navigation empilée depuis Programme, Carte et Favoris.

## 7. Stack technique (imposée, non négociable)

- Expo (`npx create-expo-app`), exécution via Expo Go — pas de bare workflow, pas de build natif
- Expo Router — navigation par fichiers
- `react-native-maps` (`expo install`) — carte + Markers aux coordonnées lat/lng des lieux, pas de clé API nécessaire
- `@react-native-async-storage/async-storage` (`expo install`) — persistance locale des favoris
- Toute lib tierce s'installe via `expo install`, jamais `npm install`, pour garantir la compatibilité SDK Expo

## 8. Contraintes non fonctionnelles

- **Offline-first** : l'app doit fonctionner sans réseau une fois lancée (données embarquées, pas de fetch distant critique)
- **Lisibilité** : la charte graphique impose "lisible" comme valeur — attention au contraste des couleurs vives (orange bombe, vert terrain) sur fond marine nuit, tester le contraste texte/fond
- **Performance liste** : avec 12+ concerts et 8+ stands, prévoir FlatList (pas de map JS classique) dès le départ
- **Cohérence visuelle** : typographies Bricolage Grotesque (titres) / Hanken Grotesk (texte courant), palette de la charte fournie

## 9. Risques identifiés

| Risque | Impact | Mitigation proposée |
| --- | --- | --- |
| Pas de backend → programmation figée à la compilation | Moyen pour la démo, fort en usage réel | Assumé pour V1, à signaler explicitement au client |
| Délai très serré (CDC + maquettes en 1 jour, app en 2 jours) | Fort | Prioriser strictement la liste "indispensable" avant tout bonus |
| react-native-maps sur Expo Go peut avoir des limites de rendu selon device de test en salle | Faible à moyen | Tester tôt sur device réel, pas seulement simulateur |
| Sur-scope lié au "budget illimité" du brief | Fort si mal géré | Le vrai budget contraignant est le temps, pas l'argent — CDC volontairement resserré sur l'indispensable + 3-4 bonus justifiés |

## 10. Planning (rappel des jalons du brief)

| Étape | Livrable | Échéance |
| --- | --- | --- |
| 1 | Programmation + thématique édition 2027 | Fin jour 1 |
| 2 | Ce cahier des charges | Fin jour 1 |
| 3 | Maquettes écrans principaux | Début jour 2 |
| 4 | Application testable | Jour 2 → jour 3 |
| 5 | Démo (15 min) | Vendredi |

## 11. Charte graphique (référence)

Source : *DevDays — Charte graphique v1.0*. Reprise ici pour que l'app (écrans, thèmes) reste alignée sans avoir à rouvrir le PDF.

### 11.1 Palette de couleurs

| Couleur | Hex | Usage |
| --- | --- | --- |
| **Orange Bombe** | `#FEA625` | Fond signature, blocs d'énergie, contraste sur fond clair ou texte |
| **Vert Terrain** | `#40B87C` | Couleur de hiérarchie — boutons secondaires, tags, validations, illustrations |
| **Marine Nuit** | `#0A2143` | Texte principal, contours épais, fonds sombres, sections de marque |
| **Corail Flash** (accent) | `#FF4F6A` | Alertes, live/urgent, badges promo, call-to-action |
| **Cyan Volt** (accent) | `#38D0F8` | Liens, infos, éléments interactifs, highlighter sur fonds sombres |
| **Craie** (neutre) | `#FFF5E6` | Fond clair, surfaces |
| **Gris Béton** (neutre) | `#D8D6D0` | Textes secondaires, bordures |
| **Encre** (neutre) | `#0A1414` | Texte sur fond clair |

### 11.2 Typographie

- **Titrage / affichage** : Bricolage Grotesque (700)
- **Texte courant** : Hanken Grotesk — lisible, réservée aux paragraphes, listes, prix et UI

Échelle recommandée :

| Usage | Police / graisse | Taille |
| --- | --- | --- |
| Titre d'affichage | Bricolage 700 | 64–72px |
| Titre de section | Bricolage 700 | 28–36px |
| Sous-titre / accroche | Hanken 600 | 20–24px |
| Corps de texte | Hanken 400, interligne 1.4 | 16–18px |
| Label / surtitre | Space Mono 700, uppercase, tracking 0.05em | 10–12px |

### 11.3 Usage du logo

- **Zone de protection** : marge tout autour égale à la hauteur du "D" de DEVDAYS avant tout autre élément
- **Taille minimale** : 96px de large (écran/app), 22mm (print)
- **Versions** : verte (principale) et orange (alternative)
- Adaptable sur fond clair, fond sombre et fond coloré (orange signature = composition d'origine)
- **Interdits** : ne pas déformer/étirer, pas de fond à contraste insuffisant (ex. sur vert), pas de cadre, pas de niveaux de gris, pas d'ombre portée floue

### 11.4 Style graphique — esprit "sticker"

- **Coins arrondis** : rayon 16–24px (boutons, cards)
- **Contours marine** : traits épais 3–4px sur les éléments clés
- **Ombres dures** : décalage 4px × 4px, jamais de flou/ombre douce
- **Formes & confetti** : ronds/triangles en touches d'ambiance festival, avec parcimonie

Tags de ton : énergique, bombé/street, contrasté, généreux, festif, pro & lisible.

### 11.5 Implication pour l'implémentation

- Centraliser la palette dans une seule source (ex. `constants/theme.js`) plutôt que des hex en dur dans chaque écran — cohérence + facilite un éventuel dark mode.
- Vérifier le contraste texte/fond systématiquement pour Orange Bombe et Vert Terrain sur Marine Nuit (rappel §8 — lisibilité = valeur de charte).
- `react-native-maps` : Markers stylés avec contour marine + couleur par type (scène/stand/sponsor) pour rester dans l'esprit "sticker".
- Boutons/cards : `borderRadius` 16–24, `borderWidth` 3–4 marine, `shadowOffset` fixe {4,4} sans `shadowRadius`/flou (ou équivalent `elevation` stylée en dur côté Android).