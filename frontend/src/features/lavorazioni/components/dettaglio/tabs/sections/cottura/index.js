import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import CotturaParameters from './components/CotturaParameters';
import CotturaTimer from './components/CotturaTimer';
import CotturaControls from './components/CotturaControls';
import CotturaForm from './components/CotturaForm';
import useCotturaState from './hooks/UseCotturaState';
import { useLavorazioneContext } from '../../../../../context/LavorazioneContext';
import RicetteApi from '../../../../../../../components/Recipes/services/RicetteApi';
import Alert from '../../../../../../../components/common/Alert/Alert';

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

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  background: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const CotturaSection = ({ lavorazioneId }) => {
  const { data: { lavorazione } } = useLavorazioneContext();
  const [ricettaState, setRicettaState] = useState({
    data: null,
    loading: true,
    error: null
  });

  const {
    cotture,
    tipiCottura,
    loading: cottureLoading,
    handleUpdateCottura,
    handleStartCottura,
    handleCompletaCottura,
    removeCottura,
    handleEdit,
    handleSave,
    handleCancel,
    isEditing,
    editingId
  } = useCotturaState(lavorazioneId);

  useEffect(() => {
    const loadRicettaData = async () => {
      if (!lavorazione?.ricetta?._id) {
        setRicettaState(prev => ({ ...prev, loading: false }));
        return;
      }

      try {
        const response = await RicetteApi.getRicettaDetails(lavorazione.ricetta._id);
        setRicettaState({
          data: response.success ? response.data : null,
          loading: false,
          error: !response.success ? 'Errore nel caricamento della ricetta' : null
        });
      } catch (error) {
        setRicettaState({
          data: null,
          loading: false,
          error: error.message
        });
      }
    };

    loadRicettaData();
  }, [lavorazione?.ricetta?._id]);

  if (ricettaState.loading && cottureLoading) {
    return <LoadingMessage>Caricamento in corso...</LoadingMessage>;
  }

  return (
    <Container>
      {ricettaState.error && (
        <Alert severity="error">{ricettaState.error}</Alert>
      )}
      
      {!cotture.length ? (
        <EmptyState>Nessuna cottura disponibile</EmptyState>
      ) : (
        cotture.map(cottura => (
          <CotturaCard key={cottura._id}>
            <CotturaParameters 
              cottura={cottura}
              ricetta={ricettaState.data}
              tipiCottura={tipiCottura}
              isEditing={isEditing && editingId === cottura._id}
              onUpdate={handleUpdateCottura}
            />
            
            {cottura.stato !== 'non_iniziata' && (
              <CotturaTimer cottura={cottura} />
            )}
            
            <CotturaControls
              cottura={cottura}
              isEditing={isEditing && editingId === cottura._id}
              onStart={handleStartCottura}
              onComplete={handleCompletaCottura}
              onEdit={handleEdit}
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={removeCottura}
              disabled={cottureLoading}
            />
          </CotturaCard>
        ))
      )}
      
      <CotturaForm
        ricetta={ricettaState.data}
        tipiCottura={tipiCottura}
        onSave={handleUpdateCottura}
      />
    </Container>
  );
};

export default React.memo(CotturaSection);
