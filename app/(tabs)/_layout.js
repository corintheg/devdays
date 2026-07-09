import { Tabs } from 'expo-router';
import AppTabBar from '../../components/AppTabBar';

export default function TabsLayout() {
    return (
        <Tabs
            tabBar={(props) => <AppTabBar {...props} />}
            screenOptions={{ headerShown: false }}
        >
            <Tabs.Screen name="index" options={{ title: 'Programme' }} />
            <Tabs.Screen name="map" options={{ title: 'Carte' }} />
            <Tabs.Screen name="favoris" options={{ title: 'Favoris' }} />
            <Tabs.Screen name="partners" options={{ title: 'Partenaires' }} />
        </Tabs>
    );
}
