import { useState, useCallback, useEffect } from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { useCoolingCalculator, FoodType } from './useCoolingCalculator';
import { Abbattimento as BaseAbbattimento, StatoAbbattimento } from '../../../../../types/models.types';

// Definisci i tipi necessari
interface TemperatureReading {
  timestamp: string;
  temperatura: number;
}

// Estendere il tipo base con le proprietà aggiuntive necessarie
export interface AbbattimentoEsteso extends BaseAbbattimento {
  tipoAlimento?: FoodType;
  tipoAbbattimento?: 'positivo' | 'negativo';
  readings?: TemperatureReading[];
  tempoResiduoStimato?: number | null;
  dataFineStimata?: string | null;
}

export const useAbbattimentoManager = () => {
  const {
    data: { lavorazione },
    actions
  } = useLavorazioneContext();
  
  const [abbattimento, setAbbattimento] = useState<AbbattimentoEsteso | null>(null);
  const [temperatureReadings, setTemperatureReadings] = useState<TemperatureReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Integrazione con il calcolatore di raffreddamento
  const {
    coolingData,
    addTemperatureReading: addCoolingReading,
    formatTime,
    suggestFoodType
  } = useCoolingCalculator(
    abbattimento?.temperaturaIniziale,
    abbattimento?.temperaturaFinale,
    abbattimento?.tipoAlimento || 'MEDIUM_SOLID',
    abbattimento?.inizio ? new Date(abbattimento.inizio) : undefined
  );
  
  // Carica i dati dell'abbattimento dalla lavorazione
  useEffect(() => {
    if (lavorazione?.abbattimento) {
      const abbattimentoData = lavorazione.abbattimento as unknown as AbbattimentoEsteso;
      setAbbattimento(abbattimentoData);
      
      // Se hai già letture salvate nella lavorazione
      if (abbattimentoData.readings) {
        setTemperatureReadings(abbattimentoData.readings);
      } else if (abbattimentoData.temperaturaIniziale) {
        // Crea almeno una lettura iniziale basata sulla temperatura iniziale
        if (abbattimentoData.inizio) {
          setTemperatureReadings([{
            timestamp: abbattimentoData.inizio.toString(),
            temperatura: abbattimentoData.temperaturaIniziale
          }]);
        }
      }
    } else {
      setAbbattimento(null);
      setTemperatureReadings([]);
    }
  }, [lavorazione]);
  
  // Funzione per avviare l'abbattimento
  const startAbbattimento = useCallback(async (data: {
    temperaturaIniziale: number;
    temperaturaFinale: number;
    addetto: string;
    tipoAlimento?: FoodType;
    tipoAbbattimento?: 'positivo' | 'negativo';
  }) => {
    if (!lavorazione) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Determina il tipo di alimento se non specificato
      const tipoAlimento = data.tipoAlimento || 
                          suggestFoodType(data.temperaturaIniziale, data.temperaturaFinale);
      
      // Crea un nuovo oggetto abbattimento
      const nuovoAbbattimento: AbbattimentoEsteso = {
        stato: StatoAbbattimento.IN_CORSO,
        inizio: new Date().toISOString(),
        temperaturaIniziale: data.temperaturaIniziale,
        temperaturaFinale: data.temperaturaFinale,
        addetto: data.addetto,
        tipoAlimento: tipoAlimento,
        tipoAbbattimento: data.tipoAbbattimento || 
                        (data.temperaturaFinale < 0 ? 'negativo' : 'positivo')
      };
      
      // Aggiorna lo stato locale
      setAbbattimento(nuovoAbbattimento);
      setTemperatureReadings([{
        timestamp: nuovoAbbattimento.inizio.toString(),
        temperatura: data.temperaturaIniziale
      }]);
      
      // Salva la lavorazione con il nuovo abbattimento
      await actions.handleSave({
        ...lavorazione,
        abbattimento: nuovoAbbattimento
      });
      
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Errore durante l\'avvio dell\'abbattimento');
      console.error('Errore durante l\'avvio dell\'abbattimento', error);
    } finally {
      setLoading(false);
    }
  }, [lavorazione, actions, suggestFoodType]);
  
  // Funzione per completare l'abbattimento
  const completeAbbattimento = useCallback(async (temperaturaFinale: number) => {
    if (!lavorazione || !abbattimento) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Calcola il tempo totale in minuti
      const inizio = abbattimento.inizio ? new Date(abbattimento.inizio) : new Date();
      const fine = new Date();
      const tempoTotaleMinuti = Math.floor((fine.getTime() - inizio.getTime()) / (1000 * 60));
      
      // Aggiorna l'oggetto abbattimento
      const abbattimentoCompletato: AbbattimentoEsteso = {
        ...abbattimento,
        stato: StatoAbbattimento.COMPLETATO,
        fine: fine.toISOString(),
        temperaturaFinale,
        tempoTotale: tempoTotaleMinuti
      };
      
      // Aggiungi l'ultima lettura della temperatura
      const updatedReadings = [
        ...temperatureReadings,
        {
          timestamp: fine.toISOString(),
          temperatura: temperaturaFinale
        }
      ];
      
      // Aggiorna lo stato locale
      setAbbattimento(abbattimentoCompletato);
      setTemperatureReadings(updatedReadings);
      
      // Salva la lavorazione con l'abbattimento completato
      await actions.handleSave({
        ...lavorazione,
        abbattimento: {
          ...abbattimentoCompletato,
          readings: updatedReadings
        } as unknown as BaseAbbattimento
      });
      
    } catch (error) {
      setError(typeof error === 'string' ? error : 'Errore durante il completamento dell\'abbattimento');
      console.error('Errore durante il completamento dell\'abbattimento', error);
    } finally {
      setLoading(false);
    }
  }, [lavorazione, abbattimento, temperatureReadings, actions]);
  
  // Funzione per registrare una nuova lettura della temperatura
  const registerTemperatureReading = useCallback(async (temperatura: number) => {
    if (!lavorazione || !abbattimento || abbattimento.stato !== StatoAbbattimento.IN_CORSO) return;
    
    try {
      // Crea una nuova lettura
      const newReading = {
        timestamp: new Date().toISOString(),
        temperatura
      };
      
      // Aggiorna le letture locali
      const updatedReadings = [...temperatureReadings, newReading];
      setTemperatureReadings(updatedReadings);
      
      // Utilizza il calcolatore per aggiornare le stime
      const predictionResult = addCoolingReading(temperatura);
      const estimatedTimeRemaining = predictionResult?.remainingTime || null;
      
      // Aggiornare l'abbattimento con la nuova stima
      const updatedAbbattimento: AbbattimentoEsteso = {
        ...abbattimento,
        readings: updatedReadings,
        tempoResiduoStimato: estimatedTimeRemaining,
        dataFineStimata: predictionResult?.estimatedCompletion?.toISOString()
      };
      
      // Aggiorna lo stato locale
      setAbbattimento(updatedAbbattimento);
      
      // Salva nel backend solo le letture, non le stime
      // Questo evita troppe chiamate API ma mantiene i dati essenziali sincronizzati
      await actions.handleSave({
        ...lavorazione,
        abbattimento: {
          ...abbattimento,
          readings: updatedReadings,
          tempoResiduoStimato: estimatedTimeRemaining,
          dataFineStimata: predictionResult?.estimatedCompletion?.toISOString()
        } as unknown as BaseAbbattimento
      });
      
    } catch (error) {
      console.error('Errore durante la registrazione della temperatura', error);
    }
  }, [lavorazione, abbattimento, temperatureReadings, addCoolingReading, actions]);
  
  // Funzione per controllare e aggiornare lo stato di abbattimento
  const checkAbbattimentoStatus = useCallback(() => {
    if (!abbattimento || abbattimento.stato !== StatoAbbattimento.IN_CORSO) return;
    
    // Se abbiamo una temperatura target e l'ultima lettura è <= della temperatura target
    if (abbattimento.temperaturaFinale && temperatureReadings.length > 0) {
      const lastReading = temperatureReadings[temperatureReadings.length - 1];
      if (lastReading.temperatura <= abbattimento.temperaturaFinale) {
        // Suggeriamo di completare l'abbattimento
        return {
          canComplete: true,
          message: `Temperatura target raggiunta (${lastReading.temperatura}°C)`
        };
      }
    }
    
    // Controlla il tempo trascorso
    if (abbattimento.inizio) {
      const startTime = new Date(abbattimento.inizio).getTime();
      const now = Date.now();
      const elapsedMinutes = Math.floor((now - startTime) / (1000 * 60));
      
      // Se sono passati più di 90 minuti, suggeriamo di verificare
      if (elapsedMinutes > 90) {
        return {
          shouldCheck: true,
          message: `Abbattimento in corso da ${elapsedMinutes} minuti. Verificare la temperatura.`
        };
      }
    }
    
    return { inProgress: true };
  }, [abbattimento, temperatureReadings]);

  // Ritorna tutte le funzioni e gli stati necessari
  return {
    abbattimento,
    temperatureReadings,
    loading,
    error,
    coolingData,
    formatTime,
    startAbbattimento,
    completeAbbattimento,
    registerTemperatureReading,
    checkAbbattimentoStatus
  };
};
