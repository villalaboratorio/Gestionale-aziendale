import React from 'react';

const ValoriNutrizionaliHACCP = () => {
    return (
        <div className="valori-nutrizionali-haccp">
            <h3>Valori Nutrizionali</h3>
            <ul>
                <li>Calorie: _______ kcal</li>
                <li>Proteine: _______ g</li>
                <li>Grassi: _______ g</li>
                <li>Carboidrati: _______ g</li>
            </ul>

            <style jsx>{`
                .valori-nutrizionali-haccp {
                    margin-bottom: 20px;
                }

                ul {
                    list-style-type: square;
                    padding-left: 20px;
                }

                li {
                    margin-bottom: 10px;
                }
            `}</style>
        </div>
    );
};

export default ValoriNutrizionaliHACCP;
