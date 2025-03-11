import styled from 'styled-components';
import { StatoAssemblaggio } from '../../../../../types/models.types';

export const Card = styled.div<{ $stato: StatoAssemblaggio | 'non_applicabile' }>`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  border: 1px solid ${props => {
    switch (props.$stato) {
      case StatoAssemblaggio.IN_CORSO:
        return '#f0ad4e';
      case StatoAssemblaggio.COMPLETATA:
        return '#5cb85c';
      case 'non_applicabile':
        return '#e0e0e0';
      default:
        return '#dee2e6';
    }
  }};
`;

export const CardHeader = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled.h4`
  margin: 0 0 5px 0;
  font-size: 16px;
  font-weight: 600;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6c757d;
`;

export const StatusIndicator = styled.span<{ $stato: StatoAssemblaggio | 'non_applicabile' }>`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.$stato) {
      case StatoAssemblaggio.IN_CORSO:
        return '#fff3cd';
      case StatoAssemblaggio.COMPLETATA:
        return '#d4edda';
      case 'non_applicabile':
        return '#e9ecef';
      default:
        return '#f8f9fa';
    }
  }};
  color: ${props => {
    switch (props.$stato) {
      case StatoAssemblaggio.IN_CORSO:
        return '#856404';
      case StatoAssemblaggio.COMPLETATA:
        return '#155724';
      case 'non_applicabile':
        return '#6c757d';
      default:
        return '#212529';
    }
  }};
`;

export const CardBody = styled.div`
  padding: 15px;
`;

export const FormGroup = styled.div`
  margin-bottom: 15px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 500;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

export const Checkbox = styled.input`
  margin-right: 8px;
`;

export const CardFooter = styled.div`
  padding: 15px;
  background-color: #f8f9fa;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  
  background-color: ${props => {
    switch (props.variant) {
      case 'primary':
        return '#007bff';
      case 'secondary':
        return '#6c757d';
      case 'success':
        return '#28a745';
      case 'danger':
        return '#dc3545';
      default:
        return '#007bff';
    }
  }};
  
 color: #fff;    return '#fff';
  }};
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
