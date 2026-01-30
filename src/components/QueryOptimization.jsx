import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function QueryOptimization({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('intro')

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🚀 Query Performance & Optimization</h1>
        <p className="chapter-subtitle">Make it FAST (HackerRank tests have timeouts!)</p>
      </div>

      <div className="alert alert-warning">
        <strong>⚡ WHY THIS MATTERS FOR YOUR TEST:</strong><br />
        HackerRank has test cases with large datasets. Slow queries = TIMEOUT = 0 points!<br />
        Also, Agoda job description mentions "optimized queries on large datasets" twice!
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => setActiveTab('intro')}>
          ⚡ Fast vs Slow
        </button>
        <button className={`tab ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>
          ✅ Quick Checklist
        </button>
        <button className={`tab ${activeTab === 'antipatterns' ? 'active' : ''}`} onClick={() => setActiveTab('antipatterns')}>
          💣 Anti-Patterns
        </button>
        <button className={`tab ${activeTab === 'tricks' ? 'active' : ''}`} onClick={() => setActiveTab('tricks')}>
          🎯 Quick Wins
        </button>
        <button className={`tab ${activeTab === 'when' ? 'active' : ''}`} onClick={() => setActiveTab('when')}>
          🤔 When to Use What
        </button>
      </div>

      {activeTab === 'intro' && (
        <div className="section">
          <h2 className="section-title">⚡ The Speed Hierarchy</h2>

          <div className="card">
            <h3 className="card-title">🏎️ Imagine This Scenario</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--danger)' }}>Your query:</strong> Takes 45 seconds on 100M rows<br />
              <strong style={{ color: 'var(--warning)' }}>HackerRank timeout:</strong> 10 seconds<br />
              <strong style={{ color: 'var(--danger)' }}>Result:</strong> ❌ TIMEOUT → 0 points<br />
              <br />
              <strong style={{ color: 'var(--success)' }}>Optimized query:</strong> Takes 2 seconds<br />
              <strong style={{ color: 'var(--success)' }}>Result:</strong> ✅ PASS → Full points!<br />
              <br />
              <strong>Same logic, just written smarter!</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">📊 Performance Hierarchy (Fastest → Slowest)</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Speed</th>
                    <th>What It Is</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
                    <td><strong style={{ color: 'var(--success)' }}>⚡⚡⚡ FASTEST</strong></td>
                    <td>Index lookup</td>
                    <td><code className="inline-code">WHERE user_id = 123</code> (if indexed)</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td><strong style={{ color: 'var(--success)' }}>⚡⚡ FAST</strong></td>
                    <td>Index scan + LIMIT</td>
                    <td><code className="inline-code">ORDER BY date LIMIT 10</code> (date indexed)</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td><strong style={{ color: 'var(--warning)' }}>🐌 SLOWER</strong></td>
                    <td>Full table scan</td>
                    <td><code className="inline-code">WHERE country = 'TH'</code> (not indexed)</td>
                  </tr>
                  <tr style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <td><strong style={{ color: 'var(--danger)' }}>🐢 SLOW</strong></td>
                    <td>Function on column</td>
                    <td><code className="inline-code">WHERE YEAR(date) = 2024</code> (kills index!)</td>
                  </tr>
                  <tr style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                    <td><strong style={{ color: 'var(--danger)' }}>🐌💀 SLOWEST</strong></td>
                    <td>Cartesian join</td>
                    <td><code className="inline-code">FROM a, b</code> (no ON condition!)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 The Big Idea:</strong><br />
            Think of a database like a library:<br />
            <br />
            <strong>Index =</strong> Card catalog (find books instantly by title/author)<br />
            <strong>Full scan =</strong> Read EVERY book to find what you want<br />
            <br />
            Which would you prefer? 📚
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="section">
          <h2 className="section-title">✅ Pre-Submit Checklist</h2>

          <div className="alert alert-success">
            <strong>🎯 Before hitting "Submit" on HackerRank:</strong><br />
            Run through this 30-second checklist!
          </div>

          <div className="card mt-2">
            <h3 className="card-title">1. Are you SELECT-ing only what you need?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>❌ BAD (slow!)</h4>
                <CodeBlock code={`SELECT *
FROM bookings
WHERE status = 'completed';
-- Pulls ALL columns
-- Even huge ones you don't need!`} />
              </div>
              <div>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>✅ GOOD (fast!)</h4>
                <CodeBlock code={`SELECT booking_id, user_id, amount
FROM bookings
WHERE status = 'completed';
-- Only the 3 columns needed
-- Less I/O = faster!`} />
              </div>
            </div>
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              <strong>Impact:</strong> Can be 2-5x faster on wide tables!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">2. Are you filtering EARLY?</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>❌ BAD</h4>
                <CodeBlock code={`-- Joins ALL rows, then filters
SELECT h.name, b.amount
FROM hotels h
JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE b.booking_date >= '2024-01-01';
-- 100M bookings → 50M after filter`} />
              </div>
              <div>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>✅ GOOD</h4>
                <CodeBlock code={`-- Filters FIRST, then joins
SELECT h.name, b.amount
FROM hotels h
JOIN (
    SELECT * FROM bookings
    WHERE booking_date >= '2024-01-01'
) b ON h.hotel_id = b.hotel_id;
-- Filter to 5M rows, THEN join`} />
              </div>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">3. Avoid functions on indexed columns in WHERE</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--danger)', marginBottom: '0.75rem' }}>❌ KILLS INDEX</h4>
                <CodeBlock code={`WHERE YEAR(booking_date) = 2024
-- Function wraps column
-- Index can't be used!
-- Full scan of 100M rows 🐢`} />
              </div>
              <div>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>✅ USES INDEX</h4>
                <CodeBlock code={`WHERE booking_date >= '2024-01-01'
  AND booking_date < '2025-01-01'
-- No function on column
-- Index works perfectly!
-- Scans only 2024 rows ⚡`} />
              </div>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">4. Use IN instead of multiple OR</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--warning)', marginBottom: '0.75rem' }}>⚠️ SLOWER</h4>
                <CodeBlock code={`WHERE status = 'completed'
   OR status = 'confirmed'
   OR status = 'pending'
-- Harder for optimizer`} />
              </div>
              <div>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.75rem' }}>✅ FASTER</h4>
                <CodeBlock code={`WHERE status IN (
    'completed',
    'confirmed',
    'pending'
)
-- Optimizer loves this!`} />
              </div>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">5. Check your JOIN order</h3>
            <CodeBlock code={`-- Start with smallest table, join to larger
-- If hotels (10K rows) and bookings (100M rows):

-- ✅ GOOD: Small → Large
FROM hotels h
JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE h.country = 'TH'  -- Filters hotels to 100 rows first!

-- Less ideal: Large → Small
FROM bookings b
JOIN hotels h ON b.hotel_id = h.hotel_id
WHERE h.country = 'TH'  -- Has to check 100M bookings first`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>🎯 Quick Memory Aid:</strong><br />
            <br />
            ✅ SELECT only what you need<br />
            ✅ WHERE before JOIN when possible<br />
            ✅ No functions on indexed columns in WHERE<br />
            ✅ Use IN instead of multiple OR<br />
            ✅ Start with smallest table
          </div>
        </div>
      )}

      {activeTab === 'antipatterns' && (
        <div className="section">
          <h2 className="section-title">💣 Common Anti-Patterns (Avoid These!)</h2>

          <div className="alert alert-warning">
            <strong>⚠️ These will KILL your performance in HackerRank!</strong>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">💣 Anti-Pattern #1: Correlated Subquery in SELECT</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--danger)' }}>The Problem:</strong> Runs the subquery ONCE PER ROW!<br />
              If you have 100K users, the subquery runs 100K times! 🐌
            </p>

            <CodeBlock code={`-- ❌ TERRIBLE: Runs subquery for EVERY user!
SELECT
    u.user_id,
    u.email,
    (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.user_id) AS booking_count
FROM users u;
-- If 100K users → subquery runs 100K times!

-- ✅ GOOD: One JOIN, done!
SELECT
    u.user_id,
    u.email,
    COUNT(b.booking_id) AS booking_count
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
GROUP BY u.user_id, u.email;
-- Runs once, uses indexes`} />

            <p className="mt-1" style={{ color: 'var(--success)' }}>
              <strong>Speed improvement:</strong> Can be 100-1000x faster!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">💣 Anti-Pattern #2: SELECT DISTINCT to Fix Duplicates</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--warning)' }}>The Symptom:</strong> "My query returns duplicates... I'll add DISTINCT!"<br />
              <strong style={{ color: 'var(--danger)' }}>The Problem:</strong> DISTINCT is a band-aid hiding a real issue!
            </p>

            <CodeBlock code={`-- ❌ BAD: Using DISTINCT to hide bad JOIN
SELECT DISTINCT u.email
FROM users u
JOIN bookings b ON u.user_id = b.user_id;
-- If user has 10 bookings, their email appears 10 times
-- DISTINCT has to sort/dedupe → SLOW!

-- ✅ GOOD: Fix the actual problem
-- Option 1: If you just need users who booked
SELECT DISTINCT u.email
FROM users u
WHERE EXISTS (SELECT 1 FROM bookings WHERE user_id = u.user_id);

-- Option 2: If you need aggregation
SELECT u.email, COUNT(*) AS booking_count
FROM users u
JOIN bookings b ON u.user_id = b.user_id
GROUP BY u.email;`} />

            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              <strong>Rule:</strong> If you need DISTINCT, ask "Why am I getting duplicates?" first!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">💣 Anti-Pattern #3: Multiple Passes for Aggregates</h3>

            <CodeBlock code={`-- ❌ BAD: Scanning table 3 times!
SELECT AVG(amount) FROM bookings WHERE country = 'TH';
SELECT MAX(amount) FROM bookings WHERE country = 'TH';
SELECT MIN(amount) FROM bookings WHERE country = 'TH';
-- 3 separate full scans!

-- ✅ GOOD: One scan, get everything!
SELECT
    AVG(amount) AS avg_amount,
    MAX(amount) AS max_amount,
    MIN(amount) AS min_amount
FROM bookings
WHERE country = 'TH';
-- Single scan, all results!`} />

            <p className="mt-1" style={{ color: 'var(--success)' }}>
              <strong>Speed improvement:</strong> 3x faster (one scan vs three)
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">💣 Anti-Pattern #4: Wrong Tool for the Job</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Use Case</th>
                    <th>❌ Slow</th>
                    <th>✅ Fast</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>"Check if exists"</td>
                    <td><code className="inline-code">COUNT(*) > 0</code></td>
                    <td><code className="inline-code">EXISTS</code> (stops at first match)</td>
                  </tr>
                  <tr>
                    <td>"Check if NOT exists"</td>
                    <td><code className="inline-code">LEFT JOIN + COUNT</code></td>
                    <td><code className="inline-code">NOT EXISTS</code></td>
                  </tr>
                  <tr>
                    <td>"Filter by subquery (small list)"</td>
                    <td><code className="inline-code">EXISTS</code></td>
                    <td><code className="inline-code">IN (...)</code> (if truly small)</td>
                  </tr>
                  <tr>
                    <td>"Filter by subquery (large)"</td>
                    <td><code className="inline-code">IN</code></td>
                    <td><code className="inline-code">EXISTS</code> (stops early)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-danger mt-2">
            <strong>🚨 Red Flags in Your Query:</strong><br />
            <br />
            • Subquery in SELECT with correlation → Use JOIN/window function<br />
            • DISTINCT everywhere → Fix your JOINs<br />
            • Multiple queries for same table → Combine them<br />
            • COUNT(*) to check existence → Use EXISTS<br />
            • OR with many conditions → Use IN
          </div>
        </div>
      )}

      {activeTab === 'tricks' && (
        <div className="section">
          <h2 className="section-title">🎯 Quick Performance Wins</h2>

          <div className="card">
            <h3 className="card-title">⚡ Trick #1: LIMIT Early</h3>
            <p>If you only need first N rows, tell the database ASAP!</p>

            <CodeBlock code={`-- Find 10 recent bookings
SELECT * FROM bookings
ORDER BY booking_date DESC
LIMIT 10;
-- Database can stop after finding 10!

-- Even better with indexed ORDER BY column:
-- Uses index scan, stops at 10 → SUPER FAST ⚡`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">⚡ Trick #2: Use Integer Division Carefully</h3>
            <p style={{ color: 'var(--danger)' }}>
              <strong>Gotcha:</strong> Integer math gives wrong results AND can be slower!
            </p>

            <CodeBlock code={`-- ❌ WRONG + SLOW
SELECT 100 * (conversions / searches) AS conversion_rate
-- Integer division: 50/100 = 0, then 100 * 0 = 0!

-- ✅ RIGHT + FAST
SELECT 100.0 * conversions / searches AS conversion_rate
-- 100.0 makes it decimal: 50/100.0 = 0.5, then 100.0 * 0.5 = 50

-- Even better: avoid division altogether if possible!
SELECT ROUND(100.0 * SUM(converted) / COUNT(*), 2) AS conv_rate`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">⚡ Trick #3: Avoid LIKE with Leading Wildcard</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <h4 style={{ color: 'var(--danger)' }}>❌ KILLS INDEX</h4>
                <CodeBlock code={`WHERE email LIKE '%@gmail.com'
-- Leading % = can't use index
-- Full scan required!`} />
              </div>
              <div>
                <h4 style={{ color: 'var(--success)' }}>✅ CAN USE INDEX</h4>
                <CodeBlock code={`WHERE email LIKE 'john%'
-- No leading %
-- Index can help!`} />
              </div>
            </div>

            <p className="mt-1">
              <strong>If you MUST search middle of string:</strong> Consider full-text search or different approach
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">⚡ Trick #4: COALESCE for Performance</h3>

            <CodeBlock code={`-- Sometimes COALESCE is faster than OR
-- ❌ SLOWER (multiple index lookups)
WHERE phone = '123456' OR email = '123456'

-- ✅ If you know which field is more likely:
WHERE phone = '123456'
UNION ALL
SELECT ... WHERE email = '123456' AND phone IS NULL;
-- Tries phone first (fast), only checks email if needed

-- Or use COALESCE for default values to avoid NULLs:
ORDER BY COALESCE(last_booking_date, '1900-01-01') DESC
-- Avoids NULL handling overhead`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">⚡ Trick #5: Batch Your CTEs</h3>

            <CodeBlock code={`-- ✅ GOOD: Calculate once, use many times
WITH stats AS (
    SELECT
        user_id,
        COUNT(*) AS total_bookings,
        SUM(amount) AS total_spent,
        AVG(amount) AS avg_booking,
        MAX(booking_date) AS last_booking
    FROM bookings
    GROUP BY user_id
)
SELECT * FROM stats WHERE total_spent > 1000;
-- One pass through data, calculate everything!

-- ❌ BAD: Multiple CTEs doing similar work
WITH booking_counts AS (SELECT user_id, COUNT(*) FROM bookings GROUP BY user_id),
     booking_sums AS (SELECT user_id, SUM(amount) FROM bookings GROUP BY user_id)
-- Scans bookings table TWICE!`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>💪 Quick Wins Summary:</strong><br />
            <br />
            ✅ LIMIT early when you can<br />
            ✅ Use 100.0 (decimal) not 100 (integer) for percentages<br />
            ✅ Avoid leading % in LIKE<br />
            ✅ Combine multiple aggregates in one CTE<br />
            ✅ EXISTS instead of COUNT(*) > 0
          </div>
        </div>
      )}

      {activeTab === 'when' && (
        <div className="section">
          <h2 className="section-title">🤔 When to Use What?</h2>

          <div className="card">
            <h3 className="card-title">IN vs EXISTS vs JOIN</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Use This</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Small, static list (2-10 values)</td>
                    <td><code className="inline-code">WHERE status IN ('completed', 'confirmed')</code></td>
                    <td>Simple, readable, fast</td>
                  </tr>
                  <tr>
                    <td>Check if relationship exists</td>
                    <td><code className="inline-code">WHERE EXISTS (SELECT 1 FROM...)</code></td>
                    <td>Stops at first match (fastest)</td>
                  </tr>
                  <tr>
                    <td>Need columns from both tables</td>
                    <td><code className="inline-code">JOIN</code></td>
                    <td>Only way to get both sides</td>
                  </tr>
                  <tr>
                    <td>Large subquery list (10K+ values)</td>
                    <td><code className="inline-code">EXISTS</code> or <code className="inline-code">JOIN</code></td>
                    <td>IN builds full list in memory</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock code={`-- Check if user has any bookings:
-- ✅ FASTEST
WHERE EXISTS (SELECT 1 FROM bookings WHERE user_id = u.user_id)

-- ❌ SLOWER (has to count ALL bookings)
WHERE (SELECT COUNT(*) FROM bookings WHERE user_id = u.user_id) > 0

-- Also fast:
WHERE user_id IN (SELECT DISTINCT user_id FROM bookings)
-- But EXISTS stops earlier!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Subquery vs CTE vs JOIN</h3>

            <CodeBlock code={`-- Scenario: Filter users by booking total

-- ✅ Use CTE when: Logic is complex or reused
WITH user_totals AS (
    SELECT user_id, SUM(amount) AS total
    FROM bookings
    GROUP BY user_id
)
SELECT u.email, ut.total
FROM users u
JOIN user_totals ut ON u.user_id = ut.user_id
WHERE ut.total > 5000;
-- Clear, readable, can reuse user_totals

-- ✅ Use subquery when: One-time, simple filter
SELECT email
FROM users
WHERE user_id IN (
    SELECT user_id FROM bookings
    GROUP BY user_id
    HAVING SUM(amount) > 5000
);
-- Inline, no intermediate names

-- ✅ Use JOIN when: Need data from both tables
SELECT u.email, b.amount
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE b.amount > 1000;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Window Function vs GROUP BY</h3>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Need</th>
                    <th>Use</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Keep all individual rows</td>
                    <td>Window Function</td>
                    <td>Show each booking with user's total</td>
                  </tr>
                  <tr>
                    <td>One summary row per group</td>
                    <td>GROUP BY</td>
                    <td>Total bookings per user</td>
                  </tr>
                  <tr>
                    <td>Ranking/numbering</td>
                    <td>Window Function</td>
                    <td>ROW_NUMBER, RANK</td>
                  </tr>
                  <tr>
                    <td>Running totals</td>
                    <td>Window Function</td>
                    <td>Cumulative revenue by date</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-info mt-2">
            <strong>🎯 Decision Flowchart:</strong><br />
            <br />
            <strong>Q:</strong> Do I need all individual rows?<br />
            └─ Yes → Window function<br />
            └─ No → GROUP BY<br />
            <br />
            <strong>Q:</strong> Just checking if relationship exists?<br />
            └─ Yes → EXISTS<br />
            └─ No, need actual data → JOIN<br />
            <br />
            <strong>Q:</strong> Is this logic used multiple times?<br />
            └─ Yes → CTE<br />
            └─ No → Inline subquery
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
