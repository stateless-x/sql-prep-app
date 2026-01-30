import { useState } from 'react'
import Quiz from './Quiz'

const quizQuestion = {
  id: 1,
  question: "What's wrong with this query?",
  code: `SELECT hotel_id, COUNT(*)
FROM bookings
WHERE COUNT(*) > 100
GROUP BY hotel_id;`,
  options: [
    { id: 'a', text: "Can't use COUNT(*) in WHERE. Move to HAVING", correct: true },
    { id: 'b', text: 'Missing ORDER BY', correct: false },
    { id: 'c', text: 'Nothing wrong', correct: false }
  ],
  explanation: "✅ WHERE runs BEFORE grouping, so it can't use aggregates. Use HAVING which runs AFTER grouping."
}

export default function WhereHaving({ onComplete, isCompleted }) {
  const [answer, setAnswer] = useState(null)
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">⚖️ WHERE vs HAVING</h1>
        <p className="chapter-subtitle">This was your weak spot!</p>
      </div>

      <div className="alert alert-warning">
        <strong>⚠️ CRITICAL:</strong> This is where many people fail. Master this!
      </div>

      <div className="section">
        <h2 className="section-title">The Rule (Memorize This)</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Clause</th>
                <th>When It Runs</th>
                <th>Can Use Aggregates?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>WHERE</strong></td>
                <td>BEFORE grouping</td>
                <td className="text-danger">❌ NO</td>
              </tr>
              <tr>
                <td><strong>HAVING</strong></td>
                <td>AFTER grouping</td>
                <td className="text-success">✅ YES</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="code-block mt-2">
          <pre><code>{`rows → [WHERE filters rows] → [GROUP BY collapses] → [HAVING filters groups] → result`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Example</h2>
        <p className="section-content">
          <strong>"Users who spent over $5000, but only count completed bookings"</strong>
        </p>

        <div className="code-block mt-2">
          <pre><code>{`SELECT user_id, SUM(amount) AS total_spent
FROM bookings
WHERE status = 'completed'    -- Row filter (before grouping)
GROUP BY user_id
HAVING SUM(amount) > 5000;    -- Group filter (after grouping)`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Common Mistakes</h2>
        <div className="code-block">
          <pre><code>{`-- ❌ WRONG: Aggregate in WHERE
SELECT user_id, SUM(amount)
FROM bookings
WHERE SUM(amount) > 5000      -- ERROR!
GROUP BY user_id;

-- ❌ WRONG: Row filter in HAVING
SELECT user_id, SUM(amount)
FROM bookings
GROUP BY user_id
HAVING status = 'completed';  -- Should be WHERE

-- ✅ RIGHT
SELECT user_id, SUM(amount)
FROM bookings
WHERE status = 'completed'    -- Rows
GROUP BY user_id
HAVING SUM(amount) > 5000;    -- Groups`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Decision Tree</h2>
        <div className="code-block">
          <pre><code>{`Is the condition about...

├── Individual rows (before grouping)?
│   └── Use WHERE
│   └── Examples: status = 'completed', amount > 100
│
└── Aggregated results (after grouping)?
    └── Use HAVING
    └── Examples: SUM(amount) > 1000, COUNT(*) >= 5`}</code></pre>
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
