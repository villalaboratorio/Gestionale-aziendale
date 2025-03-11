Compiled with problems:
×
ERROR in src/features/pianificazione/api/endpoints/lavorazioniApi.ts:1:10
TS2305: Module '"@core/api"' has no exported member 'ApiService'.
  > 1 | import { ApiService } from '@core/api';
      |          ^^^^^^^^^^
    2 | import { IDettaglioLavorazione } from '../../types/lavorazioni.types';
    3 |
    4 | export const lavorazioniApi = {
ERROR in src/features/pianificazione/api/endpoints/materiePrimeApi.ts:1:10
TS2305: Module '"@core/api"' has no exported member 'ApiService'.
  > 1 | import { ApiService } from '@core/api';
      |          ^^^^^^^^^^
    2 | import { IMateriaPrima, IPrelievo } from '../../types/materiePrime.types';
    3 |
    4 | export const materiePrimeApi = {
ERROR in src/features/pianificazione/api/endpoints/ricetteApi.ts:1:10
TS2305: Module '"@core/api"' has no exported member 'ApiService'.
  > 1 | import { ApiService } from '@core/api';
      |          ^^^^^^^^^^
    2 | import { IRicetta } from '../../types/ricette.types';
    3 |
    4 | export const ricetteApi = {
ERROR in src/features/pianificazione/components/LavorazioniParcheggiate/LavorazioniParcheggiate.tsx:7:33
TS1261: Already included file name 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/components/ConfermaLavorazione/ConfermaLavorazione.tsx' differs from file name 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/components/ConfermaLavorazione/ConfermaLAvorazione.tsx' only in casing.
  The file is in the program because:
    Imported via '../ConfermaLavorazione/ConfermaLavorazione' from file 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/components/LavorazioniParcheggiate/LavorazioniParcheggiate.tsx'
    Root file specified for compilation
     5 | import EditForm from './EditForm';
     6 | import LavorazioneCard from '../LavorazioniParcheggiate/LavorazioneCard';
  >  7 | import ConfermaLavorazione from '../ConfermaLavorazione/ConfermaLavorazione';
       |                                 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     8 | import { ILavorazioneParcheggiata } from '../../types/lavorazioni.types';
     9 | import { 
    10 |   HeaderContent, 
ERROR in src/features/pianificazione/context/PianificazioneProvider.tsx:3:39
TS1261: Already included file name 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/context/pianificazioneReducer.ts' differs from file name 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/context/PianificazioneReducer.ts' only in casing.
  The file is in the program because:
    Imported via './pianificazioneReducer' from file 'C:/Users/mmose/OneDrive/Desktop/ALCHIMIA SRL/gestionale/gestionale/gestionale-refactoring/gestionale-refactoring/frontend/src/features/pianificazione/context/PianificazioneProvider.tsx'
    Root file specified for compilation
    1 | import React, { useReducer, useEffect } from 'react';
    2 | import { PianificazioneContext, initialState } from './PianificazioneContext';
  > 3 | import { pianificazioneReducer } from './pianificazioneReducer';
      |                                       ^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { serviceContainer } from '@core/services/service.container';
    5 | import { usePianificazioneAction } from '../hooks/usePianificazioneAction';
    6 | import { ILavorazioneParcheggiata } from '../types/lavorazioni.types';
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:10:10
TS2678: Type '"LOADING_MATERIE_PRIME"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
     8 |   switch (action.type) {
     9 |     // Materie prime
  > 10 |     case 'SET_LOADING':
       |          ^^^^^^^^^^^^^^^^^^^^^^^
    11 |       return {
    12 |         ...state,
    13 |         materiePrime: {
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:28:10
TS2678: Type '"ERROR_MATERIE_PRIME"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    26 |
    27 |     case 'SET_MATERIE_PRIME':
  > 28 |       return {
       |          ^^^^^^^^^^^^^^^^^^^^^
    29 |         ...state,
    30 |         materiePrime: {
    31 |           ...state.materiePrime,
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:34:25
TS2339: Property 'payload' does not exist on type 'never'.
    32 |           items: action.payload,
    33 |           loading: false
  > 34 |         }
       |          ^^^^^^^
    35 |       };
    36 |
    37 |     case 'SET_ERROR':
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:37:10
TS2678: Type '"SELECT_MATERIA_PRIMA"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    35 |       };
    36 |
  > 37 |     case 'SET_ERROR':
       |          ^^^^^^^^^^^^^^^^^^^^^^
    38 |       return {
    39 |         ...state,
    40 |         materiePrime: {
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:42:28
TS2339: Property 'payload' does not exist on type 'never'.
    40 |         materiePrime: {
    41 |           ...state.materiePrime,
  > 42 |           error: action.payload.materiePrime !== undefined ? action.payload.materiePrime : state.materiePrime.error
       |                            ^^^^^^^
    43 |         },
    44 |         suggerimenti: {
    45 |           ...state.suggerimenti,
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:47:10
TS2678: Type '"LOADING_SUGGERIMENTI"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    45 |           ...state.suggerimenti,
    46 |           error: action.payload.suggerimenti !== undefined ? action.payload.suggerimenti : state.suggerimenti.error
  > 47 |         },
       |          ^^^^^^^^^^^^^^^^^^^^^^
    48 |         lavorazioni: {
    49 |           ...state.lavorazioni,
    50 |           error: action.payload.operazioni !== undefined ? action.payload.operazioni : state.lavorazioni.error
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:61:33
TS2339: Property 'suggerimenti' does not exist on type 'ISuggerimento[]'.
    59 |           selected: action.payload
    60 |         }
  > 61 |       };
       |                   ^^^^^^^^^^^^
    62 |       
    63 |     // Suggerimenti
    64 |     case 'SET_SUGGERIMENTI':
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:62:34
TS2339: Property 'gruppi' does not exist on type 'ISuggerimento[]'.
    60 |         }
    61 |       };
  > 62 |       
       |       ^^^^^^
    63 |     // Suggerimenti
    64 |     case 'SET_SUGGERIMENTI':
    65 |       return {
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:66:10
TS2678: Type '"ERROR_SUGGERIMENTI"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    64 |     case 'SET_SUGGERIMENTI':
    65 |       return {
  > 66 |         ...state,
       |          ^^^^^^^^^^^^^^^^^^^^
    67 |         suggerimenti: {
    68 |           ...state.suggerimenti,
    69 |           items: action.payload,
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:72:25
TS2339: Property 'payload' does not exist on type 'never'.
    70 |           loading: false
    71 |         }
  > 72 |       };
       |                   ^^^^^^^
    73 |
    74 |     case 'SET_GRUPPI_RICETTE':
    75 |       return {
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:75:10
TS2678: Type '"SELECT_GRUPPO"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    73 |
    74 |     case 'SET_GRUPPI_RICETTE':
  > 75 |       return {
       |          ^^^^^^^^^^^^^^^
    76 |         ...state,
    77 |         suggerimenti: {
    78 |           ...state.suggerimenti,
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:80:34
TS2339: Property 'payload' does not exist on type 'never'.
    78 |           ...state.suggerimenti,
    79 |           gruppi: action.payload
  > 80 |         }
       |          ^^^^^^^
    81 |       };
    82 |
    83 |     case 'SET_SELECTED_GRUPPO':
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:85:10
TS2678: Type '"LOADING_LAVORAZIONI"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    83 |     case 'SET_SELECTED_GRUPPO':
    84 |       return {
  > 85 |         ...state,
       |          ^^^^^^^^^^^^^^^^^^^^^
    86 |         suggerimenti: {
    87 |           ...state.suggerimenti,
    88 |           selectedGruppo: action.payload
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:94:10
TS2678: Type '"SET_LAVORAZIONI"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    92 |     case 'UPDATE_SUGGERIMENTO':
    93 |       return {
  > 94 |         ...state,
       |          ^^^^^^^^^^^^^^^^^
    95 |         suggerimenti: {
    96 |           ...state.suggerimenti,
    97 |           items: state.suggerimenti.items.map(sugg => 
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:99:32
TS2339: Property 'payload' does not exist on type 'never'.
     97 |           items: state.suggerimenti.items.map(sugg => 
     98 |             sugg.ricetta._id === action.payload.ricettaId 
  >  99 |               ? { ...sugg, [action.payload.field]: action.payload.value }
        |                                ^^^^^^^
    100 |               : sugg
    101 |           )
    102 |         }
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:117:72
TS2339: Property 'data' does not exist on type '{ id: string; updatedData: Partial<ILavorazioneParcheggiata>; }'.
    115 |     case 'UPDATE_LAVORAZIONE':
    116 |       return {
  > 117 |         ...state,
        |                                      ^^^^
    118 |         lavorazioni: {
    119 |           ...state.lavorazioni,
    120 |           parcheggiate: state.lavorazioni.parcheggiate.map(lav => 
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:137:10
TS2678: Type '"ERROR_LAVORAZIONI"' is not comparable to type '"SET_LOADING" | "SET_MATERIE_PRIME" | "SET_ERROR" | "SET_SELECTED_MATERIA_PRIMA" | "SET_SUGGERIMENTI" | "SET_GRUPPI_RICETTE" | "SET_SELECTED_GRUPPO" | "UPDATE_SUGGERIMENTO" | ... 7 more ... | "SET_SHOW_LAVORAZIONE_LIBERA"'.
    135 |       };
    136 |
  > 137 |     case 'CLEAR_LAVORAZIONI':
        |          ^^^^^^^^^^^^^^^^^^^
    138 |       return {
    139 |         ...state,
    140 |         lavorazioni: {
ERROR in src/features/pianificazione/context/pianificazioneReducer.ts:143:25
TS2339: Property 'payload' does not exist on type 'never'.
    141 |           ...state.lavorazioni,
    142 |           parcheggiate: []
  > 143 |         }
        |          ^^^^^^^
    144 |       };
    145 |     
    146 |     // UI
ERROR in src/features/pianificazione/services/calculations.service.ts:1:25
TS2307: Cannot find module '@core/services' or its corresponding type declarations.
  > 1 | import { Service } from '@core/services';
      |                         ^^^^^^^^^^^^^^^^
    2 | import { ISuggerimento, IValidazione } from '../types/lavorazioni.types';
    3 | import { IMateriaPrima } from '../types/materiePrime.types';
    4 | import { IRicetta } from '../types/ricette.types';
ERROR in src/features/pianificazione/services/calculations.service.ts:6:34
TS2307: Cannot find module '@core/services' or its corresponding type declarations.
    4 | import { IRicetta } from '../types/ricette.types';
    5 | import { calculationsUtils } from '../utils/calculations.utils';
  > 6 | import { ServiceContainer } from '@core/services';
      |                                  ^^^^^^^^^^^^^^^^
    7 |
    8 | @Service('calculationsService')
    9 | export class CalculationsService {
ERROR in src/features/pianificazione/services/calculations.service.ts:9:14
TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option in your 'tsconfig' or 'jsconfig' to remove this warning.
     7 |
     8 | @Service('calculationsService')
  >  9 | export class CalculationsService {
       |              ^^^^^^^^^^^^^^^^^^^
    10 |   /**
    11 |    * Calcola suggerimenti di ricette per una materia prima
    12 |    * @param ricette Lista di ricette
ERROR in src/features/pianificazione/services/ingredientMatching.service.ts:1:25
TS2307: Cannot find module '@core/services' or its corresponding type declarations.
  > 1 | import { Service } from '@core/services';
      |                         ^^^^^^^^^^^^^^^^
    2 | import { ingredientMatching } from '../utils/ingredientMatching.utils';
    3 | import { ICompatibilita } from '../types/lavorazioni.types';
    4 | import { IRicetta, IIngredienteRicetta } from '../types/ricette.types';
ERROR in src/features/pianificazione/services/ingredientMatching.service.ts:2:36
TS2307: Cannot find module '../utils/ingredientMatching.utils' or its corresponding type declarations.
    1 | import { Service } from '@core/services';
  > 2 | import { ingredientMatching } from '../utils/ingredientMatching.utils';
      |                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ICompatibilita } from '../types/lavorazioni.types';
    4 | import { IRicetta, IIngredienteRicetta } from '../types/ricette.types';
    5 | import { IMateriaPrima } from '../types/materiePrime.types';
ERROR in src/features/pianificazione/services/ingredientMatching.service.ts:8:14
TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option in your 'tsconfig' or 'jsconfig' to remove this warning.
     6 |
     7 | @Service('ingredientMatchingService')
  >  8 | export class IngredientMatchingService {
       |              ^^^^^^^^^^^^^^^^^^^^^^^^^
     9 |   /**
    10 |    * Determina il miglior ingrediente compatibile in una ricetta
    11 |    * @param materiaPrima Materia prima da confrontare
ERROR in src/features/pianificazione/services/storage.service.ts:2:24
TS2307: Cannot find module '@core/logging' or its corresponding type declarations.
    1 | import { ILavorazioneParcheggiata } from '../types/lavorazioni.types';
  > 2 | import { Logger } from '@core/logging';
      |                        ^^^^^^^^^^^^^^^
    3 |
    4 | export class StorageService {
    5 |   private STORAGE_KEYS = {
ERROR in src/features/pianificazione/services/tracking.service.ts:1:25
TS2307: Cannot find module '@core/services' or its corresponding type declarations.
  > 1 | import { Service } from '@core/services';
      |                         ^^^^^^^^^^^^^^^^
    2 | import { IMateriaPrima } from '../types/materiePrime.types';
    3 | import { ILavorazioneParcheggiata, IValidazione } from '../types/lavorazioni.types';
    4 | import { trackingUtils } from '../utils/tracking.utils';
ERROR in src/features/pianificazione/services/tracking.service.ts:7:14
TS1219: Experimental support for decorators is a feature that is subject to change in a future release. Set the 'experimentalDecorators' option in your 'tsconfig' or 'jsconfig' to remove this warning.
     5 |
     6 | @Service('trackingService')
  >  7 | export class TrackingService {
       |              ^^^^^^^^^^^^^^^
     8 |   /**
     9 |    * Calcola il tracking delle quantità per una materia prima
    10 |    * @param materiaPrima Materia prima
ERROR in src/features/pianificazione/utils/calculations.utils.ts:4:36
TS2307: Cannot find module './ingredientMatching.utils' or its corresponding type declarations.
    2 | import { IRicetta } from '../types/ricette.types';
    3 | import { ISuggerimento, ILavorazioneParcheggiata } from '../types/lavorazioni.types';
  > 4 | import { ingredientMatching } from './ingredientMatching.utils';
      |                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 |
    6 | /**
    7 |  * Utility per calcoli di pianificazione