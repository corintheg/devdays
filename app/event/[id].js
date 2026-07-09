import { useLocalSearchParams, useRouter } from 'expo-router';
import EventDetailView from '../../components/EventDetailView';
import devdaysData from '../../data/devdaysData.json';
import { useFavorites } from '../../context/FavoritesContext';

export default function EventDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { favorites, toggleFavorite } = useFavorites();

    const event = devdaysData.events.find((e) => e.id === id);

    return (
        <EventDetailView
            event={event}
            onBack={() => router.back()}
            isFavorite={!!favorites[id]}
            onToggleFavorite={() => toggleFavorite(id)}
        />
    );
}
