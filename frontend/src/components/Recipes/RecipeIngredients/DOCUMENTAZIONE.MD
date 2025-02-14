# Documentazione Completa Modulo Ricette v3.0.0

## 1. Architettura e Struttura Dati

### 1.1 Schema Database
```javascript
// Schema Ricetta
{
    _id: ObjectId,
    numeroRicetta: String,
    nome: String,
    categoria: { type: ObjectId, ref: 'CategoryRecipes' },
    descrizione: String,
    porzioni: Number,
    grammiPerPorzione: Number,
    ingredienti: [{
        ingrediente: { type: ObjectId, ref: 'Ingredient' },
        quantita: Number,
        unitaMisura: { type: ObjectId, ref: 'Units' },
        caloPeso: Number
    }]
}

// Schema Ingrediente
{
    _id: ObjectId,
    code: String,
    name: String,
    cost: Number,
    unit: { type: ObjectId, ref: 'Units' },
    nutrition: {
        kcal: Number,
        proteins: Number,
        carbohydrates: Number,
        fats: Number
    }
}

Copy

Apply

frontend\src\pages\DOCUMENTAZIONE
1.2 Struttura Componenti
RecipeDetail
├── TabNav
│   ├── DetailsTab
│   ├── NutritionTab
│   └── CostsTab
└── ContentArea
    ├── RecipeGeneralInfo
    ├── RecipeCostAnalysis
    └── RecipeNutritionalInfo

Copy

Apply

2. Sistema di Calcolo Costi
2.1 Calcolo Costi Ingredienti
const CostCalculator = {
    calculateIngredientCost: (quantity, unitCost) => {
        if (!quantity || !unitCost) return 0;
        return quantity * unitCost;
    },

    calculateTotalCost: (ingredients, includeLoss = false) => {
        return ingredients.reduce((total, ing) => {
            const baseCost = quantity * unitCost;
            if (!includeLoss) return total + baseCost;
            const lossPercentage = ing.caloPeso / 100;
            return total + (baseCost * (1 - lossPercentage));
        }, 0);
    }
};

Copy

Apply

2.2 Gestione Calo Peso
Calcolo automatico della perdita di peso per ingrediente
Impatto sul costo finale
Aggiustamento quantità effettive
2.3 Analisi Margini
Calcolo prezzo di vendita suggerito
Margine configurabile per ricetta
Visualizzazione breakeven point
3. Sistema Valori Nutrizionali
3.1 Calcolo Valori per Ingrediente
const calculateIngredientNutrition = (quantity, nutritionValues, unit) => {
    return {
        kcal: (quantity * nutritionValues.kcal) / 100,
        proteins: (quantity * nutritionValues.proteins) / 100,
        carbohydrates: (quantity * nutritionValues.carbohydrates) / 100,
        fats: (quantity * nutritionValues.fats) / 100
    };
};

Copy

Apply

3.2 Totali per Ricetta
Somma valori nutrizionali di ogni ingrediente
Gestione conversioni unità di misura
Calcolo per porzione e per 100g
4. Gestione Frontend
4.1 RecipeCostAnalysis
const RecipeCostAnalysis = ({ recipe }) => {
    const [marginPercentage, setMarginPercentage] = useState(30);
    const [costsData, setCostsData] = useState(null);

    // Caricamento dati
    useEffect(() => {
        loadCostsData();
    }, [recipe]);

    // Visualizzazione
    return (
        <div className="recipe-cost-analysis">
            <CostSummary data={costsData} margin={marginPercentage} />
            <IngredientsTable ingredients={costsData?.ingredients} />
        </div>
    );
};

Copy

Apply

4.2 RecipeNutritionalInfo
Visualizzazione tabella valori nutrizionali
Toggle tra valori per porzione e per 100g
Grafici di composizione nutrienti
5. API Endpoints
5.1 Costi
GET /api/ricette/:id/costs
Response: {
    ingredients: [{
        nome: String,
        quantita: Number,
        unitaMisura: String,
        costoUnitario: String,
        costoTotale: String
    }],
    total: {
        costoTotale: String,
        costoPerPorzione: String
    }
}

Copy

Apply

5.2 Valori Nutrizionali
GET /api/ricette/:id/nutrition
Response: {
    perServing: {
        kcal: Number,
        proteins: Number,
        carbohydrates: Number,
        fats: Number
    },
    per100g: {
        // stessi campi
    }
}

Copy

Apply

6. Utilities e Helpers
6.1 Formattazione
const Formatter = {
    formatCurrency: (value) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    },
    formatWeight: (value, unit) => {
        return `${value.toFixed(2)} ${unit}`;
    }
};

Copy

Apply

6.2 Conversioni Unità
const UnitConverter = {
    getConversionFactor: (fromUnit, toUnit) => {
        if (!fromUnit || !toUnit || fromUnit === toUnit) return 1;
        return UNIT_CONVERSIONS[fromUnit]?.[toUnit] || 1;
    }
};

Copy

Apply

7. Testing e Validazione
7.1 Validazioni Input
Controllo quantità negative
Validazione unità di misura compatibili
Verifica completezza dati nutrizionali
7.2 Test Cases
describe('CostCalculator', () => {
    it('calcola correttamente il costo totale con calo peso', () => {
        // Implementation
    });
    it('gestisce correttamente ingredienti mancanti', () => {
        // Implementation
    });
});

Copy

Apply

8. Performance e Ottimizzazioni
8.1 Caching
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti
const costsCache = new Map();

const getCachedData = (key) => {
    const cached = costsCache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
};

Copy

Apply

8.2 Lazy Loading
Caricamento componenti su richiesta
Gestione stati di loading
Feedback utente durante i calcoli
## 2. Moduli Implementati
DettaglioScheda
InformazioniGeneraliHACCP

Form principale ✓
Gestione cliente ✓
Gestione ricette ✓
Date e priorità ✓

### Nuovi Moduli Implementati

#### ParametriLavorazioneHACCP
- Gestione Parametri di Processo
  - Temperature di riferimento
  - Tempi di lavorazione
  - pH e umidità
  - Validazione real-time
  - Logging modifiche
  - Alert superamento limiti

- Interfaccia Utente
  - Form dinamico parametri
  - Visualizzazione real-time
  - Grafici andamento
  - Dashboard controllo

- Validazioni
  - Range temperature ammesse
  - Tempi minimi/massimi
  - Valori pH consentiti
  - Umidità relativa

#### CotturaHACCP
- Metodi di Cottura
  - Bollitura (100°C min)
  - Frittura (160°C min)
  - Vapore (100°C min)
  - Forno (180°C min)
  - Sottovuoto (65°C min)
  - Griglia (200°C min)

- Monitoraggio Temperature
  - Target temperature
  - Temperature effettive
  - Delta ammesso
  - Allarmi superamento

- Gestione Tempi
  - Inizio/Fine cottura
  - Durata effettiva
  - Timer automatico
  - Alert completamento

- Operatori
  - Assegnazione responsabilità
  - Validazione competenze
  - Tracking attività
  - Note operative

[MANTENERE TUTTO IL CONTENUTO ESISTENTE DELLE SEZIONI 3-12]

## 13. Nuove Integrazioni Sistema

### 13.1 Gestione Parametri Processo
- Sistema monitoraggio real-time
- Database storico parametri
- Reportistica automatica
- Export dati in formato standard
- Integrazione con sistemi esterni

### 13.2 Sistema Cottura Avanzato
- Workflow automatizzato
- Validazione multi-step
- Tracciabilità completa
- Gestione allarmi
- Report conformità HACCP

### 13.3 Interfacce Dedicate
- Dashboard parametri
- Console cottura
- Pannello controllo temperature
- Gestione operatori
- Logging attività

### 13.4 API Extensions
```javascript
// Nuovi endpoint Parametri
GET    /api/parametri/types
POST   /api/parametri/validate
PUT    /api/parametri/limits

// Nuovi endpoint Cottura
GET    /api/cottura/methods
POST   /api/cottura/validate
PUT    /api/cottura/temperature

Copy

Apply

frontend\src\components\DettagliScheda\DOCUMENTAZIONE.MD
13.5 Modelli Dati Estesi
// Parametri Schema
{
    tipo: String,
    valore: Number,
    unitaMisura: String,
    limiteInferiore: Number,
    limiteSuperiore: Number,
    alertEnabled: Boolean,
    logInterval: Number
}

// Cottura Schema
{
    metodoCottura: {
        tipo: String,
        temperaturaMinima: Number,
        tempoMinimo: Number
    },
    temperature: [{
        valore: Number,
        timestamp: Date,
        operatore: String
    }],
    tempi: {
        inizio: Date,
        fine: Date,
        durataPrevista: Number
    },
    operatore: {
        id: String,
        nome: String,
        qualifica: String
    }
}

       SEZIONE COTTURE HACCP

       Separazione delle Responsabilità:
/components/DettagliScheda/Cottura/
├── index.js                    // Container principale
├── components/
│   ├── CotturaForm.js         // Form principale
│   ├── ParametriCottura.js    // Gestione parametri
│   ├── TemperatureMonitor.js  // Monitoraggio temperature
│   ├── TimerCottura.js        // Gestione tempi
│   └── OperatorePanel.js      // Pannello operatore
├── hooks/
│   ├── useCotturaData.js      // Gestione dati cottura
│   ├── useRicettaParams.js    // Parametri da ricetta
│   └── useValidation.js       // Validazioni
├── context/
│   └── CotturaContext.js      // Stato globale cottura
└── utils/
    ├── validators.js          // Funzioni validazione
    ├── transformers.js        // Trasformazione dati
    └── constants.js           // Costanti e configurazioni

Copy

Apply

Flusso Dati:
RicettaData -> CotturaContext -> Components -> API
     ↑                 ↓
     └─── Validations ←┘

Copy

Apply

Documentazione Dedicata:
/components/DettagliScheda/Cottura/DOCUMENTAZIONE.md
- Architettura
- Flusso dati
- Integrazione ricette
- Parametri e validazioni
- API endpoints
- Use cases
               
             