import { useRouter, useLocalSearchParams } from 'expo-router';
import EventDetailView from '../../components/EventDetailView';
import devdaysData from '../../data/devdaysData.json';
import { useFavorites } from '../../context/FavoritesContext';

export default function EventDetailRoute() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { isFavorite, toggleFavorite } = useFavorites();

    const event = devdaysData.events.find((e) => e.id === id);

    return (
        <EventDetailView
            event={event}
            onBack={() => router.back()}
            isFavorite={isFavorite(id)}
            onToggleFavorite={() => toggleFavorite(id)}
        />
    );
}
