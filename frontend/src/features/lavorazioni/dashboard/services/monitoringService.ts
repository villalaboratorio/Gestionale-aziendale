import { createApiService } from '../../../../core/api';

// Definiamo l'interfaccia della cottura attiva
interface CotturaAttiva {
  _id: string;
  tipoCottura: { nome: string };
  temperaturaTarget: number;
  stato: string;
  inizio: Date;
  fine?: Date;
}

// Definiamo l'interfaccia dell'abbattimento attivo
interface AbbattimentoAttivo {
  inizio: Date;
  fine?: Date;
  temperaturaIniziale: number;
  temperaturaAttuale?: number;
  temperaturaFinale?: number;
  stato: string;
  tipoAbbattimento: string;
  tempoResiduoStimato?: number;
}

// Definiamo l'interfaccia dell'assemblaggio attivo
interface AssemblaggioAttivo {
  tipo: string;
  stato: string;
  addetto?: string;
  dataInizio?: Date;
}

// Definiamo l'interfaccia completa per i dati di monitoraggio
export interface MonitoringData {
  activeCooking: {
    lavorazioneId: string;
    numeroScheda: string;
    ricettaNome?: string;
    cotture: CotturaAttiva[];
  }[];
  
  activeChilling: {
    lavorazioneId: string;
    numeroScheda: string;
    ricettaNome?: string;
    abbattimento: AbbattimentoAttivo;
  }[];
  
  activeAssembly: {
    lavorazioneId: string;
    numeroScheda: string;
    ricettaNome?: string;
    assemblaggio: AssemblaggioAttivo;
  }[];
}

// Dati vuoti per inizializzazione
const emptyMonitoringData: MonitoringData = {
  activeCooking: [],
  activeChilling: [],
  activeAssembly: []
};

// Definiamo un'interfaccia per la struttura delle lavorazioni
interface Lavorazione {
  _id: string;
  numeroScheda?: string;
  ricetta?: {
    nome?: string;
  };
  cotture?: {
    _id: string;
    tipoCottura: string | { nome: string; _id?: string };
    temperaturaTarget?: number;
    stato?: string;
    inizio?: string | Date;
    fine?: string | Date;
  }[];
  abbattimento?: {
    inizio?: string | Date;
    fine?: string | Date;
    temperaturaIniziale?: number;
    temperaturaAttuale?: number;
    temperaturaFinale?: number;
    stato?: string;
    tipoAbbattimento?: string;
    tempoResiduoStimato?: number;
  };
  assemblaggio?: Record<string, {
    stato?: string;
    addetto?: string;
    ore?: string | Date;
    dataCompletamento?: string | Date;
  }>;
}

// Definiamo l'interfaccia per la risposta API
interface LavorazioniResponse {
  items: Lavorazione[];
  stats: {
    totali: number;
    inLavorazione: number;
    inAttesa: number;
    completate: number;
    [key: string]: unknown;
  };
  pagination: {
    total: number;
    pages: number;
    currentPage: number;
    pageSize: number;
  };
}

// API service per accedere agli endpoint delle lavorazioni
const lavorazioniApiService = createApiService({
  baseURL: 'http://localhost:5000',
  endpoints: {
    getAllLavorazioni: {
      path: '/v2/lavorazioni', 
      method: 'GET',
      requiresAuth: true,
      cacheable: false
    }
  }
});

// Funzioni helper per estrarre i diversi tipi di processi attivi
const extractActiveCooking = (lavorazioni: Lavorazione[]): MonitoringData['activeCooking'] => {
  const activeCooking: MonitoringData['activeCooking'] = [];
  
  for (const lavorazione of lavorazioni) {
    if (!lavorazione.cotture || !Array.isArray(lavorazione.cotture)) {
      continue;
    }
    
    const attiveCotture = lavorazione.cotture.filter(c => c?.stato === 'in_corso');
    
    if (attiveCotture.length > 0) {
      activeCooking.push({
        lavorazioneId: lavorazione._id,
        numeroScheda: lavorazione.numeroScheda || 'N/D',
        ricettaNome: lavorazione.ricetta?.nome,
        cotture: attiveCotture.map(c => ({
          _id: c._id,
          tipoCottura: typeof c.tipoCottura === 'string' 
            ? { nome: c.tipoCottura }
            : (c.tipoCottura as { nome: string } || { nome: 'Sconosciuto' }),
          temperaturaTarget: c.temperaturaTarget || 0,
          stato: c.stato || 'sconosciuto',
          inizio: new Date(c.inizio || Date.now()),
          ...(c.fine ? { fine: new Date(c.fine) } : {})
        }))
      });
    }
  }
  
  return activeCooking;
};

const extractActiveChilling = (lavorazioni: Lavorazione[]): MonitoringData['activeChilling'] => {
  const activeChilling: MonitoringData['activeChilling'] = [];
  
  for (const lavorazione of lavorazioni) {
    if (!lavorazione.abbattimento || lavorazione.abbattimento.stato !== 'in_corso') {
      continue;
    }
    
    const abbattimento = lavorazione.abbattimento;
    activeChilling.push({
      lavorazioneId: lavorazione._id,
      numeroScheda: lavorazione.numeroScheda || 'N/D',
      ricettaNome: lavorazione.ricetta?.nome,
      abbattimento: {
        inizio: new Date(abbattimento.inizio || Date.now()),
        temperaturaIniziale: abbattimento.temperaturaIniziale || 0,
        stato: abbattimento.stato || 'sconosciuto',
        tipoAbbattimento: abbattimento.tipoAbbattimento || 'positivo',
        ...(abbattimento.fine ? { fine: new Date(abbattimento.fine) } : {}),
        ...(abbattimento.temperaturaAttuale !== undefined ? 
          { temperaturaAttuale: abbattimento.temperaturaAttuale } : {}),
        ...(abbattimento.temperaturaFinale !== undefined ? 
          { temperaturaFinale: abbattimento.temperaturaFinale } : {}),
        ...(abbattimento.tempoResiduoStimato !== undefined ? 
          { tempoResiduoStimato: abbattimento.tempoResiduoStimato } : {})
      }
    });
  }
  
  return activeChilling;
};

const extractActiveAssembly = (lavorazioni: Lavorazione[]): MonitoringData['activeAssembly'] => {
  const activeAssembly: MonitoringData['activeAssembly'] = [];
  const tipiAssemblaggio = ['crudo', 'dopoCottura', 'dopoCotturaParziale', 'crudoSegueCottura'];
  
  for (const lavorazione of lavorazioni) {
    if (!lavorazione.assemblaggio) {
      continue;
    }
    
    for (const tipo of tipiAssemblaggio) {
      const assemblaggioCorrente = lavorazione.assemblaggio[tipo];
      if (assemblaggioCorrente && assemblaggioCorrente.stato === 'in_corso') {
        activeAssembly.push({
          lavorazioneId: lavorazione._id,
          numeroScheda: lavorazione.numeroScheda || 'N/D',
          ricettaNome: lavorazione.ricetta?.nome,
          assemblaggio: {
            tipo,
            stato: 'in_corso',
            addetto: assemblaggioCorrente.addetto,
            // Corretto: ora usiamo il campo ore invece di dataCompletamento
            ...(assemblaggioCorrente.ore ? 
              { dataInizio: new Date(assemblaggioCorrente.ore) } : {})
          }
        });
        break; // Una lavorazione può avere solo un tipo di assemblaggio attivo
      }
    }
  }
  
  return activeAssembly;
};

export const monitoringService = {
  /**
   * Recupera i dati per il monitoraggio dei processi attivi
   */
  getActiveProcesses: async (): Promise<MonitoringData> => {
    try {
      console.log('Recupero dati lavorazioni per il monitoraggio');
      const response = await lavorazioniApiService.request('getAllLavorazioni');
      
      if (!response.success) {
        console.error('Errore nella risposta API:', response.message);
        return emptyMonitoringData;
      }
      
      // Utilizziamo un approccio sicuro per verificare la struttura dei dati
      const responseData = response.data as LavorazioniResponse;      
      // Estrai l'array di lavorazioni dal campo 'items' della risposta
      const lavorazioni: Lavorazione[] = Array.isArray(responseData?.items) 
        ? responseData.items 
        : [];
      
      if (lavorazioni.length === 0) {
        console.log('Nessuna lavorazione trovata o formato dati non valido');
        return emptyMonitoringData;
      }
      
      console.log(`Analisi di ${lavorazioni.length} lavorazioni per processi attivi`);
      
      // Utilizziamo le funzioni helper per estrarre i dati
      const activeCooking = extractActiveCooking(lavorazioni);
      const activeChilling = extractActiveChilling(lavorazioni);
      const activeAssembly = extractActiveAssembly(lavorazioni);
      
      console.log(`Totale processi attivi trovati: ${activeCooking.length} cotture, ${activeChilling.length} abbattimenti, ${activeAssembly.length} assemblaggi`);
      
      return {
        activeCooking,
        activeChilling,
        activeAssembly
      };
    } catch (error) {
      console.error('Errore generale durante il recupero dei processi attivi:', error);
      throw error; // Propaghiamo l'errore per gestirlo nel componente
    }
  }
};
