import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaClock, FaUsers, FaTags } from 'react-icons/fa';
import '../../styles/Recipes/RecipeCard.css';

const RecipeCard = ({ recipe, onDelete }) => {
    return (
        <div className="recipe-card">
            <div className="recipe-header">
                <span className="recipe-number">{recipe.numeroRicetta}</span>
                {recipe.categoria && (
                    <span className="recipe-category">
                        <FaTags className="icon" />
                        {recipe.categoria.nome}
                    </span>
                )}
            </div>

            <div className="recipe-content">
                <h3 className="recipe-title">{recipe.nome}</h3>
                
                <div className="recipe-info">
                    <div className="info-item">
                        <FaUtensils className="icon" />
                        <span>{recipe.ingredienti?.length || 0} ingredienti</span>
                    </div>
                    <div className="info-item">
                        <FaUsers className="icon" />
                        <span>{recipe.porzioni} porzioni</span>
                    </div>
                    <div className="info-item">
                        <FaClock className="icon" />
                        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {recipe.descrizione && (
                    <p className="recipe-description">{recipe.descrizione}</p>
                )}
            </div>

            <div className="recipe-actions">
                <Link 
                    to={`/ricette/${recipe._id}`} 
                    className="btn-view"
                >
                    Visualizza
                </Link>
                <button 
                    onClick={() => onDelete(recipe._id)}
                    className="btn-delete"
                >
                    Elimina
                </button>
            </div>
        </div>
    );
};

export default RecipeCard;
