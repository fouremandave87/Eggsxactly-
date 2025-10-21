import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Birds from './components/Birds';
import Tracker from './components/Tracker';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">🥚 Eggsxactly</h1>
        <p className="subtitle">Track all the details of your flock</p>
      </header>

      <nav className="tab-bar">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'birds' ? 'active' : ''}`}
          onClick={() => setActiveTab('birds')}
        >
          Birds
        </button>
        <button
          className={`tab ${activeTab === 'tracker' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracker')}
        >
          Tracker
        </button>
        <button
          className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </nav>

      <main className="content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'birds' && <Birds />}
        {activeTab === 'tracker' && <Tracker />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}

export default App;
