PANORAMICA FUNZIONALE MATERIE PRIME
SCOPO DEL MODULO:

Gestione completa delle materie prime in ingresso
Tracciamento delle quantità disponibili
Monitoraggio dei prelievi
Associazione con clienti e documenti
FUNZIONALITÀ PRINCIPALI:

Registrazione Materie Prime

Inserimento documenti di trasporto
Caricamento file associati
Assegnazione cliente
Definizione prodotti e lotti
Gestione Inventario

Tracciamento quantità iniziale
Monitoraggio quantità residua
Storico prelievi
Stato disponibilità
Sistema Prelievi

Registrazione quantità prelevate
Calcolo automatico residui
Tracciamento destinazione
Gestione porzioni
FLUSSI OPERATIVI:

Inserimento

Creazione documento
Upload file
Definizione prodotti
Salvataggio dati
Monitoraggio

Visualizzazione stato
Filtri per disponibilità
Ricerca documenti
Gestione modifiche
Prelievi

Verifica disponibilità
Registrazione movimento
Aggiornamento giacenze
Tracciamento lotti
STRUTTURA DATI MATERIE PRIME
SCHEMA PRINCIPALE (MateriePrimeModel):

Campi Base

documentNumber (String, unique)
date (Date)
cliente (ObjectId, ref: 'Cliente')
documentFile (String)
quantitaIniziale (Number)
quantitaResidua (Number)
Schema Prodotti (ProductSchema)

name (String)
quantity (Number, min: 1)
unit (ObjectId, ref: 'Units')
lotNumber (String)
Schema Prelievi (PrelievoSchema)

quantitaPrelevata (Number)
dataPrelievo (Date)
numeroPorzioni (Number)
grammiPerPorzione (Number)
quantitaResidua (Number)
lotNumber (String)
destinazioneLavorazione (ObjectId)
RELAZIONI:

Collegamenti Diretti

Cliente (one-to-many)
Units (one-to-many)
DettaglioLavorazione (one-to-many)
Validazioni Implementate

Quantità minime
Documento univoco
Presenza prodotti
Integrità riferimenti
Sistema Tracciamento

Calcolo automatico residui
Storico prelievi
Gestione lotti
Collegamenti lavorazioni
API DISPONIBILI MATERIE PRIME
ENDPOINTS PRINCIPALI:

Creazione (/api/materie-prime)

Metodo: POST
Gestione multipart per files
Validazione dati
Risposta: oggetto creato popolato
Lettura

Lista (/api/materie-prime)
Metodo: GET
Popolamento relazioni
Filtri disponibili
Dettaglio (/api/materie-prime/:id)
Metodo: GET
Dati completi
Relazioni popolate
Aggiornamento (/api/materie-prime/:id)

Metodo: PUT
Gestione file esistenti
Validazione modifiche
Risposta: oggetto aggiornato
Eliminazione (/api/materie-prime/:id)

Metodo: DELETE
Pulizia files
Verifiche integrità
Risposta: conferma
Prelievi (/api/materie-prime/:id/prelievo)

Metodo: POST
Validazione quantità
Aggiornamento giacenze
Tracciamento movimento
LOGICA DI BUSINESS MATERIE PRIME
GESTIONE PRELIEVI:

Sistema di Controllo

Verifica disponibilità
Validazione quantità
Calcolo automatico residui
Tracciamento storico
Gestione Documenti

Upload file multipli
Validazione formati
Gestione storage
Pulizia automatica
Calcolo Giacenze

Quantità iniziale
Monitoraggio prelievi
Aggiornamento real-time
Soglie di alert
Tracciamento Lotti

Assegnazione automatica
Collegamento prelievi
Storico movimenti
Verifica integrità
Validazioni Business

Controllo quantità
Verifica riferimenti
Integrità dati
Gestione errori
INTERFACCIA UTENTE MATERIE PRIME
COMPONENTI PRINCIPALI:

Lista Materie Prime

Tabella principale
Filtri dinamici
Sistema di ricerca
Indicatori stato
Modale Gestione

Form inserimento/modifica
Upload documenti
Gestione prodotti
Validazione campi
Sistema di Filtri

Stato (attive/esaurite)
Cliente
Data
Documento
Gestione Stati

Visualizzazione quantità
Indicatori residuo
Alert esaurimento
Storico movimenti
Interazioni Utente

Creazione rapida
Modifica inline
Conferme operazioni
Feedback visivi
Responsive Design

Layout adattivo
Visualizzazione mobile
Ottimizzazione tabelle
Accessibilità
SPECIFICHE TECNICHE MATERIE PRIME
STACK TECNOLOGICO:

Backend

Node.js
Express
MongoDB/Mongoose
Multer (gestione file)
Frontend

React
Axios
CSS Modules
Styled Components
STRUTTURA CODICE:

Backend
/backend
  /controllers
    - materiePrimeController.js
  /models
    - materiePrimeModel.js
  /routes
    - materiePrimeRoutes.js
  /helpers
    - materiePrimeHelper.js

Copy

Execute

Frontend
/frontend
  /src
    /components
    /modal
    /styles
    /pages
      - MateriePrime.js

Copy

Execute

PATTERN IMPLEMENTATI:

MVC (Model-View-Controller)

Model: materiePrimeModel.js
View: componenti React
Controller: materiePrimeController.js
Repository Pattern

Separazione logica business
Gestione dati centralizzata
Helper functions
DIAGRAMMI TECNICI MATERIE PRIME
FLUSSO DATI:

Client Request -> Router -> Controller -> Model -> Database
                                     -> Helper  -> File System
Response      <- Router <- Controller <- Model
                                     <- Helper

Copy

Apply

RELAZIONI TRA MODELLI:

MateriePrime
    │
    ├── Cliente (ref)
    │
    ├── Products
    │   └── Units (ref)
    │
    └── Prelievi
        └── DettaglioLavorazione (ref)

Copy

Apply

SEQUENZA OPERAZIONI:

Creazione Materia Prima
Upload File -> Validazione -> Salvataggio File -> Creazione Record -> Popolamento

Copy

Apply

Prelievo
Richiesta -> Verifica Disponibilità -> Aggiornamento Quantità -> Registrazione Prelievo

Copy

Apply

ARCHITETTURA SISTEMA:

Frontend (React) <-> API Layer <-> Business Logic <-> Data Layer
                                          DOCUMENTAZIONE API MATERIE PRIME
ENDPOINTS DETTAGLIATI:

POST /api/materie-prime/
Request:
- Content-Type: multipart/form-data
- Body: {
    documentNumber: String,
    date: Date,
    cliente: ObjectId,
    products: [{
        name: String,
        quantity: Number,
        unit: ObjectId,
        lotNumber: String
    }],
    documentFile: File
}
Response:
- Status: 201
- Body: {MateriaPrima popolata con relazioni}

Copy

Apply

GET /api/materie-prime/
Request:
- Headers: Authorization
Response:
- Status: 200
- Body: [{
    _id,
    documentNumber,
    cliente: {nome},
    products: [{name, quantity, unit: {name}}],
    quantitaResidua
}]

Copy

Apply

PUT /api/materie-prime/:id
Request:
- Content-Type: multipart/form-data
- Params: id
- Body: {dati aggiornamento}
Response:
- Status: 200
- Body: {MateriaPrima aggiornata}

Copy

Apply

POST /api/materie-prime/:id/prelievo
Request:
- Params: id
- Body: {
    quantitaPrelevata: Number,
    numeroPorzioni: Number,
    grammiPerPorzione: Number
}
Response:
- Status: 200
- Body: {MateriaPrima aggiornata}
INTEGRAZIONE MODULI MATERIE PRIME - RICETTE

PUNTI DI CONNESSIONE
Ricetta
Ingredienti necessari
Quantità per porzione
Fasi di lavorazione
Materia Prima
Disponibilità
Lotti
Prelievi
FLUSSO OPERATIVO
Selezione Materia Prima
       ↓
Selezione Ricetta
       ↓
Calcolo Quantità (porzioni × grammi)
       ↓
Verifica Disponibilità
       ↓
Prelievo Automatico
       ↓
Generazione Scheda Lavorazione

SPECIFICHE TECNICHE RICETTE RILEVANTI

STRUTTURA DATI RICETTA
{
    numeroRicetta: String,
    nome: String,
    categoria: ObjectId,
    porzioni: Number,
    grammiPerPorzione: Number,
    ingredienti: [{
        ingrediente: ObjectId,
        quantita: Number,
        unitaMisura: ObjectId,
        caloPeso: Number
    }]
}

Copy

Apply

SERVIZI DISPONIBILI
recipeService
getRecipe(id)
createRecipe(data)
updateRecipe(id, data)
deleteRecipe(id)
CALCOLI E CONVERSIONI
Calcolo per porzione
Conversioni unità
Validazioni quantità
Gestione ingredienti
REQUISITI MODULO PIANIFICAZIONE

GESTIONE SELEZIONI
Materie Prime
Filtro per cliente
Visualizzazione disponibilità
Tracciamento lotti
Ricette
Selezione ricetta
Definizione porzioni
Calcolo quantità necessarie
CALCOLI E VALIDAZIONI
Quantità necessarie
Porzioni × Grammi/porzione
Conversioni unità
Verifica disponibilità
Prelievi
Gestione automatica
Aggiornamento giacenze
Tracciamento lotti
GENERAZIONE LAVORAZIONI
Schede lavorazione
Creazione automatica
Stato iniziale
Collegamenti materie prime
Tracciamento prelievi
STRUTTURA TECNICA MODULO PIANIFICAZIONE

MODELLO DATI
PianificazioneLavorazione {
    cliente: ObjectId,
    materiePrime: [{
        materiaPrima: ObjectId,
        lottoSelezionato: String,
        quantitaPrelevata: Number
    }],
    ricetta: {
        ricettaId: ObjectId,
        numeroPorzioni: Number,
        grammiPorzione: Number,
        quantitaTotale: Number
    },
    stato: String,
    schedeLavorazione: [ObjectId]
}

Copy

Apply

ARCHITETTURA
/pianificazione
  /controllers
  /models
  /routes
  /services
  /validators

Copy

Execute

API NECESSARIE
POST /pianificazione/create
GET /pianificazione/cliente/:id/materie
POST /pianificazione/calcola-quantita
POST /pianificazione/genera-schede
DETTAGLI IMPLEMENTATIVI

CONTROLLER PRINCIPALE
// Funzionalità core
- getMateriePrimeByCliente
- calcolaQuantitaNecessarie
- verificaDisponibilita
- generaSchedeLavorazione
- eseguiPrelievi

Copy

Apply

SERVIZI DEDICATI
PianificazioneService {
    // Calcoli
    calcolaQuantitaTotale(porzioni, grammi)
    verificaDisponibilitaMateriePrime(materieNecessarie)
    
    // Generazione
    creaSchedeLavorazione(pianificazione)
    gestisciPrelievi(materiePrime, quantita)
    
    // Validazioni
    validaQuantita(richiesta, disponibile)
    validaLotti(lotti)
}

Copy

Apply

VALIDATORI
// Regole di validazione
- Quantità non superiori a disponibilità
- Lotti validi e disponibili
- Ricetta esistente e attiva
- Cliente autorizzato
FLUSSI DATI

FLUSSO SELEZIONE E CALCOLO
Frontend -> Backend
- Selezione Cliente
  ↓
- Lista Materie Prime disponibili
  ↓
- Selezione Ricetta
  ↓
- Calcolo quantità necessarie
  ↓
- Verifica disponibilità

Copy

Apply

FLUSSO PRELIEVI
Richiesta Prelievo
  ↓
Validazione Disponibilità
  ↓
Lock Quantità
  ↓
Aggiornamento MateriePrime
  ↓
Registrazione Prelievo

Copy

Apply

FLUSSO GENERAZIONE LAVORAZIONI
Conferma Pianificazione
  ↓
Creazione Schede
  ↓
Associazione Materie Prime
  ↓
Aggiornamento Stati
  ↓
Notifica Completamento
NTERFACCE MODULO PIANIFICAZIONE

COMPONENTI PRINCIPALI
// PianificazionePage
- Selezione cliente
- Lista materie disponibili
- Form pianificazione
- Riepilogo calcoli

// SelezioneMaterieModal
- Filtri per cliente
- Lista materie prime
- Quantità disponibili
- Selezione lotti

// PianificazioneForm
- Selezione ricetta
- Input porzioni
- Calcoli automatici
- Validazioni

Copy

Apply

STATI APPLICAZIONE
const [materiePrimeSelezionate, setMateriePrime]
const [ricettaSelezionata, setRicetta]
const [quantitaCalcolate, setQuantita]
const [statoValidazione, setValidazione]

Copy

Apply

INTERAZIONI API
// Chiamate principali
fetchMateriePrimeCliente()
calcolaQuantitaNecessarie()
verificaDisponibilita()
generaSchedeLavorazione()
TEST MODULO PIANIFICAZIONE

UNIT TEST
// Test Servizi
- Calcolo quantità
- Validazione disponibilità
- Gestione prelievi
- Generazione schede

// Test Models
- Validazioni schema
- Relazioni corrette
- Stati permessi

Copy

Apply

INTEGRATION TEST
// Flussi completi
- Selezione -> Calcolo -> Prelievo
- Verifica integrità dati
- Aggiornamento stati
- Collegamenti tra moduli

// API Endpoints
- Chiamate concatenate
- Gestione errori
- Validazione risposte

Copy

Apply

E2E TEST
// Scenari utente
- Creazione pianificazione completa
- Gestione errori utente
- Flusso completo fino a lavorazione
- Performance con dati reali
GESTIONE ERRORI MODULO PIANIFICAZIONE

ERRORI VALIDAZIONE
// Errori Business Logic
- Quantità non disponibile
- Lotto non valido
- Ricetta non trovata
- Cliente non autorizzato

// Errori Input
- Dati mancanti
- Formati non validi
- Valori fuori range

Copy

Apply

ERRORI RUNTIME
// Gestione Database
- Errori connessione
- Conflitti concorrenza
- Integrità referenziale

// Gestione Sistema
- Timeout operazioni
- Errori memoria
- Lock risorse

Copy

Apply

RESPONSE HANDLING
// Struttura risposta errori
{
    status: number,
    code: string,
    message: string,
    details: object
}

// Log errori
- Tracciamento completo
- Notifiche critiche
- Metriche errori


PIANO DI SVILUPPO MODULO PIANIFICAZIONE
PIANO DI SVILUPPO MODULO PIANIFICAZIONE

FASE 1: SETUP BASE
Creazione struttura cartelle
Implementazione modello base
Setup routes principali
Creazione controller base
FASE 2: LOGICA CORE
Implementazione PianificazioneService
Sistema calcolo quantità
Gestione prelievi
Validazioni business logic
FASE 3: FRONTEND
Componente principale
Modal selezione
Form pianificazione
Interfaccia calcoli
FASE 4: INTEGRAZIONE
Collegamenti MateriePrime
Collegamenti Ricette
Sistema prelievi
Generazione lavorazioni

SETUP BASE - PIANO DETTAGLIATO

STRUTTURA CARTELLE
/backend
  /pianificazione
    /models
      - pianificazioneLavorazioneModel.js
    /controllers
      - pianificazioneLavorazioneController.js
    /routes
      - pianificazioneLavorazioneRoutes.js
    /services
      - pianificazioneLavorazioneService.js
/frontend
  /src
    /components
      /pianificazione
        - PianificazionePage.js
        - SelezioneMaterieModal.js
        - PianificazioneForm.js

Copy

Execute

IMPLEMENTAZIONE MODELLO
Schema base
Relazioni
Validazioni
Indici necessari
SETUP ROUTES
Endpoints base
Middleware necessari
Validazioni route
Collegamenti controller
CONTROLLER BASE
Operazioni CRUD
Gestione risposte
Collegamenti servizi
Gestione errori
LOGICA CORE - PIANO DETTAGLIATO

PIANIFICAZIONE SERVICE
class PianificazioneLavorazioneService {
    // Metodi principali
    getDisponibilitaMateriePrime(clienteId)
    calcolaQuantitaRicetta(ricettaId, porzioni)
    verificaDisponibilita(materiePrime, quantita)
    generaPrelievi(pianificazione)
    
    // Metodi di supporto
    convertUnit(value, fromUnit, toUnit) 
    validateQuantities(required, available)
    checkLotAvailability(lots)
}

Copy

Apply

SISTEMA CALCOLI
Algoritmi conversione unità
Calcolo quantità per ricetta
Gestione arrotondamenti
Validazioni matematiche
GESTIONE PRELIEVI
Lock quantità
Aggiornamento giacenze
Tracciamento lotti
Rollback in caso di errori
VALIDAZIONI
Regole business
Controlli integrità
Validazioni quantità
Gestione conflitti
FRONTEND - PIANO DETTAGLIATO

COMPONENTE PRINCIPALE (PianificazionePage)
// Stati principali
const [cliente, setCliente] = useState(null)
const [materiePrime, setMateriePrime] = useState([])
const [ricetta, setRicetta] = useState(null)
const [calcoli, setCalcoli] = useState({})

// Funzionalità core
handleClienteSelect()
handleMateriePrimeSelect()
handleRicettaSelect()
handleCalculations()

Copy

Apply

MODAL SELEZIONE (SelezioneMaterieModal)
Filtri per cliente
Lista materie disponibili
Dettagli lotti
Selezione quantità
FORM PIANIFICAZIONE (PianificazioneForm)
Selezione ricetta
Input porzioni
Calcoli automatici
Validazioni real-time
INTERFACCIA CALCOLI
Visualizzazione quantità
Stato disponibilità
Alert validazione
Riepilogo finale
INTEGRAZIONE - PIANO DETTAGLIATO

COLLEGAMENTI MATERIE PRIME
// Integrazione con MateriePrimeModel
- Gestione prelievi automatici
- Aggiornamento giacenze
- Tracciamento lotti
- Lock risorse

// API Integration
materiePrimeService.checkAvailability()
materiePrimeService.createPrelievo()
materiePrimeService.updateQuantity()

Copy

Apply

COLLEGAMENTI RICETTE
// Integrazione con RecipeModel
- Calcolo ingredienti
- Conversioni unità
- Validazioni quantità
- Gestione porzioni

// API Integration
recipeService.getRecipeDetails()
recipeService.calculateQuantities()

Copy

Apply

SISTEMA PRELIEVI
Creazione prelievi automatici
Aggiornamento stati
Gestione errori
Rollback automatico
GENERAZIONE LAVORAZIONI
Creazione schede
Collegamenti materie prime
Stati iniziali
Notifiche sistema
PRIORITÀ SVILUPPO

PRIORITÀ ALTA
Setup modello pianificazione
Calcolo quantità da ricette
Verifica disponibilità materie prime
Sistema prelievi automatico
PRIORITÀ MEDIA
Interfaccia selezione materie prime
Form pianificazione
Validazioni real-time
Gestione lotti
PRIORITÀ NORMALE
Ottimizzazione calcoli
Miglioramenti UI
Feedback utente
Reportistica
PRIORITÀ BASSA
Features aggiuntive
Ottimizzazioni performance
Miglioramenti UX
Documentazione estesa