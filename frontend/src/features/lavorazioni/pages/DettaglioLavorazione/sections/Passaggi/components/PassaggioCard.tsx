import * as React from 'react';
import { Card, Button, Form, Badge, Accordion } from 'react-bootstrap';
import { PassaggioLavorazione, QuantityType } from '../../../../../types/models.types';
import { LavorazioneEvent } from '../types/lavorazioni.types';

interface PassaggioCardProps {
  passaggio: PassaggioLavorazione;
  operatori: QuantityType[];
  eventi: LavorazioneEvent[];
  onStart: (passaggioId: string, tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta') => void;
  onComplete: (passaggioId: string, tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta') => void;
  onChangeOperatore: (passaggioId: string, tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta', operatore: string) => void;
  onAddNote: (passaggioId: string, tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta', note: string) => void;
}

export const PassaggioCard: React.FC<PassaggioCardProps> = ({
  passaggio,
  operatori,
  eventi,
  onStart,
  onComplete,
  onChangeOperatore,
  onAddNote
}) => {
  const [noteText, setNoteText] = React.useState('');
  
  // Funzione per formattare orario
  const formatTime = (date?: Date | string): string => {
    if (!date) return 'N/D';
    return new Date(date).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Rendering di una singola operazione (pelatura, lavaggio, taglio)
  const renderOperazione = (
    tipo: 'pelaturaMondatura' | 'lavaggioPulizia' | 'taglioMacinaAffetta',
    titolo: string
  ) => {
    const operazione = passaggio[tipo];
    if (!operazione) return null;
    
    const isStarted = operazione.isStarted;
    const isCompleted = operazione.isCompleted;
    
    return (
      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{titolo}</h5>
          <div>
            {isCompleted ? (
              <Badge bg="success">Completato</Badge>
            ) : isStarted ? (
              <Badge bg="primary">In corso</Badge>
            ) : (
              <Badge bg="secondary">Non iniziato</Badge>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <Form.Group>
                <Form.Label>Operatore</Form.Label>
                <Form.Select 
                  value={operazione.operatore || ''}
                  onChange={(e) => onChangeOperatore(passaggio.id, tipo, e.target.value)}
                  disabled={isCompleted}
                >
                  <option value="">Seleziona operatore...</option>
                  {operatori.map(op => (
                    <option key={op._id} value={op.name}>
                      {op.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-column h-100 justify-content-end">
                <div className="text-muted">
                  {isStarted && (
                    <div>Inizio: {formatTime(operazione.oraInizio)}</div>
                  )}
                  {isCompleted && (
                    <div>Fine: {formatTime(operazione.oraFine)}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Azioni */}
          <div className="d-flex justify-content-end gap-2">
            {!isStarted && (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => onStart(passaggio.id, tipo)}
                disabled={!operazione.operatore}
              >
                <i className="bi bi-play-fill me-1"></i>
                Avvia
              </Button>
            )}
            
            {isStarted && !isCompleted && (
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => onComplete(passaggio.id, tipo)}
              >
                <i className="bi bi-check-lg me-1"></i>
                Completa
              </Button>
            )}
          </div>
          
          {/* Form per note */}
          {(isStarted || isCompleted) && (
            <div className="mt-3 pt-3 border-top">
              <Form.Group className="mb-2">
                <Form.Label>Aggiungi nota</Form.Label>
                <Form.Control
                  as="textarea" 
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Inserisci una nota su questa fase..."
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button
                  variant="outline-secondary"
                  size="sm"
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
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };
  
  return (
    <div className="passaggio-card mb-4">
      <Card>
        <Card.Header className="bg-light">
          <h4 className="mb-0">Passaggio #{passaggio.id.split('_').pop()}</h4>
        </Card.Header>
        <Card.Body>
          {renderOperazione('pelaturaMondatura', 'Pelatura e Mondatura')}
          {renderOperazione('lavaggioPulizia', 'Lavaggio e Pulizia')}
          {renderOperazione('taglioMacinaAffetta', 'Taglio, Macina e Affetta')}
          
          {/* Mini-timeline degli eventi */}
          {eventi.length > 0 && (
            <Accordion className="mt-3">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Eventi recenti ({eventi.length})</Accordion.Header>
                <Accordion.Body>
                  <ul className="list-group">
                    {eventi.slice(0, 5).map((evento, index) => (
                      <li key={index} className="list-group-item">
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{evento.description}</h6>
                          <small>{new Date(evento.timestamp).toLocaleTimeString()}</small>
                        </div>
                        {evento.note && (
                          <p className="mb-1 text-muted small">{evento.note}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
