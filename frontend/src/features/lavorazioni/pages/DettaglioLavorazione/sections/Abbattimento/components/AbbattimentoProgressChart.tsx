import React, { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { StatoAbbattimento } from '../../../../../types/models.types';
import {
  ChartContainer,
  EmptyStateMessage
} from './AbbattimentoProgressChart.styles';

// Definisci il tipo per una singola lettura
interface TemperatureReading {
  timestamp: string | Date;
  temperatura: number;
}

// Definisci l'interfaccia delle props compatibile con AbbattimentoEsteso
interface AbbattimentoProgressProps {
  abbattimento: {
    stato?: StatoAbbattimento;
    inizio?: string | Date;
    fine?: string | Date;
    temperaturaIniziale?: number;
    temperaturaFinale?: number;
    tempoTotale?: number;
    tipoAlimento?: string;
    tipoAbbattimento?: 'positivo' | 'negativo';
  };
  readings?: TemperatureReading[];
}

// Definisci il tipo per i punti del grafico
interface ChartDataPoint {
  time: number;
  temperatura: number;
  label: string;
}

export const AbbattimentoProgressChart: React.FC<AbbattimentoProgressProps> = ({ 
  abbattimento,
  readings = []
}) => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  
  // Genera punti per il grafico smooth, anche con poche letture
  useEffect(() => {
    if (!abbattimento || !abbattimento.temperaturaIniziale) {
      setChartData([]);
      return;
    }

    let dataPoints: ChartDataPoint[] = [];
    
    // Scenario 1: Nessuna lettura, ma abbattimento iniziato
    if (readings.length === 0 && abbattimento.inizio) {
      const startTime = new Date(abbattimento.inizio).getTime();
      
      // Punto iniziale
      dataPoints.push({
        time: 0,
        temperatura: abbattimento.temperaturaIniziale,
        label: 'Inizio'
      });
      
      // Se abbiamo una temperatura finale e l'abbattimento è completato
      if (abbattimento.temperaturaFinale !== undefined && 
          abbattimento.fine && 
          abbattimento.stato === StatoAbbattimento.COMPLETATO) {
        const endTime = new Date(abbattimento.fine).getTime();
        const durationMinutes = (endTime - startTime) / (1000 * 60);
        
        // Aggiungi punti intermedi per un grafico smooth
        for (let i = 1; i < 10; i++) {
          const progress = i / 10;
          const estimatedTemp = abbattimento.temperaturaIniziale - 
            (abbattimento.temperaturaIniziale - abbattimento.temperaturaFinale) * progress;
          
          dataPoints.push({
            time: Math.round(durationMinutes * progress),
            temperatura: Math.round(estimatedTemp * 10) / 10,
            label: ''
          });
        }
        
        // Punto finale
        dataPoints.push({
          time: Math.round(durationMinutes),
          temperatura: abbattimento.temperaturaFinale,
          label: 'Fine'
        });
      } else if (abbattimento.stato === StatoAbbattimento.IN_CORSO) {
        // Abbattimento in corso, stima il progresso
        const now = new Date().getTime();
        const elapsedMinutes = (now - startTime) / (1000 * 60);
        
        // Stima la temperatura attuale in base al target
        const targetTemp = abbattimento.temperaturaFinale || 3; // Default target 3°C se non specificato
        const elapsedProgress = Math.min(1, elapsedMinutes / (abbattimento.tempoTotale || 90));
        const currentEstimatedTemp = abbattimento.temperaturaIniziale - 
          (abbattimento.temperaturaIniziale - targetTemp) * elapsedProgress;
        
        // Aggiungi punti intermedi
        for (let i = 1; i < 10; i++) {
          const progress = i / 10;
          if (progress <= elapsedProgress) {
            const estimatedTemp = abbattimento.temperaturaIniziale - 
              (abbattimento.temperaturaIniziale - targetTemp) * progress;
            
            dataPoints.push({
              time: Math.round(elapsedMinutes * progress),
              temperatura: Math.round(estimatedTemp * 10) / 10,
              label: ''
            });
          }
        }
        
        // Punto corrente
        dataPoints.push({
          time: Math.round(elapsedMinutes),
          temperatura: Math.round(currentEstimatedTemp * 10) / 10,
          label: 'Attuale'
        });
      }
    } else if (readings.length > 0) {
      // Scenario 2: Abbiamo letture effettive
      const startTime = new Date(readings[0].timestamp).getTime();
      
      // Converti le letture in punti per il grafico
      dataPoints = readings.map((reading, index) => {
        const readingTime = new Date(reading.timestamp).getTime();
        const minutesFromStart = (readingTime - startTime) / (1000 * 60);
        
        return {
          time: Math.round(minutesFromStart),
          temperatura: reading.temperatura,
          label: index === 0 ? 'Inizio' : 
                 index === readings.length - 1 ? 'Ultima lettura' : ''
        };
      });
    }
    
    setChartData(dataPoints);
  }, [abbattimento, readings]);

  // Mostra messaggio se non ci sono dati da visualizzare
  if (!abbattimento || !abbattimento.temperaturaIniziale) {
    return (
      <EmptyStateMessage>
        Avvia un abbattimento per visualizzare il grafico di progresso
      </EmptyStateMessage>
    );
  }

  // Funzione per formattare tooltip
  const formatTooltip = (value: number,_name: string) => {
    return [`${value}°C`, 'Temperatura'];
  };

  // Funzione per formattare label nel tooltip
  const formatTooltipLabel = (value: number) => {
    return `Tempo: ${value} min`;
  };

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Tempo (minuti)', position: 'insideBottomRight', offset: -10 }} 
          />
          <YAxis 
            label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft' }} 
            domain={['auto', 'auto']}
          />
          <Tooltip 
            formatter={formatTooltip}
            labelFormatter={formatTooltipLabel}
          />
          <Legend />
          
          {/* Linea del target di temperatura */}
          {abbattimento.temperaturaFinale !== undefined && (
            <ReferenceLine 
              y={abbattimento.temperaturaFinale} 
              stroke="#ff7300" 
              strokeDasharray="3 3" 
              label="Target" 
            />
          )}
          
          {/* La curva di progresso */}
          <Line 
            type="monotone" 
            dataKey="temperatura" 
            stroke="#2196F3" 
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
