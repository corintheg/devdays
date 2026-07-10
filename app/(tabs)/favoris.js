import { useRouter } from 'expo-router';
import FavoritesView from '../../components/FavoritesView';
import { useFavorites } from '../../context/FavoritesContext';
import rawData from '../../data/devdaysData.json';

export default function Favoris() {
    const router = useRouter();
    const { favoriteIds, toggleFavorite } = useFavorites();

    const favoriteEvents = rawData.events.filter((e) => favoriteIds[e.id]);

    return (
        <FavoritesView
            favoriteEvents={favoriteEvents}
            onEventPress={(event) => router.push(`/event/${event.id}`)}
            onToggleFavorite={(event) => toggleFavorite(event.id)}
            onExplorePress={() => router.push('/')}
        />
    );
}
