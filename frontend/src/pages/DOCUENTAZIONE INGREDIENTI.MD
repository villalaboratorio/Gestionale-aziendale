Documentazione Modulo Ingredienti
Struttura dei File
frontend/
  ├── src/
  │   ├── pages/
  │   │   └── IngredientsPage.js    # Pagina principale ingredienti
  │   ├── modal/
  │   │   └── IngredientModal.js    # Modale creazione/modifica ingredienti
  │   └── components/
  │       └── common/               # Componenti comuni riutilizzabili

backend/
  ├── controllers/
  │   └── ingredientController.js   # Logica di business
  ├── models/
  │   └── ingredientModel.js        # Schema del database
  ├── routes/
  │   └── ingredientRoutes.js       # Definizione delle rotte API
  └── services/
      └── nutritionService.js       # Servizio per OpenFoodFacts API

Copy

Apply

API Endpoints
GET /api/ingredienti
Recupera lista ingredienti paginata
Parametri query:
page (default: 1)
limit (default: 20)
search (opzionale)
POST /api/ingredienti
Crea nuovo ingrediente
Genera automaticamente codice progressivo
Supporta ricerca valori nutrizionali via barcode
PUT /api/ingredienti/:id
Aggiorna ingrediente esistente
Richiede ID valido
DELETE /api/ingredienti/:id
Elimina ingrediente
Richiede ID valido
Schema Database
IngredientSchema {
    code: String,          // Codice progressivo automatico
    barcode: String,       // Codice a barre opzionale
    name: String,          // Nome ingrediente
    cost: Number,          // Costo unitario
    unit: ObjectId,        // Riferimento a Units
    nutrition: {
        kcal: Number,
        fats: Number,
        saturatedFats: Number,
        carbohydrates: Number,
        sugars: Number,
        proteins: Number,
        salt: Number
    },
    isActive: Boolean      // Stato attivo/disattivo
}

Copy

Apply

Funzionalità Frontend
IngredientsPage
Visualizzazione tabellare ingredienti
Ricerca per nome/codice
Paginazione
Azioni: nuovo, modifica, elimina
IngredientModal
Form creazione/modifica
Ricerca automatica valori nutrizionali
Validazione campi
Gestione unità di misura
Loading states per feedback utente
Integrazioni Esterne
OpenFoodFacts API
Base URL: https://world.openfoodfacts.org/api/v0
Endpoints utilizzati:
/product/{barcode}.json
/search.json
Sistema di Codifica
Codici generati automaticamente
Formato: 4 cifre (0001-9999)
Incremento progressivo
Univoci nel sistema
Gestione Errori
Validazione input frontend
Validazione schema MongoDB
Gestione errori API
Feedback utente per operazioni asincrone
Performance Optimizations
Caching valori nutrizionali
Lazy loading risultati ricerca
Debounce ricerca
Indici MongoDB ottimizzati
Manutenzione
Punti di Attenzione
Generazione codici progressivi
Integrazione OpenFoodFacts
Gestione unità di misura
Validazione valori nutrizionali
Procedure Comuni
Aggiunta nuovo campo:

Aggiornare schema MongoDB
Modificare frontend form
Aggiornare validazioni
Modifica logica codifica:

Controllare createIngredient nel controller
Verificare unicità codici
Aggiornamento API esterna:

Modificare nutritionService.js
Aggiornare mapping dati
Testing
API Tests
Validazione CRUD operations
Verifica generazione codici
Test integrazione OpenFoodFacts
Frontend Tests
Rendering componenti
User interactions
Form validations
API integration
Dipendenze Principali
Frontend
React
Axios
Styled-components
React-bootstrap
Backend
Express
Mongoose
Axios (per OpenFoodFacts)
Sicurezza
Validazione input
Sanitizzazione dati
Controlli autorizzazione
Rate limiting OpenFoodFacts
Monitoring
Log operazioni CRUD
Errori API esterna
Performance query
Utilizzo cache