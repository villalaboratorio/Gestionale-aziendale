import React from 'react';
import { useStore } from '../../../store/lavorazioneStore';
import {
    HeaderContainer,
    HeaderTitle,
    InfoGrid,
    InfoItem,
    StatusBadge
} from '../../../pages/@DettaglioLavorazione.styles';

const LavorazioneHeader = () => {
    // Utilizza lo store globale
    const { lavorazione, loading, error, isNew } = useStore();

    // Gestione stati di loading e error
    if (loading) {
        return <div>Caricamento in corso...</div>;
    }

    if (error) {
        return <div>Errore: {error}</div>;
    }

    if (!lavorazione && !isNew) {
        return <div>Lavorazione non trovata</div>;
    }

    return (
        <HeaderContainer>
            <HeaderTitle>
                {isNew ? 'Nuova Lavorazione' : `Scheda Lavorazione #${lavorazione.numeroScheda}`}
            </HeaderTitle>
            <InfoGrid>
                <InfoItem>
                    <strong>Cliente:</strong> {lavorazione?.cliente?.nome || '-'}
                </InfoItem>
                <InfoItem>
                    <strong>Ricetta:</strong> {lavorazione?.ricetta?.nome || '-'}
                </InfoItem>
                <InfoItem>
                    <strong>Stato:</strong>{' '}
                    <StatusBadge color={lavorazione?.statoLavorazione?.color}>
                        {lavorazione?.statoLavorazione?.name || 'Nuovo'}
                    </StatusBadge>
                </InfoItem>
            </InfoGrid>
        </HeaderContainer>
    );
};

export default LavorazioneHeader;
