// components/atoms/Badge/index.js
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${({ variant, theme }) => {
    switch(variant) {
      case 'success': return `
        background: ${theme.colors.success}15;
        color: ${theme.colors.success};
      `;
      case 'warning': return `
        background: ${theme.colors.warning}15;
        color: ${theme.colors.warning};
      `;
      case 'error': return `
        background: ${theme.colors.danger}15;
        color: ${theme.colors.danger};
      `;
      default: return `
        background: ${theme.colors.primary}15;
        color: ${theme.colors.primary};
      `;
    }
  }}
`;

const Badge = ({ children, ...props }) => {
  return <StyledBadge {...props}>{children}</StyledBadge>;
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info'])
};

export default Badge;
