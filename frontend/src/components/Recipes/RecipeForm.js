import React, { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';
import styled from 'styled-components';
import BasicInfo from './Form/BasicInfo';
import Ingredients from './Form/Ingredients';
import PreparationSteps from './Form/PreparationSteps';

const FormContainer = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const FormTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.$variant === 'secondary' 
    ? `
      background: #6c757d;
      color: white;
      &:hover { background: #5a6268; }
    `
    : `
      background: #0d6efd;
      color: white;
      &:hover { background: #0b5ed7; }
    `
  }
`;

const RecipeForm = ({ initialData, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        nome: '',
        categoria: '',
        descrizione: '',
        porzioni: 1,
        stagionalita: '',
        difficolta: '',
        tempoPreparazione: '',
        tempoCottura: '',
        temperatura: '',
        metodoCottura: '',
        ingredienti: [],
        fasiPreparazione: [],
        fasiCottura: [],
        note: '',
        ...initialData
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateStep = (type, index, value) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].map((step, i) => i === index ? value : step)
        }));
    };

    const removeStep = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const addStep = (type) => {
        setFormData(prev => ({
            ...prev,
            [type]: [...prev[type], '']
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <FormContainer>
            <FormTitle>Nuova Ricetta</FormTitle>
            <form onSubmit={handleSubmit}>
                <BasicInfo 
                    formData={formData}
                    handleInputChange={handleInputChange}
                />
                
                <Ingredients 
                    formData={formData}
                    setFormData={setFormData}
                />

                <PreparationSteps
                    formData={formData}
                    updateStep={updateStep}
                    removeStep={removeStep}
                    addStep={addStep}
                />

                <ButtonContainer>
                    <Button 
                        type="button" 
                        $variant="secondary" 
                        onClick={onCancel}
                    >
                        <FaTimes /> Annulla
                    </Button>
                    <Button type="submit">
                        <FaSave /> Salva
                    </Button>
                </ButtonContainer>
            </form>
        </FormContainer>
    );
};

export default RecipeForm;
