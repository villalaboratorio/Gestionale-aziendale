import { useMemo } from 'react';

const useInformazioniGeneraliForm = ({ collections }) => {
    // Configurazione dei campi del form
    const formFields = useMemo(() => [
        {
            id: 'cliente',
            label: 'Cliente',
            type: 'select',
            options: collections.clienti || [],
            required: true,
            gridSpan: 6
        },
        {
            id: 'ricetta',
            label: 'Ricetta',
            type: 'select',
            options: collections.ricette || [],
            required: true,
            gridSpan: 6
        },
        {
            id: 'tipoLavorazione',
            label: 'Tipo Lavorazione',
            type: 'select',
            options: collections.tipiLavorazione || [],
            optionLabel: 'nome',
            required: true,
            gridSpan: 4
        },
        {
            id: 'statoLavorazione',
            label: 'Stato Lavorazione',
            type: 'select',
            options: collections.statiLavorazione || [],
             optionLabel: 'name',
            required: true,
            gridSpan: 4
        },
        
        {
            id: 'dataLavorazione',
            label: 'Data Lavorazione',
            type: 'date',
            required: true,
            gridSpan: 4
        },
        {
            id: 'dataLavorazione',
            label: 'Data Lavorazione',
            type: 'date',
            required: true,
            gridSpan: 4
        },
        {
            id: 'dataConsegnaPrevista',
            label: 'Data Consegna Prevista',
            type: 'date',
            required: true,
            gridSpan: 4
        },
        {
            id: 'noteProduzione',
            label: 'Note Produzione',
            type: 'textarea',
            gridSpan: 12
        },
        {
            id: 'noteAllergeni',
            label: 'Note Allergeni',
            type: 'textarea',
            gridSpan: 12
        }
    ], [collections]);

    return { formFields };
};

export default useInformazioniGeneraliForm;