import * as React from 'react';
import { StatoCottura } from '../../../../../../types/models.types';
import { cotturaUtils } from '../../utils/cotturaUtils';
import {
  TimerContainer,
  TimerProgress,
  TimerBar,
  TimerCountdown,
  CotturaBadge
} from './CotturaTimer.styles';

interface CotturaTimerProps {
  cotturaId?: string;
  stato: StatoCottura;
  inizio?: string | Date;
  fine?: string | Date;
  tempoCottura?: number;  // Tempo in minuti dal database
  cottureAttive?: boolean;
  tempoRimanente?: number; // Tempo in secondi
}

export const CotturaTimer: React.FC<CotturaTimerProps> = ({
  cotturaId,
  stato = StatoCottura.NON_INIZIATA,
  inizio,
  fine,
  tempoCottura = 60, // Default 60 minuti
  cottureAttive = false,
  tempoRimanente: tempoRimanenteEsterno // Riceviamo la prop ma usiamo un nome diverso
}) => {
  const [tempoTrascorso, setTempoTrascorso] = React.useState(0);
  const [tempoRimanente, setTempoRimanente] = React.useState(tempoRimanenteEsterno || 0);
  const [durataTotale, setDurataTotale] = React.useState<number | null>(null);
  
  // Converti il tempoCottura da minuti a secondi per i calcoli interni
  const tempoCotturaSecondi = React.useMemo(() => {
    return cotturaUtils.minutiToSecondi(tempoCottura);
  }, [tempoCottura]);
  
  // DEBUG: Log per verificare i parametri ricevuti all'inizializzazione
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ CotturaTimer montato per cottura ${cotturaId}:`, {
        stato,
        inizio: inizio ? new Date(inizio).toISOString() : null,
        tempoCotturaMinuti: tempoCottura,
        tempoCotturaSecondi,
        tempoRimanenteEsternoProp: tempoRimanenteEsterno,
      });
    }
  }, [cotturaId, stato, inizio, tempoCottura, tempoCotturaSecondi, tempoRimanenteEsterno]);
  
  // Inizializzazione: calcola immediatamente il tempo trascorso e rimanente al mount
  React.useEffect(() => {
    if (stato === StatoCottura.IN_CORSO && inizio) {
      try {
        const inizioTimestamp = new Date(inizio).getTime();
        const now = Date.now();
        const secondiTrascorsi = Math.floor((now - inizioTimestamp) / 1000);
        setTempoTrascorso(secondiTrascorsi);
        
        // Se non viene fornito un tempo rimanente esterno, calcola il tempo rimanente
        if (tempoRimanenteEsterno === undefined) {
          const nuovoTempoRimanente = Math.max(0, tempoCotturaSecondi - secondiTrascorsi);
          setTempoRimanente(nuovoTempoRimanente);
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`⏱️ Timer inizializzato per cottura ${cotturaId}:`, {
              tempoCotturaSecondi,
              secondiTrascorsi,
              nuovoTempoRimanente,
              ora: new Date().toISOString()
            });
          }
        }
      } catch (err) {
        console.error('Errore nel calcolo del tempo iniziale:', err);
      }
    }
  }, [cotturaId, stato, inizio, tempoCotturaSecondi, tempoRimanenteEsterno]);
  
  // Aggiorniamo il tempoRimanente quando cambia la prop esterna
  React.useEffect(() => {
    if (tempoRimanenteEsterno !== undefined) {
      setTempoRimanente(tempoRimanenteEsterno);
    }
  }, [tempoRimanenteEsterno]);
  
  // Calcoliamo la durata totale effettiva se la cottura è completata e abbiamo inizio e fine
  React.useEffect(() => {
    if (stato === StatoCottura.COMPLETATA && inizio && fine) {
      try {
        const inizioMs = new Date(inizio).getTime();
        const fineMs = new Date(fine).getTime();
        const durataSecondi = Math.floor((fineMs - inizioMs) / 1000);
        setDurataTotale(durataSecondi);
      } catch (err) {
        console.error('Errore nel calcolo della durata totale:', err);
      }
    }
  }, [stato, inizio, fine]);

  // UseEffect per aggiornare il timer ogni secondo per le cotture in corso
  React.useEffect(() => {
    if (stato !== StatoCottura.IN_CORSO || !inizio) return;
    
    try {
      const inizioTimestamp = new Date(inizio).getTime();
      
      const intervalId = setInterval(() => {
        const now = Date.now();
        const secondiTrascorsi = Math.floor((now - inizioTimestamp) / 1000);
        setTempoTrascorso(secondiTrascorsi);
        
        // Calcoliamo il tempo rimanente solo se non è stato fornito esternamente
        if (tempoRimanenteEsterno === undefined) {
          const nuovoTempoRimanente = Math.max(0, tempoCotturaSecondi - secondiTrascorsi);
          setTempoRimanente(nuovoTempoRimanente);
          
          // Ogni minuto, log dettagliato per debug
          if (secondiTrascorsi % 60 === 0 && process.env.NODE_ENV === 'development') {
            console.log(`⏱️ Timer aggiornato per cottura ${cotturaId}:`, {
              tempoCotturaSecondi,
              secondiTrascorsi,
              nuovoTempoRimanente,
              ora: new Date().toISOString()
            });
          }
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    } catch (err) {
      console.error('Errore nell\'intervallo del timer:', err);
      return undefined;
    }
  }, [cotturaId, stato, inizio, tempoCotturaSecondi, tempoRimanenteEsterno]);

  // Determina la classe in base allo stato e tempo rimanente
  const getTimerStatus = (): 'inactive' | 'completed' | 'critical' | 'warning' | 'normal' => {
    if (!cottureAttive || stato === StatoCottura.NON_INIZIATA) return 'inactive';
    if (stato === StatoCottura.COMPLETATA) return 'completed';
    
    // Per cotture in corso, il colore dipende dal tempo rimanente
    if (tempoRimanente <= 300) return 'critical'; // < 5 min
    if (tempoRimanente <= 900) return 'warning'; // < 15 min
    return 'normal';
  };

  // Calcola la percentuale di completamento per la progress bar
  const getProgressPercentage = (): number => {
    if (stato !== StatoCottura.IN_CORSO || tempoCotturaSecondi <= 0) return 0;
    return Math.min(100, Math.max(0, (tempoTrascorso / tempoCotturaSecondi) * 100));
  };

  const timerStatus = getTimerStatus();

  return (
    <TimerContainer data-cottura-id={cotturaId} $status={timerStatus}>
      {stato === StatoCottura.NON_INIZIATA ? (
        <CotturaBadge $status="inactive">Non iniziata</CotturaBadge>
      ) : stato === StatoCottura.COMPLETATA ? (
        <CotturaBadge $status="completed">
          {durataTotale ? `Durata: ${cotturaUtils.formatDurataTotale(durataTotale)}` : 'Completata'}
        </CotturaBadge>
      ) : (
        <React.Fragment>
          <TimerProgress>
            <TimerBar 
              style={{ width: `${getProgressPercentage()}%` }}
              $status={timerStatus}
            />
          </TimerProgress>
          <TimerCountdown $status={timerStatus}>
            {cotturaUtils.formatTime(tempoRimanente)}
          </TimerCountdown>
        </React.Fragment>
      )}
    </TimerContainer>
  );
};

export default CotturaTimer;
