export default function KeyTakeaways({ points, nextChapter, relatedChapters }) {
  return (
    <div className="key-takeaways" style={{ marginTop: '2rem' }}>
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          margin: '0 0 1rem 0',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🎯 Key Takeaways
        </h3>
        <ul style={{
          margin: 0,
          paddingLeft: '1.5rem',
          lineHeight: '1.8'
        }}>
          {points.map((point, idx) => (
            <li key={idx}>{point}</li>
          ))}
        </ul>
      </div>

      {(nextChapter || relatedChapters) && (
        <div className="alert alert-info">
          {nextChapter && (
            <div style={{ marginBottom: relatedChapters ? '0.75rem' : 0 }}>
              <strong>📖 Next:</strong> {nextChapter}
            </div>
          )}
          {relatedChapters && (
            <div>
              <strong>🔗 Related:</strong> {relatedChapters}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
