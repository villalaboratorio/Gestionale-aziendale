import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25em 0.65em;
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: 4px;
  
  ${props => props.variant === 'primary' && css`
    background-color: ${theme.colors.primary};
    color: white;
  `}

  ${props => props.variant === 'success' && css`
    background-color: ${theme.colors.success};
    color: white;
  `}

  ${props => props.variant === 'warning' && css`
    background-color: ${theme.colors.warning};
    color: white;
  `}

  ${props => props.variant === 'danger' && css`
    background-color: ${theme.colors.danger};
    color: white;
  `}
`;

export default Badge;
