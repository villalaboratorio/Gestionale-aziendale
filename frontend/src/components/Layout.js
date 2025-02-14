import React from 'react';
import Navbar from './Navbar';  // Assicurati che Navbar.js esista in questa cartella
import '../styles/Layout.css';  // Assicurati che Layout.css esista o crea uno stile per il layout

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />  {/* Navbar laterale visibile su tutte le pagine */}
            
            {/* Contenuto della pagina */}
            <div className="content">
                {children}  {/* Renderizza il contenuto specifico della pagina */}
            </div>
        </div>
    );
};

export default Layout;
