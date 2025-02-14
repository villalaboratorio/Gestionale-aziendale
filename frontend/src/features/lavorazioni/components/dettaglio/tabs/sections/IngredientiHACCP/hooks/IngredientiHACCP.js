import React from 'react';
import { FaSave, FaSync } from 'react-icons/fa';
import { useStore } from '../../../store/lavorazioneStore';
import IngredientiTable from './components/IngredientiTable';
import StatusMessage from './components/StatusMessage';
import * as S from './@DettaglioLavorazione.styles';

const IngredientiHACCP = () => {
    const {
        lavorazione,
        loading,
        error,
        updateVerificaIngrediente,
        getVerificheHaccpStats,
        handleSave,
        fetchData
    } = useStore();

    const stats = getVerificheHaccpStats();

    if (loading) {
        return <StatusMessage loading>Caricamento verifiche HACCP...</StatusMessage>;
    }

    if (error) {
        return <StatusMessage error>{error}</StatusMessage>;
    }

    return (
        <S.Container>
            <S.Header>
                <S.Title>Verifiche HACCP Ingredienti</S.Title>
            </S.Header>

            <S.StatsContainer>
                <S.StatBox>
                    <S.StatLabel>Totale Ingredienti</S.StatLabel>
                    <S.StatValue>{stats.totalIngredienti}</S.StatValue>
                </S.StatBox>
                <S.StatBox>
                    <S.StatLabel>Verificati</S.StatLabel>
                    <S.StatValue>{stats.verificatiCount}</S.StatValue>
                </S.StatBox>
                <S.StatBox>
                    <S.StatLabel>Stato</S.StatLabel>
                    <S.StatValue status={stats.isComplete ? 'complete' : 'pending'}>
                        {stats.isComplete ? 'Completato' : 'In Corso'}
                    </S.StatValue>
                </S.StatBox>
            </S.StatsContainer>

            <S.TableContainer>
                <IngredientiTable
                    ingredienti={lavorazione.ricetta?.ingredienti}
                    verifiche={lavorazione.verificheHaccp}
                    onUpdateVerifica={updateVerificaIngrediente}
                />
            </S.TableContainer>

            <S.ActionBar>
                <S.SaveButton
                    onClick={() => handleSave(lavorazione)}
                    disabled={!lavorazione.isDirty || loading}
                >
                    <FaSave />
                    Salva Verifiche
                </S.SaveButton>

                <S.SaveButton
                    onClick={fetchData}
                    disabled={loading}
                    variant="secondary"
                >
                    <FaSync />
                    Aggiorna
                </S.SaveButton>

                {lavorazione.lastSaved && (
                    <S.LastSavedText>
                        Ultimo salvataggio: {new Date(lavorazione.lastSaved).toLocaleString()}
                    </S.LastSavedText>
                )}
            </S.ActionBar>
        </S.Container>
    );
};

export default IngredientiHACCP;
