import React from 'react';
import { FaSave, FaSync } from 'react-icons/fa';
import useIngredientiHaccp from './hooks/useIngredientiHaccp';
import useIngredientiHaccpStyles from './hooks/useIngredientiHaccpStyles';
import IngredientiTable from './components/IngredientiTable';
import StatusMessage from './components/StatusMessage';

const IngredientiHACCP = () => {
    const S = useIngredientiHaccpStyles();
    const {
        ricetta,
        verifiche,
        loading,
        error,
        isDirty,
        lastSaved,
        isComplete,
        totalIngredienti,
        verificatiCount,
        actions
    } = useIngredientiHaccp();

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
                    <S.StatValue>{totalIngredienti}</S.StatValue>
                </S.StatBox>
                <S.StatBox>
                    <S.StatLabel>Verificati</S.StatLabel>
                    <S.StatValue>{verificatiCount}</S.StatValue>
                </S.StatBox>
                <S.StatBox>
                    <S.StatLabel>Stato</S.StatLabel>
                    <S.StatValue status={isComplete ? 'complete' : 'pending'}>
                        {isComplete ? 'Completato' : 'In Corso'}
                    </S.StatValue>
                </S.StatBox>
            </S.StatsContainer>

            <S.TableContainer>
                <IngredientiTable
                    ingredienti={ricetta?.ingredienti}
                    verifiche={verifiche}
                    onUpdateVerifica={actions.updateVerifica}
                />
            </S.TableContainer>

            <S.ActionBar>
                <S.SaveButton
                    onClick={actions.handleSave}
                    disabled={!isDirty || loading}
                >
                    <FaSave />
                    Salva Verifiche
                </S.SaveButton>

                <S.SaveButton
                    onClick={actions.refreshData}
                    disabled={loading}
                    variant="secondary"
                >
                    <FaSync />
                    Aggiorna
                </S.SaveButton>

                {lastSaved && (
                    <S.LastSavedText>
                        Ultimo salvataggio: {new Date(lastSaved).toLocaleString()}
                    </S.LastSavedText>
                )}
            </S.ActionBar>
        </S.Container>
    );
};

export default IngredientiHACCP;
