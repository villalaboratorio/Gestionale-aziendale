// hooks/useTabNavigation.ts
import { useCallback } from 'react';
import useLavorazioneState from './useLavorazioneState';

const useTabNavigation = () => {
    const {
        state,
        setActiveTab,
        setDirtyState,
        setValidationState,
        isDirty,
        isValid
    } = useLavorazioneState();

    const navigateToTab = useCallback((tabId) => {
        // Verifica se possiamo cambiare tab
        const currentTab = state.ui.activeTab;
        const canNavigate = !isDirty(currentTab) || isValid(currentTab);

        if (!canNavigate) {
            console.warn('Impossibile cambiare tab: modifiche non salvate o non valide');
            return false;
        }

        setActiveTab(tabId);
        return true;
    }, [state.ui.activeTab, isDirty, isValid, setActiveTab]);

    const markTabDirty = useCallback((tabId, isDirty) => {
        setDirtyState(tabId, isDirty);
    }, [setDirtyState]);

    const markTabValid = useCallback((tabId, isValid) => {
        setValidationState(tabId, isValid);
    }, [setValidationState]);

    return {
        activeTab: state.ui.activeTab,
        navigateToTab,
        markTabDirty,
        markTabValid,
        isDirty,
        isValid
    };
};

export default useTabNavigation;
