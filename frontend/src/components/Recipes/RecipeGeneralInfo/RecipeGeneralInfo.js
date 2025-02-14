import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tab, Nav } from 'react-bootstrap';
import { FaBook, FaUtensils, FaList, FaClipboardList } from 'react-icons/fa';
import styled from 'styled-components';
import { useRecipeData } from './hooks/useRecipedata';
import { recipeService } from './services/recipeService';
import SubTabNav from '../../../components/common/TabNav/SubTabNav';
import RecipeHeader from './components/Header';
import BasicFields from './components/BasicFields';
import IngredientFields from '../RecipeIngredients/components/IngredientFields';
import CookingSteps from '../CookingSteps';
import PreparationSteps from '../PreparationSteps';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
    min-height: 400vh;
    scroll-behavior: smooth;
`;

const FormSection = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
`;

const StyledTabContent = styled(Tab.Content)`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 100%;
`;

const StyledTabPane = styled(Tab.Pane)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: none;
    overflow-y: auto;
    padding: ${({ theme }) => theme.spacing.lg};
   
    &.active {
        display: flex;
        flex-direction: column;
    }

    &::-webkit-scrollbar {
        width: 8px;
    }

    &::-webkit-scrollbar-track {
        background: ${({ theme }) => theme.colors.background};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: ${({ theme }) => theme.colors.border};
        border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: ${({ theme }) => theme.colors.primary}40;
    }
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.danger};
    padding: ${({ theme }) => theme.spacing.md};
    margin: ${({ theme }) => theme.spacing.md};
    background: ${({ theme }) => theme.colors.danger}15;
    border-radius: 6px;
`;

const RecipeGeneralInfo = ({
    recipeId,
    isNew,
    onEdit,
    onSave,
    onCancel,
    onDelete
}) => {
    const navigate = useNavigate();
    const ingredientiRef = useRef(null);
    const fasiRef = useRef(null);
    const cookingStepsRef = useRef();
    const [activeSubTab, setActiveSubTab] = useState('basic');
    const [isSaving, setIsSaving] = useState(false);

    const {
        editedRecipe,
        error: recipeError,
        isEditing,
        setIsEditing,
        updateRecipe,
        handleChange,
        categories,
        categoriesLoading
    } = useRecipeData(recipeId);

    const handleEdit = () => setIsEditing(true);

    const handleCancel = () => {
        if (window.confirm('Sei sicuro di voler annullare le modifiche?')) {
            setIsEditing(false);
            navigate('/ricette');
        }
    };

    const handleSave = async () => {
        if (isSaving) return;
        setIsSaving(true);
    
        try {
            // Ottieni le cotture correnti prima del salvataggio
            const currentCotture = await cookingStepsRef.current?.getCotture() || [];
            
            const recipeData = {
                ...editedRecipe,
                cotture: currentCotture  // Assicurati che le cotture siano incluse
            };
    
            if (recipeId === 'new') {
                const response = await onSave(recipeData);
                if (response?._id) {
                    await Promise.all([
                        ingredientiRef.current?.saveTempIngredienti(response._id),
                        fasiRef.current?.saveTempFasi(response._id),
                        cookingStepsRef.current?.saveTempCotture(response._id)
                    ]);
                    updateRecipe(response);
                }
            } else {
                await Promise.all([
                    ingredientiRef.current?.saveTempIngredienti(recipeId),
                    fasiRef.current?.saveTempFasi(recipeId),
                    cookingStepsRef.current?.saveTempCotture(recipeId)
                ]);
                const response = await onSave(recipeData);
                updateRecipe(response);
            }
            setTimeout(() => {
                setIsSaving(false);
                navigate('/ricette');
            }, 1500);
            return true;
        } catch (error) {
            console.error('Errore nel salvataggio della ricetta:', error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };
    
    
    

    const handleDelete = async () => {
        if (window.confirm('Sei sicuro di voler eliminare questa ricetta?')) {
            try {
                await recipeService.deleteRecipe(recipeId);
                navigate('/ricette');
            } catch (error) {
                console.error('Error deleting recipe:', error);
            }
        }
    };

    return (
        <Container>
            <RecipeHeader
                isEditing={isEditing}
                isSaving={isSaving}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />

            <FormSection>
                {(recipeError || categoriesLoading) && (
                    <ErrorMessage>
                        {recipeError || 'Caricamento categorie...'}
                    </ErrorMessage>
                )}

                <Tab.Container
                    id="recipe-subtabs"
                    activeKey={activeSubTab}
                    onSelect={setActiveSubTab}
                >
                    <SubTabNav>
                        <Nav.Item>
                            <Nav.Link eventKey="basic">
                                <FaBook /> Info Base
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="ingredients">
                                <FaList /> Ingredienti
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="steps">
                                <FaClipboardList /> Fasi Lavorazioni
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="cooking">
                                <FaUtensils /> Cottura
                            </Nav.Link>
                        </Nav.Item>
                    </SubTabNav>

                    <StyledTabContent>
                        <StyledTabPane eventKey="basic">
                            <BasicFields
                                editedRecipe={editedRecipe}
                                categories={categories}
                                isEditing={isEditing}
                                onChange={handleChange}
                            />
                        </StyledTabPane>
                        <StyledTabPane eventKey="ingredients">
                            <IngredientFields
                                ref={ingredientiRef}
                                recipeId={recipeId}
                                isEditing={isEditing}
                            />
                        </StyledTabPane>
                        <StyledTabPane eventKey="steps">
                            <PreparationSteps
                                ref={fasiRef}
                                recipeId={recipeId}
                                isEditing={isEditing}
                            />
                        </StyledTabPane>
                        <StyledTabPane eventKey="cooking">
                            <CookingSteps
                                ref={cookingStepsRef}
                                recipeId={recipeId}
                                isEditing={isEditing}
                            />
                        </StyledTabPane>
                    </StyledTabContent>
                </Tab.Container>
            </FormSection>
        </Container>
    );
};

export default RecipeGeneralInfo;
