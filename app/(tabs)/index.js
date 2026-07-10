import { useRouter } from 'expo-router';
import HomeView from '../../components/HomeView';
import devdaysData from '../../data/devdaysData.json';

export default function Index() {
    const router = useRouter();

    return (
        <HomeView
            data={devdaysData}
            onEventPress={(event) => router.push(`/event/${event.id}`)}
            onFeaturedPress={() => router.push('/white-night')}
        />
    );
}