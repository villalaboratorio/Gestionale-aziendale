import React from 'react';
import { useStore } from '../../../store/lavorazioneStore';
import InformazioniGenerali from './sections/InformazioniGenerali';
import IngredientiHACCP from './sections/IngredientiHACCP';
import PassaggiLavorazione from './sections/PassaggiLavorazione';
import Assemblaggio from './sections/Assemblaggio';
import Cottura from './sections/Cottura';
import Abbattimento from './sections/Abbattimento';
import styled from 'styled-components';
import { LavorazioneProvider } from '../../../context/LavorazioneContext';
const TabsContainer = styled.div`
    background-color: #f8fafc;
    min-height: 100vh;
    padding: ${({ theme }) => theme.spacing.md};
`;

const TabNav = styled.nav`
    display: flex;
    gap: 4rem;
    border-bottom: 2px solid #dee2e6;
    margin-bottom: 1.5rem;
    background: #fff;
`;

const TabButton = styled.button`
    border: none;
    border-bottom: 2px solid transparent;
    color: #495057;
    padding: 1rem 1.5rem;
    font-weight: 500;
    transition: all 0.2s ease;
    margin-bottom: -2px;
    background: transparent;
    cursor: pointer;

    &:hover {
        border-color: transparent;
        color: #2563eb;
    }

    ${({ $active }) => $active && `
        color: #2563eb;
        border-bottom: 2px solid #2563eb;
        background: transparent;
    `}

    @media (max-width: 768px) {
        padding: 0.75rem 1rem;
    }
`;

const TabContent = styled.div`
    padding: 1.5rem;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
        padding: 1rem;
    }
`;

const LavorazioneTabs = () => {
    const { activeTab, setActiveTab } = useStore();

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InformazioniGenerali />;
            case 'ingredienti':
                return <IngredientiHACCP />;
            case 'passaggi':
                return (
                    <LavorazioneProvider>
                        <PassaggiLavorazione />
                    </LavorazioneProvider>
                );
            case 'assemblaggio':
                return <Assemblaggio />;
            case 'cottura':
                return <Cottura />;
            case 'abbattimento':
                return <Abbattimento />;
            default:
                return null;
        }
    };

    return (
        <TabsContainer>
            <TabNav>
                <TabButton 
                    $active={activeTab === 'info'}
                    onClick={() => setActiveTab('info')}
                >
                    Informazioni Generali
                </TabButton>
                <TabButton 
                    $active={activeTab === 'ingredienti'}
                    onClick={() => setActiveTab('ingredienti')}
                >
                    Ingredienti HACCP
                </TabButton>
                <TabButton 
                    $active={activeTab === 'passaggi'}
                    onClick={() => setActiveTab('passaggi')}
                >
                    Passaggi Lavorazione
                </TabButton>
                <TabButton 
                    $active={activeTab === 'assemblaggio'}
                    onClick={() => setActiveTab('assemblaggio')}
                >
                    Assemblaggio
                </TabButton>
                <TabButton 
                    $active={activeTab === 'cottura'}
                    onClick={() => setActiveTab('cottura')}
                >
                    Cottura
                </TabButton>
                <TabButton 
                    $active={activeTab === 'abbattimento'}
                    onClick={() => setActiveTab('abbattimento')}
                >
                    Abbattimento
                </TabButton>
            </TabNav>
            <TabContent>
                {renderTabContent()}
            </TabContent>
        </TabsContainer>
    );
};

export default LavorazioneTabs;