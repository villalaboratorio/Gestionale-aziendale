import { createContext, useContext } from 'react';
import { create } from 'zustand';
import LavorazioneApi from '../../lavorazioni/services/LavorazioneApi';

const StoreContext = createContext();

const useLavorazioneStore = create((set, get) => ({
    // Existing base state
    lavorazione: {},
    collections: {
        clienti: [],
        ricette: [],
        tipiLavorazione: [],
        statiLavorazione: []
    },
    activeTab: 'info',
    loading: false,
    error: null,

    // All existing actions remain unchanged
    handleFormChange: (field, value) => set(state => ({
        lavorazione: {
            ...state.lavorazione,
            [field]: value
        }
    })),

    setLavorazione: (data) => set({ lavorazione: data }),
    setCollections: (data) => set({ collections: data }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    fetchData: async (id) => {
        set({ loading: true, error: null });
        try {
            const lavorazioneRes = id ? await LavorazioneApi.getLavorazione(id) : { data: {} };
            const collectionsRes = await LavorazioneApi.getCollections();
            set({
                lavorazione: lavorazioneRes.data,
                collections: collectionsRes.data,
                loading: false
            });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    requestManager: {
        pendingRequests: new Map(),
        debounceTimers: new Map(),
        
        addRequest: (id, promise) => {
            get().requestManager.pendingRequests.set(id, promise);
            return promise;
        },
        
        removeRequest: (id) => {
            get().requestManager.pendingRequests.delete(id);
        },
        
        debounce: (id, fn, delay = 300) => {
            const { debounceTimers } = get().requestManager;
            if (debounceTimers.has(id)) {
                clearTimeout(debounceTimers.get(id));
            }
            
            return new Promise(resolve => {
                const timer = setTimeout(async () => {
                    debounceTimers.delete(id);
                    const result = await fn();
                    resolve(result);
                }, delay);
                
                debounceTimers.set(id, timer);
            });
        }
    },

    handleSave: async (data) => {
        const state = get();
        const requestId = `save-${Date.now()}`;

        const saveOperation = async () => {
            const dataToSave = {
                ...data,
                cliente: data.cliente?._id || data.cliente,
                ricetta: data.ricetta?._id || data.ricetta,
                tipoLavorazione: data.tipoLavorazione?._id || data.tipoLavorazione,
                statoLavorazione: data.statoLavorazione?._id || data.statoLavorazione,
                cotture: data.cotture?.map(cottura => ({
                    ...cottura,
                    temperaturaTarget: Number(cottura.temperaturaTarget) || 0,
                    addetto: cottura.addetto || 'Da assegnare',
                    stato: cottura.stato || 'non_iniziata'
                })) || []
            };

            return data._id
                ? await LavorazioneApi.updateLavorazione(data._id, dataToSave)
                : await LavorazioneApi.createLavorazione(dataToSave);
        };

        return state.requestManager.debounce(requestId, saveOperation);
    },

    cleanup: () => {
        const { pendingRequests, debounceTimers } = get().requestManager;
        pendingRequests.clear();
        debounceTimers.forEach(timer => clearTimeout(timer));
        debounceTimers.clear();
    },

    handleDelete: async () => {
        const state = get();
        if (!state.lavorazione._id) return;

        set({ loading: true, error: null });
        try {
            await LavorazioneApi.deleteLavorazione(state.lavorazione._id);
            set({
                lavorazione: {},
                loading: false,
                activeTab: 'info'
            });
        } catch (error) {
            set({ error: error.message, loading: false });
            throw error;
        }
    },

    // All existing Informazioni Generali methods remain unchanged
    updateInformazioniGenerali: (data) => set((state) => ({
        lavorazione: { ...state.lavorazione, informazioniGenerali: data }
    })),

    // All existing HACCP methods remain unchanged
    initializeVerificheHaccp: () => set(state => {
        const ricettaId = state.lavorazione?.ricetta?._id;
        const ricettaCompleta = state.collections?.ricette?.find(r => r._id === ricettaId);
       
        if (!ricettaId || !ricettaCompleta || state.lavorazione.verificheHaccp) {
            return state;
        }

        const verificheIniziali = {};
        ricettaCompleta.ingredienti?.forEach(ing => {
            verificheIniziali[ing._id] = {
                tmc: '',
                lotto: '',
                verificato: false
            };
        });

        return {
            lavorazione: {
                ...state.lavorazione,
                verificheHaccp: verificheIniziali
            }
        };
    }),

    updateIngredientiHACCP: (data) => set((state) => ({
        lavorazione: {
            ...state.lavorazione,
            ingredientiHACCP: data
        }
    })),

    updateVerificaIngrediente: (ingredienteId, verifica) => set((state) => ({
        lavorazione: {
            ...state.lavorazione,
            verificheHaccp: {
                ...state.lavorazione.verificheHaccp || {},
                [ingredienteId]: verifica
            }
        }
    })),

    getVerificheHaccpStats: () => {
        const state = get();
        const ricettaId = state.lavorazione?.ricetta?._id;
        const ricettaCompleta = state.collections?.ricette?.find(r => r._id === ricettaId);
        const ingredienti = ricettaCompleta?.ingredienti || [];
        const verifiche = state.lavorazione?.verificheHaccp || {};

        return {
            totalIngredienti: ingredienti.length,
            verificatiCount: Object.values(verifiche).filter(v => v.verificato).length,
            isComplete: ingredienti.length > 0 &&
                       ingredienti.length === Object.values(verifiche).filter(v => v.verificato).length
        };
    },
 // Aggiungiamo lo stato per i tipi cottura
 tipiCottura: [],
 loadingTipiCottura: false,
 errorTipiCottura: null,

 // Azioni per gestire i tipi cottura
 setTipiCottura: (tipiCottura) => set({ tipiCottura }),
 
 fetchTipiCottura: async () => {
     set({ loadingTipiCottura: true, errorTipiCottura: null });
     try {
         const response = await LavorazioneApi.getTipiCottura();
         if (response.success) {
             set({ 
                 tipiCottura: response.data,
                 loadingTipiCottura: false 
             });
         }
     } catch (error) {
         set({ 
             errorTipiCottura: error.message,
             loadingTipiCottura: false 
         });
     }
 },

    // Cotture essential state
    cotture: [],
    loadingCotture: false,
    errorCotture: null,

    // Cotture essential actions
    setCotture: (cotture) => set({ cotture }),
    setLoadingCotture: (loading) => set({ loadingCotture: loading }),
    setErrorCotture: (error) => set({ errorCotture: error })
}));
const StoreProvider = ({ children }) => {
    const store = useLavorazioneStore();
    return (
        <StoreContext.Provider value={store}>
            {children}
        </StoreContext.Provider>
    );
};

const useStore = () => useContext(StoreContext);

export { StoreProvider, useStore };
export default useLavorazioneStore;
