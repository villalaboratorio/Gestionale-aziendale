import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { storageManager } from '../utils/storage';
import { trackQuantities } from '../utils/trackingSystem';

const PianificazioneContext = createContext();

const initialState = {
    permanent: {
        materiePrime: [],
        lavorazioni: []
    },
    temporary: {
        selected: null,
        draft: [],
        changes: []
    },
    ui: {
        loading: {
            materiePrime: false,
            suggerimenti: false,
            operazioni: false
        },
        errors: {
            materiePrime: null,
            suggerimenti: null,
            operazioni: null
        }
    }
};

export const PianificazioneProvider = ({ children }) => {
    const [materiePrimeRecenti, setMateriePrimeRecenti] = useState(initialState.permanent.materiePrime);
    const [selectedMateriaPrima, setSelectedMateriaPrima] = useState(initialState.temporary.selected);
    const [lavorazioniParcheggiate, setLavorazioniParcheggiate] = useState(initialState.temporary.draft);
    const [loadingStates, setLoadingStates] = useState(initialState.ui.loading);
    const [errors, setErrors] = useState(initialState.ui.errors);

    useEffect(() => {
        const savedDraft = storageManager.loadDraft();
        if (savedDraft) {
            setLavorazioniParcheggiate(savedDraft);
        }
    }, []);

    useEffect(() => {
        if (lavorazioniParcheggiate.length > 0) {
            storageManager.saveDraft(lavorazioniParcheggiate);
        }
    }, [lavorazioniParcheggiate]);

    const getQuantityTracking = (materiaPrimaId) => {
        const materiaPrima = materiePrimeRecenti.find(mp => mp._id === materiaPrimaId);
        if (!materiaPrima) return null;

        return {
            totale: materiaPrima.quantitaResidua,
            allocata: trackQuantities.calculateTotalAllocated(lavorazioniParcheggiate, materiaPrimaId),
            disponibile: trackQuantities.calculateAvailable(materiaPrima, lavorazioniParcheggiate)
        };
    };

    const validateNewAllocation = (materiaPrimaId, quantity) => {
        const materiaPrima = materiePrimeRecenti.find(mp => mp._id === materiaPrimaId);
        return materiaPrima ? trackQuantities.validateQuantity(quantity, materiaPrima, lavorazioniParcheggiate) : false;
    };

    const addLavorazioneParcheggiata = async (lavorazione) => {
        try {
            if (!validateNewAllocation(lavorazione.materiaPrima.id, lavorazione.quantitaTotale)) {
                throw new Error('Quantità richiesta non valida o superiore alla disponibilità');
            }

            setLavorazioniParcheggiate(prev => {
                const updated = [...prev, { ...lavorazione, id: Date.now() }];
                storageManager.saveDraft(updated);
                return updated;
            });

            storageManager.createBackup(lavorazioniParcheggiate);

        } catch (error) {
            setErrors(prev => ({ ...prev, operazioni: error.message }));
            throw error;
        }
    };

    const updateLavorazioneParcheggiata = async (id, updatedData) => {
        try {
            const lavorazione = lavorazioniParcheggiate.find(lav => lav.id === id);
            if (!lavorazione) throw new Error('Lavorazione non trovata');

            if (!validateNewAllocation(lavorazione.materiaPrima.id, updatedData.quantitaTotale)) {
                throw new Error('Quantità richiesta non valida o superiore alla disponibilità');
            }

            setLavorazioniParcheggiate(prev => {
                const updated = prev.map(lav => lav.id === id ? { ...lav, ...updatedData } : lav);
                storageManager.saveDraft(updated);
                return updated;
            });

        } catch (error) {
            setErrors(prev => ({ ...prev, operazioni: error.message }));
            throw error;
        }
    };

    const removeLavorazioneParcheggiata = async (lavorazione) => {
        try {
            setLavorazioniParcheggiate(prev => {
                const updated = prev.filter(lav => lav.id !== lavorazione.id);
                storageManager.saveDraft(updated);
                return updated;
            });

        } catch (error) {
            setErrors(prev => ({ ...prev, operazioni: error.message }));
            throw error;
        }
    };

    const clearLavorazioniParcheggiate = () => {
        storageManager.createBackup(lavorazioniParcheggiate);
        setLavorazioniParcheggiate([]);
        storageManager.clearStorage();
        setErrors(initialState.ui.errors);
    };

    const restoreFromBackup = () => {
        const backup = storageManager.restoreFromBackup();
        if (backup) {
            setLavorazioniParcheggiate(backup.data);
            return true;
        }
        return false;
    };

    const refreshMateriePrime = async () => {
        const response = await axios.get('/api/materie-prime');
        const materiePrimeDaLavorare = response.data.filter(mp => mp.quantitaResidua > 0);
        setMateriePrimeRecenti(materiePrimeDaLavorare);
    };

    return (
        <PianificazioneContext.Provider value={{
            materiePrimeRecenti,
            setMateriePrimeRecenti,
            selectedMateriaPrima,
            setSelectedMateriaPrima,
            lavorazioniParcheggiate,
            loadingStates,
            setLoadingStates,
            errors,
            addLavorazioneParcheggiata,
            updateLavorazioneParcheggiata,
            removeLavorazioneParcheggiata,
            clearLavorazioniParcheggiate,
            getQuantityTracking,
            validateNewAllocation,
            restoreFromBackup,
            refreshMateriePrime
        }}>
            {children}
        </PianificazioneContext.Provider>
    );
};

export const usePianificazione = () => {
    const context = useContext(PianificazioneContext);
    if (!context) {
        throw new Error('usePianificazione deve essere usato dentro PianificazioneProvider');
    }
    return context;
};

export default PianificazioneProvider;
