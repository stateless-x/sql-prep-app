import { useState } from 'react'
import Quiz from './Quiz'

const quizQuestion = {
  id: 1,
  question: "What's wrong with this query?",
  code: `SELECT user_id, email, SUM(amount)
FROM bookings b
JOIN users u ON b.user_id = u.user_id
GROUP BY b.user_id;`,
  options: [
    { id: 'a', text: 'email is not in GROUP BY or aggregate', correct: true },
    { id: 'b', text: 'Missing WHERE clause', correct: false },
    { id: 'c', text: 'Nothing wrong', correct: false }
  ],
  explanation: "✅ The Golden Rule: Everything in SELECT must be in GROUP BY OR inside an aggregate function. Fix: GROUP BY b.user_id, u.email"
}

export default function GroupBy({ onComplete, isCompleted }) {
  const [answer, setAnswer] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📊 GROUP BY & Aggregates</h1>
        <p className="chapter-subtitle">Collapse rows into groups</p>
      </div>

      <div className="section">
        <h2 className="section-title">What GROUP BY Does</h2>
        <p className="section-content">
          Collapses rows into groups, then applies aggregate functions.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1rem' }}>BEFORE:</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>user_id</th>
                    <th>amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>200</td>
                  </tr>
                  <tr>
                    <td>1</td>
                    <td>350</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>800</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>3 rows</p>
          </div>

          <div>
            <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', fontSize: '1rem' }}>AFTER GROUP BY user_id:</h4>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>user_id</th>
                    <th>total_spent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td><strong>550</strong></td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td><strong>800</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>2 rows (collapsed)</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">⚠️ The Golden Rule</h2>
        <div className="alert alert-warning">
          <strong>Everything in SELECT must be:</strong><br />
          1. In GROUP BY, OR<br />
          2. Inside an aggregate function
        </div>

        <div className="code-block mt-2">
          <pre><code>{`-- ❌ WRONG: email not in GROUP BY or aggregate
SELECT user_id, email, SUM(amount)
FROM bookings
GROUP BY user_id;

-- ✅ RIGHT
SELECT user_id, SUM(amount)
FROM bookings
GROUP BY user_id;`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Aggregate Functions</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Function</th>
                <th>What it does</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="inline-code">COUNT(*)</code></td>
                <td>Count all rows</td>
              </tr>
              <tr>
                <td><code className="inline-code">COUNT(col)</code></td>
                <td>Count non-NULL values</td>
              </tr>
              <tr>
                <td><code className="inline-code">SUM(col)</code></td>
                <td>Total</td>
              </tr>
              <tr>
                <td><code className="inline-code">AVG(col)</code></td>
                <td>Average</td>
              </tr>
              <tr>
                <td><code className="inline-code">MAX(col)</code></td>
                <td>Largest</td>
              </tr>
              <tr>
                <td><code className="inline-code">MIN(col)</code></td>
                <td>Smallest</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Conditional Aggregation</h2>
        <div className="code-block">
          <pre><code>{`-- Count only completed bookings
SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed

-- Calculate conversion rate
ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) AS conv_rate`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">✅ Quiz Time</h2>
        <Quiz
          question={quizQuestion.question}
          code={quizQuestion.code}
          options={quizQuestion.options}
          explanation={quizQuestion.explanation}
          onAnswer={(a) => setAnswer(a)}
          showAnswer={showAnswer}
        />
        {!showAnswer && (
          <button className="quiz-btn" onClick={() => setShowAnswer(true)} disabled={!answer}>
            Check Answer
          </button>
        )}
      </div>

      <button
        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
        onClick={onComplete}
      >
        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
      </button>
    </div>
  )
}
