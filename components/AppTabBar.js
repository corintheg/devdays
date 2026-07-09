import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme';

// Tab bar "sticker" à 4 items (Programme / Carte / Favoris / Partenaires),
// conforme à la maquette de référence. Composant partagé : les 4 routes
// existent (favoris.js est un placeholder tant que ce module n'est pas fait).
const TAB_META = {
    index: { label: 'Programme', glyph: '☰' },
    map: { label: 'Carte', glyph: '⚑' },
    favoris: { label: 'Favoris', glyph: '♥' },
    partners: { label: 'Partenaires', glyph: '★' },
};

export default function AppTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]}>
            {state.routes.map((route, index) => {
                const meta = TAB_META[route.name] ?? { label: route.name, glyph: '•' };
                const isFocused = state.index === index;
                const badgeCount = descriptors[route.key]?.options?.tabBarBadge;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <Pressable
                        key={route.key}
                        onPress={onPress}
                        accessibilityRole="button"
                        accessibilityLabel={meta.label}
                        accessibilityState={{ selected: isFocused }}
                        style={styles.tabItem}
                    >
                        <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                            <Text style={[styles.glyph, isFocused && styles.glyphActive]}>
                                {meta.glyph}
                            </Text>
                            {badgeCount ? (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{badgeCount}</Text>
                                </View>
                            ) : null}
                        </View>
                        <Text style={[styles.label, isFocused && styles.labelActive]}>
                            {meta.label}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        flexDirection: 'row',
        backgroundColor: COLORS.craie,
        borderTopWidth: 2,
        borderTopColor: COLORS.marineNuit,
        paddingTop: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: COLORS.marineNuit,
        borderColor: COLORS.marineNuit,
    },
    glyph: {
        fontSize: 18,
        color: COLORS.grisBeton,
    },
    glyphActive: {
        color: COLORS.orangeBombe,
    },
    badge: {
        position: 'absolute',
        top: -4,
        right: -4,
        minWidth: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: COLORS.coraiFlash,
        borderWidth: 1.5,
        borderColor: COLORS.craie,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 3,
    },
    badgeText: {
        fontFamily: FONTS.labelMono,
        fontSize: 9,
        color: COLORS.craie,
    },
    label: {
        fontFamily: FONTS.labelMono,
        fontSize: 10,
        letterSpacing: 0.5,
        color: COLORS.grisBeton,
        textTransform: 'uppercase',
    },
    labelActive: {
        color: COLORS.marineNuit,
        fontFamily: FONTS.bodyBold,
    },
});
