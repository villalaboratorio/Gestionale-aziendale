OCUMENTO MAPPATURA COMPLETA MODULI

MODULO: CLIENTI
Backend:
Controllers:
- clienteController.js
  ↳ CRUD operations
  ↳ Gestione contatti
  
Models:
- clienteModel.js
  ↳ Schema cliente
  ↳ Validazioni

Routes:
- clienteRoutes.js
  ↳ /api/clienti
  ↳ /api/clienti/:id

Frontend:
Components:
- ClientiPage.js
- SchedaCliente.js
- ClienteModal.js

Hooks:
- useCliente.js
- useClientiList.js

API:
- getClienti()
- getClienteById()
- createCliente()
- updateCliente()
- deleteCliente()

Store:
- clientiStore.js

Copy

Apply

MODULO: RICETTE
Backend:
Controllers:
- ricettaController.js
- categoryRecipesController.js

Models:
- ricettaModel.js
- categoryRecipesModel.js

Routes:
- ricettaRoutes.js
  ↳ /api/ricette
  ↳ /api/category-recipes

Frontend:
Components:
- RecipesPage.js
- RecipeDetail.js
- RecipeForm.js
- RecipeIngredients/
  ↳ IngredientList
  ↳ IngredientForm
- RecipeGeneralInfo/
- CookingSteps/
- PreparationSteps/

Hooks:
- useRecipe.js
- useRecipeIngredients.js
- useRecipeSteps.js
- useCookingSteps.js

API:
- RecipeApi.js
- ingredientsApi.js

Store:
- recipeStore.js

Copy

Apply

MODULO: LAVORAZIONI
Backend:
Controllers:
- lavorazioneController.js
- dettaglioLavorazioneController.js

Models:
- lavorazioneModel.js
- dettaglioLavorazioneModel.js

Routes:
- lavorazioneRoutes.js
- dettaglioLavorazioneRoutes.js

Frontend:
Components:
/features/lavorazioni/
  ↳ LavorazioniDashboard
  ↳ DettaglioLavorazione
  ↳ tabs/
    - InformazioniGenerali
    - IngredientiHACCP
    - PassaggiLavorazione
    - Assemblaggio
    - Cottura
    - Abbattimento

Hooks:
- useLavorazione.js
- useLavorazioneState.ts
- useInformazioniGenerali.js
- useAssemblaggio.js
- useCottura.js
- useParametriHACCP.js

API:
- LavorazioneApi.js

Store:
- lavorazioneStore.js

Copy

Apply

MODULO: MATERIE PRIME
Backend:
Controllers:
- materiePrimeController.js

Models:
- materiaPrimaModel.js

Routes:
- materiePrimeRoutes.js

Frontend:
Components:
- MateriePrime.js
- MateriaPrimaModal.js
- PrelievoMateriePrimeModal.js

Hooks:
- useMateriePrime.js
- usePrelievo.js

API:
- materiePrimeApi.js

Store:
- materiePrimeStore.js

Copy

Apply

MODULO: UTILITIES (PANNELLO OPZIONI)
Backend:
Controllers:
- unitsController.js
- quantityTypesController.js
- processingStatesController.js
- processingTypesController.js
- categoryGoodsController.js
- fasiTypeController.js
- fasiMethodController.js
- tipoCotturaController.js

Models:
- unitsModel.js
- quantityTypesModel.js
- processingStatesModel.js
- processingTypesModel.js
- categoryGoodsModel.js
- fasiTypeModel.js
- fasiMethodModel.js
- tipoCotturaModel.js

Routes:
- unitsRoutes.js
- quantityTypesRoutes.js
- processingStatesRoutes.js
- processingTypesRoutes.js
- categoryGoodsRoutes.js
- fasiTypeRoutes.js
- fasiMethodRoutes.js
- tipoCotturaRoutes.js

Frontend:
Components:
- PannelloOpzioni.js
- UnitsPage.js
- QuantityTypesPage.js
- ProcessingStatesPage.js
- ProcessingTypesPage.js
- CategoryGoodsPage.js
- FasiTypePage.js
- FasiMethodPage.js
- TipoCotturaPage.js

Modals:
- UnitModal.js
- CategoryModal.js
- FasiTypeModal.js
- FasiMethodModal.js
- TipoCotturaModal.js

Hooks:
- useUnits.js
- useCategories.js
- useFasiTypes.js
- useFasiMethods.js
- useTipoCottura.js

API:
- utilsApi.js

Copy

Apply

MODULO: PIANIFICAZIONE
Backend:
Controllers:
- pianificazioneController.js

Models:
- pianificazioneModel.js

Routes:
- pianificazioneRoutes.js

Frontend:
Components:
/PianificazioneLavorazione/
  ↳ BrogliaccioLavorazioni.js
  ↳ ConfermaLavorazione.js
  ↳ LavorazioniParcheggiate.js
  ↳ MateriePrimeList.js
  ↳ SuggerimentiLavorazione.js

Utils:
- calculations.js
- ingredientMatching.js
- storage.js
- trackingSystem.js
- validations.js

Hooks:
- usePianificazione.js
- useSuggerimenti.js
- useMateriePrime.js

Context:
- PianificazioneContext.js

API:
- pianificazioneApi.js

Copy

Apply

Ogni modulo include anche:

Test files
Style files
Type definitions
Documentation
Configuration
Le dipendenze tra moduli sono gestite attraverso:

Database relations
API calls
Store references
Context providers
