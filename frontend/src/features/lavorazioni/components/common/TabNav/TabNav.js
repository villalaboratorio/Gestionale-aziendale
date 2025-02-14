import styled from 'styled-components';
import { Nav } from 'react-bootstrap';

const StyledNav = styled(Nav)`
    margin: 0;
    padding: 0 40px;
    border: none;
    display: flex;
    background: ${({ theme }) => theme.colors.surface};
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    .nav-item {
        flex: 1;
        margin: 0 10px;

        &:first-child {
            margin-left: 0;
        }
        
        &:last-child {
            margin-right: 0;
        }
    }

    .nav-link {
        height: 60px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.text.secondary};
        background: ${({ theme }) => theme.colors.surface};
        border: 1px solid ${({ theme }) => theme.colors.border};
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        margin-bottom: -1px;
        padding: 0 20px;
        transition: all 0.3s ease;
        box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.05);
        cursor: pointer;

        &:hover {
            color: ${({ theme }) => theme.colors.primary};
            background: ${({ theme }) => theme.colors.background};
        }

        &.active {
            &[data-rr-ui-event-key="details"] {
                background: ${({ theme }) => theme.colors.primary};
                color: white;
                border-color: ${({ theme }) => theme.colors.primary};
            }

            &[data-rr-ui-event-key="nutrition"] {
                background: ${({ theme }) => theme.colors.success};
                color: white;
                border-color: ${({ theme }) => theme.colors.success};
            }

            &[data-rr-ui-event-key="costs"] {
                background: ${({ theme }) => theme.colors.warning};
                color: white;
                border-color: ${({ theme }) => theme.colors.warning};
            }
        }

        svg {
            font-size: 20px;
            margin-right: 8px;
        }
    }
`;

const TabNav = ({ children, ...props }) => (
    <StyledNav variant="tabs" {...props}>
        {children}
    </StyledNav>
);

TabNav.Item = Nav.Item;
TabNav.Link = Nav.Link;

export default TabNav;
