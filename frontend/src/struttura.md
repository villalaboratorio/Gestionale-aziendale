C:.
|   App.js
|   custom.css
|   DEVELOPMENT.md
|   error.md
|   index.css
|   index.js
|   ModernApp.tsx
|   reportWebVitals.js
|
+---components
|   |   AssegnazioneCard.js
|   |   LavorazioneLibera.css
|   |   LavorazioneLibera.js
|   |   Layout.js
|   |   MateriaPrimaSelector.js
|   |   Navbar.js
|   |   NutritionalCalculator.js
|   |   PianificazioneLavorazioni.js
|   |
|   +---common
|   |   |   errorBoundary.js
|   |   |   index.js
|   |   |   Loadingspinner.js
|   |   |
|   |   +---Alert
|   |   |       Alert.js
|   |   |
|   |   +---Badge
|   |   |       Badge.js
|   |   |
|   |   +---Button
|   |   |       Button.js
|   |   |
|   |   +---Card
|   |   |       Card.js
|   |   |
|   |   +---Input
|   |   |       Input.js
|   |   |
|   |   +---Modal
|   |   |       Modal.js
|   |   |
|   |   +---NumberField
|   |   |       NumberField.js
|   |   |
|   |   +---Select
|   |   |       Select.js
|   |   |
|   |   +---Table
|   |   |       Table.js
|   |   |
|   |   \---TabNav
|   |           SubTabNav.js
|   |           TabNav.js
|   |
|   +---HomePage
|   |       KPICard.js
|   |       LavorazioniCalendar.js
|   |       LavorazioniCard.js
|   |       LavorazioniRecenti.js
|   |       MateriePrimeCard.js
|   |       TeamSection.js
|   |
|   +---PianificazioneLavorazione
|   |   |   BrogliaccioLavorazioni.js
|   |   |   ConfermaLavorazione.css
|   |   |   ConfermaLavorazione.js
|   |   |   LavorazioniParcheggiate.css
|   |   |   LavorazioniParcheggiate.js
|   |   |   MateriePrimeList.css
|   |   |   MateriePrimeList.js
|   |   |   styles.js
|   |   |   SuggerimentiLavorazione.css
|   |   |   SuggerimentiLavorazione.js
|   |   |
|   |   +---components
|   |   |       EditForm.css
|   |   |       EditForm.js
|   |   |       LavorazioneCard.css
|   |   |       LavorazioneCard.js
|   |   |       PreviewRicetta.css
|   |   |       PreviewRicetta.js
|   |   |       SuggerimentoCard.css
|   |   |       SuggerimentoCard.js
|   |   |
|   |   +---context
|   |   |       PianificazioneContext.js
|   |   |
|   |   \---utils
|   |           calculations.js
|   |           ingredientMatching.js
|   |           StatistichePianificazione.css
|   |           StatistichePianificazione.js
|   |           storage.js
|   |           trackingSystem.js
|   |           validations.js
|   |
|   \---Recipes
|       |   QuickFilters.js
|       |   RecipeCard.js
|       |   RecipeCostAnalysis.js
|       |   RecipeForm.js
|       |   RecipeIngredientsAndCosts.js.old
|       |   RecipeNutritionalInfo.js
|       |   RecipeReports.js
|       |   RecipeTable.js
|       |   RecipeTabs.js
|       |   StatsBar.js
|       |
|       +---CookingSteps
|       |   |   index.js
|       |   |
|       |   +---components
|       |   |   +---CookingForm
|       |   |   |       index.js
|       |   |   |       styles.js
|       |   |   |
|       |   |   +---CookingItem
|       |   |   |       index.js
|       |   |   |       styles.js
|       |   |   |
|       |   |   \---CookingList
|       |   |           index.js
|       |   |           styles.js
|       |   |
|       |   +---hooks
|       |   |       index.js
|       |   |       useCookingOption.js
|       |   |       useCookingSteps.js
|       |   |
|       |   +---services
|       |   |       cookingApiService.js
|       |   |
|       |   \---styles
|       |           index.js
|       |
|       +---PreparationSteps
|       |   |   index.js
|       |   |
|       |   +---components
|       |   |   +---StepForm
|       |   |   |       index.js
|       |   |   |       styles.js
|       |   |   |
|       |   |   +---StepItem
|       |   |   |       index.js
|       |   |   |       styles.js
|       |   |   |
|       |   |   \---steplist
|       |   |           index.js
|       |   |           styles.js
|       |   |
|       |   +---hooks
|       |   |       index.js
|       |   |       useFasi.js
|       |   |       useFasiOptions.js
|       |   |       useStepForm.js
|       |   |
|       |   +---services
|       |   |       apiService.js
|       |   |       validationService.js
|       |   |
|       |   \---styles
|       |           index.js
|       |
|       +---RecipeGeneralInfo
|       |   |   RecipeGeneralInfo.js
|       |   |   structure.txt
|       |   |   styles.js
|       |   |
|       |   +---components
|       |   |       AdditionalFields.js
|       |   |       BasicFields.js
|       |   |       CookingFields.js
|       |   |       Header.js
|       |   |
|       |   +---hooks
|       |   |       useRecipedata.js
|       |   |
|       |   +---services
|       |   |       recipeService.js
|       |   |
|       |   \---utils
|       |           conversions.js
|       |
|       \---RecipeIngredients
|           +---components
|           |   +---IngredientFields
|           |   |       index.js
|           |   |       styles.js
|           |   |
|           |   +---IngredientForm
|           |   |       index.js
|           |   |       styles.js
|           |   |
|           |   \---IngredientList
|           |           index.js
|           |           styles.js
|           |
|           +---hooks
|           |   |   useIngredientCalculations.js
|           |   |
|           |   \---state
|           |           ingredientState.js
|           |
|           +---services
|           |       apiService.js
|           |       calculations.js
|           |       validationService.js
|           |
|           \---utils
|                   calculations.js
|                   constants.js
|                   conversions.js
|
+---core
|   |   index.ts
|   |
|   +---api
|   |       api.service.ts
|   |       index.ts
|   |
|   +---config
|   |       config.manager.ts
|   |       index.ts
|   |
|   +---events
|   |       event.bus.ts
|   |       index.ts
|   |
|   +---Path
|   |   +---cache
|   |   |       cache.manager.ts
|   |   |       index.ts
|   |   |
|   |   +---errors
|   |   |       error.handler.ts
|   |   |
|   |   +---http
|   |   |       http.client.ts
|   |   |       index.ts
|   |   |
|   |   \---logging
|   |           index.ts
|   |           logger.ts
|   |
|   +---plugins
|   |       index.ts
|   |       plugin.manager.ts
|   |
|   +---services
|   |       service.container.ts
|   |
|   \---types
|           api.types.ts
|           cache.types.ts
|           config.types.ts
|           error.types.ts
|           event.types.ts
|           http.types.ts
|           index.ts
|           logging.types.ts
|           plugins.types.ts
|           services.types.ts
|
+---features
|   +---lavorazioni
|   |   +---api
|   |   |   \---endpoints
|   |   +---dashboard
|   |   |   +---components
|   |   |   |   |   DashboardContainer.css
|   |   |   |   |   DashboardContainer.tsx
|   |   |   |   |   index.ts
|   |   |   |   |
|   |   |   |   +---Filters
|   |   |   |   |       Filters.css
|   |   |   |   |       Filters.tsx
|   |   |   |   |       index.ts
|   |   |   |   |
|   |   |   |   +---LavorazioniTable
|   |   |   |   |       index.ts
|   |   |   |   |       LavorazioneTable.tsx
|   |   |   |   |       LavorazioniTable.css
|   |   |   |   |
|   |   |   |   \---StatsGrid
|   |   |   |           index.ts
|   |   |   |           StatsGrid.css
|   |   |   |           StatsGrid.tsx
|   |   |   |
|   |   |   +---hooks
|   |   |   |       index.ts
|   |   |   |       useDashboardActions.ts
|   |   |   |       useDashboardState.ts
|   |   |   |
|   |   |   \---store
|   |   +---hooks
|   |   |       DetailActions.ts
|   |   |       useDashboard.ts
|   |   |       useLavorazione.ts
|   |   |
|   |   +---pages
|   |   |   +---DettaglioLavorazione
|   |   |   |   |   DettaglioLavorazione.css
|   |   |   |   |   DettaglioLavorazionipage.tsx
|   |   |   |   |
|   |   |   |   +---components
|   |   |   |   |       ControlBar.css
|   |   |   |   |       ControlBar.tsx
|   |   |   |   |       TabNavWrapper.tsx
|   |   |   |   |
|   |   |   |   \---sections
|   |   |   |       +---Abbattimento
|   |   |   |       |   |   AbbattimentoTab.styles.ts
|   |   |   |       |   |   AbbattimentoTab.tsx
|   |   |   |       |   |
|   |   |   |       |   +---components
|   |   |   |       |   |       AbbattimentoProgressChart.styles.ts
|   |   |   |       |   |       AbbattimentoProgressChart.tsx
|   |   |   |       |   |       TemperatureDisplay.styles.ts
|   |   |   |       |   |       TemperatureDisplay.tsx
|   |   |   |       |   |
|   |   |   |       |   \---hooks
|   |   |   |       |           useAbbattimento.ts
|   |   |   |       |           useAbbattimentoManager.ts
|   |   |   |       |           useCoolingCalculator.ts
|   |   |   |       |
|   |   |   |       +---Assemblaggio
|   |   |   |       |   |   AssemblaggioTab.styles.ts
|   |   |   |       |   |   AssemblaggioTab.tsx
|   |   |   |       |   |   index.ts
|   |   |   |       |   |
|   |   |   |       |   +---components
|   |   |   |       |   |       FaseAssemblaggio.style.ts
|   |   |   |       |   |       FaseAssemblaggioCard.tsx
|   |   |   |       |   |       OperatoreSelect.tsx
|   |   |   |       |   |
|   |   |   |       |   \---hooks
|   |   |   |       |           useAssemblaggioManager.ts
|   |   |   |       |
|   |   |   |       +---Cotture
|   |   |   |       |   +---components
|   |   |   |       |   |   |   CotturaForm.tsx
|   |   |   |       |   |   |   CotturaFormField.tsx
|   |   |   |       |   |   |   CotturaItem.styles.ts
|   |   |   |       |   |   |   CotturaItem.tsx
|   |   |   |       |   |   |   CotturaList.styles.ts
|   |   |   |       |   |   |   CotturaList.tsx
|   |   |   |       |   |   |   CotturaTab.styles.ts
|   |   |   |       |   |   |   CotturaTab.tsx
|   |   |   |       |   |   |   CotturaTabs.css
|   |   |   |       |   |   |   InterruzioneCotturaModal.styles.ts
|   |   |   |       |   |   |   InterruzioneCotturaModal.tsx
|   |   |   |       |   |   |
|   |   |   |       |   |   \---CotturaTimer
|   |   |   |       |   |           CotturaTimer.styles.ts
|   |   |   |       |   |           CotturaTimer.tsx
|   |   |   |       |   |
|   |   |   |       |   +---hooks
|   |   |   |       |   |       useCotturaForm.ts
|   |   |   |       |   |       useCottureCore.ts
|   |   |   |       |   |       useCottureFlow.ts
|   |   |   |       |   |       useCottureImport.ts
|   |   |   |       |   |       useCottureManager.ts
|   |   |   |       |   |
|   |   |   |       |   \---utils
|   |   |   |       |           cotturaUtils.ts
|   |   |   |       |
|   |   |   |       +---Documenti
|   |   |   |       |       cottura.md
|   |   |   |       |       DASHBOARDLAVORAZIONI.MD
|   |   |   |       |       devdettaglio.md
|   |   |   |       |       informazionigenerali.md
|   |   |   |       |
|   |   |   |       +---InformazioniGenerali
|   |   |   |       |       InfoTab.css
|   |   |   |       |       InfoTab.tsx
|   |   |   |       |       InfoTabContent.tsx
|   |   |   |       |
|   |   |   |       +---Ingredienti
|   |   |   |       \---Passaggi
|   |   |   |           +---components
|   |   |   |           |   |   EventTimeline.tsx
|   |   |   |           |   |   LavorazioneTab.tsx
|   |   |   |           |   |   LavorazioniTab.styles.ts
|   |   |   |           |   |   OperatoreSelect.tsx
|   |   |   |           |   |   PassaggioCard.tsx
|   |   |   |           |   |   PassaggioItems.styles.ts
|   |   |   |           |   |   PassaggioItems.tsx
|   |   |   |           |   |
|   |   |   |           |   \---hook
|   |   |   |           |           useLavorazioneManager.ts
|   |   |   |           |
|   |   |   |           +---types
|   |   |   |           |       lavorazioni.types.ts
|   |   |   |           |
|   |   |   |           \---utils
|   |   |   |                   LavorazioniUtils.ts
|   |   |   |
|   |   |   \---{DettaglioLavorazione
|   |   |           devdettaglio.md
|   |   |
|   |   +---services
|   |   |       index.ts
|   |   |       lavorazione.service.ts
|   |   |
|   |   +---shared
|   |   |   +---hooks
|   |   |   +---types
|   |   |   \---utils
|   |   +---store
|   |   |       LavorazioneContext.tsx
|   |   |
|   |   +---types
|   |   |       api.types.ts
|   |   |       dashboard.types.ts
|   |   |       events.types.ts
|   |   |       index.ts
|   |   |       models.types.ts
|   |   |       state.types.ts
|   |   |
|   |   \---utils
|   |       |   tipoCotturaUtils.ts
|   |       |
|   |       \---temperature
|   |               FoodCoolingCalculator.ts
|   |
|   \---pianificazione
|       +---api
|       |   \---endpoints
|       |           lavorazioniApi.ts
|       |           materiePrimeApi.ts
|       |           ricetteApi.ts
|       |
|       +---components
|       |   |   PianificazioneContainer.tsx
|       |   |
|       |   +---BrogliaccioLavorazioni
|       |   |       BrogliaccioLavorazioni.tsx
|       |   |
|       |   +---ConfermaLavorazione
|       |   |       ConfermaLAvorazione.tsx
|       |   |
|       |   +---LavorazioneLibera
|       |   |       LavorazioneLibera.tsx
|       |   |
|       |   +---LavorazioniParcheggiate
|       |   |       EditForm.tsx
|       |   |       LavorazioneCard.tsx
|       |   |       LavorazioniParcheggiate.tsx
|       |   |
|       |   +---MateriePrimeList
|       |   +---StatistichePianificazione
|       |   |       StatistichePianificazione.tsx
|       |   |
|       |   \---SuggerimentiLavorazione
|       |           PreviewRicetta.tsx
|       |           SuggerimentiLavorazione.tsx
|       |           SuggerimentoCard.tsx
|       |
|       +---context
|       |       PianificazioneContext.tsx
|       |       PianificazioneProvider.tsx
|       |       PianificazioneReducer.ts
|       |
|       +---documenti
|       |       milestone.md
|       |       piano di migrazione.md
|       |
|       +---hooks
|       |       useConfermaLavorazioniActions.ts
|       |       useLavorazioniActions.ts
|       |       useMateriePrimeActions.ts
|       |       usePianificazione.ts
|       |       usePianificazioneAction.ts
|       |       useSuggerimentiActions.ts
|       |       useUIActions.ts
|       |
|       +---services
|       |       calculations.service.ts
|       |       ingredientMatching.service.ts
|       |       storage.service.ts
|       |       tracking.service.ts
|       |
|       +---types
|       |       lavorazioni.types.ts
|       |       materiePrime.types.ts
|       |       pianificazione.types.ts
|       |       ricette.types.ts
|       |
|       \---utils
|               calculations.utils.ts
|               IngredientiMatching.utils.ts
|               tracking.utils.ts
|
+---modal
|       CategoryModal.js
|       ClienteModal.js
|       FasiMethodModal.js
|       FasiTypeModal.js
|       IngredientModal.js
|       MateriaPrimaModal.js
|       ModaleInformazioniGenerali.js
|       modalRecipes.js
|       PrelievoMateriePrimeModal.js
|       RecipeInsertModal.js
|       TipoCotturaModal.js
|       UnitModal.js
|
+---pages
|       CategoryGoodsPage.js
|       CategoryRecipesPage.js
|       ClientiPage.js
|       DOCUENTAZIONE INGREDIENTI.MD
|       DOCUMENTAZIONE RICETTE.MD
|       FasiMethodPage.js
|       FasiTypePage.js
|       HomePage.js
|       IMPLELEMENTAZIONE PIANIFICAZIONE.MD
|       IngredientDetail.js
|       IngredientsPage.js
|       MateriePrime.js
|       PannelloOpzioni.js
|       ProcessingStatesPage.js
|       ProcessingTypesPage.js
|       QuantityTypesPage.js
|       RecipeDetail.js
|       RecipesPage.js
|       SchedaCliente.js
|       StyleGuide.js
|       TipoCotturaPage.js
|       UnitsPage.js
|
+---services
|       costService.js
|       fasiApi.js
|       nutritionService.js
|
+---styles
|   |   ClientiPage.css
|   |   designSystem.css
|   |   globalStyles.js
|   |   HomePage.css
|   |   LavorazioniDashboard.css
|   |   Layout.css
|   |   MateriaPrimaModal.css
|   |   MateriePrime.css
|   |   Modal.css
|   |   Navbar.css
|   |   PianificazioneLavorazioni.css
|   |   PrelievoMateriePrimeModal.css
|   |   QuickFilters.css
|   |   SchedaCliente.css
|   |   StatsBar.css
|   |   StyleGuide.css
|   |   STYLE_GUIDE.md
|   |
|   +---HomePage
|   |       Calendar.css
|   |       Cards.css
|   |       LavorazioniRecenti.css
|   |       TeamSection.css
|   |
|   +---Recipes
|   |       QuickFilters.css
|   |       RecipeCard.css
|   |       RecipeCostAnalysis.css
|   |       RecipeDetail.css
|   |       RecipeGeneralInfo.css
|   |       RecipeIngredientsAndCosts.css
|   |       RecipeNutritionalInfo.css
|   |       RecipePreparation.css
|   |       RecipeReport-css
|   |       RecipesPage.css
|   |       RecipeTable.css
|   |       RecipeTabs.css
|   |       StatsBar.css
|   |
|   \---theme
|           borderRadius.js
|           colors.js
|           index.js
|           shadows.js
|           spacing.js
|           typography.js
|
\---utils
        dateUtils.js
        debug.js
        fetchUtils.js