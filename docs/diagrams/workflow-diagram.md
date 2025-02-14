# Diagramma Flusso Lavorazioni

```mermaid
graph TD
    A[Pianificazione] --> B[In Attesa]
    B --> C[In Corso]
    C --> D[Preparazione]
    D --> E[Cottura]
    E --> F[Abbattimento]
    F --> G[Completata]
    C --> H[Annullata]
