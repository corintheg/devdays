import React, { createContext, useContext, useMemo, useState } from 'react';

// Centralise l'état "favoris" au niveau racine pour qu'il reste synchronisé
// entre HomeView (liste) et EventDetailView (fiche détail), qui sont deux
// écrans/routes distincts et ne peuvent pas partager un simple useState local.
const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
    const [favorites, setFavorites] = useState({});

    const toggleFavorite = (id) => {
        setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const value = useMemo(() => ({ favorites, toggleFavorite }), [favorites]);

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites doit être utilisé à l\'intérieur de <FavoritesProvider>');
    }
    return context;
}
