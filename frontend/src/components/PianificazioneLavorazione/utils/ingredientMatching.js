export const ingredientMatching = {
    // Funzione principale di matching
    isCompatible: (materiaPrima, ingrediente) => {
        const mpNome = materiaPrima.toLowerCase().trim();
        const ingNome = ingrediente.toLowerCase().trim();

        // Array di test di compatibilità in ordine di priorità
        const tests = [
            // Match esatto
            () => mpNome === ingNome,
            // Match senza spazi
            () => mpNome.replace(/\s/g, '') === ingNome.replace(/\s/g, ''),
            // Match prima parola
            () => mpNome.split(' ')[0] === ingNome.split(' ')[0],
            // Match parziale bidirezionale
            () => mpNome.includes(ingNome) || ingNome.includes(mpNome),
            // Match varianti (es: giallo, bianco)
            () => {
                const variants = ['giallo', 'bianco', 'rosso', 'nero'];
                return variants.some(variant => 
                    (mpNome.includes(variant) && ingNome.includes(variant))
                );
            }
        ];

        // Esegue i test in ordine
        return tests.some(test => test());
    },

    // Calcola score di compatibilità
    getMatchScore: (materiaPrima, ingrediente) => {
        const mpNome = materiaPrima.toLowerCase().trim();
        const ingNome = ingrediente.toLowerCase().trim();

        if (mpNome === ingNome) return 1;
        if (mpNome.replace(/\s/g, '') === ingNome.replace(/\s/g, '')) return 0.9;
        if (mpNome.split(' ')[0] === ingNome.split(' ')[0]) return 0.8;
        if (mpNome.includes(ingNome) || ingNome.includes(mpNome)) return 0.7;

        return 0;
    }
};
