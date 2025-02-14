import React, { useState,  } from 'react';
import LavorazioniCard from '../components/HomePage/LavorazioniCard';
import MateriePrimeCard from '../components/HomePage/MateriePrimeCard';
import KPICard from '../components/HomePage/KPICard';
import LavorazioniCalendar from '../components/HomePage/LavorazioniCalendar';
import TeamSection from '../components/HomePage/TeamSection';
import LavorazioniRecenti from '../components/HomePage/LavorazioniRecenti';
import '../styles/HomePage.css';

const HomePage = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('oggi');

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    return (
        <div className="modern-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Operativa</h1>
                <div className="period-selector">
                    <button 
                        className={selectedPeriod === 'oggi' ? 'active' : ''} 
                        onClick={() => handlePeriodChange('oggi')}
                    >
                        Oggi
                    </button>
                    <button 
                        className={selectedPeriod === 'settimana' ? 'active' : ''} 
                        onClick={() => handlePeriodChange('settimana')}
                    >
                        Settimana
                    </button>
                    <button 
                        className={selectedPeriod === 'mese' ? 'active' : ''} 
                        onClick={() => handlePeriodChange('mese')}
                    >
                        Mese
                    </button>
                </div>
            </header>

            <div className="stats-overview">
                <div className="stat-card">
                    <LavorazioniCard period={selectedPeriod} />
                </div>
                <div className="stat-card">
                    <MateriePrimeCard />
                </div>
                <div className="stat-card">
                    <KPICard period={selectedPeriod} />
                </div>
            </div>

            <div className="dashboard-content">
                <div className="main-section">
                    <div className="calendar-section">
                        <div className="calendar-card">
                            <h2>Calendario Lavorazioni</h2>
                            <LavorazioniCalendar period={selectedPeriod} />
                        </div>
                    </div>
                    <TeamSection />
                </div>
                <div className="side-section">
                    <LavorazioniRecenti />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
