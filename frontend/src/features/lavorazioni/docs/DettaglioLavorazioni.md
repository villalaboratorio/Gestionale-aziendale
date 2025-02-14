# Documentazione Tecnica Dettaglio Lavorazioni

## 1. Struttura del Modulo
```typescript
/features/lavorazioni/
├── components/
│   ├── dettaglio/
│   │   ├── actions/
│   │   │   ├── LavorazioneActions.tsx
│   │   │   └── types.ts
│   │   ├── form/
│   │   │   ├── LavorazioneForm.tsx
│   │   │   └── sections/
│   │   ├── header/
│   │   │   └── LavorazioneHeader.tsx
│   │   └── tabs/
│   │       ├── LavorazioneTabs.tsx
│   │       └── content/
├── hooks/
│   ├── useLavorazione.ts
│   └── useTabNavigation.ts
├── context/
│   └── LavorazioneContext.tsx
└── pages/
    └── DettaglioLavorazione.tsx

interface Lavorazione {
    id: string;
    numeroScheda: string;
    cliente: Cliente;
    ricetta: Ricetta;
    fase: FaseLavorazione;
    stato: StatoLavorazione;
    parametri: ParametriLavorazione;
    timeline: TimelineEvent[];
}

interface ParametriLavorazione {
    cottura?: ParametriCottura;
    abbattimento?: ParametriAbbattimento;
    assemblaggio?: ParametriAssemblaggio;
}

interface TimelineEvent {
    tipo: string;
    timestamp: Date;
    operatore: string;
    dettagli: object;
}
3. Flusso Dati
Caricamento Iniziale

Fetch dati lavorazione
Setup stato iniziale
Inizializzazione form
Gestione Stati

Transizioni di fase
Validazione parametri
Aggiornamento timeline
Salvataggio

Validazione completa
Persistenza dati
Aggiornamento UI
4. Componenti Core
4.1 LavorazioneActions
interface LavorazioneActionsProps {
    onSave: () => Promise<void>;
    onDelete: () => Promise<void>;
    fase: FaseLavorazione;
    onAvviaCottura: () => void;
    onAvviaAbbattimento: () => void;
    onAvviaAssemblaggio: () => void;
    onCompletaFase: () => void;
    loading: boolean;
}

Copy

Apply

4.2 LavorazioneTabs
interface TabConfig {
    id: string;
    label: string;
    content: React.FC;
    validation?: () => boolean;
}

const tabs: TabConfig[] = [
    { id: 'info', label: 'Informazioni Generali' },
    { id: 'cottura', label: 'Cottura' },
    { id: 'abbattimento', label: 'Abbattimento' },
    { id: 'assemblaggio', label: 'Assemblaggio' }
];

Copy

Apply

5. Gestione Stato
5.1 Context
interface LavorazioneContextValue {
    state: LavorazioneState;
    actions: LavorazioneActions;
}

const LavorazioneContext = createContext<LavorazioneContextValue>(null);

Copy

Apply

5.2 Custom Hooks
const useLavorazione = (id: string) => {
    // Logica gestione lavorazione
};

const useTabNavigation = () => {
    // Logica navigazione tab
};

Copy

Apply

6. Validazioni e Controlli
6.1 Parametri HACCP
Temperature cottura
Tempi abbattimento
Controlli qualità
6.2 Regole Business
Sequenza fasi
Autorizzazioni
Documentazione richiesta
7. Performance
Memoization componenti
Lazy loading tabs
Ottimizzazione re-render
8. Testing
describe('DettaglioLavorazione', () => {
    it('carica correttamente i dati iniziali', () => {
        // Test implementation
    });

    it('gestisce le transizioni di fase', () => {
        // Test implementation
    });
});

Copy

Apply

9. Deployment
Build ottimizzata
Gestione asset
Configurazioni ambiente
10. Manutenzione
Logging strutturato
Gestione errori
Monitoraggio performance
