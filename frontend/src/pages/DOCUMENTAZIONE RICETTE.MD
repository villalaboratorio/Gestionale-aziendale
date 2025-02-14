Sì! Ecco la documentazione completa e aggiornata:

# Documentazione Completa Modulo Ricette v2.2.0

## Indice
1. Struttura Gerarchica
2. Componenti Core
3. Flusso Dati
4. Sezioni Funzionali
5. Servizi e Utilities
6. Testing e Debugging

## 1. Struttura Gerarchica


Copy

Apply

frontend/ ├── src/ │ ├── pages/ │ │ ├── RecipesPage.js # Lista ricette │ │ └── RecipeDetail.js # Dettaglio singola ricetta │ ├── components/ │ │ ├── Recipes/ │ │ │ ├── RecipeGeneralInfo/ # Info generali ricetta │ │ │ ├── RecipeIngredients/ # Gestione ingredienti │ │ │ ├── RecipeNutritionalInfo/ # Valori nutrizionali │ │ │ └── RecipeCostAnalysis/ # Analisi costi │ │ └── common/ # Componenti condivisi │ ├── services/ │ │ ├── recipeService.js │ │ ├── nutritionService.js │ │ └── costService.js │ └── utils/


## 2. Componenti Core

### RecipeDetail.js
- Gestione tab navigation
- Coordinamento sotto-componenti
- Gestione stato globale ricetta
```javascript
const [activeTab, setActiveTab] = useState('details');
const [recipeId, setRecipeId] = useState(id);
const [isEditing, setIsEditing] = useState(id === 'new');

Copy

Apply

RecipeGeneralInfo
Form dati base ricetta
Gestione ingredienti
Fasi di preparazione
Fasi di cottura
RecipeNutritionalInfo
Header con info base
Peso totale e porzioni
Bridge verso NutritionalCalculator
NutritionalCalculator
Calcolo valori nutrizionali
Visualizzazione tabelle per porzione e 100g
Integrazione con nutritionService
RecipeCostAnalysis
Calcolo costi ingredienti
Analisi margini
Suggerimento prezzi
3. Flusso Dati
Gestione Ricetta
RecipeDetail
└── RecipeGeneralInfo
    ├── BasicFields
    ├── IngredientFields
    ├── PreparationSteps
    └── CookingSteps

Copy

Apply

Valori Nutrizionali
RecipeDetail
└── RecipeNutritionalInfo
    └── NutritionalCalculator
        └── nutritionService

Copy

Apply

Analisi Costi
RecipeDetail
└── RecipeCostAnalysis
    └── costService

Copy

Apply

4. Sezioni Funzionali
Gestione Ricetta
CRUD operazioni base
Gestione ingredienti con quantità
Fasi di preparazione ordinate
Fasi di cottura con parametri
Valori Nutrizionali
Calcolo automatico per ingrediente
Totali per ricetta
Valori per porzione
Valori per 100g
Analisi Costi
Costo ingredienti
Costo per porzione
Margine configurabile
Prezzo suggerito
5. Servizi e Utilities
nutritionService
class NutritionService {
    getNutritionById(ingredientId)
    calculateRecipeNutrition(ingredients, servings)
    clearCache()
}

Copy

Apply

recipeService
const recipeService = {
    getRecipe(id)
    createRecipe(data)
    updateRecipe(id, data)
    deleteRecipe(id)
}

Copy

Apply

Utilities
Conversioni unità
Calcoli nutrizionali
Validazioni
Formattazione
6. Testing e Debugging
Logging Points
API calls
Calcoli nutrizionali
Operazioni CRUD
Errori e fallimenti
Validation Points
Input ingredienti
Calcoli nutrizionali
Analisi costi
Salvataggio dati
7. Note Implementative
Gestione Stati
useState per stati locali
useCallback per funzioni
useEffect per side effects
Refs per comunicazioni child-parent
Performance
Memoizzazione calcoli
Caching dati nutrizionali
Lazy loading componenti
Ottimizzazione re-render
Sicurezza
Validazione input
Sanitizzazione dati
Gestione errori
Controlli permessi
UX/UI
Feedback immediato
Loading states
Error handling
Conferme operazioni


# Documentazione Tecnica Completa Modulo Ricette v2.2.0

## 1. Architettura e Flussi Dati

### 1.1 Struttura Database
```javascript
// Schema Ricetta
{
    _id: ObjectId,
    numeroRicetta: String,
    nome: String,
    categoria: { type: ObjectId, ref: 'CategoryGoods' },
    descrizione: String,
    porzioni: Number,
    grammiPerPorzione: Number,
    ingredienti: [{
        ingrediente: { type: ObjectId, ref: 'Ingredient' },
        quantita: Number,
        unitaMisura: { type: ObjectId, ref: 'Units' },
        caloPeso: Number
    }],
    nutrition: {
        kcal: Number,
        proteins: Number,
        carbohydrates: Number,
        // ... altri valori nutrizionali
    }
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
        // ... altri valori nutrizionali
    }
}

Copy

Apply

1.2 Flussi API
// Ricette
GET /api/ricette
Response: [{ ricetta }]

GET /api/ricette/:id
Response: { ricetta }

POST /api/ricette
Body: { nome, categoria, porzioni, ... }
Response: { ricetta }

// Ingredienti
GET /api/ingredienti
Response: [{ ingrediente }]

GET /api/ingredienti/:id/nutrition
Response: { nutrition }

Copy

Apply

1.3 Diagramma Componenti React
RecipesPage
└── RecipeList
    └── RecipeCard

RecipeDetail
├── TabNav
│   ├── DetailsTab
│   ├── NutritionTab
│   └── CostsTab
└── ContentArea
    ├── RecipeGeneralInfo
    │   ├── BasicFields
    │   ├── IngredientFields
    │   └── CookingSteps
    ├── NutritionalCalculator
    │   ├── PerServingValues
    │   └── Per100gValues
    └── CostAnalysis
        ├── CostSummary
        └── CostDetails

Copy

Apply

2. Componenti Dettagliati
2.1 RecipeDetail.js
// Props
interface RecipeDetailProps {
    id: string;
}

// Stati
const [activeTab, setActiveTab] = useState('details');
const [recipe, setRecipe] = useState(null);
const [isEditing, setIsEditing] = useState(false);

// Refs
const ingredientsRef = useRef(null);
const fasiRef = useRef(null);
const cookingRef = useRef(null);

Copy

Apply

2.2 NutritionalCalculator.js
// Props
interface NutritionalCalculatorProps {
    recipe: Recipe;
}

// Stati
const [nutritionalValues, setNutritionalValues] = useState({
    perServing: { ... },
    per100g: { ... }
});

// Calcoli
const calculateNutritionalValues = useCallback(() => {
    // Logica di calcolo dettagliata
});

Copy

Apply

3. Servizi e Logica di Business
3.1 nutritionService.js
class NutritionService {
    // Cache
    private cache = new Map();

    // Metodi principali
    async getNutritionById(id: string): Promise<NutritionData> {
        // Implementazione
    }

    calculateRecipeNutrition(ingredients: Ingredient[], servings: number): NutritionValues {
        // Implementazione
    }
}

Copy

Apply

3.2 Calcoli e Conversioni
// Conversioni unità
const unitConversions = {
    g_to_kg: (value) => value / 1000,
    kg_to_g: (value) => value * 1000,
    // ... altre conversioni
};

// Calcoli nutrizionali
const calculatePer100g = (totalValue, totalWeight) => (totalValue / totalWeight) * 100;

Copy

Apply

4. Gestione Stati e Side Effects
4.1 Ciclo di Vita Componenti
// Caricamento iniziale
useEffect(() => {
    loadRecipeData();
}, [recipeId]);

// Aggiornamento calcoli
useEffect(() => {
    calculateTotalWeight();
    calculateNutritionalValues();
}, [recipe, calculateTotalWeight, calculateNutritionalValues]);

Copy

Apply

4.2 Gestione Errori
try {
    const response = await nutritionService.getNutritionById(id);
    // Gestione successo
} catch (error) {
    // Gestione specifica errori
    if (error.response?.status === 404) {
        setError('Dati nutrizionali non trovati');
    } else {
        setError('Errore nel recupero dati');
    }
}

Copy

Apply

5. Testing e Quality Assurance
5.1 Test Cases
describe('NutritionalCalculator', () => {
    it('calcola correttamente i valori per porzione', () => {
        // Test implementation
    });

    it('gestisce correttamente ingredienti mancanti', () => {
        // Test implementation
    });
});

Copy

Apply

5.2 Logging Points
console.group('🌐 Nutrition Service Call');
console.log('Request:', { ingredientId });
console.log('Response:', nutritionData);
console.groupEnd();

Copy

Apply

6. Deployment e Configurazione
6.1 Variabili Ambiente
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const CACHE_DURATION = process.env.REACT_APP_CACHE_DURATION;

Copy

Apply

6.2 Build e Deploy
# Build
npm run build

# Deploy
docker build -t recipe-module .
docker push recipe-module:latest

Copy

Execute

7. Procedure Operative
7.1 Aggiunta Nuova Ricetta
Navigare a /ricette/new
Compilare dati base
Aggiungere ingredienti
Configurare fasi
Salvare e verificare calcoli
7.2 Modifica Valori Nutrizionali
Accedere al tab nutrizione
Verificare calcoli automatici
Controllare valori per porzione
Validare totali
7.3 Recovery Procedures
Gestione cache invalidation
Ripristino dati corrotti
Fallback valori default
Procedure backup