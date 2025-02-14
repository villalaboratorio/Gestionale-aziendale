// src/utils/dateUtils.js
export const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Verifica se la data è valida
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
};

export const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    
    // Verifica se la data è valida
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
};

export const parseDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString);
};

export const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
};
