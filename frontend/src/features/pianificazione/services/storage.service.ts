/**
 * Servizio per la gestione del salvataggio locale dei dati di pianificazione
 */
export class StorageService {
  private prefix = 'pianificazione_';

  /**
   * Salva un dato con la chiave specificata
   */
  save(key: string, data: unknown): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(data));
    } catch (error) {
      console.error('Errore durante il salvataggio:', error);
    }
  }

  /**
   * Salva una bozza di lavorazione
   * @param data Dati della bozza da salvare
   */
  saveDraft(data: unknown): void {
    try {
      localStorage.setItem('pianificazione_drafts', JSON.stringify(data));
    } catch (error) {
      console.error('Errore durante il salvataggio della bozza:', error);
    }
  }

  /**
   * Carica un dato dalla chiave specificata
   */
  load<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(this.getKey(key));
      return data ? JSON.parse(data) as T : null;
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      return null;
    }
  }

  /**
   * Carica le bozze salvate
   */
  loadDraft<T>(): T | null {
    try {
      const draftsJson = localStorage.getItem('pianificazione_drafts');
      if (!draftsJson) return null;
      return JSON.parse(draftsJson) as T;
    } catch (error) {
      console.error('Errore nel caricamento delle bozze salvate:', error);
      return null;
    }
  }

  /**
   * Rimuove un dato specifico
   */
  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  /**
   * Rimuove tutte le bozze salvate
   */
  removeDraft(): void {
    localStorage.removeItem('pianificazione_drafts');
  }

  /**
   * Rimuove tutti i dati relativi alla pianificazione
   */
  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  /**
   * Alias di clear() - mantiene compatibilità con il codice esistente
   */
  clearStorage(): void {
    this.clear();
  }

  /**
   * Ottiene tutti i dati relativi alla pianificazione
   */
  getAllData(): Record<string, unknown> {
    const result: Record<string, unknown> = {};
   
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => {
        const pureKey = key.replace(this.prefix, '');
        result[pureKey] = this.load(pureKey);
      });
     
    return result;
  }

  /**
   * Verifica se esiste una bozza salvata
   */
  hasDraft(): boolean {
    return localStorage.getItem('pianificazione_drafts') !== null;
  }

  /**
   * Crea un backup dei dati nel localStorage
   * @param key Chiave per identificare il backup
   * @param data Dati da salvare
   */
  createBackup<T>(key: string, data: T): void {
    try {
      const timestamp = new Date().toISOString();
      const backupKey = `${this.prefix}backup_${key}_${timestamp}`;
      const serializedData = JSON.stringify(data);
      
      localStorage.setItem(backupKey, serializedData);
      console.log(`Backup creato con chiave: ${backupKey}`);
      
      // Limita il numero di backup salvati (mantiene solo gli ultimi 5)
      this.cleanupOldBackups(key, 5);
    } catch (error) {
      console.error('Errore durante la creazione del backup:', error);
    }
  }

  /**
   * Recupera l'ultimo backup disponibile
   * @param key Chiave per identificare il backup
   */
  getLatestBackup<T>(key: string): T | null {
    try {
      const allKeys = this.getAllBackupKeys(key);
      if (allKeys.length === 0) return null;
      
      // Ordina per timestamp (dal più recente al più vecchio)
      const latestKey = allKeys.sort().reverse()[0];
      const data = localStorage.getItem(latestKey);
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Errore durante il recupero del backup:', error);
      return null;
    }
  }

  /**
   * Ripristina l'ultimo backup disponibile
   * @param key Chiave per identificare il backup
   * @returns I dati ripristinati o null se nessun backup è disponibile
   */
  restoreFromBackup<T>(key: string): T | null {
    const backup = this.getLatestBackup<T>(key);
    if (backup) {
      this.save(key, backup);
      console.log(`Backup ripristinato per la chiave: ${key}`);
    }
    return backup;
  }

  /**
   * Ottiene tutti i backup disponibili per una data chiave
   * @param key Chiave per identificare i backup
   */
  getAllBackups<T>(key: string): Record<string, T> {
    const result: Record<string, T> = {};
    const keys = this.getAllBackupKeys(key);
    
    keys.forEach(backupKey => {
      const data = localStorage.getItem(backupKey);
      if (data) {
        // Usa solo la parte timestamp della chiave come identificatore
        const timestamp = backupKey.split('_').pop() || backupKey;
        result[timestamp] = JSON.parse(data);
      }
    });
    
    return result;
  }

  /**
   * Ottiene tutte le chiavi di backup per un dato prefisso
   */
  private getAllBackupKeys(keyPrefix: string): string[] {
    const backupPrefix = `${this.prefix}backup_${keyPrefix}_`;
    const allKeys: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(backupPrefix)) {
        allKeys.push(key);
      }
    }
    
    return allKeys;
  }

  /**
   * Rimuove i backup più vecchi, mantenendo solo il numero specificato
   */
  private cleanupOldBackups(keyPrefix: string, keepCount: number): void {
    const allKeys = this.getAllBackupKeys(keyPrefix);
    if (allKeys.length <= keepCount) return;
    
    // Ordina le chiavi per timestamp (dal più vecchio al più recente)
    const sortedKeys = allKeys.sort();
    
    // Rimuovi i backup più vecchi
    const keysToRemove = sortedKeys.slice(0, sortedKeys.length - keepCount);
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }
}

// Esportiamo l'istanza singleton
export const storageService = new StorageService();
