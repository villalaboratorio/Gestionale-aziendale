# Matrice Responsabilità

## Ruoli
1. Operatore Produzione
   - Esecuzione fasi
   - Registrazione parametri
   - Log attività

2. Responsabile Qualità
   - Validazione HACCP
   - Approvazione fasi
   - Gestione non conformità

3. Supervisore
   - Avvio lavorazione
   - Chiusura lavorazione
   - Gestione eccezioni

## Permessi per Stato
| Stato      | Operatore | Resp. Qualità | Supervisore |
|------------|-----------|---------------|-------------|
| IN_ATTESA  | View      | View          | Edit        |
| IN_CORSO   | Edit      | Edit          | Edit        |
| COMPLETATA | View      | Edit          | Edit        |
