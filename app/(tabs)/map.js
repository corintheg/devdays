import { useRouter } from 'expo-router';
import MapScreen from '../../components/MapScreen';
import devdaysData from '../../data/devdaysData.json';

export default function Map() {
    const router = useRouter();

    return (
        <MapScreen
            data={devdaysData}
            onViewProgramme={(poi) => console.log('Voir la programmation de', poi.name)}
            onViewPartners={() => router.push('/partners')}
        />
    );
}
