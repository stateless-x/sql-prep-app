export default function RecallBox({ chapter, concept }) {
  return (
    <div className="recall-box" style={{
      background: 'rgba(33, 150, 243, 0.1)',
      border: '1px solid var(--info)',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      borderLeft: '4px solid var(--info)'
    }}>
      <strong style={{ color: 'var(--info)' }}>
        📌 Remember from "{chapter}":
      </strong>
      <p style={{ margin: '0.5rem 0 0 0', color: 'var(--text-primary)' }}>
        {concept}
      </p>
    </div>
  )
}
