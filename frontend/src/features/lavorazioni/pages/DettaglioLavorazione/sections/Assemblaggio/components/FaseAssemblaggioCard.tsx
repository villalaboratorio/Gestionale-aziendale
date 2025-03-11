import React, { useState } from 'react';
import { useLavorazioneContext } from '../../../../../store/LavorazioneContext';
import { StatoAssemblaggio, FaseAssemblaggio } from '../../../../../types/models.types';
import { OperatoreSelect } from './OperatoreSelect';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  StatusIndicator,
  CardBody,
  FormGroup,
  Label,
  Input,
  CheckboxContainer,
  Checkbox,
  CardFooter,
  Button
} from '../components/FaseAssemblaggio.style';

interface FaseAssemblaggioCardProps {
  titolo: string;
  descrizione: string;
  fase: string;
  dati?: FaseAssemblaggio;
  stato: StatoAssemblaggio | 'non_applicabile';
  operatori: string[];
}

export const FaseAssemblaggioCard: React.FC<FaseAssemblaggioCardProps> = ({
  titolo,
  descrizione,
  fase,
  dati = {},
  stato,
  operatori
}) => {
  // Chiamiamo il context UNA SOLA VOLTA al livello superiore
  const { actions, data } = useLavorazioneContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<FaseAssemblaggio>>(dati);
  const [loading, setLoading] = useState(false);
  
  // Gestione cambio form
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Gestione cambio operatore
  const handleOperatoreChange = (operatore: string) => {
    setFormData(prev => ({ ...prev, addetto: operatore }));
  };
  
  // Avvia fase
  const handleStartFase = async () => {
    if (!formData.addetto) {
      alert('Seleziona un operatore prima di avviare la fase');
      return;
    }
    
    setLoading(true);
    
    try {
      // Usiamo data.lavorazione da context che abbiamo già ottenuto
      const lavorazioneAggiornata = { ...data.lavorazione };
      
      // Inizializza assemblaggio se non esiste
      if (!lavorazioneAggiornata.assemblaggio) {
        lavorazioneAggiornata.assemblaggio = {};
      }
      
      // Aggiorna la fase specifica
      lavorazioneAggiornata.assemblaggio[fase] = {
        ...formData,
        ore: new Date().toISOString(),
        stato: StatoAssemblaggio.IN_CORSO
      };
      
      // Salva la lavorazione aggiornata
      await actions.handleSave(lavorazioneAggiornata);
      setIsEditing(false);
    } catch (error) {
      console.error(`Errore nell'avvio della fase ${fase}:`, error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Completa fase
  const handleCompleteFase = async () => {
    setLoading(true);
    
    try {
      // Usiamo data.lavorazione da context che abbiamo già ottenuto
      const lavorazioneAggiornata = { ...data.lavorazione };
      
      // Aggiorna la fase specifica
      if (lavorazioneAggiornata.assemblaggio && lavorazioneAggiornata.assemblaggio[fase]) {
        lavorazioneAggiornata.assemblaggio[fase] = {
          ...lavorazioneAggiornata.assemblaggio[fase],
          ...formData,
          stato: StatoAssemblaggio.COMPLETATA,
          dataCompletamento: new Date().toISOString()
        };
      }
      
      // Salva la lavorazione aggiornata
      await actions.handleSave(lavorazioneAggiornata);
      setIsEditing(false);
    } catch (error) {
      console.error(`Errore nel completamento della fase ${fase}:`, error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Salva modifiche
  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Usiamo data.lavorazione da context che abbiamo già ottenuto
      const lavorazioneAggiornata = { ...data.lavorazione };
      
      // Inizializza assemblaggio se non esiste
      if (!lavorazioneAggiornata.assemblaggio) {
        lavorazioneAggiornata.assemblaggio = {};
      }
      
      // Aggiorna la fase specifica mantenendo lo stato corrente
      const statoCorrente = lavorazioneAggiornata.assemblaggio[fase]?.stato || StatoAssemblaggio.NON_INIZIATA;
      
      lavorazioneAggiornata.assemblaggio[fase] = {
        ...formData,
        stato: statoCorrente
      };
      
      // Salva la lavorazione aggiornata
      await actions.handleSave(lavorazioneAggiornata);
      setIsEditing(false);
    } catch (error) {
      console.error(`Errore nel salvataggio della fase ${fase}:`, error);
      alert(`Si è verificato un errore: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizza contenuto in base allo stato
  const renderContent = () => {
    if (isEditing) {
      return (
        <CardBody>
          <FormGroup>
            <Label htmlFor={`${fase}-operatore`}>Operatore</Label>
            <OperatoreSelect
              id={`${fase}-operatore`}
              value={formData.addetto || ''}
              operatori={operatori}
              onChange={handleOperatoreChange}
              disabled={loading}
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor={`${fase}-temperatura`}>Temperatura (°C)</Label>
            <Input
              type="number"
              id={`${fase}-temperatura`}
              name="temperatura"
              value={formData.temperatura || ''}
              onChange={handleChange}
              disabled={loading}
            />
          </FormGroup>
          
          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id={`${fase}-controlli`}
              name="controlliQualita"
              checked={!!formData.controlliQualita}
              onChange={handleChange}
              disabled={loading}
            />
            <Label htmlFor={`${fase}-controlli`}>Controlli qualità effettuati</Label>
          </CheckboxContainer>
        </CardBody>
      );
    }
    
    if (stato === 'non_applicabile') {
      return (
        <CardBody>
          <p>Fase non applicabile a questa lavorazione</p>
        </CardBody>
      );
    }
    
    return (
      <CardBody>
        <p><strong>Operatore:</strong> {dati.addetto || 'Non specificato'}</p>
        <p><strong>Temperatura:</strong> {dati.temperatura ? `${dati.temperatura}°C` : 'Non specificata'}</p>
        <p><strong>Controlli qualità:</strong> {dati.controlliQualita ? 'Effettuati' : 'Non effettuati'}</p>
        {dati.ore && <p><strong>Orario:</strong> {new Date(dati.ore).toLocaleString()}</p>}
        {dati.dataCompletamento && (
          <p><strong>Completamento:</strong> {new Date(dati.dataCompletamento).toLocaleString()}</p>
        )}
      </CardBody>
    );
  };
  
  // Renderizza i pulsanti in base allo stato
  const renderButtons = () => {
    if (isEditing) {
      return (
        <>
          <Button variant="secondary" onClick={() => setIsEditing(false)} disabled={loading}>
            Annulla
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            Salva
          </Button>
        </>
      );
    }
    
    if (stato === StatoAssemblaggio.NON_INIZIATA || stato === 'non_applicabile') {
      return (
        <>
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Configura
          </Button>
          {stato !== 'non_applicabile' && (
            <Button variant="success" onClick={handleStartFase} disabled={!dati.addetto}>
              Avvia
            </Button>
          )}
        </>
      );
    }
    
    if (stato === StatoAssemblaggio.IN_CORSO) {
      return (
        <>
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Modifica
          </Button>
          <Button variant="success" onClick={handleCompleteFase}>
            Completa
          </Button>
        </>
      );
    }
    
    if (stato === StatoAssemblaggio.COMPLETATA) {
      return (
        <Button variant="secondary" onClick={() => setIsEditing(true)}>
          Modifica
        </Button>
      );
    }
    
    return null;
  };

  return (
    <Card $stato={stato}>
      <CardHeader>
        <div>
          <CardTitle>{titolo}</CardTitle>
          <CardDescription>{descrizione}</CardDescription>
        </div>
        <StatusIndicator $stato={stato}>
          {stato === StatoAssemblaggio.NON_INIZIATA && 'Non iniziata'}
          {stato === StatoAssemblaggio.IN_CORSO && 'In corso'}
          {stato === StatoAssemblaggio.COMPLETATA && 'Completata'}
          {stato === 'non_applicabile' && 'Non applicabile'}
        </StatusIndicator>
      </CardHeader>
      
      {renderContent()}
      
      <CardFooter>
        {renderButtons()}
      </CardFooter>
    </Card>
  );
};
