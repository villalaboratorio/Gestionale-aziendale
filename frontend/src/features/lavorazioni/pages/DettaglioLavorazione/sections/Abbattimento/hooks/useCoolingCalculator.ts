import { useState, useEffect, useCallback } from 'react';
import { FoodCoolingCalculator } from '../../../../../utils/temperature/FoodCoolingCalculator';

interface CoolingData {
  estimatedTotalTime: number | null;
  remainingTime: number | null;
  curve: Array<{time: number; temp: number}> | null;
  readings: Array<{time: number; temp: number}>;
  currentCoefficient: number;
}
export type FoodType = 'LIQUIDS' | 'LIGHT_SOLID' | 'MEDIUM_SOLID' | 'DENSE_SOLID' | 'FROZEN' | 'CUSTOM';
export const useCoolingCalculator = (
  initialTemp: number | undefined,
  targetTemp: number | undefined,
  foodType: 'LIQUIDS' | 'LIGHT_SOLID' | 'MEDIUM_SOLID' | 'DENSE_SOLID' | 'FROZEN' | 'CUSTOM' = 'MEDIUM_SOLID',
  startTime?: Date
) => {
  // Lo stato memorizzato dall'hook
  const [calculator, setCalculator] = useState<FoodCoolingCalculator | null>(null);
  const [coolingData, setCoolingData] = useState<CoolingData>({
    estimatedTotalTime: null,
    remainingTime: null,
    curve: null,
    readings: [],
    currentCoefficient: 0
  });

  // Inizializza o reinizializza il calcolatore quando i parametri cambiano
  useEffect(() => {
    if (initialTemp !== undefined && targetTemp !== undefined) {
      // Temperatura dell'abbattitore (più bassa del target per garantire il raffreddamento)
      const ambientTemp = targetTemp < 10 ? targetTemp - 5 : targetTemp - 2;
      
      try {
        const newCalculator = new FoodCoolingCalculator(initialTemp, ambientTemp, foodType);
        setCalculator(newCalculator);
        
        // Genera la curva iniziale
        const estimatedTime = newCalculator.getTimeToReachTemperature(targetTemp);
        const curve = newCalculator.generateCurveToTarget(targetTemp, 50);
        
        setCoolingData({
          estimatedTotalTime: estimatedTime,
          remainingTime: estimatedTime,
          curve: curve,
          readings: [{ time: 0, temp: initialTemp }],
          currentCoefficient: newCalculator['k'] // Accesso alla proprietà privata
        });
      } catch (error) {
        console.error('Errore durante l\'inizializzazione del calcolatore di abbattimento:', error);
      }
    }
  }, [initialTemp, targetTemp, foodType]);

  // Funzione per aggiungere una nuova lettura
  const addTemperatureReading = useCallback((temp: number) => {
    if (!calculator || !startTime) return null;
    
    try {
      // Calcola il tempo trascorso in minuti
      const now = new Date();
      const timeElapsed = (now.getTime() - startTime.getTime()) / (1000 * 60);
      
      // Aggiungi la lettura e ricalibra
      calculator.addTemperatureReading(timeElapsed, temp, true);
      
      // Aggiorna la curva e i tempi stimati
      const remainingTime = calculator.estimateRemainingTime(temp, targetTemp!);
      const newCurve = calculator.generateCurveToTarget(targetTemp!, 50);
      
      // Aggiorna lo stato
      setCoolingData(prev => ({
        ...prev,
        remainingTime: remainingTime,
        curve: newCurve,
        readings: [...prev.readings, { time: timeElapsed, temp }],
        currentCoefficient: calculator['k'] // Accesso alla proprietà privata
      }));
      
      return {
        timeElapsed,
        remainingTime,
        estimatedCompletion: remainingTime ? new Date(now.getTime() + remainingTime * 60 * 1000) : null
      };
    } catch (error) {
      console.error('Errore durante l\'aggiunta di una lettura di temperatura:', error);
      return null;
    }
  }, [calculator, startTime, targetTemp]);

  // Funzione per formattare il tempo
  const formatTime = useCallback((minutes: number | null): string => {
    return FoodCoolingCalculator.formatTime(minutes);
  }, []);

  // Recupera il tipo di alimento più adatto in base alle temperature
  const suggestFoodType = useCallback((initialTemp: number, targetTemp: number): 'LIQUIDS' | 'LIGHT_SOLID' | 'MEDIUM_SOLID' | 'DENSE_SOLID' | 'FROZEN' => {
    const deltaTemp = Math.abs(initialTemp - targetTemp);
    
    // Per abbattimento negativo (surgelazione)
    if (targetTemp < -10) {
      return 'FROZEN';
    }
    
    // Per temperature molto alte
    if (initialTemp > 100) {
      return 'LIQUIDS'; // Assume che temperature molto alte siano liquidi/salse
    }
    
    // Per abbattimento standard
    if (deltaTemp > 70) return 'LIQUIDS';
    if (deltaTemp > 50) return 'LIGHT_SOLID';
    if (deltaTemp > 30) return 'MEDIUM_SOLID';
    return 'DENSE_SOLID';
  }, []);

  return {
    coolingData,
    addTemperatureReading,
    formatTime,
    suggestFoodType,
    isInitialized: !!calculator
  };
};
