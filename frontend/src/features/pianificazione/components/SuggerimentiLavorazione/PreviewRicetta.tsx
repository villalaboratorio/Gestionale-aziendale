import React from 'react';
import { IRicetta } from '../../types/ricette.types';
import './PreviewRicetta.css';

interface PreviewRicettaProps {
    ricetta: IRicetta;
}

const PreviewRicetta: React.FC<PreviewRicettaProps> = ({ ricetta }) => {
    return (
        <div className="ricetta-preview">
            <h5>Ingredienti:</h5>
            <ul className="ingredienti-list">
                {ricetta.ingredienti?.map((ing, index) => (
                    <li key={index}>
                        {ing.ingrediente.name}: {ing.quantita} {ing.unitaMisura.abbreviation}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PreviewRicetta;
