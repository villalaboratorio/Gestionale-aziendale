import React, { useState } from 'react';
import {
  ModalOverlay,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalBody,
  ModalFooter,
  FormGroup,
  FormLabel,
  FormTextarea,
  ErrorMessage,
  Button
} from './InterruzioneCotturaModal.styles';

interface InterruzioneCotturaModalProps {
  onConfirm: (motivazione: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const InterruzioneCotturaModal: React.FC<InterruzioneCotturaModalProps> = ({
  onConfirm, 
  onClose,
  isOpen
}) => {
  const [motivazione, setMotivazione] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validazione: la motivazione deve essere almeno 5 caratteri
    if (!motivazione.trim() || motivazione.trim().length < 5) {
      setError('Inserire una motivazione valida (minimo 5 caratteri)');
      return;
    }
    
    onConfirm(motivazione);
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay>
      <ModalContainer>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            <ModalTitle>Interruzione Cottura</ModalTitle>
            <CloseButton type="button" onClick={onClose} aria-label="Close">
              &times;
            </CloseButton>
          </ModalHeader>
          
          <ModalBody>
            <p>
              Stai interrompendo una cottura in corso. 
              Per motivi di tracciabilità HACCP, è necessario indicare la motivazione.
            </p>
            
            <FormGroup>
              <FormLabel htmlFor="motivazioneInterruzione">
                Motivazione Interruzione
              </FormLabel>
              <FormTextarea 
                id="motivazioneInterruzione"
                hasError={!!error}
                value={motivazione}
                onChange={(e) => {
                  setMotivazione(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Indica il motivo dell'interruzione..."
                required
              />
              {error && <ErrorMessage>{error}</ErrorMessage>}
            </FormGroup>
          </ModalBody>
          
          <ModalFooter>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
            >
              Annulla
            </Button>
            <Button 
              type="submit" 
              variant="warning"
            >
              Conferma Interruzione
            </Button>
          </ModalFooter>
        </form>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default InterruzioneCotturaModal;
