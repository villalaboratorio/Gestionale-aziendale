import { ingredientMatching } from './ingredientMatching';

export const validaQuantita = (quantita, quantitaDisponibile) => {
    const qty = Number(quantita);
    const available = Number(quantitaDisponibile);

    if (isNaN(qty) || qty <= 0) {
        return {
            valido: false,
            messaggio: 'La quantità deve essere maggiore di zero',
            codice: 'INVALID_QUANTITY'
        };
    }
    
    if (qty > available) {
        return {
            valido: false,
            messaggio: 'Quantità richiesta superiore alla disponibilità',
            codice: 'EXCEEDS_AVAILABLE'
        };
    }

    return { valido: true, messaggio: '', codice: 'OK' };
};

export const validaPorzioni = (porzioni, porzioniMassime) => {
    const qty = Number(porzioni);
    const max = Number(porzioniMassime);

    if (isNaN(qty) || qty <= 0) {
        return {
            valido: false,
            messaggio: 'Il numero di porzioni deve essere maggiore di zero',
            codice: 'INVALID_PORTIONS'
        };
    }

    if (qty > max) {
        return {
            valido: false,
            messaggio: `Numero porzioni superiore al massimo consentito (${max})`,
            codice: 'EXCEEDS_MAX_PORTIONS'
        };
    }

    return { valido: true, messaggio: '', codice: 'OK' };
};

export const validaGrammiPerPorzione = (grammi) => {
    const qty = Number(grammi);
    const MIN_GRAMMI = 10;
    const MAX_GRAMMI = 1000;

    if (isNaN(qty) || qty < MIN_GRAMMI) {
        return {
            valido: false,
            messaggio: `I grammi per porzione devono essere almeno ${MIN_GRAMMI}g`,
            codice: 'BELOW_MIN_GRAMS'
        };
    }

    if (qty > MAX_GRAMMI) {
        return {
            valido: false,
            messaggio: `I grammi per porzione non possono superare ${MAX_GRAMMI}g`,
            codice: 'EXCEEDS_MAX_GRAMS'
        };
    }

    return { valido: true, messaggio: '', codice: 'OK' };
};

export const validaRicettaCompatibile = (materiaPrima, ricetta) => {
    if (!materiaPrima?.products?.[0]?.name || !ricetta?.ingredienti) {
        return {
            valido: false,
            messaggio: 'Dati mancanti per la validazione',
            codice: 'MISSING_DATA'
        };
    }

    const nomeProdotto = materiaPrima.products[0].name;
    
    const matchResult = ricetta.ingredienti.reduce((best, ing) => {
        if (!ing?.ingrediente?.name) return best;
        
        const score = ingredientMatching.getMatchScore(
            nomeProdotto,
            ing.ingrediente.name
        );

        return score > best.score ? { score, ingrediente: ing } : best;
    }, { score: 0, ingrediente: null });

    const isCompatible = matchResult.score >= 0.7;

    return {
        valido: isCompatible,
        messaggio: isCompatible ? '' : 'Ricetta non compatibile con questa materia prima',
        codice: isCompatible ? 'OK' : 'INCOMPATIBLE_RECIPE',
        score: matchResult.score,
        ingredienteMatch: isCompatible ? matchResult.ingrediente : null
    };
};

export const validaSuggerimento = (suggerimento, quantitaDisponibile) => {
    const quantitaTotale = suggerimento.quantitaCalcolata || suggerimento.quantitaConsigliata;
    
    const validazioneQuantita = validaQuantita(quantitaTotale, quantitaDisponibile);
    if (!validazioneQuantita.valido) {
        return validazioneQuantita;
    }

    const validazionePorzioni = validaPorzioni(
        suggerimento.porzioniSelezionate || suggerimento.porzioniOttenibili,
        suggerimento.porzioniOttenibili
    );
    if (!validazionePorzioni.valido) {
        return validazionePorzioni;
    }

    const validazioneGrammi = validaGrammiPerPorzione(
        suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione
    );
    if (!validazioneGrammi.valido) {
        return validazioneGrammi;
    }

    return { 
        valido: true, 
        messaggio: '', 
        codice: 'OK',
        dettagli: {
            quantitaTotale,
            porzioni: suggerimento.porzioniSelezionate || suggerimento.porzioniOttenibili,
            grammiPerPorzione: suggerimento.grammiPerPorzioneSelezionati || suggerimento.ricetta.grammiPerPorzione
        }
    };
};
