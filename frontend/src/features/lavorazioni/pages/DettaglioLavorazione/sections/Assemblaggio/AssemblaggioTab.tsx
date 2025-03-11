import React, { useEffect, useState } from 'react';
import { useLavorazioneContext } from '../../../../store/LavorazioneContext';
import { FaseAssemblaggioCard } from './components/FaseAssemblaggioCard';
import { Container, Header, Title, Content, StatusBar, StatusBadge } from './AssemblaggioTab.styles';
import { StatoAssemblaggio, FaseAssemblaggio } from '../../../../types/models.types';

const AssemblaggioTab: React.FC = () => {
  const { data: { lavorazione, collections }, loadingStates } = useLavorazioneContext();
  const [operatori, setOperatori] = useState<string[]>([]);
  
  // Estrai operatori dalle collezioni
  useEffect(() => {
    if (collections?.quantityTypes) {
      const operatoriList = collections.quantityTypes
        .filter(qt => qt.name)
        .map(qt => qt.name);
      setOperatori(operatoriList);
    }
  }, [collections]);
  
  // Se ancora in caricamento
  if (loadingStates.main || !lavorazione) {
    return (
      <Container>
        <div className="loading-message">Caricamento dati assemblaggio...</div>
      </Container>
    );
  }
  
  // Prepara i dati dell'assemblaggio
  const assemblaggio = lavorazione.assemblaggio || {};
  
  // Calcola lo stato di completamento per visualizzazione
  // Modifichiamo il tipo di ritorno per evitare 'any'
  const calcolaStato = (fase: FaseAssemblaggio | undefined): StatoAssemblaggio | 'non_applicabile' => {
    if (!fase || (!fase.addetto && !fase.ore)) return 'non_applicabile';
    return fase.stato || StatoAssemblaggio.NON_INIZIATA;
  };
  
  // Conta le fasi attive e completate
  const fasiAttive = Object.values(assemblaggio).filter(fase => 
    fase && (fase.addetto || fase.ore)
  ).length;
  
  const fasiCompletate = Object.values(assemblaggio).filter(fase => 
    fase && fase.stato === StatoAssemblaggio.COMPLETATA
  ).length;
  
  return (
    <Container>
      <Header>
        <Title>Gestione Assemblaggio</Title>
        <StatusBar>
          {fasiAttive > 0 ? (
            <StatusBadge>
              {fasiCompletate} / {fasiAttive} fasi completate
            </StatusBadge>
          ) : (
            <StatusBadge variant="info">
              Nessuna fase di assemblaggio attiva
            </StatusBadge>
          )}
        </StatusBar>
      </Header>
      
      <Content>
        <FaseAssemblaggioCard
          titolo="A CRUDO"
          descrizione="Assemblaggio degli ingredienti prima della cottura"
          fase="crudo"
          dati={assemblaggio.crudo}
          stato={calcolaStato(assemblaggio.crudo)}
          operatori={operatori}
        />
        
        <FaseAssemblaggioCard
          titolo="DOPO COTTURA"
          descrizione="Assemblaggio degli ingredienti dopo la cottura completa"
          fase="dopoCottura"
          dati={assemblaggio.dopoCottura}
          stato={calcolaStato(assemblaggio.dopoCottura)}
          operatori={operatori}
        />
        
        <FaseAssemblaggioCard
          titolo="DOPO COTTURA PARZIALE"
          descrizione="Assemblaggio degli ingredienti dopo una cottura parziale"
          fase="dopoCotturaParziale"
          dati={assemblaggio.dopoCotturaParziale}
          stato={calcolaStato(assemblaggio.dopoCotturaParziale)}
          operatori={operatori}
        />
        
        <FaseAssemblaggioCard
          titolo="A CRUDO SEGUE COTTURA"
          descrizione="Assemblaggio a crudo che sarà seguito da cottura"
          fase="crudoSegueCottura"
          dati={assemblaggio.crudoSegueCottura}
          stato={calcolaStato(assemblaggio.crudoSegueCottura)}
          operatori={operatori}
        />
      </Content>
    </Container>
  );
};

export default AssemblaggioTab;
