import React, { useState } from 'react';
import './mockup.css';

// Dati mock
const mockMateriePrime = [
  {
    id: 1,
    nome: "Farina 00",
    disponibile: 80,
    totale: 100,
    stato: "disponibile",
    lotto: "L001"
  },
  {
    id: 2,
    nome: "Zucchero",
    disponibile: 30,
    totale: 100,
    stato: "scarso",
    lotto: "L002"
  },
  {
    id: 3,
    nome: "Uova",
    disponibile: 0,
    totale: 100,
    stato: "esaurito",
    lotto: "L003"
  }
];

const mockLavorazioni = [
  {
    id: 1,
    nome: "Impasto Base",
    cliente: "Cliente A",
    quantita: 50,
    tipo: "Impasti"
  },
  {
    id: 2,
    nome: "Crema Pasticcera",
    cliente: "Cliente B",
    quantita: 30,
    tipo: "Creme"
  }
];

const MockupLayout = () => {
  const [selectedMateriaPrima, setSelectedMateriaPrima] = useState(null);

  const handleMateriaPrimaSelect = (mp) => {
    setSelectedMateriaPrima(mp);
  };

  return (
    <div className="pianificazione-layout">
      {/* Toolbar Superiore */}
      <div className="toolbar">
        <div className="toolbar-group">
          <button className="toolbar-btn">Salva</button>
          <button className="toolbar-btn">Carica</button>
        </div>
        <div className="toolbar-group">
          <button className="toolbar-btn">Undo</button>
          <button className="toolbar-btn">Redo</button>
        </div>
        <div className="toolbar-group filters">
          <select className="filter-select">
            <option>Tutti i clienti</option>
            <option>Cliente A</option>
            <option>Cliente B</option>
          </select>
          <select className="filter-select">
            <option>Tutte le ricette</option>
            <option>Ricetta 1</option>
            <option>Ricetta 2</option>
          </select>
        </div>
        <div className="toolbar-group">
          <button className="toolbar-btn">Ottimizza</button>
          <button className="toolbar-btn">Statistiche</button>
        </div>
      </div>

      <div className="workspace">
        {/* Panel Materie Prime */}
        <div className="panel materie-prime">
          <div className="panel-header">
            <h2>Materie Prime</h2>
            <div className="quick-filters">
              <input type="text" placeholder="Cerca..." />
              <select>
                <option>Tutti i lotti</option>
                <option>Lotto A</option>
                <option>Lotto B</option>
              </select>
            </div>
          </div>
          <div className="materie-prime-list">
            {mockMateriePrime.map(mp => (
              <div 
                key={mp.id}
                className="materia-prima-card" 
                draggable
                onClick={() => handleMateriaPrimaSelect(mp)}
              >
                <div className="mp-header">
                  <h3>{mp.nome}</h3>
                  <div className={`status-indicator ${mp.stato}`}></div>
                </div>
                <div className="quantity-bar">
                  <div 
                    className="quantity-progress" 
                    style={{width: `${(mp.disponibile/mp.totale)*100}%`}}
                  ></div>
                </div>
                <div className="mp-details">
                  <span>Disp: {mp.disponibile}kg</span>
                  <span>Tot: {mp.totale}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

       {/* Area Pianificazione Centrale */}
<div className="panel planning-area">
  <div className="planning-header">
    <h2>Pianificazione</h2>
    <div className="view-controls">
      <button className="toolbar-btn">Nuova Lavorazione</button>
      <button className="toolbar-btn">Raggruppa</button>
    </div>
  </div>
  <div className="planning-grid">
    <div className="drop-area">
      {selectedMateriaPrima ? (
        <div className="planning-workspace">
          <div className="selected-material">
            <h3>{selectedMateriaPrima.nome}</h3>
            <p>Disponibile: {selectedMateriaPrima.disponibile}kg</p>
          </div>
          <div className="compatible-recipes">
            <h4>Ricette Compatibili</h4>
            <div className="recipes-grid">
              {/* Qui andranno le ricette compatibili */}
            </div>
          </div>
        </div>
      ) : (
        <div className="drop-placeholder">
          <span>Trascina qui una materia prima per iniziare la pianificazione</span>
        </div>
      )}
    </div>
  </div>
</div>

        {/* Panel Lavorazioni */}
        <div className="panel lavorazioni">
          <div className="panel-header">
            <h2>Lavorazioni Pianificate</h2>
            <div className="group-controls">
              <button className="toolbar-btn">Gruppo Cliente</button>
              <button className="toolbar-btn">Gruppo Tipo</button>
            </div>
          </div>
          <div className="lavorazioni-list">
            {mockLavorazioni.map(lav => (
              <div key={lav.id} className="lavorazione-card">
                <div className="lav-header">
                  <h3>{lav.nome}</h3>
                  <span className="lav-tipo">{lav.tipo}</span>
                </div>
                <div className="lav-details">
                  <span>Cliente: {lav.cliente}</span>
                  <span>Quantità: {lav.quantita}kg</span>
                </div>
              </div>
            ))}
          </div>
          <div className="totals">
            <div className="total-item">
              <span>Totale Kg:</span>
              <span>{mockLavorazioni.reduce((acc, lav) => acc + lav.quantita, 0)}</span>
            </div>
            <div className="total-item">
              <span>Lavorazioni:</span>
              <span>{mockLavorazioni.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupLayout;
