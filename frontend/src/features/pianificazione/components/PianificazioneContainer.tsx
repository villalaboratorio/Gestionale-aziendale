import React, { useEffect, useState } from 'react';
import { PianificazioneProvider } from '../context/PianificazioneProvider';
import { usePianificazione } from '../hooks/usePianificazione';
import MateriePrimeList from './MateriePrimeList/MateriePrimeList';
import SuggerimentiLavorazione from './SuggerimentiLavorazione/SuggerimentiLavorazione';
import BrogliaccioLavorazioni from './BrogliaccioLavorazioni/BrogliaccioLavorazioni';
import LavorazioniParcheggiate from './LavorazioniParcheggiate/LavorazioniParcheggiate';
import ConfermaLavorazione from './ConfermaLavorazione/ConfermaLAvorazione';
import Panel from '../components/common/Panel';
import PanelSystemContainer from '../components/common/PanelSystem';
import WorkflowTracker from './common/WorflowTracker/WorkflowTracker/WorkflowTracker';
import { Container, GridLayout, LeftColumn, RightColumn, WorkflowSection } from './PianificazioneContainer.styles';
import { logger } from '../../../core/Path/logging/logger';

// Definizione dei passi del workflow
const workflowSteps = [
  { id: 'selezione', label: 'Selezione Materia Prima' },
  { id: 'pianificazione', label: 'Pianificazione Lavorazioni' },
  { id: 'riepilogo', label: 'Riepilogo e Conferma' }
];

// Componente interno che usa il context
const PianificazioneContent: React.FC = () => {
  const { state } = usePianificazione();
  const [currentStep, setCurrentStep] = useState('selezione');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Monitora i cambiamenti nello stato per aggiornare lo step corrente
  useEffect(() => {
    // Se una materia prima è selezionata, siamo almeno allo step di pianificazione
    if (state.materiePrime.selected) {
      setCurrentStep('pianificazione');
      if (!completedSteps.includes('selezione')) {
        setCompletedSteps(prev => [...prev, 'selezione']);
      }
    }
    
    // Se ci sono lavorazioni parcheggiate, siamo allo step di riepilogo
    if (state.lavorazioni.parcheggiate.length > 0) {
      setCurrentStep('riepilogo');
      if (!completedSteps.includes('pianificazione')) {
        setCompletedSteps(prev => [...prev, 'pianificazione']);
      }
    }
  }, [state.materiePrime.selected, state.lavorazioni.parcheggiate.length, completedSteps]);
  
  return (
    <Container>
      <h2>Pianificazione Lavorazioni</h2>
      
      <WorkflowSection>
        <WorkflowTracker 
          steps={workflowSteps} 
          currentStep={currentStep} 
          completedSteps={completedSteps} 
        />
      </WorkflowSection>
      
      <GridLayout>
        <LeftColumn>
          <PanelSystemContainer>
            <Panel 
              title="Materie Prime Disponibili" 
              defaultExpanded={currentStep === 'selezione'}
            >
              <MateriePrimeList />
            </Panel>
            
            <Panel 
              title="Suggerimenti Lavorazioni"
              defaultExpanded={currentStep === 'pianificazione'}
            >
              <SuggerimentiLavorazione />
            </Panel>
          </PanelSystemContainer>
        </LeftColumn>
        
        <RightColumn>
          <PanelSystemContainer>
            <Panel 
              title="Riepilogo Lavorazioni" 
              defaultExpanded={currentStep === 'pianificazione'}
            >
              <BrogliaccioLavorazioni />
            </Panel>
            
            <Panel 
              title="Lavorazioni Parcheggiate"
              defaultExpanded={currentStep === 'riepilogo'}
            >
              <LavorazioniParcheggiate />
            </Panel>
          </PanelSystemContainer>
        </RightColumn>
      </GridLayout>
      
      {/* Modal di conferma */}
      <ConfermaLavorazione />
    </Container>
  );
};

// Componente che gestisce il layout e l'orchestrazione del modulo di pianificazione
const PianificazioneContainer: React.FC = () => {
  useEffect(() => {
    logger.info('Modulo Pianificazione inizializzato');
    
    return () => {
      logger.info('Modulo Pianificazione smontato');
    };
  }, []);
  
  return (
    <PianificazioneProvider>
      <PianificazioneContent />
    </PianificazioneProvider>
  );
};

export { PianificazioneContainer };
