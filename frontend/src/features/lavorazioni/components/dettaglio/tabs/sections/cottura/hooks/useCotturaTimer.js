import { useState, useEffect, useRef, useCallback } from 'react';

const formatTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map(unit => unit.toString().padStart(2, '0'))
    .join(':');
};

const useCotturaTimer = (cottura) => {
  const [tempoTrascorso, setTempoTrascorso] = useState('00:00:00');
  const [tempoRimanente, setTempoRimanente] = useState('00:00:00');
  const [percentualeCompletamento, setPercentualeCompletamento] = useState(0);
  const timerRef = useRef(null);

  const calcolaTempi = useCallback(() => {
    if (cottura.stato !== 'in_corso') return;

    const now = new Date();
    const start = new Date(cottura.inizio);
    const end = new Date(cottura.finePrevista);
    
    const trascorso = now - start;
    const totale = end - start;
    const rimanente = end - now;

    setTempoTrascorso(formatTime(trascorso));
    setTempoRimanente(formatTime(rimanente));
    setPercentualeCompletamento((trascorso / totale) * 100);
  }, [cottura.stato, cottura.inizio, cottura.finePrevista]);

  useEffect(() => {
    if (cottura.stato === 'in_corso') {
      calcolaTempi();
      timerRef.current = setInterval(calcolaTempi, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [cottura.stato, cottura.inizio, cottura.finePrevista, calcolaTempi]);

  return {
    tempoTrascorso,
    tempoRimanente,
    percentualeCompletamento
  };
};

export default useCotturaTimer;
