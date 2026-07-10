import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { COLORS, FONTS } from '../theme';

export default function PartnerDetail({ partner, onBack, onViewOnMap }) {
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

    if (!partner) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <Text style={styles.notFound}>Partenaire introuvable.</Text>
            </SafeAreaView>
        );
    }

    const brandColor = COLORS[partner.colorKey] ?? COLORS.cyanVolt;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={brandColor} />

            <View style={[styles.hero, { backgroundColor: brandColor }]}>
                <Pressable onPress={onBack} accessibilityRole="button" accessibilityLabel="Retour" style={styles.backButton} hitSlop={8}>
                    <Text style={styles.backGlyph}>‹</Text>
                </Pressable>

                <View style={styles.initialsBadge}>
                    <Text style={styles.initialsText}>{partner.initials}</Text>
                </View>
                <Text style={styles.heroTitle}>{partner.name}</Text>
                <View style={styles.categoryTag}>
                    <Text style={styles.categoryTagText}>{partner.category}</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
                <Text style={styles.sectionLabel}>Sur le stand</Text>
                <Text style={styles.description}>{partner.description}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoCardOuter}>
                        <View style={styles.infoCardShadow} pointerEvents="none" />
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>EMPLACEMENT</Text>
                            <Text style={styles.infoValue}>{partner.location}</Text>
                        </View>
                    </View>
                    <View style={styles.infoCardOuter}>
                        <View style={styles.infoCardShadow} pointerEvents="none" />
                        <View style={styles.infoCard}>
                            <Text style={styles.infoLabel}>OUVERT</Text>
                            <Text style={styles.infoValue}>{partner.hours}</Text>
                        </View>
                    </View>
                </View>

                <Pressable
                    onPress={() => onViewOnMap?.(partner)}
                    style={({ pressed }) => [styles.mapButton, pressed && styles.pressed]}
                >
                    <Text style={styles.mapButtonText}>Voir sur la carte</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    notFound: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        color: COLORS.encre,
        padding: 20,
    },

    hero: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 24,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.marineNuit,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    backGlyph: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.marineNuit,
    },
    initialsBadge: {
        width: 56,
        height: 56,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        backgroundColor: COLORS.craie,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    initialsText: {
        fontFamily: FONTS.displayBold,
        fontSize: 18,
        color: COLORS.marineNuit,
    },
    heroTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.marineNuit,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        marginTop: 8,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    categoryTagText: {
        fontFamily: FONTS.labelMono,
        fontSize: 11,
        letterSpacing: 1,
        color: COLORS.craie,
    },

    body: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionLabel: {
        fontFamily: FONTS.labelMono,
        fontSize: 12,
        letterSpacing: 1.5,
        color: COLORS.grisBeton,
        marginBottom: 8,
    },
    description: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.encre,
        marginBottom: 20,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 14,
        marginBottom: 24,
    },
    infoCardOuter: {
        flex: 1,
    },
    infoCardShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 16,
        transform: [{ translateX: 3 }, { translateY: 3 }],
    },
    infoCard: {
        backgroundColor: COLORS.craie,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        padding: 14,
    },
    infoLabel: {
        fontFamily: FONTS.labelMono,
        fontSize: 10,
        letterSpacing: 1,
        color: COLORS.grisBeton,
        marginBottom: 4,
    },
    infoValue: {
        fontFamily: FONTS.bodyBold,
        fontSize: 14,
        color: COLORS.marineNuit,
    },
    mapButton: {
        backgroundColor: COLORS.marineNuit,
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    mapButtonText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 15,
        color: COLORS.craie,
    },
    pressed: { opacity: 0.8 },
});
