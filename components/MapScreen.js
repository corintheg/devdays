import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    StatusBar,
    Modal,
    PanResponder,
} from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Rect, Path, Polygon } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, BricolageGrotesque_700Bold, BricolageGrotesque_800ExtraBold } from '@expo-google-fonts/bricolage-grotesque';
import { HankenGrotesk_400Regular, HankenGrotesk_600SemiBold, HankenGrotesk_700Bold } from '@expo-google-fonts/hanken-grotesk';
import { SpaceMono_700Bold } from '@expo-google-fonts/space-mono';
import { COLORS, FONTS } from '../theme';

// Carte = plan illustré stylisé (positions en %), pas une carte géoréférencée.
// Chaque type de POI porte une couleur/glyph dédiée ; le type "eau/WC" reste
// en contour marine sur fond craie pour rester lisible sur le fond clair.
const POI_TYPES = {
    scene: { label: 'Scène', glyph: '♪', colorKey: 'orangeBombe', outline: false },
    food: { label: 'Restauration', glyph: 'R', colorKey: 'vertTerrain', outline: false },
    partner: { label: 'Partenaire', glyph: '★', colorKey: 'cyanVolt', outline: false },
    entry: { label: 'Entrée / Sortie', glyph: '→', colorKey: 'marineNuit', outline: false },
    water: { label: 'Eau / WC', glyph: '≈', colorKey: 'craie', outline: true },
    firstaid: { label: 'Secours', glyph: '+', colorKey: 'coraiFlash', outline: false },
    parking: { label: 'Parking', glyph: 'P', colorKey: 'grisBeton', outline: false },
};

// overrideColorKey permet à un POI précis d'afficher sa propre couleur (ex.
// la couleur exacte de sa scène telle qu'utilisée sur la page Programme)
// plutôt que la couleur générique de sa catégorie.
function getSwatchStyle(meta, overrideColorKey) {
    const colorKey = overrideColorKey ?? meta.colorKey;
    return meta.outline
        ? { backgroundColor: COLORS.craie, borderColor: COLORS.marineNuit }
        : { backgroundColor: COLORS[colorKey], borderColor: COLORS.marineNuit };
}

function getGlyphColor(meta, overrideColorKey) {
    const colorKey = overrideColorKey ?? meta.colorKey;
    return meta.outline || colorKey !== 'marineNuit' ? COLORS.marineNuit : COLORS.craie;
}

const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

// Espace virtuel fixe de la carte, indépendant de la largeur de l'écran :
// les POI (positionnés en %) gardent toujours le même espacement réel entre
// eux, qu'on soit sur desktop ou sur un téléphone étroit. Le zoom par défaut
// s'ajuste pour tout montrer d'un coup ; l'utilisateur peut ensuite zoomer et
// glisser pour explorer le détail.
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 900;

function toCanvasX(pctX) {
    return (pctX / 100) * CANVAS_WIDTH;
}
function toCanvasY(pctY) {
    return (pctY / 100) * CANVAS_HEIGHT;
}

// Fond du terrain : dégradé "prairie" + chemin serpentin décoratif. Le chemin
// vient de data.mapGroundPath (viewBox 0 0 100 100, étiré sans conserver le
// ratio) — même astuce que le fichier de design importé, donc réutilisable
// tel quel quel que soit le format réel de notre canvas.
function GroundLayer({ pathD }) {
    return (
        <Svg
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
        >
            <Defs>
                <RadialGradient id="grass" cx="30%" cy="20%" r="80%">
                    <Stop offset="0%" stopColor="#B9DE94" />
                    <Stop offset="46%" stopColor="#96CC72" />
                    <Stop offset="100%" stopColor="#7EBD5F" />
                </RadialGradient>
            </Defs>
            <Rect x={0} y={0} width={100} height={100} fill="url(#grass)" />
            {pathD ? (
                <>
                    <Path d={pathD} fill="none" stroke="#3F7D3A" strokeWidth={4.6} strokeLinecap="round" />
                    <Path
                        d={pathD}
                        fill="none"
                        stroke="#E9DDBE"
                        strokeWidth={1.4}
                        strokeLinecap="round"
                        strokeDasharray="0.2 3.4"
                    />
                </>
            ) : null}
        </Svg>
    );
}

function Tree({ tree }) {
    const size = tree.s;
    return (
        <View
            pointerEvents="none"
            style={{
                position: 'absolute',
                left: toCanvasX(tree.x),
                top: toCanvasY(tree.y),
                width: size,
                height: size,
                transform: [{ translateX: -size / 2 }, { translateY: -size / 2 }],
            }}
        >
            <View style={{ width: '100%', height: '66%', backgroundColor: '#5C9A46', borderRadius: size / 2 }} />
            <View style={{ width: '14%', height: '26%', backgroundColor: '#6B4A2E', alignSelf: 'center' }} />
        </View>
    );
}

// Bulle blanche flottante utilisée pour tous les noms sur le plan (markers,
// scène, zones) — même vocabulaire visuel que le design importé.
function NameBubble({ label, style }) {
    return (
        <View style={[styles.nameBubble, style]}>
            <Text style={styles.nameBubbleText} numberOfLines={1}>
                {label}
            </Text>
        </View>
    );
}

function Marker({ poi, onPress }) {
    const meta = POI_TYPES[poi.type];

    return (
        <Pressable
            onPress={() => onPress(poi)}
            accessibilityRole="button"
            accessibilityLabel={poi.name}
            hitSlop={10}
            style={[styles.markerWrap, { left: toCanvasX(poi.x), top: toCanvasY(poi.y) }]}
        >
            <NameBubble label={poi.name} style={styles.markerNameBubble} />
            <View style={[styles.markerIcon, getSwatchStyle(meta, poi.colorKeyOverride)]}>
                <Text
                    style={[
                        styles.markerGlyph,
                        { color: getGlyphColor(meta, poi.colorKeyOverride) },
                        poi.glyphRotation ? { transform: [{ rotate: `${poi.glyphRotation}deg` }] } : null,
                    ]}
                >
                    {meta.glyph}
                </Text>
            </View>
        </Pressable>
    );
}

// Scène principale : silhouette dédiée (canopy + pilliers + écran) plutôt
// qu'un simple marker agrandi — reprend le motif du fichier de design.
const STAGE_CANOPY_W = 130;
const STAGE_CANOPY_H = 38;
const STAGE_SCREEN_W = 118;
const STAGE_SCREEN_H = 52;
const STAGE_PILLAR_W = 16;
const STAGE_PILLAR_H = 44;

function StageMarker({ poi, onPress }) {
    return (
        <Pressable
            onPress={() => onPress(poi)}
            accessibilityRole="button"
            accessibilityLabel={poi.name}
            hitSlop={10}
            style={[styles.stageWrap, { left: toCanvasX(poi.x), top: toCanvasY(poi.y) }]}
        >
            <NameBubble label={poi.name} style={styles.stageNameBubble} />
            <View style={styles.stageBody}>
                <View style={[styles.stagePillar, { left: -14 }]} />
                <View style={[styles.stagePillar, { right: -14 }]} />
                <Svg width={STAGE_CANOPY_W} height={STAGE_CANOPY_H}>
                    <Polygon
                        points={`0,${STAGE_CANOPY_H} ${STAGE_CANOPY_W * 0.12},0 ${STAGE_CANOPY_W * 0.88},0 ${STAGE_CANOPY_W},${STAGE_CANOPY_H}`}
                        fill={COLORS.orangeBombe}
                    />
                </Svg>
                <View style={styles.stageScreen}>
                    <Text style={styles.stageScreenGlyph}>♪</Text>
                </View>
            </View>
        </Pressable>
    );
}

// Zone (surface) : Village Partenaires + parkings — rectangle teinté plutôt
// qu'un simple point, avec sa bulle de nom (et sous-titre si présent).
function Zone({ zone, onPress }) {
    const meta = POI_TYPES[zone.type];
    const color = COLORS[zone.colorKey] ?? COLORS.grisBeton;
    const cx = toCanvasX(zone.x);
    const cy = toCanvasY(zone.y);

    return (
        <Pressable onPress={() => onPress(zone)} accessibilityRole="button" accessibilityLabel={zone.name}>
            <View
                style={[
                    styles.zonePatch,
                    {
                        left: cx - zone.w / 2,
                        top: cy - zone.h / 2,
                        width: zone.w,
                        height: zone.h,
                        backgroundColor: color,
                        transform: [{ rotate: `${zone.rot}deg` }],
                    },
                ]}
            />
            <View
                style={[
                    styles.zoneLabelWrap,
                    { left: toCanvasX(zone.x), top: toCanvasY(zone.labelY) },
                ]}
            >
                <View style={[styles.legendSwatch, styles.zoneTypeSwatch, getSwatchStyle(meta)]}>
                    <Text style={[styles.legendGlyph, { color: getGlyphColor(meta) }]}>{meta.glyph}</Text>
                </View>
                <NameBubble label={zone.name} />
                {zone.description ? (
                    <View style={styles.zoneSubBubble}>
                        <Text style={styles.zoneSubText} numberOfLines={2}>
                            {zone.description}
                        </Text>
                    </View>
                ) : null}
            </View>
        </Pressable>
    );
}

function Legend() {
    return (
        <View style={styles.legend}>
            {Object.entries(POI_TYPES).map(([type, meta]) => (
                <View key={type} style={styles.legendItem}>
                    <View style={[styles.legendSwatch, getSwatchStyle(meta)]}>
                        <Text style={[styles.legendGlyph, { color: getGlyphColor(meta) }]}>{meta.glyph}</Text>
                    </View>
                    <Text style={styles.legendLabel}>{meta.label}</Text>
                </View>
            ))}
        </View>
    );
}

function PoiSheet({ poi, onClose, onViewProgramme, onViewPartners }) {
    if (!poi) return null;
    const meta = POI_TYPES[poi.type];

    return (
        <Modal visible transparent animationType="slide" onRequestClose={onClose}>
            <Pressable style={styles.sheetBackdrop} onPress={onClose} />
            <View style={styles.sheetWrap}>
                <View style={styles.sheetShadow} pointerEvents="none" />
                <View style={styles.sheet}>
                    <View style={styles.sheetHandle} />
                    <View style={styles.sheetTypeRow}>
                        <View style={[styles.sheetTypeSwatch, getSwatchStyle(meta)]}>
                            <Text style={[styles.legendGlyph, { color: getGlyphColor(meta) }]}>{meta.glyph}</Text>
                        </View>
                        <Text style={styles.sheetType}>{meta.label}</Text>
                    </View>
                    <Text style={styles.sheetTitle}>{poi.name}</Text>
                    <Text style={styles.sheetDescription}>{poi.description}</Text>

                    {poi.type === 'scene' ? (
                        <Pressable
                            onPress={() => onViewProgramme(poi)}
                            style={({ pressed }) => [styles.sheetAction, pressed && styles.pressed]}
                        >
                            <Text style={styles.sheetActionText}>Voir la programmation</Text>
                        </Pressable>
                    ) : null}

                    {poi.type === 'partner' ? (
                        <Pressable
                            onPress={() => onViewPartners(poi)}
                            style={({ pressed }) => [styles.sheetAction, pressed && styles.pressed]}
                        >
                            <Text style={styles.sheetActionText}>Voir les partenaires</Text>
                        </Pressable>
                    ) : null}

                    <Pressable onPress={onClose} style={styles.sheetCloseButton} hitSlop={8}>
                        <Text style={styles.sheetCloseText}>Fermer</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

export default function MapScreen({ data, onViewProgramme, onViewPartners }) {
    const [zoom, setZoom] = useState(1);
    const [fitZoom, setFitZoom] = useState(1);
    const [selectedPoi, setSelectedPoi] = useState(null);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const panRef = useRef(pan);
    const dragStartRef = useRef({ x: 0, y: 0 });
    const hasFitRef = useRef(false);

    // Centre l'axe quand la carte (zoomée) est plus petite que la fenêtre,
    // sinon la borne classiquement pour ne pas montrer de vide sur les bords.
    const clampAxis = (value, scaledSize, viewportLength) => {
        if (scaledSize <= viewportLength) {
            return (viewportLength - scaledSize) / 2;
        }
        const min = viewportLength - scaledSize;
        return Math.max(min, Math.min(0, value));
    };

    const clampPan = (x, y, z = zoom, viewport = viewportSize) => ({
        x: clampAxis(x, CANVAS_WIDTH * z, viewport.width),
        y: clampAxis(y, CANVAS_HEIGHT * z, viewport.height),
    });

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gesture) =>
                Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
            onPanResponderGrant: () => {
                dragStartRef.current = panRef.current;
            },
            onPanResponderMove: (_, gesture) => {
                const next = clampPan(
                    dragStartRef.current.x + gesture.dx,
                    dragStartRef.current.y + gesture.dy
                );
                panRef.current = next;
                setPan(next);
            },
        })
    ).current;

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

    const pois = data?.mapPois ?? [];
    const zones = data?.mapZones ?? [];
    const trees = data?.mapTrees ?? [];
    const groundPath = data?.mapGroundPath;

    // Le zoom par défaut est un cran au-dessus du "tout voir" (fitZoom), et on
    // ne peut pas redescendre en dessous de ce niveau — le "tout voir" pur
    // reste possible mais n'est plus le minimum absolu, il faut un poil de
    // marge pour ne jamais montrer de zone vide autour de la carte.
    const minZoom = fitZoom + ZOOM_STEP;

    const applyZoom = (nextZoom) => {
        const clamped = Math.max(minZoom, Math.min(MAX_ZOOM, +nextZoom.toFixed(2)));
        const nextPan = clampPan(panRef.current.x, panRef.current.y, clamped);
        setZoom(clamped);
        panRef.current = nextPan;
        setPan(nextPan);
    };

    const zoomIn = () => applyZoom(zoom + ZOOM_STEP);
    const zoomOut = () => applyZoom(zoom - ZOOM_STEP);

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.vertTerrain} />

            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Carte du site</Text>
                <Text style={styles.heroSubtitle}>Scènes · stands · partenaires — glisse pour te déplacer</Text>
            </View>

            <View
                style={styles.mapArea}
                onLayout={(e) => {
                    const { width, height } = e.nativeEvent.layout;
                    setViewportSize({ width, height });
                    const nextFit = Math.min(width / CANVAS_WIDTH, height / CANVAS_HEIGHT);
                    setFitZoom(nextFit);

                    if (!hasFitRef.current) {
                        // Premier layout : on cadre tout le site, un cran plus
                        // zoomé que le "tout voir" strict, centré.
                        hasFitRef.current = true;
                        const initialZoom = nextFit + ZOOM_STEP;
                        const initialPan = {
                            x: (width - CANVAS_WIDTH * initialZoom) / 2,
                            y: (height - CANVAS_HEIGHT * initialZoom) / 2,
                        };
                        setZoom(initialZoom);
                        panRef.current = initialPan;
                        setPan(initialPan);
                    } else {
                        const nextPan = clampPan(panRef.current.x, panRef.current.y, zoom, { width, height });
                        panRef.current = nextPan;
                        setPan(nextPan);
                    }
                }}
            >
                <View style={styles.mapViewport} {...panResponder.panHandlers}>
                    <View
                        style={[
                            styles.mapCanvas,
                            {
                                width: CANVAS_WIDTH,
                                height: CANVAS_HEIGHT,
                                transform: [
                                    { translateX: pan.x },
                                    { translateY: pan.y },
                                    { scale: zoom },
                                ],
                                transformOrigin: '0 0',
                            },
                        ]}
                    >
                        <GroundLayer pathD={groundPath} />
                        {trees.map((tree, index) => (
                            <Tree key={index} tree={tree} />
                        ))}
                        {zones.map((zone) => (
                            <Zone key={zone.id} zone={zone} onPress={setSelectedPoi} />
                        ))}
                        {pois.map((poi) =>
                            poi.central ? (
                                <StageMarker key={poi.id} poi={poi} onPress={setSelectedPoi} />
                            ) : (
                                <Marker key={poi.id} poi={poi} onPress={setSelectedPoi} />
                            )
                        )}
                    </View>
                </View>

                <View style={styles.zoomControls}>
                    <Pressable
                        onPress={zoomIn}
                        accessibilityRole="button"
                        accessibilityLabel="Zoomer"
                        style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
                    >
                        <Text style={styles.zoomButtonText}>+</Text>
                    </Pressable>
                    <Pressable
                        onPress={zoomOut}
                        accessibilityRole="button"
                        accessibilityLabel="Dézoomer"
                        style={({ pressed }) => [styles.zoomButton, pressed && styles.pressed]}
                    >
                        <Text style={styles.zoomButtonText}>−</Text>
                    </Pressable>
                </View>
            </View>

            <Legend />

            <PoiSheet
                poi={selectedPoi}
                onClose={() => setSelectedPoi(null)}
                onViewProgramme={(poi) => {
                    setSelectedPoi(null);
                    onViewProgramme?.(poi);
                }}
                onViewPartners={(poi) => {
                    setSelectedPoi(null);
                    onViewPartners?.(poi);
                }}
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
        backgroundColor: COLORS.vertTerrain,
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
    heroSubtitle: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 14,
        color: COLORS.marineNuit,
        marginTop: 4,
    },

    mapArea: {
        flex: 1,
        margin: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        backgroundColor: COLORS.craie,
        overflow: 'hidden',
    },
    mapViewport: {
        flex: 1,
        overflow: 'hidden',
    },
    mapCanvas: {
        position: 'relative',
        backgroundColor: COLORS.craie,
    },

    // ---------- Bulle de nom (markers, scène, zones) ----------
    nameBubble: {
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: 6,
        shadowColor: COLORS.marineNuit,
        shadowOpacity: 0.18,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
        elevation: 3,
    },
    nameBubbleText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 10.5,
        color: COLORS.marineNuit,
        maxWidth: 140,
    },

    // ---------- Marker point ----------
    markerWrap: {
        position: 'absolute',
        alignItems: 'center',
        transform: [{ translateX: -18 }, { translateY: -54 }],
    },
    markerNameBubble: {},
    markerIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerGlyph: {
        fontFamily: FONTS.displayBold,
        fontSize: 15,
    },

    // ---------- Scène principale ----------
    stageWrap: {
        position: 'absolute',
        alignItems: 'center',
        zIndex: 10,
        transform: [{ translateX: -65 }, { translateY: -110 }],
    },
    stageNameBubble: {},
    stageBody: {
        width: STAGE_CANOPY_W,
        height: STAGE_CANOPY_H + STAGE_SCREEN_H + 6,
        alignItems: 'center',
    },
    stagePillar: {
        position: 'absolute',
        bottom: 0,
        width: STAGE_PILLAR_W,
        height: STAGE_PILLAR_H,
        backgroundColor: '#3A3A3A',
        borderRadius: 3,
    },
    stageScreen: {
        position: 'absolute',
        top: STAGE_CANOPY_H - 4,
        width: STAGE_SCREEN_W,
        height: STAGE_SCREEN_H,
        backgroundColor: '#FFF4DE',
        borderWidth: 3,
        borderColor: COLORS.orangeBombe,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stageScreenGlyph: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.orangeBombe,
    },

    // ---------- Zones (surfaces) ----------
    zonePatch: {
        position: 'absolute',
        borderRadius: 10,
        opacity: 0.55,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        borderStyle: 'dashed',
    },
    zoneLabelWrap: {
        position: 'absolute',
        alignItems: 'center',
        transform: [{ translateX: -85 }, { translateY: -34 }],
        width: 170,
    },
    zoneTypeSwatch: {
        marginBottom: 4,
    },
    zoneSubBubble: {
        marginTop: 3,
        backgroundColor: 'rgba(255,255,255,0.85)',
        borderRadius: 8,
        paddingHorizontal: 6,
        paddingVertical: 3,
    },
    zoneSubText: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 9,
        color: COLORS.encre,
        textAlign: 'center',
    },

    zoomControls: {
        position: 'absolute',
        right: 12,
        bottom: 12,
        gap: 8,
    },
    zoomButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        backgroundColor: COLORS.craie,
        alignItems: 'center',
        justifyContent: 'center',
    },
    zoomButtonText: {
        fontFamily: FONTS.displayBold,
        fontSize: 20,
        color: COLORS.marineNuit,
    },
    pressed: { opacity: 0.8 },

    legend: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    legendSwatch: {
        width: 22,
        height: 22,
        borderRadius: 8,
        borderWidth: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    legendGlyph: {
        fontFamily: FONTS.displayBold,
        fontSize: 11,
        color: COLORS.marineNuit,
    },
    legendLabel: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 12,
        color: COLORS.grisBeton,
    },

    // ---------- Fiche POI (bottom sheet) ----------
    sheetBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(4,17,65,0.45)',
    },
    sheetWrap: {
        position: 'relative',
    },
    sheetShadow: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLORS.marineNuit,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        transform: [{ translateX: 4 }, { translateY: -4 }],
    },
    sheet: {
        backgroundColor: COLORS.craie,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderWidth: 2,
        borderColor: COLORS.marineNuit,
        padding: 20,
        paddingBottom: 32,
    },
    sheetHandle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.grisBeton,
        marginBottom: 16,
    },
    sheetTypeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
    },
    sheetTypeSwatch: {
        width: 28,
        height: 28,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sheetType: {
        fontFamily: FONTS.labelMono,
        fontSize: 11,
        letterSpacing: 1.5,
        color: COLORS.grisBeton,
        textTransform: 'uppercase',
    },
    sheetTitle: {
        fontFamily: FONTS.displayBold,
        fontSize: 22,
        color: COLORS.marineNuit,
        marginBottom: 8,
    },
    sheetDescription: {
        fontFamily: FONTS.bodyRegular,
        fontSize: 15,
        lineHeight: 22,
        color: COLORS.encre,
        marginBottom: 18,
    },
    sheetAction: {
        backgroundColor: COLORS.marineNuit,
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 10,
    },
    sheetActionText: {
        fontFamily: FONTS.bodyBold,
        fontSize: 15,
        color: COLORS.craie,
    },
    sheetCloseButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    sheetCloseText: {
        fontFamily: FONTS.bodySemiBold,
        fontSize: 14,
        color: COLORS.grisBeton,
    },
});
