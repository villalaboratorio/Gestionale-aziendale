import * as React from 'react';
import { useMemo } from 'react';
import { CotturaTimer } from './CotturaTimer/CotturaTimer';
import { StatoCottura, Cottura } from '../../../../../types/models.types';
import { cotturaUtils } from '../utils/cotturaUtils';
import {
  CardContainer,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  CardFooter,
  StatoBadge,
  ActionButtonGroup,
  ActionButton,
  TableRow,
  TableCell
} from './CotturaItem.styles';

// Enum per i tipi di visualizzazione
export enum CotturaViewMode {
  ROW = 'row',    // Visualizzazione riga tabella
  CARD = 'card',  // Visualizzazione card
  GROUP = 'group' // Visualizzazione raggruppata
}

interface CotturaItemProps {
  cottura: Cottura;
  onEdit?: (cottura: Cottura) => void;
  onDelete?: (cotturaId: string) => void;
  onStart?: (cotturaId: string) => void;
  onInterrupt?: (cotturaId: string) => void;
  onComplete?: (cotturaId: string, temperaturaFinale?: number) => void;
  loading?: boolean;
  viewMode?: CotturaViewMode;
  showFullInfo?: boolean;
}

const CotturaItem: React.FC<CotturaItemProps> = ({
  cottura,
  onEdit,
  onDelete,
  onStart,
  onInterrupt,
  onComplete,
  loading = false,
  viewMode = CotturaViewMode.ROW,
}) => {
  console.log('Rendering CotturaItem:', cottura);
  
  const cotturaId = cottura._id || '';
  
  // Calcola il tempo cottura in minuti con fallback intelligente
  const tempoCotturaMinuti = useMemo(() => {
    // 1. Verifica se tempoCottura è un numero valido
    if (typeof cottura.tempoCottura === 'number' && cottura.tempoCottura > 0) {
      return cottura.tempoCottura;
    }
    
    // 2. Fallback: cerca il tempo medio nel tipo cottura
    if (cottura.tipoCottura && typeof cottura.tipoCottura === 'object') {
      const tipoCotturaObj = cottura.tipoCottura;
      if (tipoCotturaObj.tempoMedio && tipoCotturaObj.tempoMedio > 0) {
        return tipoCotturaObj.tempoMedio;
      }
      if (tipoCotturaObj.tempoMedioCottura && tipoCotturaObj.tempoMedioCottura > 0) {
        return tipoCotturaObj.tempoMedioCottura;
      }
    }
    
    // 3. Fallback finale: 60 minuti come valore predefinito
    return 60;
  }, [cottura.tempoCottura, cottura.tipoCottura]);
  
  // Calcola il tempo rimanente per la cottura, convertendo da minuti a secondi
  const calcolaTempoRimanente = (): number => {
    if (cottura.stato !== StatoCottura.IN_CORSO || !cottura.inizio) return 0;
    
    // Importante: tempoCottura è in minuti, convertiamo in secondi per il timer
    const tempoTotaleSecondi = cotturaUtils.minutiToSecondi(tempoCotturaMinuti);
    
    // DEBUG: log per verificare la conversione
    console.log('DEBUG Timer:', {
      cotturaId,
      tipoCottura: cotturaUtils.getNome(cottura.tipoCottura),
      tempoCotturaMinuti,
      tempoTotaleSecondi,
      inizioTimestamp: new Date(cottura.inizio).toISOString(),
      now: new Date().toISOString(),
      differenzaInSecondi: Math.floor((Date.now() - new Date(cottura.inizio).getTime()) / 1000)
    });
    
    const startTime = new Date(cottura.inizio).getTime();
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    
    return Math.max(0, tempoTotaleSecondi - elapsedSeconds);
  };
  
  // Il tempo rimanente in secondi
  const tempoRimanente = calcolaTempoRimanente();
  
  // Rendering del badge di stato
  const renderStatoBadge = () => {
    return <StatoBadge $stato={cottura.stato}>
      {cottura.stato === StatoCottura.NON_INIZIATA ? 'Non iniziata' :
       cottura.stato === StatoCottura.IN_CORSO ? 'In corso' :
       'Completata'}
    </StatoBadge>;
  };

  // Rendering delle azioni
  const renderActions = () => (
    <ActionButtonGroup>
      {cottura.stato === StatoCottura.NON_INIZIATA && (
        <>
          <ActionButton 
            variant="primary" 
            onClick={() => onStart?.(cotturaId)}
            disabled={loading}
            title="Avvia cottura"
          >
            <i className="bi bi-play-fill"></i>
          </ActionButton>
          <ActionButton 
            variant="secondary" 
            onClick={() => onEdit?.(cottura)}
            disabled={loading}
            title="Modifica"
          >
            <i className="bi bi-pencil"></i>
          </ActionButton>
          <ActionButton 
            variant="danger" 
            onClick={() => onDelete?.(cotturaId)}
            disabled={loading}
            title="Elimina"
          >
            <i className="bi bi-trash"></i>
          </ActionButton>
        </>
      )}
      
      {cottura.stato === StatoCottura.IN_CORSO && (
        <>
          <ActionButton 
            variant="success" 
            onClick={() => onComplete?.(cotturaId)}
            disabled={loading}
            title="Completa"
          >
            <i className="bi bi-check-lg"></i>
          </ActionButton>
          <ActionButton 
            variant="warning" 
            onClick={() => onInterrupt?.(cotturaId)}
            disabled={loading}
            title="Interrompi"
          >
            <i className="bi bi-pause-fill"></i>
          </ActionButton>
        </>
      )}
    </ActionButtonGroup>
  );

  // Debugging dell'oggetto cottura
  React.useEffect(() => {
    console.log('Debug CotturaItem:');
    console.log('- Nome tipo cottura:', cotturaUtils.getNome(cottura.tipoCottura));
    console.log('- Temperatura:', cotturaUtils.getTemperatura(cottura));
    console.log('- Tempo cottura (minuti, dal DB):', cottura.tempoCottura);
    console.log('- Tempo cottura con fallback (minuti):', tempoCotturaMinuti);
    console.log('- Tempo convertito per timer (secondi):', cotturaUtils.minutiToSecondi(tempoCotturaMinuti));
    console.log('- Addetto:', cottura.addetto);
    if (cottura.stato === StatoCottura.IN_CORSO && cottura.inizio) {
      console.log('- Inizio cottura:', new Date(cottura.inizio).toISOString());
      console.log('- Tempo trascorso (minuti):', Math.floor((Date.now() - new Date(cottura.inizio).getTime()) / 60000));
    }
  }, [cottura, tempoCotturaMinuti]);

  // Rendering come riga di tabella
  if (viewMode === CotturaViewMode.ROW) {
    return (
      <TableRow $stato={cottura.stato}>
        <TableCell>{cotturaUtils.getNome(cottura.tipoCottura)}</TableCell>
        <TableCell>{cotturaUtils.getTemperatura(cottura)}°C</TableCell>
        <TableCell>{tempoCotturaMinuti} min</TableCell>
        <TableCell>{cottura.addetto}</TableCell>
        <TableCell>{renderStatoBadge()}</TableCell>
        <TableCell>
          <CotturaTimer 
            cotturaId={cotturaId}
            stato={cottura.stato}
            inizio={cottura.inizio}
            tempoCottura={tempoCotturaMinuti}
            cottureAttive={cottura.stato === StatoCottura.IN_CORSO}
            tempoRimanente={tempoRimanente}
          />
        </TableCell>
        <TableCell>{renderActions()}</TableCell>
      </TableRow>
    );
  }

  // Rendering come card
  if (viewMode === CotturaViewMode.CARD) {
    return (
      <CardContainer className="col-md-4 col-sm-6">
        <Card $stato={cottura.stato}>
          <CardHeader>
            <CardTitle>{cotturaUtils.getNome(cottura.tipoCottura)}</CardTitle>
            {renderStatoBadge()}
          </CardHeader>
          <CardBody>
            <CardText>Temperatura: {cotturaUtils.getTemperatura(cottura)}°C</CardText>
            <CardText>Tempo cottura: {tempoCotturaMinuti} min</CardText>
            <CardText>Addetto: {cottura.addetto}</CardText>
            <div className="mb-3">
              <CotturaTimer 
                cotturaId={cotturaId}
                stato={cottura.stato}
                inizio={cottura.inizio}
                tempoCottura={tempoCotturaMinuti}
                cottureAttive={cottura.stato === StatoCottura.IN_CORSO}
                tempoRimanente={tempoRimanente}
              />
            </div>
          </CardBody>
          <CardFooter>
            {renderActions()}
          </CardFooter>
        </Card>
      </CardContainer>
    );
  }

  // Rendering per gruppo
  if (viewMode === CotturaViewMode.GROUP) {
    return (
      <TableRow $stato={cottura.stato}>
        <TableCell>{cotturaUtils.getTemperatura(cottura)}°C</TableCell>
        <TableCell>{tempoCotturaMinuti} min</TableCell>
        <TableCell>{cottura.addetto}</TableCell>
        <TableCell>{renderStatoBadge()}</TableCell>
        <TableCell>
          <CotturaTimer 
            cotturaId={cotturaId}
            stato={cottura.stato}
            inizio={cottura.inizio}
            tempoCottura={tempoCotturaMinuti}
            cottureAttive={cottura.stato === StatoCottura.IN_CORSO}
            tempoRimanente={tempoRimanente}
          />
        </TableCell>
        <TableCell>{renderActions()}</TableCell>
      </TableRow>
    );
  }

  return null; // Non dovrebbe mai arrivare qui
};

export default CotturaItem;
