import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme';
import EventCard from './EventCard';

/**
 * Page "Mes favoris". `favoriteEvents` est un sous-ensemble de `data.events`
 * (voir HomeView.js pour le schéma) — filtré côté appelant selon l'état de
 * favoris partagé de l'app (Context, AsyncStorage, etc.). Ce composant ne
 * connaît lui-même aucun format de stockage, juste la liste déjà résolue.
 */

function EmptyState({ onExplorePress }) {
    return (
        <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
                <Text style={styles.emptyIconGlyph}>♥</Text>
            </View>

            <Text style={styles.emptyTitle}>Rien ici... pour l'instant !</Text>
            <Text style={styles.emptyDescription}>
                Touche le cœur sur un concert ou une animation pour le garder sous la
                main tout le festival.
            </Text>

            <Pressable
                onPress={onExplorePress}
                accessibilityRole="button"
                accessibilityLabel="Explorer le programme"
                style={({ pressed }) => [styles.exploreButton, pressed && styles.pressed]}
            >
                <Text style={styles.exploreButtonText}>Explorer le programme</Text>
            </Pressable>
        </View>
    );
}

export default function FavoritesView({
                                          favoriteEvents,
                                          onEventPress,
                                          onToggleFavorite,
                                          onExplorePress,
                                      }) {
    const events = favoriteEvents ?? [];
    const hasFavorites = events.length > 0;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={COLORS.coraiFlash} />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes favoris</Text>
                <Text style={styles.headerSubtitle}>
                    {hasFavorites
                        ? `${events.length} favori${events.length > 1 ? 's' : ''}`
                        : 'Aucun favori pour le moment'}
                </Text>
            </View>

            {hasFavorites ? (
                <ScrollView
                    style={styles.body}
                    contentContainerStyle={styles.bodyContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.eventsList}>
                        {events.map((event) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                isFavorite
                                onPress={() => onEventPress?.(event)}
                                onToggleFavorite={() => onToggleFavorite?.(event)}
                            />
                        ))}
                    </View>
                </ScrollView>
            ) : (
                <View style={styles.body}>
                    <EmptyState onExplorePress={onExplorePress} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    pressed: {
        opacity: 0.8,
    },

    // ---------- Header ----------
    header: {
        backgroundColor: COLORS.coraiFlash,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 20,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.marineNuit,
    },
    headerTitle: {
        fontFamily: FONTS.displayExtraBold,
        fontSize: 32,
        color: COLORS.craie,
    },
    headerSubtitle: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 15,
        color: COLORS.craie,
        marginTop: 4,
    },

    // ---------- Corps ----------
    body: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    bodyContent: {
        padding: 20,
        paddingBottom: 40,
    },
    eventsList: {
        gap: 16,
    },

    // ---------- État vide ----------
    emptyState: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 64,
    },
    emptyIconWrap: {
        width: 96,
        height: 96,
        borderRadius: 24,
        backgroundColor: COLORS.orangeBombe,
        borderWidth: 3,
        borderColor: COLORS.marineNuit,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
    },
    emptyIconGlyph: {
        fontSize: 40,
        color: COLORS.marineNuit,
    },
    emptyTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.marineNuit,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyDescription: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.grisBeton,
        textAlign: 'center',
        marginBottom: 28,
    },
    exploreButton: {
        backgroundColor: COLORS.vertTerrain,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    exploreButtonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 16,
        color: COLORS.marineNuit,
    },
});