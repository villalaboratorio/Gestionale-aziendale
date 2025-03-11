# Gestionale Aziendale - Piano di Sviluppo

## Obiettivo
Rifattorizzazione modulare del sistema con nuovo core architecture.

## Struttura Implementata
src/
├── core/                  # Sistema modulare implementato
│   ├── events/           # Event bus e gestione eventi
│   ├── services/         # Service container
│   ├── plugins/          # Sistema plugin 
│   ├── config/           # Gestione configurazioni
│   ├── cache/           # Sistema di caching
│   ├── http/            # Client HTTP
│   ├── api/             # Servizio API
│   ├── errors/          # Gestione errori
│   └── logging/         # Sistema logging
└── features/            # Feature modules

# Gestionale Aziendale - Development Guide

## Architettura Core (✅ COMPLETATO)

### Event System
- Implementazione EventBus
- Event Types e Handlers
- Event Subscription System
- Event History

### Service Container
- Service Registration
- Dependency Injection
- Service Lifecycle Management
- Singleton Services

### API Layer
- API Service Base
- Request/Response Handling
- Error Management
- Caching Strategy

## Feature Foundation (✅ COMPLETATO)

### Types & Interfaces
- Domain Models
- DTO Types
- State Types
- Service Interfaces

### State Management
- State Containers
- State Updates
- State Persistence
- State Synchronization

### Context Layer
- Context Providers
- Context Consumers
- Context Actions
- Context Events

## Nuovi Milestone

PATTERN DI PROGETTAZIONE
src/features/lavorazioni/modules/{nome-modulo}/
  ├── types/
  │   ├── state.ts        // Definizione stati e tipi
  │   ├── events.ts       // Eventi del modulo
  │   └── models.ts       // Modelli dati
  │
  ├── context/
  │   ├── {Module}Context.tsx     // Context principale
  │   └── {Module}Provider.tsx    // Provider separato
  │
  ├── hooks/
  │   ├── use{Module}.ts         // Hook principale
  │   ├── use{Module}State.ts    // Gestione stato
  │   ├── use{Module}Actions.ts  // Actions e handlers
  │   └── use{Module}Events.ts   // Gestione eventi
  │
  ├── services/
  │   └── {module}.service.ts    // Logica business e API
  │
  ├── components/
  │   ├── {Module}Container.tsx  // Container principale
  │   ├── {Module}Header.tsx     // Header componente
  │   ├── {Module}Content.tsx    // Contenuto principale
  │   └── {Module}Controls.tsx   // Controlli e azioni
  │
  └── index.ts                   // Export pubblici

### 1. Dashboard Module 
#### 1.1 Lista Lavorazioni
- Grid Component
- Row Actions
- Bulk Actions
- Sorting
- Pagination

#### 1.2 Filtri e Ricerca
- Filter Panel
- Search Component
- Filter Logic
- Advanced Filters
- Filter Persistence

#### 1.3 Statistiche Generali
- Stats Cards
- Charts
- KPI Indicators
- Data Aggregation
- Real-time Updates

### 2. Dettaglio Module
#### 2.1 Tab Navigation
- Tab System
- Route Integration
- State Persistence
- Tab Events

#### 2.2 Info Generali
- Form Base
- Validation
- Auto-save
- History

#### 2.3 Ingredienti
- Ingredients Grid
- Quantities
- Stock Integration
- Cost Calculation

#### 2.4 Passaggio Lavorazioni
- Steps Management
- Step Sequence
- Time Tracking
- Quality Checks

#### 2.5 Assemblaggio
- Assembly Steps
- Components
- BOM Management
- Assembly Validation

#### 2.6 Cottura
- Cooking Parameters
- Temperature Control
- Time Management
- Quality Checks

#### 2.7 Abbattimento
- Temperature Monitoring
- Time Control
- Safety Checks
- Documentation

#### 2.8 Confezionamento
- Packaging Types
- Labels
- Quantities
- Quality Control

#### 2.9 Report
- Data Collection
- PDF Generation
- Export Options
- Analytics

## Development Flow
1. Implementazione Dashboard
2. Implementazione Dettaglio base
3. Sviluppo singoli moduli tab
4. Integrazione funzionalità trasversali
5. Testing e ottimizzazione

## Struttura del Codice
```typescript
src/
  ├── core/
  │   ├── events/
  │   ├── services/
  │   └── plugins/
  ├── features/
  │   └── lavorazioni/
  │       ├── types/
  │       ├── context/
  │       ├── hooks/
  │       ├── services/
  │       └── components/
  └── shared/
      ├── utils/
      └── components/## Integrazioni Reali

### Con Altri Moduli
1. Ricette
   - Selezione ricetta
   - Import parametri cottura
   - Gestione fasi di lavorazione

2. Clienti
   - Associazione ordini
   - Dati cliente








Componenti Core
1. DettaglioLavorazione.js
Componente principale per la gestione di una lavorazione
Integra tutti i sotto-componenti
Gestisce il routing e i parametri URL
Utilizza LavorazioneContext per lo state management
2. LavorazioneContext.js
Gestisce lo stato globale della lavorazione
Fornisce actions per modificare lo stato
Gestisce loading states e errori
Mantiene la coerenza dei dati tra componenti
3. Sistema Cotture
Components
CotturaForm: Form principale per i dati cottura
CotturaTimer: Gestione temporizzazione cottura
CotturaControls: Controlli operativi (start/stop/pausa)
CotturaParameters: Parametri specifici cottura
Hooks
UseCotturaState: Gestione stato cottura
useCotturaActions: Azioni cottura (start/complete/update)
useCotturaTimer: Logica timer e calcoli tempo
useCotturaValidation: Validazione dati cottura
Events
Sistema eventi per comunicazione tra componenti
Tracking stato cottura
Notifiche e aggiornamenti real-time
4. API Layer (LavorazioneApi.js)
Endpoints implementati:

- getDashboardLavorazioni(filters, page, pageSize)
- getLavorazione(id, options)
- getCollections()
- createLavorazione(data)
- updateLavorazione(id, data)
- deleteLavorazione(id)
- saveModifica(id, campo, valore)
- getTipiCottura()
- registerTemperatura(lavorazioneId, datiTemperatura)
- getCotture(lavorazioneId)
- updateCottura(lavorazioneId, cotturaId, data)

Copy

Apply

5. Custom Hooks
useLavorazione: Gestione CRUD lavorazione
useTabNavigation: Gestione navigazione tabs
Flusso Dati
User Input → Components
Components → Context/Hooks
Hooks → API Service
API Response → Context Update
Context Update → UI Refresh
Integrazioni
Con Ricette:

Selezione ricetta per lavorazione
Import parametri cottura
Validazione compatibilità
Con Sistema Eventi:

Tracking modifiche
Notifiche stato
Logging operazioni
Validazioni
Parametri Cottura:

Temperature (min/max)
Tempi cottura
Sequenza operazioni
Dati Lavorazione:

Campi obbligatori
Formati dati
Stati permessi
Stati Lavorazione
enum StatoLavorazione {
  PIANIFICATA = 'pianificata',
  IN_CORSO = 'in_corso',
  COMPLETATA = 'completata',
  ANNULLATA = 'annullata'
}

Copy

Apply

Stati Cottura
enum StatoCottura {
  NON_INIZIATA = 'non_iniziata',
  IN_CORSO = 'in_corso',
  COMPLETATA = 'completata'
}

Copy

Apply

Tech Stack
React (Hooks + Context)
TypeScript (in fase di migrazione)
REST API
Event-driven architecture
