Documentazione aggiornata: Implementazione del Modulo Cottura
1. Panoramica e Architettura
1.1 Obiettivo
Implementare un'interfaccia completa per la gestione delle cotture all'interno di una lavorazione, permettendo agli operatori di:

Visualizzare le cotture esistenti con relativi stati e timer
Aggiungere nuove cotture con parametri predefiniti
Avviare, interrompere e completare cotture
Monitorare il tempo trascorso per ogni cottura
1.2 Struttura dei File Attuale
frontend/src/features/lavorazioni/pages/DettaglioLavorazione/sections/Cotture/
├── CotturaTab.tsx                    // Componente principale che coordina gli altri
├── components/
│   ├── CotturaList.tsx               // Lista cotture 
│   ├── CotturaItem.tsx               // Componente singola cottura
│   ├── CotturaForm.tsx               // Form per aggiungere/modificare
│   ├── CotturaTimer/                 // Sottocartella per timer
│   │   ├── CotturaTimer.tsx          // Componente timer
│   │   └── CotturaTimer.css          // Stili CSS diretti (problema di architettura)
│   └── InterruzioneCotturaModal.tsx  // Modal per note interruzione
└── CotturaTabs.css                   // Stili CSS diretti (problema di architettura)

Copy

Apply

1.3 Architettura del Sistema Stili (Problema Identificato)
Progetto generale: Utilizza Styled Components con ThemeProvider centralizzato
Modulo Cottura attuale: Utilizza CSS diretto e classi Bootstrap
Incompatibilità: I componenti attuali non accedono alle variabili del tema globale
2. Specifiche dei Componenti
2.1 CotturaTab
Responsabilità: Componente principale che coordina tutti gli altri componenti e gestisce lo stato globale delle cotture.

Dipendenze:

useLavorazioneContext: Accede a lavorazione, collections, loading states e actions
Componenti child: CotturaList, CotturaForm, InterruzioneCotturaModal
Stato:

isAddMode: boolean - Indica se l'utente sta aggiungendo una nuova cottura
selectedCottura: Cottura | null - La cottura selezionata per modifica
showInterruptModal: boolean - Controlla la visibilità del modal di interruzione
cotturaToInterrupt: string | null - ID della cottura da interrompere
Funzioni principali:

handleAddCottura(): Prepara lo stato per aggiungere una nuova cottura
handleEditCottura(cottura): Imposta la cottura selezionata per modifica
handleCancel(): Annulla l'operazione corrente
handleSaveCottura(cottura): Salva una nuova cottura o aggiorna una esistente
handleStartCottura(cotturaId): Avvia una cottura esistente
handleRequestInterrupt(cotturaId): Richiede l'interruzione di una cottura
handleInterruptCottura(motivazione): Interrompe una cottura con motivazione
handleCompleteCottura(cotturaId, temperaturaFinale): Completa una cottura
handleDeleteCottura(cotturaId): Elimina una cottura
2.2 CotturaList
Responsabilità: Visualizza la lista delle cotture esistenti con relativi stati, timer e azioni possibili.

Props:

cotture: Cottura[] - Array delle cotture da visualizzare
onEdit: (cottura: Cottura) => void - Callback per modifica
onDelete: (cotturaId: string) => void - Callback per eliminazione
onStart: (cotturaId: string) => void - Callback per avvio
onInterrupt: (cotturaId: string) => void - Callback per interruzione
onComplete: (cotturaId: string, tempFinale?: number) => void - Callback per completamento
loading: boolean - Stato di caricamento
Problema attuale: Utilizza classi CSS dirette invece di styled-components, causando incompatibilità con il sistema di tema.

2.3 CotturaItem
Responsabilità: Visualizza una singola cottura nella lista.

Props:

cottura: Cottura - Dati della cottura
onAction: (type: string, cotturaId: string, data?: any) => void - Callback per azioni
loading: boolean - Stato di caricamento
Problema attuale: Utilizza classi CSS dirette invece di styled-components, mancando di accesso al tema globale.

2.4 CotturaTimer
Responsabilità: Visualizza il timer della cottura.

Props:

cottureAttive: boolean - Indica se ci sono cotture attive
stato: StatoCottura - Stato della cottura
tempoRimanente: number - Tempo rimanente in secondi
Implementazione attuale: Utilizza un file CSS separato (CotturaTimer.css) invece di styled-components.

3. Modelli di Dati
3.1 Principali Interfacce
enum StatoCottura {
  NON_INIZIATA = 'non_iniziata',
  IN_CORSO = 'in_corso',
  COMPLETATA = 'completata'
}

interface TipoCottura {
  _id: string;
  nome: string;
  descrizione?: string;
  temperaturaMin?: number;
  temperaturaMax?: number;
  tempoMedio?: number;
}

interface Cottura {
  _id?: string;
  tipoCottura: TipoCottura;
  temperaturaTarget: number;
  addetto: string;
  stato: StatoCottura;
  inizio?: string;
  fine?: string;
  temperaturaFinale?: number;
  verificatoDa?: string;
  noteInterruzione?: string;
}

Copy

Apply

3.2 Transizioni di Stato
NON_INIZIATA → IN_CORSO: Avvio cottura
IN_CORSO → COMPLETATA: Completamento o interruzione
Non è possibile tornare a uno stato precedente
3.3 Azioni Permesse per Stato
NON_INIZIATA: Modifica, Elimina, Avvia
IN_CORSO: Interrompi, Completa
COMPLETATA: Solo visualizzazione (nessuna azione modificante permessa)
4. Flussi di Interazione
4.1 Aggiunta Nuova Cottura
Utente clicca "Aggiungi Cottura"
CotturaTab imposta isAddMode = true
CotturaForm mostra form con valori predefiniti
Utente compila i dati
Al submit del form, CotturaForm chiama onSave
CotturaTab esegue handleSaveCottura
Aggiorna array cotture con ID temporaneo
Chiama actions.handleSave con lavorazione aggiornata
Reset stato a visualizzazione lista
4.2 Avvio Cottura
Utente clicca "Avvia" su una cottura
CotturaList chiama onStart con ID cottura
CotturaTab esegue handleStartCottura
Aggiorna stato a IN_CORSO
Imposta inizio a timestamp corrente
Salva lavorazione aggiornata
CotturaTimer inizia a visualizzare tempo trascorso
4.3 Interruzione Cottura
Utente clicca "Interrompi"
CotturaList chiama onInterrupt
CotturaTab mostra InterruzioneCotturaModal
Utente inserisce motivazione
Al conferma, InterruzioneCotturaModal chiama onConfirm
CotturaTab esegue handleInterruptCottura
Aggiorna stato a COMPLETATA
Imposta fine a timestamp corrente
Salva motivazione e aggiorna lavorazione
5. Problemi Attuali e Soluzioni Proposte
5.1 Incompatibilità Sistema Stile
Problema: I componenti utilizzano CSS diretto e classi Bootstrap invece di styled-components con accesso al tema.

Soluzione proposta:

Convertire gradualmente ogni componente a styled-components
Iniziare dai componenti foglia (CotturaTimer)
Sostituire tutte le classi CSS dirette con styled-components
Utilizzare ${({ theme }) => theme.colors.primary} per accedere al tema
5.2 Piano di Migrazione Stili
Fase 1: Convertire CotturaTimer
Fase 2: Convertire CotturaItem
Fase 3: Convertire CotturaList
Fase 4: Convertire CotturaForm
Fase 5: Convertire InterruzioneCotturaModal
Fase 6: Aggiornare CotturaTab
5.3 Passi Specifici per ogni Componente
Per CotturaTimer:

Rimuovere import CotturaTimer.css
Creare styled components equivalenti agli stili CSS
Utilizzare props theme per colori e dimensioni
Testare visualizzazione e comportamento
Per CotturaItem e CotturaList:

Sostituire classi Bootstrap con styled components equivalenti
Utilizzare variabili theme per colori, spazi, ecc.
Adattare la struttura per mantenere compatibilità con i componenti parent
6. Integrazione API e Backend
6.1 Utilizzo di LavorazioneContext
Attualmente tutte le interazioni con il backend sono gestite tramite actions del LavorazioneContext:

// Salvataggio cottura
await actions.handleSave({
  ...lavorazione,
  cotture: updatedCotture
});

Copy

Apply

6.2 Endpoints Utilizzati (via LavorazioneService)
POST /lavorazioni/:id - Aggiorna l'intera lavorazione, comprese le cotture
GET /lavorazioni/:id - Ottiene dettagli lavorazione, incluse cotture
GET /collections - Ottiene tipi cottura e altre collezioni necessarie
7. Considerazioni Finali
7.1 Priorità di Intervento
Alta: Risolvere incompatibilità stili per garantire visualizzazione corretta
Media: Migliorare gestione timer e calcolo tempi
Bassa: Estendere funzionalità (grafici, notifiche, ecc.)
7.2 Test Necessari
Verificare che ogni componente convertito a styled-components mantenga funzionalità originali
Testare tutti i flussi utente (aggiunta, avvio, completamento, ecc.)
Verificare rendering condizionale e stati di loading
7.3 Note per Implementazioni Future
Considerare utilizzo di React.memo per ottimizzare rendering
Valutare estrattori di logica in custom hooks separati
Implementare form più robusti con gestione errori migliorata