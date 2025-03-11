import * as React from 'react';
import { useAbbattimento,  } from './hooks/useAbbattimento';
import { StatoAbbattimento } from '../../../../types/models.types';
import { AbbattimentoProgressChart } from './components/AbbattimentoProgressChart';
import { TemperatureDisplay } from './components/TemperatureDisplay';
import {
  Container,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  StatusBadge,
  FormGroup,
  Label,
  Input,
  Select,
  CheckboxContainer,
  Checkbox,
  TextArea,
  Button,
  TimerContainer,
  ValutazioneContainer,
  IconContainer,
  ValutazioneContent,
  ValutazioneTitle,
  ValutazioneDescription,
  SuggerimentiContainer,
  GridContainer,
} from './AbbattimentoTab.styles';

// Definizione dei tipi di alimento disponibili
const tipiAlimento = [
  { value: 'LIQUIDS', label: 'Liquido (zuppe, salse)' },
  { value: 'LIGHT_SOLID', label: 'Solido leggero (verdure)' },
  { value: 'MEDIUM_SOLID', label: 'Solido medio (carne, pasta)' },
  { value: 'DENSE_SOLID', label: 'Solido denso (arrosti, lasagne)' },
  { value: 'FROZEN', label: 'Congelato' }
];

const AbbattimentoTab: React.FC = () => {
  const {
    formData,
    loading,
    isEditing,
    operatori,
    durataStimata,
    durataEffettiva,
    temperatureReadings,
    newTemperature,
  
    valutazione,
    formatDurata,
    setIsEditing,
    setNewTemperature,
    handleChange,
    avviaAbbattimento,
    completaAbbattimento,
    registraTemperatura,
    salvaModifiche
  } = useAbbattimento();

  // Timer di abbattimento
  const [tempoTrascorso, setTempoTrascorso] = React.useState<number>(0);

  // Effetto per aggiornare il timer
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    // Avvia timer se l'abbattimento è in corso
    if (formData.stato === StatoAbbattimento.IN_CORSO && formData.inizio) {
      const inizioDate = new Date(formData.inizio);
      
      const updateTimer = () => {
        const now = new Date();
        const secondiTrascorsi = Math.floor((now.getTime() - inizioDate.getTime()) / 1000);
        setTempoTrascorso(secondiTrascorsi);
      };

      // Aggiorna subito
      updateTimer();
      
      // Aggiorna ogni secondo
      timer = setInterval(updateTimer, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [formData.stato, formData.inizio]);

  // Formatta il tempo trascorso per il timer (formato HH:MM:SS)
  const formatTempoTrascorso = (secondi: number): string => {
    const ore = Math.floor(secondi / 3600);
    const minuti = Math.floor((secondi % 3600) / 60);
    const secondiRimanenti = secondi % 60;
    
    return [
      ore.toString().padStart(2, '0'),
      minuti.toString().padStart(2, '0'),
      secondiRimanenti.toString().padStart(2, '0')
    ].join(':');
  };

  // Renderizza lo stato appropriato
  const renderStatoBadge = () => {
    let label = '';
    switch(formData.stato) {
      case StatoAbbattimento.IN_CORSO:
        label = 'In corso';
        break;
      case StatoAbbattimento.COMPLETATO:
        label = 'Completato';
        break;
      default:
        label = 'Non iniziato';
    }

    return (
      <StatusBadge $stato={formData.stato}>
        {formData.stato === StatoAbbattimento.IN_CORSO && (
          <i className="bi bi-arrow-repeat me-1" style={{ animation: 'spin 2s linear infinite' }}></i>
        )}
        {formData.stato === StatoAbbattimento.COMPLETATO && (
          <i className="bi bi-check-circle me-1"></i>
        )}
        {formData.stato === StatoAbbattimento.NON_INIZIATO && (
          <i className="bi bi-clock me-1"></i>
        )}
        {label}
      </StatusBadge>
    );
  };

  // Renderizza il form di configurazione dell'abbattimento
  const renderConfigForm = () => (
    <form onSubmit={(e) => { e.preventDefault(); avviaAbbattimento(); }}>
      <GridContainer>
        <FormGroup>
          <Label htmlFor="temperaturaIniziale">Temperatura iniziale (°C)</Label>
          <Input
            type="number"
            id="temperaturaIniziale"
            name="temperaturaIniziale"
            value={formData.temperaturaIniziale || ''}
            onChange={handleChange}
            placeholder="Es: 65"
            min="-10"
            max="300"
            required
          />
        </FormGroup>
      
        <FormGroup>
          <Label htmlFor="temperaturaFinale">Temperatura target (°C)</Label>
          <Input
            type="number"
            id="temperaturaFinale"
            name="temperaturaFinale"
            value={formData.temperaturaFinale || ''}
            onChange={handleChange}
            placeholder="Es: 3"
            min="-30"
            max="60"
            required
          />
        </FormGroup>
      </GridContainer>
    
      {/* Nuovi campi per tipoAlimento e tipoAbbattimento */}
      <GridContainer>
        <FormGroup>
          <Label htmlFor="tipoAlimento">Tipo di alimento</Label>
          <Select
            id="tipoAlimento"
            name="tipoAlimento"
            value={formData.tipoAlimento || 'MEDIUM_SOLID'}
            onChange={handleChange}
          >
            {tipiAlimento.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </Select>
          <small className="text-muted">Influenza il calcolo della velocità di abbattimento</small>
        </FormGroup>
      
        <FormGroup>
          <Label htmlFor="tipoAbbattimento">Tipo di abbattimento</Label>
          <Select
            id="tipoAbbattimento"
            name="tipoAbbattimento"
            value={formData.tipoAbbattimento || 'positivo'}
            onChange={handleChange}
          >
            <option value="positivo">Positivo (sopra 0°C)</option>
            <option value="negativo">Negativo (sotto 0°C)</option>
          </Select>
        </FormGroup>
      </GridContainer>
    
      <FormGroup>
        <Label htmlFor="addetto">Addetto all'abbattimento</Label>
        <Select
          id="addetto"
          name="addetto"
          value={formData.addetto || ''}
          onChange={handleChange}
          required
        >
          <option value="">Seleziona addetto...</option>
          {operatori.map(operatore => (
            <option key={operatore} value={operatore}>
              {operatore}
            </option>
          ))}
        </Select>
      </FormGroup>

      {formData.temperaturaIniziale && formData.temperaturaFinale && (
        <div className="alert alert-warning mt-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Completamento stimato:</strong> {
            formData.dataFineStimata ? 
              new Date(formData.dataFineStimata).toLocaleString() :
              formData.inizio && durataStimata ? 
                new Date(new Date(formData.inizio).getTime() + durataStimata * 60000).toLocaleString() :
                'N/D'
          }
          {formData.tempoResiduoStimato && (
            <div className="mt-1 small">
              Tempo residuo stimato: <strong>{formatDurata(formData.tempoResiduoStimato)}</strong>
            </div>
          )}
        </div>
      )}
    
      {/* Barra di progresso (opzionale) */}
      <div className="progress mt-2" style={{ height: '20px' }}>
        <div 
          className="progress-bar progress-bar-striped progress-bar-animated" 
          role="progressbar" 
          style={{ 
            width: `${Math.min(100, Math.round((tempoTrascorso / 60) / (formData.tempoResiduoStimato || durataStimata) * 100))}%` 
          }}
          aria-valuenow={Math.min(100, Math.round((tempoTrascorso / 60) / (formData.tempoResiduoStimato || durataStimata) * 100))}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Math.min(100, Math.round((tempoTrascorso / 60) / (formData.tempoResiduoStimato || durataStimata) * 100))}%
        </div>
      </div>
    
      <CardFooter>
        <Button 
          type="button" 
          $variant="secondary" 
          onClick={() => setIsEditing(false)}
          disabled={loading}
        >
          <i className="bi bi-x-circle"></i> Annulla
        </Button>
        <Button 
          type="submit" 
          $variant="primary" 
          disabled={loading || !formData.temperaturaIniziale || !formData.temperaturaFinale || !formData.addetto}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Avvio in corso...
            </>
          ) : (
            <>
              <i className="bi bi-play-circle"></i> Avvia Abbattimento
            </>
          )}
        </Button>
      </CardFooter>
    </form>
  );

  // Renderizza lo stato "in corso" dell'abbattimento
  const renderInCorso = () => (
    <>
      <div className="mb-4">
        <TimerContainer className="d-flex align-items-center justify-content-center">
          <i className="bi bi-stopwatch me-3"></i>
          {formatTempoTrascorso(tempoTrascorso)}
        </TimerContainer>
      </div>
      
      {/* Form per registrare temperature */}
      <div className="mb-3">
        <label htmlFor="newTemperature" className="form-label">Registra lettura temperatura (°C)</label>
        <div className="input-group">
          <input 
            type="number"
            className="form-control" 
            id="newTemperature"
            value={newTemperature} 
            onChange={(e) => setNewTemperature(e.target.value)}
            placeholder="Es: 15.5"
            min="-30"
            max="300"
            step="0.1"
          />
          <button 
            className="btn btn-primary" 
            type="button"
            onClick={registraTemperatura}
            disabled={!newTemperature}
          >
            <i className="bi bi-thermometer me-1"></i> Registra
          </button>
        </div>
      </div>
      
      {/* Visualizzazione temperature recenti con TemperatureDisplay */}
      {temperatureReadings && temperatureReadings.length > 0 && (
        <div className="mb-4">
          <p className="mb-2">Ultime temperature registrate:</p>
          <div className="d-flex flex-wrap">
            {temperatureReadings.slice(-3).map((reading, index) => (
              <div key={index} className="me-3 mb-2 text-center">
                <TemperatureDisplay
                  temperature={reading.temperatura}
                  minTemp={formData.tipoAbbattimento === 'negativo' ? -30 : 0}
                  maxTemp={formData.temperaturaIniziale || 100}
                  size="small"
                />
                <div className="small text-muted">
                  {new Date(reading.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            </div>
          </div>
        )}
        
        {/* Grafico dell'abbattimento */}
        <div className="mb-4">
          <AbbattimentoProgressChart 
            abbattimento={formData}
            readings={temperatureReadings}
          />
        </div>
        
        <GridContainer>
          <div>
            <strong>Temperatura iniziale:</strong> {formData.temperaturaIniziale}°C
          </div>
          <div>
            <strong>Temperatura target:</strong> {formData.temperaturaFinale}°C
          </div>
          <div>
            <strong>Tipo alimento:</strong> {
              tipiAlimento.find(t => t.value === formData.tipoAlimento)?.label || 
              'Solido medio (predefinito)'
            }
          </div>
          <div>
            <strong>Tipo abbattimento:</strong> {
              formData.tipoAbbattimento === 'negativo' ? 
              'Negativo (sotto 0°C)' : 'Positivo (sopra 0°C)'
            }
          </div>
          <div>
            <strong>Addetto:</strong> {formData.addetto}
          </div>
          <div>
            <strong>Inizio:</strong> {formData.inizio ? new Date(formData.inizio).toLocaleString() : 'N/D'}
          </div>
        </GridContainer>
  
        {formData.tempoResiduoStimato !== undefined && (
          <div className="alert alert-warning mt-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>Tempo residuo stimato:</strong> {formatDurata(formData.tempoResiduoStimato || 0)}
            <br />
            <strong>Completamento previsto:</strong> {
              formData.dataFineStimata ? 
              new Date(formData.dataFineStimata).toLocaleString() : 
              'N/D'
            }
          </div>
        )}
        
        <FormGroup>
          <Label htmlFor="temperaturaFinaleEffettiva">Temperatura finale effettiva (°C)</Label>
          <Input
            type="number"
            id="temperaturaFinaleEffettiva"
            name="temperaturaFinale"
            value={formData.temperaturaFinale || ''}
            onChange={handleChange}
            placeholder="Inserisci la temperatura finale effettiva"
            min={formData.tipoAbbattimento === 'negativo' ? -30 : 0}
            max={20}
          />
        </FormGroup>
        
        <CardFooter>
          <Button 
            type="button" 
            $variant="success" 
            onClick={completaAbbattimento}
            disabled={loading || !formData.temperaturaFinale}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Completamento...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle"></i> Completa Abbattimento
              </>
            )}
          </Button>
        </CardFooter>
      </>
    );
  
    // Renderizza lo stato "completato" dell'abbattimento con valutazione
    const renderCompletato = () => (
      <>
        {/* Grafico finale dell'abbattimento */}
        <div className="mb-4">
          <AbbattimentoProgressChart 
            abbattimento={formData}
            readings={temperatureReadings}
          />
        </div>
        
        <GridContainer>
          <div>
            <strong>Temperatura iniziale:</strong> {formData.temperaturaIniziale}°C
          </div>
          <div>
            <strong>Temperatura finale:</strong> {formData.temperaturaFinale}°C
          </div>
          <div>
            <strong>Tipo alimento:</strong> {
              tipiAlimento.find(t => t.value === formData.tipoAlimento)?.label || 
              'Solido medio (predefinito)'
            }
          </div>
          <div>
            <strong>Tipo abbattimento:</strong> {
              formData.tipoAbbattimento === 'negativo' ? 
              'Negativo (sotto 0°C)' : 'Positivo (sopra 0°C)'
            }
          </div>
          <div>
            <strong>Addetto:</strong> {formData.addetto}
          </div>
          <div>
            <strong>Durata stimata:</strong> {formatDurata(durataStimata)} 
          </div>
          <div>
            <strong>Durata effettiva:</strong> {formatDurata(durataEffettiva)}
          </div>
          <div>
            <strong>Inizio:</strong> {formData.inizio ? new Date(formData.inizio).toLocaleString() : 'N/D'}
          </div>
          <div>
            <strong>Fine:</strong> {formData.fine ? new Date(formData.fine).toLocaleString() : 'N/D'}
          </div>
          <div>
            <strong>Tempo totale:</strong> {formData.tempoTotale ? formatDurata(formData.tempoTotale) : 'N/D'}
          </div>
        </GridContainer>
  
        {/* Dettaglio letture registrate */}
        {temperatureReadings && temperatureReadings.length > 0 && (
          <div className="mt-4 mb-4">
            <h5>Letture temperature registrate</h5>
            <div className="table-responsive">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Orario</th>
                    <th>Temperatura</th>
                    <th>Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {temperatureReadings.map((reading, index) => {
                    const prevTemp = index > 0 ? temperatureReadings[index-1].temperatura : formData.temperaturaIniziale;
                    const delta = prevTemp !== undefined ? reading.temperatura - prevTemp : 0;
                    return (
                      <tr key={index}>
                        <td>{new Date(reading.timestamp).toLocaleString()}</td>
                        <td>{reading.temperatura}°C</td>
                        <td className={delta < 0 ? 'text-success' : delta > 0 ? 'text-danger' : ''}>
                          {delta !== 0 && (delta > 0 ? '+' : '')}{delta.toFixed(1)}°C
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
  
        {valutazione && (
          <ValutazioneContainer $valutazione={valutazione.valutazione}>
            <IconContainer>
              {valutazione.valutazione === 'ottimale' && <i className="bi bi-check-circle-fill"></i>}
              {valutazione.valutazione === 'veloce' && <i className="bi bi-speedometer"></i>}
              {valutazione.valutazione === 'lento' && <i className="bi bi-exclamation-triangle-fill"></i>}
            </IconContainer>
            <ValutazioneContent>
              <ValutazioneTitle>{valutazione.titoloValutazione}</ValutazioneTitle>
              <ValutazioneDescription>{valutazione.messaggioValutazione}</ValutazioneDescription>
              
              {valutazione.valutazione === 'lento' && (
                <SuggerimentiContainer>
                  <h6>Suggerimenti:</h6>
                  <ul className="mb-0">
                    <li>Verificare che l'abbattitore non sia sovraccarico</li>
                    <li>Controllare che le ventole funzionino correttamente</li>
                    <li>Assicurarsi che la porta sia ben chiusa</li>
                    <li>Verificare la temperatura ambientale della stanza</li>
                  </ul>
                </SuggerimentiContainer>
              )}
            </ValutazioneContent>
          </ValutazioneContainer>
        )}
        
        <FormGroup className="mt-4">
          <Label htmlFor="note">Note aggiuntive</Label>
          <TextArea
            id="note"
            name="note"
            value={formData.note || ''}
            onChange={handleChange}
            placeholder="Inserisci eventuali osservazioni sul processo di abbattimento"
          />
        </FormGroup>
        
        <FormGroup>
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="verificaTemperatura"
              name="verificaTemperatura"
              checked={formData.verificaTemperatura || false}
              onChange={handleChange}
            />
            <Label htmlFor="verificaTemperatura" style={{ marginBottom: 0 }}>
              Temperatura verificata con termometro esterno
            </Label>
          </CheckboxContainer>
        </FormGroup>
        
        {formData.verificaTemperatura && (
          <FormGroup>
            <Label htmlFor="responsabileVerifica">Responsabile verifica</Label>
            <Select
              id="responsabileVerifica"
              name="responsabileVerifica"
              value={formData.responsabileVerifica || ''}
              onChange={handleChange}
            >
              <option value="">Seleziona responsabile...</option>
              {operatori.map(operatore => (
                <option key={operatore} value={operatore}>
                  {operatore}
                </option>
              ))}
            </Select>
          </FormGroup>
        )}
        
        <CardFooter>
          <Button 
            type="button" 
            $variant="primary" 
            onClick={() => setIsEditing(true)}
            disabled={loading}
          >
            <i className="bi bi-pencil"></i> Modifica
          </Button>
          <Button 
            type="button" 
            $variant="success" 
            onClick={salvaModifiche}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvataggio...
              </>
            ) : (
              <>
                <i className="bi bi-save"></i> Salva Modifiche
              </>
            )}
          </Button>
        </CardFooter>
      </>
    );
  
    return (
      <Container className="abbattimento-tab">
        <Card $stato={formData.stato}>
          <CardHeader>
            <CardTitle>Abbattimento Temperatura</CardTitle>
            {renderStatoBadge()}
          </CardHeader>
          <CardBody>
            {/* Non iniziato, ma in modifica */}
            {formData.stato === StatoAbbattimento.NON_INIZIATO && isEditing && renderConfigForm()}
            
            {/* Non iniziato, visualizzazione */}
            {formData.stato === StatoAbbattimento.NON_INIZIATO && !isEditing && (
              <div className="text-center p-4">
                <p>Nessun abbattimento registrato per questa lavorazione.</p>
                <Button 
                  type="button" 
                  $variant="primary" 
                  onClick={() => setIsEditing(true)}
                >
                  <i className="bi bi-plus-circle"></i> Configura Abbattimento
                </Button>
              </div>
            )}
            
            {/* In corso */}
            {formData.stato === StatoAbbattimento.IN_CORSO && renderInCorso()}
            
            {/* Completato */}
            {formData.stato === StatoAbbattimento.COMPLETATO && !isEditing && renderCompletato()}
            
            {/* Modalità modifica per abbattimento completato */}
            {formData.stato === StatoAbbattimento.COMPLETATO && isEditing && renderConfigForm()}
          </CardBody>
        </Card>
      </Container>
    );
  };
  
  export default AbbattimentoTab;
  