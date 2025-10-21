import { useState } from 'react';
import { supabase } from '../lib/supabase';

function Settings() {
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  async function exportData() {
    setExportLoading(true);
    try {
      const { data: birds, error: birdsError } = await supabase
        .from('birds')
        .select('*');

      if (birdsError) throw birdsError;

      const { data: eggRecords, error: recordsError } = await supabase
        .from('egg_records')
        .select('*');

      if (recordsError) throw recordsError;

      const exportData = {
        exported_at: new Date().toISOString(),
        birds: birds || [],
        egg_records: eggRecords || []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `eggsxactly-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data: ' + error.message);
    } finally {
      setExportLoading(false);
    }
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.birds || !data.egg_records) {
        throw new Error('Invalid backup file format');
      }

      if (!confirm(`This will import ${data.birds.length} birds and ${data.egg_records.length} egg records. Continue?`)) {
        setImportLoading(false);
        return;
      }

      for (const bird of data.birds) {
        const { id, created_at, updated_at, ...birdData } = bird;
        await supabase.from('birds').insert([birdData]);
      }

      alert('Data imported successfully!');
      window.location.reload();
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Error importing data: ' + error.message);
    } finally {
      setImportLoading(false);
      event.target.value = '';
    }
  }

  async function clearAllData() {
    if (!confirm('Are you sure you want to delete ALL data? This cannot be undone!')) {
      return;
    }

    if (!confirm('This will permanently delete all birds and egg records. Are you absolutely sure?')) {
      return;
    }

    try {
      const { error: recordsError } = await supabase
        .from('egg_records')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (recordsError) throw recordsError;

      const { error: birdsError } = await supabase
        .from('birds')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (birdsError) throw birdsError;

      alert('All data has been cleared.');
      window.location.reload();
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Error clearing data: ' + error.message);
    }
  }

  return (
    <div>
      <div className="card">
        <h2 className="card-title">Settings</h2>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#8B4513', marginBottom: '12px' }}>Data Management</h3>
          <p style={{ color: '#A0522D', marginBottom: '16px' }}>
            Export your data for backup or import data from a previous backup.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="button"
              onClick={exportData}
              disabled={exportLoading}
            >
              {exportLoading ? 'Exporting...' : '📥 Export Data'}
            </button>

            <label style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                style={{ display: 'none' }}
                disabled={importLoading}
              />
              <button
                className="button button-secondary"
                disabled={importLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.currentTarget.previousElementSibling?.click();
                }}
              >
                {importLoading ? 'Importing...' : '📤 Import Data'}
              </button>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ color: '#8B4513', marginBottom: '12px' }}>About Eggsxactly</h3>
          <p style={{ color: '#A0522D', lineHeight: '1.6' }}>
            Eggsxactly helps you track your poultry flock and egg production.
            Manage your birds, record daily egg collections, and view statistics
            about your flock's productivity.
          </p>
        </div>

        <div style={{ paddingTop: '20px', borderTop: '2px solid #FFF8E7' }}>
          <h3 style={{ color: '#DC2626', marginBottom: '12px' }}>Danger Zone</h3>
          <p style={{ color: '#A0522D', marginBottom: '16px' }}>
            Permanently delete all your data. This action cannot be undone.
          </p>
          <button
            className="button button-danger"
            onClick={clearAllData}
          >
            🗑️ Clear All Data
          </button>
        </div>
      </div>

      <div className="card">
        <h3 style={{ color: '#8B4513', marginBottom: '12px' }}>Quick Tips</h3>
        <ul style={{ color: '#A0522D', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Add your birds in the Birds tab to start tracking</li>
          <li>Use the Tracker tab to record daily egg collection</li>
          <li>The Dashboard shows an overview of your flock</li>
          <li>Export your data regularly for backup</li>
          <li>You can track both chickens and ducks</li>
        </ul>
      </div>
    </div>
  );
}

export default Settings;
