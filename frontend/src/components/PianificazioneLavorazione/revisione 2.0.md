
struttura attuale 
Ecco la struttura attuale del sistema di pianificazione:

Componenti Principali:
PianificazioneLavorazioni/
├── context/
│   └── PianificazioneContext.js    // Gestione stato globale
├── utils/
│   ├── calculations.js             // Funzioni di calcolo
│   └── validations.js             // Validazioni
├── MateriePrimeList.js            // Lista materie prime
├── SuggerimentiLavorazione.js     // Suggerimenti ricette
├── LavorazioniParcheggiate.js     // Gestione lavorazioni
└── ConfermaLavorazione.js         // Conferma finale

Copy

Apply

Flusso Dati Attuale:
Caricamento materie prime dal backend
Selezione materia prima e calcolo quantità
Creazione lavorazioni con ricette suggerite
Gestione modifiche quantità/porzioni
Conferma e invio al sistema lavorazioni
API Integrate:
GET /api/materie-prime
POST /api/materie-prime/{id}/prelievo
PUT /api/materie-prime/{id}
GET /api/ricette/per-ingrediente/{nome}
Funzionalità Esistenti:
Visualizzazione materie prime disponibili
Calcolo quantità residue e allocate
Suggerimenti ricette compatibili
Gestione lavorazioni parcheggiate
Validazioni base quantità
Questa struttura sarà il punto di partenza per l'implementazione del nuovo sistema flessibile di pianificazione.

cosa vogliamo ottenere 

Gestione Materie Prime
Sistema di tracking quantità totali e parziali
Interfaccia per divisione/unione quantità
Validazione real-time disponibilità
Sistema Lavorazioni
Componente drag&drop per spostamento quantità
Editor lavorazioni con storico modifiche
Sistema di validazione operazioni
Gestione Ricette
Interfaccia selezione/cambio ricette
Sistema di varianti temporanee
Validazione compatibilità ingredienti
Storage e Stato
Sistema per salvare stati temporanei
Gestione versioni pianificazione

un'interfaccia divisa in aree funzionali:

Area Materie Prime (Sinistra)
Lista materie prime disponibili
Indicatori quantità e stato
Filtri rapidi per cliente/lotto
Area Pianificazione (Centro)
Griglia interattiva per lavorazioni
Drag & drop per spostare quantità
Preview ricette compatibili
Indicatori visivi di utilizzo
Area Lavorazioni (Destra)
Lista lavorazioni pianificate
Editor quantità/ricette
Raggruppamento per tipo/cliente
Totali e statistiche
Toolbar Superiore
Salvataggio versioni
Undo/Redo
Filtri globali
Strumenti di ottimizzazione
PianificazioneLavorazioni (Container principale)
- PianificazioneProvider (Context)
- Layout Manager
- Gestione stato globale

Copy

Apply

MateriePrimeManager
- Lista materie prime
- Filtri e ricerca
- Gestione selezione
- Tracking quantità disponibili

Copy

Apply

PianificazioneEditor
- Grid interattiva
- Drag & Drop manager
- Preview ricette
- Validazione operazioni
- Gestione modifiche

Copy

Apply

LavorazioniManager
- Lista lavorazioni
- Editor quantità/ricette
- Gestione gruppi
- Calcolo totali

Copy

Apply

ToolbarControls
- Versioning manager
- History controller
- Filtri globali
- Actions dispatcher


Iniziamo con il PianificazioneProvider, elemento fondamentale per la gestione dello stato:

// PianificazioneProvider
{
    // Stati principali
    materiePrime: {
        items: [],          // lista materie prime
        selected: null,     // materia prima selezionata
        filters: {},        // filtri attivi
        availability: {}    // tracking quantità
    },

    // Gestione versioni
    versions: {
        current: null,      // versione corrente
        history: [],        // storico modifiche
        saved: []          // versioni salvate
    },

    // Lavorazioni
    lavorazioni: {
        items: [],         // lavorazioni attive
        groups: {},        // gruppi lavorazioni
        changes: [],       // modifiche pendenti
        totals: {}        // totali calcolati
    },

    // Actions
    actions: {
        materiePrime: {},  // azioni materie prime
        lavorazioni: {},   // azioni lavorazioni
        versioning: {}    // azioni versioning
    }
}

// MateriePrimeManager
{
    // Componenti
    MateriePrimeList: {
        // Lista principale con virtualizzazione
        filters: {
            cliente: string,
            lotto: string,
            disponibilita: boolean
        },
        sorting: {
            field: string,
            direction: 'asc' | 'desc'
        }
    },

    QuantityTracker: {
        // Gestione quantità e allocazioni
        totale: number,
        allocata: number,
        disponibile: number,
        prenotata: number
    },

    SelectionManager: {
        // Gestione selezioni multiple
        selected: string[],
        mode: 'single' | 'multiple',
        history: []
    },

    // Eventi
    events: {
        onSelect: (ids: string[]) => void,
        onQuantityChange: (id: string, quantity: number) => void,
        onFilter: (filters: object) => void
    }
}

// PianificazioneEditor
{
    // Grid Manager
    GridSystem: {
        layout: {
            rows: [],
            columns: [],
            cells: Map<string, CellData>
        },
        dragAndDrop: {
            active: boolean,
            source: string,
            target: string,
            quantity: number
        }
    },

    // Recipe Manager
    RecipeHandler: {
        compatibili: [],
        selected: null,
        preview: {
            porzioni: number,
            grammi: number,
            totale: number
        }
    },

    // Operation Validator
    Validator: {
        rules: Map<string, ValidationRule>,
        errors: Map<string, string>,
        warnings: Map<string, string>
    },

    // Change Tracker
    ChangeTracker: {
        current: [],
        pending: [],
        history: [],
        canUndo: boolean,
        canRedo: boolean
    },

    // Eventi
    events: {
        onDragStart: (source: string) => void,
        onDrop: (target: string, quantity: number) => void,
        onRecipeChange: (recipeId: string) => void,
        onQuantityChange: (quantity: number) => void,
        onValidationError: (errors: string[]) => void
    }
}

// LavorazioniManager
{
    // Lista Lavorazioni
    LavorazioniList: {
        items: Map<string, Lavorazione>,
        groups: {
            byCliente: Map<string, string[]>,
            byRicetta: Map<string, string[]>,
            byPriorita: Map<string, string[]>
        },
        sorting: {
            field: string,
            direction: 'asc' | 'desc'
        }
    },

    // Editor Lavorazione
    Editor: {
        active: string,
        form: {
            quantita: number,
            porzioni: number,
            grammiPorzione: number,
            ricetta: string,
            note: string
        },
        validation: {
            errors: Map<string, string>,
            isDirty: boolean,
            isValid: boolean
        }
    },

    // Calcoli e Totali
    Calculator: {
        totali: {
            quantita: number,
            porzioni: number,
            allocazioni: Map<string, number>
        },
        statistiche: {
            utilizzo: number,
            efficienza: number,
            completamento: number
        }
    },

    // Eventi
    events: {
        onAdd: (lavorazione: Lavorazione) => void,
        onEdit: (id: string, changes: Partial<Lavorazione>) => void,
        onDelete: (id: string) => void,
        onGroup: (groupBy: string) => void,
        onSort: (field: string) => void
    }
}
// ToolbarControls
{
    // Version Manager
    VersionControl: {
        versions: {
            current: string,
            saved: Map<string, Version>,
            autosave: Version[]
        },
        actions: {
            save: () => void,
            load: (id: string) => void,
            delete: (id: string) => void,
            export: (format: string) => void
        }
    },

    // History Controller
    HistoryManager: {
        stack: {
            undo: Action[],
            redo: Action[]
        },
        tracking: {
            active: boolean,
            current: number,
            total: number
        }
    },

    // Global Filters
    FilterSystem: {
        active: Map<string, Filter>,
        presets: Map<string, FilterSet>,
        quick: {
            cliente: string[],
            ricetta: string[],
            stato: string[]
        }
    },

    // Action Dispatcher
    ActionCenter: {
        available: Map<string, Action>,
        shortcuts: Map<string, string>,
        queue: Action[],
        processing: boolean
    },

    // Eventi
    events: {
        onVersionSave: (version: Version) => void,
        onVersionLoad: (id: string) => void,
        onUndo: () => void,
        onRedo: () => void,
        onFilterChange: (filters: FilterSet) => void,
        onAction: (action: Action) => void
    }
}