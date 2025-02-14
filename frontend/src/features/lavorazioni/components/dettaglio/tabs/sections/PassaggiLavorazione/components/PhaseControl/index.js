import React from 'react';
import PropTypes from 'prop-types';
import * as S from '../../hooks/usePassaggiLavorazioneStyles';

const PhaseControl = ({ phase, onAction, onOperatorChange, disabled }) => {
    return (
        <S.ControlGroup>
            <S.TimeGroup>
                <S.Input
                    type="datetime-local"
                    value={phase.oraInizio || ''}
                    readOnly
                    placeholder="Ora inizio"
                />
                <S.Button
                    onClick={() => onAction('start')}
                    disabled={disabled || phase.isStarted}
                >
                    Avvia
                </S.Button>
            </S.TimeGroup>

            <S.TimeGroup>
                <S.Input
                    type="datetime-local"
                    value={phase.oraFine || ''}
                    readOnly
                    placeholder="Ora fine"
                />
                <S.Button
                    variant="end"
                    onClick={() => onAction('end')}
                    disabled={disabled || !phase.isStarted || phase.isCompleted}
                >
                    Termina
                </S.Button>
            </S.TimeGroup>

            <S.Input
                type="text"
                value={phase.operatore || ''}
                onChange={(e) => onOperatorChange(e.target.value)}
                placeholder="Operatore"
                disabled={disabled || phase.isCompleted}
            />
        </S.ControlGroup>
    );
};

PhaseControl.propTypes = {
    phase: PropTypes.shape({
        oraInizio: PropTypes.string,
        oraFine: PropTypes.string,
        operatore: PropTypes.string,
        isStarted: PropTypes.bool,
        isCompleted: PropTypes.bool
    }).isRequired,
    onAction: PropTypes.func.isRequired,
    onOperatorChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

export default PhaseControl;