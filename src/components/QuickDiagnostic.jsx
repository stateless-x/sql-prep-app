import { useState } from 'react'
import Quiz from './Quiz'

const questions = [
  {
    id: 1,
    question: "What does this return?",
    code: `SELECT user_id, SUM(amount)
FROM bookings
WHERE SUM(amount) > 10000
GROUP BY user_id;`,
    options: [
      { id: 'a', text: 'Users who spent over 10k total', correct: false },
      { id: 'b', text: 'Error', correct: true },
      { id: 'c', text: 'All users with their total spend', correct: false }
    ],
    explanation: "❌ Can't use aggregate functions in WHERE clause! Aggregates run AFTER grouping, but WHERE runs BEFORE. Use HAVING instead.",
    studyLink: "where-having"
  },
  {
    id: 2,
    question: "What's different between these?",
    code: `-- Query A
SUM(amount) OVER (PARTITION BY user_id ORDER BY booking_date)

-- Query B
SUM(amount) OVER (PARTITION BY user_id)`,
    options: [
      { id: 'a', text: 'Query A creates a running total, Query B gives same total for all rows', correct: true },
      { id: 'b', text: 'They both do the same thing', correct: false },
      { id: 'c', text: 'Query A is faster', correct: false }
    ],
    explanation: "✅ Query A creates a RUNNING TOTAL (accumulates) because of ORDER BY. Query B gives the SAME total value for all rows in the partition.",
    studyLink: "window"
  },
  {
    id: 3,
    question: "Why might this LEFT JOIN return fewer rows than expected?",
    code: `SELECT u.name, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed';`,
    options: [
      { id: 'a', text: 'The WHERE clause filters out users with no bookings', correct: true },
      { id: 'b', text: 'LEFT JOIN is broken', correct: false },
      { id: 'c', text: 'Missing GROUP BY', correct: false }
    ],
    explanation: "⚠️ The WHERE clause filters out NULL values! Users with no bookings have NULL for b.status, so they're removed. Move the condition to the JOIN: LEFT JOIN bookings b ON u.user_id = b.user_id AND b.status = 'completed'",
    studyLink: "joins"
  }
]

export default function QuickDiagnostic({ onComplete, isCompleted }) {
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)

  const score = Object.values(answers).filter(a => a.correct).length
  const allAnswered = Object.keys(answers).length === questions.length

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎯 Quick Diagnostic</h1>
        <p className="chapter-subtitle">Find your gaps in 5 minutes</p>
      </div>

      <div className="alert alert-info">
        <strong>⏱️ Time: 5 minutes</strong><br />
        Answer these questions WITHOUT looking anything up. This helps identify what you need to study!
      </div>

      <div className="quiz-container">
        {questions.map((q) => (
          <Quiz
            key={q.id}
            question={q.question}
            code={q.code}
            options={q.options}
            explanation={q.explanation}
            onAnswer={(answer) => setAnswers({ ...answers, [q.id]: answer })}
            showAnswer={showResults}
          />
        ))}
      </div>

      {!showResults ? (
        <button
          className="quiz-btn"
          onClick={() => setShowResults(true)}
          disabled={!allAnswered}
        >
          {allAnswered ? 'Check Answers' : `Answer all questions (${Object.keys(answers).length}/${questions.length})`}
        </button>
      ) : (
        <div className="section">
          <h2 className="section-title">📊 Your Results</h2>
          <div className="alert alert-success">
            <strong>Score: {score} / {questions.length}</strong>
          </div>

          {score === 3 && (
            <p className="text-success mt-2">🎉 Perfect! You're in good shape. Still review the weak areas to be safe!</p>
          )}
          {score === 2 && (
            <p className="text-warning mt-2">👍 Not bad! Focus extra time on the topics you missed.</p>
          )}
          {score < 2 && (
            <p className="text-danger mt-2">⚠️ You have some gaps. Don't worry - that's why we're here! Study the recommended sections carefully.</p>
          )}

          <div className="mt-3">
            <h3 className="mb-2">What to study:</h3>
            {!answers[1]?.correct && <p>❌ Study: <span className="text-primary">WHERE vs HAVING</span></p>}
            {!answers[2]?.correct && <p>❌ Study: <span className="text-primary">Window Functions</span></p>}
            {!answers[3]?.correct && <p>❌ Study: <span className="text-primary">JOINs</span></p>}
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
