import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/lavorazioneStore'; // Importa lo store globale
import LoadingSpinner from '../../../components/common/Loadingspinner';
import LavorazioneHeader from '../components/dettaglio/header/LavorazioneHeader';
import LavorazioneTabs from '../components/dettaglio/tabs/LavorazioneTabs';
import LavorazioneActions from '../components/dettaglio/actions/LavorazioneActions';
import {
    PageContainer,
    Content,    
    ContentContainer,
    ErrorContainer
} from './@DettaglioLavorazione.styles';

const DettaglioLavorazione = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isNew = !id || id === 'new';

    // Utilizza lo store globale
    const {
        lavorazione,
        collections,
        activeTab,
        setActiveTab,
        loading,
        error,
        handleSave,
        handleDelete,
        fetchData
    } = useStore();

    // Effettua il fetch dei dati all'avvio
    useEffect(() => {
        fetchData(id);
    }, [id, fetchData]);

    // Gestione del salvataggio
    const onSave = useCallback(async () => {
        try {
            const result = await handleSave(lavorazione);
            if (isNew && result.data?._id) {
                navigate(`/lavorazioni/${result.data._id}`);
            }
        } catch (error) {
            console.error('Errore salvataggio:', error);
        }
    }, [handleSave, isNew, lavorazione, navigate]);

    // Gestione stati di loading e error
    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <ErrorContainer>{error}</ErrorContainer>;
    }

    return (
        <PageContainer>
            <Content>
                <ContentContainer>
                    <LavorazioneHeader 
                        lavorazione={lavorazione}
                        loading={loading}
                        isNew={isNew}
                    />
                    <LavorazioneTabs 
                        data={lavorazione}
                        collections={collections}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    <LavorazioneActions 
                        onSave={onSave}
                        onDelete={handleDelete}
                        loading={loading}
                        isDirty={false}
                        isNew={isNew}
                    />
                </ContentContainer>
            </Content>
        </PageContainer>
    );
};

export default DettaglioLavorazione;
