import React from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { COLORS, FONTS } from '../theme';

function PartnerCard({ partner, onPress }) {
    const brandColor = COLORS[partner.colorKey] ?? COLORS.cyanVolt;

    return (
        <View style={styles.cardOuter}>
            <View style={styles.cardShadow} pointerEvents="none" />
            <Pressable
                onPress={() => onPress(partner)}
                accessibilityRole="button"
                accessibilityLabel={partner.name}
                style={({ pressed }) => [styles.card, pressed && styles.pressed]}
            >
                <View style={[styles.initialsBadge, { backgroundColor: brandColor }]}>
                    <Text style={styles.initialsText}>{partner.initials}</Text>
                </View>

                <View style={styles.cardBody}>
                    <Text style={styles.partnerName}>{partner.name}</Text>
                    <View style={styles.categoryTag}>
                        <Text style={styles.categoryTagText}>{partner.category}</Text>
                    </View>
                </View>

                <Text style={styles.chevron}>Stand ›</Text>
            </Pressable>
        </View>
    );
}

export default function PartnersScreen({ data, onPartnerPress }) {
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

    const partners = data?.partners ?? [];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.cyanVolt} />

            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Partenaires</Text>
                <Text style={styles.heroSubtitle}>Stands, cadeaux & bons plans sur le site</Text>
            </View>

            <FlatList
                data={partners}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <PartnerCard partner={item} onPress={onPartnerPress} />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.craie,
    },
    hero: {
        backgroundColor: COLORS.cyanVolt,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.marineNuit,
    },
    heroTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.marineNuit,
    },
    heroSubtitle: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 14,
        color: COLORS.marineNuit,
        marginTop: 4,
    },
    listContent: {
        padding: 20,
        gap: 14,
    },

    cardOuter: {},
    cardShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.marineNuit,
        borderRadius: 18,
        transform: [{ translateX: 4 }, { translateY: 4 }],
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.craie,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        padding: 14,
        gap: 14,
    },
    pressed: { opacity: 0.8 },
    initialsBadge: {
        width: 48,
        height: 48,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialsText: {
        fontFamily: FONTS.displayBold,
        fontSize: 16,
        color: COLORS.craie,
    },
    cardBody: {
        flex: 1,
    },
    partnerName: {
        fontFamily: FONTS.displayBold,
        fontSize: 17,
        color: COLORS.marineNuit,
    },
    categoryTag: {
        alignSelf: 'flex-start',
        marginTop: 6,
        backgroundColor: COLORS.grisBeton,
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 3,
    },
    categoryTagText: {
        fontFamily: FONTS.labelMono,
        fontSize: 10,
        letterSpacing: 1,
        color: COLORS.craie,
    },
    chevron: {
        fontFamily: FONTS.bodyBold,
        fontSize: 13,
        color: COLORS.grisBeton,
    },
});
