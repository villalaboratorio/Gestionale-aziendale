import React from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import { useLavorazioniActions } from '../../hooks/useLavorazioniActions';
import { useConfermaLavorazioniActions } from '../../hooks/useConfermaLavorazioniActions';
import { useUIActions } from '../../hooks/useUIActions';
import * as S from './LavorazioniParcheggiate.styles';

const LavorazioniParcheggiate: React.FC = () => {
  // Utilizziamo solo state dal context
  const { state } = usePianificazione();
  const { lavorazioni, ui } = state;
  
  // Utilizziamo hook separati per le azioni
  const { clearLavorazioni } = useLavorazioniActions();
  const { setShowConferma } = useConfermaLavorazioniActions();
  const { setFiltroCliente, setOrdinamento } = useUIActions();
  
  // Ottieni clienti unici dalle lavorazioni
  const clientiUnici = Array.from(
    new Set(lavorazioni.parcheggiate.map(lav => lav.cliente))
  );
  
  // Filtra e ordina lavorazioni
  const lavorazioniFiltrate = lavorazioni.parcheggiate
    .filter(lav => ui.filtroCliente === 'tutti' || lav.cliente === ui.filtroCliente)
    .sort((a, b) => {
      if (ui.ordinamento === 'data') {
        return new Date(b.dataCreazione).getTime() - new Date(a.dataCreazione).getTime();
      } else {
        return b.quantitaTotale - a.quantitaTotale;
      }
    });
  
  // Calcola totali per lavorazioni filtrate
  const totali = {
    quantita: lavorazioniFiltrate.reduce((sum, lav) => sum + lav.quantitaTotale, 0),
    porzioni: lavorazioniFiltrate.reduce((sum, lav) => sum + lav.porzioniPreviste, 0)
  };
  
  const handleAvviaLavorazioni = () => {
    if (lavorazioni.parcheggiate.length === 0) return;
    
    setShowConferma(true);
  };
  
  const handleFiltroClienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroCliente(e.target.value);
  };
  
  const handleOrdinamentoChange = (ordinamento: string) => {
    setOrdinamento(ordinamento);
  };
  
  return (
    <S.Container>
      <S.ActionBar>
        <S.ActionButton
          onClick={handleAvviaLavorazioni}
          disabled={lavorazioni.parcheggiate.length === 0}
          primary
        >
          Avvia Lavorazioni
        </S.ActionButton>
        
        <S.ActionButton
          onClick={clearLavorazioni}
          disabled={lavorazioni.parcheggiate.length === 0}
        >
          Pulisci
        </S.ActionButton>
      </S.ActionBar>
      
      <S.FiltersBar>
        <S.FilterGroup>
          <S.FilterLabel>Cliente:</S.FilterLabel>
          <S.FilterSelect 
            value={ui.filtroCliente} 
            onChange={handleFiltroClienteChange}
          >
            <option value="tutti">Tutti i clienti</option>
            {clientiUnici.map(cliente => (
              <option key={cliente} value={cliente}>{cliente}</option>
            ))}
          </S.FilterSelect>
        </S.FilterGroup>
        
        <S.FilterGroup>
          <S.FilterLabel>Ordina per:</S.FilterLabel>
          <S.RadioGroup>
            <S.RadioLabel>
              <input 
                type="radio" 
                name="ordinamento" 
                value="data"
                checked={ui.ordinamento === 'data'}
                onChange={() => handleOrdinamentoChange('data')}
              />
              Data
            </S.RadioLabel>
            <S.RadioLabel>
              <input 
                type="radio" 
                name="ordinamento" 
                value="quantita"
                checked={ui.ordinamento === 'quantita'}
                onChange={() => handleOrdinamentoChange('quantita')}
              />
              Quantità
            </S.RadioLabel>
          </S.RadioGroup>
        </S.FilterGroup>
      </S.FiltersBar>
      
      {lavorazioni.parcheggiate.length === 0 ? (
        <S.EmptyState>
          Nessuna lavorazione parcheggiata
        </S.EmptyState>
      ) : (
        <>
          <S.LavorazioniLista>
            {lavorazioniFiltrate.map(lavorazione => (
              <S.LavorazioneItem key={lavorazione.id}>
                <S.LavorazioneHeader>
                  <S.RicettaNome>{lavorazione.ricettaNome}</S.RicettaNome>
                  <S.ClienteTag>{lavorazione.cliente}</S.ClienteTag>
                </S.LavorazioneHeader>
                <S.LavorazioneDetails>
                  <S.DetailItem>{lavorazione.quantitaTotale.toFixed(2)} kg</S.DetailItem>
                  <S.DetailItem>{lavorazione.porzioniPreviste} porzioni</S.DetailItem>
                  <S.DetailItem>{new Date(lavorazione.dataCreazione).toLocaleString()}</S.DetailItem>
                </S.LavorazioneDetails>
              </S.LavorazioneItem>
            ))}
          </S.LavorazioniLista>
          
          <S.FooterArea>
            <S.TotaliInfo>
              <S.TotaleRow>
                <span>Totale quantità:</span>
                <S.TotaleValue>{totali.quantita.toFixed(2)} kg</S.TotaleValue>
              </S.TotaleRow>
              <S.TotaleRow>
                <span>Totale porzioni:</span>
                <S.TotaleValue>{totali.porzioni}</S.TotaleValue>
              </S.TotaleRow>
            </S.TotaliInfo>
          </S.FooterArea>
        </>
      )}
    </S.Container>
  );
};

export default LavorazioniParcheggiate;
