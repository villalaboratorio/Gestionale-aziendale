const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const passaggiLavorazione = {
    /**
     * Ottiene i passaggi di lavorazione per un ID lavorazione
     */
    async getPassaggiLavorazione(lavorazioneId) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId)
                .select('passaggiLavorazione');
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Se non ci sono passaggi, inizializziamo con un passaggio predefinito
            if (!lavorazione.passaggiLavorazione || lavorazione.passaggiLavorazione.length === 0) {
                return [{
                    id: `passaggio_${Date.now()}`,
                    pelaturaMondatura: {
                        isStarted: false,
                        isCompleted: false
                    },
                    lavaggioPulizia: {
                        isStarted: false,
                        isCompleted: false
                    },
                    taglioMacinaAffetta: {
                        isStarted: false,
                        isCompleted: false
                    }
                }];
            }
            
            return lavorazione.passaggiLavorazione;
        } catch (error) {
            console.error('Errore nel recupero dei passaggi di lavorazione:', error);
            throw error;
        }
    },
    
    /**
     * Aggiorna i passaggi di lavorazione
     */
    async updatePassaggiLavorazione(lavorazioneId, passaggi) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            lavorazione.passaggiLavorazione = passaggi;
            await lavorazione.save();
            
            return lavorazione.passaggiLavorazione;
        } catch (error) {
            console.error('Errore nell\'aggiornamento dei passaggi di lavorazione:', error);
            throw error;
        }
    },
    
    /**
     * Avvia un passaggio specifico
     */
    async startPassaggio(lavorazioneId, passaggioId, tipoOperazione, operatore) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Trova l'indice del passaggio
            const passaggioIndex = lavorazione.passaggiLavorazione.findIndex(
                p => p.id === passaggioId
            );
            
            if (passaggioIndex === -1) {
                throw new Error('Passaggio non trovato');
            }
            
            // Verifica che il tipo operazione sia valido
            if (!['pelaturaMondatura', 'lavaggioPulizia', 'taglioMacinaAffetta'].includes(tipoOperazione)) {
                throw new Error('Tipo operazione non valido');
            }
            
            // Avvia l'operazione
            const passaggio = lavorazione.passaggiLavorazione[passaggioIndex];
            passaggio[tipoOperazione].isStarted = true;
            passaggio[tipoOperazione].oraInizio = new Date();
            passaggio[tipoOperazione].operatore = operatore;
            
            await lavorazione.save();
            
            return passaggio;
        } catch (error) {
            console.error('Errore nell\'avvio del passaggio:', error);
            throw error;
        }
    },
    
    /**
     * Completa un passaggio specifico
     */
    async completePassaggio(lavorazioneId, passaggioId, tipoOperazione) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Trova l'indice del passaggio
            const passaggioIndex = lavorazione.passaggiLavorazione.findIndex(
                p => p.id === passaggioId
            );
            
            if (passaggioIndex === -1) {
                throw new Error('Passaggio non trovato');
            }
            
            // Verifica che il tipo operazione sia valido
            if (!['pelaturaMondatura', 'lavaggioPulizia', 'taglioMacinaAffetta'].includes(tipoOperazione)) {
                throw new Error('Tipo operazione non valido');
            }
            
            // Completa l'operazione
            const passaggio = lavorazione.passaggiLavorazione[passaggioIndex];
            
            // Verifica che il passaggio sia iniziato
            if (!passaggio[tipoOperazione].isStarted) {
                throw new Error('Non è possibile completare un\'operazione non iniziata');
            }
            
            passaggio[tipoOperazione].isCompleted = true;
            passaggio[tipoOperazione].oraFine = new Date();
            
            await lavorazione.save();
            
            return passaggio;
        } catch (error) {
            console.error('Errore nel completamento del passaggio:', error);
            throw error;
        }
    },
    
    /**
     * Aggiunge una nota a un passaggio
     */
    async addNote(lavorazioneId, passaggioId, tipoOperazione, note) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Trova l'indice del passaggio
            const passaggioIndex = lavorazione.passaggiLavorazione.findIndex(
                p => p.id === passaggioId
            );
            
            if (passaggioIndex === -1) {
                throw new Error('Passaggio non trovato');
            }
            
            // Verifica che il tipo operazione sia valido
            if (!['pelaturaMondatura', 'lavaggioPulizia', 'taglioMacinaAffetta'].includes(tipoOperazione)) {
                throw new Error('Tipo operazione non valido');
            }
            
            // Aggiungi la nota
            const passaggio = lavorazione.passaggiLavorazione[passaggioIndex];
            
            // Aggiungiamo il campo note se non esiste
            if (!passaggio[tipoOperazione].note) {
                passaggio[tipoOperazione].note = note;
            } else {
                // Altrimenti aggiungiamo alla nota esistente con un timestamp
                const timestamp = new Date().toLocaleString('it-IT');
                passaggio[tipoOperazione].note += `\n\n[${timestamp}] ${note}`;
            }
            
            await lavorazione.save();
            
            return passaggio;
        } catch (error) {
            console.error('Errore nell\'aggiunta della nota:', error);
            throw error;
        }
    },
    
    /**
     * Crea un nuovo passaggio
     */
    async createPassaggio(lavorazioneId) {
        try {
            const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
            
            if (!lavorazione) {
                throw new Error('Lavorazione non trovata');
            }
            
            // Crea un nuovo passaggio
            const nuovoPassaggio = {
                id: `passaggio_${Date.now()}`,
                pelaturaMondatura: {
                    isStarted: false,
                    isCompleted: false
                },
                lavaggioPulizia: {
                    isStarted: false,
                    isCompleted: false
                },
                taglioMacinaAffetta: {
                    isStarted: false,
                    isCompleted: false
                }
            };
            
            // Inizializza l'array se non esiste
            if (!lavorazione.passaggiLavorazione) {
                lavorazione.passaggiLavorazione = [];
            }
            
            lavorazione.passaggiLavorazione.push(nuovoPassaggio);
            await lavorazione.save();
            
            return nuovoPassaggio;
        } catch (error) {
            console.error('Errore nella creazione del passaggio:', error);
            throw error;
        }
    },
    
    /**
     * Calcola lo stato complessivo dei passaggi (percentuale di completamento)
     */
    async calculatePassaggiStatus(lavorazioneId) {
        try {
            const passaggi = await this.getPassaggiLavorazione(lavorazioneId);
            
            // Se non ci sono passaggi, restituisci 0%
            if (!passaggi || passaggi.length === 0) {
                return {
                    percentuale: 0,
                    iniziati: 0,
                    completati: 0,
                    totale: 0
                };
            }
            
            let operazioniTotali = 0;
            let operazioniIniziate = 0;
            let operazioniCompletate = 0;
            
            // Itera su tutti i passaggi
            passaggi.forEach(passaggio => {
                // Controlla ogni tipo di operazione
                ['pelaturaMondatura', 'lavaggioPulizia', 'taglioMacinaAffetta'].forEach(tipo => {
                    if (passaggio[tipo]) {
                        operazioniTotali++;
                        
                        if (passaggio[tipo].isStarted) {
                            operazioniIniziate++;
                        }
                        
                        if (passaggio[tipo].isCompleted) {
                            operazioniCompletate++;
                        }
                    }
                });
            });
            
            // Calcola la percentuale di completamento
            const percentuale = operazioniTotali > 0 
                ? Math.round((operazioniCompletate / operazioniTotali) * 100)                : 0;
            
                return {
                    percentuale,
                    iniziati: operazioniIniziate,
                    completati: operazioniCompletate,
                    totale: operazioniTotali
                };
            } catch (error) {
                console.error('Errore nel calcolo dello stato dei passaggi:', error);
                throw error;
            }
        },
        
        /**
         * Elimina un passaggio specifico
         */
        async deletePassaggio(lavorazioneId, passaggioId) {
            try {
                const lavorazione = await DettaglioLavorazione.findById(lavorazioneId);
                
                if (!lavorazione) {
                    throw new Error('Lavorazione non trovata');
                }
                
                // Elimina il passaggio dall'array
                lavorazione.passaggiLavorazione = lavorazione.passaggiLavorazione.filter(
                    p => p.id !== passaggioId
                );
                
                await lavorazione.save();
                
                return { success: true, message: 'Passaggio eliminato con successo' };
            } catch (error) {
                console.error('Errore nell\'eliminazione del passaggio:', error);
                throw error;
            }
        }
    };
    
    module.exports = passaggiLavorazione;
    
