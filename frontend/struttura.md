|   |       |   home_paths_sync.js
|   |       |   mock.js
|   |       |   mock_sync.js
|   |       |   module_dir.js
|   |       |   node-modules-paths.js
|   |       |   node_path.js
|   |       |   nonstring.js
|   |       |   pathfilter.js
|   |       |   precedence.js
|   |       |   resolver.js
|   |       |   resolver_sync.js
|   |       |   shadowed_core.js
|   |       |   subdirs.js
|   |       |   symlinks.js
|   |       |
|   |       +---dotdot
|   |       |   |   index.js
|   |       |   |
|   |       |   \---abc
|   |       |           index.js
|   |       |
|   |       +---module_dir
|   |       |   +---xmodules
|   |       |   |   \---aaa
|   |       |   |           index.js
|   |       |   |
|   |       |   +---ymodules
|   |       |   |   \---aaa
|   |       |   |           index.js
|   |       |   |
|   |       |   \---zmodules
|   |       |       \---bbb
|   |       |               main.js
|   |       |               package.json
|   |       |
|   |       +---node_path
|   |       |   +---x
|   |       |   |   +---aaa
|   |       |   |   |       index.js
|   |       |   |   |
|   |       |   |   \---ccc
|   |       |   |           index.js
|   |       |   |
|   |       |   \---y
|   |       |       +---bbb
|   |       |       |       index.js
|   |       |       |
|   |       |       \---ccc
|   |       |               index.js
|   |       |
|   |       +---pathfilter
|   |       |   \---deep_ref
|   |       |           main.js
|   |       |
|   |       +---precedence
|   |       |   |   aaa.js
|   |       |   |   bbb.js
|   |       |   |
|   |       |   +---aaa
|   |       |   |       index.js
|   |       |   |       main.js
|   |       |   |
|   |       |   \---bbb
|   |       |           main.js
|   |       |
|   |       +---resolver
|   |       |   |   cup.coffee
|   |       |   |   foo.js
|   |       |   |   mug.coffee
|   |       |   |   mug.js
|   |       |   |
|   |       |   +---baz
|   |       |   |       doom.js
|   |       |   |       package.json
|   |       |   |       quux.js
|   |       |   |
|   |       |   +---browser_field
|   |       |   |       a.js
|   |       |   |       b.js
|   |       |   |       package.json
|   |       |   |
|   |       |   +---dot_main
|   |       |   |       index.js
|   |       |   |       package.json
|   |       |   |
|   |       |   +---dot_slash_main
|   |       |   |       index.js
|   |       |   |       package.json
|   |       |   |
|   |       |   +---false_main
|   |       |   |       index.js
|   |       |   |       package.json
|   |       |   |
|   |       |   +---incorrect_main
|   |       |   |       index.js
|   |       |   |       package.json
|   |       |   |
|   |       |   +---invalid_main
|   |       |   |       package.json
|   |       |   |
|   |       |   +---multirepo
|   |       |   |   |   lerna.json
|   |       |   |   |   package.json
|   |       |   |   |
|   |       |   |   \---packages
|   |       |   |       +---package-a
|   |       |   |       |       index.js
|   |       |   |       |       package.json
|   |       |   |       |
|   |       |   |       \---package-b
|   |       |   |               index.js
|   |       |   |               package.json
|   |       |   |
|   |       |   +---nested_symlinks
|   |       |   |   \---mylib
|   |       |   |           async.js
|   |       |   |           package.json
|   |       |   |           sync.js
|   |       |   |
|   |       |   +---other_path
|   |       |   |   |   root.js
|   |       |   |   |
|   |       |   |   \---lib
|   |       |   |           other-lib.js
|   |       |   |
|   |       |   +---quux
|   |       |   |   \---foo
|   |       |   |           index.js
|   |       |   |
|   |       |   +---same_names
|   |       |   |   |   foo.js
|   |       |   |   |
|   |       |   |   \---foo
|   |       |   |           index.js
|   |       |   |
|   |       |   +---symlinked
|   |       |   |   +---package
|   |       |   |   |       bar.js
|   |       |   |   |       package.json
|   |       |   |   |
|   |       |   |   \---_
|   |       |   |       +---node_modules
|   |       |   |       |       foo.js
|   |       |   |       |
|   |       |   |       \---symlink_target
|   |       |   |               .gitkeep
|   |       |   |
|   |       |   \---without_basedir
|   |       |           main.js
|   |       |
|   |       \---shadowed_core
|   |           \---node_modules
|   |               \---util
|   |                       index.js
|   |
|   +---resolve.exports
|   |   |   index.d.ts
|   |   |   license
|   |   |   package.json
|   |   |   readme.md
|   |   |
|   |   \---dist
|   |           index.js
|   |           index.mjs
|   |
|   +---rimraf
|   |       bin.js
|   |       CHANGELOG.md
|   |       LICENSE
|   |       package.json
|   |       README.md
|   |       rimraf.js
|   |
|   +---supports-color
|   |       browser.js
|   |       index.js
|   |       license
|   |       package.json
|   |       readme.md
|   |
|   +---typescript
|   |   |   LICENSE.txt
|   |   |   package.json
|   |   |   README.md
|   |   |   SECURITY.md
|   |   |   ThirdPartyNoticeText.txt
|   |   |
|   |   +---bin
|   |   |       tsc
|   |   |       tsserver
|   |   |
|   |   \---lib
|   |       |   cancellationToken.js
|   |       |   dynamicImportCompat.js
|   |       |   lib.d.ts
|   |       |   lib.dom.d.ts
|   |       |   lib.dom.iterable.d.ts
|   |       |   lib.es2015.collection.d.ts
|   |       |   lib.es2015.core.d.ts
|   |       |   lib.es2015.d.ts
|   |       |   lib.es2015.generator.d.ts
|   |       |   lib.es2015.iterable.d.ts
|   |       |   lib.es2015.promise.d.ts
|   |       |   lib.es2015.proxy.d.ts
|   |       |   lib.es2015.reflect.d.ts
|   |       |   lib.es2015.symbol.d.ts
|   |       |   lib.es2015.symbol.wellknown.d.ts
|   |       |   lib.es2016.array.include.d.ts
|   |       |   lib.es2016.d.ts
|   |       |   lib.es2016.full.d.ts
|   |       |   lib.es2017.d.ts
|   |       |   lib.es2017.full.d.ts
|   |       |   lib.es2017.intl.d.ts
|   |       |   lib.es2017.object.d.ts
|   |       |   lib.es2017.sharedmemory.d.ts
|   |       |   lib.es2017.string.d.ts
|   |       |   lib.es2017.typedarrays.d.ts
|   |       |   lib.es2018.asyncgenerator.d.ts
|   |       |   lib.es2018.asynciterable.d.ts
|   |       |   lib.es2018.d.ts
|   |       |   lib.es2018.full.d.ts
|   |       |   lib.es2018.intl.d.ts
|   |       |   lib.es2018.promise.d.ts
|   |       |   lib.es2018.regexp.d.ts
|   |       |   lib.es2019.array.d.ts
|   |       |   lib.es2019.d.ts
|   |       |   lib.es2019.full.d.ts
|   |       |   lib.es2019.intl.d.ts
|   |       |   lib.es2019.object.d.ts
|   |       |   lib.es2019.string.d.ts
|   |       |   lib.es2019.symbol.d.ts
|   |       |   lib.es2020.bigint.d.ts
|   |       |   lib.es2020.d.ts
|   |       |   lib.es2020.date.d.ts
|   |       |   lib.es2020.full.d.ts
|   |       |   lib.es2020.intl.d.ts
|   |       |   lib.es2020.number.d.ts
|   |       |   lib.es2020.promise.d.ts
|   |       |   lib.es2020.sharedmemory.d.ts
|   |       |   lib.es2020.string.d.ts
|   |       |   lib.es2020.symbol.wellknown.d.ts
|   |       |   lib.es2021.d.ts
|   |       |   lib.es2021.full.d.ts
|   |       |   lib.es2021.intl.d.ts
|   |       |   lib.es2021.promise.d.ts
|   |       |   lib.es2021.string.d.ts
|   |       |   lib.es2021.weakref.d.ts
|   |       |   lib.es2022.array.d.ts
|   |       |   lib.es2022.d.ts
|   |       |   lib.es2022.error.d.ts
|   |       |   lib.es2022.full.d.ts
|   |       |   lib.es2022.intl.d.ts
|   |       |   lib.es2022.object.d.ts
|   |       |   lib.es2022.sharedmemory.d.ts
|   |       |   lib.es2022.string.d.ts
|   |       |   lib.es5.d.ts
|   |       |   lib.es6.d.ts
|   |       |   lib.esnext.d.ts
|   |       |   lib.esnext.full.d.ts
|   |       |   lib.esnext.intl.d.ts
|   |       |   lib.esnext.promise.d.ts
|   |       |   lib.esnext.string.d.ts
|   |       |   lib.esnext.weakref.d.ts
|   |       |   lib.scripthost.d.ts
|   |       |   lib.webworker.d.ts
|   |       |   lib.webworker.importscripts.d.ts
|   |       |   lib.webworker.iterable.d.ts
|   |       |   protocol.d.ts
|   |       |   README.md
|   |       |   tsc.js
|   |       |   tsserver.js
|   |       |   tsserverlibrary.d.ts
|   |       |   tsserverlibrary.js
|   |       |   typescript.d.ts
|   |       |   typescript.js
|   |       |   typescriptServices.d.ts
|   |       |   typescriptServices.js
|   |       |   typesMap.json
|   |       |   typingsInstaller.js
|   |       |   watchGuard.js
|   |       |
|   |       +---cs
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---de
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---es
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---fr
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---it
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---ja
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---ko
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---pl
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---pt-br
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---ru
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---tr
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       +---zh-cn
|   |       |       diagnosticMessages.generated.json
|   |       |
|   |       \---zh-tw
|   |               diagnosticMessages.generated.json
|   |
|   +---v8-to-istanbul
|   |   |   CHANGELOG.md
|   |   |   index.d.ts
|   |   |   index.js
|   |   |   LICENSE.txt
|   |   |   package.json
|   |   |   README.md
|   |   |
|   |   +---lib
|   |   |       branch.js
|   |   |       function.js
|   |   |       line.js
|   |   |       range.js
|   |   |       source.js
|   |   |       v8-to-istanbul.js
|   |   |
|   |   \---node_modules
|   |       \---source-map
|   |           |   LICENSE
|   |           |   package.json
|   |           |   README.md
|   |           |   source-map.d.ts
|   |           |   source-map.js
|   |           |
|   |           +---dist
|   |           |       source-map.js
|   |           |
|   |           \---lib
|   |                   array-set.js
|   |                   base64-vlq.js
|   |                   base64.js
|   |                   binary-search.js
|   |                   mapping-list.js
|   |                   mappings.wasm
|   |                   read-wasm.js
|   |                   source-map-consumer.js
|   |                   source-map-generator.js
|   |                   source-node.js
|   |                   util.js
|   |                   wasm.js
|   |
|   +---webpack-dev-middleware
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |
|   |   +---dist
|   |   |   |   index.js
|   |   |   |   middleware.js
|   |   |   |   options.json
|   |   |   |
|   |   |   \---utils
|   |   |           compatibleAPI.js
|   |   |           getFilenameFromUrl.js
|   |   |           getPaths.js
|   |   |           ready.js
|   |   |           setupHooks.js
|   |   |           setupOutputFileSystem.js
|   |   |           setupWriteToDisk.js
|   |   |
|   |   +---node_modules
|   |   \---types
|   |       |   index.d.ts
|   |       |   middleware.d.ts
|   |       |
|   |       \---utils
|   |               compatibleAPI.d.ts
|   |               getFilenameFromUrl.d.ts
|   |               getPaths.d.ts
|   |               ready.d.ts
|   |               setupHooks.d.ts
|   |               setupOutputFileSystem.d.ts
|   |               setupWriteToDisk.d.ts
|   |
|   +---write-file-atomic
|   |       CHANGELOG.md
|   |       index.js
|   |       LICENSE
|   |       package.json
|   |       README.md
|   |
|   +---ws
|   |   |   browser.js
|   |   |   index.js
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   wrapper.mjs
|   |   |
|   |   \---lib
|   |           buffer-util.js
|   |           constants.js
|   |           event-target.js
|   |           extension.js
|   |           limiter.js
|   |           permessage-deflate.js
|   |           receiver.js
|   |           sender.js
|   |           stream.js
|   |           subprotocol.js
|   |           validation.js
|   |           websocket-server.js
|   |           websocket.js
|   |
|   +---yargs
|   |   |   browser.mjs
|   |   |   CHANGELOG.md
|   |   |   index.cjs
|   |   |   index.mjs
|   |   |   LICENSE
|   |   |   package.json
|   |   |   README.md
|   |   |   yargs
|   |   |
|   |   +---build
|   |   |   |   index.cjs
|   |   |   |
|   |   |   \---lib
|   |   |       |   argsert.js
|   |   |       |   command.js
|   |   |       |   completion-templates.js
|   |   |       |   completion.js
|   |   |       |   middleware.js
|   |   |       |   parse-command.js
|   |   |       |   usage.js
|   |   |       |   validation.js
|   |   |       |   yargs-factory.js
|   |   |       |   yerror.js
|   |   |       |
|   |   |       +---typings
|   |   |       |       common-types.js
|   |   |       |       yargs-parser-types.js
|   |   |       |
|   |   |       \---utils
|   |   |               apply-extends.js
|   |   |               is-promise.js
|   |   |               levenshtein.js
|   |   |               obj-filter.js
|   |   |               process-argv.js
|   |   |               set-blocking.js
|   |   |               which-module.js
|   |   |
|   |   +---helpers
|   |   |       helpers.mjs
|   |   |       index.js
|   |   |       package.json
|   |   |
|   |   +---lib
|   |   |   \---platform-shims
|   |   |           browser.mjs
|   |   |           esm.mjs
|   |   |
|   |   \---locales
|   |           be.json
|   |           de.json
|   |           en.json
|   |           es.json
|   |           fi.json
|   |           fr.json
|   |           hi.json
|   |           hu.json
|   |           id.json
|   |           it.json
|   |           ja.json
|   |           ko.json
|   |           nb.json
|   |           nl.json
|   |           nn.json
|   |           pirate.json
|   |           pl.json
|   |           pt.json
|   |           pt_BR.json
|   |           ru.json
|   |           th.json
|   |           tr.json
|   |           zh_CN.json
|   |           zh_TW.json
|   |
|   \---yargs-parser
|       |   browser.js
|       |   CHANGELOG.md
|       |   LICENSE.txt
|       |   package.json
|       |   README.md
|       |
|       \---build
|           |   index.cjs
|           |
|           \---lib
|                   index.js
|                   string-utils.js
|                   tokenize-arg-string.js
|                   yargs-parser-types.js
|                   yargs-parser.js
|
+---public
|       index.html
|
\---src
    |   App.js
    |   custom.css
    |   index.css
    |   index.js
    |   project-analysis-report.json
    |   reportWebVitals.js
    |   structure.txt
    |
    +---components
    |   |   AssegnazioneCard.js
    |   |   LavorazioneActions.js
    |   |   LavorazioneForm.js
    |   |   LavorazioneHeader.js
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
    |   |   |   brogliaccio.css
    |   |   |   BrogliaccioLavorazioni.js
    |   |   |   ConfermaLavorazione.css
    |   |   |   ConfermaLavorazione.js
    |   |   |   LavorazioniParcheggiate.css
    |   |   |   LavorazioniParcheggiate.js
    |   |   |   MateriePrimeList.css
    |   |   |   MateriePrimeList.js
    |   |   |   mockup.css
    |   |   |   MockupLayout.js
    |   |   |   revisione 2.0.md
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
    |       +---doc
    |       |       recipe-module-plan.md
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
    |           |   DOCUMENTAZIONE.MD
    |           |   refactoring cottura.MD
    |           |
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
    |           |   +---calculations
    |           |   \---state
    |           |           ingredientState.js
    |           |
    |           +---services
    |           |       apiService.js
    |           |       calculations.js
    |           |       validationService.js
    |           |
    |           +---tests
    |           |   +---components
    |           |   |       IngredientFields.test.js
    |           |   |       IngredientForm.test.js
    |           |   |       IngredientList.test.js
    |           |   |
    |           |   +---integration
    |           |   |       CalculationsFlow.test.js
    |           |   |       recipeIngredient.test.js
    |           |   |       ValidationFlow.test.js
    |           |   |
    |           |   \---unit
    |           |           calculations.test.js
    |           |           conversions.test.js
    |           |           validationService.test.js
    |           |
    |           \---utils
    |                   calculations.js
    |                   constants.js
    |                   conversions.js
    |
    +---features
    |   |   log.MD
    |   |
    |   \---lavorazioni
    |       +---components
    |       |   |   LavorazioniDashboard.jsx
    |       |   |
    |       |   +---atoms
    |       |   |   |   index.ts
    |       |   |   |
    |       |   |   +---Badge
    |       |   |   |       index.js
    |       |   |   |
    |       |   |   +---Button
    |       |   |   |       index.js
    |       |   |   |
    |       |   |   +---Card
    |       |   |   |       index.js
    |       |   |   |
    |       |   |   +---Input
    |       |   |   |       index.js
    |       |   |   |
    |       |   |   +---Select
    |       |   |   |       index.js
    |       |   |   |
    |       |   |   \---TextArea
    |       |   |           index.ts
    |       |   |
    |       |   +---common
    |       |   |   |   ErrorMessage.js
    |       |   |   |
    |       |   |   \---TabNav
    |       |   |           SubTabNav.js
    |       |   |           TabNav.js
    |       |   |
    |       |   +---dashboard
    |       |   |       LavorazioniTable.jsx
    |       |   |       QuickFilters.jsx
    |       |   |       StatsCard.jsx
    |       |   |
    |       |   \---dettaglio
    |       |       |   MEMO.MD
    |       |       |
    |       |       +---actions
    |       |       |       LavorazioneActions.js
    |       |       |
    |       |       +---form
    |       |       |       LavorazioneForm.js
    |       |       |
    |       |       +---header
    |       |       |       LavorazioneHeader.js
    |       |       |
    |       |       \---tabs
    |       |           |   LavorazioneTabs.js
    |       |           |
    |       |           \---sections
    |       |               |   Abbattimento.js
    |       |               |   Assemblaggio.js
    |       |               |   ConservazioneHACCP.js
    |       |               |   Cottura.js
    |       |               |   Cottura.styles.js
    |       |               |   InformazioniGenerali.js
    |       |               |   ValoriNutrizionaliHACCP.js
    |       |               |
    |       |               +---IngredientiHACCP
    |       |               |   |   DOCUMENTAZIONE.MD
    |       |               |   |   index.js
    |       |               |   |
    |       |               |   +---components
    |       |               |   |   |   IngredientiTable.js
    |       |               |   |   |   StatusMessage.js
    |       |               |   |   |   verificaCel.js
    |       |               |   |   |
    |       |               |   |   \---styles
    |       |               |   \---hooks
    |       |               |           IngredientiHACCP.js
    |       |               |           useIngredientiHaccp.js
    |       |               |           useIngredientiHaccpData.js
    |       |               |           useIngredientiHaccpForm.js
    |       |               |           useIngredientiHaccpSave.js
    |       |               |           useIngredientiHaccpStyles.js
    |       |               |
    |       |               \---PassaggiLavorazione
    |       |                   |   index.js
    |       |                   |
    |       |                   +---components
    |       |                   |   +---ErrorMessage
    |       |                   |   |       index.js
    |       |                   |   |       styles.js
    |       |                   |   |
    |       |                   |   +---PassaggioCard
    |       |                   |   |       index.js
    |       |                   |   |
    |       |                   |   \---PhaseControl
    |       |                   |           index.js
    |       |                   |
    |       |                   \---hooks
    |       |                           usePassaggiLavorazione.js
    |       |                           usePassaggiLavorazioneStyles.js
    |       |
    |       +---context
    |       |       LavorazioneContext.js
    |       |
    |       +---docs
    |       |       DettaglioLavorazioni.md
    |       |
    |       +---hooks
    |       |   |   useAssemblaggio.js
    |       |   |   useConservazione.js
    |       |   |   useCottura.js
    |       |   |   useDashboardLavorazioni.js
    |       |   |   useInformazioniGenerali.js
    |       |   |   useLavorazione.js
    |       |   |   useLavorazioneState.ts
    |       |   |   useParametriHACCP.js
    |       |   |   useTabNavigation.ts
    |       |   |
    |       |   +---fasi
    |       |   |       useLavorazioniFasi.js
    |       |   |
    |       |   +---informazioniGenerali
    |       |   |       pattern.txt
    |       |   |       useInformazioniGeneraliData.js
    |       |   |       useInformazioniGeneraliForm.js
    |       |   |       useInformazioniGeneraliSave.js
    |       |   |       useInformazioniGeneraliStyles.js
    |       |   |
    |       |   +---styles
    |       |   \---Validazione
    |       +---pages
    |       |       @DettaglioLavorazione.styles.js
    |       |       DettaglioLavorazione.js
    |       |
    |       +---services
    |       |       api.js
    |       |       LavorazioneApi.js
    |       |
    |       +---store
    |       |       lavorazioneStore.js
    |       |       StoreProvider.js
    |       |
    |       \---types
    |               lavorazione.types.ts
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
    |       DettaglioLavorazione.js.old
    |       DOCUENTAZIONE INGREDIENTI.MD
    |       DOCUMENTAZIONE RICETTE.MD
    |       FasiMethodPage.js
    |       FasiTypePage.js
    |       HomePage.js
    |       IMPLELEMENTAZIONE PIANIFICAZIONE.MD
    |       IngredientDetail.js
    |       IngredientsPage.js
    |       LavorazioniDashboard.js.old
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
    |   |   LavorazioniTable.css
    |   |   Layout.css
    |   |   MateriaPrimaModal.css
    |   |   MateriePrime.css
    |   |   Modal.css
    |   |   Navbar.css
    |   |   PianificazioneLavorazioni.css
    |   |   PrelievoMateriePrimeModal.css
    |   |   prova.css
    |   |   QuickFilters.css
    |   |   recipedetail.css
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
    |           colors.js
    |           index.js
    |           shadows.js
    |           spacing.js
    |           typography.js
    |
    +---tools
    |       analyze-project.js
    |       complete-analysis.js
    |       lavorazioni-analysis.js
    |       run-analysis.js
    |
    \---utils
            dateUtils.js
            debug.js
            fetchUtils.js

PS C:\Users\mmose\OneDrive\Desktop\ALCHIMIA SRL\gestionale\gestionale\frontend> 