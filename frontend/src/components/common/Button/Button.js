import styled, { css } from 'styled-components';
import theme from '../../../styles/theme';

const Button = styled.button.attrs(props => ({
  $variant: props.variant // Uso di prop transitorio
}))`
<TabButton $active={true}>Click me</TabButton>  
padding: ${theme.spacing.sm} ${theme.spacing.md};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
 background-color: ${theme.colors.primary};
  ${props => props.$variant === 'primary' && css`
    background-color: ${theme.colors.primary};
    color: white;
    &:hover {
      background-color: ${theme.colors.primary}e6;
    }
  `}

  ${props => props.$variant === 'secondary' && css`
    background-color: ${theme.colors.secondary};
    color: white;
    &:hover {
      background-color: ${theme.colors.secondary}e6;
    }
  `}

  ${props => props.size === 'sm' && css`
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    font-size: ${theme.typography.fontSize.sm};
  `}

  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
`;

export default Button;
