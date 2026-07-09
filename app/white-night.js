import { useRouter } from 'expo-router';
import WhiteNghtDetail from '../components/WhiteNghtDetail';
import devdaysData from '../data/devdaysData.json';

export default function WhiteNight() {
    const router = useRouter();

    return (
        <WhiteNghtDetail
            data={devdaysData.featuredEvent}
            onBack={() => router.back()}
            onLineupItemPress={(item) => console.log('Ouvrir', item.id)}
        />
    );
}
