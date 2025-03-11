/**
 * Utility per formattare le risposte API in modo consistente
 */
exports.createResponse = (success, data, message = '', error = null) => {
    return {
        success,
        data,
        message: message || (success ? 'Operazione completata con successo' : 'Si è verificato un errore'),
        error,
        timestamp: Date.now()
    };
};
