import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function SQLFundamentals({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('order')

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🧠 SQL Fundamentals</h1>
        <p className="chapter-subtitle">Master the mental model</p>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'order' ? 'active' : ''}`} onClick={() => setActiveTab('order')}>
          🔄 Execution Order
        </button>
        <button className={`tab ${activeTab === 'grain' ? 'active' : ''}`} onClick={() => setActiveTab('grain')}>
          🌾 Know Your Grain
        </button>
        <button className={`tab ${activeTab === 'ops' ? 'active' : ''}`} onClick={() => setActiveTab('ops')}>
          ⚙️ Core Operations
        </button>
        <button className={`tab ${activeTab === 'distinct' ? 'active' : ''}`} onClick={() => setActiveTab('distinct')}>
          🔍 DISTINCT & UNION
        </button>
        <button className={`tab ${activeTab === 'nulls' ? 'active' : ''}`} onClick={() => setActiveTab('nulls')}>
          ⚡ NULL Handling
        </button>
        <button className={`tab ${activeTab === 'complex' ? 'active' : ''}`} onClick={() => setActiveTab('complex')}>
          🧩 Reading Complex SQL
        </button>
      </div>

      {activeTab === 'order' && (
        <div className="section">
          <h2 className="section-title">⚠️ THE Most Important Concept</h2>
          <div className="alert alert-warning">
            <strong>Writing Order ≠ Execution Order</strong><br />
            Memorize this. It explains 80% of SQL "weird" behavior!
          </div>

          <div className="mt-2">
            <CodeBlock code={`YOU WRITE:              DATABASE RUNS:
───────────             ───────────────
1. SELECT               1. FROM        ← Pick tables
2. FROM                 2. JOIN        ← Combine tables
3. JOIN                 3. WHERE       ← Filter rows
4. WHERE                4. GROUP BY    ← Collapse into groups
5. GROUP BY             5. HAVING      ← Filter groups
6. HAVING               6. SELECT      ← Create columns/aliases
7. ORDER BY             7. ORDER BY    ← Sort
8. LIMIT                8. LIMIT       ← Cut off`} />
          </div>

          <div className="section mt-2">
            <h3 className="section-title">Why This Matters</h3>
            <CodeBlock code={`-- ❌ FAILS: Alias doesn't exist when WHERE runs
SELECT user_id, SUM(amount) AS total
FROM bookings
WHERE total > 1000    -- ERROR! SELECT hasn't run yet
GROUP BY user_id;

-- ✅ WORKS: HAVING runs after GROUP BY
SELECT user_id, SUM(amount) AS total
FROM bookings
GROUP BY user_id
HAVING SUM(amount) > 1000;`} />
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 Quick Test:</strong> In what order do these execute?<br />
            <code className="inline-code">SELECT, FROM, WHERE, HAVING, GROUP BY, ORDER BY</code>
            <br /><br />
            <strong>Answer:</strong> FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
          </div>
        </div>
      )}

      {activeTab === 'grain' && (
        <div className="section">
          <h2 className="section-title">Know Your "Grain"</h2>
          <p className="section-content">
            <strong>Grain = What does ONE row represent?</strong><br />
            Always ask yourself: "In my result, what is ONE row?"
          </p>

          <div className="mt-2">
            <CodeBlock code={`-- Grain: ONE ROW = ONE BOOKING
SELECT * FROM bookings;

-- Grain: ONE ROW = ONE USER
SELECT user_id, SUM(amount) FROM bookings GROUP BY user_id;

-- Grain: ONE ROW = ONE USER-HOTEL COMBINATION
SELECT user_id, hotel_id, COUNT(*)
FROM bookings
GROUP BY user_id, hotel_id;`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Pro Tip:</strong> Before writing any query, decide what grain you need. This prevents confusion!
          </div>
        </div>
      )}

      {activeTab === 'ops' && (
        <div className="section">
          <h2 className="section-title">The 6 Building Blocks</h2>

          <div className="card">
            <h3 className="card-title">1. SELECT — What columns</h3>
            <CodeBlock code={`SELECT user_id, email, amount * 1.1 AS amount_with_tax`} />
          </div>

          <div className="card">
            <h3 className="card-title">2. FROM / JOIN — What tables</h3>
            <CodeBlock code={`FROM bookings b
JOIN users u ON b.user_id = u.user_id`} />
          </div>

          <div className="card">
            <h3 className="card-title">3. WHERE — Filter rows BEFORE grouping</h3>
            <CodeBlock code={`WHERE status = 'completed' AND amount > 100`} />
          </div>

          <div className="card">
            <h3 className="card-title">4. GROUP BY — Collapse rows</h3>
            <CodeBlock code={`GROUP BY user_id    -- Now one row per user`} />
          </div>

          <div className="card">
            <h3 className="card-title">5. HAVING — Filter groups AFTER grouping</h3>
            <CodeBlock code={`HAVING COUNT(*) >= 5 AND SUM(amount) > 1000`} />
          </div>

          <div className="card">
            <h3 className="card-title">6. ORDER BY / LIMIT — Sort and cut</h3>
            <CodeBlock code={`ORDER BY total DESC LIMIT 10`} />
          </div>
        </div>
      )}

      {activeTab === 'distinct' && (
        <div className="section">
          <h2 className="section-title">DISTINCT vs GROUP BY</h2>

          <div className="card">
            <h3 className="card-title">DISTINCT — Remove duplicates</h3>
            <CodeBlock code={`-- Get unique countries
SELECT DISTINCT country FROM users;

-- Unique combinations
SELECT DISTINCT country, account_type FROM users;`} />
            <p className="mt-1"><strong>When to use:</strong> Simple deduplication, no aggregates needed</p>
          </div>

          <div className="card">
            <h3 className="card-title">GROUP BY — Dedupe + aggregate</h3>
            <CodeBlock code={`-- Count users per country
SELECT country, COUNT(*) FROM users GROUP BY country;`} />
            <p className="mt-1"><strong>When to use:</strong> When you need counts, sums, or other aggregates</p>
          </div>

          <h2 className="section-title mt-3">UNION vs UNION ALL</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>UNION</th>
                  <th>UNION ALL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Duplicates</strong></td>
                  <td>Removed (slower)</td>
                  <td>Kept (faster)</td>
                </tr>
                <tr>
                  <td><strong>Use when</strong></td>
                  <td>Need unique results</td>
                  <td>Duplicates OK or impossible</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-2">
            <CodeBlock code={`-- Combine results from two queries
SELECT user_id FROM premium_users
UNION ALL
SELECT user_id FROM trial_users;

-- Remove duplicates if user is in both
SELECT user_id FROM premium_users
UNION
SELECT user_id FROM trial_users;`} />
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚡ Performance Tip:</strong> Use UNION ALL when possible - it's faster because it doesn't check for duplicates!
          </div>
        </div>
      )}

      {activeTab === 'nulls' && (
        <div className="section">
          <h2 className="section-title">NULL Handling</h2>

          <div className="alert alert-warning">
            <strong>⚠️ NULL ≠ empty string ≠ 0</strong><br />
            NULL means "unknown" or "missing value"
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Checking for NULL</h3>
            <CodeBlock code={`-- ❌ WRONG: Never use = or !=
WHERE country = NULL    -- Always returns no rows!
WHERE country != NULL   -- Always returns no rows!

-- ✅ RIGHT: Use IS NULL / IS NOT NULL
WHERE country IS NULL
WHERE country IS NOT NULL`} />
          </div>

          <div className="card">
            <h3 className="card-title">COALESCE — Default values</h3>
            <CodeBlock code={`-- Return first non-NULL value
SELECT
    user_id,
    COALESCE(phone, email, 'No contact') AS contact
FROM users;

-- Replace NULL with 0 in calculations
SELECT
    hotel_id,
    COALESCE(SUM(amount), 0) AS total_revenue
FROM bookings
GROUP BY hotel_id;`} />
          </div>

          <div className="card">
            <h3 className="card-title">NULLIF — Avoid divide by zero</h3>
            <CodeBlock code={`-- Without NULLIF - crashes if bookings = 0
revenue / bookings

-- With NULLIF - returns NULL instead of error
revenue / NULLIF(bookings, 0)`} />
          </div>

          <div className="card">
            <h3 className="card-title">NULL in aggregates</h3>
            <CodeBlock code={`-- COUNT(*) counts all rows
SELECT COUNT(*) FROM users;  -- Includes rows with NULL

-- COUNT(column) ignores NULLs
SELECT COUNT(phone) FROM users;  -- Only counts non-NULL phones

-- Other aggregates (SUM, AVG, etc.) ignore NULLs
SELECT AVG(rating) FROM reviews;  -- NULLs not included in average`} />
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 Interview Tip:</strong> Always consider NULLs in your queries. Ask: "What happens if this column is NULL?"
          </div>
        </div>
      )}

      {activeTab === 'complex' && (
        <div className="section">
          <h2 className="section-title">🧩 How to Read Complex SQL</h2>

          <div className="alert alert-info">
            <strong>💡 Key Strategy:</strong> Read from inside-out, bottom-up. Start with the innermost query/CTE and work your way out.
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 1: Identify the Structure</h3>
            <p>Look for these patterns:</p>
            <ul>
              <li><strong>CTEs (WITH clauses)</strong> — Temporary named result sets</li>
              <li><strong>Subqueries</strong> — Queries inside parentheses</li>
              <li><strong>Window functions</strong> — OVER() clauses</li>
              <li><strong>Multiple JOINs</strong> — Chain of table combinations</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="card-title">Step 2: Read CTEs First (WITH clauses)</h3>
            <p><strong>Think of CTEs as temporary tables you create before the main query.</strong></p>
            <CodeBlock code={`WITH step1 AS (
    -- Read this FIRST: "Create a temp table called step1"
    SELECT user_id, SUM(amount) AS total
    FROM bookings
    GROUP BY user_id
),
step2 AS (
    -- Read this SECOND: "Create another temp table using step1"
    SELECT user_id, total,
           RANK() OVER (ORDER BY total DESC) AS rank
    FROM step1
)
-- Read this LAST: "Now use those temp tables"
SELECT * FROM step2 WHERE rank <= 10;`} />
            <div className="alert alert-success mt-2">
              <strong>✅ Reading Strategy:</strong> Name each CTE in your head: "Step 1 calculates totals, Step 2 ranks them, Final query gets top 10"
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Step 3: Break Down Complex Conditions</h3>
            <p><strong>Separate AND/OR logic into bullet points</strong></p>
            <CodeBlock code={`-- Hard to read:
WHERE (status = 'completed' AND amount > 100) OR (status = 'pending' AND created_at > '2024-01-01')

-- Mental breakdown:
-- Show rows where:
--   • (status is completed AND amount > 100)
--   OR
--   • (status is pending AND created recently)`} />
          </div>

          <div className="card">
            <h3 className="card-title">Step 4: Trace the Data Flow</h3>
            <p><strong>For each step, ask: "What grain am I at?"</strong></p>
            <CodeBlock code={`WITH user_totals AS (
    -- Grain: ONE ROW PER USER
    SELECT user_id, SUM(amount) AS total
    FROM bookings  -- Grain: ONE ROW PER BOOKING
    GROUP BY user_id
)
SELECT u.email, ut.total
FROM users u  -- Grain: ONE ROW PER USER
JOIN user_totals ut ON u.user_id = ut.user_id;
-- Result grain: ONE ROW PER USER (with email)`} />
          </div>

          <div className="card">
            <h3 className="card-title">Step 5: Subquery Reading Order</h3>
            <CodeBlock code={`-- Read order: 3 → 2 → 1
SELECT u.email  -- 1. Final: Get emails
FROM users u
WHERE u.user_id IN (  -- 2. Filter: Only these user_ids
    SELECT user_id  -- 3. Start here: Which user_ids?
    FROM bookings
    WHERE amount > 1000
);`} />
            <div className="alert alert-info mt-2">
              <strong>💡 Tip:</strong> Subqueries in WHERE run first, then the outer query uses those results to filter.
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">Step 6: Window Functions in Complex Queries</h3>
            <p><strong>Remember: Window functions run AFTER WHERE/GROUP BY but BEFORE ORDER BY</strong></p>
            <CodeBlock code={`WITH ranked_bookings AS (
    -- 1. Start: Filter and calculate
    SELECT
        user_id,
        booking_date,
        amount,
        -- 2. Add window function (runs after WHERE)
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) AS recency_rank
    FROM bookings
    WHERE status = 'completed'
)
-- 3. Finally: Filter window function results
SELECT * FROM ranked_bookings WHERE recency_rank = 1;`} />
          </div>

          <h2 className="section-title mt-3">🎯 Interview Tips for Complex SQL</h2>

          <div className="card">
            <h3 className="card-title">1. Talk Through Your Reading</h3>
            <p>In interviews, verbalize your thought process:</p>
            <ul>
              <li>"I see a CTE called user_totals that aggregates bookings per user..."</li>
              <li>"Then the main query joins that with users to get emails..."</li>
              <li>"The WHERE clause filters completed bookings only..."</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="card-title">2. Ask About Grain at Each Step</h3>
            <p>Show you understand data transformations:</p>
            <ul>
              <li>"After this GROUP BY, we're at one row per user"</li>
              <li>"This JOIN will keep the same grain since it's 1-to-1"</li>
              <li>"The window function preserves all rows but adds a calculated column"</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="card-title">3. Identify the "Why"</h3>
            <p>Understand the business logic:</p>
            <ul>
              <li>"This CTE calculates total spend per user for ranking"</li>
              <li>"The LEFT JOIN keeps all users, even those without bookings"</li>
              <li>"The HAVING filters out users below the threshold"</li>
            </ul>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚡ Pro Tip:</strong> When stuck on complex SQL in an interview, start by identifying all the CTEs and naming what each one does. This shows structured thinking!
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
