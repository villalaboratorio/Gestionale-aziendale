# 1. Architettura

## Frontend
### Tecnologie Core
- **React 18+**: Framework UI principale
- **Styled Components**: CSS-in-JS per styling modulare
- **React Router 6**: Gestione routing e navigazione
- **Axios**: Client HTTP per chiamate API

### Struttura Progetto
frontend/ ├── src/ │ ├── features/ │ │ └── lavorazioni/ │ │ ├── components/ │ │ │ ├── atoms/ │ │ │ ├── dashboard/ │ │ │ └── dettaglio/ │ │ ├── hooks/ │ │ ├── services/ │ │ └── pages/ │ ├── styles/ │ └── utils/



## API Integration

// Mapping endpoints-frontend
const API = {
    getLavorazione: (id) => `/api/dettaglio-lavorazione/${id}`,
    updateStato: (id) => `/api/dettaglio-lavorazione/${id}/stato`,
    updateFase: (id) => `/api/dettaglio-lavorazione/${id}/fasi`,
    updateHACCP: (id) => `/api/dettaglio-lavorazione/${id}/haccp`,
    getDashboard: () => '/api/dashboard/stats'
}


### Pattern Architetturali
1. **Feature-First**: Organizzazione codice per funzionalità
2. **Atomic Design**: Componenti organizzati per complessità
3. **Custom Hooks**: Logica di business riutilizzabile
4. **Service Layer**: Centralizzazione chiamate API

### Gestione Stato
- **Local State**: useState per stato componente
- **Custom Hooks**: useDashboardLavorazioni per logica business
- **Props Drilling**: Minimizzato tramite composizione componenti

### Performance
- **Code Splitting**: Caricamento lazy dei moduli
- **Memoization**: useCallback e useMemo per ottimizzazioni
- **Virtual Scrolling**: Per liste lunghe
