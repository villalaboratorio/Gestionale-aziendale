import styled from 'styled-components';

// Layout Components
const Container = styled.div`
    padding: 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e2e8f0;
`;

const Title = styled.h3`
    font-size: 1.25rem;
    color: #1e293b;
    font-weight: 600;
    margin: 0;
`;

const StatsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
`;

const StatBox = styled.div`
    background: white;
    padding: 16px;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const StatLabel = styled.div`
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 8px;
`;

const StatValue = styled.div`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${({ status }) => {
        switch (status) {
            case 'complete': return '#10b981';
            case 'pending': return '#f59e0b';
            default: return '#3b82f6';
        }
    }};
`;

const TableContainer = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    overflow: hidden;
    margin-bottom: 24px;
`;

const ActionBar = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
`;

const SaveButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    color: white;
    border: none;
    cursor: pointer;
    background: ${({ variant }) => variant === 'secondary' ? '#64748b' : '#3b82f6'};

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const LastSavedText = styled.span`
    margin-left: auto;
    color: #64748b;
    font-size: 0.875rem;
`;

const useIngredientiHaccpStyles = () => ({
    Container,
    Header,
    Title,
    StatsContainer,
    StatBox,
    StatLabel,
    StatValue,
    TableContainer,
    ActionBar,
    SaveButton,
    LastSavedText
});

export default useIngredientiHaccpStyles;
