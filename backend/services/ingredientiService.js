const mongoose = require('mongoose');
const Ricetta = require('../models/ricettaModel');

class IngredientiService {
    async getIngredienti(ricettaId) {
        const ricetta = await Ricetta.findById(ricettaId)
            .populate({
                path: 'ingredienti',
                populate: [
                    { path: 'ingrediente' },
                    { path: 'unitaMisura' }
                ]
            });

        if (!ricetta) {
            throw new Error('Ricetta non trovata');
        }

        return ricetta.ingredienti;
    }

    async addIngrediente(ricettaId, ingredienteData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const ricetta = await Ricetta.findById(ricettaId).session(session);
            if (!ricetta) {
                throw new Error('Ricetta non trovata');
            }
            
            ricetta.ingredienti.push(ingredienteData);
            await ricetta.save();
            
            await session.commitTransaction();

            const ricettaAggiornata = await Ricetta.findById(ricettaId)
                .populate({
                    path: 'ingredienti',
                    populate: [
                        { path: 'ingrediente' },
                        { path: 'unitaMisura' }
                    ]
                });
                
            return ricettaAggiornata.ingredienti[ricettaAggiornata.ingredienti.length - 1];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async updateIngrediente(ricettaId, index, updateData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const ricetta = await Ricetta.findById(ricettaId).session(session);
            if (!ricetta) {
                throw new Error('Ricetta non trovata');
            }

            if (index >= ricetta.ingredienti.length) {
                throw new Error('Indice ingrediente non valido');
            }

            Object.assign(ricetta.ingredienti[index], updateData);
            await ricetta.save();

            await session.commitTransaction();

            const ricettaAggiornata = await Ricetta.findById(ricettaId)
                .populate({
                    path: 'ingredienti',
                    populate: [
                        { path: 'ingrediente' },
                        { path: 'unitaMisura' }
                    ]
                });

            return ricettaAggiornata.ingredienti[index];
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async removeIngrediente(ricettaId, index) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const ricetta = await Ricetta.findById(ricettaId).session(session);
            if (!ricetta) {
                throw new Error('Ricetta non trovata');
            }

            if (index >= ricetta.ingredienti.length) {
                throw new Error('Indice ingrediente non valido');
            }

            ricetta.ingredienti.splice(index, 1);
            await ricetta.save();

            await session.commitTransaction();
            return { success: true, message: 'Ingrediente rimosso con successo' };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    async saveTempIngredienti(ricettaId, ingredientsData) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            console.log('Inizio salvataggio temporaneo ingredienti:', {
                ricettaId,
                ingredientsData
            });

            const ricetta = await Ricetta.findById(ricettaId).session(session);
            if (!ricetta) {
                throw new Error('Ricetta non trovata');
            }

            ricetta.ingredienti = ingredientsData;
            await ricetta.save();

            await session.commitTransaction();
            console.log('Transazione completata con successo');

            const ricettaAggiornata = await Ricetta.findById(ricettaId)
                .populate({
                    path: 'ingredienti',
                    populate: [
                        { path: 'ingrediente' },
                        { path: 'unitaMisura' }
                    ]
                });

            console.log('Dati aggiornati recuperati:', ricettaAggiornata.ingredienti);
            return ricettaAggiornata.ingredienti;
        } catch (error) {
            console.error('Errore durante il salvataggio:', error);
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

module.exports = new IngredientiService();
