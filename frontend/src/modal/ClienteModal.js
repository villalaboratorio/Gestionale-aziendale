import { useState } from 'react';
import axios from 'axios';

const ClienteModal = ({ isOpen, onClose, onClienteAdded }) => {
    const [nome, setNome] = useState('');
    const [indirizzo, setIndirizzo] = useState({ via: '', citta: '', cap: '', nazione: '' });
    const [telefono, setTelefono] = useState('');
    const [email, setEmail] = useState('');
    const [partitaIva, setPartitaIva] = useState('');
    const [metodoPagamento, setMetodoPagamento] = useState('bonifico bancario');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nuovoCliente = {
                nome,
                indirizzo,
                contatti: { telefono, email },
                partitaIva,
                metodoPagamento
            };
            const response = await axios.post('/api/clienti', nuovoCliente);  // API per creare un cliente
            onClienteAdded(response.data);  // Aggiorna la lista dei clienti
            onClose();  // Chiudi il modale
        } catch (error) {
            console.error('Errore durante la creazione del cliente:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Aggiungi Nuovo Cliente</h2>
                <form onSubmit={handleSubmit}>
                    <label>Nome:</label>
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />

                    <label>Indirizzo:</label>
                    <input type="text" placeholder="Via" value={indirizzo.via} onChange={(e) => setIndirizzo({ ...indirizzo, via: e.target.value })} />
                    <input type="text" placeholder="Città" value={indirizzo.citta} onChange={(e) => setIndirizzo({ ...indirizzo, citta: e.target.value })} />
                    <input type="text" placeholder="CAP" value={indirizzo.cap} onChange={(e) => setIndirizzo({ ...indirizzo, cap: e.target.value })} />
                    <input type="text" placeholder="Nazione" value={indirizzo.nazione} onChange={(e) => setIndirizzo({ ...indirizzo, nazione: e.target.value })} />

                    <label>Telefono:</label>
                    <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

                    <label>Partita IVA:</label>
                    <input type="text" value={partitaIva} onChange={(e) => setPartitaIva(e.target.value)} />

                    <label>Metodo di Pagamento:</label>
                    <input type="text" value={metodoPagamento} onChange={(e) => setMetodoPagamento(e.target.value)} />

                    <button type="submit">Aggiungi Cliente</button>
                </form>
            </div>
        </div>
    );
};

export default ClienteModal;
