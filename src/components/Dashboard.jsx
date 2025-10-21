import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Dashboard() {
  const [stats, setStats] = useState({
    totalBirds: 0,
    chickens: 0,
    ducks: 0,
    laying: 0,
    todayEggs: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const { data: birds, error: birdsError } = await supabase
        .from('birds')
        .select('*');

      if (birdsError) throw birdsError;

      const today = new Date().toISOString().split('T')[0];
      const { data: eggs, error: eggsError } = await supabase
        .from('egg_records')
        .select('count')
        .eq('date', today);

      if (eggsError) throw eggsError;

      const chickens = birds.filter(b => b.type === 'chicken').length;
      const ducks = birds.filter(b => b.type === 'duck').length;
      const laying = birds.filter(b => b.is_laying).length;
      const todayEggs = eggs.reduce((sum, record) => sum + record.count, 0);

      setStats({
        totalBirds: birds.length,
        chickens,
        ducks,
        laying,
        todayEggs
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Flock Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <StatCard label="Total Birds" value={stats.totalBirds} icon="🐔" />
          <StatCard label="Chickens" value={stats.chickens} icon="🐓" />
          <StatCard label="Ducks" value={stats.ducks} icon="🦆" />
          <StatCard label="Currently Laying" value={stats.laying} icon="✨" />
        </div>
      </div>

      <div className="card">
        <h2 className="card-title">Today's Production</h2>
        <div style={{ fontSize: '3rem', textAlign: 'center', color: '#EAB308' }}>
          🥚 {stats.todayEggs}
        </div>
        <p style={{ textAlign: 'center', color: '#8B4513', fontSize: '1.2rem', marginTop: '8px' }}>
          eggs collected today
        </p>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background: '#FFF8E7',
      padding: '20px',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8B4513' }}>{value}</div>
      <div style={{ color: '#A0522D', marginTop: '4px' }}>{label}</div>
    </div>
  );
}

export default Dashboard;
