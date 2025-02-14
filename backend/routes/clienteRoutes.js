const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Rotta per ottenere tutti i clienti
router.get('/', clienteController.getClienti);

// Rotta per creare un nuovo cliente
router.post('/', clienteController.createCliente);

// Rotta per ottenere un cliente per ID
router.get('/:id', clienteController.getClienteById);

// Rotta per aggiornare un cliente
router.put('/:id', clienteController.updateCliente);

// Rotta per eliminare un cliente
router.delete('/:id', clienteController.deleteCliente);

module.exports = router;
