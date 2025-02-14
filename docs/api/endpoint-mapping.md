# Mappatura Endpoint per Flussi Frontend

## 1. Gestione Stati Lavorazione
Backend: GET/PUT /api/dettaglio-lavorazione/:id
Frontend: useLavorazioneState
- Cambio stato da "in attesa" a "in corso"
- Monitoraggio avanzamento fasi
- Completamento lavorazione

## 2. Controllo Fasi
Backend: PUT /api/dettaglio-lavorazione/:id/fasi
Frontend: useFasiControl
- Avvio fase preparazione
- Gestione cottura
- Controllo abbattimento
- Validazione completamento

## 3. Monitoraggio HACCP
Backend: POST /api/dettaglio-lavorazione/:id/haccp
Frontend: useHACCPValidation
- Registrazione temperature
- Validazione parametri
- Log controlli qualità

## 4. Dashboard e Statistiche
Backend: GET /api/dashboard/stats
Frontend: useDashboardData
- Overview lavorazioni
- Metriche performance
- Stati e avanzamenti

## 5. Documentazione
Backend: PUT /api/dettaglio-lavorazione/:id/documenti
Frontend: useDocumentazione
- Upload documenti
- Generazione report
- Archiviazione dati
