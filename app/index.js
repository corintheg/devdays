import HomeView from '../components/HomeView';
import devdaysData from '../data/devdaysData.json';

export default function Index() {
    return (
        <HomeView
            data={devdaysData}
            onEventPress={(event) => console.log('Ouvrir', event.id)}
            onFeaturedPress={(event) => console.log('Ouvrir le temps fort', event.id)}
        />
    );
}