import React, { createContext, useContext, useState, useMemo } from 'react';

// State des favoris partagé entre tous les écrans (HomeView, EventDetailView,
// FavoritesView...). Ne stocke que des ids — chaque écran résout lui-même
// les objets event complets à partir de sa propre liste `data.events`.
//
// NOTE : en mémoire uniquement pour l'instant (perdu à la fermeture de
// l'app). Pour persister, remplacer useState par une lecture/écriture
// AsyncStorage — dis-le-moi si tu veux que je l'ajoute.

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const [favoriteIds, setFavoriteIds] = useState({});

    const toggleFavorite = (id) => {
        setFavoriteIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const isFavorite = (id) => !!favoriteIds[id];

    const value = useMemo(
        () => ({ favoriteIds, toggleFavorite, isFavorite }),
        [favoriteIds]
    );

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites() doit être utilisé à l\'intérieur de <FavoritesProvider>');
    }
    return context;
}