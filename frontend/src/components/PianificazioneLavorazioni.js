import React from 'react';
import { PianificazioneProvider } from './PianificazioneLavorazione/context/PianificazioneContext';
import MateriePrimeList from './PianificazioneLavorazione/MateriePrimeList';
import SuggerimentiLavorazione from './PianificazioneLavorazione/SuggerimentiLavorazione';
import LavorazioniParcheggiate from './PianificazioneLavorazione/LavorazioniParcheggiate';
import styled from 'styled-components';

const PianificazioneLayout = styled.div`
    display: grid;
    grid-template-columns: 300px 1fr 400px;
    gap: 20px;
    padding: 20px;
    height: calc(100vh - 64px);
    background: ${({ theme }) => theme.colors.background};
    
    @media (max-width: 1200px) {
        grid-template-columns: 250px 1fr 350px;
    }
    
    @media (max-width: 992px) {
        grid-template-columns: 1fr;
        height: auto;
        gap: 16px;
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    height: 100%;
    overflow: hidden;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    padding: 16px;
    
    @media (max-width: 992px) {
        height: auto;
        min-height: 500px;
    }
`;

const ColumnTitle = styled.h2`
    font-size: 1.25rem;
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 16px 0;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const ColumnContent = styled.div`
    flex: 1;
    overflow-y: auto;
    padding-right: 8px;

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-track {
        background: #f1f5f9;
    }

    &::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
    }
`;

const PianificazioneContent = () => {
    return (
        <PianificazioneLayout>
            <Column>
                <ColumnTitle>Materie Prime</ColumnTitle>
                <ColumnContent>
                    <MateriePrimeList />
                </ColumnContent>
            </Column>

            <Column>
                <ColumnTitle>Suggerimenti Lavorazioni</ColumnTitle>
                <ColumnContent>
                    <SuggerimentiLavorazione />
                </ColumnContent>
            </Column>

            <Column>
                <ColumnTitle>Lavorazioni Parcheggiate</ColumnTitle>
                <ColumnContent>
                    <LavorazioniParcheggiate />
                </ColumnContent>
            </Column>
        </PianificazioneLayout>
    );
};

const PianificazioneLavorazioni = () => {
    return (
        <PianificazioneProvider>
            <PianificazioneContent />
        </PianificazioneProvider>
    );
};

export default PianificazioneLavorazioni;
