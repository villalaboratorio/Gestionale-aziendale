import styled from 'styled-components';

export const FiltersContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  transition: all 0.3s ease;
`;

// Nuovi componenti che mancavano
export const FiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer; // Rende chiaro che è cliccabile
`;

export const FiltersTitle = styled.h5`
  margin: 0;
  font-weight: 600;
  color: #1e293b;
`;

export const CollapseButton = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background: #f1f5f9;
  }
  
  &:focus {
    outline: none;
  }
`;

export const FiltersBody = styled.div`
  padding: 20px;
  // Animazione per il collasso
  animation: fadeIn 0.2s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Il resto dei componenti rimane lo stesso
export const SearchContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;
`;

export const SearchInput = styled.div`
  position: relative;
  max-width: 500px;
  margin: 0 auto;
  
  input {
    padding-left: 2.5rem;
    height: 42px;
    font-size: 1rem;
  }
`;

export const FilterControls = styled.div`
  display: flex;
  gap: 16px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FilterGroup = styled.div`
  flex: 1;
`;

export const FormControl = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  height: 42px;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
    outline: none;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #1e293b;
  height: 42px;
  
  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37,99,235,0.1);
    outline: none;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;

export const ButtonSecondary = styled.button`
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  height: 42px;
  
  &:hover {
    background: #f8fafc;
  }
`;

export const ButtonPrimary = styled.button`
  background: #2563eb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
  height: 42px;
  
  &:hover {
    background: #1d4ed8;
  }
`;
