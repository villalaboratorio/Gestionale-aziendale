import React, { createContext } from 'react';
import useLavorazioneStore from './store/lavorazioneStore';

// Crea un contesto per lo store
export const StoreContext = createContext();

const StoreProvider = ({ children }) => {
    // Inizializza lo store
    const store = useLavorazioneStore();

    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

export default StoreProvider;