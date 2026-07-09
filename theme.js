// Design tokens partagés de la charte graphique DevDays (palette + typo).
// Toute couleur ou police utilisée dans l'app doit venir d'ici plutôt que
// d'être redéfinie localement dans chaque écran, pour éviter toute dérive.

export const COLORS = {
    orangeBombe: '#FDAE21',  // fond signature, blocs d'énergie
    vertTerrain: '#459051',  // hiérarchie — boutons secondaires, tags, validations
    marineNuit: '#041141',   // texte principal, contours épais, fonds sombres
    coraiFlash: '#FF5A5F',   // accent — alertes, live/urgent, badges promo, CTA
    cyanVolt: '#38C6E0',     // accent — liens, infos, éléments interactifs
    craie: '#F7F2E8',        // neutre — fond clair, surfaces
    grisBeton: '#7C828D',    // neutre — textes secondaires, bordures
    encre: '#041141',        // neutre — texte sur fond clair
};

// Bricolage Grotesque (titres, lettrage bombé), Hanken Grotesk (texte
// courant, labels UI), Space Mono (label / surtitre).
export const FONTS = {
    displayExtraBold: 'BricolageGrotesque_800ExtraBold', // titre d'affichage / logo
    displayBold: 'BricolageGrotesque_700Bold',           // titre de section
    bodyBold: 'HankenGrotesk_700Bold',                   // texte UI en gras
    bodySemiBold: 'HankenGrotesk_600SemiBold',           // sous-titre / accroche
    bodyRegular: 'HankenGrotesk_400Regular',             // corps de texte (interligne 1.6)
    labelMono: 'SpaceMono_700Bold',                      // label / surtitre — tracking 0.2em
};

// Liste à passer telle quelle à useFonts() dans chaque écran qui en a besoin.
export const FONT_ASSETS_KEYS = [
    'BricolageGrotesque_700Bold',
    'BricolageGrotesque_800ExtraBold',
    'HankenGrotesk_400Regular',
    'HankenGrotesk_600SemiBold',
    'HankenGrotesk_700Bold',
    'SpaceMono_700Bold',
];