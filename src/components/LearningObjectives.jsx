export default function LearningObjectives({ objectives, time }) {
  return (
    <div className="learning-objectives" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{
        margin: '0 0 1rem 0',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        📚 What You'll Learn
      </h3>
      <ul style={{
        margin: 0,
        paddingLeft: '1.5rem',
        lineHeight: '1.8'
      }}>
        {objectives.map((obj, idx) => (
          <li key={idx}>✓ {obj}</li>
        ))}
      </ul>
      {time && (
        <div style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid rgba(255,255,255,0.3)',
          fontSize: '0.9rem',
          opacity: 0.9
        }}>
          ⏱️ Estimated time: {time}
        </div>
      )}
    </div>
  )
}
