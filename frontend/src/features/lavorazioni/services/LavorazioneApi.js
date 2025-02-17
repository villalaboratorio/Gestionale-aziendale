import { apiService } from '../services/api';

const buildQueryString = (params) => {
    return Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
};

const LavorazioneApi = {
    _pendingRequests: new Map(),
    _batchTimeout: null,
    _batchSize: 0,

    async getDashboardLavorazioni(filters, page = 1, pageSize = 10) {
        const queryParams = buildQueryString({
            page: page.toString(),
            pageSize: pageSize.toString(),
            ...filters
        });
        return await apiService.fetch(`/api/dettaglio-lavorazioni/dashboard?${queryParams}`);
    },
      async getLavorazione(id, options = {}) {
          console.group('🔍 getLavorazione');
          try {
              const response = await apiService.fetch(`/api/dettaglio-lavorazioni/${id}/informazioni-generali`, options);
              console.log('Risposta API:', response);
            
              if (!response.success) {
                  throw new Error('Errore nel recupero dati lavorazione');
              }

              // Normalizzo i dati della lavorazione
              const lavorazioneData = {
                  ...response.data,
                  ricetta: response.data.ricetta ? {
                      _id: response.data.ricetta._id,
                      nome: response.data.ricetta.nome,
                      cotture: response.data.ricetta.cotture || [],
                      ...response.data.ricetta
                  } : null
              };

              console.log('Dati normalizzati:', lavorazioneData);
              return {
                  success: true,
                  data: lavorazioneData
              };
          } catch (error) {
              console.error('Errore in getLavorazione:', error);
              return {
                  success: false,
                  error: error.message
              };
          } finally {
              console.groupEnd();
          }
      },
    async getCollections() {
        return apiService.fetch('/api/dettaglio-lavorazioni/initial-data');
    },

    async createLavorazione(data) {
        const cleanData = {};
        for (let key in data) {
            if (data[key] && typeof data[key] === 'object') {
                if ('_id' in data[key]) {
                    cleanData[key] = data[key]._id;
                } else if (!('current' in data[key])) {
                    cleanData[key] = data[key];
                }
            } else {
                cleanData[key] = data[key];
            }
        }

        return apiService.fetch('/api/dettaglio-lavorazioni', {
            method: 'POST',
            body: JSON.stringify(cleanData)
        });
    },

    async updateLavorazione(id, data) {
        const cleanData = {};
        for (let key in data) {
            if (data[key] && typeof data[key] === 'object' && '_id' in data[key]) {
                cleanData[key] = data[key]._id;
            } else {
                cleanData[key] = data[key];
            }
        }
        return apiService.fetch(`/api/dettaglio-lavorazioni/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cleanData)
        });
    },

    async deleteLavorazione(id) {
        return apiService.fetch(`/api/dettaglio-lavorazioni/${id}`, {
            method: 'DELETE'
        });
    },

    async saveModifica(id, campo, valore) {
        return apiService.fetch(`/api/dettaglio-lavorazioni/${id}/modifica`, {
            method: 'PATCH',
            body: JSON.stringify({ campo, valore })
        });
    },

    getTipiCottura: async () => {
        console.group('🍳 getTipiCottura');
        try {
            const response = await apiService.fetch('/api/tipo-cotture');
            if (Array.isArray(response)) {
                return {
                    success: true,
                    data: response.map(tipo => ({
                        value: tipo._id,
                        label: tipo.name
                    }))
                };
            }
            return { success: false, data: [] };
        } catch (error) {
            console.error('Errore nel recupero tipi cottura:', error);
            return { success: false, data: [] };
        } finally {
            console.groupEnd();
        }
    },

    registerTemperatura: async (lavorazioneId, datiTemperatura) => {
        console.group('🌡️ registerTemperatura');
        try {
            const response = await apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/cotture/temperatura`, {
                method: 'POST',
                body: JSON.stringify(datiTemperatura)
            });
            return response;
        } finally {
            console.groupEnd();
        }
    },

    async getCotture(lavorazioneId) {
        const cacheKey = `cotture-${lavorazioneId}`;
        if (this._pendingRequests.has(cacheKey)) {
            return this._pendingRequests.get(cacheKey);
        }

        const request = apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/cotture`);
        this._pendingRequests.set(cacheKey, request);

        try {
            const response = await request;
            return response;
        } finally {
            this._pendingRequests.delete(cacheKey);
        }
    },

    async updateCottura(lavorazioneId, cotturaId, data) {
        this._batchSize++;
        if (this._batchSize >= 5) {
            clearTimeout(this._batchTimeout);
            this._batchSize = 0;
        }

        return apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/cotture/${cotturaId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
};

const passaggiEndpoints = {
    getPassaggi: async (lavorazioneId) => {
        console.group('📋 getPassaggi');
        try {
            return await apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/passaggi`);
        } finally {
            console.groupEnd();
        }
    },

    updatePassaggio: async (lavorazioneId, passaggioId, data) => {
        console.group('📝 updatePassaggio');
        try {
            return await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/passaggi/${passaggioId}`,
                {
                    method: 'PUT',
                    body: JSON.stringify(data)
                }
            );
        } finally {
            console.groupEnd();
        }
    },

    addPassaggio: async (lavorazioneId, datiPassaggio) => {
        console.group('➕ addPassaggio');
        try {
            return await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/passaggi`,
                {
                    method: 'POST',
                    body: JSON.stringify(datiPassaggio)
                }
            );
        } finally {
            console.groupEnd();
        }
    },

    deletePassaggio: async (lavorazioneId, passaggioId) => {
        console.group('🗑️ deletePassaggio');
        try {
            return await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/passaggi/${passaggioId}`,
                {
                    method: 'DELETE'
                }
            );
        } finally {
            console.groupEnd();
        }
    }
};

const cottureEndpoints = {
    getCotture: async (lavorazioneId) => {
        console.group('🍳 getCotture');
        try {
            const response = await apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/cotture`);
            console.log('Risposta getCotture:', response);
            return response;
        } catch (error) {
            console.error('Errore getCotture:', error);
            throw error;
        } finally {
            console.groupEnd();
        }
    },

    addCottura: async (lavorazioneId, datiCottura) => {
        console.group('➕ addCottura');
        try {
            return await apiService.fetch(`/api/dettaglio-lavorazioni/${lavorazioneId}/cotture`, {
                method: 'POST',
                body: JSON.stringify({
                    tipoCottura: datiCottura.tipoCottura,
                    temperaturaTarget: datiCottura.temperaturaTarget || 0,
                    addetto: datiCottura.addetto || 'Da assegnare',
                    stato: 'non_iniziata',
                    inizio: null,
                    fine: null,
                    temperaturaFinale: null,
                    verificatoDa: null
                })
            });
        } finally {
            console.groupEnd();
        }
    },

    startCottura: async (lavorazioneId, datiCottura) => {
        console.group('🔥 startCottura');
        try {
            const response = await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/cotture/start`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        cotturaId: datiCottura.cotturaId,
                        tipoCottura: datiCottura.tipoCottura,
                        temperaturaTarget: datiCottura.temperaturaTarget,
                        addetto: datiCottura.addetto,
                        inizio: new Date()
                    })
                }
            );
            return response;
        } finally {
            console.groupEnd();
        }
    },

    completeCottura: async (lavorazioneId, datiCompletamento) => {
        console.group('✅ completeCottura');
        try {
            const response = await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/cotture/complete`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        cotturaId: datiCompletamento.cotturaId,
                        temperaturaFinale: datiCompletamento.temperaturaFinale,
                        verificatoDa: datiCompletamento.verificatoDa,
                        fine: new Date()
                    })
                }
            );
            return response;
        } finally {
            console.groupEnd();
        }
    },

    removeCottura: async (lavorazioneId, cotturaId) => {
        console.group('🗑️ removeCottura');
        try {
            const response = await apiService.fetch(
                `/api/dettaglio-lavorazioni/${lavorazioneId}/cotture/${cotturaId}`,
                {
                    method: 'DELETE'
                }
            );
            console.log('Risposta removeCottura:', response);
            return response;
        } catch (error) {
            console.error('Errore removeCottura:', error);
            throw error;
        } finally {
            console.groupEnd();
        }
    }
};

Object.assign(LavorazioneApi, passaggiEndpoints, cottureEndpoints);

export default LavorazioneApi;
