import axios from 'axios';

const BASE_URL = '/api';

class NutritionService {
    constructor() {
        this.cache = new Map();
    }

    async getNutritionById(ingredientId) {
        console.group('🌐 Nutrition Service Call');
        console.log('Richiesta dati per ingrediente:', ingredientId);

        if (!ingredientId) {
            console.log('Nessun ID ingrediente fornito');
            console.groupEnd();
            return null;
        }
        
        if (this.cache.has(ingredientId)) {
            console.log('Dati recuperati dalla cache');
            console.groupEnd();
            return this.cache.get(ingredientId);
        }

        try {
            const response = await axios.get(`${BASE_URL}/ingredienti/${ingredientId}`);
            console.log('Risposta API:', response.data);
            
            const nutritionData = response.data.nutrition || {
                kcal: 0,
                proteins: 0,
                carbohydrates: 0,
                fats: 0,
                saturatedFats: 0,
                sugars: 0,
                salt: 0
            };
            
            this.cache.set(ingredientId, nutritionData);
            console.log('Dati elaborati e salvati in cache:', nutritionData);
            console.groupEnd();
            return nutritionData;
        } catch (error) {
            console.error('Errore nel recupero dati:', error);
            console.groupEnd();
            return null;
        }
    }

    calculateRecipeNutrition(ingredients, servings) {
        const totals = {
            kcal: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
            saturatedFats: 0,
            sugars: 0,
            salt: 0
        };

        ingredients.forEach(ing => {
            const quantity = ing.quantita / 100; // converti in percentuale
            const nutrition = ing.ingrediente.nutrition;
            
            Object.keys(totals).forEach(key => {
                totals[key] += (nutrition[key] || 0) * quantity;
            });
        });

        const perServing = {};
        Object.keys(totals).forEach(key => {
            perServing[key] = totals[key] / servings;
        });

        return { totals, perServing };
    }

    clearCache() {
        this.cache.clear();
        console.log('Cache pulita');
    }
}

export const nutritionService = new NutritionService();
