const Ricetta = require('../models/ricettaModel');

class RicettaService {
    async generateRicettaNumber() {
        console.log('Generating new recipe number');
        const lastRicetta = await Ricetta.findOne().sort({ numeroRicetta: -1 });
        const year = new Date().getFullYear();
        const prefix = 'R';
        
        if (!lastRicetta) {
            console.log('No existing recipes found, generating first number');
            return `${prefix}${year}0001`;
        }
        
        const lastNumber = parseInt(lastRicetta.numeroRicetta.slice(-4));
        const newNumber = (lastNumber + 1).toString().padStart(4, '0');
        console.log('Generated recipe number:', `${prefix}${year}${newNumber}`);
        return `${prefix}${year}${newNumber}`;
    }

    async createRicetta(data) {
        console.log('Creating new recipe with data:', data);
        const numeroRicetta = await this.generateRicettaNumber();
        const { numeroRicetta: _, ...altriDati } = data;
        
        const nuovaRicetta = new Ricetta({
            numeroRicetta,
            ...altriDati,
            fasi: altriDati.fasi || [],
            ingredienti: altriDati.ingredienti || []
        });

        console.log('Attempting to save new recipe');
        const ricettaSalvata = await nuovaRicetta.save();
        
        const ricettaPopolata = await Ricetta.findById(ricettaSalvata._id)
            .populate('categoria')
            .populate({
                path: 'ingredienti',
                populate: [
                    { path: 'ingrediente' },
                    { path: 'unitaMisura' }
                ]
            })
            .populate('fasi.tipoLavorazione')
            .populate('fasi.metodo');

        console.log('Recipe saved and populated successfully:', ricettaPopolata);
        return ricettaPopolata;
    }

    async getRicette(filters = {}) {
        console.log('Fetching recipes with filters:', filters);
        const query = Ricetta.find(filters)
            .populate('categoria')
            .populate({
                path: 'ingredienti',
                populate: [
                    { path: 'ingrediente' },
                    { path: 'unitaMisura' }
                ]
            })
            .populate('fasi.tipoLavorazione')
            .populate('fasi.metodo')
            .sort('-createdAt');

        const ricette = await query;
        console.log(`Found ${ricette.length} recipes`);
        return ricette;
    }

    async getRicettaById(id) {
        console.log('Fetching recipe by ID:', id);
        const ricetta = await Ricetta.findById(id)
            .populate('categoria')
            .populate({
                path: 'ingredienti',
                populate: [
                    { path: 'ingrediente' },
                    { path: 'unitaMisura' }
                ]
            })
            .populate('fasi.tipoLavorazione')
            .populate('fasi.metodo');

        if (!ricetta) {
            console.log('Recipe not found');
            throw new Error('Ricetta non trovata');
        }

        console.log('Recipe found:', ricetta);
        return ricetta;
    }

    async updateRicetta(id, data) {
        console.log('Updating recipe:', id, 'with data:', data);
        const ricettaAggiornata = await Ricetta.findByIdAndUpdate(
            id,
            data,
            { 
                new: true, 
                runValidators: true 
            }
        )
        .populate('categoria')
        .populate({
            path: 'ingredienti',
            populate: [
                { path: 'ingrediente' },
                { path: 'unitaMisura' }
            ]
        })
        .populate('fasi.tipoLavorazione')
        .populate('fasi.metodo');

        if (!ricettaAggiornata) {
            console.log('Recipe not found for update');
            throw new Error('Ricetta non trovata');
        }

        console.log('Recipe updated successfully:', ricettaAggiornata);
        return ricettaAggiornata;
    }

    async deleteRicetta(id) {
        console.log('Deleting recipe:', id);
        const ricettaEliminata = await Ricetta.findByIdAndDelete(id);
        
        if (!ricettaEliminata) {
            console.log('Recipe not found for deletion');
            throw new Error('Ricetta non trovata');
        }

        console.log('Recipe deleted successfully');
        return { message: 'Ricetta eliminata con successo' };
    }

    async searchRicette(query) {
        console.log('Searching recipes with query:', query);
        const ricette = await Ricetta.find({
            $or: [
                { nome: { $regex: query, $options: 'i' } },
                { descrizione: { $regex: query, $options: 'i' } }
            ]
        })
        .populate('categoria')
        .populate({
            path: 'ingredienti',
            populate: [
                { path: 'ingrediente' },
                { path: 'unitaMisura' }
            ]
        })
        .populate('fasi.tipoLavorazione')
        .populate('fasi.metodo');

        console.log(`Found ${ricette.length} recipes matching query`);
        return ricette;
    }

    async duplicateRicetta(id) {
        console.log('Duplicating recipe:', id);
        const ricettaOriginale = await this.getRicettaById(id);
        const numeroRicetta = await this.generateRicettaNumber();
        
        const { _id, createdAt, updatedAt, ...datiRicetta } = ricettaOriginale.toObject();
        
        const nuovaRicetta = new Ricetta({
            ...datiRicetta,
            numeroRicetta,
            nome: `Copia di ${datiRicetta.nome}`
        });

        const ricettaSalvata = await nuovaRicetta.save();
        console.log('Recipe duplicated successfully');
        return this.getRicettaById(ricettaSalvata._id);
    }
}

module.exports = RicettaService;
