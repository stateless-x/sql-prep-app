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

  const tabs = [
    { id: 'intro', label: '📚 JOIN Types', time: '5 min' },
    { id: 'pattern', label: '⭐ Find Missing', time: '3 min' },
    { id: 'subquery-where', label: '🔍 Subqueries in WHERE', time: '5 min' },
    { id: 'subquery-from', label: '📊 Subqueries in FROM', time: '4 min' },
    { id: 'subquery-select', label: '⚡ Subqueries in SELECT', time: '3 min' },
    { id: 'multi-table', label: '🔗 Multi-Table JOINs', time: '5 min' },
    { id: 'mistakes', label: '⚠️ Common Mistakes', time: '3 min' },
    { id: 'quiz', label: '✅ Quiz', time: '2 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🔗 JOINs & Subqueries</h1>
        <p className="chapter-subtitle">Combine tables and nest queries for complex analysis</p>
      </div>

      <LearningObjectives
        objectives={[
          'Master INNER, LEFT, and FULL JOINs with hotel data',
          'Use subqueries in WHERE, FROM, and SELECT clauses',
          'Know when to use JOIN vs Subquery vs CTE',
          'Find missing data patterns (hotels never booked)',
          'Combine multiple tables in complex Agoda scenarios'
        ]}
        time="30 min"
      />

      <TLDRBox
        points={[
          'INNER JOIN = only matching rows | LEFT JOIN = all left + matches',
          'Subquery in WHERE = filter | in FROM = temp table | in SELECT = scalar value',
          'LEFT JOIN + WHERE IS NULL = find missing pattern',
          'CTEs better than subqueries for readability (use in interviews!)',
          'Multi-table JOINs: chain with multiple ON clauses'
        ]}
      />

      <div className="alert alert-warning">
        <strong>🎯 AGODA FOCUS:</strong> Agoda tests multi-table JOINs and subqueries heavily. Master the "find missing" pattern!
      </div>

      <RecallBox
        chapter="SQL Fundamentals"
        concept="Execution order: FROM/JOIN happens first, then WHERE, then SELECT. This affects how subqueries work!"
      />

      {/* Tab Navigation */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="tab-time">({tab.time})</span>
          </button>
        ))}
      </div>

      {activeTab === 'intro' && (
        <div>
          <div className="section">
            <h2 className="section-title">INNER JOIN — Only matches</h2>
            <CodeBlock code={`SELECT u.email, b.amount
FROM users u
INNER JOIN bookings b ON u.user_id = b.user_id;`} />
            <p className="section-content mt-1">
              ✅ Result: Only users who HAVE bookings appear.
            </p>
          </div>

          <div className="section">
            <h2 className="section-title">LEFT JOIN — All left + matches</h2>
            <CodeBlock code={`SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id;`} />
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
          <CodeBlock code={`SELECT u.user_id, u.email
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
WHERE b.booking_id IS NULL;    -- No match found`} />

          <p className="section-content mt-2"><strong>Other examples:</strong></p>
          <CodeBlock code={`-- Hotels with no bookings
SELECT h.* FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE b.booking_id IS NULL;

-- Users who searched but never converted
SELECT DISTINCT s.user_id FROM searches s
LEFT JOIN bookings b ON s.user_id = b.user_id
WHERE b.booking_id IS NULL;`} />

          <TryThis
            challenge="Find cities that have hotels but zero bookings in the last 30 days"
            hint="LEFT JOIN hotels to bookings with date filter. Check for NULL booking_id."
            solution={`SELECT DISTINCT h.city
FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
                     AND b.booking_date >= CURRENT_DATE - INTERVAL '30 days'
WHERE b.booking_id IS NULL;`}
            explanation="✅ Put the date filter in the JOIN (not WHERE) to keep hotels with no matches. WHERE IS NULL finds cities with no recent bookings."
          />
        </div>
      )}

      {/* Tab: Subqueries in WHERE */}
      {activeTab === 'subquery-where' && (
        <div className="section">
          <h2 className="section-title">🔍 Subqueries in WHERE Clause</h2>

          <div className="card">
            <h3 className="card-title">Pattern: Filter Based on Another Query</h3>
            <p><strong>Scenario:</strong> "Find hotels in cities with more than 1000 total bookings"</p>
            <CodeBlock code={`SELECT * FROM hotels
WHERE city IN (
    SELECT city
    FROM bookings
    GROUP BY city
    HAVING COUNT(*) > 1000
);

-- Subquery runs first → returns list of cities
-- Main query filters hotels to those cities`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Pattern: Compare to Aggregated Value</h3>
            <p><strong>Scenario:</strong> "Find bookings above the average booking amount"</p>
            <CodeBlock code={`SELECT booking_id, amount
FROM bookings
WHERE amount > (
    SELECT AVG(amount)
    FROM bookings
);

-- Subquery returns single value (avg)
-- Main query compares each booking to it`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">IN vs EXISTS</h3>
            <CodeBlock code={`-- Using IN (good for small result sets)
SELECT * FROM hotels
WHERE hotel_id IN (
    SELECT hotel_id FROM bookings WHERE amount > 1000
);

-- Using EXISTS (better for large result sets)
SELECT * FROM hotels h
WHERE EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.hotel_id = h.hotel_id
    AND b.amount > 1000
);

-- EXISTS stops at first match → faster!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">NOT IN vs NOT EXISTS</h3>
            <CodeBlock code={`-- Find hotels with NO bookings (using NOT IN)
SELECT * FROM hotels
WHERE hotel_id NOT IN (
    SELECT DISTINCT hotel_id FROM bookings
    WHERE hotel_id IS NOT NULL  -- ⚠️ CRITICAL!
);

-- ⚠️ Problem: If subquery has NULL, NOT IN fails!
-- ✅ Solution: Use NOT EXISTS or LEFT JOIN

-- Using NOT EXISTS (safer)
SELECT * FROM hotels h
WHERE NOT EXISTS (
    SELECT 1 FROM bookings b
    WHERE b.hotel_id = h.hotel_id
);

-- Using LEFT JOIN (clearest)
SELECT h.* FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE b.booking_id IS NULL;`} />
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚠️ Agoda Tip:</strong> Prefer EXISTS over IN for correlated subqueries (better performance). Use LEFT JOIN for clarity in interviews!
          </div>
        </div>
      )}

      {/* Tab: Subqueries in FROM */}
      {activeTab === 'subquery-from' && (
        <div className="section">
          <h2 className="section-title">📊 Subqueries in FROM (Derived Tables)</h2>

          <div className="card">
            <h3 className="card-title">Pattern: Pre-Aggregate Then Join</h3>
            <p><strong>Scenario:</strong> "Show each city's average hotel rating vs platform average"</p>
            <CodeBlock code={`SELECT
    city_avgs.city,
    city_avgs.avg_rating as city_avg,
    platform.platform_avg
FROM (
    -- Subquery 1: City averages
    SELECT city, AVG(rating) as avg_rating
    FROM hotels
    GROUP BY city
) city_avgs
CROSS JOIN (
    -- Subquery 2: Platform average
    SELECT AVG(rating) as platform_avg
    FROM hotels
) platform;

-- ✅ Better: Use CTEs for readability!
WITH city_avgs AS (
    SELECT city, AVG(rating) as avg_rating
    FROM hotels GROUP BY city
),
platform AS (
    SELECT AVG(rating) as platform_avg FROM hotels
)
SELECT * FROM city_avgs CROSS JOIN platform;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Pattern: Filter Aggregated Results</h3>
            <p><strong>Scenario:</strong> "Find average booking value for users with 5+ bookings"</p>
            <CodeBlock code={`SELECT
    user_counts.user_id,
    user_counts.booking_count,
    AVG(b.amount) as avg_booking_value
FROM (
    -- Step 1: Find users with 5+ bookings
    SELECT user_id, COUNT(*) as booking_count
    FROM bookings
    GROUP BY user_id
    HAVING COUNT(*) >= 5
) user_counts
JOIN bookings b ON user_counts.user_id = b.user_id
GROUP BY user_counts.user_id, user_counts.booking_count;

-- 💡 This is where CTEs shine! Much clearer:`}  />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">When to Use FROM Subqueries</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Use Case</th>
                    <th>FROM Subquery</th>
                    <th>Better Alternative</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>One-time derived table</td>
                    <td className="text-success">✅ OK</td>
                    <td className="text-warning">CTE for clarity</td>
                  </tr>
                  <tr>
                    <td>Multi-step logic</td>
                    <td className="text-danger">❌ Hard to read</td>
                    <td className="text-success">✅ Use CTEs</td>
                  </tr>
                  <tr>
                    <td>Reuse same subquery</td>
                    <td className="text-danger">❌ Duplicate code</td>
                    <td className="text-success">✅ Use CTE</td>
                  </tr>
                  <tr>
                    <td>Interviews</td>
                    <td className="text-warning">⚠️ Works</td>
                    <td className="text-success">✅ CTEs show thinking</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 Agoda Recommendation:</strong> Always use CTEs instead of FROM subqueries in interviews. They're more readable and show your problem-solving process!
          </div>
        </div>
      )}

      {/* Tab: Subqueries in SELECT */}
      {activeTab === 'subquery-select' && (
        <div className="section">
          <h2 className="section-title">⚡ Subqueries in SELECT (Scalar Subqueries)</h2>

          <div className="alert alert-warning">
            <strong>⚠️ WARNING:</strong> SELECT subqueries must return EXACTLY ONE value (one row, one column). Use with caution!
          </div>

          <div className="card">
            <h3 className="card-title">Pattern: Add Calculated Column</h3>
            <p><strong>Scenario:</strong> "Show each hotel with its average booking price"</p>
            <CodeBlock code={`SELECT
    hotel_id,
    hotel_name,
    (SELECT AVG(amount)
     FROM bookings b
     WHERE b.hotel_id = h.hotel_id) as avg_booking_price
FROM hotels h;

-- ⚠️ Runs subquery for EACH hotel (can be slow!)
-- ✅ Better: Use JOIN or window function`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Pattern: Correlated Subquery</h3>
            <p><strong>Scenario:</strong> "Show each user's latest booking date"</p>
            <CodeBlock code={`SELECT
    user_id,
    user_name,
    (SELECT MAX(booking_date)
     FROM bookings b
     WHERE b.user_id = u.user_id) as latest_booking
FROM users u;

-- Correlated: Subquery references outer query (u.user_id)
-- Runs once per user

-- ✅ Better alternative with window function:
WITH ranked_bookings AS (
    SELECT
        user_id,
        booking_date,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) as rank
    FROM bookings
)
SELECT u.user_id, u.user_name, rb.booking_date as latest_booking
FROM users u
LEFT JOIN ranked_bookings rb ON u.user_id = rb.user_id AND rb.rank = 1;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">⚠️ Common Pitfall: Multiple Rows</h3>
            <CodeBlock code={`-- ❌ ERROR: Subquery returns multiple rows!
SELECT
    user_id,
    (SELECT booking_id FROM bookings b WHERE b.user_id = u.user_id) as booking
FROM users u;

-- If user has 2+ bookings, this fails!

-- ✅ Fix: Ensure single row with MAX, MIN, or LIMIT
SELECT
    user_id,
    (SELECT MAX(booking_id) FROM bookings b WHERE b.user_id = u.user_id) as latest_booking
FROM users u;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">When to Avoid SELECT Subqueries</h3>
            <ul>
              <li>❌ When the subquery runs for each row (N+1 query problem)</li>
              <li>❌ When you can use a JOIN instead (almost always faster)</li>
              <li>❌ When you need multiple columns from the subquery</li>
              <li>✅ Only use for simple, one-time calculations</li>
            </ul>
          </div>

          <div className="alert alert-info mt-2">
            <strong>🎯 Agoda Advice:</strong> Avoid SELECT subqueries in interviews. Use JOINs or CTEs + window functions instead. Shows better SQL knowledge!
          </div>
        </div>
      )}

      {/* Tab: Multi-Table JOINs */}
      {activeTab === 'multi-table' && (
        <div className="section">
          <h2 className="section-title">🔗 Multi-Table JOINs</h2>

          <div className="card">
            <h3 className="card-title">Pattern: Chain Multiple JOINs</h3>
            <p><strong>Scenario:</strong> "Show user name, hotel name, and city for all bookings"</p>
            <CodeBlock code={`SELECT
    u.user_name,
    h.hotel_name,
    h.city,
    b.booking_date,
    b.amount
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN hotels h ON b.hotel_id = h.hotel_id
ORDER BY b.booking_date DESC;

-- JOINs execute left to right
-- Each JOIN adds another table's columns`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 Complex Agoda Scenario</h3>
            <p><strong>"Find top spending users per city with hotel details"</strong></p>
            <CodeBlock code={`WITH user_city_spending AS (
    SELECT
        b.user_id,
        h.city,
        SUM(b.amount) as total_spent
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    GROUP BY b.user_id, h.city
),
ranked_users AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY total_spent DESC
        ) as city_rank
    FROM user_city_spending
)
SELECT
    u.user_name,
    ru.city,
    ru.total_spent,
    ru.city_rank
FROM ranked_users ru
JOIN users u ON ru.user_id = u.user_id
WHERE ru.city_rank <= 3
ORDER BY ru.city, ru.city_rank;

-- Combines: CTEs + Window Functions + Multiple JOINs`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Mixing JOIN Types</h3>
            <p><strong>Scenario:</strong> "All users with their booking count (including users with 0 bookings)"</p>
            <CodeBlock code={`SELECT
    u.user_id,
    u.user_name,
    COUNT(b.booking_id) as booking_count,
    COALESCE(SUM(b.amount), 0) as total_spent
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
LEFT JOIN hotels h ON b.hotel_id = h.hotel_id
GROUP BY u.user_id, u.user_name
ORDER BY booking_count DESC;

-- LEFT JOIN ensures all users appear
-- COUNT(b.booking_id) counts only non-NULL bookings
-- COALESCE handles NULL sums (users with no bookings)`} />
          </div>

          <TryThis
            challenge="Write a query to find hotels that have bookings from users in at least 3 different countries. Show hotel name, city, and number of unique countries."
            hint="JOIN hotels → bookings → users. GROUP BY hotel. COUNT(DISTINCT user.country) >= 3."
            solution={`SELECT
    h.hotel_name,
    h.city,
    COUNT(DISTINCT u.country) as countries_count
FROM hotels h
JOIN bookings b ON h.hotel_id = b.hotel_id
JOIN users u ON b.user_id = u.user_id
GROUP BY h.hotel_id, h.hotel_name, h.city
HAVING COUNT(DISTINCT u.country) >= 3
ORDER BY countries_count DESC;`}
            explanation="✅ Chain 2 JOINs to connect hotels → bookings → users. COUNT(DISTINCT country) finds unique countries. HAVING filters groups with 3+."
          />
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="section">
          <h2 className="section-title">⚠️ Common JOIN Mistake</h2>
          <p className="section-content"><strong>LEFT JOIN then filtering away NULLs</strong></p>

          <div className="mt-2">
            <CodeBlock code={`-- ❌ WRONG: Removes users with no completed bookings!
SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed';   -- Filters out NULLs!

-- ✅ RIGHT: Put condition in JOIN
SELECT u.email, b.amount
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
                    AND b.status = 'completed';`} />
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

      <KeyTakeaways
        points={[
          'INNER JOIN = only matches | LEFT JOIN = all left + NULL for no match',
          'Subqueries in WHERE = filter | FROM = temp table | SELECT = scalar (avoid!)',
          'Use EXISTS instead of IN for better performance',
          'NOT IN with NULL values = danger! Use NOT EXISTS or LEFT JOIN',
          'Always use CTEs instead of subqueries in interviews (readability!)',
          'Multi-table JOINs: chain with multiple ON clauses',
          'Pattern: LEFT JOIN + WHERE IS NULL = find missing data'
        ]}
        nextChapter="Study '🏗️ CTEs & Multi-Step Queries' to master complex queries"
        relatedChapters="'🪟 Window Functions' for ranking within JOINed data"
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
