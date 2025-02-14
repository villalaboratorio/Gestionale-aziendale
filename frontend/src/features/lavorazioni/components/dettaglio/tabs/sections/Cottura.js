import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlay, FaStop, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Card, Input, Button, Select } from '../../../atoms';
import useLavorazioneStore from '../../../../store/lavorazioneStore';
import useCottura from '../../../../hooks/useCottura';
import styled from 'styled-components';

const StyledComponents = {
    Container: styled.div`
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    `,
    Card: styled(Card)`
        padding: 20px;
        position: relative;
    `,
    DeleteButton: styled(Button)`
        position: absolute;
        top: 10px;
        right: 10px;
        background: ${({ theme }) => theme.colors.error};
        padding: 8px;
    `,
    ParametriGrid: styled.div`
        display: grid;
        grid-template-columns: 1.5fr 1fr 1.5fr 0.8fr 1.5fr 0.8fr 1.2fr;
        gap: 16px;
        align-items: flex-end;
        margin-top: 20px;
    `,
    ActionButton: styled(Button)`
        height: 40px;
        margin-top: 22px;
    `,
    AddButton: styled(Button)`
        margin-top: 20px;
        align-self: flex-start;
    `
};

const Cottura = () => {
    const { id } = useParams();
    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});
   
    const {
        tipiCottura,
        fetchTipiCottura,
        loadingTipiCottura
    } = useLavorazioneStore();
   
    const {
        cotture,
        loading,
        error,
        getCotture,
        addCottura,
        removeCottura,
        updateCottura,
        startCottura,
        completaCottura
    } = useCottura(id);

    const memoizedCotture = useMemo(() => cotture || [], [cotture]);
    const memoizedTipiCottura = useMemo(() => tipiCottura || [], [tipiCottura]);

    useEffect(() => {
        console.group('🔄 Ciclo di vita Cottura');
        if (id) {
            console.log('Inizializzazione cotture per ID:', id);
            Promise.all([
                fetchTipiCottura(),
                getCotture(true)
            ]).then(() => {
                console.log('✅ Inizializzazione completata');
            });
        }
        return () => {
            console.log('🧹 Pulizia componente Cottura');
            console.groupEnd();
        };
    }, [id, fetchTipiCottura, getCotture]);

    const handleAddCottura = useCallback(async () => {
        console.group('➕ Aggiunta Cottura');
        try {
            const response = await addCottura(id);
            if (response?.success) {
                console.log('✅ Cottura aggiunta con successo');
                await getCotture(true);
                toast.success('Nuova cottura aggiunta');
            }
        } catch (err) {
            console.error('❌ Errore aggiunta cottura:', err);
            toast.error('Errore nell\'aggiunta della cottura');
        } finally {
            console.groupEnd();
        }
    }, [addCottura, getCotture, id]);

    const handleStartCottura = useCallback(async (cotturaId) => {
        console.group('🔥 Avvio Cottura');
        try {
            await startCottura(cotturaId);
            console.log('✅ Cottura avviata');
            await getCotture(true);
            toast.success('Cottura avviata con successo');
        } catch (err) {
            console.error('❌ Errore avvio cottura:', err);
            toast.error('Errore nell\'avvio della cottura');
        } finally {
            console.groupEnd();
        }
    }, [startCottura, getCotture]);

    const handleEndCottura = useCallback(async (cotturaId) => {
        console.group('🏁 Completamento Cottura');
        try {
            await completaCottura(cotturaId);
            console.log('✅ Cottura completata');
            await getCotture(true);
            toast.success('Cottura completata con successo');
        } catch (err) {
            console.error('❌ Errore completamento cottura:', err);
            toast.error('Errore nel completamento della cottura');
        } finally {
            console.groupEnd();
        }
    }, [completaCottura, getCotture]);

    const handleEdit = (cotturaId) => {
        const cottura = cotture.find(c => c._id === cotturaId);
        setEditValues({
            temperaturaTarget: cottura.temperaturaTarget,
            addetto: cottura.addetto
        });
        setEditingId(cotturaId);
    };

    const handleSave = async (cotturaId) => {
        try {
            await updateCottura(cotturaId, 'temperaturaTarget', editValues.temperaturaTarget);
            await updateCottura(cotturaId, 'addetto', editValues.addetto);
            setEditingId(null);
            toast.success('Modifiche salvate con successo');
        } catch {
            toast.error('Errore nel salvataggio delle modifiche');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValues({});
    };

    if (loading || loadingTipiCottura) return <div>Caricamento...</div>;
    if (error) return <div>Errore: {error}</div>;

    return (
        <StyledComponents.Container>
            {memoizedCotture.map((cottura) => (
                <StyledComponents.Card key={cottura._id}>
                    <StyledComponents.ParametriGrid>
                        <Select
                            label="Tipo Cottura"
                            value={cottura.tipoCottura?._id || cottura.tipoCottura || ''}
                            onChange={(e) => updateCottura(cottura._id, 'tipoCottura', e.target.value)}
                            options={memoizedTipiCottura.map(tipo => ({
                                value: tipo._id || tipo.value,
                                label: tipo.name || tipo.label
                            }))}
                            placeholder="Seleziona tipo"
                            disabled={cottura.stato !== 'non_iniziata'}
                        />
                       
                        {editingId === cottura._id ? (
                            <>
                                <Input
                                    type="number"
                                    label="Temperatura Target (°C)"
                                    value={editValues.temperaturaTarget}
                                    onChange={(e) => setEditValues(prev => ({
                                        ...prev,
                                        temperaturaTarget: e.target.value
                                    }))}
                                    placeholder="°C"
                                />
                                <Input
                                    type="text"
                                    label="Operatore"
                                    value={editValues.addetto}
                                    onChange={(e) => setEditValues(prev => ({
                                        ...prev,
                                        addetto: e.target.value
                                    }))}
                                    placeholder="Nome operatore"
                                />
                            </>
                        ) : (
                            <>
                                <Input
                                    type="number"
                                    label="Temperatura Target (°C)"
                                    value={cottura.temperaturaTarget || ''}
                                    readOnly
                                    placeholder="°C"
                                />
                                <Input
                                    type="text"
                                    label="Operatore"
                                    value={cottura.addetto || ''}
                                    readOnly
                                    placeholder="Nome operatore"
                                />
                            </>
                        )}

                        <Input
                            type="datetime-local"
                            label="Inizio Cottura"
                            value={cottura.inizio ? new Date(cottura.inizio).toISOString().slice(0, 16) : ''}
                            readOnly
                        />
                       
                        <Input
                            type="datetime-local"
                            label="Fine Cottura"
                            value={cottura.fine ? new Date(cottura.fine).toISOString().slice(0, 16) : ''}
                            readOnly
                        />
                       
                        <div>
                            {cottura.stato === 'non_iniziata' && (
                                <>
                                    {editingId === cottura._id ? (
                                        <>
                                            <StyledComponents.ActionButton onClick={() => handleSave(cottura._id)} title="Salva modifiche">
                                                <FaSave />
                                            </StyledComponents.ActionButton>
                                            <StyledComponents.ActionButton onClick={handleCancel} title="Annulla">
                                                <FaTimes />
                                            </StyledComponents.ActionButton>
                                        </>
                                    ) : (
                                        <>
                                            <StyledComponents.ActionButton onClick={() => handleStartCottura(cottura._id)} title="Avvia cottura">
                                                <FaPlay />
                                            </StyledComponents.ActionButton>
                                            <StyledComponents.ActionButton onClick={() => handleEdit(cottura._id)} title="Modifica cottura">
                                                <FaEdit />
                                            </StyledComponents.ActionButton>
                                            <StyledComponents.DeleteButton onClick={() => removeCottura(cottura._id)} title="Elimina cottura">
                                                <FaTrash />
                                            </StyledComponents.DeleteButton>
                                        </>
                                    )}
                                </>
                            )}
                            
                            {cottura.stato === 'in_corso' && (
                                <>
                                    <StyledComponents.ActionButton onClick={() => handleEndCottura(cottura._id)} title="Termina cottura">
                                        <FaStop />
                                    </StyledComponents.ActionButton>
                                    <StyledComponents.ActionButton onClick={() => handleEdit(cottura._id)} title="Modifica cottura">
                                        <FaEdit />
                                    </StyledComponents.ActionButton>
                                    <StyledComponents.DeleteButton onClick={() => removeCottura(cottura._id)} title="Elimina cottura">
                                        <FaTrash />
                                    </StyledComponents.DeleteButton>
                                </>
                            )}

                            {cottura.stato === 'completata' && (
                                <>
                                    <StyledComponents.ActionButton onClick={() => handleEdit(cottura._id)} title="Modifica cottura">
                                        <FaEdit />
                                    </StyledComponents.ActionButton>
                                    <StyledComponents.DeleteButton onClick={() => removeCottura(cottura._id)} title="Elimina cottura">
                                        <FaTrash />
                                    </StyledComponents.DeleteButton>
                                </>
                            )}
                        </div>
                    </StyledComponents.ParametriGrid>
                </StyledComponents.Card>
            ))}

            <StyledComponents.AddButton
                onClick={handleAddCottura}
                disabled={loading}
            >
                Aggiungi Cottura
            </StyledComponents.AddButton>
        </StyledComponents.Container>
    );
};

export default React.memo(Cottura);
