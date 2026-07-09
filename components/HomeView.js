import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    ScrollView,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono';

// Palette officielle DevDays (charte graphique v1.0)
const COLORS = {
    orangeBombe: '#FDAE21',  // fond signature, blocs d'énergie
    vertTerrain: '#459051',  // hiérarchie — boutons secondaires, tags, validations
    marineNuit: '#041141',   // texte principal, contours épais, fonds sombres
    coraiFlash: '#FF5A5F',   // accent — alertes, live/urgent, badges promo, CTA
    cyanVolt: '#38C6E0',     // accent — liens, infos, éléments interactifs
    craie: '#F7F2E8',        // neutre — fond clair, surfaces
    grisBeton: '#7C828D',    // neutre — textes secondaires, bordures
    encre: '#041141',        // neutre — texte sur fond clair
};

// Typographie officielle : Bricolage Grotesque (titres, lettrage bombé),
// Hanken Grotesk (texte courant, labels UI) et Space Mono (label / surtitre)
const FONTS = {
    displayExtraBold: 'BricolageGrotesque_800ExtraBold', // titre d'affichage / logo
    displayBold: 'BricolageGrotesque_700Bold',           // titre de section
    bodyBold: 'HankenGrotesk_700Bold',                   // texte UI en gras (boutons, filtres)
    bodySemiBold: 'HankenGrotesk_600SemiBold',           // sous-titre / accroche
    bodyRegular: 'HankenGrotesk_400Regular',             // corps de texte (interligne 1.6)
    labelMono: 'SpaceMono_700Bold',                      // label / surtitre — 12-13px, tracking 0.2em
};

const DAYS = [
    { key: 'jeu09', label: 'JEU', date: '09', fullLabel: 'Jeudi 9 juillet' },
    { key: 'ven10', label: 'VEN', date: '10', fullLabel: 'Vendredi 10 juillet' },
    { key: 'sam11', label: 'SAM', date: '11', fullLabel: 'Samedi 11 juillet' },
    { key: 'dim12', label: 'DIM', date: '12', fullLabel: 'Dimanche 12 juillet' },
];

const FILTERS = ['Tous', 'Concerts', 'Animations', 'Nuit Blanche'];

/**
 * Forme de données attendue pour la prop `data` (typiquement importée
 * depuis un fichier JSON local, ex. `data/devdaysData.json`) :
 *
 * {
 *   featuredEvent: {
 *     id: string,
 *     title: string,       // ex. "NUIT BLANCHE"
 *     subtitle: string,    // ex. "Sam 11 · dès 23h30 — le temps fort"
 *   } | null,
 *
 *   events: Array<{
 *     id: string,
 *     day: 'jeu09' | 'ven10' | 'sam11' | 'dim12',   // doit matcher la clé DAYS ci-dessus
 *     time: string,                                  // ex. "17:00"
 *     title: string,
 *     subtitle: string,
 *     category: string,                              // ex. "ANIMATION", affiché tel quel
 *     tags: string[],                                // ex. ["Animations"] — utilisé par les filtres du haut
 *     venue: {
 *       name: string,        // ex. "Chapiteau Craie"
 *       colorKey: string,    // une clé de COLORS, ex. "craie" | "cyanVolt" | "orangeBombe"
 *     },
 *     accentColorKey: string, // clé de COLORS pour la barre verticale à gauche de la carte
 *   }>,
 * }
 *
 * Les callbacks (`onFeaturedPress`, `onEventPress`) sont séparés de `data`
 * car des fonctions ne peuvent pas être stockées dans un JSON.
 */

// Tag de lieu : si la couleur associée est "craie" (proche du fond clair de
// la page), on bascule en style contour pour rester lisible ; sinon on
// remplit avec la couleur de la charte associée au lieu.
function getVenueTagStyle(colorKey) {
    if (!colorKey || colorKey === 'craie') {
        return {
            container: {
                backgroundColor: COLORS.craie,
                borderWidth: 2,
                borderColor: COLORS.marineNuit,
            },
            text: { color: COLORS.encre },
        };
    }
    return {
        container: { backgroundColor: COLORS[colorKey] ?? COLORS.craie },
        text: { color: COLORS.marineNuit },
    };
}

function FeaturedBanner({ event, onPress }) {
    if (!event) return null;

    return (
        <View style={styles.featuredWrap}>
            <View style={styles.featuredShadow} pointerEvents="none" />
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={event.title}
                style={({ pressed }) => [styles.featuredCard, pressed && styles.pressed]}
            >
                <View style={styles.featuredIcon}>
                    <Text style={styles.featuredIconGlyph}>✦</Text>
                </View>
                <View style={styles.featuredTextBlock}>
                    <Text style={styles.featuredTitle} numberOfLines={1}>
                        {event.title}
                    </Text>
                    <Text style={styles.featuredSubtitle} numberOfLines={1}>
                        {event.subtitle}
                    </Text>
                </View>
                <Text style={styles.featuredChevron}>›</Text>
            </Pressable>
        </View>
    );
}

function EventCard({ event, isFavorite, onPress, onToggleFavorite }) {
    const accentColor = COLORS[event.accentColorKey] ?? COLORS.orangeBombe;
    const venueStyle = getVenueTagStyle(event.venue?.colorKey);

    return (
        <View style={styles.eventCardOuter}>
            <View style={styles.eventCardShadow} pointerEvents="none" />
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={event.title}
                style={({ pressed }) => [styles.eventCardRow, pressed && styles.pressed]}
            >
                <View style={[styles.eventAccentBar, { backgroundColor: accentColor }]} />

                <View style={styles.eventCard}>
                    <View style={styles.eventContent}>
                        <View style={styles.eventTagsRow}>
                            <View style={styles.timeTag}>
                                <Text style={styles.timeTagText}>{event.time}</Text>
                            </View>

                            {event.venue?.name ? (
                                <View style={[styles.venueTag, venueStyle.container]}>
                                    <Text style={[styles.venueTagText, venueStyle.text]}>
                                        {event.venue.name}
                                    </Text>
                                </View>
                            ) : null}

                            {event.category ? (
                                <View style={styles.categoryTag}>
                                    <Text style={styles.categoryTagText}>{event.category}</Text>
                                </View>
                            ) : null}
                        </View>

                        <Text style={styles.eventTitle}>{event.title}</Text>
                        {event.subtitle ? (
                            <Text style={styles.eventSubtitle}>{event.subtitle}</Text>
                        ) : null}
                    </View>

                    <Pressable
                        onPress={onToggleFavorite}
                        hitSlop={8}
                        accessibilityRole="button"
                        accessibilityLabel={
                            isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
                        }
                        accessibilityState={{ selected: isFavorite }}
                        style={styles.favoriteButton}
                    >
                        <Text style={[styles.favoriteGlyph, isFavorite && styles.favoriteGlyphActive]}>
                            {isFavorite ? '♥' : '♡'}
                        </Text>
                    </Pressable>
                </View>
            </Pressable>
        </View>
    );
}

export default function HomeView({ data, onFeaturedPress, onEventPress }) {
    const [selectedDay, setSelectedDay] = useState('jeu09');
    const [selectedFilter, setSelectedFilter] = useState('Tous');
    const [favorites, setFavorites] = useState({});

    const [fontsLoaded] = useFonts({
        BricolageGrotesque_700Bold,
        BricolageGrotesque_800ExtraBold,
        HankenGrotesk_400Regular,
        HankenGrotesk_600SemiBold,
        HankenGrotesk_700Bold,
        SpaceMono_700Bold,
    });

    if (!fontsLoaded) {
        return null;
    }

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const selectedDayMeta = DAYS.find((d) => d.key === selectedDay);
    const dayEvents = (data?.events ?? []).filter((event) => {
        const matchesDay = event.day === selectedDay;
        const matchesFilter =
            selectedFilter === 'Tous' || (event.tags ?? []).includes(selectedFilter);
        return matchesDay && matchesFilter;
    });

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.orangeBombe} />

            {/* Hero fixe : logo, badge, sous-titre, jours, filtres */}
            <View style={styles.hero}>
                <View style={styles.ringDecor} pointerEvents="none" />
                <View style={styles.squareDecor} pointerEvents="none" />

                <View style={styles.headerRow}>
                    {/*
            NOTE : selon la charte, DEVDAYS est un logotype protégé avec
            zone de protection et taille minimale (76px sur app). Ce Text
            est une approximation de secours — remplace-le par le vrai
            logo (react-native-svg) dès que possible.
          */}
                    <Text style={styles.logo}>DEVDAYS</Text>

                    <View style={styles.yearBadgeWrap}>
                        <View style={styles.yearBadgeShadow} pointerEvents="none" />
                        <View style={styles.yearBadge}>
                            <Text style={styles.yearText}>2027</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.subtitle}>
                    Festival · 9 → 12 juillet · 2,5M festivaliers
                </Text>

                <View style={styles.divider} />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysRow}
                >
                    {DAYS.map((d) => {
                        const active = d.key === selectedDay;
                        return (
                            <Pressable
                                key={d.key}
                                onPress={() => setSelectedDay(d.key)}
                                accessibilityRole="button"
                                accessibilityLabel={`${d.label} ${d.date}`}
                                accessibilityState={{ selected: active }}
                                hitSlop={4}
                                style={({ pressed }) => [
                                    styles.dayPill,
                                    active ? styles.dayPillActive : styles.dayPillInactive,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Text style={[styles.dayLabel, active && styles.dayLabelActive]}>
                                    {d.label}
                                </Text>
                                <Text style={[styles.dayDate, active && styles.dayDateActive]}>
                                    {d.date}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersRow}
                >
                    {FILTERS.map((f) => {
                        const active = f === selectedFilter;
                        return (
                            <Pressable
                                key={f}
                                onPress={() => setSelectedFilter(f)}
                                accessibilityRole="button"
                                accessibilityLabel={f}
                                accessibilityState={{ selected: active }}
                                hitSlop={4}
                                style={({ pressed }) => [
                                    styles.filterChip,
                                    active ? styles.filterChipActive : styles.filterChipInactive,
                                    pressed && styles.pressed,
                                ]}
                            >
                                <Text style={[styles.filterText, active && styles.filterTextActive]}>
                                    {f}
                                </Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Corps scrollable : banner du temps fort + programme du jour */}
            <ScrollView
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
            >
                <FeaturedBanner
                    event={data?.featuredEvent}
                    onPress={() => onFeaturedPress?.(data?.featuredEvent)}
                />

                <View style={styles.dayHeaderRow}>
                    <Text style={styles.dayHeaderTitle}>{selectedDayMeta?.fullLabel}</Text>
                    <Text style={styles.dayHeaderCount}>
                        {dayEvents.length} événement{dayEvents.length > 1 ? 's' : ''}
                    </Text>
                </View>

                <View style={styles.eventsList}>
                    {dayEvents.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            isFavorite={!!favorites[event.id]}
                            onPress={() => onEventPress?.(event)}
                            onToggleFavorite={() => toggleFavorite(event.id)}
                        />
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },

    // ---------- Hero (fixe) ----------
    hero: {
        backgroundColor: COLORS.orangeBombe,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
        overflow: 'hidden',
    },
    ringDecor: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 170,
        height: 170,
        borderRadius: 85,
        borderWidth: 16,
        borderColor: 'rgba(10,33,67,0.08)',
    },
    squareDecor: {
        position: 'absolute',
        top: 130,
        right: 24,
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: COLORS.coraiFlash,
        transform: [{ rotate: '18deg' }],
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    logo: {
        fontFamily: FONTS.displayExtraBold,
        fontSize: 32,
        color: COLORS.vertTerrain,
        letterSpacing: 0.5,
        textShadowColor: COLORS.marineNuit,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 0,
    },
    yearBadgeWrap: {
        marginLeft: 12,
    },
    yearBadgeShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.craie,
        borderRadius: 20,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    yearBadge: {
        backgroundColor: COLORS.marineNuit,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    yearText: {
        fontFamily: FONTS.displayBold,
        color: COLORS.craie,
        fontSize: 18,
    },
    subtitle: {
        fontFamily: FONTS.bodySemiBold,
        marginTop: 14,
        color: COLORS.marineNuit,
        fontSize: 15,
        lineHeight: 21,
    },
    divider: {
        height: 2,
        backgroundColor: COLORS.marineNuit,
        marginTop: 18,
        marginHorizontal: -20,
    },
    daysRow: {
        flexDirection: 'row',
        gap: 12,
        paddingTop: 18,
        paddingBottom: 4,
    },
    dayPill: {
        minWidth: 76,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
    },
    dayPillActive: { backgroundColor: COLORS.marineNuit },
    dayPillInactive: { backgroundColor: COLORS.craie },
    dayLabel: {
        fontFamily: FONTS.labelMono,
        fontSize: 13,
        letterSpacing: 2.6,
        color: COLORS.encre,
    },
    dayLabelActive: { color: COLORS.orangeBombe },
    dayDate: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.encre,
        marginTop: 2,
    },
    dayDateActive: { color: COLORS.craie },
    filtersRow: {
        flexDirection: 'row',
        gap: 10,
        paddingTop: 14,
        paddingBottom: 4,
    },
    filterChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
    },
    filterChipActive: { backgroundColor: COLORS.marineNuit },
    filterChipInactive: { backgroundColor: COLORS.craie },
    filterText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.encre,
    },
    filterTextActive: { color: COLORS.orangeBombe },

    pressed: { opacity: 0.8 },

    // ---------- Corps scrollable ----------
    body: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    bodyContent: {
        padding: 20,
        paddingBottom: 40,
    },

    // Banner "temps fort"
    featuredWrap: {
        marginBottom: 24,
    },
    featuredShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.coraiFlash,
        borderRadius: 20,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    featuredCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.marineNuit,
        borderRadius: 20,
        padding: 14,
        gap: 14,
    },
    featuredIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: COLORS.coraiFlash,
        borderWidth: 2,
        borderColor: COLORS.craie,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featuredIconGlyph: {
        fontSize: 22,
        color: COLORS.craie,
    },
    featuredTextBlock: {
        flex: 1,
    },
    featuredTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 17,
        color: COLORS.craie,
        letterSpacing: 0.5,
    },
    featuredSubtitle: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 13,
        color: COLORS.cyanVolt,
        marginTop: 2,
    },
    featuredChevron: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.craie,
    },

    // En-tête de jour
    dayHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 14,
    },
    dayHeaderTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.marineNuit,
    },
    dayHeaderCount: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 13,
        color: COLORS.grisBeton,
    },

    // Liste d'events
    eventsList: {
        gap: 16,
    },
    eventCardOuter: {
        // conteneur relatif à l'ombre dure ci-dessous
    },
    eventCardShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 20,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    eventCardRow: {
        flexDirection: 'row',
        gap: 10,
    },
    eventAccentBar: {
        width: 5,
        borderRadius: 3,
    },
    eventCard: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.craie,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        padding: 16,
    },
    eventContent: {
        flex: 1,
        marginRight: 44, // laisse la place au bouton favori
    },
    eventTagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 10,
    },
    timeTag: {
        backgroundColor: COLORS.orangeBombe,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    timeTagText: {
        fontFamily: FONTS.displayBold,
        fontSize: 13,
        color: COLORS.marineNuit,
    },
    venueTag: {
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    venueTagText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 12,
    },
    categoryTag: {
        backgroundColor: COLORS.grisBeton,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    categoryTagText: {
        fontFamily: FONTS.labelMono,
        fontSize: 10,
        letterSpacing: 1,
        color: COLORS.craie,
    },
    eventTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 19,
        color: COLORS.marineNuit,
    },
    eventSubtitle: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 14,
        color: COLORS.grisBeton,
        marginTop: 2,
    },
    favoriteButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        backgroundColor: COLORS.craie,
        alignItems: 'center',
        justifyContent: 'center',
    },
    favoriteGlyph: {
        fontSize: 18,
        color: COLORS.marineNuit,
    },
    favoriteGlyphActive: {
        color: COLORS.coraiFlash,
    },
});