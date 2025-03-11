# Piano di Migrazione Modulo Pianificazione

## Indice
1. [Obiettivo](#1-obiettivo)
2. [Struttura del Modulo](#2-struttura-del-modulo)
3. [Architettura Core Esistente](#3-architettura-core-esistente)
4. [Interconnessione con il Core](#4-interconnessione-con-il-core)
5. [Interfacce e Tipi](#5-interfacce-e-tipi)
6. [Componenti Principali](#6-componenti-principali)
7. [Services e Logica di Business](#7-services-e-logica-di-business)
8. [Hook e State Management](#8-hook-e-state-management)
9. [Problemi Specifici da Risolvere](#9-problemi-specifici-da-risolvere)
10. [Piano di Migrazione (Milestone)](#10-piano-di-migrazione-milestone)
11. [Convenzioni e Standard](#11-convenzioni-e-standard)

## 1. Obiettivo

Migrare il modulo di Pianificazione Lavorazioni da JavaScript a TypeScript seguendo l'architettura modulare già implementata per il core e il modulo Lavorazioni. Risolvere i problemi esistenti di matching degli ingredienti, allocazione delle quantità e creazione delle lavorazioni, migliorando al contempo la robustezza e la manutenibilità del sistema.

## 2. Struttura del Modulo

### 2.1 Struttura delle Cartelle
```
/features/pianificazione
│
├── api
│   └── endpoints
│       ├── materiePrimeApi.ts         # API per materie prime
│       ├── ricetteApi.ts              # API per ricette
│       └── lavorazioniApi.ts          # API per lavorazioni
│
├── components
│   ├── MateriePrimeList
│   │   ├── index.ts
│   │   ├── MateriePrimeList.tsx       # Lista materie prime disponibili
│   │   └── MateriePrimeList.styles.ts
│   │
│   ├── SuggerimentiLavorazione
│   │   ├── index.ts
│   │   ├── SuggerimentiLavorazione.tsx # Suggerimenti di ricette
│   │   └── SuggerimentiLavorazione.styles.ts
│   │
│   ├── BrogliaccioLavorazioni
│   │   ├── index.ts
│   │   ├── BrogliaccioLavorazioni.tsx  # Riepilogo lavorazioni pianificate
│   │   └── BrogliaccioLavorazioni.styles.ts
│   │
│   ├── LavorazioniParcheggiate
│   │   ├── index.ts
│   │   ├── LavorazioniParcheggiate.tsx # Lavorazioni in attesa di conferma
│   │   └── LavorazioniParcheggiate.styles.ts
│   │
│   ├── ConfermaLavorazione
│   │   ├── index.ts
│   │   ├── ConfermaLavorazione.tsx     # Modal di conferma
│   │   └── ConfermaLavorazione.styles.ts
│   │
│   └── PianificazioneContainer.tsx     # Container principale
│
├── context
│   ├── PianificazioneContext.tsx       # Context provider
│   └── PianificazioneProvider.tsx      # Provider implementation
│
├── hooks
│   ├── usePianificazione.ts            # Hook principale
│   ├── usePianificazioneState.ts       # Gestione stato 
│   ├── usePianificazioneActions.ts     # Azioni 
│   ├── useMateriePrime.ts              # Logica per materie prime
│   ├── useSuggerimenti.ts              # Logica per suggerimenti
│   └── useLavorazioniParcheggiate.ts   # Logica per lavorazioni
│
├── services
│   ├── ingredientMatching.service.ts   # Servizio matching ingredienti
│   ├── calculations.service.ts         # Servizio calcoli quantità
│   └── storage.service.ts              # Servizio storage locale
│
├── types
│   ├── pianificazione.types.ts         # Tipi generali del modulo
│   ├── materiePrime.types.ts           # Tipi materie prime
│   ├── ricette.types.ts                # Tipi ricette
│   ├── lavorazioni.types.ts            # Tipi lavorazioni
│   └── state.types.ts                  # Tipi per lo stato
│
└── utils
    ├── ingredientMatching.utils.ts     # Utility per matching
    ├── calculations.utils.ts           # Utility per calcoli
    └── tracking.utils.ts               # Utility per tracking quantità
```

### 2.2 Flusso dei Dati
- **MateriePrimeList** → Selezione materia prima → **SuggerimentiLavorazione**
- **SuggerimentiLavorazione** → Conferma suggerimento → **BrogliaccioLavorazioni**
- **BrogliaccioLavorazioni** → Riepilogo e modifica → **LavorazioniParcheggiate**
- **LavorazioniParcheggiate** → Avvio lavorazioni → **ConfermaLavorazione**
- **ConfermaLavorazione** → Salvataggio finale e reindirizzamento

### 2.3 Interazioni tra Componenti
Tutte le interazioni avvengono tramite il `PianificazioneContext`, che fornisce stato e azioni a tutti i componenti. I dati fluiscono in modo unidirezionale:
1. Lo stato viene letto dai componenti tramite `usePianificazione`
2. Le azioni modificano lo stato tramite funzioni fornite dal context
3. Gli aggiornamenti allo stato provocano re-render dei componenti interessati

## 3. Architettura Core Esistente

### 3.1 Struttura del Core
```
/core
│
├── api                  # Gestione chiamate API
│   ├── api.service.ts
│   └── index.ts
│
├── config               # Gestione configurazioni
│   ├── config.manager.ts
│   └── index.ts
│
├── events               # Sistema di eventi
│   ├── event.bus.ts
│   └── index.ts
│
├── cache                # Sistema di caching
│   ├── cache.manager.ts
│   └── index.ts
│
├── errors               # Gestione errori
│   └── error.handler.ts
│
├── http                 # Client HTTP
│   ├── http.client.ts
│   └── index.ts
│
├── logging              # Sistema logging
│   ├── logger.ts
│   └── index.ts
│
├── plugins              # Sistema plugin
│   ├── plugin.manager.ts
│   └── index.ts
│
├── services             # Service container
│   └── service.container.ts
│
└── types                # Definizioni di tipi
    ├── api.types.ts
    ├── cache.types.ts
    ├── config.types.ts
    ├── error.types.ts
    ├── event.types.ts
    ├── http.types.ts
    ├── logging.types.ts
    ├── plugins.types.ts
    ├── services.types.ts
    └── index.ts
```

### 3.2 Componenti Core Principali

#### 3.2.1 Service Container
Gestisce istanze di servizi, implementa dependency injection e ciclo di vita dei servizi.

```typescript
// Esempio di utilizzo:
import { ServiceContainer } from '@core/services';

// Registrazione di un servizio
ServiceContainer.register('ingredientMatchingService', IngredientMatchingService);

// Ottenere un'istanza di un servizio
const matchingService = ServiceContainer.get('ingredientMatchingService');
```

#### 3.2.2 Event Bus
Implementa un sistema di pubblicazione/sottoscrizione per la comunicazione tra componenti.

```typescript
// Esempio di utilizzo:
import { EventBus, EventTypes } from '@core/events';

// Sottoscrizione a un evento
EventBus.subscribe(EventTypes.MATERIA_PRIMA_SELECTED, (materiaPrima) => {
  // Handler per l'evento
});

// Pubblicazione di un evento
EventBus.publish(EventTypes.MATERIA_PRIMA_SELECTED, materiaPrimaSelezionata);
```

#### 3.2.3 API Service
Gestisce le chiamate API, supporta caching, gestione errori e retry.

```typescript
// Esempio di utilizzo:
import { ApiService } from '@core/api';

// Configurazione di un endpoint
ApiService.configureEndpoint('materiePrime', '/api/materie-prime');

// Utilizzo dell'endpoint
const materiePrime = await ApiService.get('materiePrime');
```

#### 3.2.4 Logger
Sistema di logging strutturato con diversi livelli e supporto per filtri.

```typescript
// Esempio di utilizzo:
import { Logger } from '@core/logging';

Logger.info('Materia prima selezionata', { id: materiaPrima._id });
Logger.error('Errore durante il matching', { error, materiaPrima });
```

## 4. Interconnessione con il Core

### 4.1 Registrazione dei Servizi
I servizi specifici del modulo Pianificazione verranno registrati nel ServiceContainer:

```typescript
// In pianificazione/services/index.ts
import { ServiceContainer } from '@core/services';
import { IngredientMatchingService } from './ingredientMatching.service';
import { CalculationsService } from './calculations.service';
import { StorageService } from './storage.service';

export function registerPianificazioneServices() {
  ServiceContainer.register('ingredientMatchingService', IngredientMatchingService);
  ServiceContainer.register('calculationsService', CalculationsService);
  ServiceContainer.register('storageService', StorageService);
}
```

### 4.2 Utilizzo degli Eventi
Il modulo Pianificazione utilizzerà l'EventBus per comunicare con altri moduli:

```typescript
// Eventi del modulo
export enum PianificazioneEventTypes {
  MATERIA_PRIMA_SELECTED = 'pianificazione:materiaPrimaSelected',
  LAVORAZIONE_CREATED = 'pianificazione:lavorazioneCreated',
  QUANTITY_ALLOCATED = 'pianificazione:quantityAllocated'
}

// Pubblicazione di eventi
EventBus.publish(PianificazioneEventTypes.LAVORAZIONE_CREATED, lavorazione);

// Sottoscrizione a eventi
EventBus.subscribe(PianificazioneEventTypes.MATERIA_PRIMA_SELECTED, handleMateriaPrimaSelected);
```

### 4.3 Utilizzo dell'API Service
Le chiamate API del modulo utilizzeranno ApiService per uniformità:

```typescript
// In pianificazione/api/endpoints/materiePrimeApi.ts
import { ApiService } from '@core/api';

export const materiePrimeApi = {
  getAll: () => ApiService.get('materiePrime'),
  getById: (id) => ApiService.get(`materiePrime/${id}`),
  prelievi: (id, data) => ApiService.post(`materiePrime/${id}/prelievo`, data)
};
```

### 4.4 Logging e Gestione Errori
Utilizzo coerente di Logger e ErrorHandler:

```typescript
import { Logger } from '@core/logging';
import { ErrorHandler } from '@core/errors';

try {
  // Logica di business
} catch (error) {
  Logger.error('Errore durante calcolo suggerimenti', { error });
  ErrorHandler.handle(error, {
    title: 'Errore Suggerimenti',
    message: 'Impossibile calcolare i suggerimenti'
  });
}
```

## 5. Interfacce e Tipi

### 5.1 Materie Prime

```typescript
// In types/materiePrime.types.ts
export interface IMateriaPrima {
  _id: string;
  documentNumber: string;
  date: Date;
  cliente: ICliente;
  products: IProduct[];
  quantitaIniziale: number;
  quantitaResidua: number;
  prelievi: IPrelievo[];
}

export interface IProduct {
  name: string;
  quantity: number;
  unit: IUnit;
  lotNumber: string;
}

export interface IPrelievo {
  quantitaPrelevata: number;
  dataPrelievo: Date;
  numeroPorzioni: number;
  grammiPerPorzione: number;
  quantitaResidua: number;
  lotNumber: string;
  destinazioneLavorazione?: string;
}

export interface ICliente {
  _id: string;
  nome: string;
}

export interface IUnit {
  _id: string;
  name: string;
  abbreviation: string;
}
```

### 5.2 Ricette

````typescript
// In types/ricette.types.ts
export interface IRicetta {
  _id: string;
  numeroRicetta: string;
  nome: string;
  categoria: ICategoria;
  descrizione?: string;
  porzioni: number;
  grammiPerPorzione: number;
  pesoTotale: number;
  tempoPreparazione?: number;
  tempoCottura?: number;
  temperatura?: number;
  difficolta: 'facile' | 'media' | 'difficile';
  stagionalita: 'primavera' | 'estate' | 'autunno' | 'inverno' | "tutto l'anno";
  fasi: IFase[];
  ingredienti: IIngredienteRicetta[];
  cotture: ICottura[];
  noteCottura?: string;
  isActive: boolean;
}

export interface IIngredienteRicetta {
  ingrediente: {
    _id: string;
    name: string;
  };
  quantita: number;
  unitaMisura: {
    _id: string;
    name: string;
    abbreviation: string;
  };
  caloPeso?: number;
}

export interface IFase {
  tipoLavorazione: {
    _id: string;
    nome: string;
  };
  metodo: {
    _id: string;
    nome: string;
  };
  tempo?: number;
  descrizione?: string;
  ordine: number;
}

export interface ICottura {
  tipoCottura: {
    _id: string;
    nome: string;
  };
  temperatura: number;
  tempoCottura: number;
  note?: string;
  ordine: number;
}

export interface ICategoria {
  _id: string;
  nome: string;
}
```

### 5.3 Lavorazioni

```typescript
// In types/lavorazioni.types.ts
export interface ILavorazioneParcheggiata {
  id: number;
  ricettaId: string;
  ricettaNome: string;
  materiaPrima: {
    id: string;
    nome: string;
    lotNumber: string;
  };
  quantitaTotale: number;
  porzioniPreviste: number;
  grammiPerPorzione: number;
  cliente: string;
  clienteId: string;
  note?: string;
  dataCreazione: string;
  dataModifica?: string;
}

export interface IDettaglioLavorazione {
  numeroScheda: string;
  cliente: string;
  ricetta: string;
  tipoLavorazione?: string;
  statoLavorazione: string;
  operatore?: string;
  dataLavorazione: Date;
  dataConsegnaPrevista: Date;
  prioritaCliente: 'bassa' | 'media' | 'alta';
  isUrgente: boolean;
  motivazioneUrgenza?: string;
  porzioniPreviste: number;
  grammiPerPorzione: number;
  quantitaPrevista: number;
  materiaPrima: string;  // ID materia prima
  note?: string;
}

export interface ISuggerimento {
  ricetta: IRicetta;
  quantitaConsigliata: number;
  porzioniOttenibili: number;
  porzioniSelezionate?: number;
  grammiPerPorzioneSelezionati?: number;
  quantitaCalcolata?: number;
  validazione?: IValidazione;
  compatibilita?: ICompatibilita;
}

export interface IValidazione {
  valido: boolean;
  messaggio?: string;
  codice?: string;
}

export interface ICompatibilita {
  score: number;
  ingredienteId?: string;
}
```

### 5.4 Stato del Modulo

```typescript
// In types/state.types.ts
export interface IPianificazioneState {
  materiePrime: {
    items: IMateriaPrima[];
    selected: IMateriaPrima | null;
    loading: boolean;
    error: string | null;
  };
  suggerimenti: {
    items: ISuggerimento[];
    loading: boolean;
    error: string | null;
    gruppi: { [key: string]: ISuggerimento[] };
    selectedGruppo: string;
  };
  lavorazioni: {
    parcheggiate: ILavorazioneParcheggiata[];
    loading: boolean;
    error: string | null;
  };
  ui: {
    showConferma: boolean;
    filtroCliente: string;
    ordinamento: 'data' | 'quantita';
    showLavorazioneLibera: boolean;
  };
}

export interface IPianificazioneActions {
  // Azioni per materie prime
  loadMateriePrime: () => Promise<void>;
  selectMateriaPrima: (materiaPrima: IMateriaPrima) => void;
  
  // Azioni per suggerimenti
  loadSuggerimenti: (materiaPrimaId: string) => Promise<void>;
  updateSuggerimentoQuantita: (ricettaId: string, field: string, value: number) => void;
  selectGruppo: (gruppo: string) => void;
  
  // Azioni per lavorazioni
  addLavorazione: (lavorazione: Partial<ILavorazioneParcheggiata>) => Promise<void>;
  updateLavorazione: (id: number, data: Partial<ILavorazioneParcheggiata>) => Promise<void>;
  removeLavorazione: (id: number) => Promise<void>;
  clearLavorazioni: () => void;
  
  // Azioni UI
  setShowConferma: (show: boolean) => void;
  setFiltroCliente: (cliente: string) => void;
  setOrdinamento: (ordinamento: 'data' | 'quantita') => void;
  setShowLavorazioneLibera: (show: boolean) => void;
  
  // Azioni composite
  confirmarLavorazioni: () => Promise<void>;
}
```

## 6. Componenti Principali

### 6.1 PianificazioneContainer

Componente principale che orchestrerà l'intero modulo, utilizzando i componenti figli.

```typescript
// In components/PianificazioneContainer.tsx
import React from 'react';
import { PianificazioneProvider } from '../context/PianificazioneProvider';
import MateriePrimeList from './MateriePrimeList';
import SuggerimentiLavorazione from './SuggerimentiLavorazione';
import BrogliaccioLavorazioni from './BrogliaccioLavorazioni';
import LavorazioniParcheggiate from './LavorazioniParcheggiate';
import ConfermaLavorazione from './ConfermaLavorazione';

const PianificazioneContainer: React.FC = () => {
  return (
    <PianificazioneProvider>
      <div className="pianificazione-container">
        <div className="pianificazione-left">
          <MateriePrimeList />
          <SuggerimentiLavorazione />
        </div>
        <div className="pianificazione-right">
          <BrogliaccioLavorazioni />
          <LavorazioniParcheggiate />
        </div>
        {/* ConfermaLavorazione è un modal che appare quando necessario */}
      </div>
    </PianificazioneProvider>
  );
};

export default PianificazioneContainer;
```

### 6.2 MateriePrimeList

Visualizza e permette la selezione delle materie prime disponibili.

```typescript
// In components/MateriePrimeList/MateriePrimeList.tsx
import React, { useEffect } from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import * as S from './MateriePrimeList.styles';

const MateriePrimeList: React.FC = () => {
  const { state, actions } = usePianificazione();
  const { materiePrime } = state;
  const { loadMateriePrime, selectMateriaPrima } = actions;
  
  useEffect(() => {
    loadMateriePrime();
  }, [loadMateriePrime]);
  
  return (
    <S.Container>
      <S.Header>
        <h3>Materie Prime da Lavorare</h3>
        {/* Filtri e controlli */}
      </S.Header>
      
      <S.Grid>
        {materiePrime.loading ? (
          <S.Loading>Caricamento materie prime...</S.Loading>
        ) : materiePrime.error ? (
          <S.Error>{materiePrime.error}</S.Error>
        ) : materiePrime.items.length === 0 ? (
          <S.Empty>Nessuna materia prima disponibile</S.Empty>
        ) : (
          materiePrime.items.map(mp => (
            <S.Card 
              key={mp._id}
              selected={materiePrime.selected?._id === mp._id}
              onClick={() => selectMateriaPrima(mp)}
            >
              {/* Contenuto card */}
            </S.Card>
          ))
        )}
      </S.Grid>
    </S.Container>
  );
};

export default MateriePrimeList;
```

### 6.3 SuggerimentiLavorazione

Mostra i suggerimenti di ricette basati sulla materia prima selezionata.

```typescript
// In components/SuggerimentiLavorazione/SuggerimentiLavorazione.tsx
import React, { useEffect } from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import SuggerimentoCard from './SuggerimentoCard';
import * as S from './SuggerimentiLavorazione.styles';

const SuggerimentiLavorazione: React.FC = () => {
  const { state, actions } = usePianificazione();
  const { materiePrime, suggerimenti } = state;
  const { loadSuggerimenti, updateSuggerimentoQuantita, addLavorazione, selectGruppo } = actions;
  
  useEffect(() => {
    if (materiePrime.selected) {
      loadSuggerimenti(materiePrime.selected._id);
    }
  }, [materiePrime.selected, loadSuggerimenti]);
  
  if (!materiePrime.selected) {
    return <S.Empty>Seleziona una materia prima per vedere i suggerimenti</S.Empty>;
  }
  
  // Resto della logica e UI
};

export default SuggerimentiLavorazione;
```

### 6.4 BrogliaccioLavorazioni

Mostra un riepilogo delle lavorazioni parcheggiate e permette di modificarle.

```typescript
// In components/BrogliaccioLavorazioni/BrogliaccioLavorazioni.tsx
import React from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import * as S from './BrogliaccioLavorazioni.styles';

const BrogliaccioLavorazioni: React.FC = () => {
  const { state, actions } = usePianificazione();
  const { lavorazioni } = state;
  const { updateLavorazione, removeLavorazione } = actions;
  
  // Logica di modifica quantità, porzioni, ecc.
  
  return (
    <S.Container>
      <S.Header>
        <h3>Riepilogo Lavorazioni</h3>
        <span className="counter">
          {lavorazioni.parcheggiate.length} lavorazioni
        </span>
      </S.Header>
      
      {/* Lista lavorazioni */}
      
      <S.FooterTotali>
        {/* Totali */}
      </S.FooterTotali>
    </S.Container>
  );
};

export default BrogliaccioLavorazioni;
```

## 7. Services e Logica di Business

### 7.1 IngredientMatchingService

Implementa algoritmi avanzati per il matching degli ingredienti.

```typescript
// In services/ingredientMatching.service.ts
import { ServiceContainer } from '@core/services';
import { Logger } from '@core/logging';

export class IngredientMatchingService {
  private sinonimi: Record<string, string[]> = {
    'pomodoro': ['pomodori', 'tomato', 'tomatoes'],
    'carota': ['carote', 'carrot', 'carrots'],
    // Altri sinonimi...
  };
  
  /**
   * Verifica se una materia prima è compatibile con un ingrediente
   */
  isCompatible(materiaPrimaNome: string, ingredienteNome: string): boolean {
    // Normalizza i nomi
    const mpNormalizzato = this.normalizzaNome(materiaPrimaNome);
    const ingNormalizzato = this.normalizzaNome(ingredienteNome);
    
    // Check esatto
    if (mpNormalizzato === ingNormalizzato) return true;
    
    // Check sinonimi
    if (this.checkSinonimi(mpNormalizzato, ingNormalizzato)) return true;
    
    // Check substring
    if (mpNormalizzato.includes(ingNormalizzato) || ingNormalizzato.includes(mpNormalizzato)) return true;
    
    return false;
  }
  
  /**
   * Calcola uno score di compatibilità (0-1)
   */
  getMatchScore(materiaPrimaNome: string, ingredienteNome: string): number {
    // Implementazione del calcolo dello score
    // 1.0 = match perfetto, 0.0 = nessun match
  }
  
  private normalizzaNome(nome: string): string {
    return nome.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  
  private checkSinonimi(nome1: string, nome2: string): boolean {
    // Check sinonimi in entrambe le direzioni
  }
}

// Registra il servizio
ServiceContainer.register('ingredientMatchingService', new IngredientMatchingService());
```

### 7.2 CalculationsService

Gestisce i calcoli per quantità, porzioni, ecc.

```typescript
// In services/calculations.service.ts
import { ServiceContainer } from '@core/services';
import { IMateriaPrima, IRicetta, ISuggerimento } from '../types';

export class CalculationsService {
  /**
   * Calcola i suggerimenti di ricette per una materia prima
   */
  calcolaSuggerimenti(ricette: IRicetta[], materiaPrima: IMateriaPrima): ISuggerimento[] {
    const matchingService = ServiceContainer.get('ingredientMatchingService');
    const risultati: ISuggerimento[] = [];
    
    for (const ricetta of ricette) {
      // Trova ingredienti compatibili
      const ingredientiCompatibili = ricetta.ingredienti.filter(ing => 
        matchingService.isCompatible(materiaPrima.products[0].name, ing.ingrediente.name)
      );
      
      if (ingredientiCompatibili.length === 0) continue;
      
      // Prendi il primo ingrediente compatibile
      const ingrediente = ingredientiCompatibili[0];
      const compatibilita = {
        score: matchingService.getMatchScore(materiaPrima.products[0].name, ingrediente.ingrediente.name),
        ingredienteId: ingrediente.ingrediente._id
      };
      
      // Calcola quante porzioni si possono fare
      const kgPerPorzione = ricetta.grammiPerPorzione / 1000;
      const porzioniOttenibili = Math.floor(materiaPrima.quantitaResidua / kgPerPorzione);
      
      // Se non si può fare almeno una porzione, salta
      if (porzioniOttenibili < 1) continue;
      
      // Calcola quantità consigliata
      const quantitaConsigliata = porzioniOttenibili * kgPerPorzione;
      
      risultati.push({
        ricetta,
        quantitaConsigliata,
        porzioniOttenibili,
        compatibilita
      });
    }
    
    // Ordina per score di compatibilità
    return risultati.sort((a, b) => 
      (b.compatibilita?.score || 0) - (a.compatibilita?.score || 0)
    );
  }
  
  /**
   * Raggruppa i suggerimenti per categoria ricetta
   */
  raggruppaPerCategoria(suggerimenti: ISuggerimento[]): Record<string, ISuggerimento[]> {
    return suggerimenti.reduce((acc, sugg) => {
      const categoria = sugg.ricetta.categoria.nome;
      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(sugg);
      return acc;
    }, {} as Record<string, ISuggerimento[]>);
  }
  
  /**
   * Calcola il tracking delle quantità
   */
  calcolaTracking(materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): {
    totale: number;
    allocata: number;
    disponibile: number;
  } {
    const allocata = lavorazioni
      .filter(l => l.materiaPrima.id === materiaPrima._id)
      .reduce((sum, l) => sum + l.quantitaTotale, 0);
      
    return {
      totale: materiaPrima.quantitaResidua,
      allocata,
      disponibile: materiaPrima.quantitaResidua - allocata
    };
  }
  
  /**
   * Valida una quantità richiesta
   */
  validaQuantita(quantita: number, disponibile: number): IValidazione {
    if (quantita <= 0) {
      return {
        valido: false,
        messaggio: 'La quantità deve essere maggiore di zero',
        codice: 'INVALID_QUANTITY'
      };
    }
    
    if (quantita > disponibile) {
      return {
        valido: false,
        messaggio: `Quantità richiesta (${quantita.toFixed(2)} kg) superiore alla disponibilità (${disponibile.toFixed(2)} kg)`,
        codice: 'EXCEEDED_AVAILABILITY'
      };
    }
    
    return { valido: true };
  }
}

// Registra il servizio
ServiceContainer.register('calculationsService', new CalculationsService());
```

### 7.3 StorageService

Gestisce la persistenza locale delle lavorazioni parcheggiate.

```typescript
// In services/storage.service.ts
import { ServiceContainer } from '@core/services';
import { Logger } from '@core/logging';
import { ILavorazioneParcheggiata } from '../types';

export class StorageService {
  private STORAGE_KEYS = {
    LAVORAZIONI_DRAFT: 'lavorazioni_draft',
    LAST_MODIFIED: 'last_modified',
    BACKUP: 'lavorazioni_backup'
  };
  
  /**
   * Salva le lavorazioni in localStorage
   */
  saveDraft(lavorazioni: ILavorazioneParcheggiata[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.LAVORAZIONI_DRAFT, JSON.stringify(lavorazioni));
      localStorage.setItem(this.STORAGE_KEYS.LAST_MODIFIED, new Date().toISOString());
    } catch (error) {
      Logger.error('Errore durante il salvataggio delle lavorazioni', { error });
    }
  }
  
  /**
   * Carica le lavorazioni da localStorage
   */
  loadDraft(): ILavorazioneParcheggiata[] | null {
    try {
      const draft = localStorage.getItem(this.STORAGE_KEYS.LAVORAZIONI_DRAFT);
      return draft ? JSON.parse(draft) : null;
    } catch (error) {
      Logger.error('Errore durante il caricamento delle lavorazioni', { error });
      return null;
    }
  }
  
  /**
   * Crea un backup delle lavorazioni
   */
  createBackup(lavorazioni: ILavorazioneParcheggiata[]): void {
    try {
      const backup = {
        data: lavorazioni,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(this.STORAGE_KEYS.BACKUP, JSON.stringify(backup));
    } catch (error) {
      Logger.error('Errore durante la creazione del backup', { error });
    }
  }
  
  /**
   * Ripristina il backup
   */
  restoreFromBackup(): ILavorazioneParcheggiata[] | null {
    try {
      const backup = localStorage.getItem(this.STORAGE_KEYS.BACKUP);
      if (!backup) return null;
      
      const parsed = JSON.parse(backup);
      return parsed.data;
    } catch (error) {
      Logger.error('Errore durante il ripristino del backup', { error });
      return null;
    }
  }
  
  /**
   * Pulisce lo storage
   */
  clearStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEYS.LAVORAZIONI_DRAFT);
      localStorage.removeItem(this.STORAGE_KEYS.LAST_MODIFIED);
    } catch (error) {
      Logger.error('Errore durante la pulizia dello storage', { error });
    }
  }
}

// Registra il servizio
ServiceContainer.register('storageService', new StorageService());
```

## 8. Hook e State Management

### 8.1 PianificazioneContext

```typescript
// In context/PianificazioneContext.tsx
import React, { createContext } from 'react';
import { IPianificazioneState, IPianificazioneActions } from '../types';

interface PianificazioneContextType {
  state: IPianificazioneState;
  actions: IPianificazioneActions;
}

export const PianificazioneContext = createContext<PianificazioneContextType | undefined>(undefined);

export const initialState: IPianificazioneState = {
  materiePrime: {
    items: [],
    selected: null,
    loading: false,
    error: null
  },
  suggerimenti: {
    items: [],
    loading: false,
    error: null,
    gruppi: {},
    selectedGruppo: 'tutti'
  },
  lavorazioni: {
    parcheggiate: [],
    loading: false,
    error: null
  },
  ui: {
    showConferma: false,
    filtroCliente: 'tutti',
    ordinamento: 'data',
    showLavorazioneLibera: false
  }
};
```

### 8.2 PianificazioneProvider

```typescript
// In context/PianificazioneProvider.tsx
import React, { useReducer, useEffect } from 'react';
import { PianificazioneContext, initialState } from './PianificazioneContext';
import { pianificazioneReducer } from './pianificazioneReducer';
import { usePianificazioneActions } from '../hooks/usePianificazioneActions';
import { ServiceContainer } from '@core/services';

export const PianificazioneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pianificazioneReducer, initialState);
  const actions = usePianificazioneActions(state, dispatch);
  
  // Carica le lavorazioni salvate all'avvio
  useEffect(() => {
    const storageService = ServiceContainer.get('storageService');
    const savedLavorazioni = storageService.loadDraft();
    
    if (savedLavorazioni) {
      dispatch({
        type: 'SET_LAVORAZIONI',
        payload: savedLavorazioni
      });
    }
  }, []);
  
  // Salva le lavorazioni quando cambiano
  useEffect(() => {
    if (state.lavorazioni.parcheggiate.length > 0) {
      const storageService = ServiceContainer.get('storageService');
      storageService.saveDraft(state.lavorazioni.parcheggiate);
    }
  }, [state.lavorazioni.parcheggiate]);
  
  return (
    <PianificazioneContext.Provider value={{ state, actions }}>
      {children}
    </PianificazioneContext.Provider>
  );
};
```

### 8.3 usePianificazione

```typescript
// In hooks/usePianificazione.ts
import { useContext } from 'react';
import { PianificazioneContext } from '../context/PianificazioneContext';

export const usePianificazione = () => {
  const context = useContext(PianificazioneContext);
  
  if (!context) {
    throw new Error('usePianificazione deve essere usato dentro PianificazioneProvider');
  }
  
  return context;
};
```

### 8.4 usePianificazioneActions

```typescript
// In hooks/usePianificazioneActions.ts
import { useCallback } from 'react';
import { ServiceContainer } from '@core/services';
import { ApiService } from '@core/api';
import { Logger } from '@core/logging';
import { IPianificazioneState, IPianificazioneActions, ILavorazioneParcheggiata } from '../types';

export const usePianificazioneActions = (
  state: IPianificazioneState,
  dispatch: React.Dispatch<any>
): IPianificazioneActions => {
  // Materie Prime
  const loadMateriePrime = useCallback(async () => {
    try {
      dispatch({ type: 'LOADING_MATERIE_PRIME' });
      const response = await ApiService.get('materiePrime');
      const materiePrimeFiltrate = response.data.filter(mp => mp.quantitaResidua > 0);
      dispatch({ type: 'SET_MATERIE_PRIME', payload: materiePrimeFiltrate });
    } catch (error) {
      Logger.error('Errore caricamento materie prime', { error });
      dispatch({ type: 'ERROR_MATERIE_PRIME', payload: error.message });
    }
  }, [dispatch]);
  
  const selectMateriaPrima = useCallback((materiaPrima) => {
    dispatch({ type: 'SELECT_MATERIA_PRIMA', payload: materiaPrima });
  }, [dispatch]);
  
  // Suggerimenti
  const loadSuggerimenti = useCallback(async (materiaPrimaId) => {
    try {
      dispatch({ type: 'LOADING_SUGGERIMENTI' });
      
      const materiaPrima = state.materiePrime.items.find(mp => mp._id === materiaPrimaId);
      if (!materiaPrima) throw new Error('Materia prima non trovata');
      
      const response = await ApiService.get('ricette');
      const calculationsService = ServiceContainer.get('calculationsService');
      
      const suggerimenti = calculationsService.calcolaSuggerimenti(response.data, materiaPrima);
      const gruppi = calculationsService.raggruppaPerCategoria(suggerimenti);
      
      dispatch({ 
        type: 'SET_SUGGERIMENTI', 
        payload: { suggerimenti, gruppi }
      });
    } catch (error) {
      Logger.error('Errore caricamento suggerimenti', { error });
      dispatch({ type: 'ERROR_SUGGERIMENTI', payload: error.message });
    }
  }, [dispatch, state.materiePrime.items]);
  
  // Altri metodi per gestire suggerimenti, lavorazioni, UI...
  
  return {
    loadMateriePrime,
    selectMateriaPrima,
    loadSuggerimenti,
    // Altri metodi...
  };
};
```

## 9. Problemi Specifici da Risolvere

### 9.1 Matching degli Ingredienti

#### Problema
Il sistema attuale fa fatica a riconoscere ingredienti quando il nome non è esattamente identico, portando a suggerimenti mancanti o imprecisi.

#### Soluzione
1. **Normalizzazione dei nomi**: rimuovere spazi, accenti, converti in lowercase
2. **Sistema di sinonimi**: database di equivalenze (es. "pomodoro" = "pomodori")
3. **Matching parziale**: utilizzare algoritmi come la distanza di Levenshtein
4. **Score di confidenza**: calcolare un punteggio per ogni match
5. **Validazione manuale**: permettere all'utente di confermare/correggere match incerti

```typescript
// Esempio di implementazione migliorata
export class IngredientMatcher {
  private normalizeString(str: string): string {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private calculateLevenshteinDistance(a: string, b: string): number {
    // Implementazione algoritmo
  }

  public getMatchScore(materiaPrima: string, ingrediente: string): number {
    const normalizedMP = this.normalizeString(materiaPrima);
    const normalizedIng = this.normalizeString(ingrediente);

    // Match esatto
    if (normalizedMP === normalizedIng) return 1;

    // Match per sottostringa
    if (normalizedMP.includes(normalizedIng) || normalizedIng.includes(normalizedMP)) {
      return normalizedMP.length > normalizedIng.length ? 0.9 : 0.8;
    }

    // Match per distanza di Levenshtein
    const distance = this.calculateLevenshteinDistance(normalizedMP, normalizedIng);
    const maxLength = Math.max(normalizedMP.length, normalizedIng.length);
    const similarity = 1 - (distance / maxLength);

    return similarity > 0.7 ? similarity : 0;
  }
}
9.2 Allocazione delle Quantità
Problema
La gestione delle quantità allocate non tiene traccia correttamente del totale, causando potenziali sovrallocazioni.

Soluzione
Sistema di tracking centralizzato: monitorare la quantità totale e quella allocata
Validazione in tempo reale: verificare che la quantità richiesta sia disponibile
Visualizzazione chiara: mostrare graficamente quanto è già allocato
Allocazione temporanea: marcare le quantità come "prenotate" ma non ancora confermate
```typescript
// Esempio di implementazione migliorata
export class QuantityTracker {
  /**
   * Calcola la quantità totale allocata per una materia prima
   */
  public calculateTotalAllocated(lavorazioni: ILavorazioneParcheggiata[], materiaPrimaId: string): number {
    return lavorazioni
      .filter(lav => lav.materiaPrima.id === materiaPrimaId)
      .reduce((sum, lav) => sum + lav.quantitaTotale, 0);
  }

  /**
   * Calcola la quantità disponibile per una materia prima
   */
  public calculateAvailable(materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): number {
    const allocated = this.calculateTotalAllocated(lavorazioni, materiaPrima._id);
    return materiaPrima.quantitaResidua - allocated;
  }

  /**
   * Verifica se una quantità richiesta è valida
   */
  public validateQuantity(quantity: number, materiaPrima: IMateriaPrima, lavorazioni: ILavorazioneParcheggiata[]): IValidazione {
    const available = this.calculateAvailable(materiaPrima, lavorazioni);
    
    if (quantity <= 0) {
      return {
        valido: false,
        messaggio: 'La quantità deve essere maggiore di zero',
        codice: 'INVALID_QUANTITY'
      };
    }
    
    if (quantity > available) {
      return {
        valido: false,
        messaggio: `Quantità richiesta (${quantity.toFixed(2)} kg) superiore alla disponibilità (${available.toFixed(2)} kg)`,
        codice: 'EXCEEDED_AVAILABILITY'
      };
    }
    
    return { valido: true };
  }
}
```

### 9.3 Creazione Lavorazioni

#### Problema
La creazione di lavorazioni manca di validazioni complete e può generare record incompleti o incoerenti.

#### Soluzione
1. **Validazione completa**: verificare tutti i campi obbligatori
2. **Mapping automatico**: mappare correttamente i dati dai suggerimenti alle lavorazioni
3. **Preview**: mostrare una preview della lavorazione prima della conferma
4. **Transazioni**: gestire l'intero processo come transazione atomica

```typescript
// Esempio di implementazione migliorata
export class LavorazioneCreator {
  /**
   * Prepara una nuova lavorazione a partire da un suggerimento
   */
  public prepareLavorazione(
    suggerimento: ISuggerimento,
    materiaPrima: IMateriaPrima,
    quantita: number
  ): ILavorazioneParcheggiata {
    return {
      id: Date.now(),
      ricettaId: suggerimento.ricetta._id,
      ricettaNome: suggerimento.ricetta.nome,
      materiaPrima: {
        id: materiaPrima._id,
        nome: materiaPrima.products[0].name,
        lotNumber: materiaPrima.products[0].lotNumber
      },
      quantitaTotale: quantita,
      porzioniPreviste: Math.floor((quantita * 1000) / suggerimento.ricetta.grammiPerPorzione),
      grammiPerPorzione: suggerimento.ricetta.grammiPerPorzione,
      cliente: materiaPrima.cliente.nome,
      clienteId: materiaPrima.cliente._id,
      dataCreazione: new Date().toISOString()
    };
  }

  /**
   * Valida una lavorazione
   */
  public validateLavorazione(lavorazione: ILavorazioneParcheggiata): IValidazione {
    const requiredFields = [
      'ricettaId', 'ricettaNome', 'materiaPrima', 
      'quantitaTotale', 'porzioniPreviste', 'grammiPerPorzione',
      'cliente', 'clienteId'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = lavorazione[field as keyof ILavorazioneParcheggiata];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      return {
        valido: false,
        messaggio: `Campi obbligatori mancanti: ${missingFields.join(', ')}`,
        codice: 'MISSING_FIELDS'
      };
    }
    
    if (lavorazione.quantitaTotale <= 0) {
      return {
        valido: false,
        messaggio: 'La quantità deve essere maggiore di zero',
        codice: 'INVALID_QUANTITY'
      };
    }
    
    if (lavorazione.porzioniPreviste <= 0) {
      return {
        valido: false,
        messaggio: 'Il numero di porzioni deve essere maggiore di zero',
        codice: 'INVALID_PORTIONS'
      };
    }
    
    return { valido: true };
  }
}
```

## 10. Piano di Migrazione (Milestone)

### Milestone 1: Definizione e Preparazione (Tempo stimato: 1-2 giorni)
1. **Definizione di tutte le interfacce e tipi**
   - Creare i file di tipi per materie prime, ricette, lavorazioni
   - Definire le interfacce di stato e azioni
   
2. **Setup struttura cartelle**
   - Creare la struttura delle cartelle seguendo lo schema definito
   - Preparare i file boilerplate iniziali
   
3. **Configurare i test**
   - Setup ambiente di test
   - Definire le strategie di test per il modulo

### Milestone 2: Servizi di Base (Tempo stimato: 2-3 giorni)
1. **Implementation di IngredientMatchingService**
   - Algoritmi di matching avanzati
   - Test di compatibilità
   
2. **Implementazione di CalculationsService**
   - Calcolo suggerimenti
   - Gestione quantità e porzioni
   
3. **Implementazione di StorageService**
   - Persistenza localStorage
   - Backup e recovery
   
4. **Integrazione con il core**
   - Registrazione servizi
   - Plugin di modulo

### Milestone 3: State Management (Tempo stimato: 2-3 giorni)
1. **Implementazione dello state**
   - Definizione del reducer
   - Azioni e dispatchers
   
2. **Implementazione del Provider**
   - Context Provider
   - Caricamento dati iniziali
   
3. **Implementazione degli hook**
   - Hook principali per accesso allo stato
   - Hook per azioni specifiche

### Milestone 4: Componenti UI Core (Tempo stimato: 3-4 giorni)
1. **Componente MateriePrimeList**
   - Lista materie prime
   - Filtri e selezione
   
2. **Componente SuggerimentiLavorazione**
   - Visualizzazione suggerimenti
   - Gestione della selezione
   
3. **Componente BrogliaccioLavorazioni**
   - Riepilogo lavorazioni
   - Modifica parametri

### Milestone 5: Componenti UI Avanzati (Tempo stimato: 3-4 giorni)
1. **Componente LavorazioniParcheggiate**
   - Gestione delle lavorazioni in attesa
   - Filtri e ordinamento
   
2. **Componente ConfermaLavorazione**
   - Modal di conferma
   - Validazione finale
   
3. **Componenti di supporto**
   - Card, form, alert, ecc.

### Milestone 6: Integrazione e Testing (Tempo stimato: 2-3 giorni)
1. **Integrazione con il router**
   - Aggiungere rotte
   - Navigazione tra moduli
   
2. **Test di integrazione**
   - Test della UI
   - Test dei flussi dati
   
3. **Performance e ottimizzazioni**
   - Memoization
   - Riduzioni re-render
   
4. **Documentazione finale**
   - Aggiornare README
   - Documentare API e componenti

## 11. Convenzioni e Standard

### 11.1 Naming Convention
- **File**: camelCase per file ordinari, PascalCase per componenti React
- **Componenti**: PascalCase (es. `MateriePrimeList.tsx`)
- **Interfacce**: prefisso `I` (es. `IMateriaPrima`)
- **Tipi**: PascalCase senza prefisso (es. `QuantityTracking`)
- **Costanti**: UPPER_SNAKE_CASE (es. `API_ENDPOINTS`)
- **Funzioni/Metodi**: camelCase (es. `calculateAvailable`)

### 11.2 Struttura dei Componenti
- Utilizzare functional components con hooks
- Separare la logica di business dai componenti di presentazione
- Gestire lo stato tramite hooks e context
- Utilizzare stili incapsulati con styled-components

```typescript
// Esempio di struttura componente
const MateriePrimeList: React.FC = () => {
  // Hooks in cima
  const { state, actions } = usePianificazione();
  
  // Event handlers
  const handleSelection = (mp: IMateriaPrima) => {
    actions.selectMateriaPrima(mp);
  };
  
  // Logica condizionale e preparazione dati
  const materiePrimeDisponibili = state.materiePrime.items.filter(mp => mp.quantitaResidua > 0);
  
  // JSX
  return (
    <S.Container>
      {/* JSX del componente */}
    </S.Container>
  );
};
```

### 11.3 Gestione degli Errori
- Utilizzare try/catch per operazioni asincrone
- Loggare gli errori con il sistema di logging del core
- Mostrare messaggi di errore user-friendly
- Implementare fallback UI per gestire stati di errore

### 11.4 Testing
- Unit test per servizi e utility
- Integration test per componenti
- Snapshot test per UI
- E2E test per flussi completi

### 11.5 Performance
- Utilizzare React.memo per componenti che non cambiano spesso
- Utilizzare useCallback e useMemo per funzioni e valori complessi
- Evitare re-render non necessari
- Ottimizzare le ricerche e i filtri con debounce/throttle

### 11.6 Accessibilità
- Utilizzare semantica HTML appropriata
- Aggiungere attributi aria quando necessario
- Assicurarsi che tutti i controlli siano accessibili da tastiera
- Mantenere un contrasto adeguato per tutti i testi

### 11.7 Integrazione con lo Style Guide
Seguire lo style guide definito per il progetto:
- Utilizzare il theme system per colori, spaziature, ecc.
- Seguire la tipografia definita
- Utilizzare i componenti UI comuni quando possibile
- Garantire coerenza visiva con il resto dell'applicazione
