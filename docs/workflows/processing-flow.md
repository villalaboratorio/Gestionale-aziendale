# Flusso Lavorazioni da Stato "In Attesa"

## 1. AVVIO LAVORAZIONE
1.1. Presa in Carico
   - Verifica stato "in attesa"
   - Conferma disponibilità risorse
   - Assegnazione operatore
   - Cambio stato in "in corso"

1.2. Setup Iniziale
   - Recupero dati pianificazione
   - Conferma materie prime assegnate
   - Verifica documentazione HACCP
   - Preparazione postazione

## 2. ESECUZIONE FASI
2.1. Fase Preparazione
   - Conferma prelievi materie prime
   - Registrazione temperature iniziali
   - Avvio preparazione
   - Log operazioni

2.2. Fase Cottura
   - Setup parametri
   - Monitoraggio real-time
   - Registrazione allarmi/eventi
   - Validazione fine fase

2.3. Fase Abbattimento
   - Controllo temperature
   - Monitoraggio tempi
   - Validazione parametri
   - Conferma completamento

## 3. CONTROLLI E CHIUSURA
3.1. Validazione Processo
   - Verifica parametri HACCP
   - Controllo documentazione
   - Approvazione qualità
   - Cambio stato in "completata"
Ottimo, definiamo la struttura dei componenti per gestire il flusso esecutivo:

# Struttura Componenti DettaglioLavorazione

## 1. Componenti Core

Copy

Apply

components-structure.md
DettaglioLavorazione/ ├── components/ │ ├── LavorazioneHeader/ # Info stato e controlli principali │ ├── FasiExecution/ # Gestione fasi operative │ │ ├── Preparazione/ │ │ ├── Cottura/ │ │ └── Abbattimento/ │ ├── HACCPControls/ # Monitoraggio parametri HACCP │ └── DocumentazionePanel/ # Gestione documenti e log


## 2. Hooks Personalizzati

Copy

Execute

hooks/ ├── useLavorazioneState.ts # Gestione stati lavorazione ├── useFasiControl.ts # Controllo fasi ├── useHACCPValidation.ts # Validazione parametri └── useDocumentazione.ts # Gestione documentale


## 3. Store

Copy

Execute

store/ ├── lavorazioneSlice.ts # Stato globale lavorazione └── hacppSlice.ts # Stato controlli HACCP