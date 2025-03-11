import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { materiePrimeApi } from '../../../pianificazione/api/endpoints/materiePrimeApi';
import { IMateriaPrima } from '../../../pianificazione/types/materiePrime.types';
import { 
  MateriePrimeContainer, 
  GiacenzaCard, 
  GiacenzaHeader,
  GiacenzaBody,
  ClienteInfo,
  TempoGiacenzaIndicator,
  ActionButtons,
  FilterControls,
  EmptyState,
  LoadingState
} from './GiacenzaMateriePrime.styles';

export const GiacenzaMateriePrime: React.FC = () => {
  const [materiePrime, setMateriePrime] = useState<IMateriaPrima[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'critical'>('critical');
  const [filterClient, setFilterClient] = useState<string>('all');
  
  // Calcola i giorni di giacenza - aggiunto supporto per Date o string
  const calcolaGiorniGiacenza = (dataArrivo: string | Date) => {
    const arrivo = dataArrivo instanceof Date ? dataArrivo : new Date(dataArrivo);
    const oggi = new Date();
    const diffTime = Math.abs(oggi.getTime() - arrivo.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // TODO: Future enhancement - Considerare il tipo di prodotto e la sua deperibilità specifica
  // invece di usare soglie fisse per tutti i prodotti
  const getLivelloCriticita = (giorni: number) => {
    if (giorni >= 7) return 'critical';
    if (giorni >= 5) return 'warning';
    return 'normal';
  };
  
  // Carica i dati delle materie prime
  useEffect(() => {
    const fetchMateriePrime = async () => {
      try {
        setLoading(true);
        
        // Utilizziamo materiePrimeApi invece di axios diretto
        const response = await materiePrimeApi.getAll();
        
        if (!response.success) {
          throw new Error('Errore nel caricamento delle materie prime');
        }
        
        // Filtra per mostrare solo quelle con quantità residua > 0
        const filtered = response.data.filter((mp: IMateriaPrima) => 
          mp.quantitaResidua > 0
        );
        
        // Ordina in base alla criticità o alla data
        const sorted = [...filtered].sort((a, b) => {
          if (sortBy === 'critical') {
            const giorniA = calcolaGiorniGiacenza(a.date);
            const giorniB = calcolaGiorniGiacenza(b.date);
            return giorniB - giorniA; // Prima le più critiche
          } else {
            return new Date(a.date).getTime() - new Date(b.date).getTime(); // Prima le più vecchie
          }
        });
        
        setMateriePrime(sorted);
        setLoading(false);
      } catch (err) {
        setError('Errore nel caricamento delle materie prime');
        setLoading(false);
        console.error('Errore fetch materie prime:', err);
      }
    };
    
    fetchMateriePrime();
  }, [sortBy]);
  
  if (loading) {
    return (
      <MateriePrimeContainer>
        <GiacenzaHeader>
          <h2>Materie Prime in Giacenza</h2>
        </GiacenzaHeader>
        <LoadingState>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
          <p>Caricamento materie prime...</p>
        </LoadingState>
      </MateriePrimeContainer>
    );
  }
  
  if (error) {
    return (
      <MateriePrimeContainer>
        <GiacenzaHeader>
          <h2>Materie Prime in Giacenza</h2>
        </GiacenzaHeader>
        <div className="alert alert-danger">
          {error}
        </div>
      </MateriePrimeContainer>
    );
  }
  
  return (
    <MateriePrimeContainer>
      <GiacenzaHeader>
        <h2>Materie Prime in Giacenza</h2>
        <FilterControls>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as 'date' | 'critical')}
          >
            <option value="critical">Ordina per criticità</option>
            <option value="date">Ordina per data arrivo</option>
          </select>
          <select 
            value={filterClient} 
            onChange={(e) => setFilterClient(e.target.value)}
          >
            <option value="all">Tutti i clienti</option>
            {/* Qui andrebbero aggiunte dinamicamente le opzioni dei clienti */}
          </select>
        </FilterControls>
      </GiacenzaHeader>
      
      {materiePrime.length === 0 ? (
        <EmptyState>
          <i className="fas fa-box-open fa-3x"></i>
          <p>Nessuna materia prima in giacenza</p>
        </EmptyState>
      ) : (
        <div className="giacenza-list">
          {materiePrime.map((mp) => {
            const giorniGiacenza = calcolaGiorniGiacenza(mp.date);
            const criticita = getLivelloCriticita(giorniGiacenza);
            const percentualeUtilizzata = ((mp.quantitaIniziale - mp.quantitaResidua) / mp.quantitaIniziale) * 100;
            
            return (
              <GiacenzaCard key={mp._id} criticita={criticita}>
                <div className="card-header">
                  <h3>
                    {mp.products[0]?.name || 'Materia Prima'}
                    <span className="badge badge-lot">Lotto: {mp.products[0]?.lotNumber || 'N/D'}</span>
                  </h3>
                  <span className="doc-number">Doc: {mp.documentNumber}</span>
                </div>
                
                <GiacenzaBody>
                  <ClienteInfo>
                    <i className="fas fa-building"></i>
                    <span>Cliente: {mp.cliente?.nome || 'N/D'}</span>
                  </ClienteInfo>
                  
                  <div className="date-info">
                    <div>
                      <i className="fas fa-calendar-check"></i>
                      <span>Arrivo: {new Date(mp.date).toLocaleDateString('it-IT')}</span>
                    </div>
                    <div>
                      <i className="fas fa-hourglass-half"></i>
                      <span>Giorni giacenza: {giorniGiacenza}</span>
                    </div>
                  </div>
                  
                  <TempoGiacenzaIndicator criticita={criticita}>
                    <div className="progress">
                      <div 
                        className={`progress-bar bg-${criticita}`}
                        style={{ width: `${Math.min(giorniGiacenza / 7 * 100, 100)}%` }}
                      ></div>
                    </div>
                    {criticita === 'critical' && (
                      <div className="alert-message">
                        <i className="fas fa-exclamation-triangle"></i>
                        Superato tempo giacenza consigliato!
                      </div>
                    )}
                    {criticita === 'warning' && (
                      <div className="alert-message">
                        <i className="fas fa-exclamation-circle"></i>
                        Vicino al limite di giacenza consigliato
                      </div>
                    )}
                  </TempoGiacenzaIndicator>
                  
                  <div className="usage-info">
                  <div className="quantity">
  <span>
    Quantità residua: {mp.quantitaResidua} {
      mp.products && mp.products[0]?.unit && 
      (typeof mp.products[0].unit === 'object' ? 
        // Se è un oggetto con una proprietà name
        (mp.products[0].unit as any).name || 'unità' : 
        // Se è una stringa
        String(mp.products[0].unit) || 'unità')
    }
  </span>
  <span>({percentualeUtilizzata.toFixed(1)}% utilizzato)</span>
</div>
                    <div className="prelievi">
                      <span>Prelievi: {mp.prelievi?.length || 0}</span>
                      {mp.prelievi?.length > 0 && (
                        <span>Ultimo: {new Date(mp.prelievi[mp.prelievi.length-1].dataPrelievo).toLocaleDateString('it-IT')}</span>
                      )}
                    </div>
                  </div>
                  
                  <ActionButtons>
                    <Link 
                      to={`/materie-prime/${mp._id}`} 
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-eye me-1"></i> Dettagli
                    </Link>
                    <Link 
                      to={`/v2/pianificazione?materiaPrima=${mp._id}`} 
                      className="btn btn-outline-secondary btn-sm"
                    >
                      <i className="fas fa-clipboard-list me-1"></i> Pianifica
                    </Link>
                  </ActionButtons>
                </GiacenzaBody>
              </GiacenzaCard>
            );
          })}
        </div>
      )}
    </MateriePrimeContainer>
  );
};
