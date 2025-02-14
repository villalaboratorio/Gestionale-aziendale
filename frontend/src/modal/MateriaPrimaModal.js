import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/MateriaPrimaModal.css';

const MateriaPrimaModal = ({ isOpen, onClose, onSave, selectedMateria }) => {
    const [documentNumber, setDocumentNumber] = useState('');
    const [date, setDate] = useState('');
    const [cliente, setCliente] = useState('');
    const [products, setProducts] = useState([{ name: '', quantity: '', unit: '', lotNumber: '' }]);
    const [clienti, setClienti] = useState([]);
    const [units, setUnits] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [documentFile, setDocumentFile] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientiRes, unitsRes] = await Promise.all([
                    axios.get('/api/clienti'),
                    axios.get('/api/units'),
                ]);
                setClienti(clientiRes.data);
                setUnits(unitsRes.data);
            } catch (error) {
                console.error('Errore nel recupero dei dati:', error);
                setErrorMessage('Errore nel caricamento dei dati di riferimento');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedMateria) {
            setDocumentNumber(selectedMateria.documentNumber);
            setDate(selectedMateria.date ? selectedMateria.date.split('T')[0] : '');
            setCliente(selectedMateria.cliente?._id || '');
            setProducts(selectedMateria.products || [{ name: '', quantity: '', unit: '', lotNumber: '' }]);
        }
    }, [selectedMateria]);

    const handleSave = async () => {
        try {
            setErrorMessage('');
            
            if (!documentNumber || !date || !cliente || products.length === 0) {
                setErrorMessage("Tutti i campi sono obbligatori");
                return;
            }

            // Validazione dei prodotti
            for (const product of products) {
                if (!product.name || !product.quantity || !product.unit || !product.lotNumber) {
                    setErrorMessage("Tutti i campi dei prodotti sono obbligatori");
                    return;
                }
                if (isNaN(product.quantity) || product.quantity <= 0) {
                    setErrorMessage("La quantità deve essere un numero positivo");
                    return;
                }
            }

            const formData = new FormData();
            formData.append('documentNumber', documentNumber);
            formData.append('date', date);
            formData.append('cliente', cliente);
            formData.append('products', JSON.stringify(products));

            if (documentFile) {
                formData.append('documentFile', documentFile);
            }

            const response = await axios.post('/api/materie-prime', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onSave(response.data);
            onClose();
        } catch (error) {
            console.error("Errore nel salvataggio:", error);
            setErrorMessage(error.response?.data?.message || "Errore durante il salvataggio");
        }
    };

    const addProduct = () => {
        setProducts([...products, { name: '', quantity: '', unit: '', lotNumber: '' }]);
    };

    const removeProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    const handleProductChange = (index, field, value) => {
        const updatedProducts = products.map((product, i) =>
            i === index ? { ...product, [field]: value } : product
        );
        setProducts(updatedProducts);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5000000) { // 5MB limit
                setErrorMessage("Il file è troppo grande. Dimensione massima: 5MB");
                return;
            }
            setDocumentFile(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2>Registra Materia Prima in Arrivo</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                
                <form onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label>Numero Documento:</label>
                        <input
                            type="text"
                            value={documentNumber}
                            onChange={(e) => setDocumentNumber(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Data:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Cliente:</label>
                        <select 
                            value={cliente} 
                            onChange={(e) => setCliente(e.target.value)}
                            required
                        >
                            <option value="">Seleziona un cliente</option>
                            {clienti.map((cli) => (
                                <option key={cli._id} value={cli._id}>
                                    {cli.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <h3>Prodotti</h3>
                    {products.map((product, index) => (
                        <div key={index} className="product-item">
                            <div className="form-group">
                                <label>Nome Prodotto:</label>
                                <input
                                    type="text"
                                    value={product.name}
                                    onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Quantità:</label>
                                <input
                                    type="number"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                    min="0.1"
                                    step="0.1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Unità di Misura:</label>
                                <select
                                    value={product.unit}
                                    onChange={(e) => handleProductChange(index, 'unit', e.target.value)}
                                    required
                                >
                                    <option value="">Seleziona unità</option>
                                    {units.map((unit) => (
                                        <option key={unit._id} value={unit._id}>
                                            {unit.name} ({unit.abbreviation})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Numero Lotto:</label>
                                <input
                                    type="text"
                                    value={product.lotNumber}
                                    onChange={(e) => handleProductChange(index, 'lotNumber', e.target.value)}
                                    required
                                />
                            </div>

                            {products.length > 1 && (
                                <button 
                                    type="button" 
                                    onClick={() => removeProduct(index)}
                                    className="remove-button"
                                >
                                    Rimuovi
                                </button>
                            )}
                        </div>
                    ))}

                    <button type="button" onClick={addProduct} className="add-button">
                        Aggiungi Prodotto
                    </button>

                    <div className="form-group">
                        <label>Documento (PDF/Immagine):</label>
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            accept=".pdf,.jpg,.jpeg,.png"
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={handleSave} className="save-button">
                            Salva
                        </button>
                        <button type="button" onClick={onClose} className="cancel-button">
                            Annulla
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MateriaPrimaModal;
