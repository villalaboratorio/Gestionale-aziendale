import React, { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useLavorazioneContext, LavorazioneProvider } from '../../../../context/LavorazioneContext';
import CotturaSection from '../../tabs/sections/cottura/index';
import useLavorazioneStore from '../../../../store/lavorazioneStore';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  padding: 16px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.errorLight};
  margin: 16px 0;
`;

const Cottura = () => {
  const { id } = useParams();
  const { data: { lavorazione } } = useLavorazioneContext();
  const { tipiCottura, fetchTipiCottura } = useLavorazioneStore();

  // Handlers per feedback utente
  const handleError = useCallback((message) => {
    toast.error(message || 'Si è verificato un errore');
  }, []);

  const handleSuccess = useCallback((message) => {
    toast.success(message);
  }, []); 

  if (!lavorazione) {
    return <ErrorMessage>Dati lavorazione non disponibili</ErrorMessage>;
  }

  return (
    <Container>
      <CotturaSection
        lavorazioneId={id}
        ricetta={lavorazione.ricetta}
        tipiCottura={tipiCottura}
        onError={handleError}
        onSuccess={handleSuccess}
        fetchTipiCottura={fetchTipiCottura}
      />
    </Container>
  );
};


const CotturaWithProvider = () => {
  return (
    <LavorazioneProvider>
      <Cottura />
    </LavorazioneProvider>
  );
};

export default CotturaWithProvider;