import React from 'react';
import { ILavorazioneParcheggiata } from '../../types/pianificazione.types';
import { 
  CardContainer, 
  CardContent, 
  InfoContent, 
  InfoRow, 
  CardActions, 
  ActionButton 
} from './LavorazioneCard.styles';

interface LavorazioneCardProps {
  lavorazione: ILavorazioneParcheggiata;
  onEdit: () => void;
  onDelete: () => void;
}

const LavorazioneCard: React.FC<LavorazioneCardProps> = ({ 
  lavorazione, 
  onEdit, 
  onDelete 
}) => {
  return (
    <CardContainer>
      <CardContent>
        <h4>{lavorazione.ricettaNome}</h4>
        <InfoContent>
          <InfoRow>
            <span>Quantità:</span>
            <strong>{lavorazione.quantitaTotale.toFixed(2)} kg</strong>
          </InfoRow>
          <InfoRow>
            <span>Porzioni:</span>
            <strong>{lavorazione.porzioniPreviste}</strong>
          </InfoRow>
          <InfoRow>
            <span>Cliente:</span>
            <strong>{lavorazione.cliente}</strong>
          </InfoRow>
        </InfoContent>
        <CardActions>
          <ActionButton 
            $variant="edit"
            onClick={onEdit}
          >
            Modifica
          </ActionButton>
          <ActionButton 
            $variant="delete"
            onClick={onDelete}
          >
            Elimina
          </ActionButton>
        </CardActions>
      </CardContent>
    </CardContainer>
  );
};

export default LavorazioneCard;
