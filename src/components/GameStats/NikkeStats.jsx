import React from 'react';
import { config } from '../../config.js';

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
    borderBottom: '2px solid #ff4d6d',
    paddingBottom: '12px',
  },
  logo: {
    width: '40px',
    height: '40px',
    backgroundColor: '#ff4d6d',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a1a2e',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '600',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '12px',
    color: '#888',
    marginTop: '2px',
  },
  staticBadge: {
    backgroundColor: '#3a3a5a',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  statCard: {
    backgroundColor: '#0a0a0a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #1a1a1a',
    textAlign: 'center',
  },
  statCardHighlight: {
    backgroundColor: '#0a0a0a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #ff4d6d',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: '8px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statValuePink: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ff4d6d',
  },
  statValueGold: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#ffd700',
  },
  squadSection: {
    backgroundColor: '#0a0a0a',
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid #1a1a1a',
  },
  squadTitle: {
    fontSize: '14px',
    color: '#888',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  squadHeart: {
    color: '#ff4d6d',
    fontSize: '16px',
  },
  squadList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  squadMember: {
    backgroundColor: '#1a1a1a',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    border: '1px solid #2a2a2a',
    transition: 'all 0.2s ease',
  },
  rankCard: {
    backgroundColor: '#0a0a0a',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #1a1a1a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  rankIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ffd700, #ff8c00)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a1a2e',
    boxShadow: '0 2px 10px rgba(255, 215, 0, 0.4)',
  },
  rankDetails: {},
  rankLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '4px',
  },
  rankValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#ffd700',
  },
  progressSection: {
    marginTop: '12px',
  },
  progressLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '6px',
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressBar: {
    height: '8px',
    backgroundColor: '#1a1a1a',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #ff4d6d, #ff8c94)',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#666',
  },
};

// Helper to get rank icon
function getRankIcon(rank) {
  const rankIcons = {
    'Champion': 'C',
    'Grand Master': 'GM',
    'Master': 'M',
    'Diamond': 'D',
    'Platinum': 'P',
    'Gold': 'G',
    'Silver': 'S',
    'Bronze': 'B',
  };
  return rankIcons[rank] || rank.charAt(0);
}

// Helper to get rank color
function getRankStyle(rank) {
  const rankColors = {
    'Champion': { background: 'linear-gradient(135deg, #ffd700, #ff8c00)', color: '#1a1a2e' },
    'Grand Master': { background: 'linear-gradient(135deg, #ff4d6d, #ff8c94)', color: '#1a1a2e' },
    'Master': { background: 'linear-gradient(135deg, #a335ee, #c77dff)', color: '#ffffff' },
    'Diamond': { background: 'linear-gradient(135deg, #00d4ff, #0099cc)', color: '#1a1a2e' },
    'Platinum': { background: 'linear-gradient(135deg, #e5e4e2, #a8a8a8)', color: '#1a1a2e' },
    'Gold': { background: 'linear-gradient(135deg, #ffd700, #daa520)', color: '#1a1a2e' },
    'Silver': { background: 'linear-gradient(135deg, #c0c0c0, #808080)', color: '#1a1a2e' },
    'Bronze': { background: 'linear-gradient(135deg, #cd7f32, #8b4513)', color: '#ffffff' },
  };
  return rankColors[rank] || { background: '#3a3a5a', color: '#ffffff' };
}

function NikkeStats() {
  const nikke = config.nikke;

  // Handle case where nikke config is missing
  if (!nikke) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>NK</div>
          <h2 style={styles.title}>NIKKE</h2>
        </div>
        <div style={styles.emptyState}>
          No NIKKE data configured. Update config.js to add your stats.
        </div>
      </div>
    );
  }

  const {
    commanderLevel = 0,
    totalNikkes = 0,
    sssNikkes = 0,
    favoriteSquad = [],
    pvpRank = 'Unranked',
  } = nikke;

  // Calculate collection percentage (SSS out of total)
  const sssPercentage = totalNikkes > 0 ? Math.round((sssNikkes / totalNikkes) * 100) : 0;

  const rankStyle = getRankStyle(pvpRank);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>NK</div>
        <div>
          <h2 style={styles.title}>NIKKE</h2>
          <div style={styles.subtitle}>Goddess of Victory</div>
        </div>
        <span style={styles.staticBadge}>Manual Data</span>
      </div>

      {/* Commander Stats */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Commander Profile</div>
        <div style={styles.statsGrid}>
          <div style={styles.statCardHighlight}>
            <div style={styles.statLabel}>Commander Level</div>
            <div style={styles.statValuePink}>{commanderLevel}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total NIKKEs</div>
            <div style={styles.statValue}>{totalNikkes}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>SSS NIKKEs</div>
            <div style={styles.statValueGold}>{sssNikkes}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>SSS Rate</div>
            <div style={styles.statValue}>{sssPercentage}%</div>
          </div>
        </div>

        {/* SSS Progress Bar */}
        <div style={styles.progressSection}>
          <div style={styles.progressLabel}>
            <span>SSS Collection Progress</span>
            <span>{sssNikkes} / {totalNikkes}</span>
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${sssPercentage}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* PvP Rank */}
      <div style={styles.section}>
        <div style={styles.sectionTitle}>Arena Ranking</div>
        <div style={styles.rankCard}>
          <div style={styles.rankInfo}>
            <div
              style={{
                ...styles.rankIcon,
                background: rankStyle.background,
                color: rankStyle.color,
              }}
            >
              {getRankIcon(pvpRank)}
            </div>
            <div style={styles.rankDetails}>
              <div style={styles.rankLabel}>Current Rank</div>
              <div style={{ ...styles.rankValue, color: pvpRank === 'Champion' ? '#ffd700' : '#ff4d6d' }}>
                {pvpRank}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Squad */}
      {favoriteSquad.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Favorite Squad</div>
          <div style={styles.squadSection}>
            <div style={styles.squadTitle}>
              <span style={styles.squadHeart}>&#9829;</span>
              Main Team
            </div>
            <div style={styles.squadList}>
              {favoriteSquad.map((nikke, index) => (
                <span key={index} style={styles.squadMember}>
                  {nikke}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NikkeStats;
