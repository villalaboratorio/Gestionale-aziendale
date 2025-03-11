# Documentazione del componente InfoTab

## 1. Panoramica
Il componente InfoTab gestisce le informazioni generali di una lavorazione, consentendo la visualizzazione e modifica dei dati principali.

## 2. Interfacce e Tipi

```typescript
// Interfacce per rappresentare ciò che arriva dal backend
interface BackendProcessingState {
  _id: string;
  name: string;
  description?: string;
}

interface BackendProcessingType {
  _id: string;
  name: string;
  description?: string;
}

// Rappresenta un tipo di quantità/operatore
interface QuantityType {
  _id: string;
  name: string;
  abbreviation: string;
  description?: string;
}

// Form data per i campi nel form
interface LavorazioneFormData {
  numeroScheda?: string;
  statoLavorazione?: BackendProcessingState;
  ricetta?: Ricetta;
  cliente?: Cliente;
  tipoLavorazione?: BackendProcessingType;
  operatore?: string;
  noteProduzione?: string;
  noteAllergeni?: string;
  isUrgente?: boolean;
  motivazioneUrgenza?: string;
  dataConsegnaPrevista?: string;
}

type FormFieldValue = string | BackendProcessingState | BackendProcessingType | Cliente | Ricetta | boolean | undefined;
```

## 3. Integrazione con Context
Il componente utilizza `useLavorazioneContext()` per accedere a:

- `data.lavorazione`: Dati della lavorazione corrente
- `data.collections`: Collezioni di dati (clienti, ricette, stati, tipi, quantityTypes)
- `loadingStates.operations`: Stato di caricamento delle operazioni
- `actions`: Metodi per interagire con i dati (handleSave, markTabDirty, ecc.)

```typescript
const { 
  data: { lavorazione, collections },
  loadingStates: { operations: saving },
  actions
} = useLavorazioneContext();
```

## 4. Gestione Stato Interno
```typescript
// Stato del form
const [formData, setFormData] = React.useState<LavorazioneFormData>({});
// Flag per indicare se ci sono modifiche non salvate
const [isDirty, setIsDirty] = React.useState(false);
```

## 5. Effetti e Ciclo di Vita
```typescript
// Inizializza il form quando i dati sono disponibili
React.useEffect(() => {
  if (lavorazione) {
    setFormData({
      numeroScheda: lavorazione.numeroScheda || '',
      statoLavorazione: lavorazione.statoLavorazione as unknown as BackendProcessingState,
      ricetta: lavorazione.ricetta,
      cliente: lavorazione.cliente,
      tipoLavorazione: lavorazione.tipoLavorazione as unknown as BackendProcessingType,
      operatore: lavorazione.operatore || '',
      noteProduzione: lavorazione.noteProduzione || '',
      noteAllergeni: lavorazione.noteAllergeni || '',
      isUrgente: lavorazione.isUrgente || false,
      motivazioneUrgenza: lavorazione.motivazioneUrgenza || '',
      dataConsegnaPrevista: lavorazione.dataConsegnaPrevista || ''
    });
  }
}, [lavorazione]);
```

## 6. Funzioni Principali

### 6.1 Gestione Modifiche al Form
```typescript
const handleChange = (field: keyof LavorazioneFormData, value: FormFieldValue) => {
  setFormData(prev => ({ ...prev, [field]: value }));
  setIsDirty(true);
  actions.markTabDirty('info');
};
```

### 6.2 Conversione Dati per il Backend
```typescript
const convertToStatoLavorazione = (state?: BackendProcessingState): StatoLavorazione | undefined => {
  if (!state) return undefined;
  return {
    _id: state._id,
    nome: state.name,
    codice: state._id,
    descrizione: state.description
  };
};

const convertToTipoLavorazione = (type?: BackendProcessingType): TipoLavorazione | undefined => {
  if (!type) return undefined;
  return {
    _id: type._id,
    nome: type.name
  };
};
```

### 6.3 Salvataggio Dati
```typescript
const handleSave = async () => {
  try {
    const backendData: Partial<LavorazioneType> = {
      numeroScheda: formData.numeroScheda,
      statoLavorazione: convertToStatoLavorazione(formData.statoLavorazione),
      ricetta: formData.ricetta,
      cliente: formData.cliente,
      tipoLavorazione: convertToTipoLavorazione(formData.tipoLavorazione),
      operatore: formData.operatore,
      noteProduzione: formData.noteProduzione,
      noteAllergeni: formData.noteAllergeni,
      isUrgente: formData.isUrgente,
      motivazioneUrgenza: formData.motivazioneUrgenza,
      dataConsegnaPrevista: formData.dataConsegnaPrevista
    };
    
    await actions.handleSave(backendData);
    setIsDirty(false);
    actions.markTabValid('info');
  } catch (error) {
    console.error('Errore durante il salvataggio:', error);
  }
};
```

## 7. Struttura UI
La UI è organizzata in:
- Una card principale con header e body
- Form con layout a griglia (row g-3)
- Campi divisi in colonne (col-md-6, col-12)
- Toggle per urgenza con campo motivazione condizionale
- Pulsante "Salva Modifiche" visibile solo quando ci sono modifiche non salvate

## 8. Campi del Form
- **Codice Scheda** (numeroScheda) - Input di testo
- **Stato** (statoLavorazione) - Select con opzioni da statiLavorazione
- **Ricetta** (ricetta) - Select con opzioni da ricette
- **Cliente** (cliente) - Select con opzioni da clienti
- **Tipo Lavorazione** (tipoLavorazione) - Select con opzioni da tipiLavorazione
- **Operatore** (operatore) - Select con opzioni da quantityTypes
- **Urgenza** (isUrgente) - Toggle switch
- **Motivazione Urgenza** (motivazioneUrgenza) - Textarea (visibile solo se isUrgente=true)
- **Data Consegna** (dataConsegnaPrevista) - Input date
- **Note Produzione** (noteProduzione) - Textarea
- **Note Allergeni** (noteAllergeni) - Textarea

## 9. Gestione Stati UI

### 9.1 Stato di Caricamento
```typescript
if (!collections) {
  return (
    <div className="info-tab">
      <div className="card">
        <div className="card-body text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p className="mt-3 text-muted">Caricamento dati in corso...</p>
        </div>
      </div>
    </div>
  );
}
```

### 9.2 Stato di Salvataggio
```typescript
{saving ? (
  <>
    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
    Salvataggio...
  </>
) : 'Salva Modifiche'}
```

## 10. Dipendenze Esterne

### 10.1 Modelli di Dati
- Lavorazione da ../../../../types/models.types
- StatoLavorazione da ../../../../types/models.types
- TipoLavorazione da ../../../../types/models.types
- Ricetta da ../../../../types/models.types
- Cliente da ../../../../types/models.types
- QuantityType da ../../../../types/models.types

### 10.2 Servizi e Context
- useLavorazioneContext da ../../../../store/LavorazioneContext

### 10.3 Stili
- ./InfoTab.css per stili specifici del componente

## 11. Flusso di Dati
- **Inizializzazione**: Context → formData (tramite useEffect)
- **Modifiche Utente**: UI → handleChange → formData + isDirty flag, actions.markTabDirty('info')
- **Salvataggio**: handleSave → conversione dati → actions.handleSave, reset isDirty flag, actions.markTabValid('info')

## 12. Note Tecniche
- Uso di as unknown as BackendProcessingState per gestire le incompatibilità di tipo
- Il form viene inizializzato solo quando lavorazione è disponibile
- Le modifiche vengono tracciate tramite il flag isDirty
- Il bottone di salvataggio è condizionale in base a isDirty
- Conversione dei dati per adattarsi alle API del backend
- Campo operatore popolato dinamicamente dai quantityTypes
- Validazione condizionale per motivazioneUrgenza basata sul valore di isUrgente

## 13. Possibili Miglioramenti Futuri
- Separare la logica dalla UI in componenti distinti
- Implementare validazione dei campi
- Aggiungere gestione degli errori più granulare
- Migliorare i tipi per evitare cast di tipo
- Implementare autosave
- Aggiungere conferma prima di uscire con modifiche non salvate
