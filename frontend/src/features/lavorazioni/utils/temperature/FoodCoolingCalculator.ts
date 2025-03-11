/**
 * Calcolatore avanzato per la previsione dell'abbattimento temperature
 * Basato sulla legge di Newton del raffreddamento: T(t) = T_amb + (T_0 - T_amb) * e^(-kt)
 */
export class FoodCoolingCalculator {
    // Parametri fisici
    private T_0: number;       // Temperatura iniziale
    private T_amb: number;     // Temperatura ambiente/abbattitore
    private k: number;         // Coefficiente di raffreddamento
    private readings: Array<{time: number, temp: number}> = []; // Letture registrate
    
    // Costanti per tipi di alimenti (predefiniti)
    private static readonly COOLING_COEFFICIENTS = {
      LIQUIDS: 0.12,           // Liquidi (zuppe, salse)
      LIGHT_SOLID: 0.08,       // Solidi leggeri (verdure)
      MEDIUM_SOLID: 0.06,      // Solidi medi (carne, pasta)
      DENSE_SOLID: 0.04,       // Solidi densi (arrosti, lasagne)
      FROZEN: 0.02             // Alimenti in congelamento
    };
    
    /**
     * Crea un nuovo calcolatore di abbattimento
     * @param initialTemp Temperatura iniziale in °C
     * @param ambientTemp Temperatura dell'abbattitore in °C
     * @param coolingType Tipo di alimento, determina il coefficiente di raffreddamento
     * @param customK Coefficiente di raffreddamento personalizzato (sovrascrive coolingType)
     */
    constructor(
      initialTemp: number, 
      ambientTemp: number,
      coolingType: 'LIQUIDS' | 'LIGHT_SOLID' | 'MEDIUM_SOLID' | 'DENSE_SOLID' | 'FROZEN' | 'CUSTOM' = 'MEDIUM_SOLID',
      customK?: number
    ) {
      // Validazione input
      if (initialTemp < -50 || initialTemp > 350) {
        console.warn(`Temperatura iniziale insolita: ${initialTemp}°C. Assicurarsi che sia corretta.`);
      }
      if (ambientTemp < -30 || ambientTemp > 30) {
        console.warn(`Temperatura ambiente insolita: ${ambientTemp}°C. Assicurarsi che sia corretta.`);
      }
      
      this.T_0 = initialTemp;
      this.T_amb = ambientTemp;
      
      // Determina coefficiente k
      if (customK !== undefined && coolingType === 'CUSTOM') {
        this.k = customK;
      } else {
        this.k = FoodCoolingCalculator.COOLING_COEFFICIENTS[coolingType];
      }
      
      // Prima lettura all'ora 0
      this.readings.push({ time: 0, temp: initialTemp });
    }
    
    /**
     * Calcola la temperatura attesa dopo un determinato tempo
     * @param time Tempo in minuti
     * @returns Temperatura prevista in °C
     */
    public getTemperatureAtTime(time: number): number {
      return this.T_amb + (this.T_0 - this.T_amb) * Math.exp(-this.k * time);
    }
    
    /**
     * Calcola il tempo necessario per raggiungere una temperatura target
     * @param targetTemp Temperatura target in °C
     * @returns Tempo stimato in minuti, o null se impossibile
     */
    public getTimeToReachTemperature(targetTemp: number): number | null {
      // Verifica se la temperatura target è raggiungibile
      if ((this.T_0 > this.T_amb && targetTemp <= this.T_amb) || 
          (this.T_0 < this.T_amb && targetTemp >= this.T_amb)) {
        // In teoria mai raggiungibile, ma in pratica consideriamo un margine
        return null;
      }
      
      // Se la temperatura target è uguale o molto vicina all'iniziale
      if (Math.abs(targetTemp - this.T_0) < 0.1) {
        return 0;
      }
      
      try {
        // Formula invertita: t = (-1/k) * ln((T_target - T_amb)/(T_0 - T_amb))
        const time = (-1 / this.k) * Math.log((targetTemp - this.T_amb) / (this.T_0 - this.T_amb));
        
        // Tempo negativo significa che la temperatura è già stata raggiunta
        return time > 0 ? time : 0;
      } catch (error) {
        console.error('Errore nel calcolo del tempo', error);
        return null;
      }
    }
    
    /**
     * Aggiunge una nuova lettura di temperatura e ricalibra il modello
     * @param time Tempo in minuti dalla partenza
     * @param temp Temperatura misurata in °C
     * @param recalibrate Se true, ricalibra il coefficiente k
     */
    public addTemperatureReading(time: number, temp: number, recalibrate: boolean = true): void {
      // Aggiungi la lettura
      this.readings.push({ time, temp });
      
      // Ricalibrare il modello con le nuove letture?
      if (recalibrate && this.readings.length >= 3) {
        this.recalibrateModel();
      }
    }
    
    /**
     * Ricalibra il modello usando le letture disponibili
     * Utilizza un approccio di regressione per trovare il miglior coefficiente k
     */
    private recalibrateModel(): void {
      // Abbiamo bisogno di almeno 3 punti per una calibrazione significativa
      if (this.readings.length < 3) {
        return;
      }
      
      try {
        // Prendi il primo e l'ultimo punto per ricalcolare
        const firstReading = this.readings[0];
        const lastReading = this.readings[this.readings.length - 1];
        
        // Evita divisione per zero o logaritmo di numero negativo
        if (firstReading.temp === this.T_amb || 
            lastReading.temp === this.T_amb || 
            (lastReading.temp - this.T_amb) * (firstReading.temp - this.T_amb) <= 0) {
          console.warn('Impossibile ricalibrare: dati non validi');
          return;
        }
        
        // Calcolo di k basato sui dati effettivi
        const deltaTime = lastReading.time - firstReading.time;
        if (deltaTime <= 0) {
          return; // Evita divisione per zero
        }
        
        // Formula: k = -ln((T_final - T_amb)/(T_initial - T_amb)) / (t_final - t_initial)
        const numerator = Math.log((lastReading.temp - this.T_amb) / (firstReading.temp - this.T_amb));
        this.k = -numerator / deltaTime;
        
        // Limita k a valori realistici
        if (this.k < 0.01) this.k = 0.01;
        if (this.k > 0.3) this.k = 0.3;
        
        console.log(`Coefficiente k ricalibrato: ${this.k.toFixed(4)}`);
      } catch (error) {
        console.error('Errore nella ricalibrazione del modello', error);
      }
    }
    
    /**
     * Genera una serie di punti per tracciare la curva di raffreddamento
     * @param duration Durata totale in minuti
     * @param numPoints Numero di punti da generare
     * @returns Array di punti {time, temp}
     */
    public generateCoolingCurve(duration: number, numPoints: number = 60): Array<{time: number, temp: number}> {
      const curve: Array<{time: number, temp: number}> = [];
      const timeStep = duration / (numPoints - 1);
      
      for (let i = 0; i < numPoints; i++) {
        const time = i * timeStep;
        const temp = this.getTemperatureAtTime(time);
        curve.push({ time, temp });
      }
      
      return curve;
    }
    
    /**
     * Calcola la curva di raffreddamento fino a una temperatura target
     * @param targetTemp Temperatura target in °C
     * @param numPoints Numero di punti da generare
     * @returns Array di punti {time, temp} o null se il target non è raggiungibile
     */
    public generateCurveToTarget(targetTemp: number, numPoints: number = 60): Array<{time: number, temp: number}> | null {
      const timeToTarget = this.getTimeToReachTemperature(targetTemp);
      
      if (timeToTarget === null) {
        return null;
      }
      
      return this.generateCoolingCurve(timeToTarget * 1.2, numPoints); // 20% in più per visualizzare oltre il target
    }
    
    /**
     * Stima il tempo residuo per raggiungere la temperatura target
     * @param currentTemp Temperatura attuale in °C
     * @param targetTemp Temperatura target in °C
     * @returns Tempo stimato in minuti
     */
    public estimateRemainingTime(currentTemp: number, targetTemp: number): number | null {
      // Aggiorna T_0 alla temperatura corrente per simulare ripartenza da qui
      const tempInitial = this.T_0;
      this.T_0 = currentTemp;
      
      const remainingTime = this.getTimeToReachTemperature(targetTemp);
      
      // Ripristina la T_0 originale
      this.T_0 = tempInitial;
      
      return remainingTime;
    }
    
    /**
     * Converte il tempo in formato leggibile HH:MM
     * @param minutes Tempo in minuti
     * @returns Stringa formattata HH:MM
     */
    public static formatTime(minutes: number | null): string {
      if (minutes === null) return "N/D";
      
      const hours = Math.floor(minutes / 60);
      const mins = Math.floor(minutes % 60);
      
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
  }
  