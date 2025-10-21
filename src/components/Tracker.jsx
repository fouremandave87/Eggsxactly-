import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Tracker() {
  const [birds, setBirds] = useState([]);
  const [eggRecords, setEggRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  async function loadData() {
    try {
      const { data: birdsData, error: birdsError } = await supabase
        .from('birds')
        .select('*')
        .order('name');

      if (birdsError) throw birdsError;

      const { data: recordsData, error: recordsError } = await supabase
        .from('egg_records')
        .select('*')
        .eq('date', selectedDate);

      if (recordsError) throw recordsError;

      setBirds(birdsData || []);
      setEggRecords(recordsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateEggCount(birdId, count) {
    try {
      const existing = eggRecords.find(r => r.bird_id === birdId);

      if (existing) {
        if (count === 0) {
          const { error } = await supabase
            .from('egg_records')
            .delete()
            .eq('id', existing.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('egg_records')
            .update({ count })
            .eq('id', existing.id);

          if (error) throw error;
        }
      } else if (count > 0) {
        const { error } = await supabase
          .from('egg_records')
          .insert([{ bird_id: birdId, date: selectedDate, count }]);

        if (error) throw error;
      }

      loadData();
    } catch (error) {
      console.error('Error updating egg count:', error);
      alert('Error updating egg count: ' + error.message);
    }
  }

  function getEggCount(birdId) {
    const record = eggRecords.find(r => r.bird_id === birdId);
    return record ? record.count : 0;
  }

  const totalEggs = eggRecords.reduce((sum, record) => sum + record.count, 0);

  if (loading) {
    return <div className="loading">Loading tracker...</div>;
  }

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Egg Tracker</h2>

        <div className="form-group">
          <label>Select Date</label>
          <input
            type="date"
            className="input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div style={{
          background: '#FFF8E7',
          padding: '20px',
          borderRadius: '8px',
          textAlign: 'center',
          marginTop: '16px'
        }}>
          <div style={{ fontSize: '3rem' }}>🥚</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#8B4513' }}>
            {totalEggs}
          </div>
          <div style={{ color: '#A0522D', fontSize: '1.1rem' }}>
            Total eggs on {new Date(selectedDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#8B4513' }}>Record by Bird</h3>

        {birds.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#8B4513' }}>
            No birds added yet. Go to the Birds tab to add your first bird!
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '12px' }}>
            {birds.map((bird) => {
              const count = getEggCount(bird.id);
              return (
                <div
                  key={bird.id}
                  style={{
                    background: '#FFF8E7',
                    padding: '16px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: '#8B4513' }}>
                      {bird.type === 'chicken' ? '🐓' : '🦆'} {bird.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#A0522D' }}>
                      {bird.species}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      className="button button-secondary"
                      onClick={() => updateEggCount(bird.id, Math.max(0, count - 1))}
                      style={{ padding: '8px 16px', fontSize: '1.2rem' }}
                      disabled={count === 0}
                    >
                      −
                    </button>

                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#8B4513',
                      minWidth: '50px',
                      textAlign: 'center'
                    }}>
                      {count}
                    </div>

                    <button
                      className="button"
                      onClick={() => updateEggCount(bird.id, count + 1)}
                      style={{ padding: '8px 16px', fontSize: '1.2rem' }}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '16px', color: '#8B4513' }}>Quick Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <div style={{ textAlign: 'center', background: '#FFF8E7', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem' }}>🐓</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
              {eggRecords.filter(r => {
                const bird = birds.find(b => b.id === r.bird_id);
                return bird?.type === 'chicken';
              }).reduce((sum, r) => sum + r.count, 0)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#A0522D' }}>Chicken Eggs</div>
          </div>

          <div style={{ textAlign: 'center', background: '#FFF8E7', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem' }}>🦆</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
              {eggRecords.filter(r => {
                const bird = birds.find(b => b.id === r.bird_id);
                return bird?.type === 'duck';
              }).reduce((sum, r) => sum + r.count, 0)}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#A0522D' }}>Duck Eggs</div>
          </div>

          <div style={{ textAlign: 'center', background: '#FFF8E7', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '1.5rem' }}>📊</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8B4513' }}>
              {eggRecords.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#A0522D' }}>Birds Laid Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracker;
