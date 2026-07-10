import { useRouter, useLocalSearchParams } from 'expo-router';
import PartnerDetail from '../../components/PartnerDetail';
import devdaysData from '../../data/devdaysData.json';

export default function PartnerDetailRoute() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const partner = devdaysData.partners.find((p) => p.id === id);

    return (
        <PartnerDetail
            partner={partner}
            onBack={() => router.back()}
            onViewOnMap={() => router.push('/map')}
        />
    );
}
