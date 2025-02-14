import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaPlus, FaSync } from 'react-icons/fa';
import { Button } from './atoms/index.ts';
import StatsCard from './dashboard/StatsCard';
import LavorazioniTable from './dashboard/LavorazioniTable';
import QuickFilters from './dashboard/QuickFilters';
import LoadingSpinner from '../../../components/common/Loadingspinner';
import ErrorMessage from './common/ErrorMessage';
import useDashboardLavorazioni from '../hooks/useDashboardLavorazioni';


const DashboardContainer = styled.div`
    padding: ${props => props.theme?.spacing?.lg || '2rem'};
    background: ${props => props.theme?.colors?.background || '#fff'};
    min-height: 100vh;
`;

const HeaderContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${props => props.theme?.spacing?.md || '1rem'};
`;

const Title = styled.h1`
    color: ${props => props.theme?.colors?.text?.primary || '#333'};
    margin: 0;
`;

const StatsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: ${props => props.theme?.spacing?.md || '1rem'};
    margin-bottom: ${props => props.theme?.spacing?.lg || '2rem'};
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: ${props => props.theme?.spacing?.sm || '0.5rem'};
`;

const FiltersSection = styled.div`
    background: ${props => props.theme?.colors?.surface || '#fff'};
    padding: ${props => props.theme?.spacing?.md || '1rem'};
    border-radius: ${props => props.theme?.borderRadius?.md || '8px'};
    margin-bottom: ${props => props.theme?.spacing?.lg || '2rem'};
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
`;

const LavorazioniDashboard = () => {
    const navigate = useNavigate();
    const {
        data: { lavorazioni, stats, pagination },
        filters,
        loading,
        error,
        actions
    } = useDashboardLavorazioni();

    console.log('🔍 Pre-render Dashboard:', {
        lavorazioni,
        lavorazioniCount: lavorazioni?.length,
        firstItem: lavorazioni?.[0]
    
    });
    const handleNewLavorazione = useCallback(() => {
        navigate('/lavorazioni/nuovo');
    }, [navigate]);

    const handleRowClick = useCallback((id) => {
        navigate(`/lavorazioni/${id}`);
    }, [navigate]);

    const renderStats = () => (
        <StatsGrid>
            {[
                { title: "In Attesa", value: stats?.inAttesa || 0, type: "waiting" },
                { title: "In Lavorazione", value: stats?.inLavorazione || 0, type: "processing" },
                { title: "Completate", value: stats?.completate || 0, type: "completed" },
                { title: "Totali", value: stats?.totali || 0, type: "total" }
            ].map(stat => (
                <StatsCard
                    key={stat.type}
                    {...stat}
                    loading={loading}
                />
            ))}
        </StatsGrid>
    );

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner size="large" />
            </LoadingContainer>
        );
    }

    const renderError = () => (
        <ErrorMessage 
            message={error}
            onClick={actions.refresh}
        />
    );

    if (error) {
        return renderError();
    }

    return (
        <DashboardContainer>
            <HeaderContainer>
                <Title>Dashboard Lavorazioni</Title>
                <ButtonGroup>
                    <Button
                        variant="secondary"
                        onClick={actions.refresh}
                        disabled={loading}
                        icon={<FaSync />}
                    >
                        Aggiorna
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleNewLavorazione}
                        icon={<FaPlus />}
                    >
                        Nuova Lavorazione
                    </Button>
                </ButtonGroup>
            </HeaderContainer>

            {renderStats()}
            
            <FiltersSection>
                <QuickFilters
                    filters={filters}
                    onChange={actions.updateFilters}
                    disabled={loading}
                />
            </FiltersSection>

            <LavorazioniTable
                lavorazioni={lavorazioni}
                loading={loading}
                pagination={pagination}
                onPageChange={actions.updatePagination}
                onRowClick={handleRowClick}
            />
        </DashboardContainer>
    );
};

export default React.memo(LavorazioniDashboard);
