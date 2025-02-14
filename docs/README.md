# Sistema Gestione Lavorazioni

# Sistema Gestione Lavorazioni

## 1. Dashboard Lavorazioni
### Componenti Implementati
- LavorazioniDashboard
   - Visualizzazione tabellare
   - Statistiche (totali, in lavorazione, in attesa, completate)
   - Filtri rapidi
   - Paginazione

- LavorazioniTable
   - Visualizzazione dati
   - Click handler per dettaglio
   - Gestione stati con badge colorati
   - Paginazione integrata

### Hooks
- useDashboardLavorazioni
   - Gestione stato
   - Chiamate API
   - Gestione filtri
   - Paginazione

## 2. Dettaglio Lavorazione
### Componenti Implementati
- DettaglioLavorazione
   - Gestione creazione/modifica
   - Sistema di tabs
   - Routing parametrico

- LavorazioneTabs
   - Tab Informazioni Generali
   - Tab Cottura
   - Tab Abbattimento
   - Tab Assemblaggio

## 3. Routing
- /lavorazioni → Dashboard
- /dettaglio-lavorazioni/nuovo → Nuova Lavorazione
- /dettaglio-lavorazioni/:id → Modifica Lavorazione

# Sistema Gestione Lavorazioni

## Funzionalità
- [Dashboard Lavorazioni](/docs/DashboardLavorazioni.md)
- [Dettaglio Lavorazione](/docs/features/lavorazioni/dettaglio.md)

## Architettura
- [Struttura Completa](/docs/architecture/full-structure.md)
- [Interfacce Sistema](/docs/architecture/interfaces.md)
- [Panoramica Sistema](/docs/architecture/system-overview.md)
- [Struttura Base](/docs/architecture/structure.md)

## Flussi e Processi
- [Flusso Dettagliato](/docs/workflows/detailed-flow.md)
- [Stati del Sistema](/docs/workflows/states.md)
- [Diagramma Flusso](/docs/workflows/workflow-diagram.md)
- [Flusso Lavorazioni](/docs/workflows/processing-flow.md)

## API e Integrazione
- [Mappatura Endpoint](/docs/api/endpoint-mapping.md)

## Quick Start
1. Panoramica Sistema
    - Consultare [Struttura Completa](architecture/full-structure.md)
    - Revisione [Flusso Dettagliato](workflows/detailed-flow.md)

2. Implementazione
    - Setup backend esistente
    - Integrazione frontend con API
    - Configurazione workflow

3. Testing
    - Unit test componenti
    - Integration test flussi
    - Validazione HACCP

## Note Tecniche
- Backend: Node.js + MongoDB
- Frontend: React + Styled Components
- API: REST + JSON
- Documentazione: Markdown + Mermaid

[... contenuto precedente ...]

## Getting Started

### Prerequisiti
```bash
node -v  # >= 16.x
npm -v   # >= 8.x
mongodb  # >= 5.x
git clone [repository]
cd [project-folder]
npm install

MONGO_URI=mongodb://localhost:27017/lavorazioni
PORT=3000

// Recupero lavorazione
const lavorazione = await getLavorazione(id);

// Aggiornamento stato
await updateStatoLavorazione(id, 'IN_CORSO');

// Registrazione parametri HACCP
await updateParametriHACCP(id, parametri);
npm run dev     # Avvio sviluppo
npm run build   # Build produzione
npm run test    # Esecuzione test

## Contesto Operativo

### Scenario Tipico
1. L'operatore riceve notifica di nuove lavorazioni pianificate
2. Visualizza la dashboard con lavorazioni "IN_ATTESA"
3. Seleziona una lavorazione e ne verifica i dettagli:
   - Ricetta da produrre
   - Quantità richieste
   - Materie prime assegnate
   - Tempistiche previste

### Flusso Operatore
1. Avvio Lavorazione
   - Conferma disponibilità postazione
   - Verifica materie prime
   - Inizia registrazione parametri

2. Esecuzione
   - Monitora temperature
   - Registra tempi
   - Documenta fasi critiche
   - Gestisce eventuali allarmi

3. Completamento
   - Verifica parametri finali
   - Compila documentazione
   - Chiude la lavorazione

### Punti di Attenzione
- Controlli HACCP obbligatori
- Gestione anomalie
- Tracciabilità lotti
- Documentazione completa


## Documentation
- [Dashboard Lavorazioni](DashboardLavorazioni.md)
- [Architecture](architecture/full-structure.md)
- [Workflows](workflows/detailed-flow.md)
- [API](api/endpoint-mapping.md)
