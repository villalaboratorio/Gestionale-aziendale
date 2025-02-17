import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import useLavorazione from '../hooks/useLavorazione';
import useTabNavigation from '../hooks/useTabNavigation';
import useLavorazioneState from '../hooks/useLavorazioneState';

const LavorazioneContext = createContext(undefined);

export const LavorazioneProvider = ({ children }) => {
    console.group('🌍 LavorazioneProvider');
    const { id } = useParams();
    
    const {
        lavorazione,
        collections: rawCollections,
        loading,
        error,
        isNew,
        actions: lavorazioneActions
    } = useLavorazione(id);

    console.log('Dati Lavorazione Provider:', {
        id,
        ricettaId: lavorazione?.ricetta?._id,
        ricetta: lavorazione?.ricetta,
        lavorazioneCompleta: lavorazione
    });

    const normalizedCollections = useMemo(() => {
        if (!rawCollections?.data) {
            return {
                clienti: [],
                ricette: [],
                tipiLavorazione: [],
                statiLavorazione: []
            };
        }
        return rawCollections.data;
    }, [rawCollections]);

    const {
        state,
        updateState,
        setLoading,
        setError,
        ...stateActions
    } = useLavorazioneState();

    const {
        navigateToTab,
        markTabDirty,
        markTabValid,
        activeTab
    } = useTabNavigation();

    const contextValue = useMemo(() => ({
        data: {
            lavorazione,
            collections: normalizedCollections,
            stats: state.stats
        },
        loadingStates: {
            main: loading,
            operations: state.loadingStates?.operations || false,
            tabs: state.loadingStates?.tabs || {}
        },
        error: error || state.error,
        activeTab,
        isNew,
        actions: {
            ...lavorazioneActions,
            ...stateActions,
            setActiveTab: navigateToTab,
            markTabDirty,
            markTabValid,
            updateState,
            setError,
            setLoading
        }
    }), [
        lavorazione,
        normalizedCollections,
        state.stats,
        loading,
        state.loadingStates,
        error,
        state.error,
        activeTab,
        isNew,
        lavorazioneActions,
        stateActions,
        navigateToTab,
        markTabDirty,
        markTabValid,
        updateState,
        setError,
        setLoading
    ]);

    console.groupEnd();

    return (
        <LavorazioneContext.Provider value={contextValue}>
            {children}
        </LavorazioneContext.Provider>
    );
};

export const useLavorazioneContext = () => {
    const context = useContext(LavorazioneContext);
    if (!context) {
        throw new Error('useLavorazioneContext deve essere usato dentro LavorazioneProvider');
    }
    return context;
};

export default LavorazioneContext;
