import React from 'react';
import {
    HeaderContainer,
    HeaderTitle,
    InfoGrid,
    InfoItem,
    StatusBadge
} from '../../../pages/@DettaglioLavorazione.styles';

const LavorazioneHeader = ({ lavorazione, loading, isNew }) => {
    console.group('🏷️ LavorazioneHeader Render');
    
    console.log('Props Ricevute:', {
        hasLavorazione: !!lavorazione,
        loading,
        isNew
    });

    console.log('Dati Lavorazione:', {
        numeroScheda: lavorazione?.numeroScheda,
        cliente: lavorazione?.cliente?.nome,
        ricetta: lavorazione?.ricetta?.nome,
        stato: {
            nome: lavorazione?.statoLavorazione?.name,
            colore: lavorazione?.statoLavorazione?.color
        }
    });

    const renderTitle = () => {
        if (isNew) {
            console.log('Rendering: Nuova Lavorazione');
            return 'Nuova Lavorazione';
        }
        console.log('Rendering: Scheda Esistente:', lavorazione?.numeroScheda);
        return `Scheda Lavorazione #${lavorazione?.numeroScheda}`;
    };

    const result = (
        <HeaderContainer>
            <HeaderTitle>
                {renderTitle()}
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

    console.log('Header Renderizzato');
    console.groupEnd();
    
    return result;
};

export default LavorazioneHeader;
