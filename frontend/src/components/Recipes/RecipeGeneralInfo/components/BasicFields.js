import React from 'react';
import styled from 'styled-components';
import { FaBook, FaList, FaUsers, FaInfoCircle } from 'react-icons/fa';

const FormSection = styled.div`
    background: ${({ theme }) => theme.colors.surface};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.lg};

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.md};
    }
`;

const SectionTitle = styled.h3`
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
        font-size: ${({ theme }) => theme.typography.fontSize.md};
        margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
`;

const GridContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.md};

    @media (max-width: 1024px) {
        grid-template-columns: 1fr 1fr;
        gap: ${({ theme }) => theme.spacing.sm};
    }

    @media (max-width: 768px) {
        grid-template-columns: 1fr;
    }
`;

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const FormLabel = styled.label`
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    color: ${({ theme }) => theme.colors.text.primary};
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

const Input = styled.input`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    width: 100%;

    &:disabled {
        background: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

const Select = styled.select`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    width: 100%;
    background: white;

    &:disabled {
        background: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

const TextArea = styled.textarea`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 6px;
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    min-height: 120px;
    width: 100%;
    resize: vertical;

    &:disabled {
        background: ${({ theme }) => theme.colors.background};
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
        min-height: 100px;
    }
`;

const PortionsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const PortionField = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
`;

const FieldUnit = styled.span`
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    min-width: 80px;
`;

const TotalWeight = styled.div`
    margin-top: ${({ theme }) => theme.spacing.xs};
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const RecipeNumber = styled.div`
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border-radius: 4px;
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    @media (max-width: 768px) {
        padding: ${({ theme }) => theme.spacing.sm};
        font-size: ${({ theme }) => theme.typography.fontSize.sm};
    }
`;

const BasicFields = ({ editedRecipe = {}, categories = [], isEditing, onChange }) => {
    return (
        <FormSection>
            <SectionTitle>
                <FaBook /> Informazioni Base
            </SectionTitle>

            {editedRecipe?.numeroRicetta && (
                <RecipeNumber>
                    <FaInfoCircle /> Numero Ricetta: {editedRecipe.numeroRicetta}
                </RecipeNumber>
            )}

            <GridContainer>
                <FormGroup>
                    <FormLabel>
                        <FaBook /> Nome Ricetta
                    </FormLabel>
                    <Input
                        type="text"
                        value={editedRecipe?.nome || ''}
                        onChange={(e) => onChange('nome', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Inserisci il nome della ricetta"
                    />
                </FormGroup>
                <FormGroup>
    <FormLabel>
        <FaList /> Categoria
    </FormLabel>
    <Select
        value={editedRecipe?.categoria?._id || editedRecipe?.categoria || ''}
        onChange={(e) => onChange('categoria', e.target.value)}
        disabled={!isEditing}
    >
        <option value="">Seleziona categoria</option>
        {categories.map(cat => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
        ))}
    </Select>
</FormGroup>


                <FormGroup>
                    <FormLabel>
                        <FaUsers /> Porzioni e Grammatura
                    </FormLabel>
                    <PortionsContainer>
                        <PortionField>
                            <Input
                                type="number"
                                value={editedRecipe?.porzioni || ''}
                                onChange={(e) => onChange('porzioni', e.target.value)}
                                disabled={!isEditing}
                                min="1"
                                placeholder="N° porzioni"
                            />
                            <FieldUnit>porzioni</FieldUnit>
                        </PortionField>
                       
                        <PortionField>
                            <Input
                                type="number"
                                value={editedRecipe?.grammiPerPorzione || ''}
                                onChange={(e) => onChange('grammiPerPorzione', e.target.value)}
                                disabled={!isEditing}
                                min="0"
                                placeholder="Grammi/porzione"
                            />
                            <FieldUnit>g/porzione</FieldUnit>
                        </PortionField>

                        <TotalWeight>
                            Peso totale: {(editedRecipe?.porzioni || 0) * (editedRecipe?.grammiPerPorzione || 0)}g
                        </TotalWeight>
                    </PortionsContainer>
                </FormGroup>
            </GridContainer>

            <FormGroup>
                <FormLabel>
                    <FaInfoCircle /> Descrizione
                </FormLabel>
                <TextArea
                    value={editedRecipe?.descrizione || ''}
                    onChange={(e) => onChange('descrizione', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Inserisci una descrizione della ricetta"
                />
            </FormGroup>
        </FormSection>
    );
};

export default BasicFields;
