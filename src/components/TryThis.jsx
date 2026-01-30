import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function TryThis({ challenge, hint, solution, explanation }) {
  const [showHint, setShowHint] = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  return (
    <div className="try-this-box" style={{
      background: 'var(--bg-card)',
      border: '2px dashed var(--warning)',
      borderRadius: '12px',
      padding: '1.5rem',
      margin: '1.5rem 0'
    }}>
      <h4 style={{
        margin: '0 0 1rem 0',
        color: 'var(--warning)',
        fontSize: '1.1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🧪 Try This Before Scrolling!
      </h4>

      <p className="challenge" style={{
        background: 'rgba(245, 158, 11, 0.1)',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '1rem',
        fontWeight: 500
      }}>
        {challenge}
      </p>

      {hint && !showHint && (
        <button
          className="quiz-btn"
          onClick={() => setShowHint(true)}
          style={{
            background: 'var(--warning)',
            marginBottom: '1rem'
          }}
        >
          💡 Need a hint?
        </button>
      )}

      {showHint && hint && (
        <div className="hint" style={{
          background: 'rgba(245, 158, 11, 0.15)',
          padding: '1rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          borderLeft: '4px solid var(--warning)'
        }}>
          <strong>💡 Hint:</strong> {hint}
        </div>
      )}

      <details
        className="solution"
        onToggle={(e) => setShowSolution(e.target.open)}
        style={{
          cursor: 'pointer'
        }}
      >
        <summary style={{
          padding: '0.75rem 1rem',
          background: showSolution ? 'var(--success)' : 'var(--border)',
          borderRadius: '8px',
          fontWeight: 600,
          color: showSolution ? 'white' : 'var(--text-primary)',
          listStyle: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s'
        }}>
          {showSolution ? '✓' : '→'} Show Solution
        </summary>

        <div style={{ marginTop: '1rem' }}>
          <CodeBlock code={solution} />
          {explanation && (
            <p style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '8px',
              borderLeft: '4px solid var(--success)'
            }}>
              {explanation}
            </p>
          )}
        </div>
      </details>
    </div>
  )
}
