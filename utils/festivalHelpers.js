// Métadonnées des 4 jours du festival, partagées entre HomeView (sélecteur
// de jour) et EventDetailView (libellé complet affiché sur la fiche event).
export const DAYS = [
    { key: 'jeu09', label: 'JEU', date: '09', fullLabel: 'Jeudi 9 juillet' },
    { key: 'ven10', label: 'VEN', date: '10', fullLabel: 'Vendredi 10 juillet' },
    { key: 'sam11', label: 'SAM', date: '11', fullLabel: 'Samedi 11 juillet' },
    { key: 'dim12', label: 'DIM', date: '12', fullLabel: 'Dimanche 12 juillet' },
];

export function getFullDayLabel(event) {
    return DAYS.find((d) => d.key === event?.day)?.fullLabel ?? '';
}
