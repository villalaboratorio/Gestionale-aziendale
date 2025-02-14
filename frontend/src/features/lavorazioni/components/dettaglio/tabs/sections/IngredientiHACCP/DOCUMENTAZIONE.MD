# Gestionale Lavorazioni HACCP - Documentazione Tecnica

## 1. Panoramica del Sistema
Il modulo HACCP è parte integrante del sistema di gestione delle lavorazioni alimentari. Gestisce il controllo e la verifica degli ingredienti secondo le normative HACCP.

## 2. Architettura Dettagliata

### Struttura Frontend
```javascript
frontend/src/components/DettagliScheda/
├── components/
│   └── sections/
│       └── IngredientiHACCP.js       # Wrapper per integrazione
└── IngredientiHACCP/                 # Core module
    ├── components/                   
    │   ├── IngredientiTable.js       # Gestione tabella ingredienti
    │   ├── StatusMessage.js          # Sistema messaggistica
    │   └── VerificaCell.js           # Gestione singola verifica
    ├── hooks/
    │   ├── useRicetta.js            # Logica business ricette
    │   └── useVerificheIngredienti.js # Gestione stato verifiche
    └── index.js                      # Entry point

Copy

Apply

frontend\src\components\DettagliScheda\IngredientiHACCP\DOCUMENTAZIONE.MD
Struttura Backend
backend/
├── routes/
│   └── ricettaRoutes.js             # Definizione endpoints
├── models/
│   └── ricettaModel.js              # Schema dati ricette
└── controllers/
    └── recipe/
        ├── baseController.js         # Logica base
        └── ingredientsController.js  # Gestione ingredienti

Copy

Apply

3. Flusso Dati Dettagliato
Inizializzazione
Componente IngredientiHACCP viene montato
useRicetta hook inizializza lo stato
Richiesta GET a /api/ricette/:id/haccp
Popolazione dati ingredienti e unità misura
Rendering tabella con dati
Verifica Ingrediente
Utente modifica campo verifica
Aggiornamento stato locale
Validazione input
Persistenza modifiche
Feedback visivo stato
4. API Endpoints Dettagliati
HACCP Endpoint
GET /api/ricette/:id/haccp

Parametri:
- id: ObjectId della ricetta

Response:
{
    _id: ObjectId,
    nome: String,
    numeroRicetta: String,
    ingredienti: [{
        ingrediente: {
            _id: ObjectId,
            name: String,
            code: String
        },
        quantita: Number,
        unitaMisura: {
            _id: ObjectId,
            name: String,
            abbreviation: String
        }
    }]
}

Copy

Apply

5. Componenti Core
IngredientiTable
Props:
- ingredienti: Array<Ingrediente>
- verifiche: Object<VerificaStato>
- onUpdateVerifica: (id, campo, valore) => void

Funzionalità:
- Rendering dinamico ingredienti
- Gestione input TMC e lotto
- Validazione campi
- Feedback stato verifica

Copy

Apply

StatusMessage
Props:
- loading: Boolean
- error: String
- info: String
- children: ReactNode

Stati:
- Caricamento
- Errore
- Informazione
- Successo

Copy

Apply

6. Sistema di Logging
Frontend Logging
Livelli:
- Debug: Informazioni sviluppo
- Info: Eventi normali
- Warning: Situazioni anomale
- Error: Errori applicativi

Format:
[Timestamp] [Livello] [Componente] Messaggio

Copy

Apply

Backend Logging
Categorie:
- Request: Dettagli richieste
- Database: Operazioni DB
- Validation: Validazione dati
- Error: Gestione errori

Format:
[Timestamp] [Categoria] [EndPoint] Dettagli

Copy

Apply

7. Gestione Errori
Frontend
Validazione input
Gestione timeout
Retry automatico
Feedback utente
Logging errori
Backend
Validazione schema
Gestione eccezioni DB
Errori HTTP appropriati
Logging strutturato
Rollback transazioni
8. Sicurezza
Sanitizzazione input
Validazione ObjectId
Escape output
Rate limiting
Logging accessi
9. Performance
Caching risposte
Query ottimizzate
Lazy loading
Debounce input
Memoization
10. Testing
Unit Test:
- Componenti React
- Custom hooks
- Utility functions
- Validatori

Integration Test:
- Flusso HACCP completo
- API endpoints
- Database operations

Copy

Apply

11. Manutenzione
Monitoraggio errori
Backup dati
Aggiornamenti dipendenze
Review log periodica
Ottimizzazione performance
12. Dipendenze
{
  "frontend": {
    "react": "^18.x",
    "axios": "^1.x",
    "styled-components": "^5.x",
    "react-bootstrap": "^2.x",
    "react-icons": "^4.x"
  },
  "backend": {
    "express": "^4.x",
    "mongoose": "^7.x",
    "cors": "^2.x"
  }
}

Copy

Apply

13. Configurazione Ambiente
Development:
- Node.js 16+
- MongoDB 5+
- npm/yarn
- Git

Production:
- PM2/Docker
- MongoDB Atlas/Self-hosted
- NGINX/Apache
- SSL/TLS

Copy

Apply


Questa documentazione fornisce:
1. Dettagli tecnici precisi
2. Esempi di codice
3. Strutture dati
4. Configurazioni
5. Procedure operative