export const trackQuantities = {
    calculateTotalAllocated: (lavorazioni, materiaPrimaId) => {
        return lavorazioni
            .filter(l => l.materiaPrima.id === materiaPrimaId)
            .reduce((sum, l) => sum + l.quantitaTotale, 0);
    },

    calculateAvailable: (materiaPrima, lavorazioni) => {
        const allocated = trackQuantities.calculateTotalAllocated(lavorazioni, materiaPrima._id);
        return materiaPrima.quantitaResidua - allocated;
    },

    validateQuantity: (quantity, materiaPrima, lavorazioni) => {
        const available = trackQuantities.calculateAvailable(materiaPrima, lavorazioni);
        return quantity > 0 && quantity <= available;
    }
};
