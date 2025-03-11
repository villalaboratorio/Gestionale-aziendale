const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const assemblaggioController = {
    /**
     * Recupera i dati di assemblaggio per una lavorazione
     */
    async getAssemblaggio(lavorazioneId) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Se non esiste la proprietà assemblaggio, inizializziamola
            if (!lavorazione.assemblaggio) {
                lavorazione.assemblaggio = {
                    crudo: { ore: "", addetto: "", temperatura: 0, controlliQualita: false },
                    dopoCottura: { ore: "", addetto: "", temperatura: 0, controlliQualita: false },
                    dopoCotturaParziale: { ore: "", addetto: "", temperatura: 0, controlliQualita: false },
                    crudoSegueCottura: { ore: "", addetto: "", temperatura: 0, controlliQualita: false }
                };
                await lavorazione.save();
            }
            
            return lavorazione.assemblaggio;
        } catch (error) {
            console.error('Errore nel recupero dei dati di assemblaggio:', error);
            throw error;
        }
    },

    /**
     * Aggiorna i dati di assemblaggio per una fase specifica
     */
    async updateFaseAssemblaggio(lavorazioneId, fase, dati) {
        try {
            // Verifica che la fase sia valida
            const fasiValide = ['crudo', 'dopoCottura', 'dopoCotturaParziale', 'crudoSegueCottura'];
            if (!fasiValide.includes(fase)) {
                throw new Error(`Fase non valida. Fasi valide: ${fasiValide.join(', ')}`);
            }
            
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Inizializza l'assemblaggio se non esiste
            if (!lavorazione.assemblaggio) {
                lavorazione.assemblaggio = {};
            }
            
            // Inizializza la fase specifica se non esiste
            if (!lavorazione.assemblaggio[fase]) {
                lavorazione.assemblaggio[fase] = {};
            }
            
            // Aggiorna i dati della fase
            lavorazione.assemblaggio[fase] = {
                ...lavorazione.assemblaggio[fase],
                ...dati
            };
            
            await lavorazione.save();
            return lavorazione.assemblaggio;
        } catch (error) {
            console.error(`Errore nell'aggiornamento della fase ${fase}:`, error);
            throw error;
        }
    },

    /**
     * Avvia una fase di assemblaggio
     */
    async startFaseAssemblaggio(lavorazioneId, fase, addetto) {
        try {
            return await this.updateFaseAssemblaggio(lavorazioneId, fase, {
                addetto,
                ore: new Date().toISOString(),
                stato: 'in_corso'
            });
        } catch (error) {
            console.error(`Errore nell'avvio della fase ${fase}:`, error);
            throw error;
        }
    },

    /**
     * Completa una fase di assemblaggio
     */
    async completeFaseAssemblaggio(lavorazioneId, fase, dati) {
        try {
            return await this.updateFaseAssemblaggio(lavorazioneId, fase, {
                ...dati,
                stato: 'completata',
                dataCompletamento: new Date().toISOString()
            });
        } catch (error) {
            console.error(`Errore nel completamento della fase ${fase}:`, error);
            throw error;
        }
    },

    /**
     * Calcola lo stato complessivo dell'assemblaggio
     */
    async getAssemblaggioStatus(lavorazioneId) {
        try {
            const assemblaggio = await this.getAssemblaggio(lavorazioneId);
            
            // Conteggio per statistiche
            let totale = 0;
            let completate = 0;
            let inCorso = 0;
            
            // Elenco delle fasi
            const fasi = ['crudo', 'dopoCottura', 'dopoCotturaParziale', 'crudoSegueCottura'];
            
            // Calcola stato per ogni fase attiva
            const statoFasi = fasi.map(fase => {
                if (assemblaggio[fase] && (assemblaggio[fase].addetto || assemblaggio[fase].ore)) {
                    totale++;
                    
                    if (assemblaggio[fase].stato === 'completata') {
                        completate++;
                        return { fase, stato: 'completata' };
                    } else if (assemblaggio[fase].stato === 'in_corso') {
                        inCorso++;
                        return { fase, stato: 'in_corso' };
                    }
                    
                    return { fase, stato: 'non_iniziata' };
                }
                return { fase, stato: 'non_applicabile' };
            });
            
            return {
                statoFasi,
                statistiche: {
                    totale,
                    completate,
                    inCorso,
                    percentualeCompletamento: totale > 0 ? Math.round((completate / totale) * 100) : 0
                }
            };
        } catch (error) {
            console.error('Errore nel calcolo dello stato dell\'assemblaggio:', error);
            throw error;
        }
    }
};

module.exports = assemblaggioController;
