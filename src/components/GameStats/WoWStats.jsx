import React, { useState, useEffect } from 'react';
import { fetchAllWoWData } from '../../services/blizzard.js';

const styles = {
  container: {
    backgroundColor: '#000000',
    borderRadius: '12px',
    padding: '24px',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '600px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
    border: '1px solid #1a1a1a',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    borderBottom: '2px solid #ff8000',
    paddingBottom: '12px',
  },
  logo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#ff8000',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#ffffff',
  },
  mockBadge: {
    backgroundColor: '#4a4a6a',
    color: '#a0a0c0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginLeft: 'auto',
  },
  section: {
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '14px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '12px',
  },
  characterInfo: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  infoCard: {
    backgroundColor: '#0a0a0a',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #1a1a1a',
  },
  infoLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '4px',
  },
  infoValue: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  },
  itemLevel: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#a335ee',
  },
  mplusRating: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  ratingValue: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  dungeonList: {
    listStyle: 'none',
    padding: 0,
    margin: '12px 0 0 0',
  },
  dungeonItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 12px',
    backgroundColor: '#0a0a0a',
    borderRadius: '6px',
    marginBottom: '6px',
    border: '1px solid #1a1a1a',
  },
  dungeonName: {
    flex: 1,
  },
  keyLevel: {
    fontWeight: 'bold',
    marginLeft: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: '#1a1a1a',
  },
  timedBadge: {
    color: '#00ff00',
    marginLeft: '8px',
    fontSize: '12px',
  },
  depletedBadge: {
    color: '#ff4444',
    marginLeft: '8px',
    fontSize: '12px',
  },
  raidProgress: {
    marginTop: '12px',
  },
  raidName: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#ffffff',
  },
  difficultyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 12px',
    backgroundColor: '#0a0a0a',
    borderRadius: '4px',
    marginBottom: '4px',
  },
  difficultyName: {
    color: '#888',
  },
  progressComplete: {
    color: '#00ff00',
  },
  progressIncomplete: {
    color: '#ffaa00',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#888',
  },
  spinner: {
    width: '24px',
    height: '24px',
    border: '3px solid #3a3a5a',
    borderTop: '3px solid #ff8000',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginRight: '12px',
  },
  error: {
    backgroundColor: '#3a2020',
    border: '1px solid #ff4444',
    borderRadius: '8px',
    padding: '16px',
    color: '#ff8888',
    textAlign: 'center',
  },
  errorTitle: {
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  retryButton: {
    backgroundColor: '#ff8000',
    color: '#1a1a2e',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
    marginTop: '12px',
  },
};

// Add keyframes for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('wow-stats-styles')) {
  styleSheet.id = 'wow-stats-styles';
  document.head.appendChild(styleSheet);
}

function WoWStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const wowData = await fetchAllWoWData();
      setData(wowData);
    } catch (err) {
      setError(err.message || 'Failed to load WoW data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getRatingColor = (rating) => {
    if (rating >= 3000) return '#ff8000'; // Orange (Mythic)
    if (rating >= 2500) return '#a335ee'; // Epic Purple
    if (rating >= 2000) return '#0070dd'; // Rare Blue
    if (rating >= 1500) return '#1eff00'; // Uncommon Green
    return '#ffffff'; // Common White
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          Loading WoW character data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          <div style={styles.errorTitle}>Error Loading Data</div>
          <div>{error}</div>
          <button style={styles.retryButton} onClick={loadData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { profile, mythicPlus, raids, isMockData } = data;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>W</div>
        <h2 style={styles.title}>World of Warcraft</h2>
        {isMockData && <span style={styles.mockBadge}>Demo Data</span>}
      </div>

      {/* Character Info */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Character</div>
        <div style={styles.characterInfo}>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Name</div>
            <div style={styles.infoValue}>{profile.name}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Realm</div>
            <div style={styles.infoValue}>{profile.realm}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Class</div>
            <div style={styles.infoValue}>{profile.class}</div>
          </div>
          <div style={styles.infoCard}>
            <div style={styles.infoLabel}>Item Level</div>
            <div style={{ ...styles.infoValue, ...styles.itemLevel }}>
              {profile.itemLevel}
            </div>
          </div>
        </div>
      </div>

      {/* Mythic+ */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Mythic+ Season</div>
        <div style={styles.infoCard}>
          <div style={styles.mplusRating}>
            <span style={styles.infoLabel}>Rating</span>
            <span
              style={{
                ...styles.ratingValue,
                color: getRatingColor(mythicPlus.rating),
              }}
            >
              {mythicPlus.rating.toFixed(0)}
            </span>
          </div>
          <ul style={styles.dungeonList}>
            {mythicPlus.bestRuns.map((run, index) => (
              <li key={index} style={styles.dungeonItem}>
                <span style={styles.dungeonName}>{run.dungeon}</span>
                <span style={styles.keyLevel}>+{run.level}</span>
                {run.completedInTime ? (
                  <span style={styles.timedBadge}>Timed</span>
                ) : (
                  <span style={styles.depletedBadge}>Depleted</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Raid Progress */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Raid Progress - {raids.expansionName}</div>
        <div style={styles.raidProgress}>
          {raids.raids.map((raid, index) => (
            <div key={index} style={styles.infoCard}>
              <div style={styles.raidName}>{raid.name}</div>
              {raid.modes.map((mode, modeIndex) => (
                <div key={modeIndex} style={styles.difficultyRow}>
                  <span style={styles.difficultyName}>{mode.difficulty}</span>
                  <span
                    style={
                      mode.status === 'COMPLETE'
                        ? styles.progressComplete
                        : styles.progressIncomplete
                    }
                  >
                    {mode.progress}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default WoWStats;
