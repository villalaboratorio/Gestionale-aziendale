# Documentazione Refactoring CotturaHACCP

## 1. Obiettivi
- Recupero automatico parametri dalla ricetta
- Validazione real-time delle temperature
- Tracciamento completo processo di cottura
- Interfaccia utente ottimizzata

## 2. Struttura Dati
### 2.1 Parametri da Ricetta
```javascript
{
    tipoCottura: ObjectId,    // Riferimento a TipoCottura
    temperatura: Number,      // Temperatura target
    tempoCottura: Number,     // Durata prevista in minuti
    note: String,            // Note specifiche
    ordine: Number           // Sequenza di cottura
}

Copy

Apply

frontend\src\components\DettagliScheda\components\sections\DOCUMENTAZIONE_COTTURA.md
2.2 Stato Monitoraggio
{
    temperaturaCorrente: Number,
    inizio: String,          // Ora inizio HH:mm
    fine: String,            // Ora fine HH:mm
    addetto: String,         // Operatore
    note: String,            // Note operative
    completato: Boolean      // Stato completamento
}

Copy

Apply

3. Componenti
3.1 CotturaHACCP
Container principale
Gestione stato
Recupero parametri
Validazioni
3.2 ParametriDisplay
Visualizzazione parametri ricetta
Indicatori temperatura target
Timer cottura
3.3 MonitoraggioForm
Input temperatura
Selezione orari
Dati operatore
4. Validazioni
Range temperatura: target ±5°C
Tempo minimo cottura
Completezza dati operatore
Sequenza temporale corretta
5. API Endpoints
GET    /api/ricette/:id              // Recupero parametri ricetta
POST   /api/lavorazioni/:id/cottura  // Salvataggio dati cottura

Copy

Apply

6. Flusso Operativo
Caricamento parametri da ricetta
Validazione input operatore
Monitoraggio real-time
Conferma completamento
Salvataggio dati
7. Test Cases
Validazione temperature
Gestione errori API
Completezza dati
Sequenza temporale