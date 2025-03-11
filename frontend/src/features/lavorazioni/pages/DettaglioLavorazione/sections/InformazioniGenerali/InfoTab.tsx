import * as React from 'react';
import { Lavorazione } from '../../../../types/models.types';
import { useLavorazioneContext } from '../../../../store/LavorazioneContext';
import { InfoTabContent } from './InfoTabContent';
import './InfoTab.css';

// Definizione del tipo locale per i dati del form, estendendo Partial<Lavorazione>
type FormLavorazione = Partial<Lavorazione>;

export const InfoTab: React.FC = () => {
  const { 
    data: { lavorazione, collections },
    loadingStates: { operations: saving, main: isLoading },
    actions
  } = useLavorazioneContext();
  
  const [formData, setFormData] = React.useState<FormLavorazione>({});
  const [isDirty, setIsDirty] = React.useState(false);
  
  // Inizializza il form quando i dati sono disponibili
  React.useEffect(() => {
    if (lavorazione) {
      setFormData({
        numeroScheda: lavorazione.numeroScheda || '',
        statoLavorazione: lavorazione.statoLavorazione,
        ricetta: lavorazione.ricetta,
        cliente: lavorazione.cliente,
        tipoLavorazione: lavorazione.tipoLavorazione,
        operatore: lavorazione.operatore || '',
        noteProduzione: lavorazione.noteProduzione || '',
        noteAllergeni: lavorazione.noteAllergeni || '',
        noteConfezionamento: lavorazione.noteConfezionamento || '',
        isUrgente: lavorazione.isUrgente || false,
        motivazioneUrgenza: lavorazione.motivazioneUrgenza || '',
        dataConsegnaPrevista: lavorazione.dataConsegnaPrevista || '',
        prioritaCliente: lavorazione.prioritaCliente || undefined      });
    }
  }, [lavorazione]);
  
  const handleChange = (field: keyof FormLavorazione, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    actions.markTabDirty('info');
  };
  
  const handleSave = async () => {
    try {
      const backendData: FormLavorazione = {
        numeroScheda: formData.numeroScheda,
        statoLavorazione: formData.statoLavorazione,
        ricetta: formData.ricetta,
        cliente: formData.cliente,
        tipoLavorazione: formData.tipoLavorazione,
        operatore: formData.operatore,
        noteProduzione: formData.noteProduzione,
        noteAllergeni: formData.noteAllergeni,
        noteConfezionamento: formData.noteConfezionamento,
        isUrgente: formData.isUrgente,
        motivazioneUrgenza: formData.motivazioneUrgenza,
        dataConsegnaPrevista: formData.dataConsegnaPrevista,
        prioritaCliente: formData.prioritaCliente
      };
      
      await actions.handleSave(backendData);
      setIsDirty(false);
      actions.markTabValid('info');
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  };
  
  // Ora invece di renderizzare direttamente l'UI, utilizziamo InfoTabContent
  return (
    <InfoTabContent 
      formData={formData}
      collections={collections}
      isDirty={isDirty}
      saving={saving}
      onSave={handleSave}
      onChange={handleChange}
      isLoading={isLoading}
    />
  );
};
