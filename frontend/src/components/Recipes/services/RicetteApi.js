// frontend\src\components\Recipes\services\RicetteApi.js
import { apiService } from '../../../features/lavorazioni/services/api';

class RicetteApi {
    static async getRicettaDetails(ricettaId) {
      console.group('📖 getRicettaDetails');
      console.log('🔑 ID Ricetta:', ricettaId);

      try {
        // Validate input
        if (!ricettaId) {
          console.warn('⚠️ Missing ricettaId');
          return { success: false, error: 'ID ricetta non fornito' };
        }

        const url = `/api/ricette/${ricettaId}`;
        console.log('🌐 Requesting:', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);
      
        const data = await response.json();
        console.log('📦 Response data:', data);

        return {
          success: response.ok,
          data: data,
          status: response.status
        };

      } catch (error) {
        console.error('❌ Error:', error);
        return {
          success: false,
          error: error.message,
          details: error
        };
      } finally {
        console.groupEnd();
      }
    }

    static async getAllRicette() {
      console.group('📚 getAllRicette');
    
      try {
        const response = await fetch('/api/ricette');
        const data = await response.json();
      
        console.log('📦 Ricette loaded:', data);
        return { success: true, data };
      } catch (error) {
        console.error('❌ Error loading ricette:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getRicetteByCategoria(categoriaId) {
      console.group('📚 getRicetteByCategoria');
      try {
        const response = await apiService.fetch(`/api/ricette/categoria/${categoriaId}`);
        return response;
      } catch (error) {
        console.error('Errore recupero ricette per categoria:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getFasiRicetta(ricettaId) {
      console.group('🔄 getFasiRicetta');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/fasi`);
        return response;
      } catch (error) {
        console.error('Errore recupero fasi:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getIngredientiRicetta(ricettaId) {
      console.group('🥘 getIngredientiRicetta');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/ingredienti`);
        return response;
      } catch (error) {
        console.error('Errore recupero ingredienti:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getCottureRicetta(ricettaId) {
      console.group('🔥 getCottureRicetta');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/cotture`);
        return response;
      } catch (error) {
        console.error('Errore recupero cotture:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getValoriNutrizionali(ricettaId) {
      console.group('🍎 getValoriNutrizionali');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/valori-nutrizionali`);
        return response;
      } catch (error) {
        console.error('Errore recupero valori nutrizionali:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async searchRicette(params) {
      console.group('🔍 searchRicette');
      try {
        const queryString = new URLSearchParams(params).toString();
        const response = await apiService.fetch(`/api/ricette/search?${queryString}`);
        return response;
      } catch (error) {
        console.error('Errore ricerca ricette:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getStatisticheRicetta(ricettaId) {
      console.group('📊 getStatisticheRicetta');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/statistiche`);
        return response;
      } catch (error) {
        console.error('Errore recupero statistiche:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }

    static async getRicetteSimili(ricettaId) {
      console.group('🔄 getRicetteSimili');
      try {
        const response = await apiService.fetch(`/api/ricette/${ricettaId}/simili`);
        return response;
      } catch (error) {
        console.error('Errore recupero ricette simili:', error);
        return { success: false, error: error.message };
      } finally {
        console.groupEnd();
      }
    }
}

export default RicetteApi;
