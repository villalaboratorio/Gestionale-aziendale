import React from 'react';
import styled from 'styled-components';
import CotturaParameters from './components/CotturaParameters';
import CotturaTimer from './components/CotturaTimer';
import CotturaControls from './components/CotturaControls';
import CotturaForm from './components/CotturaForm';
import useCotturaState from './hooks/UseCotturaState';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const CotturaCard = styled.div`
  background: ${({ theme }) => theme.colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const LoadingMessage = styled.div`
  padding: 20px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CotturaSection = ({ 
  lavorazioneId, 
  ricetta, 
  tipiCottura, 
  onError, 
  onSuccess, 
  fetchTipiCottura 
}) => {
  const {
    cotture,
    loading,
    editingId,
    handleEdit,
    handleSave,
    handleCancel,
    handleStartCottura,
    handleCompletaCottura,
    removeCottura
  } = useCotturaState(lavorazioneId);

  React.useEffect(() => {
    fetchTipiCottura().catch(() => 
      onError('Errore nel caricamento dei tipi cottura')
    );
  }, [fetchTipiCottura, onError]);

  if (loading) return <LoadingMessage>Caricamento cotture in corso...</LoadingMessage>;

  const handleCotturaStart = async (cotturaId) => {
    try {
      await handleStartCottura(cotturaId);
      onSuccess('Cottura avviata con successo');
    } catch {
      onError('Errore nell\'avvio della cottura');
    }
  };

  const handleCotturaComplete = async (cotturaId) => {
    try {
      await handleCompletaCottura(cotturaId);
      onSuccess('Cottura completata con successo');
    } catch {
      onError('Errore nel completamento della cottura');
    }
  };

  const handleCotturaDelete = async (cotturaId) => {
    try {
      await removeCottura(cotturaId);
      onSuccess('Cottura eliminata con successo');
    } catch {
      onError('Errore nell\'eliminazione della cottura');
    }
  };

  return (
    <Container>
      {cotture.map(cottura => (
        <CotturaCard key={cottura._id}>
          <CotturaParameters 
            cottura={cottura}
            ricetta={ricetta}
            isEditing={editingId === cottura._id}
            tipiCottura={tipiCottura}
            onUpdate={(field, value) => handleEdit(cottura._id, { [field]: value })}
          />
          
          {cottura.stato !== 'non_iniziata' && (
            <CotturaTimer cottura={cottura} />
          )}
          
          <CotturaControls
            cottura={cottura}
            isEditing={editingId === cottura._id}
            onStart={() => handleCotturaStart(cottura._id)}
            onComplete={() => handleCotturaComplete(cottura._id)}
            onEdit={() => handleEdit(cottura._id)}
            onSave={() => handleSave(cottura._id)}
            onCancel={handleCancel}
            onDelete={() => handleCotturaDelete(cottura._id)}
          />
        </CotturaCard>
      ))}

      <CotturaForm
        ricetta={ricetta}
        tipiCottura={tipiCottura}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </Container>
  );
};

export default React.memo(CotturaSection);
