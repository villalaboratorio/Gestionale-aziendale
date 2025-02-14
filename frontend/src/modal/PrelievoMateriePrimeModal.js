import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/PrelievoMateriePrimeModal.css';

const PrelievoMateriePrimeModal = ({ isOpen, onClose, onConfirm }) => {
    const [materiePrime, setMateriePrime] = useState([]);
    const [selectedMateria, setSelectedMateria] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchMateriePrime = async () => {
        try {
            const response = await axios.get('/api/materie-prime');
            setMateriePrime(response.data.filter(mp => mp.quantitaResidua > 0));
        } catch (error) {
            console.error('Errore nel caricamento delle materie prime:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMateriePrime();
            setSelectedProducts([]);
        }
    }, [isOpen]);

    const handleMateriaSelect = (materia) => {
        setSelectedMateria(materia);
        setSelectedProducts(materia.products.map(product => ({
            ...product,
            numeroPorzioni: '',
            grammiPerPorzione: '',
            percentualeScarto: '',
            kgCalcolati: 0,
            selected: false
        })));
    };

    const handleProductChange = (productIndex, field, value) => {
        const updatedProducts = [...selectedProducts];
        updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            [field]: value
        };

        if (['numeroPorzioni', 'grammiPerPorzione', 'percentualeScarto'].includes(field)) {
            const numeroPorzioni = parseFloat(updatedProducts[productIndex].numeroPorzioni) || 0;
            const grammiPerPorzione = parseFloat(updatedProducts[productIndex].grammiPerPorzione) || 0;
            const percentualeScarto = parseFloat(updatedProducts[productIndex].percentualeScarto) || 0;

            if (numeroPorzioni && grammiPerPorzione && percentualeScarto) {
                const quantitaLorda = (numeroPorzioni * grammiPerPorzione) / 1000;
                const kgCalcolati = quantitaLorda * (1 + (percentualeScarto / 100));
                updatedProducts[productIndex].kgCalcolati = kgCalcolati;
            }
        }

        setSelectedProducts(updatedProducts);
    };

    const handleConfirm = async () => {
        const selectedProductsToPrelevare = selectedProducts.filter(p => p.selected && p.kgCalcolati > 0);
        
        if (selectedProductsToPrelevare.length === 0) {
            alert('Seleziona almeno un prodotto e inserisci le quantità');
            return;
        }

        try {
            await Promise.all(selectedProductsToPrelevare.map(product => 
                axios.post(`/api/materie-prime/${selectedMateria._id}/prelievo`, {
                    quantitaPrelevata: product.kgCalcolati,
                    numeroPorzioni: product.numeroPorzioni,
                    grammiPerPorzione: product.grammiPerPorzione,
                    lotNumber: product.lotNumber,
                    productId: product._id
                })
            ));

            await fetchMateriePrime();
            onConfirm({
                materiaPrima: selectedMateria,
                prelievi: selectedProductsToPrelevare
            });
            onClose();
        } catch (error) {
            console.error('Errore durante il prelievo:', error);
            alert('Errore durante il prelievo della materia prima');
        }
    };

    const filteredMateriePrime = materiePrime.filter(mp =>
        mp.documentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Prelievo Materie Prime</h2>

                <div className="search-section">
                    <input
                        type="text"
                        placeholder="Cerca per documento o cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="materie-prime-list">
                    {filteredMateriePrime.map(mp => (
                        <div
                            key={mp._id}
                            className={`materia-prima-item ${selectedMateria?._id === mp._id ? 'selected' : ''}`}
                            onClick={() => handleMateriaSelect(mp)}
                        >
                            <div>Doc: {mp.documentNumber}</div>
                            <div>Cliente: {mp.cliente?.nome}</div>
                            <div>Disponibile: {mp.quantitaResidua.toFixed(2)} kg</div>
                        </div>
                    ))}
                </div>

                {selectedMateria && (
                    <div className="products-section">
                        <h3>Prodotti Disponibili</h3>
                        <table className="products-table">
                            <thead>
                                <tr>
                                    <th>Seleziona</th>
                                    <th>Prodotto</th>
                                    <th>Lotto</th>
                                    <th>Disponibile (kg)</th>
                                    <th>N° Porzioni</th>
                                    <th>g/Porzione</th>
                                    <th>Scarto %</th>
                                    <th>Kg Calcolati</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={product.selected}
                                                onChange={(e) => handleProductChange(index, 'selected', e.target.checked)}
                                            />
                                        </td>
                                        <td>{product.name}</td>
                                        <td>{product.lotNumber}</td>
                                        <td>{product.quantity.toFixed(2)}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.numeroPorzioni}
                                                onChange={(e) => handleProductChange(index, 'numeroPorzioni', e.target.value)}
                                                disabled={!product.selected}
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.grammiPerPorzione}
                                                onChange={(e) => handleProductChange(index, 'grammiPerPorzione', e.target.value)}
                                                disabled={!product.selected}
                                                min="0"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={product.percentualeScarto}
                                                onChange={(e) => handleProductChange(index, 'percentualeScarto', e.target.value)}
                                                disabled={!product.selected}
                                                min="0"
                                                max="100"
                                            />
                                        </td>
                                        <td>{product.kgCalcolati.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="modal-actions">
                    <button onClick={onClose}>Annulla</button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedMateria || !selectedProducts.some(p => p.selected && p.kgCalcolati > 0)}
                    >
                        Conferma Prelievo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrelievoMateriePrimeModal;
