import { useState } from 'react'
import Quiz from './Quiz'

const quizQuestion = {
  id: 1,
  question: "Write: Find hotels that have never been booked",
  options: [
    { id: 'a', text: 'SELECT * FROM hotels WHERE booking_id IS NULL', correct: false },
    { id: 'b', text: 'SELECT h.* FROM hotels h LEFT JOIN bookings b ON h.hotel_id = b.hotel_id WHERE b.booking_id IS NULL', correct: true },
    { id: 'c', text: 'SELECT * FROM hotels INNER JOIN bookings ON hotel_id = hotel_id', correct: false }
  ],
  explanation: "✅ LEFT JOIN keeps all hotels. WHERE b.booking_id IS NULL filters to hotels with no matching bookings."
}

export default function Joins({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('intro')
  const [answer, setAnswer] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🔗 JOINs</h1>
        <p className="chapter-subtitle">Connect tables together</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => setActiveTab('intro')}>
          📚 Types
        </button>
        <button className={`tab ${activeTab === 'pattern' ? 'active' : ''}`} onClick={() => setActiveTab('pattern')}>
          ⭐ Find Missing
        </button>
        <button className={`tab ${activeTab === 'mistakes' ? 'active' : ''}`} onClick={() => setActiveTab('mistakes')}>
          ⚠️ Mistakes
        </button>
        <button className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
          ✅ Quiz
        </button>
      </div>

      {activeTab === 'intro' && (
        <div>
          <div className="section">
            <h2 className="section-title">INNER JOIN — Only matches</h2>
            <div className="code-block">
              <pre><code>{`SELECT u.email, b.amount
FROM users u
INNER JOIN bookings b ON u.user_id = b.user_id;`}</code></pre>
            </div>
            <p className="section-content mt-1">
              ✅ Result: Only users who HAVE bookings appear.
            </p>
          </div>

          <div className="section">
            <h2 className="section-title">LEFT JOIN — All left + matches</h2>
            <div className="code-block">
              <pre><code>{`SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id;`}</code></pre>
            </div>
            <p className="section-content mt-1">
              ✅ Result: ALL users appear. No bookings = NULL.
            </p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>email</th>
                    <th>amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>a@mail</td>
                    <td>200</td>
                  </tr>
                  <tr>
                    <td>a@mail</td>
                    <td>350</td>
                  </tr>
                  <tr>
                    <td>b@mail</td>
                    <td>800</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td>c@mail</td>
                    <td><em style={{ color: 'var(--text-muted)' }}>NULL</em> <span style={{ color: 'var(--warning)' }}>← No bookings</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Visual Summary</h2>
            <div className="card">
              <strong>INNER JOIN:</strong> Only matching rows
            </div>
            <div className="card">
              <strong>LEFT JOIN:</strong> All left + matching (NULL if no match)
            </div>
            <div className="card">
              <strong>RIGHT JOIN:</strong> All right + matching (rarely used)
            </div>
            <div className="card">
              <strong>FULL JOIN:</strong> Everything from both sides
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pattern' && (
        <div className="section">
          <h2 className="section-title">⭐ The "Find Missing" Pattern</h2>
          <div className="alert alert-info">
            <strong>Interview favorite!</strong> "Find X that never Y"
          </div>

          <p className="section-content mt-2">
            <strong>Example: Find users who never booked</strong>
          </p>
          <div className="code-block">
            <pre><code>{`SELECT u.user_id, u.email
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
WHERE b.booking_id IS NULL;    -- No match found`}</code></pre>
          </div>

          <p className="section-content mt-2"><strong>Other examples:</strong></p>
          <div className="code-block">
            <pre><code>{`-- Hotels with no bookings
SELECT h.* FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE b.booking_id IS NULL;

-- Users who searched but never converted
SELECT DISTINCT s.user_id FROM searches s
LEFT JOIN bookings b ON s.user_id = b.user_id
WHERE b.booking_id IS NULL;`}</code></pre>
          </div>
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="section">
          <h2 className="section-title">⚠️ Common JOIN Mistake</h2>
          <p className="section-content"><strong>LEFT JOIN then filtering away NULLs</strong></p>

          <div className="code-block mt-2">
            <pre><code>{`-- ❌ WRONG: Removes users with no completed bookings!
SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed';   -- Filters out NULLs!

-- ✅ RIGHT: Put condition in JOIN
SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
                    AND b.status = 'completed';`}</code></pre>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>💡 Rule:</strong> If you want to keep NULLs, put the condition in the JOIN, not WHERE.
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div className="section">
          <h2 className="section-title">✅ Quiz Time</h2>
          <Quiz
            question={quizQuestion.question}
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
      )}

      <button
        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
        onClick={onComplete}
      >
        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
      </button>
    </div>
  )
}
