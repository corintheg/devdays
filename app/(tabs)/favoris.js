import { View, Text, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../../theme';

// Placeholder — écran Favoris à implémenter par le développeur du module Programme/Favoris.
// Le tab existe déjà ici pour que la tab bar soit fonctionnelle à 4 items.
export default function Favoris() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.coraiFlash} />
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Mes favoris</Text>
            </View>
            <View style={styles.body}>
                <Text style={styles.placeholder}>Écran à venir.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: COLORS.craie },
    hero: {
        backgroundColor: COLORS.coraiFlash,
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 18,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.marineNuit,
    },
    heroTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 24,
        color: COLORS.craie,
    },
    body: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    placeholder: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        color: COLORS.grisBeton,
    },
});
