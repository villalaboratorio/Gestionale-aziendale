import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { usePianificazione } from '../../hooks/usePianificazione';
import { useConfermaLavorazioniActions } from '../../hooks/useConfermaLavorazioniActions';
import { logger } from '../../../../core/Path/logging/logger';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  CloseButton,
  ModalContent,
  ModalFooter,
  FormSection,
  SectionTitle,
  FormGroup,
  Label,
  Input,
  Select,
  CheckboxContainer,
  Checkbox,
  CheckboxLabel,
  DatePickerWrapper,
  WarningBox,
  RiepilogoLavorazioni,
  LavorazioneItem,
  LavorazioneInfo
} from './ConfermaLavorazione.styles';

const ConfermaLavorazione: React.FC = () => {
  const { state } = usePianificazione();
  const { lavorazioni, ui } = state;
  
  const { confirmarLavorazioni, setShowConferma } = useConfermaLavorazioniActions();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Nuovi stati per i campi aggiuntivi
  const [dataLavorazione, setDataLavorazione] = useState(new Date());
  const [dataConsegnaPrevista, setDataConsegnaPrevista] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Default a 7 giorni da oggi
  );
  const [prioritaCliente, setPrioritaCliente] = useState('media');
  const [isUrgente, setIsUrgente] = useState(false);
  const [operatore, setOperatore] = useState('');
  const [motivazioneUrgenza, setMotivazioneUrgenza] = useState('');
  
  if (!ui.showConferma) {
    return null;
  }
  
  const handleClose = () => {
    setShowConferma(false);
  };
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    
    try {
      // Aggiungi i campi extra alle lavorazioni
      const lavorazioniConCampiExtra = lavorazioni.parcheggiate.map(lav => ({
        ...lav,
        dataLavorazione: dataLavorazione.toISOString(),
        dataConsegnaPrevista: dataConsegnaPrevista.toISOString(),
        prioritaCliente,
        isUrgente,
        operatore: operatore || 'Sistema',
        motivazioneUrgenza: isUrgente ? motivazioneUrgenza : '',
      }));
      
      // Passa i campi extra alla funzione di conferma
      await confirmarLavorazioni(lavorazioniConCampiExtra);
      setShowConferma(false);
      logger.info('Lavorazioni confermate con successo');
    } catch (error) {
      logger.error('Errore durante la conferma delle lavorazioni', 
        error instanceof Error ? error : new Error(String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calcola i totali per il riepilogo
  const totali = {
    quantita: lavorazioni.parcheggiate.reduce((sum, lav) => sum + lav.quantitaTotale, 0),
    porzioni: lavorazioni.parcheggiate.reduce((sum, lav) => sum + lav.porzioniPreviste, 0),
    lavorazioni: lavorazioni.parcheggiate.length
  };
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
        <h3>Conferma Lavorazioni</h3>
          <CloseButton onClick={handleClose} disabled={isSubmitting}>×</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          <p>Stai per avviare {totali.lavorazioni} lavorazioni per un totale di {totali.quantita.toFixed(2)} kg e {totali.porzioni} porzioni.</p>
          
          {/* Sezione per i campi aggiuntivi */}
          <FormSection>
            <SectionTitle>Informazioni Aggiuntive</SectionTitle>
            
            <FormGroup>
              <Label>Data Lavorazione:</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={dataLavorazione}
                  onChange={(date: Date) => setDataLavorazione(date)}
                  dateFormat="dd/MM/yyyy"
                />
              </DatePickerWrapper>
            </FormGroup>
            
            <FormGroup>
              <Label>Data Consegna Prevista:</Label>
              <DatePickerWrapper>
                <DatePicker
                  selected={dataConsegnaPrevista}
                  onChange={(date: Date) => setDataConsegnaPrevista(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()} // Non permettere date nel passato
                />
              </DatePickerWrapper>
            </FormGroup>
            
            <FormGroup>
              <Label>Operatore:</Label>
              <Input
                type="text"
                value={operatore}
                onChange={(e) => setOperatore(e.target.value)}
                placeholder="Nome operatore"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Priorità Cliente:</Label>
              <Select 
                value={prioritaCliente}
                onChange={(e) => setPrioritaCliente(e.target.value)}
              >
                <option value="bassa">Bassa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </Select>
            </FormGroup>
            
            <CheckboxContainer>
              <Checkbox
                type="checkbox"
                id="isUrgente"
                checked={isUrgente}
                onChange={(e) => setIsUrgente(e.target.checked)}
              />
              <CheckboxLabel htmlFor="isUrgente">
                Lavorazione Urgente
              </CheckboxLabel>
            </CheckboxContainer>
            
            {isUrgente && (
              <FormGroup>
                <Label>Motivazione Urgenza:</Label>
                <Input
                  type="text"
                  value={motivazioneUrgenza}
                  onChange={(e) => setMotivazioneUrgenza(e.target.value)}
                  placeholder="Specifica il motivo dell'urgenza"
                />
              </FormGroup>
            )}
          </FormSection>
          
          <WarningBox>
            <strong>Attenzione!</strong> Questa operazione:
            <ul>
              <li>Preleverà le quantità dalle materie prime</li>
              <li>Creerà le lavorazioni nel sistema</li>
              <li>Non potrà essere annullata</li>
            </ul>
          </WarningBox>
          
          <RiepilogoLavorazioni>
            <SectionTitle>Riepilogo lavorazioni</SectionTitle>
            {lavorazioni.parcheggiate.map(lav => (
              <LavorazioneItem key={lav.id}>
                <LavorazioneInfo>
                  <span className="nome">{lav.ricettaNome}</span>
                  <span className="cliente">{lav.cliente}</span>
                  <span className="quantita">{lav.quantitaTotale.toFixed(2)} kg</span>
                  <span className="porzioni">{lav.porzioniPreviste} porzioni</span>
                </LavorazioneInfo>
              </LavorazioneItem>
            ))}
          </RiepilogoLavorazioni>
        </ModalContent>
        
        <ModalFooter>
          <button 
            className="annulla-btn" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Annulla
          </button>
          <button 
            className="conferma-btn" 
            onClick={handleConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Conferma in corso...' : 'Conferma Lavorazioni'}
          </button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default ConfermaLavorazione;
