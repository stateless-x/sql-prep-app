import { useState } from 'react'
import Quiz from './Quiz'
import CodeBlock from './CodeBlock'

const quizQuestions = [
  {
    id: 1,
    question: "What's the key difference between GROUP BY and PARTITION BY?",
    options: [
      { id: 'a', text: 'GROUP BY collapses rows, PARTITION BY preserves all rows', correct: true },
      { id: 'b', text: 'They do the same thing', correct: false },
      { id: 'c', text: 'PARTITION BY is faster', correct: false }
    ],
    explanation: "✅ GROUP BY collapses rows into groups (one row per group). PARTITION BY creates groups but KEEPS all original rows!"
  },
  {
    id: 2,
    question: "Write: Top 2 hotels by revenue in each city",
    code: "Which pattern should you use?",
    options: [
      { id: 'a', text: 'GROUP BY city, ORDER BY revenue LIMIT 2', correct: false },
      { id: 'b', text: 'ROW_NUMBER() OVER (PARTITION BY city ORDER BY revenue DESC) then filter rn <= 2', correct: true },
      { id: 'c', text: 'RANK() without PARTITION BY', correct: false }
    ],
    explanation: "✅ Top N per group pattern: Use ROW_NUMBER() OVER (PARTITION BY group_column ORDER BY value DESC), then WHERE rn <= N"
  }
]

export default function WindowFunctions({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('intro')
  const [answers, setAnswers] = useState({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🪟 Window Functions</h1>
        <p className="chapter-subtitle">Your BIGGEST gap - Master this!</p>
      </div>

      <div className="alert alert-warning">
        <strong>⚠️ CRITICAL SECTION</strong><br />
        This is the most important topic. Spend extra time here!
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => setActiveTab('intro')}>
          📚 Intro
        </button>
        <button className={`tab ${activeTab === 'syntax' ? 'active' : ''}`} onClick={() => setActiveTab('syntax')}>
          💻 Syntax
        </button>
        <button className={`tab ${activeTab === 'running' ? 'active' : ''}`} onClick={() => setActiveTab('running')}>
          🏃 Running Total
        </button>
        <button className={`tab ${activeTab === 'rank' ? 'active' : ''}`} onClick={() => setActiveTab('rank')}>
          🏆 Ranking
        </button>
        <button className={`tab ${activeTab === 'topn' ? 'active' : ''}`} onClick={() => setActiveTab('topn')}>
          ⭐ Top N
        </button>
        <button className={`tab ${activeTab === 'lag' ? 'active' : ''}`} onClick={() => setActiveTab('lag')}>
          ⏮️ LAG/LEAD
        </button>
        <button className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
          ✅ Quiz
        </button>
      </div>

      {activeTab === 'intro' && (
        <div className="section">
          <h2 className="section-title">Why Window Functions Exist</h2>
          <p className="section-content">
            <strong>Problem:</strong> GROUP BY collapses rows. Sometimes you want to:
          </p>
          <ul>
            <li>Keep all rows</li>
            <li>Add calculated columns based on groups</li>
          </ul>

          <p className="section-content mt-2">
            <strong>Solution:</strong> Window functions — aggregate WITHOUT collapsing!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <div>
              <h4 style={{ color: 'var(--warning)', marginBottom: '0.75rem', fontSize: '1rem' }}>❌ GROUP BY (collapses)</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>user_id</th>
                      <th>total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>550</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>2 rows (collapsed)</p>
            </div>

            <div>
              <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem', fontSize: '1rem' }}>✅ WINDOW (preserves all rows)</h4>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>user_id</th>
                      <th>amount</th>
                      <th>user_total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>200</td>
                      <td>550</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td>350</td>
                      <td>550</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>800</td>
                      <td>800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>3 rows (all preserved!)</p>
            </div>
          </div>

          <div className="alert alert-info mt-2">
            <strong>Key Insight:</strong> PARTITION BY = GROUP BY without collapsing
          </div>
        </div>
      )}

      {activeTab === 'syntax' && (
        <div className="section">
          <h2 className="section-title">The Syntax</h2>
          <CodeBlock code={`FUNCTION() OVER (
    PARTITION BY [group_column]   -- Restart per group
    ORDER BY [order_column]       -- Order within group
)`} />

          <div className="table-container mt-2">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>GROUP BY</th>
                  <th>PARTITION BY</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Rows</strong></td>
                  <td>Collapses</td>
                  <td>Preserves all</td>
                </tr>
                <tr>
                  <td><strong>Result</strong></td>
                  <td>One row per group</td>
                  <td>All original rows</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'running' && (
        <div className="section">
          <h2 className="section-title">Running Total</h2>
          <CodeBlock code={`SELECT
    user_id,
    booking_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS running_total
FROM bookings;`} />

          <p className="section-content mt-2"><strong>Result:</strong></p>
          <div className="table-container mt-2">
            <table>
              <thead>
                <tr>
                  <th>user_id</th>
                  <th>booking_date</th>
                  <th>amount</th>
                  <th>running_total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Jan 1</td>
                  <td>200</td>
                  <td>200</td>
                </tr>
                <tr style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                  <td>1</td>
                  <td>Jan 5</td>
                  <td>350</td>
                  <td><strong>550</strong> <span style={{ color: 'var(--success)' }}>← 200+350</span></td>
                </tr>
                <tr style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                  <td>1</td>
                  <td>Jan 10</td>
                  <td>100</td>
                  <td><strong>650</strong> <span style={{ color: 'var(--success)' }}>← 550+100</span></td>
                </tr>
                <tr style={{ background: 'rgba(236, 72, 153, 0.1)' }}>
                  <td>2</td>
                  <td>Jan 2</td>
                  <td>800</td>
                  <td><strong>800</strong> <span style={{ color: 'var(--warning)' }}>← RESET</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚠️ Common Mistake:</strong> Forgetting ORDER BY makes it NOT a running total - all rows get the same value!
          </div>
        </div>
      )}

      {activeTab === 'rank' && (
        <div className="section">
          <h2 className="section-title">ROW_NUMBER, RANK, DENSE_RANK</h2>

          <div className="code-block">
            <pre><code>{`Data: amount = 500, 500, 300, 200

ROW_NUMBER(): 1, 2, 3, 4     ← Always unique
RANK():       1, 1, 3, 4     ← Ties same, SKIP next
DENSE_RANK(): 1, 1, 2, 3     ← Ties same, NO skip`}</code></pre>
          </div>

          <div className="mt-2">
            <h3 className="mb-1">When to use:</h3>
            <div className="card">
              <strong>ROW_NUMBER()</strong> — Need unique numbers (Top N, dedup)
            </div>
            <div className="card">
              <strong>RANK()</strong> — Rankings where gaps matter (Olympic medals)
            </div>
            <div className="card">
              <strong>DENSE_RANK()</strong> — Rankings without gaps (leaderboards)
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topn' && (
        <div className="section">
          <h2 className="section-title">⭐⭐⭐ Top N Per Group</h2>
          <div className="alert alert-warning">
            <strong>THE most common window function interview question!</strong>
          </div>

          <p className="section-content mt-2"><strong>Pattern: Top 3 spenders per country</strong></p>
          <div className="code-block">
            <pre><code>{`WITH ranked AS (
    SELECT
        u.user_id,
        u.country,
        SUM(b.amount) AS total_spent,
        ROW_NUMBER() OVER (
            PARTITION BY u.country
            ORDER BY SUM(b.amount) DESC
        ) AS rn
    FROM users u
    JOIN bookings b ON u.user_id = b.user_id
    GROUP BY u.user_id, u.country
)
SELECT user_id, country, total_spent
FROM ranked
WHERE rn <= 3;`}</code></pre>
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Remember:</strong> Always use CTE (WITH) + ROW_NUMBER() + WHERE rn &lt;= N
          </div>
        </div>
      )}

      {activeTab === 'lag' && (
        <div className="section">
          <h2 className="section-title">LAG and LEAD</h2>

          <div className="code-block">
            <pre><code>{`LAG(column, n)   -- Value from n rows BEFORE (default n=1)
LEAD(column, n)  -- Value from n rows AFTER`}</code></pre>
          </div>

          <p className="section-content mt-2"><strong>Example: Compare to previous booking</strong></p>
          <div className="code-block">
            <pre><code>{`SELECT
    user_id,
    booking_date,
    amount,
    LAG(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS prev_amount,
    amount - LAG(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS change
FROM bookings;`}</code></pre>
          </div>

          <div className="table-container mt-2">
            <table>
              <thead>
                <tr>
                  <th>user_id</th>
                  <th>booking_date</th>
                  <th>amount</th>
                  <th>prev_amount</th>
                  <th>change</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Jan 1</td>
                  <td>200</td>
                  <td><em style={{ color: 'var(--text-muted)' }}>NULL</em></td>
                  <td><em style={{ color: 'var(--text-muted)' }}>NULL</em></td>
                </tr>
                <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                  <td>1</td>
                  <td>Jan 5</td>
                  <td>350</td>
                  <td>200</td>
                  <td><strong style={{ color: 'var(--success)' }}>+150</strong></td>
                </tr>
                <tr style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                  <td>1</td>
                  <td>Jan 10</td>
                  <td>100</td>
                  <td>350</td>
                  <td><strong style={{ color: 'var(--danger)' }}>-250</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'quiz' && (
        <div>
          <div className="section">
            <h2 className="section-title">Test Your Knowledge</h2>
            {quizQuestions.map((q) => (
              <Quiz
                key={q.id}
                question={q.question}
                code={q.code}
                options={q.options}
                explanation={q.explanation}
                onAnswer={(answer) => setAnswers({ ...answers, [q.id]: answer })}
                showAnswer={showQuizResults}
              />
            ))}

            {!showQuizResults ? (
              <button
                className="quiz-btn"
                onClick={() => setShowQuizResults(true)}
                disabled={Object.keys(answers).length !== quizQuestions.length}
              >
                Check Answers
              </button>
            ) : (
              <div className="alert alert-success mt-2">
                <strong>Score: {Object.values(answers).filter(a => a.correct).length} / {quizQuestions.length}</strong>
              </div>
            )}
          </div>
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
