# PRD Quality Review — DevDays 2027 — App Visiteur (périmètre Carte & Partenaires)

## Overall verdict

This is a disciplined, well-scoped PRD for what it is: a two-feature slice of a larger app, written by one of two co-developers, with real deference to the shared parts owned by the teammate. The scope boundaries are honest, assumptions are tagged and indexed, and the one genuine open tension (marker granularity for partners) is surfaced rather than smoothed over. The main weaknesses are mechanical (a dangling `FR-9` reference that doesn't exist) and a couple of unbound NFR adjectives ("sans dégradation de performance," "reste lisible") that would benefit from a number, even a rough one, given this feeds architecture and stories.

## Decision-readiness — strong

The PRD names its central undecided trade-off directly rather than pretending it's resolved: marker granularity for partners (one marker per sponsor vs. a grouped "village partenaires" marker) is flagged in the Glossary (§3), FR-5, FR-7, FR-8's notes, §6.2, §8 Q1, and §9 — consistently, with the consequence spelled out ("le détail par partenaire individuel sur la carte est différé"). The tab-bar structure decision (§4.2 note, §8 Q2) is likewise named as a cross-team dependency with an owner ("à synchroniser avec lui avant l'architecture"), not buried as a "consideration." `[NOTE FOR PM]` callouts land on real tensions (FR-8, marker count) rather than safe checkpoints.

### Findings
- **low** Open Question 3 ("Interface de navigation Carte → Programme," §8) restates FR-5's own dependency note almost verbatim rather than adding a new angle — minor redundancy, not a decision-readiness failure. *Fix:* could be merged into the FR-5 note or left as a pointer only.

## Substance over theater — adequate

Three personas (Marco, Léa, Sami), each tied to a distinct UJ and driving a different navigational path (POI → info only, POI → Partenaires, POI → Programme) — no persona theater. The Vision (§1) is reasonably specific to this festival (2.5M attendees, offline-first due to no backend from the infra vendor, illustrated map vs. GPS) rather than generic boilerplate. The NFR on marker contrast (§4.1) names actual palette colors ("orange bombe... à tester sur fond marine nuit") instead of a generic "must be accessible."

### Findings
- **medium** FR-6's performance clause — "sans dégradation de performance (`FlatList`)" — is the one spot that reads as boilerplate: it names an implementation detail (FlatList) but no actual bound (frame rate, scroll jank threshold), and at 6 demo items the risk it's guarding against is close to zero anyway. *Fix:* either drop the performance clause (list of 6 items doesn't need it) or replace with a concrete target if it's meant to generalize beyond the demo dataset.

## Strategic coherence — adequate

There's a real thesis: orientation without connectivity/GPS, and sponsor visibility without ad-like intrusion (§1, tying back to the CDC's stated goal). Feature order (Carte before Partenaires) follows from the UJs, not from ease. SM-1 and SM-3 test the thesis's actual mechanics (tap-count to information, offline function) rather than vanity metrics; SM-C1 is a genuine counter-metric that constrains SM-2 (don't over-densify the map for readability's sake). The metrics are intentionally qualitative/demo-oriented, which the PRD states up front (§7) — appropriate calibration for a school-project stakes level, not a dodge.

## Done-ness clarity — thin

Most FRs carry testable consequences (FR-1's 16-marker threshold, FR-3's zoom-doesn't-hide-markers rule, FR-4's open/close behavior). Two gaps stand out:
- FR-2's non-functional clause — "Le contraste des couleurs de Markers... doit rester lisible en extérieur / plein soleil" — names the right concern and even the specific colors to test, but "doit rester lisible" has no bound (no contrast ratio, no lux condition, no pass/fail test). This is exactly the kind of adjective-without-threshold the rubric flags, even though it's dressed up with specifics elsewhere in the same sentence.
- FR-6's performance clause (see above) is unbound in the same way.

### Findings
- **medium** FR-2 non-functional requirement ("doit rester lisible en extérieur / plein soleil") — no measurable threshold (e.g., minimum contrast ratio against the charte graphique background colors). *Fix:* add a concrete bound, e.g. "contrast ratio ≥ 3:1 against fond marine nuit for orange/vert markers," even if the number is a placeholder to confirm with the graphic charter.
- **medium** FR-6 "sans dégradation de performance" — unbound adjective attached to a 6-item list where the risk is negligible; reads as inherited boilerplate from the CDC's list-performance constraint rather than something specific to this screen. *Fix:* drop or replace with a real number if it's meant to survive dataset growth.

## Scope honesty — strong

§5 Non-Goals is substantive, not filler (explicitly rules out `react-native-maps`/lat-lng, user geolocation, network updates, user accounts, paid sponsor placement — each tied to a CDC decision, not asserted blind). `[ASSUMPTION]` tags are used precisely (village-partenaires grouping, tab-bar placement, POI data-model choice) and all four round-trip into the Index (§9). Open-items density (4 questions, ~4 assumptions, 2 NOTE FOR PM) is proportionate to a two-feature, cross-team-dependent slice at school-project stakes — not overloaded for what it is.

## Downstream usability — thin

The PRD explicitly states it "sert de base à l'architecture technique et au découpage en stories" (§0), so this dimension carries real weight, not just hygiene. Glossary terms (POI, Marker, Fiche POI, Village Partenaires) are used consistently across sections. However:

### Findings
- **high** §8 Question 1 references "**FR-9**" ("Impacte FR-5, FR-7, FR-9") but the PRD only defines FR-1 through FR-8 — there is no FR-9. This is a broken cross-reference in a document meant to feed architecture/story-splitting; a downstream reader will either invent an FR-9 or silently ignore the reference. *Fix:* correct to the intended FR number (likely FR-7, which already covers the marker reference in the partner detail sheet) or add the missing FR if one was dropped during editing.

## Shape fit — strong

This is squarely a consumer-app slice with meaningful UX, and UJs with named protagonists are load-bearing here — three UJs, each carrying its own persona and context inline, is proportionate (not over-formalized). The PRD correctly treats itself as a sub-scope of a larger multi-owner product: it repeatedly routes shared-navigation decisions (tab bar, cross-module linking) to "the other developer" rather than deciding them unilaterally, which is the right posture for a two-person team splitting a shared spec.

## Mechanical notes
- Broken cross-reference: §8 Q1 cites "FR-9," which doesn't exist (see Downstream usability finding above).
- ID continuity is otherwise clean: FR-1–FR-8 contiguous, no duplicates.
- Assumptions Index (§9) roundtrips correctly — all four inline `[ASSUMPTION]` tags (§1/§4.1 map style, §3/§4.1 FR-2 data model, UJ-2/FR-5/FR-7 marker granularity, FR-8 tab-bar status) appear in §9, and no §9 entries lack an inline tag.
- Glossary term usage is consistent (POI, Marker, Fiche POI, Partenaire/Sponsor, Village Partenaires) — no case/plural drift observed across §3, §4.1, §4.2.
- UJ protagonists (Marco, Léa, Sami) are named and carry context inline — no floating UJs.
