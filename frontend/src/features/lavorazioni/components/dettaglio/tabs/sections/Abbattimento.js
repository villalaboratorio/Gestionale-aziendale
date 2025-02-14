import React, { useState } from 'react';
import styled from 'styled-components';
import { Card, Input, Button,  } from '../../../atoms/index.ts';
import { FaPlus,  } from 'react-icons/fa';

const AbbattimentoContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const AbbattimentoCard = styled(Card)`
    padding: 20px;
    position: relative;
`;

const ParametriGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr 1.2fr;
    gap: 16px;
    align-items: flex-end;
    margin-top: 20px;
`;

const ActionButton = styled(Button)`
    height: 40px;
    margin-top: 22px;
`;

const Abbattimento = () => {
    const [abbattimenti, setAbbattimenti] = useState([{
        id: Date.now(),
        temperaturaIniziale: '',
        temperaturaFinale: '',
        oraInizio: '',
        oraFine: '',
        operatore: '',
        isStarted: false,
        isCompleted: false
    }]);

    const handleAddAbbattimento = () => {
        setAbbattimenti(prev => [...prev, {
            id: Date.now(),
            temperaturaIniziale: '',
            temperaturaFinale: '',
            oraInizio: '',
            oraFine: '',
            operatore: '',
            isStarted: false,
            isCompleted: false
        }]);
    };

    const handleUpdateAbbattimento = (abbattimentoId, field, value) => {
        setAbbattimenti(prev => prev.map(abb => 
            abb.id === abbattimentoId 
                ? { ...abb, [field]: value }
                : abb
        ));
    };

    const handleStartAbbattimento = (abbattimentoId) => {
        const now = new Date().toISOString().slice(0, 16);
        setAbbattimenti(prev => prev.map(abb => 
            abb.id === abbattimentoId 
                ? { ...abb, oraInizio: now, isStarted: true }
                : abb
        ));
    };

    const handleEndAbbattimento = (abbattimentoId) => {
        const now = new Date().toISOString().slice(0, 16);
        setAbbattimenti(prev => prev.map(abb => 
            abb.id === abbattimentoId 
                ? { ...abb, oraFine: now, isCompleted: true }
                : abb
        ));
    };

    return (
        <AbbattimentoContainer>
            {abbattimenti.map((abbattimento) => (
                <AbbattimentoCard key={abbattimento.id}>
                    <ParametriGrid>
                        <Input
                            type="number"
                            label="Temperatura Iniziale (°C)"
                            value={abbattimento.temperaturaIniziale}
                            onChange={(e) => handleUpdateAbbattimento(abbattimento.id, 'temperaturaIniziale', e.target.value)}
                            disabled={abbattimento.isCompleted}
                        />

                        <Input
                            type="number"
                            label="Temperatura Target (°C)"
                            value={abbattimento.temperaturaFinale}
                            onChange={(e) => handleUpdateAbbattimento(abbattimento.id, 'temperaturaFinale', e.target.value)}
                            disabled={abbattimento.isCompleted}
                        />

                        <Input
                            type="datetime-local"
                            label="Inizio Abbattimento"
                            value={abbattimento.oraInizio}
                            readOnly
                        />
                        
                        <ActionButton
                            onClick={() => handleStartAbbattimento(abbattimento.id)}
                            disabled={abbattimento.isStarted}
                        >
                            Avvia
                        </ActionButton>

                        <Input
                            type="datetime-local"
                            label="Fine Abbattimento"
                            value={abbattimento.oraFine}
                            readOnly
                        />
                        
                        <ActionButton
                            onClick={() => handleEndAbbattimento(abbattimento.id)}
                            disabled={!abbattimento.isStarted || abbattimento.isCompleted}
                        >
                            Termina
                        </ActionButton>

                        <Input
                            type="text"
                            label="Operatore"
                            value={abbattimento.operatore}
                            onChange={(e) => handleUpdateAbbattimento(abbattimento.id, 'operatore', e.target.value)}
                            disabled={abbattimento.isCompleted}
                        />
                    </ParametriGrid>
                </AbbattimentoCard>
            ))}

            <Button onClick={handleAddAbbattimento}>
                <FaPlus /> Aggiungi Abbattimento
            </Button>
        </AbbattimentoContainer>
    );
};

export default Abbattimento;
