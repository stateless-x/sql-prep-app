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
  },
  {
    id: 4,
    question: "What does the WITH clause (CTE) do in this query?",
    code: `WITH high_spenders AS (
  SELECT user_id, SUM(amount) as total
  FROM bookings
  GROUP BY user_id
  HAVING SUM(amount) > 5000
)
SELECT u.name, hs.total
FROM users u
JOIN high_spenders hs ON u.user_id = hs.user_id;`,
    options: [
      { id: 'a', text: 'Creates a temporary named result set that can be referenced later', correct: true },
      { id: 'b', text: 'Makes the query run faster', correct: false },
      { id: 'c', text: 'It\'s the same as a subquery - just syntax sugar', correct: false }
    ],
    explanation: "✅ CTEs (Common Table Expressions) create temporary named result sets. They make complex queries readable by breaking them into logical steps. Critical for Agoda - 80% of their interviews use CTEs!",
    studyLink: "ctes"
  },
  {
    id: 5,
    question: "What's the output of this subquery in WHERE?",
    code: `SELECT name, amount
FROM bookings
WHERE amount > (
  SELECT AVG(amount)
  FROM bookings
);`,
    options: [
      { id: 'a', text: 'All bookings with amount above the average', correct: true },
      { id: 'b', text: 'Error - can\'t use subquery in WHERE', correct: false },
      { id: 'c', text: 'Only the highest booking', correct: false }
    ],
    explanation: "✅ Subqueries in WHERE are used for filtering. This finds all bookings above average. The subquery runs ONCE and returns a single value (scalar), then each row is compared to it.",
    studyLink: "joins"
  },
  {
    id: 6,
    question: "When should you use a CTE instead of a subquery?",
    code: `-- Option A: Subquery (used multiple times)
SELECT *
FROM (SELECT user_id, COUNT(*) as cnt FROM bookings GROUP BY user_id) b1
JOIN (SELECT user_id, COUNT(*) as cnt FROM bookings GROUP BY user_id) b2
ON b1.user_id = b2.user_id

-- Option B: CTE
WITH booking_counts AS (
  SELECT user_id, COUNT(*) as cnt FROM bookings GROUP BY user_id
)
SELECT * FROM booking_counts b1 JOIN booking_counts b2 ON b1.user_id = b2.user_id`,
    options: [
      { id: 'a', text: 'Use CTEs when you reference the same logic multiple times', correct: true },
      { id: 'b', text: 'Always use CTEs - they\'re always faster', correct: false },
      { id: 'c', text: 'They\'re identical - doesn\'t matter', correct: false }
    ],
    explanation: "✅ CTEs are better when: 1) Reusing logic multiple times (DRY), 2) Need readability for multi-step queries, 3) Building cascading logic. Subqueries are fine for one-time simple filters in WHERE.",
    studyLink: "ctes"
  },
  {
    id: 7,
    question: "Why does this query need a CTE?",
    code: `-- This will ERROR:
SELECT city, hotel_name, revenue, city_rank
FROM (
  SELECT city, name as hotel_name, SUM(amount) as revenue,
    ROW_NUMBER() OVER (PARTITION BY city ORDER BY SUM(amount) DESC) as city_rank
  FROM hotels h JOIN bookings b ON h.hotel_id = b.hotel_id
  GROUP BY city, name
)
WHERE city_rank <= 3;

-- Need CTE to filter window function results:
WITH ranked AS (...)
SELECT * FROM ranked WHERE city_rank <= 3;`,
    options: [
      { id: 'a', text: 'You can\'t filter window functions directly - need CTE to filter their results', correct: true },
      { id: 'b', text: 'CTEs make it faster', correct: false },
      { id: 'c', text: 'Subqueries don\'t support window functions', correct: false }
    ],
    explanation: "🚨 CRITICAL PATTERN! Window functions are computed AFTER WHERE. You MUST use a CTE (or subquery in FROM) to filter window function results. This pattern appears in 60% of Agoda interviews!",
    studyLink: "window"
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
        <strong>⏱️ Time: 7-10 minutes</strong><br />
        Answer these questions WITHOUT looking anything up. This helps identify what you need to study!<br />
        <strong>Focus: CTEs, Subqueries, Window Functions - Agoda's most tested topics!</strong>
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

          {score === 7 && (
            <p className="text-success mt-2">🎉 Perfect score! You're in excellent shape. But still review CTEs carefully - they're in 80% of Agoda interviews!</p>
          )}
          {score >= 5 && score < 7 && (
            <p className="text-success mt-2">👍 Good foundation! Focus extra time on the topics you missed, especially CTEs.</p>
          )}
          {score >= 3 && score < 5 && (
            <p className="text-warning mt-2">⚠️ Some important gaps. Prioritize CTEs and Window Functions - they're critical for Agoda!</p>
          )}
          {score < 3 && (
            <p className="text-danger mt-2">🚨 Multiple gaps detected. Don't panic! Follow the study plan carefully, spending extra time on CTEs (Day 4).</p>
          )}

          <div className="mt-3">
            <h3 className="mb-2">What to study:</h3>
            {!answers[1]?.correct && <p>❌ Study: <span className="text-primary">WHERE vs HAVING</span> (Chapter 4)</p>}
            {!answers[2]?.correct && <p>❌ Study: <span className="text-primary">Window Functions</span> (Chapter 8) 🔥</p>}
            {!answers[3]?.correct && <p>❌ Study: <span className="text-primary">JOINs</span> (Chapter 5)</p>}
            {!answers[4]?.correct && <p>❌ Study: <span className="text-primary">CTEs</span> (Chapter 7) 🚨 CRITICAL</p>}
            {!answers[5]?.correct && <p>❌ Study: <span className="text-primary">Subqueries</span> (Chapter 5)</p>}
            {!answers[6]?.correct && <p>❌ Study: <span className="text-primary">CTE vs Subquery</span> (Chapter 7) 🚨</p>}
            {!answers[7]?.correct && <p>❌ Study: <span className="text-primary">CTEs + Window Functions</span> (Chapter 8) 🔥</p>}
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
