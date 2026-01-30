import { useState } from 'react'

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
      </div>

      {activeTab === 'order' && (
        <div className="section">
          <h2 className="section-title">⚠️ THE Most Important Concept</h2>
          <div className="alert alert-warning">
            <strong>Writing Order ≠ Execution Order</strong><br />
            Memorize this. It explains 80% of SQL "weird" behavior!
          </div>

          <div className="code-block mt-2">
            <pre><code>{`YOU WRITE:              DATABASE RUNS:
───────────             ───────────────
1. SELECT               1. FROM        ← Pick tables
2. FROM                 2. JOIN        ← Combine tables
3. JOIN                 3. WHERE       ← Filter rows
4. WHERE                4. GROUP BY    ← Collapse into groups
5. GROUP BY             5. HAVING      ← Filter groups
6. HAVING               6. SELECT      ← Create columns/aliases
7. ORDER BY             7. ORDER BY    ← Sort
8. LIMIT                8. LIMIT       ← Cut off`}</code></pre>
          </div>

          <div className="section mt-2">
            <h3 className="section-title">Why This Matters</h3>
            <div className="code-block">
              <pre><code>{`-- ❌ FAILS: Alias doesn't exist when WHERE runs
SELECT user_id, SUM(amount) AS total
FROM bookings
WHERE total > 1000    -- ERROR! SELECT hasn't run yet
GROUP BY user_id;

-- ✅ WORKS: HAVING runs after GROUP BY
SELECT user_id, SUM(amount) AS total
FROM bookings
GROUP BY user_id
HAVING SUM(amount) > 1000;`}</code></pre>
            </div>
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

          <div className="code-block mt-2">
            <pre><code>{`-- Grain: ONE ROW = ONE BOOKING
SELECT * FROM bookings;

-- Grain: ONE ROW = ONE USER
SELECT user_id, SUM(amount) FROM bookings GROUP BY user_id;

-- Grain: ONE ROW = ONE USER-HOTEL COMBINATION
SELECT user_id, hotel_id, COUNT(*)
FROM bookings
GROUP BY user_id, hotel_id;`}</code></pre>
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
            <div className="code-block">
              <pre><code>{`SELECT user_id, email, amount * 1.1 AS amount_with_tax`}</code></pre>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">2. FROM / JOIN — What tables</h3>
            <div className="code-block">
              <pre><code>{`FROM bookings b
JOIN users u ON b.user_id = u.user_id`}</code></pre>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">3. WHERE — Filter rows BEFORE grouping</h3>
            <div className="code-block">
              <pre><code>{`WHERE status = 'completed' AND amount > 100`}</code></pre>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">4. GROUP BY — Collapse rows</h3>
            <div className="code-block">
              <pre><code>{`GROUP BY user_id    -- Now one row per user`}</code></pre>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">5. HAVING — Filter groups AFTER grouping</h3>
            <div className="code-block">
              <pre><code>{`HAVING COUNT(*) >= 5 AND SUM(amount) > 1000`}</code></pre>
            </div>
          </div>

          <div className="card">
            <h3 className="card-title">6. ORDER BY / LIMIT — Sort and cut</h3>
            <div className="code-block">
              <pre><code>{`ORDER BY total DESC LIMIT 10`}</code></pre>
            </div>
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
