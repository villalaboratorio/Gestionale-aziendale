
## Componenti Principali

### DashboardContainer

**Funzione**: Container principale che organizza e coordina tutti i sottocomponenti.

**Caratteristiche**:
- Gestisce il flusso dati tra componenti
- Implementa le chiamate API attraverso hooks
- Gestisce lo stato globale del modulo

**Dipendenze**:
- `useDashboardState`: Hook per gestione stato
- `useDashboardActions`: Hook per azioni e API
- Componenti: StatsGrid, Filters, LavorazioniTable

### Filters

**Funzione**: Interfaccia per filtri di ricerca e ordinamento.

**Caratteristiche**:
- Campo di ricerca centrale per filtrare per testo
- Filtri secondari (stato, date) su un'unica riga
- Layout responsive
- Reset filtri con un clic

**Eventi**:
- `onFilter`: Invia filtri aggiornati al container
- `handleReset`: Reimpostazione di tutti i filtri

### LavorazioniTable

**Funzione**: Visualizzazione tabellare delle lavorazioni.

**Caratteristiche**:
- Layout a tabella con colonne configurate
- Visualizzazione badge di stato
- Formattazione date
- Gestione stati vuoti e caricamento
- Navigazione al dettaglio lavorazione

**Eventi**:
- `onRefresh`: Ricarica i dati della tabella
- `handleDetailClick`: Navigazione al dettaglio

### StatsGrid

**Funzione**: Visualizzazione KPI e statistiche principali.

**Caratteristiche**:
- Card statistiche per metriche chiave
- Conteggio automatico per stato
- Layout responsive a grid

## Design System

Il modulo implementa il design system aziendale con:

### Colori:
- Primary: #2563eb
- Success: #10b981
- Warning: #f59e0b
- Danger: #ef4444
- Text Primary: #1e293b
- Text Secondary: #64748b
- Background: #f8fafc
- Card Background: white
- Border: #e2e8f0

### Spacing:
- Container padding: 24px
- Card padding: 16-20px
- Element gap: 8-16px

### Tipografia:
- Title: 24px, 600 weight
- Subtitle: 16px
- Card Header: 1.25rem, 600 weight
- Stat Value: 28px bold
- Table Content: 16px

### Componenti UI:
- Card con bordi arrotondati (8px) e ombreggiature leggere
- Tabelle con intestazioni distinte
- Form controls con altezza uniforme (42px)
- Badge colorati per stati

## State Management

Lo stato viene gestito attraverso React Hooks personalizzati:

### useDashboardState
- Gestisce items, loading e filters
- Fornisce setter per aggiornare lo stato

### useDashboardActions
- Implementa chiamate API
- Gestisce il recupero dati
- Manipola la risposta API

## Flusso Dati

1. **Inizializzazione**:
   - Il container si monta e chiama `fetchData()`
   - `loadData()` esegue la chiamata API
   - I dati vengono memorizzati nello stato

2. **Filtraggio**:
   - Utente modifica i filtri e applica
   - Il container aggiorna lo stato dei filtri
   - I nuovi filtri vengono passati all'API
   - La tabella si aggiorna con i risultati filtrati

3. **Aggiornamento**:
   - Il pulsante "Aggiorna" richiama `fetchData()`
   - I dati vengono ricaricati e lo stato aggiornato

## Responsive Design

- Layout a griglia per statistiche che si adatta a dimensioni diverse
- Filtri che si impilano su dispositivi mobili
- Tabella con scroll orizzontale su schermi piccoli

## Estensioni Future

- Paginazione tabella
- Ordinamento colonne
- Filtri avanzati espandibili
- Export dati in CSV/Excel
- Dashboard view personalizzabili
- KPI aggiuntivi e grafici trend

## Integrazioni

- Si collega alle API `/api/v2/lavorazioni`
- Utilizza il sistema di routing per navigare ai dettagli
- Integra con il sistema di cotture per monitoraggio

