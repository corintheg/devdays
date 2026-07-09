import React from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS } from '../theme';


function LineupRow({ item, onPress }) {
  return (
    <View style={styles.lineupOuter}>
      <View style={styles.lineupShadow} pointerEvents="none" />
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${item.title}, ${item.venue}, ${item.time}`}
        style={({ pressed }) => [styles.lineupRow, pressed && styles.pressed]}
      >
        <View style={styles.lineupTime}>
          <Text style={styles.lineupTimeText}>{item.time}</Text>
        </View>
        <View style={styles.lineupTextBlock}>
          <Text style={styles.lineupTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.lineupVenue} numberOfLines={1}>
            {item.venue}
          </Text>
        </View>
        <Text style={styles.lineupChevron}>›</Text>
      </Pressable>
    </View>
  );
}

export default function WhiteNghtDetail({ data, onBack, onLineupItemPress }) {
  if (!data) return null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.marineNuit} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <View style={styles.blobDecor} pointerEvents="none" />
          <View style={styles.ringDecor} pointerEvents="none" />
          <View style={styles.dotDecor} pointerEvents="none" />

          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Text style={styles.backChevron}>‹</Text>
          </Pressable>

          {data.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.badge}</Text>
            </View>
          ) : null}

          <Text style={styles.title}>{data.title}</Text>

          {data.description ? (
            <Text style={styles.description}>{data.description}</Text>
          ) : null}

          <View style={styles.timeCardsRow}>
            {data.startTime ? (
              <View style={[styles.timeCard, styles.timeCardStart]}>
                <Text style={[styles.timeCardValue, { color: COLORS.cyanVolt }]}>
                  {data.startTime.label}
                </Text>
                <Text style={styles.timeCardCaption}>{data.startTime.caption}</Text>
              </View>
            ) : null}
            {data.endTime ? (
              <View style={[styles.timeCard, styles.timeCardEnd]}>
                <Text style={[styles.timeCardValue, { color: COLORS.coraiFlash }]}>
                  {data.endTime.label}
                </Text>
                <Text style={styles.timeCardCaption}>{data.endTime.caption}</Text>
              </View>
            ) : null}
          </View>

          <Image
            source={require('../assets/images/logo-2.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="DevDays"
          />
        </View>

        <View style={styles.body}>
          <Text style={styles.bodyTitle}>Le line-up de la nuit</Text>

          <View style={styles.lineupList}>
            {(data.lineup ?? []).map((item) => (
              <LineupRow
                key={item.id}
                item={item}
                onPress={() => onLineupItemPress?.(item)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.marineNuit,
  },
  scrollContent: {
    flexGrow: 1,
  },
  pressed: {
    opacity: 0.8,
  },

  // ---------- Hero (marine) ----------
  hero: {
    backgroundColor: COLORS.marineNuit,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 32,
    overflow: 'hidden',
  },
  blobDecor: {
    position: 'absolute',
    top: 260,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(0,0,0,0.25)',
    transform: [{ rotate: '12deg' }],
  },
  ringDecor: {
    position: 'absolute',
    top: -30,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 14,
    borderColor: 'rgba(247,242,232,0.15)',
  },
  dotDecor: {
    position: 'absolute',
    top: 145,
    right: 55,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.coraiFlash,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.craie,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  backChevron: {
    fontFamily: FONTS.bodyBold,
    fontSize: 22,
    color: COLORS.marineNuit,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.orangeBombe,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
  },
  badgeText: {
    fontFamily: FONTS.labelMono,
    fontSize: 12,
    letterSpacing: 1.5,
    color: COLORS.marineNuit,
  },

  title: {
    fontFamily: FONTS.displayExtraBold,
    fontSize: 44,
    lineHeight: 46,
    color: COLORS.craie,
    marginBottom: 18,
  },

  description: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.grisBeton,
    marginBottom: 24,
  },

  timeCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  timeCard: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  timeCardStart: {
    borderColor: COLORS.cyanVolt,
  },
  timeCardEnd: {
    borderColor: COLORS.coraiFlash,
  },
  timeCardValue: {
    fontFamily: FONTS.displayBold,
    fontSize: 24,
  },
  timeCardCaption: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.grisBeton,
    marginTop: 2,
  },

  logo: {
    height: 24,
    width: 24 * (1150 / 404),
  },

  // ---------- Corps (craie) ----------
  body: {
    flex: 1,
    backgroundColor: COLORS.craie,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  bodyTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 20,
    color: COLORS.marineNuit,
    marginBottom: 16,
  },

  lineupList: {
    gap: 14,
  },
  lineupOuter: {
    // conteneur relatif à l'ombre dure ci-dessous
  },
  lineupShadow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.coraiFlash,
    borderRadius: 20,
    transform: [{ translateX: 4 }, { translateY: 4 }],
  },
  lineupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.marineNuit,
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  lineupTime: {
    backgroundColor: COLORS.cyanVolt,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lineupTimeText: {
    fontFamily: FONTS.displayBold,
    fontSize: 15,
    color: COLORS.marineNuit,
  },
  lineupTextBlock: {
    flex: 1,
  },
  lineupTitle: {
    fontFamily: FONTS.displayBold,
    fontSize: 17,
    color: COLORS.craie,
  },
  lineupVenue: {
    fontFamily: FONTS.bodyRegular,
    fontSize: 13,
    color: COLORS.grisBeton,
    marginTop: 2,
  },
  lineupChevron: {
    fontFamily: FONTS.displayBold,
    fontSize: 22,
    color: COLORS.orangeBombe,
  },
});