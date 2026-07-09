import { useRouter } from 'expo-router';
import PartnersScreen from '../../components/PartnersScreen';
import devdaysData from '../../data/devdaysData.json';

export default function Partners() {
    const router = useRouter();

    return (
        <PartnersScreen
            data={devdaysData}
            onPartnerPress={(partner) => router.push(`/partner/${partner.id}`)}
        />
    );
}
