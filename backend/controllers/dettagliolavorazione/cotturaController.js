const DettaglioLavorazione = require('../../models/dettaglioLavorazioneModel');

const validateTemperatura = (temp) => {
    return temp >= 0 && temp <= 300;
};

const cotturaController = {
    getParametriCottura: async (req, res) => {
        console.group('🔍 getParametriCottura');
        try {
            const { id } = req.params;
            const lavorazione = await DettaglioLavorazione.findById(id)
                .populate('cotture.tipoCottura')
                .select('cotture');

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    message: "Lavorazione non trovata"
                });
            }

            return res.json({
                success: true,
                data: lavorazione.cotture || []
            });
        } catch (error) {
            console.error('Errore recupero cotture:', error);
            return res.status(500).json({
                success: false,
                message: "Errore nel recupero cotture",
                error: error.message
            });
        }
    },
    addCottura: async (req, res) => {
        console.group('➕ addCottura');
        try {
            const { id } = req.params;
            const { tipoCottura, temperaturaTarget, addetto } = req.body;

            if (temperaturaTarget && !validateTemperatura(temperaturaTarget)) {
                return res.status(400).json({
                    success: false,
                    code: 'INVALID_TEMPERATURA',
                    message: "Temperatura non valida (0-300°C)"
                });
            }

            const newCottura = {
                tipoCottura,
                temperaturaTarget,
                addetto,
                stato: 'non_iniziata',
                registrazioni: [],
                createdAt: new Date()
            };

            const lavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $push: { cotture: newCottura } },
                { new: true, runValidators: true }
            ).populate('cotture.tipoCottura');

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    code: 'LAVORAZIONE_NOT_FOUND',
                    message: "Lavorazione non trovata"
                });
            }

            return res.json({
                success: true,
                data: lavorazione.cotture,
                message: "Cottura aggiunta con successo"
            });
        } catch (error) {
            console.error('Errore addCottura:', error);
            return res.status(500).json({
                success: false,
                code: 'ADD_COTTURA_ERROR',
                message: "Errore nell'aggiunta cottura",
                error: error.message
            });
        } finally {
            console.groupEnd();
        }
    },

    updateCottura: async (req, res) => {
        console.group('📝 updateCottura');
        try {
            const { id, cotturaId } = req.params;
            const { tipoCottura, temperaturaTarget, addetto } = req.body;

            if (temperaturaTarget && !validateTemperatura(temperaturaTarget)) {
                return res.status(400).json({
                    success: false,
                    code: 'INVALID_TEMPERATURA',
                    message: "Temperatura non valida (0-300°C)"
                });
            }

            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            });

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    code: 'LAVORAZIONE_NOT_FOUND',
                    message: "Lavorazione o cottura non trovata"
                });
            }

            const cottura = lavorazione.cotture.id(cotturaId);
            if (cottura.stato === 'completata') {
                return res.status(400).json({
                    success: false,
                    code: 'COTTURA_COMPLETED',
                    message: "Non è possibile modificare una cottura completata"
                });
            }

            const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                { _id: id, 'cotture._id': cotturaId },
                {
                    $set: {
                        'cotture.$.tipoCottura': tipoCottura,
                        'cotture.$.temperatura': temperaturaTarget,
                        'cotture.$.addetto': addetto,
                        'cotture.$.updatedAt': new Date()
                    }
                },
                { new: true, runValidators: true }
            ).populate('cotture.tipoCottura');

            return res.json({
                success: true,
                data: updatedLavorazione.cotture,
                message: "Cottura aggiornata con successo"
            });
        } catch (error) {
            console.error('Errore updateCottura:', error);
            return res.status(500).json({
                success: false,
                code: 'UPDATE_COTTURA_ERROR',
                message: "Errore nell'aggiornamento cottura",
                error: error.message
            });
        } finally {
            console.groupEnd();
        }
    },
      startCottura: async (req, res) => {
          console.group('🔥 startCottura');
          try {
              const { id } = req.params;
              const { cotturaId, tipoCottura, temperaturaTarget, addetto } = req.body;

              const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                  { _id: id, 'cotture._id': cotturaId },
                  {
                      $set: {
                          'cotture.$.tipoCottura': tipoCottura,
                          'cotture.$.temperaturaTarget': temperaturaTarget,
                          'cotture.$.addetto': addetto,
                          'cotture.$.inizio': new Date(),
                          'cotture.$.stato': 'in_corso'
                      }
                  },
                  { new: true }
              ).populate('cotture.tipoCottura');

              return res.json({
                  success: true,
                  data: updatedLavorazione.cotture
              });
          } catch (error) {
              console.error('Errore startCottura:', error);
              return res.status(500).json({
                  success: false,
                  message: error.message
              });
          } finally {
              console.groupEnd();
          }
      },
    completeCottura: async (req, res) => {
        console.group('✅ completeCottura');
        try {
            const { id } = req.params;
            const { cotturaId, temperaturaFinale, verificatoDa } = req.body;

            // Verifica lo stato attuale della cottura
            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            }).populate('cotture.tipoCottura');

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    message: "Lavorazione non trovata"
                });
            }

            const cottura = lavorazione.cotture.find(c => c._id.toString() === cotturaId);
            
            if (!cottura) {
                return res.status(404).json({
                    success: false,
                    message: "Cottura non trovata"
                });
            }

            if (cottura.stato !== 'in_corso') {
                return res.status(400).json({
                    success: false,
                    message: "La cottura deve essere in corso per essere completata"
                });
            }

            // Aggiorna la cottura
            const updatedLavorazione = await DettaglioLavorazione.findOneAndUpdate(
                { _id: id, 'cotture._id': cotturaId },
                {
                    $set: {
                        'cotture.$.stato': 'completata',
                        'cotture.$.fine': new Date(),
                        'cotture.$.temperaturaFinale': temperaturaFinale,
                        'cotture.$.verificatoDa': verificatoDa
                    }
                },
                { new: true }
            ).populate('cotture.tipoCottura');

            return res.json({
                success: true,
                data: updatedLavorazione.cotture
            });
        } catch (error) {
            console.error('Errore completeCottura:', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        } finally {
            console.groupEnd();
        }
    },

    removeCottura: async (req, res) => {
        console.group('🗑️ removeCottura');
        try {
            const { id, cotturaId } = req.params;

            const lavorazione = await DettaglioLavorazione.findOne({
                _id: id,
                'cotture._id': cotturaId
            });

            if (!lavorazione) {
                return res.status(404).json({
                    success: false,
                    code: 'LAVORAZIONE_NOT_FOUND',
                    message: "Lavorazione o cottura non trovata"
                });
            }

            const cottura = lavorazione.cotture.id(cotturaId);
            if (cottura.stato === 'in_corso') {
                return res.status(400).json({
                    success: false,
                    code: 'INVALID_STATE',
                    message: "Non è possibile rimuovere una cottura in corso"
                });
            }

            const updatedLavorazione = await DettaglioLavorazione.findByIdAndUpdate(
                id,
                { $pull: { cotture: { _id: cotturaId } } },
                { new: true }
            ).populate('cotture.tipoCottura');

            return res.json({
                success: true,
                data: updatedLavorazione.cotture,
                message: "Cottura rimossa con successo"
            });
        } catch (error) {
            console.error('Errore removeCottura:', error);
            return res.status(500).json({
                success: false,
                code: 'REMOVE_COTTURA_ERROR',
                message: "Errore nella rimozione cottura",
                error: error.message
            });
        } finally {
            console.groupEnd();
        }
    }
};

module.exports = cotturaController;
