import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useRecipeData = (recipeId) => {
    const [editedRecipe, setEditedRecipe] = useState({
        nome: '',
        categoria: '',
        descrizione: '',
        porzioni: 1,
        grammiPerPorzione: 0,
        difficolta: 'facile',
        stagionalita: 'tutto l\'anno'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await axios.get('/api/category-recipes');
            setCategories(response.data);
        } catch (err) {
            setError('Errore nel caricamento delle categorie');
            console.error('Errore nel recupero delle categorie:', err);
        } finally {
            setCategoriesLoading(false);
        }
    }, []);

    const loadRecipe = useCallback(async () => {
        try {
            const response = await axios.get(`/api/ricette/${recipeId}`);
            setEditedRecipe(response.data);
            setError(null);
        } catch (err) {
            setError('Errore nel caricamento della ricetta');
            console.error(err);
        }
    }, [recipeId]);

    const autoSave = useCallback(async () => {
        if (!isEditing || recipeId === 'new') return;
        
        try {
            await axios.post(`/api/ricette/${recipeId}/temp`, {
                ...editedRecipe,
                lastModified: new Date()
            });
            setLastSaved(new Date());
            setError(null);
        } catch (err) {
            console.error('Errore autosave:', err);
            setError('Errore nel salvataggio automatico');
        }
    }, [editedRecipe, recipeId, isEditing]);

    useEffect(() => {
        if (!isEditing || recipeId === 'new') return;
        
        const timer = setInterval(autoSave, 30000);
        return () => clearInterval(timer);
    }, [autoSave, isEditing, recipeId]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    useEffect(() => {
        if (recipeId && recipeId !== 'new') {
            loadRecipe();
        }
    }, [recipeId, loadRecipe]);

    useEffect(() => {
        if (recipeId === 'new') {
            setIsEditing(true);
        }
    }, [recipeId]);

    const handleChange = (field, value) => {
        if (!isEditing) return;
        setEditedRecipe(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateRecipe = (newData) => {
        setEditedRecipe(newData);
    };

    return {
        editedRecipe,
        error,
        isEditing,
        lastSaved,
        setIsEditing,
        updateRecipe,
        handleChange,
        categories,
        categoriesLoading
    };
};
