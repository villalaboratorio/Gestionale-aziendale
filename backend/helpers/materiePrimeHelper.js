const MateriePrime = require('../models/materiePrimeModel'); // Importa il modello

/**
 * Helper per gestire i prelievi di una materia prima.
 * @param {String} materiaPrimaId - ID della materia prima.
 * @param {Number} quantitaPrelevata - Quantità da prelevare.
 * @param {String} destinazioneLavorazione - ID della lavorazione a cui è destinato il prelievo.
 * @param {String} tipoLavorazione - ID del tipo di lavorazione.
 * @returns {Object} - Oggetto aggiornato con il nuovo prelievo.
 */
async function gestisciPrelievo(materiaPrimaId, quantitaPrelevata, destinazioneLavorazione, tipoLavorazione) {
    try {
        const materiaPrima = await MateriePrime.findById(materiaPrimaId);
        if (!materiaPrima) {
            throw new Error('Materia prima non trovata.');
        }
        if (quantitaPrelevata > materiaPrima.quantitaResidua) {
            throw new Error('Quantità insufficiente per il prelievo richiesto.');
        }

        const nuovaQuantitaResidua = materiaPrima.quantitaResidua - quantitaPrelevata;
        const nuovoPrelievo = {
            quantitaPrelevata,
            dataPrelievo: new Date(),
            destinazioneLavorazione,
            tipoLavorazione,
            quantitaResidua: nuovaQuantitaResidua
        };

        materiaPrima.quantitaResidua = nuovaQuantitaResidua;
        materiaPrima.prelievi.push(nuovoPrelievo);

        await materiaPrima.save();

        if (nuovaQuantitaResidua === 0) {
            console.log(`Attenzione: la materia prima ${materiaPrimaId} è esaurita.`);
        }

        return materiaPrima;
    } catch (error) {
        console.error('Errore nella gestione del prelievo:', error.message);
        throw error;
    }
}

module.exports = { gestisciPrelievo };
