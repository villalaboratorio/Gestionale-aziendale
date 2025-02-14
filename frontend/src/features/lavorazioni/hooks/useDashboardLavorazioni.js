import { useReducer, useCallback, useEffect, useRef } from 'react';
import LavorazioneApi from '../services/LavorazioneApi';
import { fetchWithRetry } from '../../../utils/fetchUtils';

const initialState = {
    data: {
        lavorazioni: [],
        stats: {
            inAttesa: 0,
            inLavorazione: 0,
            completate: 0,
            totali: 0
        },
        pagination: {
            total: 0,
            pages: 1,
            currentPage: 1,
            pageSize: 10,
            totalPages: 1  // Aggiungiamo un valore di default
        }
    },
    filters: {
        search: '',
        stato: '',
        priorita: '',
        dataInizio: '',
        dataFine: '',
        cliente: ''
    },
    pagination: {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1
    },
    loading: false,
    error: null,
    isStale: true
};

const dashboardReducer = (state, action) => {
    console.group('Dashboard Reducer:', action.type);
    console.log('Stato precedente:', state);
    console.log('Action:', action);

    let newState;
    switch (action.type) {
        case 'SET_LOADING':
            if (state.loading === action.payload) return state;
            newState = { ...state, loading: action.payload };
            break;

        case 'SET_DATA':
            newState = {
                ...state,
                data: {
                    lavorazioni: action.payload.lavorazioni || [],
                    stats: action.payload.stats || initialState.data.stats,
                    pagination: {
                        ...initialState.data.pagination,  // Valori di default
                        ...action.payload.pagination      // Valori dal server
                    }
                },
                loading: false,
                error: null,
                isStale: false
            };
            break;

        case 'UPDATE_FILTERS':
            newState = {
                ...state,
                filters: { ...state.filters, ...action.payload },
                pagination: { ...state.pagination, currentPage: 1 },
                isStale: true
            };
            break;

        case 'UPDATE_PAGINATION':
            if (state.pagination.currentPage === action.payload) return state;
            newState = {
                ...state,
                pagination: { ...state.pagination, currentPage: action.payload },
                isStale: true
            };
            break;

        case 'SET_ERROR':
            newState = {
                ...state,
                error: action.payload,
                loading: false
            };
            break;

        case 'MARK_STALE':
            newState = { ...state, isStale: true };
            break;

        default:
            newState = state;
    }

    console.log('Nuovo stato:', newState);
    console.groupEnd();
    return newState;
};
const useDashboardLavorazioni = () => {
    const [state, dispatch] = useReducer(dashboardReducer, initialState);
    const abortControllerRef = useRef(null);

    const fetchData = useCallback(async () => {
        if (!state.isStale && !state.error) return;

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        dispatch({ type: 'SET_LOADING', payload: true });

        try {
            const response = await fetchWithRetry(() => 
                LavorazioneApi.getDashboardLavorazioni(
                    state.filters,
                    state.pagination.currentPage,
                    state.pagination.pageSize,
                    { signal: abortControllerRef.current.signal }
                )
            );

            const normalizedData = {
                lavorazioni: response.lavorazioni || [],
                stats: response.stats || initialState.data.stats,
                pagination: response.pagination || initialState.data.pagination
            };

            dispatch({ type: 'SET_DATA', payload: normalizedData });
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Errore nel caricamento dashboard:', error);
                dispatch({ type: 'SET_ERROR', payload: error.message });
            }
        }
    }, [state.filters, state.pagination.currentPage, state.pagination.pageSize, state.isStale, state.error]);

    const updateFilters = useCallback((newFilters) => {
        dispatch({ type: 'UPDATE_FILTERS', payload: newFilters });
    }, []);

    const updatePagination = useCallback((newPage) => {
        dispatch({ type: 'UPDATE_PAGINATION', payload: newPage });
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(fetchData, 300);
        
        return () => {
            clearTimeout(timeoutId);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchData]);

    return {
        data: state.data,
        filters: state.filters,
        pagination: state.pagination,
        loading: state.loading,
        error: state.error,
        actions: {
            updateFilters,
            updatePagination,
            refresh: () => dispatch({ type: 'MARK_STALE' })
        }
    };
};

export default useDashboardLavorazioni;
  export const batchRequests = requests => {
      return Promise.all(requests.map(req => 
          new Promise(resolve => setTimeout(resolve, 100))
          .then(() => req())
      ));
  };

 
