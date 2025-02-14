import styled from 'styled-components';
import theme from '../../../styles/theme';

const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: 8px;
  box-shadow: ${theme.shadows.sm};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  padding: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border};
  font-weight: ${theme.typography.fontWeight.semibold};
`;

const CardBody = styled.div`
  padding: ${theme.spacing.md};
`;

const CardFooter = styled.div`
  padding: ${theme.spacing.md};
  border-top: 1px solid ${theme.colors.border};
`;

export { Card, CardHeader, CardBody, CardFooter };
