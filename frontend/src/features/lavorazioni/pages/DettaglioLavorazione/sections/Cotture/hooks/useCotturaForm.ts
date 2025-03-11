import * as React from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { StatoCottura, TipoCottura, Cottura } from '../../../../../types/models.types';
import { cotturaUtils } from '../utils/cotturaUtils';

type FormErrors = Record<string, string>;

interface SuggestedValues {
  tipoCotturaId?: string;
  temperatura?: number;
  tempoCottura?: number;
}

interface CotturaFormData {
  tipoCotturaId: string;
  tipoCottura: TipoCottura | null;
  temperatura: string | number;
  tempoCottura: string | number;
  addetto: string;
  stato: StatoCottura;
}

interface UseCotturaFormProps {
  cottura: Cottura | null;
  isNew: boolean;
  onSave: (cotturaData: Cottura) => void;
  tipiCottura: TipoCottura[];
}

/**
 * Estrae correttamente tempoCottura che potrebbe essere un oggetto
 * Gestisce vari formati in cui potrebbe arrivare il tempo di cottura
 */
const extractTempoCottura = (cotturaObj: any): number => {
  if (!cotturaObj) return 0;
  
  // Se è un numero diretto
  if (typeof cotturaObj.tempoCottura === 'number') return cotturaObj.tempoCottura;
  
  // Se è una stringa numerica
  if (typeof cotturaObj.tempoCottura === 'string') {
    const parsed = parseInt(cotturaObj.tempoCottura, 10);
    if (!isNaN(parsed)) return parsed;
  }
  
  // Se è un oggetto, cerca di estrarre il valore specifico
  if (typeof cotturaObj.tempoCottura === 'object' && cotturaObj.tempoCottura !== null) {
    console.log('TempoCottura è un oggetto:', cotturaObj.tempoCottura);
    
    // Prova a trovare una proprietà di valore numerico
    const candidati = ['value', 'durata', 'seconds', 'tempoCottura'];
    for (const key of candidati) {
      if (typeof cotturaObj.tempoCottura[key] === 'number') {
        return cotturaObj.tempoCottura[key];
      }
    }
    
    // Se non troviamo proprietà specifiche, proviamo a vedere se l'oggetto stesso è convertibile
    if (cotturaObj.tempoCottura.toString && !isNaN(Number(cotturaObj.tempoCottura))) {
      return Number(cotturaObj.tempoCottura);
    }
  }
  
  // Fallback ai campi alternativi
  if (typeof cotturaObj.tempoCotturaFinale === 'number') return cotturaObj.tempoCotturaFinale;
  if (typeof cotturaObj.tempoMedioCottura === 'number') return cotturaObj.tempoMedioCottura;
  
  // Ultimo fallback: controlla tempoMedio se esiste nell'oggetto tipoCottura
  if (cotturaObj.tipoCottura && typeof cotturaObj.tipoCottura === 'object') {
    if (typeof cotturaObj.tipoCottura.tempoMedio === 'number') return cotturaObj.tipoCottura.tempoMedio;
    if (typeof cotturaObj.tipoCottura.tempoMedioCottura === 'number') return cotturaObj.tipoCottura.tempoMedioCottura;
  }
  
  console.warn('Non è stato possibile estrarre il tempo di cottura:', cotturaObj);
  return 0;
};

/**
 * Estrae correttamente l'addetto dalla cottura
 */
const extractAddetto = (cotturaObj: any, defaultOperatore: string = ''): string => {
  if (!cotturaObj) return defaultOperatore;
  
  // Prova diverse proprietà dove potrebbe essere memorizzato l'addetto
  if (typeof cotturaObj.addetto === 'string' && cotturaObj.addetto.trim() !== '') {
    return cotturaObj.addetto;
  }
  
  if (typeof cotturaObj.operatore === 'string' && cotturaObj.operatore.trim() !== '') {
    return cotturaObj.operatore;
  }
  
  // Se l'addetto è un oggetto, prova a estrarre la proprietà nome
  if (typeof cotturaObj.addetto === 'object' && cotturaObj.addetto !== null) {
    if (typeof cotturaObj.addetto.nome === 'string') return cotturaObj.addetto.nome;
    if (typeof cotturaObj.addetto.name === 'string') return cotturaObj.addetto.name;
  }
  
  return defaultOperatore;
};

export const useCotturaForm = ({ cottura, isNew, onSave, tipiCottura }: UseCotturaFormProps) => {
  const { data: { lavorazione, collections } } = useLavorazioneContext();
  
  // Operatori dalle collections
  const operatori = React.useMemo(() => collections?.quantityTypes || [], [collections]);
  
  // Primo operatore disponibile come default
  const defaultOperatore = React.useMemo(() => {
    return operatori.length > 0 ? operatori[0].name : '';
  }, [operatori]);
  
  // Stati del form
  const [formData, setFormData] = React.useState<CotturaFormData>({
    tipoCotturaId: '',
    tipoCottura: null,
    temperatura: '',
    tempoCottura: '',
    addetto: '',
    stato: StatoCottura.NON_INIZIATA
  });
  
  const [suggestedValues, setSuggestedValues] = React.useState<SuggestedValues>({});
  const [errors, setErrors] = React.useState<FormErrors>({});
  
  // Inizializzazione del form
  const initializeForm = React.useCallback(() => {
    if (!lavorazione) return;
    
    console.log('Inizializzazione form cottura - isNew:', isNew, 'Cottura:', cottura);
    
    // Valori suggeriti
    let valoriConsigliati: SuggestedValues = {};
    
    // Cerca la ricetta completa nelle collections
    const ricettaCompleta = collections?.ricette?.find(r => 
      r._id === (lavorazione.ricetta?._id || '')
    );
    
    // Debug
    if (ricettaCompleta?.cotture) {
      console.log('Debug - Cotture origine:', ricettaCompleta.cotture);
    }
    
    console.log('Debug - Primo operatore disponibile:', defaultOperatore);
    
    // Trova i valori consigliati
    if (ricettaCompleta?.cotture && ricettaCompleta.cotture.length > 0) {
      console.log('Ricetta con cotture trovata:', ricettaCompleta);
      
      // Se stiamo modificando una cottura esistente
      if (cottura) {
        const tipoCotturaId = cottura.tipoCottura._id;
        const cotturaConsigliata = ricettaCompleta.cotture.find(c => {
          const ctId = typeof c.tipoCottura === 'object' 
            ? c.tipoCottura._id 
            : c.tipoCottura;
          return ctId === tipoCotturaId;
        });
        
        if (cotturaConsigliata) {
          // Usa le funzioni di estrazione per normalizzare i valori
          const temperatura = cotturaUtils.getTemperatura(cotturaConsigliata);
          // Estrai il tempo di cottura con la nuova funzione helper
          const tempoEstratto = extractTempoCottura(cotturaConsigliata);
          const tempoCottura = cotturaUtils.secondiToMinuti(tempoEstratto);
          
          console.log(`Debug - Tempo cottura per ${cotturaUtils.getNome(cottura.tipoCottura)}:`, cotturaConsigliata);
          
          valoriConsigliati = {
            tipoCotturaId: tipoCotturaId,
            temperatura: temperatura,
            tempoCottura: tempoCottura
          };
        }
      }
    }
    
    setSuggestedValues(valoriConsigliati);
    
    // Per modifica di esistente
    if (cottura) {
      const tipoCotturaId = cottura.tipoCottura?._id || '';
      const tipoCotturaObj = cotturaUtils.findTipoCotturaById(tipoCotturaId, tipiCottura);
      
      // Estrai i valori usando le utility e le funzioni helper
      const temperatura = cotturaUtils.getTemperatura(cottura);
      const tempoEstratto = extractTempoCottura(cottura);
      const tempoCottura = cotturaUtils.secondiToMinuti(tempoEstratto);
      const addetto = extractAddetto(cottura, defaultOperatore);
      
      console.log('Dati estratti per modifica cottura:', { 
        temperatura, 
        tempoCottura, 
        addetto,
        stato: cottura.stato 
      });
      
      setFormData({
        tipoCotturaId: tipoCotturaId,
        tipoCottura: tipoCotturaObj,
        temperatura: temperatura,
        tempoCottura: tempoCottura,
        addetto: addetto,
        stato: cottura.stato || StatoCottura.NON_INIZIATA
      });
    } 
    // Per nuova cottura
    else if (isNew && lavorazione.ricetta) {
      // Logica per nuova cottura da ricetta
      const ricettaCompleta = collections?.ricette?.find(r => r._id === lavorazione.ricetta._id);
      
      if (ricettaCompleta?.cotture?.length > 0) {
        const cotturaRicetta = ricettaCompleta.cotture[0];
        const tipoCotturaId = typeof cotturaRicetta.tipoCottura === 'object' 
          ? cotturaRicetta.tipoCottura._id 
          : cotturaRicetta.tipoCottura;
          
        const tipoCotturaObj = cotturaUtils.findTipoCotturaById(tipoCotturaId, tipiCottura);
        
        // Estrai i valori usando le utility e le funzioni helper
        const temperatura = cotturaUtils.getTemperatura(cotturaRicetta);
        const tempoEstratto = extractTempoCottura(cotturaRicetta);
        const tempoCottura = cotturaUtils.secondiToMinuti(tempoEstratto);
        const addetto = extractAddetto(cotturaRicetta, defaultOperatore);
        
        console.log('Dati estratti per nuova cottura da ricetta:', { 
          temperatura, 
          tempoCottura, 
          addetto 
        });
        
        setFormData({
          tipoCotturaId: tipoCotturaId,
          tipoCottura: tipoCotturaObj,
          temperatura: temperatura,
          tempoCottura: tempoCottura,
          addetto: addetto,
          stato: StatoCottura.NON_INIZIATA
        });
      } 
      // Default: usa il primo tipo cottura disponibile
      else {
        console.log('Nessuna cottura trovata nella ricetta, uso valori default');
        const primoTipoCottura = tipiCottura.length > 0 ? tipiCottura[0] : null;
        
        setFormData({
          tipoCotturaId: primoTipoCottura ? primoTipoCottura._id : '',
          tipoCottura: primoTipoCottura,
          temperatura: 180,
          tempoCottura: 60, // 60 minuti default
          addetto: defaultOperatore,
          stato: StatoCottura.NON_INIZIATA
        });
      }
    }
  }, [cottura, isNew, lavorazione, collections, tipiCottura, defaultOperatore]);
  
  // Inizializza il form quando i dati sono disponibili
  React.useEffect(() => {
    initializeForm();
  }, [initializeForm]);
  
  // Gestione input form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'tipoCottura') {
      // Quando cambia il tipo cottura, aggiorniamo sia l'ID che l'oggetto completo
      const tipoCotturaObj = cotturaUtils.findTipoCotturaById(value, tipiCottura);
      
      setFormData(prev => ({
        ...prev,
        tipoCotturaId: value,
        tipoCottura: tipoCotturaObj
      }));
    } else {
      // Per gli altri campi, aggiorniamo normalmente
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Rimuovi eventuali errori quando l'utente corregge un campo
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Validazione form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.tipoCotturaId) {
      newErrors.tipoCottura = 'Seleziona un tipo di cottura';
    }
    
    const temp = Number(formData.temperatura);
    if (isNaN(temp) || temp < 0 || temp > 500) {
      newErrors.temperatura = 'Temperatura deve essere tra 0 e 500°C';
    }
    
    const tempo = Number(formData.tempoCottura);
    if (isNaN(tempo) || tempo <= 0 || tempo > 1440) {
      newErrors.tempoCottura = 'Tempo cottura deve essere tra 1 e 1440 minuti (24 ore)';
    }
    
    if (!formData.addetto) {
      newErrors.addetto = 'Seleziona un addetto';
    }
    
    console.log('Errori validazione:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit del form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form sottomesso, validazione...');
    
    if (!validateForm()) {
      console.log('Validazione fallita, interrompo salvataggio');
      return;
    }
    
    // Verifica il tipo cottura
    let tipoCotturaOggetto = formData.tipoCottura;
    if (!tipoCotturaOggetto && formData.tipoCotturaId) {
        tipoCotturaOggetto = cotturaUtils.findTipoCotturaById(formData.tipoCotturaId, tipiCottura);
      }
      
      if (!tipoCotturaOggetto) {
        console.error('Tipo cottura non valido');
        setErrors(prev => ({
          ...prev,
          tipoCottura: 'Tipo cottura non valido'
        }));
        return;
      }
      
      // Convertire tempoCottura da minuti a secondi usando cotturaUtils
      const tempoInSecondi = cotturaUtils.minutiToSecondi(formData.tempoCottura);
      
      // Preparazione dell'oggetto cottura assicurandoci che tutti i campi abbiano il formato corretto
      const cotturaData = {
        ...(cottura || {}),  // Manteniamo gli altri dati se è una modifica
        tipoCottura: tipoCotturaOggetto,
        // Salviamo sia temperaturaTarget che temperatura per compatibilità
        temperaturaTarget: Number(formData.temperatura),
        temperatura: Number(formData.temperatura),
        // Salviamo il tempo cottura sempre come numero di secondi
        tempoCottura: tempoInSecondi,
        // Addetto normalizzato
        addetto: formData.addetto.trim(),
        // Stato non modificabile tramite form per cotture esistenti
        stato: cottura ? cottura.stato : StatoCottura.NON_INIZIATA
      };
      
      console.log('Salvataggio cottura con dati finali:', cotturaData);
      onSave(cotturaData as Cottura);
    };
    
    return {
      formData,
      suggestedValues,
      errors,
      operatori,
      handleChange,
      handleSubmit
    };
  };
  