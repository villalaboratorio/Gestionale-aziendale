import styled from 'styled-components';
import theme from '../../../styles/theme';

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  font-size: ${theme.typography.fontSize.md};
  border: 1px solid ${theme.colors.border};
  border-radius: 6px;
  background-color: ${theme.colors.surface};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 2px ${theme.colors.primary}33;
  }

  &::placeholder {
    color: ${theme.colors.text.secondary};
  }

  &:disabled {
    background-color: ${theme.colors.background};
    cursor: not-allowed;
  }
`;

export default Input;
