import { useCallback } from 'react';
import { useCottureCore } from './useCottureCore';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { Cottura, StatoCottura, TipoCottura, Ricetta } from '../../../../../types/models.types';

// Interfaccia per la struttura delle cotture nelle ricette
interface CotturaRicetta {
  _id?: string;
  tipoCottura: TipoCottura | string;
  temperatura?: number;
  temperaturaTarget?: number;
  tempoCottura?: number;      // Tempo in secondi
  tempoMedioCottura?: number; // Campo alternativo per il tempo
  addetto?: string;
  stato?: StatoCottura;
}

/**
 * Hook per gestire l'importazione delle cotture dalla ricetta
 */
export const useCottureImport = () => {
  const {
    lavorazione,
    collections,
    cotture,
    updateCottureLocally
  } = useCottureCore();
  
  const { actions } = useLavorazioneContext();
  
  /**
   * Importa le cotture dalla ricetta senza salvataggio immediato
   */
  const importCottureFromRicetta = useCallback(async () => {
    if (!lavorazione || !collections) return;
    
    try {
      actions.setLoading('operations', true);
      
      // Ottieni la ricetta completa dalle collezioni
      const ricettaCompleta = collections.ricette?.find(r => 
        r._id === (lavorazione.ricetta?._id || '')
      );
      
      // Estrai le cotture dalla ricetta
      const ricettaCotture = ricettaCompleta?.cotture || [];
      
      if (ricettaCotture.length === 0) {
        const ricettaConCotture = lavorazione.ricetta as Ricetta | undefined;
        
        // Fallback: verifica se esistono cotture direttamente nella ricetta
        if (ricettaConCotture?.cotture && ricettaConCotture.cotture.length > 0) {
          console.log('Usando cotture dalla ricetta della lavorazione');
        } else {
          alert('La ricetta non contiene cotture da importare');
          return;
        }
      }
      
      // Determina l'origine delle cotture da importare
      const cottureOrigine: CotturaRicetta[] = 
        ricettaCotture.length > 0 
          ? ricettaCotture 
          : ((lavorazione.ricetta as Ricetta | undefined)?.cotture || []);
      
      // Ottieni il primo operatore dalla collection quantityTypes (per preimpostare l'addetto)
      const primoOperatore = collections.quantityTypes?.length > 0 
        ? collections.quantityTypes[0].name 
        : '';
        
      // Log per debug
      console.log('Debug - Cotture origine:', cottureOrigine);
      console.log('Debug - Primo operatore disponibile:', primoOperatore);
      
      // Prepara le nuove cotture con validazione robusta
      const cottureToAdd = cottureOrigine
        .filter(Boolean)
        .map((cottura: CotturaRicetta): Cottura | null => {
          // Estrai l'ID del tipo cottura in modo sicuro
          let tipoCotturaId: string | undefined;
          
          if (typeof cottura.tipoCottura === 'object' && cottura.tipoCottura) {
            tipoCotturaId = cottura.tipoCottura._id;
          } else if (typeof cottura.tipoCottura === 'string') {
            tipoCotturaId = cottura.tipoCottura;
          } else {
            console.warn('Tipo cottura non valido:', cottura.tipoCottura);
            return null;
          }
          
          if (!tipoCotturaId) {
            console.warn('ID tipo cottura mancante');
            return null;
          }
            
          // Trova il tipo cottura completo nelle collezioni
          const tipoCotturaObj = collections.tipiCottura?.find(tc => 
            tc._id === tipoCotturaId
          );
          
          if (!tipoCotturaObj) {
            console.warn(`Tipo cottura con ID ${tipoCotturaId} non trovato nelle collezioni`);
            return null;
          }
          
          // Determina il tempo di cottura in secondi da varie fonti possibili
          const tempoCotturaSecondi = 
            // 1. Usa tempoCottura dalla cottura se disponibile
            cottura.tempoCottura || 
            // 2. Oppure usa il tempoMedioCottura dalla cottura
            cottura.tempoMedioCottura || 
            // 3. Oppure usa il tempoMedio dal tipo cottura
            (tipoCotturaObj.tempoMedio || tipoCotturaObj.tempoMedioCottura) || 
            // 4. Fallback: 60 minuti (3600 secondi)
            3600;
          
          console.log(`Debug - Tempo cottura per ${tipoCotturaObj.nome || tipoCotturaObj.name}:`, {
            tempoCottura: cottura.tempoCottura,
            tempoMedioCottura: cottura.tempoMedioCottura,
            tipoTempoMedio: tipoCotturaObj.tempoMedio || tipoCotturaObj.tempoMedioCottura,
            tempoCotturaFinale: tempoCotturaSecondi
          });
          
          // Modifica in useCottureImport.ts nella parte di creazione della cottura:

// Crea una nuova cottura con tutti i campi necessari
return {
    _id: `temp_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    tipoCottura: {
      _id: tipoCotturaObj._id,
      nome: tipoCotturaObj.nome || tipoCotturaObj.name || 'Tipo non specificato',
      tempoMedio: tipoCotturaObj.tempoMedio || tipoCotturaObj.tempoMedioCottura,
      descrizione: tipoCotturaObj.descrizione || tipoCotturaObj.description
    },
    // NOTA IMPORTANTE: Il sistema utilizza "temperatura" e non "temperaturaTarget"
    temperatura: cottura.temperaturaTarget || cottura.temperatura || 180,
    
    // Assicuriamoci che tempoCottura sia in secondi e sia un numero valido
    tempoCottura: tempoCotturaSecondi > 0 ? tempoCotturaSecondi : 3600,
    
    addetto: primoOperatore,
    stato: StatoCottura.NON_INIZIATA
  };
  
        })
        .filter((cottura): cottura is Cottura => cottura !== null);
      
      if (cottureToAdd.length === 0) {
        alert('Nessuna cottura valida trovata nella ricetta');
        return;
      }
      
      console.log('Debug - Cotture importate (non ancora salvate):', cottureToAdd);
      
      // Aggiorniamo solo lo stato locale senza salvare
      updateCottureLocally([...cotture, ...cottureToAdd]);
      
      alert(`Importate ${cottureToAdd.length} cotture dalla ricetta. Ricordati di salvare quando sei pronto!`);
    } catch (error) {
      console.error('Errore durante l\'importazione delle cotture:', error);
      alert('Si è verificato un errore durante l\'importazione delle cotture');
    } finally {
      actions.setLoading('operations', false);
    }
  }, [lavorazione, collections, cotture, updateCottureLocally, actions]);

  return {
    importCottureFromRicetta
  };
};
