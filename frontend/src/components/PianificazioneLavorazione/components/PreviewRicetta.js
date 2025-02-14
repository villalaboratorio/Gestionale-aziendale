import React from 'react';
import './PreviewRicetta.css';
const PreviewRicetta = ({ ricetta }) => (
    <div className="ricetta-preview">
        <h5>Ingredienti:</h5>
        <ul className="ingredienti-list">
            {ricetta.ingredienti?.map((ing, index) => (
                <li key={index}>
                    {ing.nome}: {ing.quantita} {ing.unitaMisura}
                </li>
            ))}
        </ul>
    </div>
);

export default PreviewRicetta;
