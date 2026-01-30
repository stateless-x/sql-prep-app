import { useState } from 'react'
import Quiz from './Quiz'
import CodeBlock from './CodeBlock'

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

        <div className="mt-2">
          <CodeBlock code={`-- ❌ WRONG: email not in GROUP BY or aggregate
SELECT user_id, email, SUM(amount)
FROM bookings
GROUP BY user_id;

-- ✅ RIGHT
SELECT user_id, SUM(amount)
FROM bookings
GROUP BY user_id;`} />
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
        <p className="section-content"><strong>Use CASE WHEN inside aggregates to count/sum specific conditions</strong></p>
        <CodeBlock code={`-- Count only completed bookings
SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed

-- Calculate conversion rate
ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) AS conv_rate`} />
      </div>

      <div className="section">
        <h2 className="section-title">🎯 Common Aggregation Patterns for Interviews</h2>

        <div className="card">
          <h3 className="card-title">1. Multiple Metrics Per Group</h3>
          <p><strong>Business Question:</strong> "Show user statistics: total bookings, total spent, average order value"</p>
          <CodeBlock code={`SELECT
    user_id,
    COUNT(*) AS total_bookings,
    SUM(amount) AS total_spent,
    ROUND(AVG(amount), 2) AS avg_order_value,
    MIN(booking_date) AS first_booking,
    MAX(booking_date) AS last_booking
FROM bookings
WHERE status = 'completed'
GROUP BY user_id
HAVING COUNT(*) >= 3;  -- Only users with 3+ bookings`} />
        </div>

        <div className="card">
          <h3 className="card-title">2. Pivot-Style Aggregation (CASE in SELECT)</h3>
          <p><strong>Business Question:</strong> "Show bookings by platform in columns"</p>
          <CodeBlock code={`SELECT
    user_id,
    COUNT(*) AS total_bookings,
    SUM(CASE WHEN platform = 'mobile' THEN 1 ELSE 0 END) AS mobile_bookings,
    SUM(CASE WHEN platform = 'desktop' THEN 1 ELSE 0 END) AS desktop_bookings,
    SUM(CASE WHEN platform = 'app' THEN 1 ELSE 0 END) AS app_bookings
FROM bookings
GROUP BY user_id;`} />
          <div className="alert alert-success mt-1">
            <strong>💡 Interview Tip:</strong> This pattern (CASE inside SUM) is VERY common in BI roles. Memorize it!
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">3. Percentage Calculations</h3>
          <p><strong>Business Question:</strong> "What % of each user's bookings were mobile?"</p>
          <CodeBlock code={`SELECT
    user_id,
    COUNT(*) AS total_bookings,
    SUM(CASE WHEN platform = 'mobile' THEN 1 ELSE 0 END) AS mobile_bookings,
    ROUND(
        100.0 * SUM(CASE WHEN platform = 'mobile' THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) AS mobile_percentage
FROM bookings
GROUP BY user_id;`} />
          <div className="alert alert-warning mt-1">
            <strong>⚠️ Important:</strong> Always use <code className="inline-code">100.0</code> (decimal) not <code className="inline-code">100</code> to avoid integer division!
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">4. Multi-Level Grouping</h3>
          <p><strong>Business Question:</strong> "Total revenue by country and account type"</p>
          <CodeBlock code={`SELECT
    u.country,
    u.account_type,
    COUNT(*) AS booking_count,
    SUM(b.amount) AS total_revenue,
    ROUND(AVG(b.amount), 2) AS avg_booking_value
FROM bookings b
JOIN users u ON b.user_id = u.user_id
WHERE b.status = 'completed'
GROUP BY u.country, u.account_type
ORDER BY u.country, total_revenue DESC;`} />
          <p className="mt-1"><strong>Grain:</strong> One row per country-account_type combination</p>
        </div>

        <div className="card">
          <h3 className="card-title">5. Filtering After Aggregation</h3>
          <p><strong>Business Question:</strong> "High-value users (spent >$5000) with at least 10 bookings"</p>
          <CodeBlock code={`SELECT
    user_id,
    COUNT(*) AS booking_count,
    SUM(amount) AS total_spent,
    ROUND(AVG(amount), 2) AS avg_booking
FROM bookings
WHERE status = 'completed'
GROUP BY user_id
HAVING COUNT(*) >= 10              -- Filter groups
   AND SUM(amount) > 5000;         -- Multiple conditions in HAVING`} />
        </div>

        <div className="card">
          <h3 className="card-title">6. NULL Handling in Aggregates</h3>
          <p><strong>Remember: Aggregates ignore NULL values (except COUNT(*))</strong></p>
          <CodeBlock code={`-- COUNT(*) counts all rows, including NULLs
SELECT COUNT(*) FROM users;  -- Returns: 1000

-- COUNT(column) ignores NULLs
SELECT COUNT(phone) FROM users;  -- Returns: 850 (only users with phone)

-- Be careful with AVG
SELECT AVG(rating) FROM reviews;  -- NULLs ignored, might skew average

-- Use COALESCE if you want to treat NULL as 0
SELECT AVG(COALESCE(rating, 0)) FROM reviews;`} />
        </div>

        <div className="card">
          <h3 className="card-title">7. Cohort Analysis Pattern</h3>
          <p><strong>Business Question:</strong> "First purchase month vs lifetime value"</p>
          <CodeBlock code={`SELECT
    DATE_TRUNC('month', MIN(booking_date)) AS cohort_month,
    COUNT(DISTINCT user_id) AS users_in_cohort,
    COUNT(*) AS total_bookings,
    SUM(amount) AS total_revenue,
    ROUND(SUM(amount) / COUNT(DISTINCT user_id), 2) AS revenue_per_user
FROM bookings
WHERE status = 'completed'
GROUP BY user_id, DATE_TRUNC('month', MIN(booking_date));`} />
        </div>

        <div className="card">
          <h3 className="card-title">8. Statistical Aggregations</h3>
          <p><strong>Common in analytics interviews</strong></p>
          <CodeBlock code={`SELECT
    hotel_id,
    COUNT(*) AS booking_count,
    -- Central tendency
    ROUND(AVG(amount), 2) AS mean_amount,
    -- Spread
    MIN(amount) AS min_amount,
    MAX(amount) AS max_amount,
    MAX(amount) - MIN(amount) AS range_amount,
    -- Distribution
    ROUND(STDDEV(amount), 2) AS std_dev_amount,
    ROUND(VARIANCE(amount), 2) AS variance_amount
FROM bookings
WHERE status = 'completed'
GROUP BY hotel_id
HAVING COUNT(*) >= 20;  -- Need enough data for stats`} />
          <div className="alert alert-info mt-1">
            <strong>💡 Note:</strong> STDDEV and VARIANCE are supported in PostgreSQL, MySQL, and most modern databases
          </div>
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
