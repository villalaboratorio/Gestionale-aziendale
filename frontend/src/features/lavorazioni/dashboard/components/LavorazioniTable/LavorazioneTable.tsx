import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lavorazione } from '../../../types/models.types';
import {
  TableContainer,
  TableHeader,
  TableActions,
  RefreshButton,
  CardBody,
  TableResponsive,
  Table,
  TableHead,
  TableBody,
  Badge,
  DetailButton,
  LoadingState,
  EmptyState
} from './LavorazioniTable.styles';

interface LavorazioniTableProps {
  items: Lavorazione[];
  loading?: boolean;
  onRefresh: () => void;
}

export const LavorazioniTable: React.FC<LavorazioniTableProps> = React.memo(({
  items = [],
  loading = false,
  onRefresh
}) => {
  const navigate = useNavigate();

  // Debug: log della struttura del primo item per ispezione
  React.useEffect(() => {
    if (items.length > 0) {
      const item = items[0];
      console.group('Debug LavorazioniTable - Dati in arrivo');
      console.log('Primo item completo:', item);
      console.log('Proprietà statoLavorazione:', item.statoLavorazione);
      console.log('Tipo di statoLavorazione:', typeof item.statoLavorazione);
      
      if (item.statoLavorazione && typeof item.statoLavorazione === 'object') {
        console.log('Proprietà disponibili in statoLavorazione:', Object.keys(item.statoLavorazione));
        console.log('Valori in statoLavorazione:', Object.values(item.statoLavorazione));
      }
      
      // Controlliamo anche se per caso usasse 'stato' invece di 'statoLavorazione'
      console.log('Proprietà stato (se esiste):', item.stato);
      
      // Debug per data
      console.log('Data lavorazione:', item.dataLavorazione);
      console.log('Data creazione:', item.createdAt);
      console.groupEnd();
    }
  }, [items]);

  const handleDetailClick = React.useCallback((id: string) => {
    navigate(`/v2/lavorazione/${id}`);
  }, [navigate]);

  const formatDate = React.useCallback((item: Lavorazione) => {
    // Verifichiamo i possibili campi data in ordine di priorità
    const dateValue = item.dataLavorazione || item.createdAt;
    if (!dateValue) return '-';
    
    try {
      return new Date(dateValue).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      console.warn('Errore nella formattazione della data:', e);
      return '-';
    }
  }, []);

  const renderStatoBadge = React.useCallback((item: Lavorazione) => {
    // Estrai l'oggetto stato dalla lavorazione
    const statoObj: any = item.statoLavorazione;
    
    // Se non c'è stato, mostra N/D
    if (!statoObj) return <Badge variant="secondary">N/D</Badge>;
  
    // Estrai il nome dello stato
    let statoNome = '';
    let statoDisplay = 'N/D';
    
    // Ora sappiamo esattamente cosa cercare
    if (typeof statoObj === 'object' && statoObj !== null) {
      if (statoObj.name) {
        statoNome = statoObj.name.toLowerCase();
        statoDisplay = statoObj.name;
      } else if (statoObj.description) {
        statoNome = statoObj.description.toLowerCase();
        statoDisplay = statoObj.description;
      } else if (statoObj._id) {
        statoDisplay = `ID: ${statoObj._id}`;
      }
    } else if (typeof statoObj === 'string') {
      statoNome = statoObj.toLowerCase();
      statoDisplay = statoObj;
    }
    
    // Determina la variante del badge basata sul nome dello stato
    let variant: 'success' | 'primary' | 'warning' | 'danger' | 'secondary' = 'secondary';
    
    if (statoNome.includes('compl') || statoNome.includes('finit')) {
      variant = 'success';
    } else if (statoNome.includes('corso') || statoNome.includes('lavora')) {
      variant = 'primary';
    } else if (statoNome.includes('attes') || statoNome.includes('pianif')) {
      variant = 'warning';
    } else if (statoNome.includes('annul') || statoNome.includes('error')) {
      variant = 'danger';
    }
    
    return <Badge variant={variant}>{statoDisplay}</Badge>;
  }, []);
  

  return (
    <TableContainer>
      <TableHeader>
        <h3>Lavorazioni</h3>
        <TableActions>
          <RefreshButton 
            onClick={onRefresh}
            type="button"
          >
            <i className="fas fa-sync-alt"></i>
            Aggiorna
          </RefreshButton>
        </TableActions>
      </TableHeader>

      <CardBody>
        {loading ? (
          <LoadingState>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Caricamento...</span>
            </div>
            <span className="ms-2">Caricamento lavorazioni...</span>
          </LoadingState>
        ) : (
          <React.Fragment>
            <TableResponsive>
              <Table>
                <TableHead>
                  <tr>
                    <th>Scheda</th>
                    <th>Cliente</th>
                    <th>Ricetta</th>
                    <th>Tipo</th>
                    <th>Stato</th>
                    <th>Data Lavorazione</th>
                    <th>Azioni</th>
                  </tr>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <strong>{item.numeroScheda || item._id.substring(0, 8)}</strong>
                      </td>
                      <td>{item.cliente?.nome || 'N/D'}</td>
                      <td>{item.ricetta?.nome || 'N/D'}</td>
                      <td>{item.tipoLavorazione?.nome || 'Standard'}</td>
                      <td>{renderStatoBadge(item)}</td>
                      <td>{formatDate(item)}</td>
                      <td>
                        <TableActions>
                          <DetailButton 
                            onClick={() => handleDetailClick(item._id)}
                            type="button"
                          >
                            <i className="fas fa-eye"></i>
                            Dettaglio
                          </DetailButton>
                        </TableActions>
                      </td>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </TableResponsive>

            {items.length === 0 && (
              <EmptyState>
                <i className="fas fa-info-circle me-2"></i>
                Nessuna lavorazione trovata
              </EmptyState>
            )}
          </React.Fragment>
        )}
      </CardBody>
    </TableContainer>
  );
});

LavorazioniTable.displayName = 'LavorazioniTable';
