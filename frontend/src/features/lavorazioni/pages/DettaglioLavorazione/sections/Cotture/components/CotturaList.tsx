import * as React from 'react';
import { useState, useMemo } from 'react';
import { StatoCottura, Cottura } from '../../../../../types/models.types';
import CotturaItem, { CotturaViewMode } from './CotturaItem';

// Importa solo i componenti styled
import {
  CottureContainer,
  CottureStats,
  StatsRow,
  Badge,
  CottureControls,
  ButtonGroup,
  ViewButton,
  GridLayout,
  Alert,
  CottureTable,
  FilterButton,
  AccordionContainer,
  AccordionItem,
  AccordionHeader,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  ContentArea,
  ClearFix
} from './CotturaList.styles';

// Enum per i tipi di visualizzazione
enum VistaType {
  LISTA = 'lista',
  GRIGLIA = 'griglia',
  GRUPPI = 'gruppi'
}

interface CotturaListProps {
  cotture: Cottura[];
  onEdit: (cottura: Cottura) => void;
  onDelete: (cotturaId: string) => void;
  onStart: (cotturaId: string) => void;
  onInterrupt: (cotturaId: string) => void;
  onComplete: (cotturaId: string, temperaturaFinale?: number) => void;
  loading: boolean;
}

const CotturaList: React.FC<CotturaListProps> = ({
  cotture,
  onEdit,
  onDelete,
  onStart,
  onInterrupt,
  onComplete,
  loading
}) => {
  // Stato per il tipo di visualizzazione
  const [tipoVista, setTipoVista] = useState<VistaType>(VistaType.LISTA);
  
  // Stato per filtro
  const [filtroStato, setFiltroStato] = useState<string>('tutti');
  // Stato per i pannelli aperti dell'accordion
  const [openPanels, setOpenPanels] = useState<Record<string, boolean>>({});

  // Calcola statistiche cotture
  const stats = useMemo(() => {
    return {
      totale: cotture.length,
      nonIniziate: cotture.filter(c => c.stato === StatoCottura.NON_INIZIATA).length,
      inCorso: cotture.filter(c => c.stato === StatoCottura.IN_CORSO).length,
      completate: cotture.filter(c => c.stato === StatoCottura.COMPLETATA).length
    };
  }, [cotture]);

  // Filtra le cotture in base al filtro stato
  const cottureFiltrate = useMemo(() => {
    if (filtroStato === 'tutti') return cotture;
    return cotture.filter(c => c.stato === filtroStato);
  }, [cotture, filtroStato]);

  // Raggruppa le cotture per tipo
  const cottureRaggruppate = useMemo(() => {
    const gruppi: Record<string, Cottura[]> = {};
    
    cottureFiltrate.forEach(cottura => {
      const tipoCotturaId = cottura.tipoCottura._id;
      if (!gruppi[tipoCotturaId]) {
        gruppi[tipoCotturaId] = [];
      }
      gruppi[tipoCotturaId].push(cottura);
    });
    
    return Object.entries(gruppi).map(([tipoCotturaId, cotture]) => ({
      tipoCotturaId,
      tipoCotturaNome: cotture[0]?.tipoCottura.nome || 'Sconosciuto',
      cotture
    }));
  }, [cottureFiltrate]);

  // Gestione apertura/chiusura pannelli accordion
  const togglePanel = (panelId: string) => {
    setOpenPanels(prev => ({
      ...prev,
      [panelId]: !prev[panelId]
    }));
  };

  if (cotture.length === 0) {
    return (
      <Alert variant="info">
        Nessuna cottura registrata per questa lavorazione.
        <br />
        Utilizza il pulsante "Aggiungi Cottura" per iniziare.
      </Alert>
    );
  }

  // Render della vista a lista
  const renderListView = () => (
    <CottureTable>
      <thead>
  <tr>
  <th>Tipo Cottura</th>
    <th>Temp. (°C)</th>
    <th>Durata</th>
    <th>Addetto</th>
    <th>Stato</th>
    <th>Timer</th>
    <th>Azioni</th>
  </tr>
</thead>
      <tbody>
        {cottureFiltrate.map(cottura => (
          <CotturaItem
            key={cottura._id || Math.random().toString()}
            cottura={cottura}
            onEdit={onEdit}
            onDelete={onDelete}
            onStart={onStart}
            onInterrupt={onInterrupt}
            onComplete={onComplete}
            loading={loading}
            viewMode={CotturaViewMode.ROW}
          />
        ))}
      </tbody>
    </CottureTable>
  );

  // Render della vista a griglia
  const renderGridView = () => (
    <GridLayout>
      {cottureFiltrate.map(cottura => (
        <CotturaItem
          key={cottura._id || Math.random().toString()}
          cottura={cottura}
          onEdit={onEdit}
          onDelete={onDelete}
          onStart={onStart}
          onInterrupt={onInterrupt}
          onComplete={onComplete}
          loading={loading}
          viewMode={CotturaViewMode.CARD}
        />
      ))}
    </GridLayout>
  );

  // Render della vista raggruppata
  const renderGroupView = () => (
    <AccordionContainer>
      {cottureRaggruppate.map((gruppo, index) => {
        const panelId = `panel-${gruppo.tipoCotturaId}`;
        const isOpen = openPanels[panelId] || index === 0;
        
        return (
          <AccordionItem key={gruppo.tipoCotturaId}>
            <AccordionHeader>
              <AccordionButton 
                isOpen={isOpen}
                onClick={() => togglePanel(panelId)}
              >
                <span>{gruppo.tipoCotturaNome}</span>
                <Badge variant="primary">{gruppo.cotture.length}</Badge>
                <AccordionIcon isOpen={isOpen} />
              </AccordionButton>
            </AccordionHeader>
            <AccordionPanel isOpen={isOpen}>
              <CottureTable>
                <thead>
                  <tr>
                    <th>Temperatura</th>
                    <th>Addetto</th>
                    <th>Stato</th>
                    <th>Timer</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {gruppo.cotture.map(cottura => (
                    <CotturaItem
                      key={cottura._id || Math.random().toString()}
                      cottura={cottura}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStart={onStart}
                      onInterrupt={onInterrupt}
                      onComplete={onComplete}
                      loading={loading}
                      viewMode={CotturaViewMode.GROUP}
                    />
                  ))}
                </tbody>
              </CottureTable>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </AccordionContainer>
  );

  return (
    <CottureContainer>
      {/* Statistiche cotture */}
      <CottureStats>
        <StatsRow>
          <div>
            <Badge variant="secondary">Totale: {stats.totale}</Badge>
            <Badge variant="info">Non iniziate: {stats.nonIniziate}</Badge>
            <Badge variant="primary">In corso: {stats.inCorso}</Badge>
            <Badge variant="success">Completate: {stats.completate}</Badge>
          </div>
          
          {/* Filtri stato */}
          <ButtonGroup>
            <FilterButton 
              active={filtroStato === 'tutti'}
              onClick={() => setFiltroStato('tutti')}
            >
              Tutte
            </FilterButton>
            <FilterButton 
              active={filtroStato === StatoCottura.NON_INIZIATA}
              onClick={() => setFiltroStato(StatoCottura.NON_INIZIATA)}
            >
              Non iniziate
            </FilterButton>
            <FilterButton 
              active={filtroStato === StatoCottura.IN_CORSO}
              onClick={() => setFiltroStato(StatoCottura.IN_CORSO)}
            >
              In corso
            </FilterButton>
            <FilterButton 
              active={filtroStato === StatoCottura.COMPLETATA}
              onClick={() => setFiltroStato(StatoCottura.COMPLETATA)}
            >
              Completate
            </FilterButton>
          </ButtonGroup>
        </StatsRow>
      </CottureStats>
      
      {/* Controlli visualizzazione */}
      <CottureControls>
        <ClearFix />
        <ButtonGroup>
          <ViewButton 
            active={tipoVista === VistaType.LISTA}
            onClick={() => setTipoVista(VistaType.LISTA)}
            title="Vista lista"
          >
            <i className="bi bi-list-ul"></i>
          </ViewButton>
          <ViewButton 
            active={tipoVista === VistaType.GRIGLIA}
            onClick={() => setTipoVista(VistaType.GRIGLIA)}
            title="Vista griglia"
          >
            <i className="bi bi-grid-3x3-gap"></i>
          </ViewButton>
          <ViewButton 
            active={tipoVista === VistaType.GRUPPI}
            onClick={() => setTipoVista(VistaType.GRUPPI)}
            title="Vista raggruppata"
          >
            <i className="bi bi-collection"></i>
          </ViewButton>
        </ButtonGroup>
      </CottureControls>
      
      {/* Rendering condizionale in base al tipo di vista */}
      <ContentArea>
        {cottureFiltrate.length === 0 ? (
          <Alert variant="info">
            Nessuna cottura corrisponde ai filtri selezionati.
          </Alert>
        ) : (
          <>
            {tipoVista === VistaType.LISTA && renderListView()}
            {tipoVista === VistaType.GRIGLIA && renderGridView()}
            {tipoVista === VistaType.GRUPPI && renderGroupView()}
          </>
        )}
      </ContentArea>
    </CottureContainer>
  );
};

export default CotturaList;
