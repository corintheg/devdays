import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { COLORS, FONTS } from '../theme';

/**
 * Carte d'event réutilisable — utilisée dans HomeView (liste du jour) et
 * FavoritesView (liste des favoris). `event` suit le schéma documenté
 * dans HomeView.js (id, time, title, subtitle, category, venue, accentColorKey...).
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

export default function EventCard({ event, isFavorite, onPress, onToggleFavorite }) {
    const accentColor = COLORS[event.accentColorKey] ?? COLORS.orangeBombe;
    const venueStyle = getVenueTagStyle(event.venue?.colorKey);

    return (
        <View style={styles.outer}>
            <View style={styles.shadow} pointerEvents="none" />
            <Pressable
                onPress={onPress}
                accessibilityRole="button"
                accessibilityLabel={event.title}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
                <View style={[styles.accentBar, { backgroundColor: accentColor }]} />

                <View style={styles.card}>
                    <View style={styles.content}>
                        <View style={styles.tagsRow}>
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

                        <Text style={styles.title}>{event.title}</Text>
                        {event.subtitle ? <Text style={styles.subtitle}>{event.subtitle}</Text> : null}
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

const styles = StyleSheet.create({
    pressed: { opacity: 0.8 },
    outer: {
        // conteneur relatif à l'ombre dure ci-dessous
    },
    shadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 20,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    accentBar: {
        width: 5,
        borderRadius: 3,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: COLORS.craie,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        padding: 16,
    },
    content: {
        flex: 1,
        marginRight: 44, // laisse la place au bouton favori
    },
    tagsRow: {
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
    title: {
        fontFamily: FONTS.displayBold,
        fontSize: 19,
        color: COLORS.marineNuit,
    },
    subtitle: {
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