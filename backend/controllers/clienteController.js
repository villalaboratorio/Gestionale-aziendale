const Cliente = require('../models/clienteModel');

// Creare un nuovo cliente
exports.createCliente = async (req, res) => {
    try {
        const cliente = new Cliente(req.body);
        await cliente.save();
        res.status(201).json(cliente);
    } catch (error) {
        console.error("Errore durante la creazione del cliente:", error);
        res.status(400).json({ message: error.message });
    }
};

// Ottenere tutti i clienti
exports.getClienti = async (req, res) => {
    try {
        const clienti = await Cliente.find();
        res.status(200).json(clienti);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ottenere un cliente per ID
exports.getClienteById = async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente non trovato' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Aggiornare un cliente
exports.updateCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente non trovato' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        console.error("Errore durante l'aggiornamento del cliente:", error);
        res.status(400).json({ message: error.message });
    }
};

// Eliminare un cliente
exports.deleteCliente = async (req, res) => {
    try {
        const cliente = await Cliente.findByIdAndDelete(req.params.id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente non trovato' });
        }
        res.status(200).json({ message: 'Cliente eliminato con successo' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
