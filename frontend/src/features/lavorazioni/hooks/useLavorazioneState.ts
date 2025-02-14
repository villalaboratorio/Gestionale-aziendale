// hooks/useLavorazioneState.ts
import { useState, useCallback } from 'react';
import { Lavorazione, Collections } from '../../../features/lavorazioni/types/lavorazione.types';

interface LoadingStates {
    main: boolean;
    operations: boolean;
    tabs: Record<string, boolean>;
}

interface UiState {
    activeTab: string;
    dirtyStates: Record<string, boolean>;
    validationStates: Record<string, boolean>;
}

interface LavorazioneState {
    lavorazione: Lavorazione | null;
    collections: Collections | null;
    loadingStates: LoadingStates;
    error: string | null;
    ui: UiState;
}

const initialState: LavorazioneState = {
    lavorazione: null,
    collections: null,
    loadingStates: {
        main: true,
        operations: false,
        tabs: {}
    },
    error: null,
    ui: {
        activeTab: 'info',
        dirtyStates: {},
        validationStates: {}
    }
};

const useLavorazioneState = () => {
    const [state, setState] = useState<LavorazioneState>(initialState);

    const updateState = useCallback((updates: Partial<LavorazioneState>) => {
        console.group('🔄 State Update');
        console.log('Current:', state);
        console.log('Updates:', updates);
        
        setState(prev => ({
            ...prev,
            ...updates,
            loadingStates: {
                ...prev.loadingStates,
                main: false
            }
        }));
        
        console.groupEnd();
    }, [state]);

    const setLoading = useCallback((key: keyof LoadingStates | string, value: boolean) => {
        setState(prev => ({
            ...prev,
            loadingStates: {
                ...prev.loadingStates,
                [key]: value
            }
        }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({
            ...prev,
            error,
            loadingStates: {
                ...prev.loadingStates,
                main: false,
                operations: false
            }
        }));
    }, []);

    const setActiveTab = useCallback((tab: string) => {
        setState(prev => ({
            ...prev,
            ui: {
                ...prev.ui,
                activeTab: tab
            }
        }));
    }, []);

    const setTabState = useCallback((tabId: string, type: 'dirtyStates' | 'validationStates', value: boolean) => {
        setState(prev => ({
            ...prev,
            ui: {
                ...prev.ui,
                [type]: {
                    ...prev.ui[type],
                    [tabId]: value
                }
            }
        }));
    }, []);

    const setDirtyState = useCallback((tabId: string, value: boolean) => {
        setTabState(tabId, 'dirtyStates', value);
    }, [setTabState]);

    const setValidationState = useCallback((tabId: string, value: boolean) => {
        setTabState(tabId, 'validationStates', value);
    }, [setTabState]);

    const isDirty = useCallback((tabId: string): boolean => {
        return state.ui.dirtyStates[tabId] || false;
    }, [state.ui.dirtyStates]);

    const isValid = useCallback((tabId: string): boolean => {
        return state.ui.validationStates[tabId] || false;
    }, [state.ui.validationStates]);

    return {
        state,
        updateState,
        setLoading,
        setError,
        setActiveTab,
        setTabState,
        setDirtyState,
        setValidationState,
        isDirty,
        isValid
    };
};

export default useLavorazioneState;
