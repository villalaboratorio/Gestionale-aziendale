import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Input, Button } from '../../../atoms/index.ts';
import { FaPlus } from 'react-icons/fa';

const AssemblaggioContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const AssemblaggioCard = styled(Card)`
    padding: 20px;
`;

const PhaseGrid = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 0.8fr 1.5fr 0.8fr 1.2fr;
    gap: 16px;
    align-items: flex-end;
    margin-top: 20px;
    padding: 10px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const PhaseLabel = styled.h3`
    grid-column: 1 / -1;
    margin: 0;
    color: ${({ theme }) => theme.colors.primary};
`;

const ActionButton = styled(Button)`
    height: 40px;
    margin-top: 22px;
`;

const Assemblaggio = () => {
    const [assemblaggi, setAssemblaggi] = useState([{
        id: Date.now(),
        aCrudo: {
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        },
        dopoCotturaParziale1: {
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        },
        dopoCotturaParziale2: {
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        },
        dopoCotturaCompleta: {
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        },
        cottura: {
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        }
    }]);

    const handlePhaseAction = (assemblaggioId, phase, action) => {
        const now = new Date().toISOString().slice(0, 16);
        setAssemblaggi(prev => prev.map(ass => {
            if (ass.id !== assemblaggioId) return ass;
            return {
                ...ass,
                [phase]: {
                    ...ass[phase],
                    ...(action === 'start' ? {
                        oraInizio: now,
                        isStarted: true
                    } : {
                        oraFine: now,
                        isCompleted: true
                    })
                }
            };
        }));
    };

    const handleUpdateOperatore = (assemblaggioId, phase, operatore) => {
        setAssemblaggi(prev => prev.map(ass => {
            if (ass.id !== assemblaggioId) return ass;
            return {
                ...ass,
                [phase]: {
                    ...ass[phase],
                    operatore
                }
            };
        }));
    };

    const renderPhase = (assemblaggio, phase, label) => (
        <PhaseGrid>
            <PhaseLabel>{label}</PhaseLabel>
            <Input
                type="datetime-local"
                label="Inizio"
                value={assemblaggio[phase].oraInizio}
                readOnly
            />
            <ActionButton
                onClick={() => handlePhaseAction(assemblaggio.id, phase, 'start')}
                disabled={assemblaggio[phase].isStarted}
            >
                Avvia
            </ActionButton>
            <Input
                type="datetime-local"
                label="Fine"
                value={assemblaggio[phase].oraFine}
                readOnly
            />
            <ActionButton
                onClick={() => handlePhaseAction(assemblaggio.id, phase, 'end')}
                disabled={!assemblaggio[phase].isStarted || assemblaggio[phase].isCompleted}
            >
                Termina
            </ActionButton>
            <Input
                type="text"
                label="Operatore"
                value={assemblaggio[phase].operatore}
                onChange={(e) => handleUpdateOperatore(assemblaggio.id, phase, e.target.value)}
                disabled={assemblaggio[phase].isCompleted}
            />
        </PhaseGrid>
    );

    return (
        <AssemblaggioContainer>
            {assemblaggi.map((assemblaggio) => (
                <AssemblaggioCard key={assemblaggio.id}>
                    {renderPhase(assemblaggio, 'aCrudo', 'Assemblaggio a Crudo')}
                    {renderPhase(assemblaggio, 'dopoCotturaParziale1', 'Dopo Cottura Parziale 1')}
                    {renderPhase(assemblaggio, 'dopoCotturaParziale2', 'Dopo Cottura Parziale 2')}
                    {renderPhase(assemblaggio, 'dopoCotturaCompleta', 'Dopo Cottura Completa')}
                    {renderPhase(assemblaggio, 'cottura', 'Cottura')}
                </AssemblaggioCard>
            ))}

            <Button onClick={() => setAssemblaggi(prev => [...prev, {
                id: Date.now(),
                aCrudo: { oraInizio: '', oraFine: '', operatore: '', isStarted: false, isCompleted: false },
                dopoCotturaParziale1: { oraInizio: '', oraFine: '', operatore: '', isStarted: false, isCompleted: false },
                dopoCotturaParziale2: { oraInizio: '', oraFine: '', operatore: '', isStarted: false, isCompleted: false },
                dopoCotturaCompleta: { oraInizio: '', oraFine: '', operatore: '', isStarted: false, isCompleted: false },
                seguecottura: { oraInizio: '', oraFine: '', operatore: '', isStarted: false, isCompleted: false }
            }])}>
                <FaPlus /> Aggiungi Assemblaggio
            </Button>
        </AssemblaggioContainer>
    );
};

export default Assemblaggio;
