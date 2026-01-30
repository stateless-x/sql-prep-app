import { useState } from 'react'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'
import TryThis from './TryThis'
import RecallBox from './RecallBox'

export default function WindowFunctionsPatterns({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('patterns')

  const tabs = [
    { id: 'patterns', label: '🎯 Pattern Recognition', time: '5 min' },
    { id: 'basics', label: '📊 Ranking Functions', time: '8 min' },
    { id: 'lag-lead', label: '↔️ LAG/LEAD', time: '7 min' },
    { id: 'running', label: '📈 Running Totals', time: '6 min' },
    { id: 'frames', label: '🎞️ Window Frames', time: '8 min' },
    { id: 'gotchas', label: '⚠️ Gotchas', time: '6 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🪟 Window Functions & Patterns</h1>
        <p className="chapter-subtitle">Keep all rows while ranking and comparing</p>
      </div>

      <LearningObjectives
        objectives={[
          'Recognize patterns: "top 3 per city" → ROW_NUMBER()',
          'Calculate running totals and moving averages',
          'Compare rows (LAG/LEAD for growth calculations)',
          'Know when to use window functions vs GROUP BY',
          'Avoid common window function mistakes'
        ]}
        time="40 min"
      />

      <TLDRBox
        points={[
          'Windows keep all rows (GROUP BY collapses rows)',
          'ROW_NUMBER = unique ranks (1,2,3,4)',
          'RANK = ties allowed with gaps (1,1,3,4)',
          'DENSE_RANK = ties allowed without gaps (1,1,2,3)',
          'LAG = previous row, LEAD = next row',
          'Pattern: "top N per X" = ROW_NUMBER() OVER (PARTITION BY X ...)'
        ]}
      />

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span style={{
              fontSize: '0.75rem',
              opacity: 0.7,
              marginLeft: '0.5rem'
            }}>
              {tab.time}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'patterns' && (
        <>
          <div className="section">
            <h2 className="section-title">🎯 The Aha! Moment: Pattern Recognition</h2>
            <p className="section-content">
              <strong>This is THE most valuable tab!</strong> Memorize these keyword → solution mappings.
              When you see these words in a problem, immediately know which window function to use.
            </p>

            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <th>Problem Keywords</th>
                    <th>Think Of...</th>
                    <th>SQL Pattern</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>
                      "top 3 per category"<br />
                      "best N in each group"<br />
                      "highest/lowest per X"
                    </td>
                    <td style={{ color: '#4CAF50', fontWeight: 600, fontSize: '1.05rem' }}>
                      ROW_NUMBER() + WHERE
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        ROW_NUMBER() OVER (<br />
                        &nbsp;&nbsp;PARTITION BY category<br />
                        &nbsp;&nbsp;ORDER BY value DESC<br />
                        ) AS rn<br />
                        WHERE rn &lt;= 3
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>
                      "compare to previous"<br />
                      "difference from last"<br />
                      "change since prior"<br />
                      "growth from last month"
                    </td>
                    <td style={{ color: '#2196F3', fontWeight: 600, fontSize: '1.05rem' }}>
                      LAG()
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        LAG(amount) OVER (<br />
                        &nbsp;&nbsp;PARTITION BY user_id<br />
                        &nbsp;&nbsp;ORDER BY date<br />
                        )
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>
                      "running total"<br />
                      "cumulative sum"<br />
                      "year-to-date"
                    </td>
                    <td style={{ color: '#FF9800', fontWeight: 600, fontSize: '1.05rem' }}>
                      SUM() OVER (ORDER BY)
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        SUM(amount) OVER (<br />
                        &nbsp;&nbsp;ORDER BY date<br />
                        )
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>
                      "rank teams"<br />
                      "assign ranking"<br />
                      "position by score"
                    </td>
                    <td style={{ color: '#E91E63', fontWeight: 600, fontSize: '1.05rem' }}>
                      RANK() or DENSE_RANK()
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        RANK() OVER (<br />
                        &nbsp;&nbsp;ORDER BY score DESC<br />
                        )
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>
                      "moving average"<br />
                      "last 7 days average"<br />
                      "rolling calculation"
                    </td>
                    <td style={{ color: '#795548', fontWeight: 600, fontSize: '1.05rem' }}>
                      AVG() with ROWS BETWEEN
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        AVG(amount) OVER (<br />
                        &nbsp;&nbsp;ORDER BY date<br />
                        &nbsp;&nbsp;ROWS BETWEEN 6 PRECEDING<br />
                        &nbsp;&nbsp;AND CURRENT ROW<br />
                        )
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section mt-2">
            <h3 className="section-title">When to Use: Window vs GROUP BY</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Use</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                    <td>Need row-by-row details + ranking</td>
                    <td><strong>Window Function</strong></td>
                    <td>Keeps all original rows</td>
                  </tr>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                    <td>"Top N per group"</td>
                    <td><strong>Window Function</strong></td>
                    <td>ROW_NUMBER() PARTITION BY</td>
                  </tr>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                    <td>Compare current vs previous row</td>
                    <td><strong>Window Function</strong></td>
                    <td>LAG/LEAD need full dataset</td>
                  </tr>
                  <tr style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                    <td>Only need summary totals</td>
                    <td><strong>GROUP BY</strong></td>
                    <td>Simpler, often faster</td>
                  </tr>
                  <tr style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                    <td>Count/sum per category</td>
                    <td><strong>GROUP BY</strong></td>
                    <td>Don't need individual rows</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <TryThis
            challenge="Write a query to find the top 3 highest-rated hotels in each city."
            hint="Think about: What window function ranks within groups?"
            solution={`WITH ranked AS (
    SELECT
        city,
        hotel_name,
        rating,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY rating DESC
        ) AS rn
    FROM hotels
)
SELECT city, hotel_name, rating
FROM ranked
WHERE rn <= 3
ORDER BY city, rn;`}
            explanation="✅ ROW_NUMBER() creates unique ranks within each city. PARTITION BY city separates rankings by city. ORDER BY rating DESC ranks from highest to lowest. WHERE rn <= 3 keeps only top 3 in each group."
          />
        </>
      )}

      {activeTab === 'basics' && (
        <>
          <RecallBox
            chapter="SQL Fundamentals"
            concept="GROUP BY collapses rows into groups (one row per group). Window functions keep all rows!"
          />

          <div className="section">
            <h2 className="section-title">The Concert Line Analogy</h2>
            <p className="section-content">
              Imagine people waiting in line for a concert. Each person (row) has a ticket number (ranking).
            </p>

            <div className="card" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
              <h3 className="card-title" style={{ color: '#4CAF50' }}>ROW_NUMBER() - Strict Order</h3>
              <p>Everyone gets a unique position: 1, 2, 3, 4, 5...</p>
              <p><strong>Even if two people arrive at the same time, one must be ahead of the other!</strong></p>
            </div>

            <div className="card mt-2" style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
              <h3 className="card-title" style={{ color: '#2196F3' }}>RANK() - Ties with Gaps</h3>
              <p>Twins arrive together → both get #1, but next person is #3 (skip #2)</p>
              <p><strong>Result: 1, 1, 3, 4</strong></p>
            </div>

            <div className="card mt-2" style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
              <h3 className="card-title" style={{ color: '#FF9800' }}>DENSE_RANK() - Ties No Gaps</h3>
              <p>Twins arrive together → both get #1, next person is #2 (no skip!)</p>
              <p><strong>Result: 1, 1, 2, 3</strong></p>
            </div>
          </div>

          <div className="section mt-2">
            <h3 className="section-title">Side-by-Side Comparison</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>hotel_name</th>
                    <th>rating</th>
                    <th>ROW_NUMBER()</th>
                    <th>RANK()</th>
                    <th>DENSE_RANK()</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Grand Palace</td>
                    <td style={{ fontWeight: 600 }}>4.8</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td>Beach Resort</td>
                    <td style={{ fontWeight: 600 }}>4.5</td>
                    <td>2</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>2</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>2</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td>City Center</td>
                    <td style={{ fontWeight: 600 }}>4.5</td>
                    <td>3 ← Still unique</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>2 ← Same as above</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>2 ← Same as above</td>
                  </tr>
                  <tr>
                    <td>Riverside Inn</td>
                    <td style={{ fontWeight: 600 }}>4.2</td>
                    <td>4</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>4 ← Skipped 3!</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>3 ← No skip</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section mt-2">
            <h3 className="section-title">Real Example: Top 3 Per City</h3>
            <CodeBlock code={`WITH ranked AS (
    SELECT
        city,
        hotel_name,
        rating,
        ROW_NUMBER() OVER (
            PARTITION BY city          -- Separate rankings per city
            ORDER BY rating DESC       -- Highest first
        ) AS rn
    FROM hotels
)
SELECT * FROM ranked
WHERE rn <= 3                         -- Top 3 in each city
ORDER BY city, rn;

-- Result:
-- city       | hotel_name      | rating | rn
-- Bangkok    | Grand Palace    | 4.8    | 1
-- Bangkok    | Riverside Inn   | 4.5    | 2
-- Bangkok    | City Center     | 4.2    | 3
-- Phuket     | Beach Resort    | 4.9    | 1
-- Phuket     | Sunset Villa    | 4.7    | 2
-- Phuket     | Ocean View      | 4.5    | 3`} />
          </div>

          <TryThis
            challenge="Find the 2 oldest users in each country (by signup_date)."
            hint="Think about: What should ORDER BY be? ASC or DESC?"
            solution={`WITH ranked AS (
    SELECT
        country,
        name,
        signup_date,
        ROW_NUMBER() OVER (
            PARTITION BY country
            ORDER BY signup_date ASC  -- Oldest first
        ) AS rn
    FROM users
)
SELECT country, name, signup_date
FROM ranked
WHERE rn <= 2;`}
            explanation="✅ ORDER BY signup_date ASC puts oldest first (earliest dates = smallest values). PARTITION BY country creates separate rankings per country."
          />
        </>
      )}

      {activeTab === 'lag-lead' && (
        <>
          <div className="section">
            <h2 className="section-title">LAG/LEAD - Access Other Rows</h2>

            <div className="alert alert-info">
              <strong>🎯 Use Case:</strong> "Compare current row to previous/next row"<br />
              Examples: month-over-month growth, booking gaps, price changes
            </div>

            <div className="card">
              <h3 className="card-title">LAG() - Look Backward</h3>
              <CodeBlock code={`SELECT
    booking_date,
    amount,
    LAG(amount) OVER (ORDER BY booking_date) AS prev_amount,
    amount - LAG(amount) OVER (ORDER BY booking_date) AS change
FROM bookings
WHERE user_id = 123;

-- Result:
-- booking_date | amount | prev_amount | change
-- 2024-01-15   | 1000   | NULL        | NULL (first row, no previous)
-- 2024-02-10   | 1500   | 1000        | 500
-- 2024-03-05   | 1200   | 1500        | -300`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">LEAD() - Look Forward</h3>
              <CodeBlock code={`SELECT
    booking_date,
    check_in_date,
    LEAD(booking_date) OVER (ORDER BY booking_date) AS next_booking,
    LEAD(booking_date) OVER (ORDER BY booking_date) - check_in_date AS gap_days
FROM bookings
WHERE user_id = 123;

-- Shows gap between check-out and next booking`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">With PARTITION BY - Per Group</h3>
              <CodeBlock code={`-- Monthly revenue growth per city
SELECT
    city,
    DATE_TRUNC('month', booking_date) AS month,
    SUM(amount) AS revenue,
    LAG(SUM(amount)) OVER (
        PARTITION BY city
        ORDER BY DATE_TRUNC('month', booking_date)
    ) AS prev_month_revenue,
    ROUND(
        100.0 * (SUM(amount) - LAG(SUM(amount)) OVER (
            PARTITION BY city
            ORDER BY DATE_TRUNC('month', booking_date)
        )) / LAG(SUM(amount)) OVER (
            PARTITION BY city
            ORDER BY DATE_TRUNC('month', booking_date)
        ),
        2
    ) AS growth_pct
FROM bookings
GROUP BY city, DATE_TRUNC('month', booking_date)
ORDER BY city, month;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">LAG with Default Value</h3>
              <CodeBlock code={`-- Avoid NULL for first row
SELECT
    booking_date,
    amount,
    LAG(amount, 1, 0) OVER (ORDER BY booking_date) AS prev_amount
    --           ↑  ↑
    --       offset  default value if NULL
FROM bookings;

-- LAG(column, offset, default)
-- offset: how many rows back (1 = previous, 2 = 2 rows back)
-- default: value to use if NULL (e.g., first row)`} />
            </div>
          </div>

          <TryThis
            challenge="Calculate the number of days between each user's bookings (booking_date gap)."
            hint="Think: Do you need LAG or LEAD? What should you subtract?"
            solution={`SELECT
    user_id,
    booking_date,
    LAG(booking_date) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS prev_booking_date,
    booking_date - LAG(booking_date) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS days_since_last_booking
FROM bookings
ORDER BY user_id, booking_date;`}
            explanation="✅ LAG gets previous booking_date per user. Subtracting dates gives the gap in days. PARTITION BY user_id keeps comparisons within same user."
          />
        </>
      )}

      {activeTab === 'running' && (
        <>
          <div className="section">
            <h2 className="section-title">Running Totals - Cumulative Calculations</h2>

            <div className="alert alert-info">
              <strong>🎯 Use Case:</strong> "Show cumulative total" or "running sum"<br />
              Examples: year-to-date revenue, total bookings so far, cumulative growth
            </div>

            <div className="card">
              <h3 className="card-title">Basic Running Total</h3>
              <CodeBlock code={`SELECT
    booking_date,
    amount,
    SUM(amount) OVER (ORDER BY booking_date) AS running_total
FROM bookings;

-- Result:
-- booking_date | amount | running_total
-- 2024-01-01   | 100    | 100
-- 2024-01-02   | 150    | 250  (100 + 150)
-- 2024-01-03   | 200    | 450  (100 + 150 + 200)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Running Total Per Group</h3>
              <CodeBlock code={`-- Running total per user
SELECT
    user_id,
    booking_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS user_running_total
FROM bookings
ORDER BY user_id, booking_date;

-- Each user's running total starts at 0 and accumulates separately`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Daily Revenue + Running Total</h3>
              <CodeBlock code={`SELECT
    booking_date,
    SUM(amount) AS daily_revenue,
    SUM(SUM(amount)) OVER (ORDER BY booking_date) AS ytd_revenue
FROM bookings
GROUP BY booking_date
ORDER BY booking_date;

-- Note: SUM(SUM(amount))
-- Inner SUM: aggregates per day (GROUP BY)
-- Outer SUM: running total across days (window)`} />
            </div>
          </div>

          <TryThis
            challenge="Show each booking with its amount and the user's total spent so far (up to and including that booking)."
            hint="Running total per user, ordered by booking date"
            solution={`SELECT
    user_id,
    booking_id,
    booking_date,
    amount,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS total_spent_so_far
FROM bookings
ORDER BY user_id, booking_date;`}
            explanation="✅ SUM() OVER with ORDER BY creates cumulative sum. PARTITION BY user_id makes it per-user. Each row shows total spent up to that point."
          />
        </>
      )}

      {activeTab === 'frames' && (
        <>
          <div className="section">
            <h2 className="section-title">Window Frames - Moving Averages</h2>

            <div className="alert alert-info">
              <strong>🎯 Use Case:</strong> "Last 7 days average" or "moving average"<br />
              Define exactly which rows to include in calculation
            </div>

            <div className="card">
              <h3 className="card-title">ROWS BETWEEN Syntax</h3>
              <CodeBlock code={`FUNCTION() OVER (
    ORDER BY date
    ROWS BETWEEN <start> AND <end>
)

-- <start> and <end> can be:
-- UNBOUNDED PRECEDING  - From very first row
-- N PRECEDING          - N rows before current
-- CURRENT ROW          - The current row
-- N FOLLOWING          - N rows after current
-- UNBOUNDED FOLLOWING  - To very last row`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">7-Day Moving Average</h3>
              <CodeBlock code={`SELECT
    booking_date,
    amount,
    AVG(amount) OVER (
        ORDER BY booking_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS last_7_days_avg
FROM bookings;

-- Includes: current row + 6 rows before = 7 total
-- Each row shows average of that day + previous 6 days`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Common Frame Patterns</h3>
              <CodeBlock code={`-- Running total (default behavior)
SUM(amount) OVER (ORDER BY date)
-- Same as: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW

-- Last 3 rows average
AVG(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
)

-- Centered moving average (previous + current + next)
AVG(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
)

-- Last 30 days sum
SUM(amount) OVER (
    ORDER BY date
    ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
)`} />
            </div>
          </div>

          <TryThis
            challenge="Calculate a 3-day moving average of booking amounts."
            hint="Current day + 2 days before = 3 days total"
            solution={`SELECT
    booking_date,
    amount,
    AVG(amount) OVER (
        ORDER BY booking_date
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) AS moving_avg_3day
FROM bookings
ORDER BY booking_date;`}
            explanation="✅ 2 PRECEDING + CURRENT ROW = 3 rows total. AVG calculates average of these 3 values for each row."
          />
        </>
      )}

      {activeTab === 'gotchas' && (
        <>
          <div className="section">
            <h2 className="section-title">⚠️ Common Window Function Gotchas</h2>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                ❌ Gotcha #1: Can't Use in WHERE
              </h3>
              <CodeBlock code={`-- ❌ WRONG: Window functions not allowed in WHERE
SELECT
    hotel_name,
    ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC) AS rn
FROM hotels
WHERE rn <= 3;  -- ERROR!

-- ✅ RIGHT: Use CTE or subquery
WITH ranked AS (
    SELECT
        hotel_name,
        ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC) AS rn
    FROM hotels
)
SELECT * FROM ranked
WHERE rn <= 3;  -- Works!`} />
              <p>
                <strong>Why:</strong> WHERE runs before SELECT. Window functions are calculated during SELECT.
                By the time WHERE runs, 'rn' doesn't exist yet!
              </p>
            </div>

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                ❌ Gotcha #2: PARTITION BY ≠ GROUP BY
              </h3>
              <CodeBlock code={`-- They look similar but are VERY different!

-- GROUP BY: Collapses rows
SELECT city, COUNT(*) AS total
FROM hotels
GROUP BY city;
-- Result: 1 row per city (Bangkok: 50 hotels)

-- PARTITION BY: Keeps all rows
SELECT city, hotel_name,
       COUNT(*) OVER (PARTITION BY city) AS city_total
FROM hotels;
-- Result: 50 rows for Bangkok hotels, each showing total=50`} />
              <p>
                <strong>Rule:</strong> PARTITION BY divides data for window calculations but keeps every row.
                GROUP BY combines rows into summary.
              </p>
            </div>

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--warning)' }}>
              <h3 className="card-title" style={{ color: 'var(--warning)' }}>
                ⚠️ Gotcha #3: ORDER BY Matters!
              </h3>
              <CodeBlock code={`-- Different ORDER BY = Different rankings!

-- Highest rating first
ROW_NUMBER() OVER (ORDER BY rating DESC)  -- 4.8, 4.5, 4.2...

-- Lowest rating first
ROW_NUMBER() OVER (ORDER BY rating ASC)   -- 3.2, 3.5, 4.0...

-- By date (oldest first)
ROW_NUMBER() OVER (ORDER BY booking_date ASC)

-- Common mistake: Forgetting ORDER BY
ROW_NUMBER() OVER (PARTITION BY city)  -- ❌ Unpredictable order!
ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC)  -- ✅ Clear order`} />
            </div>

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--warning)' }}>
              <h3 className="card-title" style={{ color: 'var(--warning)' }}>
                ⚠️ Gotcha #4: Performance on Large Tables
              </h3>
              <p>
                <strong>Window functions can be slow on huge tables:</strong>
              </p>
              <ul>
                <li>ROW_NUMBER() with large PARTITION BY = expensive</li>
                <li>LAG/LEAD need to sort entire partition</li>
                <li>Moving averages process many rows per calculation</li>
              </ul>
              <p>
                <strong>Optimization tips:</strong>
              </p>
              <ul>
                <li>Filter with WHERE <em>before</em> window function (use CTE)</li>
                <li>Index columns in ORDER BY clause</li>
                <li>LIMIT results after window calculation</li>
                <li>For simple "top N", sometimes subquery is faster</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <KeyTakeaways
        points={[
          'Window functions keep all rows (GROUP BY collapses)',
          'Pattern: "top N per group" → ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)',
          'LAG/LEAD for comparing current row to previous/next',
          'Running totals: SUM() OVER (ORDER BY date)',
          'Moving averages: ROWS BETWEEN N PRECEDING AND CURRENT ROW',
          "Can't use window functions in WHERE - use CTE instead",
          'PARTITION BY divides data but keeps every row'
        ]}
        nextChapter="Read '🎯 Interview Patterns & Strategy' to apply window functions in tests"
        relatedChapters="'📊 GROUP BY' for when you need summary only (no row details)"
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
