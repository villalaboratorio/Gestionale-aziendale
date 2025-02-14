import React from 'react';
import PropTypes from 'prop-types';
import * as S from '../../hooks/usePassaggiLavorazioneStyles';
import PhaseControl from '../PhaseControl';

const PassaggioCard = ({ passaggio, onPhaseAction, onUpdateOperatore, disabled }) => {
    const renderPhase = (phaseKey, label) => (
        <S.Card>
            <S.PhaseLabel>{label}</S.PhaseLabel>
            <PhaseControl
                phase={passaggio[phaseKey]}
                onAction={(action) => onPhaseAction(passaggio.id, phaseKey, action)}
                onOperatorChange={(value) => onUpdateOperatore(passaggio.id, phaseKey, value)}
                disabled={disabled}
            />
            <S.StatusBadge 
                status={
                    passaggio[phaseKey].isCompleted ? 'completed' :
                    passaggio[phaseKey].isStarted ? 'in-progress' : 'pending'
                }
            >
                {passaggio[phaseKey].isCompleted ? 'Completato' :
                 passaggio[phaseKey].isStarted ? 'In Corso' : 'Da Iniziare'}
            </S.StatusBadge>
        </S.Card>
    );

    return (
        <S.Container>
            {renderPhase('pelaturaMondatura', 'Pelatura e Mondatura')}
            {renderPhase('lavaggioPulizia', 'Lavaggio e Pulizia')}
            {renderPhase('taglioMacinaAffetta', 'Taglio, Macina, Affetta')}
        </S.Container>
    );
};

PassaggioCard.propTypes = {
    passaggio: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        pelaturaMondatura: PropTypes.object.isRequired,
        lavaggioPulizia: PropTypes.object.isRequired,
        taglioMacinaAffetta: PropTypes.object.isRequired
    }).isRequired,
    onPhaseAction: PropTypes.func.isRequired,
    onUpdateOperatore: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default PassaggioCard;