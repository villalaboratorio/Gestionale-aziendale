import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';

const Alert = styled.div`
  padding: ${theme.spacing.md};
  border-radius: 6px;
  margin-bottom: ${theme.spacing.md};

  ${props => props.variant === 'success' && css`
    background-color: ${theme.colors.success}1a;
    color: ${theme.colors.success};
    border: 1px solid ${theme.colors.success}33;
  `}

  ${props => props.variant === 'error' && css`
    background-color: ${theme.colors.danger}1a;
    color: ${theme.colors.danger};
    border: 1px solid ${theme.colors.danger}33;
  `}

  ${props => props.variant === 'warning' && css`
    background-color: ${theme.colors.warning}1a;
    color: ${theme.colors.warning};
    border: 1px solid ${theme.colors.warning}33;
  `}

  ${props => props.variant === 'info' && css`
    background-color: ${theme.colors.primary}1a;
    color: ${theme.colors.primary};
    border: 1px solid ${theme.colors.primary}33;
  `}
`;

export default Alert;
