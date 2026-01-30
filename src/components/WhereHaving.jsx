import { useState } from 'react'
import Quiz from './Quiz'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'
import TryThis from './TryThis'
import RecallBox from './RecallBox'

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

      <LearningObjectives
        objectives={[
          'When WHERE runs vs when HAVING runs',
          'Why you can\'t use aggregates in WHERE',
          'How to choose the right one for your filter',
          'Avoid common WHERE/HAVING mistakes'
        ]}
        time="10 min"
      />

      <TLDRBox
        points={[
          'WHERE = BEFORE grouping (no aggregates!)',
          'HAVING = AFTER grouping (use aggregates!)',
          'Row filter → WHERE | Group filter → HAVING',
          'WHERE filters rows, HAVING filters groups'
        ]}
      />

      <div className="alert alert-warning">
        <strong>⚠️ CRITICAL:</strong> This is where many people fail. Master this!
      </div>

      <div className="alert alert-info">
        <strong>🎯 Real-World Analogy:</strong><br />
        <strong>WHERE</strong> = Security guard at the door (filters people BEFORE they enter)<br />
        <strong>HAVING</strong> = Manager checking teams AFTER they've been formed<br />
        <br />
        WHERE checks individual records → HAVING checks summary/group totals
      </div>

      <RecallBox
        chapter="SQL Fundamentals"
        concept="Execution order: FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT"
      />

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

        <div className="mt-2">
          <CodeBlock code={`rows → [WHERE filters rows] → [GROUP BY collapses] → [HAVING filters groups] → result`} />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Real Example: Step-by-Step</h2>

        <div className="card">
          <h3 className="card-title">Business Question</h3>
          <p>
            <strong>"Find high-value users who spent over $5000, but only count completed bookings (ignore cancelled/pending)"</strong>
          </p>
        </div>

        <div className="card mt-2">
          <h3 className="card-title">Breaking It Down</h3>
          <p>
            Two different filters needed:<br />
            <br />
            1️⃣ <strong>"Only count completed bookings"</strong><br />
            → This filters INDIVIDUAL rows (each booking's status)<br />
            → Use WHERE status = 'completed'<br />
            → Happens BEFORE grouping<br />
            <br />
            2️⃣ <strong>"Users who spent over $5000"</strong><br />
            → This filters by TOTAL spent (sum across a user's bookings)<br />
            → Use HAVING SUM(amount) > 5000<br />
            → Happens AFTER grouping (because you need the SUM first!)
          </p>
        </div>

        <div className="mt-2">
          <CodeBlock code={`SELECT user_id, SUM(amount) AS total_spent
FROM bookings
WHERE status = 'completed'    -- ⬅️ Step 1: Filter individual rows
GROUP BY user_id              -- ⬅️ Step 2: Collapse into groups
HAVING SUM(amount) > 5000;    -- ⬅️ Step 3: Filter groups by their totals

-- Execution order:
-- 1. WHERE removes cancelled/pending bookings (filters 1000 rows → 600 rows)
-- 2. GROUP BY collapses 600 rows into 50 users
-- 3. HAVING keeps only users with total > $5000 (filters 50 users → 12 users)
-- Result: 12 rows (high-value users)`} />
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Common Mistakes</h2>

        <div className="card">
          <h3 className="card-title">❌ Mistake #1: Aggregate in WHERE</h3>
          <CodeBlock code={`SELECT user_id, SUM(amount)
FROM bookings
WHERE SUM(amount) > 5000      -- ERROR! SUM doesn't exist yet!
GROUP BY user_id;`} />
          <p className="mt-1">
            <strong style={{ color: 'var(--danger)' }}>Why it fails:</strong><br />
            WHERE runs BEFORE GROUP BY. At this point, there are no groups yet!<br />
            SUM(amount) doesn't exist until after GROUP BY happens.<br />
            <br />
            <strong style={{ color: 'var(--success)' }}>Fix:</strong> Move to HAVING
          </p>
        </div>

        <div className="card mt-2">
          <h3 className="card-title">❌ Mistake #2: Row-level filter in HAVING</h3>
          <CodeBlock code={`SELECT user_id, SUM(amount)
FROM bookings
GROUP BY user_id
HAVING status = 'completed';  -- WRONG! status is a row-level column`} />
          <p className="mt-1">
            <strong style={{ color: 'var(--danger)' }}>Why it's wrong:</strong><br />
            HAVING is for filtering GROUPS, not individual rows.<br />
            'status' is a property of individual bookings, not of a user group.<br />
            Also inefficient: filters AFTER grouping instead of before.<br />
            <br />
            <strong style={{ color: 'var(--success)' }}>Fix:</strong> Move to WHERE (filters before grouping = faster!)
          </p>
        </div>

        <div className="card mt-2">
          <h3 className="card-title">✅ The Right Way</h3>
          <CodeBlock code={`SELECT user_id, SUM(amount)
FROM bookings
WHERE status = 'completed'    -- ✅ Filter rows first (individual records)
GROUP BY user_id              -- Then group what's left
HAVING SUM(amount) > 5000;    -- ✅ Then filter groups (aggregated totals)`} />
          <p className="mt-1">
            <strong style={{ color: 'var(--success)' }}>Why this works:</strong><br />
            1. WHERE filters out cancelled bookings BEFORE expensive GROUP BY operation<br />
            2. GROUP BY only processes completed bookings<br />
            3. HAVING filters the final aggregated results<br />
            Result: Faster + correct!
          </p>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Decision Tree</h2>
        <CodeBlock code={`Is the condition about...

├── Individual rows (before grouping)?
│   └── Use WHERE
│   └── Examples: status = 'completed', amount > 100
│
└── Aggregated results (after grouping)?
    └── Use HAVING
    └── Examples: SUM(amount) > 1000, COUNT(*) >= 5`} />
      </div>

      <TryThis
        challenge='Write a query: "Find cities with more than 10 hotels, but only count 4+ star hotels"'
        hint="Think: What needs to be filtered before counting? What needs to be filtered after?"
        solution={`SELECT city, COUNT(*) AS hotel_count
FROM hotels
WHERE star_rating >= 4    -- Filter individual hotels BEFORE counting
GROUP BY city
HAVING COUNT(*) > 10;     -- Filter cities AFTER counting`}
        explanation="✅ WHERE filters individual hotels (row-level: star_rating). HAVING filters cities by their count (group-level: COUNT(*)). WHERE runs first, then GROUP BY collapses rows, then HAVING checks the count."
      />

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

      <KeyTakeaways
        points={[
          'WHERE runs before GROUP BY (filters rows)',
          'HAVING runs after GROUP BY (filters groups)',
          'Can\'t use SUM/COUNT/AVG in WHERE',
          'Put row filters in WHERE, aggregate filters in HAVING',
          'WHERE is more efficient (filters before expensive grouping)'
        ]}
        nextChapter="Read '🔗 JOINs' to combine tables"
        relatedChapters="'📊 GROUP BY' creates the groups that HAVING filters"
      />

      <button
        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
        onClick={onComplete}
      >
        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
      </button>
    </div>
  )
}
