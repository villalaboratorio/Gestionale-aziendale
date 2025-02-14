import React from 'react';
import { useLavorazione } from '../hooks/useLavorazione';
import { useProcessoLavorazione } from '../hooks/useProcessoLavorazione';
import LavorazioneHeader from './LavorazioneHeader';
import LavorazioneActions from './LavorazioneActions';
import LavorazioneTabs from './tabs/LavorazioneTabs';

const LavorazioneForm = ({ id }) => {
    const { 
        lavorazione, 
        loading, 
        error, 
        handleSave, 
        handleDelete 
    } = useLavorazione(id);

    const {
        fase,
        avviaCottura,
        avviaAbbattimento,
        avviaAssemblaggio,
        completaFase,
        loading: processoLoading
    } = useProcessoLavorazione(id);

    if (loading) return <div>Caricamento...</div>;
    if (error) return <div>Errore: {error}</div>;

    return (
        <div className="lavorazione-form">
            <LavorazioneHeader 
                lavorazione={lavorazione}
                fase={fase}
            />
            
            <LavorazioneActions 
                onSave={handleSave}
                onDelete={handleDelete}
                fase={fase}
                onAvviaCottura={avviaCottura}
                onAvviaAbbattimento={avviaAbbattimento}
                onAvviaAssemblaggio={avviaAssemblaggio}
                onCompletaFase={completaFase}
                loading={processoLoading}
            />
            
            <LavorazioneTabs 
                lavorazione={lavorazione}
                fase={fase}
                onUpdate={handleSave}
            />
        </div>
    );
};

export default LavorazioneForm;
