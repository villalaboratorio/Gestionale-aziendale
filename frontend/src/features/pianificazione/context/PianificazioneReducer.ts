import { IPianificazioneState } from '../types/pianificazione.types';
import { PianificazioneAction } from './PianificazioneContext';

export const pianificazioneReducer = (
  state: IPianificazioneState,
  action: PianificazioneAction
): IPianificazioneState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        materiePrime: {
          ...state.materiePrime,
          loading: action.payload.materiePrime !== undefined 
            ? action.payload.materiePrime 
            : state.materiePrime.loading
        },
        suggerimenti: {
          ...state.suggerimenti,
          loading: action.payload.suggerimenti !== undefined 
            ? action.payload.suggerimenti 
            : state.suggerimenti.loading
        },
        lavorazioni: {
          ...state.lavorazioni,
          loading: action.payload.lavorazioni !== undefined 
            ? action.payload.lavorazioni 
            : state.lavorazioni.loading
        }
      };

    case 'SET_ERROR':
      return {
        ...state,
        materiePrime: {
          ...state.materiePrime,
          error: action.payload.materiePrime !== undefined 
            ? action.payload.materiePrime 
            : state.materiePrime.error
        },
        suggerimenti: {
          ...state.suggerimenti,
          error: action.payload.suggerimenti !== undefined 
            ? action.payload.suggerimenti 
            : state.suggerimenti.error
        },
        lavorazioni: {
          ...state.lavorazioni,
          error: action.payload.lavorazioni !== undefined 
            ? action.payload.lavorazioni 
            : state.lavorazioni.error
        }
      };

    case 'SET_MATERIE_PRIME':
      return {
        ...state,
        materiePrime: {
          ...state.materiePrime,
          items: action.payload,
          error: null
        }
      };

    case 'SET_SELECTED_MATERIA_PRIMA':
      return {
        ...state,
        materiePrime: {
          ...state.materiePrime,
          selected: action.payload
        },
        // Reset dello stato suggerimenti quando si cambia materia prima
        suggerimenti: {
          ...state.suggerimenti,
          items: [],
          gruppi: {},
          error: null
        }
      };

    case 'SET_SUGGERIMENTI':
      return {
        ...state,
        suggerimenti: {
          ...state.suggerimenti,
          items: action.payload.suggerimenti,
          gruppi: action.payload.gruppi,
          error: null
        }
      };

    case 'SET_SELECTED_GRUPPO':
      return {
        ...state,
        suggerimenti: {
          ...state.suggerimenti,
          selectedGruppo: action.payload
        }
      };

    case 'UPDATE_SUGGERIMENTO':
      return {
        ...state,
        suggerimenti: {
          ...state.suggerimenti,
          items: state.suggerimenti.items.map(suggerimento => {
            if (suggerimento.ricetta._id === action.payload.ricettaId) {
              return {
                ...suggerimento,
                [action.payload.field]: action.payload.value,
                // Se aggiorniamo le porzioni, ricalcoliamo la quantità
                ...(action.payload.field === 'porzioniSelezionate' ? {
                  quantitaCalcolata: 
                    (action.payload.value * (suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione)) / 1000
                } : {}),
                // Se aggiorniamo i grammi per porzione, ricalcoliamo la quantità
                ...(action.payload.field === 'grammiPerPorzioneSelezionati' ? {
                  quantitaCalcolata: 
                    ((suggerimento.porzioniSelezionate || 0) * action.payload.value) / 1000
                } : {})
              };
            }
            return suggerimento;
          }),
          // Aggiorniamo anche i gruppi
          gruppi: Object.fromEntries(
            Object.entries(state.suggerimenti.gruppi).map(([key, items]) => [
              key,
              items.map(suggerimento => {
                if (suggerimento.ricetta._id === action.payload.ricettaId) {
                  return {
                    ...suggerimento,
                    [action.payload.field]: action.payload.value,
                    // Stessa logica di ricalcolo anche nei gruppi
                    ...(action.payload.field === 'porzioniSelezionate' ? {
                      quantitaCalcolata: 
                        (action.payload.value * (suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione)) / 1000
                    } : {}),
                    ...(action.payload.field === 'grammiPerPorzioneSelezionati' ? {
                      quantitaCalcolata: 
                        ((suggerimento.porzioniSelezionate || 0) * action.payload.value) / 1000
                    } : {})
                  };
                }
                return suggerimento;
              })
            ])
          )
        }
      };

    case 'ADD_LAVORAZIONE':
      return {
        ...state,
        lavorazioni: {
          ...state.lavorazioni,
          parcheggiate: [...state.lavorazioni.parcheggiate, action.payload],
          error: null
        }
      };

    case 'UPDATE_LAVORAZIONE':
      return {
        ...state,
        lavorazioni: {
          ...state.lavorazioni,
          parcheggiate: state.lavorazioni.parcheggiate.map(lavorazione => 
            lavorazione.id === action.payload.id
              ? { ...lavorazione, ...action.payload.updatedData }
              : lavorazione
          ),
          error: null
        }
      };

    case 'REMOVE_LAVORAZIONE':
      return {
        ...state,
        lavorazioni: {
          ...state.lavorazioni,
          parcheggiate: state.lavorazioni.parcheggiate.filter(
            lavorazione => lavorazione.id !== action.payload
          ),
          error: null
        }
      };

    case 'CLEAR_LAVORAZIONI':
      return {
        ...state,
        lavorazioni: {
          ...state.lavorazioni,
          parcheggiate: [],
          error: null
        }
      };

    case 'SET_LAVORAZIONI':
      return {
        ...state,
        lavorazioni: {
          ...state.lavorazioni,
          parcheggiate: action.payload,
          error: null
        }
      };

    case 'SET_SHOW_CONFERMA':
      return {
        ...state,
        ui: {
          ...state.ui,
          showConferma: action.payload
        }
      };

    case 'SET_FILTRO_CLIENTE':
      return {
        ...state,
        ui: {
          ...state.ui,
          filtroCliente: action.payload
        }
      };

    case 'SET_ORDINAMENTO':
      return {
        ...state,
        ui: {
          ...state.ui,
          ordinamento: action.payload
        }
      };

    case 'SET_SHOW_LAVORAZIONE_LIBERA':
      return {
        ...state,
        ui: {
          ...state.ui,
          showLavorazioneLibera: action.payload
        }
      };

    default:
      return state;
  }
};
