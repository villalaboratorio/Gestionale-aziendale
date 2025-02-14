const STORAGE_KEYS = {
    LAVORAZIONI_DRAFT: 'lavorazioni_draft',
    LAST_MODIFIED: 'last_modified',
    BACKUP: 'lavorazioni_backup'
};

export const storageManager = {
    // Salva lo stato corrente
    saveDraft: (lavorazioni) => {
        localStorage.setItem(STORAGE_KEYS.LAVORAZIONI_DRAFT, JSON.stringify(lavorazioni));
        localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, new Date().toISOString());
    },

    // Recupera l'ultimo stato salvato
    loadDraft: () => {
        const draft = localStorage.getItem(STORAGE_KEYS.LAVORAZIONI_DRAFT);
        return draft ? JSON.parse(draft) : null;
    },

    // Crea backup
    createBackup: (lavorazioni) => {
        const backup = {
            data: lavorazioni,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEYS.BACKUP, JSON.stringify(backup));
    },

    // Ripristina da backup
    restoreFromBackup: () => {
        const backup = localStorage.getItem(STORAGE_KEYS.BACKUP);
        return backup ? JSON.parse(backup) : null;
    },

    // Pulisci storage
    clearStorage: () => {
        localStorage.removeItem(STORAGE_KEYS.LAVORAZIONI_DRAFT);
        localStorage.removeItem(STORAGE_KEYS.LAST_MODIFIED);
    }
};
