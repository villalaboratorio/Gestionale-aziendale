import * as React from 'react';
import { useState } from 'react';
// Usa i componenti Form direttamente da react-bootstrap
import { Card, Button, Badge, Form } from 'react-bootstrap';
import { PassaggioLavorazione, QuantityType } from '../../../../../types/models.types';

// Aggiungiamo un tipo esteso per le operazioni che include la proprietà note
interface OperazioneEstesa {
  oraInizio?: Date;
  oraFine?: Date;
  operatore?: string;
  isStarted: boolean;
  isCompleted: boolean;
  note?: string; // Aggiungiamo la proprietà note
}

interface PassaggioItemsProps {
  passaggio: PassaggioLavorazione;
  operatori: QuantityType[];
  onStartClick: (passaggioId: string, tipoOperazione: string) => void;
  onCompleteClick: (passaggioId: string, tipoOperazione: string) => void;
  onOperatoreChange: (passaggioId: string, tipoOperazione: string, operatore: string) => void;
  onAddNote: (passaggioId: string, tipoOperazione: string, note: string) => void;
}

const PassaggioItems: React.FC<PassaggioItemsProps> = ({
  passaggio,
  operatori,
  onStartClick,
  onCompleteClick,
  onOperatoreChange,
  onAddNote
}) => {
  const [noteText, setNoteText] = useState('');
  
  // Formato orario per visualizzazione
  const formatTime = (time?: Date | string) => {
    if (!time) return 'N/D';
    const date = new Date(time);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Render per ogni tipo di operazione con type assertion a OperazioneEstesa
  const renderOperazione = (
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta',
    titolo: string
  ) => {
    // Cast dell'operazione al tipo esteso
    const operazione = passaggio[tipo] as OperazioneEstesa;
    if (!operazione) return null;
    
    const { isStarted, isCompleted, oraInizio, oraFine } = operazione;
    
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{titolo}</h5>
          <Badge bg={isCompleted ? 'success' : isStarted ? 'primary' : 'secondary'}>
            {isCompleted ? 'Completato' : isStarted ? 'In corso' : 'Non iniziato'}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Form.Group className="mb-3">
            <Form.Label>Operatore</Form.Label>
            <Form.Select
              value={operazione.operatore || ''}
              onChange={(e) => onOperatoreChange(passaggio.id, tipo, e.target.value)}
              disabled={isCompleted}
            >
              <option value="">Seleziona operatore...</option>
              {operatori.map((op) => (
                <option key={op._id} value={op.name}>
                  {op.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          {/* Orari di inizio e fine */}
          {(isStarted || isCompleted) && (
            <div className="mb-3">
              {isStarted && (
                <div><strong>Inizio:</strong> {formatTime(oraInizio)}</div>
              )}
              {isCompleted && (
                <div><strong>Fine:</strong> {formatTime(oraFine)}</div>
              )}
            </div>
          )}
          
          {/* Note esistenti */}
          {operazione.note && (
            <div className="mb-3 p-2 bg-light border-start border-primary border-3">
              <h6>Note:</h6>
              <p className="mb-0" style={{ whiteSpace: 'pre-line' }}>{operazione.note}</p>
            </div>
          )}
          
          {/* Actions */}
          <div className="d-flex justify-content-between">
            <div>
              {isStarted && !isCompleted && (
                <Form.Group className="mb-2">
                  <Form.Label>Aggiungi nota</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Inserisci una nota..."
                  />
                  <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      if (noteText.trim()) {
                        onAddNote(passaggio.id, tipo, noteText);
                        setNoteText('');
                      }
                    }}
                    disabled={!noteText.trim()}
                  >
                    <i className="bi bi-plus-circle me-1"></i>
                    Aggiungi Nota
                  </Button>
                </Form.Group>
              )}
            </div>
            
            <div className="align-self-end">
              {!isStarted && (
                <Button
                  variant="primary"
                  onClick={() => onStartClick(passaggio.id, tipo)}
                  disabled={!operazione.operatore}
                >
                  <i className="bi bi-play-fill me-1"></i>
                  Avvia
                </Button>
              )}
              
              {isStarted && !isCompleted && (
                <Button
                  variant="success"
                  onClick={() => onCompleteClick(passaggio.id, tipo)}
                >
                  <i className="bi bi-check-lg me-1"></i>
                  Completa
                </Button>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  return (
    <div className="passaggio-items">
      <h4 className="mb-3">Dettaglio Passaggi</h4>
      {renderOperazione('pelaturaMondatura', 'Pelatura e Mondatura')}
      {renderOperazione('lavaggioPulizia', 'Lavaggio e Pulizia')}
      {renderOperazione('taglioMacinaAffetta', 'Taglio, Macina e Affetta')}
    </div>
  );
};

export default PassaggioItems;
