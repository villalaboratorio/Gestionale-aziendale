const mongoose = require('mongoose');
const MateriaPrima = require('../models/materiePrimeModel');
const Ricetta = require('../models/ricettaModel');
const DettaglioLavorazione = require('../models/dettaglioLavorazioneModel');
const ProcessingStates = mongoose.model('ProcessingStates');
const ProcessingTypes = mongoose.model('ProcessingTypes');

// Controller per la pianificazione lavorazioni
const pianificazioneController = {
  // Ottiene materie prime disponibili (con quantità > 0)
  getMateriePrimeDisponibili: async (req, res) => {
    try {
      const materiePrime = await MateriaPrima.find({ 
        quantitaResidua: { $gt: 0 },
        isActive: { $ne: false } // Includi anche se isActive non è definito
      })
        .populate('cliente')
        .populate('products')
        .sort({ date: -1 });
      
      res.json({
        success: true,
        data: materiePrime,
        message: 'Materie prime recuperate con successo'
      });
    } catch (error) {
      console.error('Errore nel recupero delle materie prime:', error);
      res.status(500).json({
        success: false,
        message: 'Errore nel recupero delle materie prime',
        error: error.message
      });
    }
  },
  
  // Trova ricette compatibili con una materia prima
  getSuggerimentiRicette: async (req, res) => {
    try {
      const materiaPrimaId = req.query.materiaPrimaId;
      
      // Trova la materia prima
      const materiaPrima = await MateriaPrima.findById(materiaPrimaId)
        .populate('cliente')
        .populate('products');
        
      if (!materiaPrima) {
        return res.status(404).json({
          success: false,
          message: 'Materia prima non trovata'
        });
      }
      
      // Nome del prodotto principale della materia prima
      const nomeProdotto = materiaPrima.products[0]?.name || '';
      
      // Trova tutte le ricette attive
      const ricette = await Ricetta.find({ isActive: true })
        .populate('ingredienti.ingrediente')
        .populate('ingredienti.unitaMisura')
        .populate('categoria');
      
      // Calcola compatibilità per ogni ricetta
      const suggerimenti = ricette.map(ricetta => {
        // Verifica compatibilità con ingredienti
        const compatibilita = ricetta.ingredienti.map(ing => {
          const nomeIngrediente = ing.ingrediente.name;
          // Funzione per calcolare match score
          const score = calcolaMatchScore(nomeProdotto, nomeIngrediente);
          return { ingredienteId: ing.ingrediente._id, score };
        });
        
        // Prendi il match più alto
        const migliorMatch = compatibilita.reduce((best, current) => 
          current.score > best.score ? current : best, { score: 0 });
          
        // Calcola suggerimento
        const quantitaConsigliata = Math.min(materiaPrima.quantitaResidua, 
          (ricetta.porzioni * ricetta.grammiPerPorzione) / 1000 || materiaPrima.quantitaResidua);
          
        const porzioniOttenibili = Math.floor(
          (quantitaConsigliata * 1000) / (ricetta.grammiPerPorzione || 100)
        );
        
        return {
          ricetta,
          compatibilita: migliorMatch,
          quantitaConsigliata,
          porzioniOttenibili
        };
      });
      
      // Filtra per compatibilità minima e ordina
      const risultatiFiltrati = suggerimenti
        .filter(s => s.compatibilita.score > 0)
        .sort((a, b) => b.compatibilita.score - a.compatibilita.score);
      
      res.json({
        success: true,
        data: risultatiFiltrati,
        message: 'Suggerimenti ricette recuperati con successo'
      });
    } catch (error) {
      console.error('Errore nel recupero dei suggerimenti:', error);
      res.status(500).json({
        success: false,
        message: 'Errore nel recupero dei suggerimenti',
        error: error.message
      });
    }
  },
  
  // Conferma lavorazioni e preleva materie prime
  confermaLavorazioni: async (req, res) => {
    try {
      const { lavorazioni } = req.body;
      
      if (!lavorazioni || !Array.isArray(lavorazioni) || lavorazioni.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Nessuna lavorazione da confermare'
        });
      }
      
      console.log('Richiesta di conferma lavorazioni:', JSON.stringify(lavorazioni, null, 2));
      
      // Ottieni stati e tipi di lavorazione predefiniti
      const statoDefault = await getStatoLavorazioneDefault();
      const tipoDefault = await getTipoLavorazioneDefault();
      
      if (!statoDefault) {
        console.warn('Nessuno stato di lavorazione predefinito trovato');
      }
      
      const risultati = [];
      
      // Esegui in sequenza (idealmente dovrebbe essere una transazione)
      for (const lavorazione of lavorazioni) {
        // Verifica materia prima
        const materiaPrima = await MateriaPrima.findById(lavorazione.materiaPrima.id);
        if (!materiaPrima || materiaPrima.quantitaResidua < lavorazione.quantitaTotale) {
          risultati.push({
            success: false,
            message: `Quantità insufficiente per materia prima ${lavorazione.materiaPrima.nome}`,
            lavorazione
          });
          continue;
        }
        
        try {
          // Crea lavorazione
          const nuovaLavorazione = new DettaglioLavorazione({
            numeroScheda: await generateNumeroScheda(),
            cliente: lavorazione.clienteId,
            ricetta: lavorazione.ricettaId,
            dataLavorazione: new Date(),
            dataConsegnaPrevista: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // +7 giorni
            operatore: lavorazione.operatore || 'Sistema',
            
            // Campi obbligatori aggiornati
            statoLavorazione: statoDefault?._id || null,
            tipoLavorazione: tipoDefault?._id || null,
             // Informazioni Porzioni e Peso
    porzioniPreviste: lavorazione.porzioniPreviste || 0,
    grammiPerPorzione: lavorazione.grammiPerPorzione || 0,
    pesoTotale: lavorazione.quantitaTotale || 0, // Quantità totale in kg
            // Altri campi utili
            noteProduzione: lavorazione.note || '',
            noteAllergeni: '',
            noteConfezionamento: '',
            
            // Campi addizionali da lavorazione
            prioritaCliente: 'media',
            isUrgente: false
          });
          
          console.log('Tentativo di creazione lavorazione:', {
            numeroScheda: nuovaLavorazione.numeroScheda,
            cliente: nuovaLavorazione.cliente,
            ricetta: nuovaLavorazione.ricetta,
            statoLavorazione: nuovaLavorazione.statoLavorazione
          });
          
          const lavorazioneSalvata = await nuovaLavorazione.save();
          console.log('Lavorazione salvata con ID:', lavorazioneSalvata._id);
          
          // Preleva quantità da materia prima
          await MateriaPrima.findByIdAndUpdate(
            lavorazione.materiaPrima.id,
            {
              $inc: { quantitaResidua: -lavorazione.quantitaTotale },
              $push: { 
                prelievi: {
                  quantitaPrelevata: lavorazione.quantitaTotale,
                  dataPrelievo: new Date(),
                  numeroPorzioni: lavorazione.porzioniPreviste,
                  grammiPerPorzione: lavorazione.grammiPerPorzione,
                  quantitaResidua: materiaPrima.quantitaResidua - lavorazione.quantitaTotale,
                  lotNumber: lavorazione.materiaPrima.lotNumber,
                  destinazioneLavorazione: lavorazioneSalvata._id
                }
              }
            }
          );
          
          risultati.push({
            success: true,
            message: 'Lavorazione confermata con successo',
            lavorazioneId: lavorazioneSalvata._id,
            numeroScheda: lavorazioneSalvata.numeroScheda
          });
        } catch (error) {
          console.error('Errore nel salvataggio della lavorazione:', error);
          
          // Log dettagliato per errori di validazione
          if (error.name === 'ValidationError') {
            console.error('Errori di validazione:');
            for (const field in error.errors) {
              console.error(`- Campo ${field}: ${error.errors[field].message}`);
            }
          }
          
          risultati.push({
            success: false,
            message: `Errore nel salvataggio della lavorazione: ${error.message}`,
            lavorazione,
            error: error.toString()
          });
        }
      }
      
      // Determina lo stato generale della risposta
      const tuttiSuccesso = risultati.every(r => r.success);
      
      res.status(tuttiSuccesso ? 200 : 207).json({
        success: tuttiSuccesso,
        data: risultati,
        message: tuttiSuccesso 
          ? 'Tutte le lavorazioni confermate con successo' 
          : 'Alcune lavorazioni non sono state confermate'
      });
    } catch (error) {
      console.error('Errore generale nella conferma delle lavorazioni:', error);
      res.status(500).json({
        success: false,
        message: 'Errore nella conferma delle lavorazioni',
        error: error.message
      });
    }
  }
};

// Funzione helper per generare un numero scheda univoco
async function generateNumeroScheda() {
  const ultimaLavorazione = await DettaglioLavorazione.findOne().sort({ numeroScheda: -1 });
  let ultimoNumero = 0;
  
  if (ultimaLavorazione && ultimaLavorazione.numeroScheda) {
    const match = ultimaLavorazione.numeroScheda.match(/LAV(\d+)/);
    if (match && match[1]) {
      ultimoNumero = parseInt(match[1]);
    }
  }
  
  return `LAV${(ultimoNumero + 1).toString().padStart(4, '0')}`;
}

// Funzione helper per calcolare match score tra nomi
function calcolaMatchScore(nome1, nome2) {
  if (!nome1 || !nome2) return 0;
  
  const n1 = nome1.toLowerCase().trim();
  const n2 = nome2.toLowerCase().trim();
  
  if (n1 === n2) return 1; // Match esatto
  if (n1.includes(n2) || n2.includes(n1)) return 0.8; // Match parziale
  
  // Confronta le prime parole
  const p1 = n1.split(' ')[0];
  const p2 = n2.split(' ')[0];
  if (p1 === p2) return 0.6;
  
  return 0; // Nessun match
}

// Funzione per ottenere lo stato di lavorazione predefinito
async function getStatoLavorazioneDefault() {
  try {
    // Prima cerca IN_ATTESA, poi qualsiasi altro stato
    let stato = await ProcessingStates.findOne({ name: 'IN_ATTESA' });
    if (!stato) {
      stato = await ProcessingStates.findOne();
    }
    return stato;
  } catch (error) {
    console.error('Errore nel recupero dello stato predefinito:', error);
    return null;
  }
}

// Funzione per ottenere il tipo di lavorazione predefinito
async function getTipoLavorazioneDefault() {
  try {
    return await ProcessingTypes.findOne();
  } catch (error) {
    console.error('Errore nel recupero del tipo predefinito:', error);
    return null;
  }
}

module.exports = pianificazioneController;
