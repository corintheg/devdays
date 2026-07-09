# Reconciliation — PRD vs sources (Carte & Partenaires scope only)

Scope note: Programme, Détail événement, Favoris, Nuit Blanche are intentionally out of scope of the PRD (owned by the second developer) and are NOT flagged below except where they intersect directly with Carte/Partenaires (e.g. tab bar structure, navigation targets).

Method: full read of `INFOS/CAHIER_DES_CHARGES.md`; the embedded React mockup component was extracted from `INFOS/DevDays 2027 (standalone).html` (JSON-escaped rendered-HTML blob at the file's line 197) and decoded to inspect the actual markup, inline styles, `MARKERS`, `SPONSORS`, `LEGEND`, `KINDS` data structures and event handlers driving the Carte and Partenaires screens.

---

## A. Gaps vs `INFOS/CAHIER_DES_CHARGES.md`

1. **Sponsor data model field "logo" (and optional "niveau") silently dropped, undiscussed.** CDC §4 models `Sponsor { id, nom, logo, niveau(optionnel), lien vers stand }`. The PRD's partner fields (FR-6 liste, FR-7 détail, glossaire §3 "Fiche Partenaire") never mention a logo/visual-identity field or a sponsor tier/level field. This isn't listed as an `[ASSUMPTION]` either — it's just absent, unlike the POI-model deviation which the PRD explicitly flags and confirms in §9. Should either be added as a requirement (partner needs a visual identity element) or explicitly logged as a dropped-field assumption.

2. **CDC's `react-native-maps` risk (§9 table row 3) becomes moot without acknowledgment.** The PRD confirms (§9, "confirmé par l'utilisateur") that the Carte abandons `react-native-maps`/lat-lng in favor of an illustrated map — a legitimate, explicitly-confirmed pivot away from CDC §7's "stack imposée, non négociable." But the CDC §9 risk "react-native-maps sur Expo Go peut avoir des limites de rendu selon device" is left dangling: the PRD's §9 index of assumptions doesn't note that this specific CDC-identified risk is now obsolete/superseded, which could confuse whoever reads both documents side by side (e.g. an architecture reviewer wondering if the risk still applies).

3. **CDC §11.5 marker styling guidance ("Markers stylés avec contour marine + couleur par type... esprit sticker") not carried into FR-2/FR-4 as a testable requirement.** The PRD's FR-2 says colors/icons must be "cohérente avec la charte graphique" in general terms, but doesn't state the specific sticker-style requirement (thick navy contour + hard offset shadow on every marker, legend swatch, and POI bottom-sheet icon) that the CDC explicitly calls out for markers. The mockup (see §B.5 below) implements this precisely, so it's a real, checkable requirement that the PRD under-specifies.

4. **CDC §5.2 "Intégration sponsors contextuelle" (bonus, conseillé) not explicitly credited/traced.** The CDC's justification for this bonus — "logo sponsor affiché sur le stand associé sur la carte + un stand sponsor cliquable, plutôt qu'un simple écran de logos" — is essentially what FR-1/FR-5/FR-7 deliver (partner markers on the map + clickable navigation to detail). The PRD never references this CDC bonus item or explains that it's the target being fulfilled, which weakens traceability from CDC to PRD (useful for the soutenance where bonus justification matters, per CDC §5.2 intro).

No other material gaps found vs the CDC for Carte/Partenaires — the offline-first framing, non-geolocation exclusion, FlatList performance note, and contrast/lisibilité constraint are all correctly carried into the PRD.

---

## B. Gaps vs `INFOS/DevDays 2027 (standalone).html` (decoded mockup component)

The mockup's actual data/markup (not just visual impression) reveals several concrete details the PRD should have captured:

1. **Tab bar is confirmed as 4 permanent items in the mockup, including Partenaires — this isn't an open question, it's already decided in the shared artifact.** The mockup's tab bar renders exactly: Programme, Carte, Favoris (heart, with badge count), **Partenaires (star icon, permanent 4th item)** — `goSponsors` is wired as a first-class tab alongside the other three. The PRD's §8 Question 2 and §4.2 FR-8 note treat "3 vs 4 tab items, Partenaires permanent or not" as fully open and "to decide with the other developer." Since both developers share this same mockup, the PRD should state this as the mockup's default/observed answer (with the caveat that it still needs sign-off since it touches shared navigation), not as a fully blank open question.

2. **Marker granularity is NOT a binary "individual vs village" choice in the mockup — it's a concrete hybrid the PRD's Question 1 misrepresents.** The mockup's `MARKERS` array (16 entries) includes both a grouped `'Village Partenaires'` marker AND one individually-placed sponsor marker (`'PixelBank'`), while the other 5 of 6 sponsors (Volteck Énergie, Craft Cola, MobiGo, GreenLoop, SonarTech) have no dedicated marker at all and are only reachable via the village marker or the Partenaires list. The PRD's §8 Q1 and FR-7 frame this as one global decision to be taken ("un Marker par partenaire OU un marker village groupé"), but the actual demo data already shows a mixed model (1 singled-out sponsor + a catch-all village marker for the rest). This directly affects FR-7's "Voir sur la carte" behavior, which needs per-partner routing logic, not a single global switch — a materially different (and more complex) requirement than what's written.

3. **Markers display a persistent name label above the icon at all times, not only inside the Fiche POI on tap.** In the mockup, each marker renders a small dark pill with the POI's `label` (name) floating above the circular icon marker at all times (`m.label` line, always visible, separate from the tap-triggered bottom sheet). The PRD's FR-1/FR-2/FR-4 only describe the marker as an icon+color, with the name appearing in the Fiche POI on tap (FR-4) — it never mentions the always-visible name label on the map itself, which is a distinct, testable visual requirement (and also relevant to the SM-C1 "don't overcrowd the map" counter-metric, since 16 always-on text labels is a real density/readability constraint the PRD should weigh explicitly).

4. **Pinch-to-zoom is presented as the primary/expected gesture in the mockup's own UI copy, contradicting the PRD's "hors périmètre" framing.** The mockup's Carte screen shows on-screen help text: *"Pince pour zoomer, ou utilise + / − pour voir tout le site"* (pinch to zoom, or use +/− to see the whole site) — i.e. the mockup's own in-app instructions treat pinch-to-zoom as the normal/first-mentioned interaction, with the buttons as an alternative for the full-site view. The PRD's FR-3 keeps only the +/− buttons and explicitly moves pinch-to-zoom to "Hors périmètre" for V1. That may still be the right call for a 2-day school build, but the PRD should acknowledge the mockup's own copy assumes pinch is available, rather than silently dropping it — otherwise a literal re-implementation of the mockup's UI text would be inconsistent with FR-3.

5. **Marker/legend/bottom-sheet "sticker" chrome (thick navy border + hard offset shadow) is a concrete, mockup-verified visual spec missing from FR-2/FR-4.** Every marker circle, legend swatch, and the Fiche POI icon badge in the mockup uses a consistent `border: 3px solid #0A2143` + hard `box-shadow` (no blur) — matching CDC §11.4's "esprit sticker" style guide. The PRD's FR-2 (legend) and FR-4 (Fiche POI) describe content (icon, color, name, type, description) but not this specific chrome, even though it's visually load-bearing and directly testable. (Same underlying gap as §A.3, from the mockup's side.)

6. **Sponsors have individual brand colors + 2-letter initials as a logo placeholder, used consistently across list, detail, and header — not mentioned anywhere in FR-6/FR-7.** Each of the 6 `SPONSORS` entries carries its own `color`/`textColor`/`initials` (e.g. Volteck Énergie = orange/navy "VE", SonarTech = navy/cyan "ST"), rendered as a badge in the partner list (FR-6) and as the colored header + monogram in the partner detail screen (FR-7). The PRD's field lists for FR-6 ("nom, catégorie, lien détail") and FR-7 ("nom, catégorie, description, emplacement, horaires") omit this visual-identity element entirely, even though it's a first-class, reused visual across both screens in the mockup (and ties back to §A.1's dropped "logo" field from the CDC).

7. **Map marker color for partner-type POIs is generic (shared cyan "sponsor kind" color), decoupled from each sponsor's own brand color used in the list/detail — worth flagging as a design decision, not just an implementation detail.** The `PixelBank` individual marker on the map uses the generic sponsor-kind cyan (`#38D0F8`), not PixelBank's own brand color (`#40B87C` in the SPONSORS list/detail). The PRD doesn't address whether map markers should ever reflect per-sponsor branding vs. staying on the uniform 7-type palette (FR-2) — worth an explicit note since it affects whether "Village Partenaires" vs. individual sponsor markers are visually distinguishable at a glance beyond the label text.

---

## Summary table

| # | Source | Gap | PRD section affected |
|---|--------|-----|----------------------|
| A1 | CDC §4 | Sponsor "logo"/"niveau" fields dropped, unflagged | FR-6, FR-7, §3 glossaire |
| A2 | CDC §9 | `react-native-maps` risk left dangling, not marked obsolete | §9 index |
| A3 | CDC §11.5 | "Sticker" marker chrome (contour marine + hard shadow) not made a testable requirement | FR-2, FR-4 |
| A4 | CDC §5.2 | Bonus "intégration sponsors contextuelle" not traced/credited | §4.1/§4.2 intro |
| B1 | Mockup tab bar | 4-item tab bar incl. Partenaires already exists in shared mockup, treated as fully open | §8 Q2, FR-8 |
| B2 | Mockup MARKERS data | Village + individual marker are a hybrid in the demo data, not a binary choice | §8 Q1, FR-7 |
| B3 | Mockup marker markup | Persistent name label above marker (always visible) not documented | FR-1, FR-2, FR-4 |
| B4 | Mockup Carte hint text | UI copy assumes pinch-to-zoom; contradicts FR-3's "hors périmètre" | FR-3, §6.2 |
| B5 | Mockup marker/legend/sheet styles | Sticker chrome (border/shadow) not specified (same as A3) | FR-2, FR-4 |
| B6 | Mockup SPONSORS data | Per-sponsor color + initials badge (logo placeholder) unmentioned | FR-6, FR-7 |
| B7 | Mockup MARKERS vs SPONSORS colors | Map uses generic sponsor-type color vs. sponsor's own brand color — undecided | FR-2, FR-7 |
