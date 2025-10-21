import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Birds() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBird, setEditingBird] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    type: 'chicken',
    is_laying: true,
    date_acquired: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadBirds();
  }, []);

  async function loadBirds() {
    try {
      const { data, error } = await supabase
        .from('birds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBirds(data || []);
    } catch (error) {
      console.error('Error loading birds:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingBird) {
        const { error } = await supabase
          .from('birds')
          .update({ ...formData, updated_at: new Date().toISOString() })
          .eq('id', editingBird.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('birds')
          .insert([formData]);

        if (error) throw error;
      }

      resetForm();
      loadBirds();
    } catch (error) {
      console.error('Error saving bird:', error);
      alert('Error saving bird: ' + error.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this bird? All egg records will also be deleted.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('birds')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadBirds();
    } catch (error) {
      console.error('Error deleting bird:', error);
      alert('Error deleting bird: ' + error.message);
    }
  }

  function handleEdit(bird) {
    setEditingBird(bird);
    setFormData({
      name: bird.name,
      species: bird.species,
      type: bird.type,
      is_laying: bird.is_laying,
      date_acquired: bird.date_acquired
    });
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      name: '',
      species: '',
      type: 'chicken',
      is_laying: true,
      date_acquired: new Date().toISOString().split('T')[0]
    });
    setEditingBird(null);
    setShowForm(false);
  }

  if (loading) {
    return <div className="loading">Loading birds...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="card-title" style={{ marginBottom: 0 }}>Your Birds</h2>
        <button
          className="button"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Bird'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 style={{ marginBottom: '16px', color: '#8B4513' }}>
            {editingBird ? 'Edit Bird' : 'Add New Bird'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Species/Breed</label>
              <input
                type="text"
                className="input"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                placeholder="e.g., Rhode Island Red, Pekin Duck"
                required
              />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                className="select"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="chicken">Chicken</option>
                <option value="duck">Duck</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date Acquired</label>
              <input
                type="date"
                className="input"
                value={formData.date_acquired}
                onChange={(e) => setFormData({ ...formData, date_acquired: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={formData.is_laying}
                  onChange={(e) => setFormData({ ...formData, is_laying: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                Currently Laying
              </label>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="button">
                {editingBird ? 'Update Bird' : 'Add Bird'}
              </button>
              <button type="button" className="button button-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: 'grid', gap: '16px' }}>
        {birds.length === 0 ? (
          <div className="card">
            <p style={{ textAlign: 'center', color: '#8B4513' }}>
              No birds yet. Add your first bird to get started!
            </p>
          </div>
        ) : (
          birds.map((bird) => (
            <div key={bird.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#8B4513', fontSize: '1.3rem', marginBottom: '8px' }}>
                    {bird.type === 'chicken' ? '🐓' : '🦆'} {bird.name}
                  </h3>
                  <p style={{ color: '#A0522D', marginBottom: '4px' }}>
                    <strong>Species:</strong> {bird.species}
                  </p>
                  <p style={{ color: '#A0522D', marginBottom: '4px' }}>
                    <strong>Type:</strong> {bird.type}
                  </p>
                  <p style={{ color: '#A0522D', marginBottom: '4px' }}>
                    <strong>Status:</strong> {bird.is_laying ? '✨ Laying' : '💤 Not Laying'}
                  </p>
                  <p style={{ color: '#A0522D', fontSize: '0.9rem' }}>
                    Acquired: {new Date(bird.date_acquired).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="button button-secondary"
                    onClick={() => handleEdit(bird)}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    Edit
                  </button>
                  <button
                    className="button button-danger"
                    onClick={() => handleDelete(bird.id)}
                    style={{ padding: '8px 16px', fontSize: '0.9rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Birds;
