import React, { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import RecipeGeneralInfo from './TabComponents/RecipeGeneralInfo';
import RecipeIngredientsAndCosts from './RecipeIngredientsAndCosts';
import RecipePreparation from './RecipePreparation';
import RecipeCostAnalysis from './RecipeCostAnalysis';
import RecipeReports from './TabComponents/RecipeReports';

const RecipeTabs = ({ recipe, isNew, onUpdate }) => {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="recipe-tabs-container">
            <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
            >
                <Tab eventKey="general" title="Informazioni Generali">
                    <RecipeGeneralInfo 
                        recipe={recipe} 
                        onUpdate={onUpdate}
                    />
                </Tab>

                <Tab eventKey="ingredients" title="Ingredienti">
                    <RecipeIngredientsAndCosts 
                        recipe={recipe}
                        onUpdate={onUpdate}
                    />
                </Tab>

                <Tab eventKey="preparation" title="Fasi Operative">
                    <RecipePreparation 
                        recipe={recipe}
                        onUpdate={onUpdate}
                    />
                </Tab>

                <Tab eventKey="costs" title="Food Cost">
                    <RecipeCostAnalysis recipe={recipe} />
                </Tab>

                <Tab eventKey="reports" title="Report">
                    <RecipeReports recipe={recipe} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default RecipeTabs;
