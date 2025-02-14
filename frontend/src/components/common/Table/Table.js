import styled from 'styled-components';
import theme from '../../../styles/theme';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${theme.colors.surface};
`;

const Th = styled.th`
  padding: ${theme.spacing.sm};
  text-align: left;
  background: ${theme.colors.background};
  color: ${theme.colors.text.secondary};
  font-weight: ${theme.typography.fontWeight.semibold};
  border-bottom: 2px solid ${theme.colors.border};
`;

const Td = styled.td`
  padding: ${theme.spacing.sm};
  border-bottom: 1px solid ${theme.colors.border};
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:hover {
    background: ${theme.colors.background};
  }
`;

export { Table, Th, Td, Tr };
