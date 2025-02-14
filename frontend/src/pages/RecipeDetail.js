import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab } from 'react-bootstrap';
import { FaArrowLeft, FaPrint, FaBook, FaCalculator, FaChartPie } from 'react-icons/fa';
import styled from 'styled-components';
import RecipeGeneralInfo from '../components/Recipes/RecipeGeneralInfo/RecipeGeneralInfo';
import RecipeNutritionalInfo from '../components/Recipes/RecipeNutritionalInfo';
import RecipeCostAnalysis from '../components/Recipes/RecipeCostAnalysis';
import TabNav from '../components/common/TabNav/TabNav';

import { 
    recipeService, 
    ingredientiService, 
    fasiService 
} from '../components/Recipes/RecipeIngredients/services/apiService';

const PageContainer = styled.div`
    padding: ${({ theme }) => theme.spacing.md};
    max-width: 1200px;
    margin: 0 auto;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
`;

const BackButton = styled.button`
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.text.secondary};
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    
    &:hover {
        color: ${({ theme }) => theme.colors.text.primary};
    }
`;
const Content = styled.div`
    background: white;
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.medium};
`;

const ActionButton = styled.button`
    background: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    
    &:hover {
        background: ${({ theme }) => theme.colors.secondary};
        color: white;
    }
`;

const StyledTabContent = styled(Tab.Content)`
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
   height: calc(100vh - 200px); // Altezza dinamica in base alla viewport
    min-height: 600px;
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
`;


const SaveConfirmation = styled.div`
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: 8px;
    box-shadow: ${({ theme }) => theme.shadows.large};
    z-index: 1000;
    text-align: center;
    min-width: 300px;

    h4 {
        color: ${({ theme }) => theme.colors.text.primary};
        margin-bottom: ${({ theme }) => theme.spacing.md};
    }

    p {
        color: ${({ theme }) => theme.colors.text.secondary};
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
`;

const RecipeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('details');
    const [recipeId, setRecipeId] = useState(id);
    const [recipe, setRecipe] = useState(null);
    const [isEditing, setIsEditing] = useState(id === 'new');
    const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ loading: false, error: null });
    const fasiRef = useRef(null);
    const ingredientsRef = useRef(null);
    const cookingRef = useRef(null);

    useEffect(() => {
        const loadRecipe = async () => {
            if (recipeId && recipeId !== 'new') {
                const data = await recipeService.getRecipe(recipeId);
                setRecipe(data);
            }
        };
        loadRecipe();
    }, [recipeId]);

    const handleNavigate = () => navigate('/ricette');

    const handleSave = async (recipeData) => {
        try {
            setSaveStatus({ loading: true, error: null });
            setShowSaveConfirmation(true);
            let savedRecipe;
            
            if (recipeId === 'new') {
                const response = await recipeService.createRecipe({
                    ...recipeData,
                    stagionalita: recipeData.stagionalita || 'primavera',
                    porzioni: recipeData.porzioni || 1,
                    difficolta: recipeData.difficolta || 'facile'
                });
                savedRecipe = response;
                setRecipeId(savedRecipe._id);

                await Promise.all([
                    ingredientsRef.current?.saveTempIngredienti(savedRecipe._id),
                    fasiRef.current?.saveTempFasi(savedRecipe._id)
                ]);

                const [tempIngredients, tempFasi] = await Promise.all([
                    ingredientiService.getRecipeIngredients(savedRecipe._id),
                    fasiService.getFasi(savedRecipe._id)
                ]);

                savedRecipe = await recipeService.updateRecipe(savedRecipe._id, {
                    ...savedRecipe,
                    ingredienti: tempIngredients,
                    fasi: tempFasi
                });
            } else {
                await Promise.all([
                    ingredientsRef.current?.saveTempIngredienti(recipeId),
                    fasiRef.current?.saveTempFasi(recipeId)
                ]);

                const [tempIngredients, tempFasi] = await Promise.all([
                    ingredientiService.getRecipeIngredients(recipeId),
                    fasiService.getFasi(recipeId)
                ]);

                savedRecipe = await recipeService.updateRecipe(recipeId, {
                    ...recipeData,
                    ingredienti: tempIngredients,
                    fasi: tempFasi
                });
            }

            setIsEditing(false);
            setSaveStatus({ loading: false, error: null });
            await new Promise(resolve => setTimeout(resolve, 1000));
            return savedRecipe;
        } catch (error) {
            setSaveStatus({ loading: false, error: 'Errore durante il salvataggio' });
            console.error('Errore nel salvataggio:', error);
            throw error;
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

    useEffect(() => {
        if (id === 'new') {
            setIsEditing(true);
        }
    }, [id]);

    return (
        <PageContainer>
            <Header>
                <HeaderLeft>
                    <BackButton onClick={handleNavigate}>
                        <FaArrowLeft /> Torna alle ricette
                    </BackButton>
                </HeaderLeft>
                {recipeId && recipeId !== 'new' && (
                    <ActionButton onClick={() => window.print()}>
                        <FaPrint /> Stampa
                    </ActionButton>
                )}
            </Header>

            <Content>
    <Tab.Container 
        id="recipe-main-tabs"
        activeKey={activeTab} 
        onSelect={setActiveTab}
    >
        <TabNav>
            <TabNav.Item>
                <TabNav.Link eventKey="details">
                    <FaBook /> Dettagli Ricetta
                </TabNav.Link>
            </TabNav.Item>
            {recipeId && recipeId !== 'new' && (
                <>
                    <TabNav.Item>
                        <TabNav.Link eventKey="nutrition">
                            <FaCalculator /> Valori Nutrizionali
                        </TabNav.Link>
                    </TabNav.Item>
                    <TabNav.Item>
                    <TabNav.Link eventKey="costs">
                    <FaChartPie /> Analisi Costi
                </TabNav.Link>
            </TabNav.Item>
        </>
    )}
</TabNav>

        <StyledTabContent>
            <StyledTabPane eventKey="details">
                <RecipeGeneralInfo
                    recipeId={recipeId}
                    isEditing={isEditing}
                    onEdit={() => setIsEditing(true)}
                    onSave={handleSave}
                    onCancel={() => setIsEditing(false)}
                    onDelete={handleDelete}
                    ingredientsRef={ingredientsRef}
                    fasiRef={fasiRef}
                    cookingRef={cookingRef}
                />
            </StyledTabPane>
            {recipeId && recipeId !== 'new' && (
                <>
                    <StyledTabPane eventKey="nutrition">
                        <RecipeNutritionalInfo recipe={recipe} />
                    </StyledTabPane>
                    <StyledTabPane eventKey="costs">
                        <RecipeCostAnalysis recipe={recipe} />
                    </StyledTabPane>
                </>
            )}
        </StyledTabContent>
    </Tab.Container>
</Content>




            {showSaveConfirmation && (
                <>
                    <Overlay />
                    <SaveConfirmation>
                        <h4>
                            {saveStatus.loading ? 'Salvataggio in corso...' : 'Salvataggio completato!'}
                        </h4>
                        <p>
                            {saveStatus.loading ? 
                                'Attendere il completamento delle operazioni...' : 
                                saveStatus.error || 'La ricetta è stata salvata con successo!'
                            }
                        </p>
                    </SaveConfirmation>
                </>
            )}
        </PageContainer>
    );
};

export default RecipeDetail;
