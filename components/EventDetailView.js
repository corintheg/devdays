import React from 'react';
import { View, Text, Pressable, ScrollView, Image, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme';
import { getFullDayLabel } from '../utils/festivalHelpers';

/**
 * Page détail d'un event — accessible depuis une carte de HomeView ou une
 * ligne de line-up de FeaturedEventDetail.
 *
 * `event` est un objet de `data.events` (voir HomeView.js pour le schéma
 * de base), enrichi de deux champs optionnels propres à cette page :
 *
 *   image: string,        // URL de la photo/visuel artiste. Si absent,
 *                          // un motif rayé de repli s'affiche à la place.
 *   description: string,  // paragraphe "À propos". Section masquée si absent.
 *   venueNote: string,     // ex. "Live surprise" — petite légende sous le
 *                          // nom de la scène. Optionnel.
 *
 * `onBack` et `onToggleFavorite` restent séparés du JSON (fonctions).
 */

function StripePlaceholder() {
    const stripes = Array.from({ length: 16 });
    return (
        <View style={styles.stripesContainer} pointerEvents="none">
            {stripes.map((_, i) => (
                <View key={i} style={[styles.stripe, { left: i * 42 - 120 }]} />
            ))}
        </View>
    );
}

export default function EventDetailView({ event, onBack, isFavorite, onToggleFavorite }) {
    if (!event) return null;

    const accentColor = COLORS[event.accentColorKey] ?? COLORS.orangeBombe;
    const fullDayLabel = event.day ? getFullDayLabel(event) : '';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.orangeBombe} />

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                <View style={styles.imageBanner}>
                    {event.image ? (
                        <Image
                            source={{ uri: event.image }}
                            style={StyleSheet.absoluteFillObject}
                            resizeMode="cover"
                        />
                    ) : (
                        <StripePlaceholder />
                    )}

                    <Pressable
                        onPress={onBack}
                        accessibilityRole="button"
                        accessibilityLabel="Retour"
                        hitSlop={8}
                        style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                    >
                        <Text style={styles.backChevron}>‹</Text>
                    </Pressable>

                    {!event.image ? (
                        <View style={styles.imagePlaceholderTag}>
                            <Text style={styles.imagePlaceholderText}>VISUEL ARTISTE</Text>
                        </View>
                    ) : null}
                </View>

                <View style={styles.body}>
                    {event.category ? (
                        <View style={[styles.categoryBadge, { backgroundColor: accentColor }]}>
                            <Text style={styles.categoryBadgeText}>✦ {event.category}</Text>
                        </View>
                    ) : null}

                    <Text style={styles.title}>{event.title}</Text>
                    {event.subtitle ? <Text style={styles.subtitle}>{event.subtitle}</Text> : null}

                    <View style={styles.infoCardsRow}>
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>HORAIRE</Text>
                            <Text style={styles.infoValue}>{event.time}</Text>
                            {fullDayLabel ? <Text style={styles.infoCaption}>{fullDayLabel}</Text> : null}
                        </View>

                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>SCÈNE</Text>
                            <Text style={styles.infoValue} numberOfLines={1}>
                                {event.venue?.name}
                            </Text>
                            {event.venueNote ? (
                                <Text style={styles.infoCaption}>{event.venueNote}</Text>
                            ) : null}
                        </View>
                    </View>

                    {event.description ? (
                        <>
                            <Text style={styles.aboutTitle}>À propos</Text>
                            <Text style={styles.aboutText}>{event.description}</Text>
                        </>
                    ) : null}
                </View>
            </ScrollView>

            <View style={styles.favoriteBarOuter}>
                <Pressable
                    onPress={onToggleFavorite}
                    accessibilityRole="button"
                    accessibilityLabel={
                        isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'
                    }
                    accessibilityState={{ selected: isFavorite }}
                    style={({ pressed }) => [styles.favoriteButton, pressed && styles.pressed]}
                >
                    <Text style={[styles.favoriteHeart, isFavorite && styles.favoriteHeartActive]}>
                        {isFavorite ? '♥' : '♡'}
                    </Text>
                    <Text style={styles.favoriteLabel}>
                        {isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    </Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    scroll: {
        flex: 1,
    },
    pressed: {
        opacity: 0.8,
    },

    // ---------- Bannière image ----------
    imageBanner: {
        height: 280,
        backgroundColor: COLORS.orangeBombe,
        overflow: 'hidden',
        borderBottomWidth: 3,
        borderBottomColor: COLORS.marineNuit,
    },
    stripesContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    stripe: {
        position: 'absolute',
        top: -80,
        width: 22,
        height: 480,
        backgroundColor: 'rgba(247,242,232,0.4)',
        transform: [{ rotate: '35deg' }],
    },
    backButton: {
        position: 'absolute',
        top: 12,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: COLORS.craie,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backChevron: {
        fontFamily: FONTS.bodyBold,
        fontSize: 22,
        color: COLORS.marineNuit,
    },
    imagePlaceholderTag: {
        position: 'absolute',
        bottom: 16,
        left: 20,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    imagePlaceholderText: {
        fontFamily: FONTS.labelMono,
        fontSize: 11,
        letterSpacing: 1.2,
        color: COLORS.craie,
    },

    // ---------- Corps ----------
    body: {
        backgroundColor: COLORS.craie,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 32,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 8,
        marginBottom: 14,
    },
    categoryBadgeText: {
        fontFamily: FONTS.labelMono,
        fontSize: 12,
        letterSpacing: 1,
        color: COLORS.craie,
    },
    title: {
        fontFamily: FONTS.displayExtraBold,
        fontSize: 28,
        color: COLORS.marineNuit,
        marginBottom: 4,
    },
    subtitle: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 16,
        color: COLORS.vertTerrain,
        marginBottom: 22,
    },

    infoCardsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 26,
    },
    infoCard: {
        flex: 1,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        borderRadius: 18,
        backgroundColor: COLORS.craie,
        padding: 14,
    },
    infoLabel: {
        fontFamily: FONTS.labelMono,
        fontSize: 11,
        letterSpacing: 1.5,
        color: COLORS.grisBeton,
        marginBottom: 6,
    },
    infoValue: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.marineNuit,
    },
    infoCaption: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 13,
        color: COLORS.grisBeton,
        marginTop: 2,
    },

    aboutTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.marineNuit,
        marginBottom: 8,
    },
    aboutText: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        lineHeight: 24,
        color: COLORS.grisBeton,
    },

    // ---------- Barre favoris (fixe en bas) ----------
    favoriteBarOuter: {
        backgroundColor: COLORS.craie,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
    },
    favoriteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: COLORS.orangeBombe,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        borderRadius: 20,
        paddingVertical: 16,
    },
    favoriteHeart: {
        fontSize: 18,
        color: COLORS.marineNuit,
    },
    favoriteHeartActive: {
        color: COLORS.coraiFlash,
    },
    favoriteLabel: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.marineNuit,
    },
});