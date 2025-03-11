import { useState, useCallback, useEffect } from 'react';
import { useAbbattimentoManager } from './useAbbattimentoManager';
import { StatoAbbattimento } from '../../../../../types/models.types';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { FoodType } from './useCoolingCalculator';

// Definisci l'interfaccia per la valutazione
export interface ValutazioneAbbattimento {
  valutazione: 'ottimale' | 'veloce' | 'lento';
  titoloValutazione: string;
  messaggioValutazione: string;
}

// Esportiamo l'interfaccia per renderla riutilizzabile
export interface FormDataAbbattimento {
  stato: StatoAbbattimento;
  inizio?: string | Date;
  fine?: string | Date;
  temperaturaIniziale?: number;
  temperaturaFinale?: number;
  tempoTotale?: number;
  addetto?: string;
  verificaTemperatura?: boolean;
  responsabileVerifica?: string;
  tipoAlimento?: FoodType;
  tipoAbbattimento?: 'positivo' | 'negativo';
  note?: string;
  readings?: Array<{timestamp: string, temperatura: number}>;
  tempoResiduoStimato?: number | null;
  dataFineStimata?: string | null;
}

export const useAbbattimento = () => {
  // Ottieni accesso agli operatori dalla lavorazione context
  const { data: { collections } } = useLavorazioneContext();
  
  // Usa l'hook di base per le operazioni CRUD
  const {
    abbattimento,
    temperatureReadings,
    loading,
    error,
 
    startAbbattimento,
    completeAbbattimento,
    registerTemperatureReading
  } = useAbbattimentoManager();
  
  // Stati locali UI
  const [isEditing, setIsEditing] = useState(false);
  const [newTemperature, setNewTemperature] = useState('');
  
  // Utilizziamo l'interfaccia FormDataAbbattimento per tipizzare formData
  const [formData, setFormData] = useState<FormDataAbbattimento>({
    stato: StatoAbbattimento.NON_INIZIATO,
    temperaturaIniziale: undefined,
    temperaturaFinale: undefined,
    addetto: '',
    verificaTemperatura: false,
    responsabileVerifica: '',
    note: '',
    tipoAlimento: 'MEDIUM_SOLID',
    tipoAbbattimento: 'positivo'
  });
  
  // Lista operatori disponibili (dal context)
  const operatori = collections?.quantityTypes?.map(qt => qt.name) || [];  
  
  // Aggiorna il form data quando cambiano i dati dell'abbattimento
  useEffect(() => {
    if (abbattimento) {
      // Convertiamo l'abbattimento ricevuto in FormDataAbbattimento
      setFormData({
        ...abbattimento,
        stato: abbattimento.stato as StatoAbbattimento,
        tipoAlimento: abbattimento.tipoAlimento || 'MEDIUM_SOLID',
        tipoAbbattimento: abbattimento.tipoAbbattimento || 'positivo'
      });
    }
  }, [abbattimento]);
  
  // Calcola la durata stimata utilizzando il calcolatore avanzato
  const durataStimata = useCallback(() => {
    // Se abbiamo il dato abbattimento con tempoResiduoStimato, lo utilizziamo
    if (abbattimento?.tempoResiduoStimato) {
      return abbattimento.tempoResiduoStimato;
    }
    
    // Se l'abbattimento è completato, usiamo il tempo totale effettivo
    if (abbattimento?.tempoTotale && abbattimento.stato === 'completato') {
      return abbattimento.tempoTotale;
    }
    
    // Se non abbiamo dati specifici, calcoliamo con un metodo basato su standard HACCP
    if (!formData.temperaturaIniziale || !formData.temperaturaFinale) return 0;
    
    // Determina il tipo di abbattimento
    const isAbbattimentoNegativo = formData.temperaturaFinale < 0;
    
    // Calcola un valore proporzionale basato su standard HACCP
    const deltaTemp = formData.temperaturaIniziale - formData.temperaturaFinale;
    const tempoBilanciato = Math.min(90, deltaTemp * 1.5);
    
    // Per abbattimento negativo (congelamento), servono tempi più lunghi
    return isAbbattimentoNegativo 
      ? Math.min(240, tempoBilanciato * 2.5) // Max 4 ore per abbattimento negativo
      : Math.min(90, tempoBilanciato);       // Max 90 minuti per abbattimento positivo
  }, [abbattimento, formData.temperaturaIniziale, formData.temperaturaFinale]);
  
  // Calcola la durata effettiva in minuti
  const durataEffettiva = useCallback(() => {
    if (!formData.inizio || !formData.fine) return 0;
    
    const inizio = new Date(formData.inizio);
    const fine = new Date(formData.fine);
    
    return Math.round((fine.getTime() - inizio.getTime()) / (1000 * 60));
  }, [formData.inizio, formData.fine]);
  
  // Funzione per valutare la performance dell'abbattimento
  const getValutazione = useCallback((): ValutazioneAbbattimento | null => {
    if (formData.stato !== StatoAbbattimento.COMPLETATO || !formData.tempoTotale) {
      return null;
    }
    
    const tempoStimato = durataStimata();
    const tempoEffettivo = formData.tempoTotale;
    
    // Valutazione basata sul confronto tra tempo stimato e effettivo
    if (tempoEffettivo <= tempoStimato * 0.8) {
      // Abbattimento più veloce del previsto (entro l'80% del tempo stimato)
      return {
        valutazione: 'veloce',
        titoloValutazione: 'Abbattimento Rapido',
        messaggioValutazione: 'L\'abbattimento è avvenuto più rapidamente rispetto ai tempi standard. Verifica la corretta distribuzione dell\'aria fredda.'
      };
    } else if (tempoEffettivo <= tempoStimato * 1.2) {
      // Abbattimento nei tempi previsti (+-20%)
      return {
        valutazione: 'ottimale',
        titoloValutazione: 'Abbattimento Ottimale',
        messaggioValutazione: 'L\'abbattimento è avvenuto nei tempi previsti, con una temperatura finale adeguata.'
      };
    } else {
      // Abbattimento più lento del previsto (oltre il 120% del tempo stimato)
      return {
        valutazione: 'lento',
        titoloValutazione: 'Abbattimento Lento',
        messaggioValutazione: 'L\'abbattimento ha richiesto più tempo del previsto. Verificare le condizioni dell\'abbattitore e la quantità di prodotto.'
      };
    }
  }, [formData.stato, formData.tempoTotale, durataStimata]);
  
  // Handler per i cambiamenti nei campi del form
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Gestione checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      // Per campi numerici, converti in numero se necessario
      const processedValue = (type === 'number') ? 
        (value === '' ? undefined : parseFloat(value)) : value;
      
      setFormData(prev => ({ ...prev, [name]: processedValue }));
    }
  }, []);
  
  // Formatta la durata in ore e minuti
  const formatDurata = useCallback((minuti: number): string => {
    if (!minuti && minuti !== 0) return 'N/D';
    
    const ore = Math.floor(minuti / 60);
    const minutiRimanenti = minuti % 60;
    
    if (ore > 0) {
      return `${ore}h ${minutiRimanenti}m`;
    }
    
    return `${minutiRimanenti}m`;
  }, []);
  
  // Wrapper per avviare abbattimento
  const avviaAbbattimento = useCallback(async () => {
    if (!formData.temperaturaIniziale || !formData.temperaturaFinale || !formData.addetto) {
      return false;
    }
    
    const result = await startAbbattimento({
      temperaturaIniziale: formData.temperaturaIniziale,
      temperaturaFinale: formData.temperaturaFinale,
      addetto: formData.addetto,
      tipoAlimento: formData.tipoAlimento,
      tipoAbbattimento: formData.tipoAbbattimento
    });
    
    if (result !== undefined) {
      setIsEditing(false);
      return true;
    }
    
    return false;
  }, [formData, startAbbattimento]);
  
  // Wrapper per completare abbattimento
  const completaAbbattimento = useCallback(async () => {
    if (!formData.temperaturaFinale && formData.temperaturaFinale !== 0) {
      return false;
    }
    
    const result = await completeAbbattimento(formData.temperaturaFinale);
    return result !== undefined;
  }, [formData.temperaturaFinale, completeAbbattimento]);
  
  // Wrapper per registrazione temperatura
  const registraTemperatura = useCallback(async () => {
    if (!newTemperature) return false;
    
    const temperatura = parseFloat(newTemperature);
    if (isNaN(temperatura)) return false;
    
    const result = await registerTemperatureReading(temperatura);
    
    if (result !== undefined) {
      setNewTemperature('');
      return true;
    }
    
    return false;
  }, [newTemperature, registerTemperatureReading]);
  
  // Salva modifiche generali
  const salvaModifiche = useCallback(async () => {
    const result = await Promise.resolve(true); // Placeholder per ora
    
    if (result) {
      setIsEditing(false);
    }
    
    return result;
  }, []);
  
  return {
    formData,
    loading,
    isEditing,
    operatori,
    durataStimata: durataStimata(),
    durataEffettiva: durataEffettiva(),
    temperatureReadings,
    newTemperature,
    error,
    valutazione: getValutazione(),
    formatDurata,
    setIsEditing,
    setNewTemperature,
    handleChange,
    avviaAbbattimento,
    completaAbbattimento,
    registraTemperatura,
    salvaModifiche
  };
};
