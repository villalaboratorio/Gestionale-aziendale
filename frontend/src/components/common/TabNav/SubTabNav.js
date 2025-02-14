import styled from 'styled-components';
import { Nav } from 'react-bootstrap';

const SubTabNav = styled(Nav)`
    display: flex;
    background: ${({ theme }) => theme.colors.surface};
    width: 100%;
    padding: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0;

    .nav-item {
        flex: 1;
        display: flex;
        padding: 0 ${({ theme }) => theme.spacing.sm};
        
        &:first-child {
            padding-left: 0;
        }
        
        &:last-child {
            padding-right: 0;
        }
    }

    .nav-link {
        flex: 1;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${({ theme }) => theme.typography.fontSize.md};
        font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
        color: ${({ theme }) => theme.colors.text.secondary};
        background: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-radius: 8px;
        padding: 0 ${({ theme }) => theme.spacing.lg};
        transition: all 0.2s ease;

        &:hover {
            background: ${({ theme }) => theme.colors.background};
        }

        &[data-rr-ui-event-key="basic"].active {
            background: ${({ theme }) => theme.colors.primary};
            color: white;
            border-color: ${({ theme }) => theme.colors.primary};
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &[data-rr-ui-event-key="ingredients"].active {
            background: ${({ theme }) => theme.colors.warning};
            color: white;
            border-color: ${({ theme }) => theme.colors.warning};
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &[data-rr-ui-event-key="steps"].active {
            background: ${({ theme }) => theme.colors.info};
            color: white;
            border-color: ${({ theme }) => theme.colors.info};
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.md};
        }

        &[data-rr-ui-event-key="cooking"].active {
            background: ${({ theme }) => theme.colors.success};
            color: white;
            border-color: ${({ theme }) => theme.colors.success};
            transform: translateY(-2px);
            box-shadow: ${({ theme }) => theme.shadows.md};
        }

        svg {
            font-size: 20px;
            margin-right: ${({ theme }) => theme.spacing.md};
        }
    }
`;

SubTabNav.Item = Nav.Item;
SubTabNav.Link = Nav.Link;

export default SubTabNav;
