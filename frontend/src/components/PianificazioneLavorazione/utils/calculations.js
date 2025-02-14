// Modulo calcoli quantità
const quantityCalculator = {
    calcolaQuantitaTotale: (porzioni, grammiPerPorzione) => {
        const p = Number(porzioni);
        const g = Number(grammiPerPorzione);
        if (isNaN(p) || isNaN(g)) return 0;
        return (p * g) / 1000;
    },

    calcolaPorzioniOttenibili: (quantitaDisponibile, grammiPerPorzione) => {
        const qd = Number(quantitaDisponibile);
        const gp = Number(grammiPerPorzione);
        if (isNaN(qd) || isNaN(gp) || gp === 0) return 0;
        return Math.floor((qd * 1000) / gp);
    },

    calcolaQuantitaResidua: (quantitaIniziale, prelievi) => {
        if (!Array.isArray(prelievi)) return quantitaIniziale;
        const totalePrelevato = prelievi.reduce((acc, prelievo) => 
            acc + (Number(prelievo.quantitaPrelevata) || 0), 0
        );
        return quantitaIniziale - totalePrelevato;
    }
};

// Modulo calcoli ottimizzazione
const optimizationCalculator = {
    calcolaDivisioneOttimale: (materiaPrima, ricetta) => {
        const porzioniPossibili = quantityCalculator.calcolaPorzioniOttenibili(
            materiaPrima.quantitaResidua,
            ricetta.grammiPerPorzione
        );
        
        return {
            porzioni: porzioniPossibili,
            quantita: (porzioniPossibili * ricetta.grammiPerPorzione) / 1000,
            ricettaId: ricetta._id
        };
    },

    calcolaCompatibilita: (quantitaTotale, quantitaResidua) => {
        if (quantitaTotale <= 0) return 'non-valido';
        if (quantitaTotale > quantitaResidua) return 'eccesso';
        if (quantitaTotale <= quantitaResidua * 0.3) return 'ottimale';
        return 'valido';
    }
};

// Modulo preparazione dati
const dataPreparation = {
    preparaSuggerimento: (ricetta, materiaPrima) => {
        if (!ricetta || !materiaPrima) return null;

        const porzioniOttenibili = quantityCalculator.calcolaPorzioniOttenibili(
            materiaPrima.quantitaResidua,
            ricetta.grammiPerPorzione || 100
        );

        return {
            ...ricetta,
            porzioni: 1,
            grammiPerPorzione: ricetta.grammiPerPorzione || 100,
            porzioniOttenibili
        };
    },

    preparaNuovaLavorazione: (ricetta, materiaPrima, quantitaTotale) => ({
        id: Date.now(),
        materiaPrima: {
            id: materiaPrima._id,
            lotNumber: materiaPrima.products[0].lotNumber,
            quantitaAssegnata: quantitaTotale,
            nome: materiaPrima.products[0].name
        },
        ricettaId: ricetta._id,
        ricettaNome: ricetta.nome,
        porzioniPreviste: ricetta.porzioni,
        grammiPerPorzione: ricetta.grammiPerPorzione,
        quantitaTotale,
        cliente: materiaPrima.cliente?.nome || 'N/D',
        dataCreazione: new Date()
    }),

    calcolaSuggerimentiRicette: (ricette, materiaPrima) => {
        if (!ricette || !materiaPrima) return [];
        
        return ricette.map(ricetta => ({
            ricetta: ricetta,
            quantitaConsigliata: quantityCalculator.calcolaQuantitaTotale(
                ricetta.porzioni, 
                ricetta.grammiPerPorzione
            ),
            porzioniOttenibili: quantityCalculator.calcolaPorzioniOttenibili(
                materiaPrima.quantitaResidua,
                ricetta.grammiPerPorzione
            ),
            porzioniSelezionate: null,
            grammiPerPorzioneSelezionati: null,
            quantitaCalcolata: null
        }));
    },

    raggruppaRicettePerTipo: (suggerimenti) => {
        return suggerimenti.reduce((acc, sugg) => {
            const tipo = sugg.ricetta.tipo || 'Altro';
            if (!acc[tipo]) acc[tipo] = [];
            acc[tipo].push(sugg);
            return acc;
        }, {});
    }
};

// Modulo formattazione
const formatting = {
    formattaQuantita: (quantita, decimali = 2) => {
        const num = Number(quantita);
        return isNaN(num) ? '0.00' : num.toFixed(decimali);
    },

    formattaPercentuale: (valore, decimali = 1) => {
        const num = Number(valore);
        return isNaN(num) ? '0%' : `${num.toFixed(decimali)}%`;
    }
};

// Esportazione dei moduli
export const {
    calcolaQuantitaTotale,
    calcolaPorzioniOttenibili,
    calcolaQuantitaResidua
} = quantityCalculator;

export const {
    calcolaDivisioneOttimale,
    calcolaCompatibilita
} = optimizationCalculator;

export const {
    preparaSuggerimento,
    preparaNuovaLavorazione,
    calcolaSuggerimentiRicette,
    raggruppaRicettePerTipo
} = dataPreparation;

export const {
    formattaQuantita,
    formattaPercentuale
} = formatting;
