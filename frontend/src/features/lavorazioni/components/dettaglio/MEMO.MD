Ecco la documentazione dettagliata del refactoring:

# Documentazione Refactoring Lavorazioni

## 1. Architettura Implementata

### 1.1 Struttura delle Directory

Copy

Apply

frontend/src/features/lavorazioni/ ├── components/ │ ├── dashboard/ │ │ └── LavorazioniTable.jsx │ └── dettaglio/ │ ├── header/ │ │ └── LavorazioneHeader.js │ ├── tabs/ │ │ └── LavorazioneTabs.js │ └── actions/ │ └── LavorazioneActions.js ├── hooks/ │ ├── useLavorazione.js │ └── informazioniGenerali/ │ ├── useInformazioniGeneraliForm.js │ ├── useInformazioniGeneraliData.js │ └── useInformazioniGeneraliSave.js ├── services/ │ └── LavorazioneApi.js └── store/ └── lavorazioneStore.js


### 1.2 Flusso dei Dati
```javascript
// 1. API Call (LavorazioneApi.js)
async getLavorazione(id) {
    return apiService.fetch(`/api/dettaglio-lavorazioni/${id}/informazioni-generali`);
}

// 2. Store Management (lavorazioneStore.js)
const useLavorazioneStore = create((set, get) => ({
    lavorazione: {},
    handleFormChange: (field, value) => set(state => ({
        lavorazione: {
            ...state.lavorazione,
            [field]: value
        }
    }))
}));

// 3. Component Usage (InformazioniGenerali.js)
const { lavorazione, handleFormChange } = useStore();

Copy

Apply

2. Pattern Implementati
2.1 Store Centralizzato
// lavorazioneStore.js
const useLavorazioneStore = create((set, get) => ({
    // Stato
    lavorazione: {},
    collections: {},
    activeTab: 'info',
    loading: false,
    error: null,

    // Azioni
    handleFormChange: (field, value) => set(state => ({
        lavorazione: {
            ...state.lavorazione,
            [field]: value
        }
    })),

    // Operazioni asincrone
    handleSave: async (data) => {
        const state = get();
        // Logica di salvataggio
    }
}));

Copy

Apply

2.2 Gestione Form e Validazione
// useInformazioniGeneraliForm.js
const formFields = useMemo(() => ({
    clienteField: {
        id: 'cliente',
        label: 'Cliente',
        type: 'select',
        options: collections.clienti || [],
        required: true
    },
    // altri campi...
}), [collections]);

Copy

Apply

3. Componenti Chiave
3.1 LavorazioniTable
const LavorazioniTable = ({
    lavorazioni = [],
    loading = false,
    pagination,
    onPageChange,
    onRowClick
}) => {
    // Rendering logica
};

Copy

Apply

3.2 Gestione delle Tab
const LavorazioneTabs = () => {
    const { activeTab, setActiveTab } = useStore();
    
    return (
        <TabsContainer>
            <TabNav>
                <TabButton 
                    $active={activeTab === 'info'}
                    onClick={() => setActiveTab('info')}
                >
                    Informazioni Generali
                </TabButton>
                // altre tab...
            </TabNav>
        </TabsContainer>
    );
};

Copy

Apply

4. Gestione dello Stato
4.1 Inizializzazione
// DettaglioLavorazione.js
const DettaglioLavorazione = () => (
    <LavorazioneProvider>
        <DettaglioLavorazioneContent />
    </LavorazioneProvider>
);

Copy

Apply

4.2 Aggiornamenti dello Stato
// Esempio di aggiornamento stato nel form
const handleFormChange = (field, value) => {
    setLocalData(prev => ({
        ...prev,
        [field]: value
    }));
    setIsDirty(true);
};

Copy

Apply

5. Gestione API e Dati
5.1 Pulizia Dati per API
const dataToSave = {
    ...data,
    cliente: data.cliente?._id || data.cliente,
    ricetta: data.ricetta?._id || data.ricetta,
    tipoLavorazione: data.tipoLavorazione?._id || data.tipoLavorazione,
    statoLavorazione: data.statoLavorazione?._id || data.statoLavorazione
};

Copy

Apply

5.2 Gestione Errori
try {
    const result = await handleSave(dataToSave);
    // Gestione successo
} catch (error) {
    console.error('Errore salvataggio:', error);
    // Gestione errore
}

Copy

Apply

6. Best Practices Emerse
Separazione delle Responsabilità

Ogni componente ha una responsabilità specifica
Hook personalizzati per logica riutilizzabile
Gestione dello Stato

Stato globale per dati condivisi
Stati locali per UI e form
Ottimizzazione delle Performance

Uso di useMemo per calcoli costosi
React.memo per componenti puri
Gestione degli Errori

Try-catch per operazioni asincrone
Feedback utente per errori
7. Modello per Nuovi Componenti
7.1 Struttura Base
// NuovoComponente.js
import React from 'react';
import { useStore } from '../store/lavorazioneStore';
import styled from 'styled-components';

const ComponenteContainer = styled.div`
    // stili
`;

const NuovoComponente = () => {
    const { data, actions } = useStore();
    
    return (
        <ComponenteContainer>
            // contenuto
        </ComponenteContainer>
    );
};

export default NuovoComponente;

Copy

Apply

7.2 Hook Associato
// useNuovoComponente.js
const useNuovoComponente = (initialData) => {
    const [localData, setLocalData] = useState(initialData);
    
    // logica specifica del componente
    
    return {
        data: localData,
        actions: {
            // azioni specifiche
        }
    };
};

Copy

Apply

8. Punti di Attenzione per Nuovi Sviluppi
Gestione Store

Utilizzare sempre get() per accedere allo stato corrente
Evitare mutazioni dirette dello stato
Componenti Form

Implementare sempre validazione
Gestire correttamente lo stato dirty
API Calls

Pulire sempre i dati prima dell'invio
Gestire tutti gli stati (loading, error, success)
Styled Components

Usare $prop per props transient
Seguire il theme definito
## 9. Pattern di Comunicazione tra Componenti

### 9.1 Flusso Dati Parent-Child
```javascript
// Parent (DettaglioLavorazione.js)
const DettaglioLavorazione = () => {
    const { data, actions } = useLavorazioneContext();
    return (
        <PageContainer>
            <LavorazioneHeader 
                lavorazione={data.lavorazione}
                loading={data.loading}
            />
            <LavorazioneTabs />
        </PageContainer>
    );
};

// Child (LavorazioneHeader.js)
const LavorazioneHeader = ({ lavorazione, loading }) => {
    return (
        <HeaderContainer>
            <HeaderTitle>
                {lavorazione?.numeroScheda 
                    ? `Scheda #${lavorazione.numeroScheda}` 
                    : 'Nuova Lavorazione'
                }
            </HeaderTitle>
        </HeaderContainer>
    );
};

Copy

Apply

9.2 Eventi e Callbacks
// LavorazioniTable.js
const handleRowClick = useCallback((id, e) => {
    e.stopPropagation();
    if (clickTimeout.current) {
        clearTimeout(clickTimeout.current);
    }
    clickTimeout.current = setTimeout(() => {
        onRowClick(id);
        clickTimeout.current = null;
    }, 300);
}, [onRowClick]);

Copy

Apply

10. Ciclo di Vita dei Dati
10.1 Inizializzazione
// useLavorazione.js
const fetchData = useCallback(async () => {
    try {
        const collectionsRes = await LavorazioneApi.getCollections();
        const lavorazioneRes = id ? await LavorazioneApi.getLavorazione(id) : { data: {} };

        setState({
            lavorazione: lavorazioneRes.data,
            collections: collectionsRes.data,
            loading: false,
            error: null
        });
    } catch (error) {
        setState(prev => ({
            ...prev,
            loading: false,
            error: error.message
        }));
    }
}, [id]);

Copy

Apply

10.2 Aggiornamento
// lavorazioneStore.js
handleFormChange: (field, value) => set(state => {
    console.group('📝 Form Change');
    console.log('Field:', field);
    console.log('Value:', value);
    console.log('Previous State:', state);
    
    const newState = {
        lavorazione: {
            ...state.lavorazione,
            [field]: value
        }
    };
    
    console.log('New State:', newState);
    console.groupEnd();
    
    return newState;
}),

Copy

Apply

10.3 Cleanup
useEffect(() => {
    return () => {
        if (clickTimeout.current) {
            clearTimeout(clickTimeout.current);
        }
    };
}, []);

Copy

Apply

11. Sistema di Validazione
11.1 Validazione Form
const validateData = useCallback((data) => {
    const requiredFields = ['cliente', 'ricetta', 'tipoLavorazione', 'dataLavorazione'];
    const errors = {};

    requiredFields.forEach(field => {
        if (!data[field] || !data[field]._id) {
            errors[field] = 'Campo obbligatorio';
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}, []);

Copy

Apply

11.2 Gestione Errori di Validazione
const handleSave = useCallback(async () => {
    const { isValid, errors } = validateData(localData);
    if (!isValid) {
        const errorMessages = Object.entries(errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join('\n');
            
        toast.error(`Errori di validazione:\n${errorMessages}`);
        throw new Error('Validazione fallita', { cause: errors });
    }
    // Procedi con il salvataggio
}, [localData, validateData]);

Copy

Apply

12. Dipendenze tra Hook
12.1 Gerarchia Hook
useInformazioniGenerali
    ├── useInformazioniGeneraliData
    ├── useInformazioniGeneraliForm
    └── useInformazioniGeneraliSave

Copy

Apply

12.2 Condivisione Stati
// useInformazioniGenerali.js
const {
    localData,
    setLocalData,
    isDirty,
    setIsDirty
} = useInformazioniGeneraliData({
    data: initialData,
    collections
});

const {
    formFields,
    renderField,
    renderFormSection
} = useInformazioniGeneraliForm({
    handleFormChange,
    localData,
    collections,
    loading
});

const {
    saving,
    saveError,
    handleSave
} = useInformazioniGeneraliSave({
    localData,
    setIsDirty
});

Copy

Apply

13. Strategia di Caching e Performance
13.1 Memorizzazione
// LavorazioneApi.js
class LavorazioneApiService {
    constructor() {
        this.cache = new Map();
        this.pendingRequests = new Map();
    }

    async getCollections() {
        const cacheKey = 'collections';
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const response = await apiService.fetch('/api/dettaglio-lavorazioni/initial-data');
        this.cache.set(cacheKey, response);
        return response;
    }
}

Copy

Apply

13.2 Ottimizzazione Rendering
// Uso di useMemo per calcoli costosi
const formFields = useMemo(() => ({
    clienteField: {
        id: 'cliente',
        label: 'Cliente',
        type: 'select',
        options: collections.clienti || [],
        required: true
    },
    // altri campi...
}), [collections]);

// Uso di useCallback per funzioni
const handleRowClick = useCallback((id, e) => {
    e.stopPropagation();
    onRowClick(id);
}, [onRowClick]);

// Memo per componenti puri
export default React.memo(LavorazioniTable);

Copy

Apply

14. Testing e Debugging
14.1 Console Logging Strutturato
console.group('🏭 LavorazioneProvider Initialization');
console.log('Route ID:', id);
console.log('Render Count:', renderCount.current);
console.log('Dati da useLavorazione:', { 
    lavorazione, 
    collections, 
    loading, 
    error 
});
console.groupEnd();

Copy

Apply

14.2 Error Boundaries
class ErrorBoundary extends React.Component {
    state = { hasError: false, error: null };

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return <ErrorContainer>{this.state.error.message}</ErrorContainer>;
        }
        return this.props.children;
    }
}

15. Gestione Eventi e Side Effects
// DettaglioLavorazione.js
useEffect(() => {
    // Gestione navigazione
    const handleBeforeUnload = (e) => {
        if (isDirty) {
            e.preventDefault();
            e.returnValue = '';
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [isDirty]);

Copy

Apply

16. Normalizzazione Dati
// Esempio di normalizzazione collections
const normalizedCollections = useMemo(() => {
    console.group('📦 Collections Normalization');
    if (!rawCollections?.data) {
        console.log('No raw collections available');
        return {
            clienti: [],
            ricette: [],
            tipiLavorazione: [],
            statiLavorazione: []
        };
    }
    console.groupEnd();
    return rawCollections.data;
}, [rawCollections]);

Copy

Apply

17. Integrazione Context-Store-Components
// Context
const LavorazioneContext = createContext(undefined);

// Store Integration
const LavorazioneProvider = ({ children }) => {
    const store = useLavorazioneStore();
    return (
        <LavorazioneContext.Provider value={store}>
            {children}
        </LavorazioneContext.Provider>
    );
};

// Component Usage
const DettaglioLavorazioneContent = () => {
    const {
        data: { lavorazione, collections },
        loadingStates: { main: isLoading },
        error,
        actions
    } = useLavorazioneContext();
    // ...
};

// Struttura base per form dinamici
const formSections = [
    {
        id: 'anagrafica',
        title: 'Dati Anagrafici',
        fields: ['clienteField', 'ricettaField']
    },
    {
        id: 'dettagli',
        title: 'Dettagli Lavorazione',
        fields: ['tipoLavorazioneField', 'statoLavorazioneField']
    }
];

// Configurazione campi
const formFields = {
    clienteField: {
        id: 'cliente',
        type: 'select',
        options: collections.clienti,
        required: true
    }
};

// Rendering dinamico
const renderField = (fieldConfig) => {
    switch (fieldConfig.type) {
        case 'select':
            return <Select {...fieldConfig} />;
        case 'date':
            return <DateInput {...fieldConfig} />;
        default:
            return null;
    }
};