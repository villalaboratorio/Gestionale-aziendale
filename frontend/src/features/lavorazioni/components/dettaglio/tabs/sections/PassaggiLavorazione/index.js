import React from 'react';
import usePassaggiLavorazione from './hooks/usePassaggiLavorazione';
import * as S from './hooks/usePassaggiLavorazioneStyles';
import PassaggioCard from './components/PassaggioCard';
import ErrorMessage from '../../../../common/ErrorMessage';

const PassaggiLavorazione = () => {
    const {
        passaggi,
        loading,
        error,
        handlePhaseAction,
        handleOperatorUpdate,
        addPassaggio,
        resetError
    } = usePassaggiLavorazione();

    if (!passaggi) return null;

    return (
        <S.Container>
            <S.Header>
                <S.Title>Passaggi Lavorazione</S.Title>
                <S.Button
                    onClick={addPassaggio}
                    disabled={loading}
                >
                    Aggiungi Passaggio
                </S.Button>
            </S.Header>

            {error && (
                <ErrorMessage 
                    message={error}
                    onDismiss={resetError}
                    variant="error"
                />
            )}

            <S.PhaseGrid>
                {passaggi.map((passaggio) => (
                    <PassaggioCard
                        key={passaggio.id}
                        passaggio={passaggio}
                        onPhaseAction={handlePhaseAction}
                        onUpdateOperatore={handleOperatorUpdate}
                        disabled={loading}
                    />
                ))}
            </S.PhaseGrid>
        </S.Container>
    );
};

export default PassaggiLavorazione;