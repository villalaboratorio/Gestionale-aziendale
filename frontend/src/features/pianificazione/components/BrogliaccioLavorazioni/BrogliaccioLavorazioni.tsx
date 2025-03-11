import React from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import { useLavorazioniActions } from '../../hooks/useLavorazioniActions';
import { ILavorazioneParcheggiata } from '../../types/lavorazioni.types';
import { logger } from '../../../../core/Path/logging/logger';
import * as S from './BrogliaccioLavorazioni.styles';

const BrogliaccioLavorazioni: React.FC = () => {
  // Utilizziamo solo state dal context
  const { state } = usePianificazione();
  const { lavorazioni } = state;
  
  // Utilizziamo hook separati per le azioni
  const { updateLavorazione, removeLavorazione } = useLavorazioniActions();

  // Calcola i totali per le lavorazioni parcheggiate
  const calcolaTotali = () => {
    const totale = lavorazioni.parcheggiate.reduce((sum, lav) => sum + lav.quantitaTotale, 0);
    const porzioni = lavorazioni.parcheggiate.reduce((sum, lav) => sum + lav.porzioniPreviste, 0);
    
    return { totale, porzioni };
  };

  // Gestisci la modifica della quantità
  const handleQuantitaChange = (lavorazione: ILavorazioneParcheggiata, nuovaQuantita: number) => {
    if (nuovaQuantita <= 0) return;
    
    // Calcola nuove porzioni in base alla nuova quantità
    const nuovePorzioni = Math.floor((nuovaQuantita * 1000) / lavorazione.grammiPerPorzione);
    
    updateLavorazione(lavorazione.id, {
      quantitaTotale: nuovaQuantita,
      porzioniPreviste: nuovePorzioni
    });
    
    logger.debug(`Aggiornata quantità per lavorazione ${lavorazione.id}: ${nuovaQuantita}kg, ${nuovePorzioni} porzioni`);
  };

  // Gestisci l'eliminazione di una lavorazione
  const handleRemoveLavorazione = (id: string) => {
    if (window.confirm('Sei sicuro di voler rimuovere questa lavorazione?')) {
      removeLavorazione(id);
      logger.debug(`Rimossa lavorazione ${id}`);
    }
  };

  const { totale, porzioni } = calcolaTotali();

  return (
    <S.Container>
      {lavorazioni.loading && (
        <S.LoadingMessage>Caricamento lavorazioni...</S.LoadingMessage>
      )}

      {lavorazioni.error && (
        <S.ErrorMessage>{lavorazioni.error}</S.ErrorMessage>
      )}

      {!lavorazioni.loading && lavorazioni.parcheggiate.length === 0 && (
        <S.EmptyMessage>Nessuna lavorazione aggiunta</S.EmptyMessage>
      )}

      {!lavorazioni.loading && lavorazioni.parcheggiate.length > 0 && (
        <>
          <S.LavorazioniList>
            {lavorazioni.parcheggiate.map((lavorazione) => (
              <S.LavorazioneCard key={lavorazione.id}>
                <S.CardHeader>
                  <S.RicettaNome>{lavorazione.ricettaNome}</S.RicettaNome>
                  <S.DeleteButton onClick={() => handleRemoveLavorazione(lavorazione.id)}>
                    ✕
                  </S.DeleteButton>
                </S.CardHeader>
                
                <S.CardContent>
                  <S.DettagliGrid>
                    <S.DettaglioItem>
                      <span>Cliente</span>
                      <S.DettaglioValue>{lavorazione.cliente}</S.DettaglioValue>
                    </S.DettaglioItem>
                    <S.DettaglioItem>
                      <span>Materia prima</span>
                      <S.DettaglioValue>{lavorazione.materiaPrima.nome}</S.DettaglioValue>
                    </S.DettaglioItem>
                    <S.DettaglioItem>
                      <span>Lotto</span>
                      <S.DettaglioValue>{lavorazione.materiaPrima.lotNumber}</S.DettaglioValue>
                    </S.DettaglioItem>
                  </S.DettagliGrid>
                  
                  <S.InputGroup>
                    <S.InputRow>
                      <label>Quantità (kg):</label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={lavorazione.quantitaTotale}
                        onChange={(e) => handleQuantitaChange(lavorazione, parseFloat(e.target.value))}
                      />
                    </S.InputRow>
                  </S.InputGroup>
                  
                  <S.InfoText>
                    <span>Porzioni: {lavorazione.porzioniPreviste}</span>
                    <span> • g/porzione: {lavorazione.grammiPerPorzione}</span>
                  </S.InfoText>
                </S.CardContent>
              </S.LavorazioneCard>
            ))}
          </S.LavorazioniList>
          
          <S.TotaliArea>
            <S.TotaleRow>
              <span>Totale quantità:</span>
              <S.TotaleValue>{totale.toFixed(2)} kg</S.TotaleValue>
            </S.TotaleRow>
            <S.TotaleRow>
              <span>Totale porzioni:</span>
              <S.TotaleValue>{porzioni}</S.TotaleValue>
            </S.TotaleRow>
          </S.TotaliArea>
        </>
      )}
    </S.Container>
  );
};

export default BrogliaccioLavorazioni;
