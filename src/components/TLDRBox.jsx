export default function TLDRBox({ points }) {
  return (
    <div className="tldr-box" style={{
      background: 'var(--bg-card)',
      border: '2px solid var(--primary)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginBottom: '1.5rem'
    }}>
      <h4 style={{
        margin: '0 0 0.75rem 0',
        color: 'var(--primary)',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        ⚡ TL;DR
      </h4>
      <ul style={{
        margin: 0,
        paddingLeft: '1.5rem',
        lineHeight: '1.7',
        color: 'var(--text-primary)'
      }}>
        {points.map((point, idx) => (
          <li key={idx} style={{ marginBottom: '0.5rem' }}>{point}</li>
        ))}
      </ul>
    </div>
  )
}
