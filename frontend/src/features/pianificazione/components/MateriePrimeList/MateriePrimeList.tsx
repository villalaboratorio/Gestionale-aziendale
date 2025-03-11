import React, { useEffect, useState } from 'react';
import { usePianificazione } from '../../hooks/usePianificazione';
import { useMateriePrimeActions } from '../../hooks/useMateriePrimeActions';
import { IMateriaPrima } from '../../types/materiePrime.types';
import { logger } from '../../../../core/Path/logging/logger';
import * as S from './MateriePrimeList.styles';

const MateriePrimeList: React.FC = () => {
  // State e azioni rimangono invariati
  const { state } = usePianificazione();
  const { loadMateriePrime, selectMateriaPrima } = useMateriePrimeActions();
  const [searchTerm, setSearchTerm] = useState('');
  
  const materiePrimeList = state.materiePrime.items;
  const selectedMateriaPrima = state.materiePrime.selected;
  const loading = state.materiePrime.loading;
  const error = state.materiePrime.error;
  
  useEffect(() => {
    loadMateriePrime();
    logger.debug('Componente MateriePrimeList inizializzato');
  }, [loadMateriePrime]);
  
  // Logica di filtro e selezione rimane invariata
  const handleMateriaPrimaClick = (materiaPrima: IMateriaPrima) => {
    selectMateriaPrima(materiaPrima);
  };
  
  const filteredMateriePrime = searchTerm.trim()
    ? materiePrimeList.filter(mp => 
        mp.products[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mp.cliente?.nome.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : materiePrimeList;
  
  const handleSearchChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(target.value);
  };
  
  // Funzioni di formattazione rimangono invariate
  const formatQuantity = (quantity: number): string => {
    return quantity.toFixed(2);
  };
  
  const formatDate = (date: Date): string => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return 'Data non valida';
    }
  };
  
  // Rimosso il titolo <h3> poiché ora viene gestito dal Panel
  return (
    <S.Container>
      <S.SearchContainer>
        <input
          type="text"
          placeholder="Cerca per nome o cliente..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </S.SearchContainer>
      
      {loading && (
        <S.LoadingState>
          Caricamento materie prime...
        </S.LoadingState>
      )}
      
      {error && <S.EmptyState>{error}</S.EmptyState>}
      
      {!loading && filteredMateriePrime.length === 0 && (
        <S.EmptyState>
          {searchTerm 
            ? "Nessuna materia prima corrisponde alla ricerca" 
            : "Non ci sono materie prime disponibili"}
        </S.EmptyState>
      )}
      
      <S.ItemCount>{filteredMateriePrime.length} disponibili</S.ItemCount>
      
      {!loading && filteredMateriePrime.length > 0 && (
        <S.MateriePrimeGrid>
        {filteredMateriePrime.map((materiaPrima) => (
          <S.MateriaPrimaCard 
            key={materiaPrima._id}
            $isSelected={selectedMateriaPrima?._id === materiaPrima._id}
            onClick={() => handleMateriaPrimaClick(materiaPrima)}
          >
            <h4>{materiaPrima.products[0]?.name || 'N/A'}</h4>
              
              <div>
                <p>Cliente: {materiaPrima.cliente?.nome || 'N/A'}</p>
                <p>Lotto: {materiaPrima.products[0]?.lotNumber || 'N/A'}</p>
                <p>Data: {formatDate(materiaPrima.date)}</p>
              </div>
              
              <S.IndicatoreQuantita>
                <S.QuantitaRow>
                  <span>Quantità disponibile:</span>
                  <span>{formatQuantity(materiaPrima.quantitaResidua)} kg</span>
                </S.QuantitaRow>
              </S.IndicatoreQuantita>
            </S.MateriaPrimaCard>
          ))}
        </S.MateriePrimeGrid>
      )}
    </S.Container>
  );
};

export default MateriePrimeList;
