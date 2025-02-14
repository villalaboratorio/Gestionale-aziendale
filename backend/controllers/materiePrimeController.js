const MateriaPrima = require('../models/materiePrimeModel');
const Cliente = require('../models/clienteModel');
const ProcessingTypes = require('../models/processingTypesModel');
const Unit = require('../models/unitsModel');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configurazione multer per il caricamento dei file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Solo file PDF o immagini sono permessi!'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

exports.uploadDocument = upload.single('documentFile');

exports.createMateriaPrima = async (req, res) => {
    try {
        const { documentNumber, date, cliente, products } = req.body;

        if (!documentNumber || !date || !cliente || !products) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
        }

        const parsedProducts = JSON.parse(products);
        
        const clienteEsistente = await Cliente.findById(cliente);
        if (!clienteEsistente) {
            return res.status(404).json({ message: 'Cliente non trovato' });
        }

        for (let product of parsedProducts) {
            const unitEsistente = await Unit.findById(product.unit);
            if (!unitEsistente) {
                return res.status(404).json({ 
                    message: `Unità di misura non trovata per il prodotto: ${product.name}` 
                });
            }
        }

        let documentFilePath = '';
        if (req.file) {
            documentFilePath = req.file.path;
        }

        const quantitaTotale = parsedProducts.reduce((sum, product) => sum + Number(product.quantity), 0);

        const newMateriaPrima = new MateriaPrima({
            documentNumber,
            date,
            cliente,
            products: parsedProducts,
            documentFile: documentFilePath,
            quantitaIniziale: quantitaTotale,
            quantitaResidua: quantitaTotale
        });

        const savedMateriaPrima = await newMateriaPrima.save();
        
        const populatedMateriaPrima = await MateriaPrima.findById(savedMateriaPrima._id)
            .populate('cliente', 'nome')
            .populate('products.unit', 'name abbreviation');

        return res.status(201).json(populatedMateriaPrima);
    } catch (error) {
        console.error('Errore durante la creazione della materia prima:', error);
        return res.status(500).json({ 
            message: 'Errore durante la creazione della materia prima',
            error: error.message 
        });
    }
};

exports.getMateriePrime = async (req, res) => {
    try {
        const materiePrime = await MateriaPrima.find()
            .populate('cliente', 'nome')
            .populate('products.unit', 'name abbreviation')
            .lean();

        return res.status(200).json(materiePrime);
    } catch (error) {
        console.error('Errore durante il recupero delle materie prime:', error);
        return res.status(500).json({ 
            message: 'Errore durante il recupero delle materie prime',
            error: error.message 
        });
    }
};

exports.getMateriaPrimaById = async (req, res) => {
    try {
        const materiaPrima = await MateriaPrima.findById(req.params.id)
            .populate('cliente', 'nome')
            .populate('products.unit', 'name abbreviation');

        if (!materiaPrima) {
            return res.status(404).json({ message: 'Materia prima non trovata' });
        }

        return res.status(200).json(materiaPrima);
    } catch (error) {
        console.error('Errore durante il recupero della materia prima:', error);
        return res.status(500).json({ 
            message: 'Errore durante il recupero della materia prima',
            error: error.message 
        });
    }
};

exports.updateMateriaPrima = async (req, res) => {
    try {
        const updatedData = { ...req.body };
        
        if (req.file) {
            const materiaPrima = await MateriaPrima.findById(req.params.id);
            if (materiaPrima && materiaPrima.documentFile) {
                fs.unlink(materiaPrima.documentFile, (err) => {
                    if (err) console.error('Errore durante l\'eliminazione del file precedente:', err);
                });
            }
            updatedData.documentFile = req.file.path;
        }

        const updatedMateriaPrima = await MateriaPrima.findByIdAndUpdate(
            req.params.id, 
            updatedData, 
            { new: true }
        ).populate('cliente', 'nome')
         .populate('products.unit', 'name abbreviation');

        if (!updatedMateriaPrima) {
            return res.status(404).json({ message: 'Materia prima non trovata' });
        }

        return res.status(200).json(updatedMateriaPrima);
    } catch (error) {
        console.error('Errore durante l\'aggiornamento della materia prima:', error);
        return res.status(500).json({ 
            message: 'Errore durante l\'aggiornamento della materia prima',
            error: error.message 
        });
    }
};

exports.deleteMateriaPrima = async (req, res) => {
    try {
        const materiaPrima = await MateriaPrima.findById(req.params.id);
        
        if (!materiaPrima) {
            return res.status(404).json({ message: 'Materia prima non trovata' });
        }

        if (materiaPrima.documentFile) {
            fs.unlink(materiaPrima.documentFile, (err) => {
                if (err) console.error('Errore durante l\'eliminazione del file:', err);
            });
        }

        await MateriaPrima.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: 'Materia prima eliminata con successo' });
    } catch (error) {
        console.error('Errore durante l\'eliminazione della materia prima:', error);
        return res.status(500).json({ 
            message: 'Errore durante l\'eliminazione della materia prima',
            error: error.message 
        });
    }
};

exports.prelevaMateriaPrima = async (req, res) => {
    try {
        const { quantitaPrelevata, numeroPorzioni, grammiPerPorzione } = req.body;
        const materiaPrimaId = req.params.id;

        // Fetch the existing document
        const materiaPrima = await MateriaPrima.findById(materiaPrimaId);
        if (!materiaPrima) {
            return res.status(404).json({ message: 'Materia prima non trovata' });
        }

        if (materiaPrima.quantitaResidua < quantitaPrelevata) {
            return res.status(400).json({ message: 'Quantità richiesta superiore alla disponibilità' });
        }

        // Create the new prelievo with the lotNumber from the existing products
        const prelievo = {
            quantitaPrelevata,
            dataPrelievo: new Date(),
            numeroPorzioni,
            grammiPerPorzione,
            quantitaResidua: materiaPrima.quantitaResidua - quantitaPrelevata,
            lotNumber: materiaPrima.products[0].lotNumber // Use existing lotNumber
        };

        // Update using findOneAndUpdate to avoid validation issues
        const updatedMateriaPrima = await MateriaPrima.findOneAndUpdate(
            { _id: materiaPrimaId },
            {
                $set: { quantitaResidua: materiaPrima.quantitaResidua - quantitaPrelevata },
                $push: { prelievi: prelievo }
            },
            { new: true }
        ).populate('cliente', 'nome')
         .populate('products.unit', 'name abbreviation');

        return res.status(200).json(updatedMateriaPrima);
    } catch (error) {
        console.error('Errore durante il prelievo:', error);
        return res.status(500).json({ 
            message: 'Errore durante il prelievo della materia prima',
            error: error.message 
        });
    }
};
