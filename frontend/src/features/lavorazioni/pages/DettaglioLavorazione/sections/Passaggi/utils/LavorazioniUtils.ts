export const lavorazioniUtils = {
    /**
     * Formatta una data in formato leggibile
     */
    formatDateTime: (date: Date): string => {
      return new Intl.DateTimeFormat('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    },
    
    /**
     * Calcola la durata tra due date in formato leggibile
     */
    calcolaDurata: (inizio: Date, fine: Date): string => {
      const diffMs = fine.getTime() - inizio.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      
      if (diffMinutes < 60) {
        return `${diffMinutes} minuti`;
      }
      
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      return `${hours} ore ${minutes > 0 ? `e ${minutes} minuti` : ''}`;
    }
  };
  