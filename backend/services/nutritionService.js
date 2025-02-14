const axios = require('axios');

class NutritionService {
    constructor() {
        this.BASE_URL = 'https://it.openfoodfacts.org';
        this.cache = new Map();
    }

    async searchProduct(query) {
        try {
            console.log('Ricerca prodotto con query:', query);
            const response = await axios.get(`${this.BASE_URL}/cgi/search.pl`, {
                params: {
                    search_terms: query,
                    search_language: 'it',
                    page_size: 5,
                    json: true,
                    lc: 'it',
                    countries: 'Italy'
                }
            });

            const products = response.data.products
                .filter(product => product.product_name_it || product.product_name)
                .map(product => ({
                    id: product._id,
                    name: product.product_name_it || product.product_name,
                    barcode: product.code,
                    brand: product.brands,
                    image: product.image_url,
                    nutrition: {
                        kcal: product.nutriments['energy-kcal_100g'] || product.nutriments['energy-kcal'] || 0,
                        fats: product.nutriments.fat_100g || product.nutriments.fat || 0,
                        saturatedFats: product.nutriments['saturated-fat_100g'] || product.nutriments['saturated-fat'] || 0,
                        carbohydrates: product.nutriments.carbohydrates_100g || product.nutriments.carbohydrates || 0,
                        sugars: product.nutriments.sugars_100g || product.nutriments.sugars || 0,
                        proteins: product.nutriments.proteins_100g || product.nutriments.proteins || 0,
                        salt: product.nutriments.salt_100g || product.nutriments.salt || 0
                    }
                }));

            console.log('Prodotti trovati:', products);
            return products;
        } catch (error) {
            console.error('Errore nella ricerca prodotti:', error);
            return [];
        }
    }

    async getNutritionByBarcode(barcode) {
        if (this.cache.has(barcode)) {
            console.log('Dati recuperati dalla cache per barcode:', barcode);
            return this.cache.get(barcode);
        }

        try {
            console.log('Richiesta dati per barcode:', barcode);
            const response = await axios.get(`${this.BASE_URL}/api/v2/product/${barcode}.json`);
            
            if (!response.data.product) {
                console.log('Prodotto non trovato per barcode:', barcode);
                return null;
            }

            const product = response.data.product;
            console.log('Dati prodotto ricevuti:', product);

            const nutritionData = {
                kcal: product.nutriments['energy-kcal_100g'] || product.nutriments['energy-kcal'] || 0,
                fats: product.nutriments.fat_100g || product.nutriments.fat || 0,
                saturatedFats: product.nutriments['saturated-fat_100g'] || product.nutriments['saturated-fat'] || 0,
                carbohydrates: product.nutriments.carbohydrates_100g || product.nutriments.carbohydrates || 0,
                sugars: product.nutriments.sugars_100g || product.nutriments.sugars || 0,
                proteins: product.nutriments.proteins_100g || product.nutriments.proteins || 0,
                salt: product.nutriments.salt_100g || product.nutriments.salt || 0,
                productName: product.product_name_it || product.product_name || '',
                brand: product.brands || '',
                quantity: product.quantity || '',
                image: product.image_url || ''
            };

            console.log('Dati nutrizionali elaborati:', nutritionData);
            this.cache.set(barcode, nutritionData);
            return nutritionData;
        } catch (error) {
            console.error('Errore nel recupero valori nutrizionali:', error);
            if (error.response) {
                console.error('Dettagli errore:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            return null;
        }
    }

    clearCache() {
        this.cache.clear();
        console.log('Cache pulita');
    }
}

module.exports = new NutritionService();
