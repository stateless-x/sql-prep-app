import { useState } from 'react'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'

export default function SQLReference({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('patterns')

  const tabs = [
    { id: 'patterns', label: '🔍 Pattern Matching', time: '3 min' },
    { id: 'text', label: '🔎 Text & Filtering', time: '4 min' },
    { id: 'strings', label: '📝 String Functions', time: '4 min' },
    { id: 'dates', label: '📅 Date/Time', time: '5 min' },
    { id: 'conditional', label: '🎛️ CASE & Conditionals', time: '4 min' },
    { id: 'types', label: '🔄 Type Conversion', time: '3 min' },
    { id: 'sets', label: '🔗 Set Operations', time: '3 min' },
    { id: 'pagination', label: '📄 Pagination', time: '3 min' },
    { id: 'performance', label: '⚡ Performance Quick Ref', time: '3 min' },
    { id: 'checklist', label: '✅ Pre-Submit Checklist', time: '3 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📋 SQL Reference & Cheatsheet</h1>
        <p className="chapter-subtitle">Your go-to quick reference guide</p>
      </div>

      <LearningObjectives
        objectives={[
          'Quick pattern matching for interview problems',
          'Essential SQL syntax for daily development',
          'Performance optimization quick wins',
          'Pre-submit checklist to avoid mistakes'
        ]}
        time="35 min (pick what you need)"
      />

      <TLDRBox
        points={[
          'Pattern Matching: See keyword → know solution',
          'Daily Functions: LIKE, CONCAT, DATE_TRUNC, CASE WHEN',
          'Performance: Filter early, use LIMIT, avoid SELECT *',
          'Before Submit: Check columns, aggregates, NULLs, ORDER BY'
        ]}
      />

      <div className="alert alert-info">
        <strong>💡 How to Use This Chapter:</strong><br />
        This is a reference guide, not a learning chapter. Bookmark it!<br />
        • During study: Look up syntax you forgot<br />
        • During test: Quick pattern matching refresher<br />
        • At work: Daily SQL function reference
      </div>

      <div className="tabs" style={{ overflowX: 'auto', flexWrap: 'wrap' }}>
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
            <h2 className="section-title">🎯 When You See This... Think This!</h2>
            <p className="section-content">
              <strong>Memorize these keyword → solution mappings for interviews!</strong>
            </p>

            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <th>Problem Keywords</th>
                    <th>SQL Solution</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"top 3 per category"<br />"best N in each group"</td>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>
                      ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ... DESC)<br />
                      + WHERE rn &lt;= 3
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"compare to previous"<br />"difference from last"</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>
                      LAG() OVER (PARTITION BY ... ORDER BY ...)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"running total"<br />"cumulative sum"</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>
                      SUM() OVER (ORDER BY ...)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"rank teams"<br />"assign ranking"</td>
                    <td style={{ color: '#E91E63', fontWeight: 600 }}>
                      RANK() or DENSE_RANK() OVER (ORDER BY ...)
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"total per category"<br />"count by group"</td>
                    <td style={{ color: '#9C27B0', fontWeight: 600 }}>
                      GROUP BY + SUM/COUNT/AVG
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"users who never"<br />"find missing"</td>
                    <td style={{ color: '#00BCD4', fontWeight: 600 }}>
                      LEFT JOIN + WHERE right.id IS NULL
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"percentage of total"<br />"share of revenue"</td>
                    <td style={{ color: '#FF5722', fontWeight: 600 }}>
                      100.0 * value / SUM(value) OVER ()
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"moving average"<br />"last 7 days"</td>
                    <td style={{ color: '#795548', fontWeight: 600 }}>
                      AVG() OVER (ORDER BY ... ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section mt-2">
            <h3 className="section-title">Common Pattern Templates</h3>

            <div className="card">
              <h4 className="card-title" style={{ color: '#4CAF50' }}>Top N per Group</h4>
              <CodeBlock code={`WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY category_column
               ORDER BY value_column DESC
           ) AS rn
    FROM your_table
)
SELECT * FROM ranked WHERE rn <= 3;`} />
            </div>

            <div className="card mt-2">
              <h4 className="card-title" style={{ color: '#2196F3' }}>Find Missing Records</h4>
              <CodeBlock code={`SELECT a.*
FROM left_table a
LEFT JOIN right_table b ON a.id = b.id
WHERE b.id IS NULL;`} />
            </div>

            <div className="card mt-2">
              <h4 className="card-title" style={{ color: '#FF9800' }}>Running Total</h4>
              <CodeBlock code={`SELECT date, amount,
       SUM(amount) OVER (
           PARTITION BY user_id
           ORDER BY date
       ) AS running_total
FROM transactions;`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'text' && (
        <>
          <div className="section">
            <h2 className="section-title">🔍 Text Search & Filtering</h2>

            <div className="card">
              <h3 className="card-title">LIKE Patterns</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Pattern</th>
                      <th>Matches</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>'%@gmail.com'</code></td>
                      <td>Ends with</td>
                      <td>Gmail users</td>
                    </tr>
                    <tr>
                      <td><code>'John%'</code></td>
                      <td>Starts with</td>
                      <td>Names starting with John</td>
                    </tr>
                    <tr>
                      <td><code>'%van%'</code></td>
                      <td>Contains</td>
                      <td>Names with 'van' anywhere</td>
                    </tr>
                    <tr>
                      <td><code>'BKK_____'</code></td>
                      <td>Exact pattern</td>
                      <td>BKK + 5 characters</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock code={`-- Gmail users
WHERE email LIKE '%@gmail.com'

-- Case-insensitive (PostgreSQL)
WHERE email ILIKE '%GMAIL.COM'

-- Case-insensitive (MySQL/others)
WHERE LOWER(email) LIKE '%@gmail.com'`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">IN - Multiple Values</h3>
              <CodeBlock code={`-- Countries
WHERE country IN ('Thailand', 'Singapore', 'Malaysia')

-- Much cleaner than:
WHERE country = 'Thailand' OR country = 'Singapore' OR country = 'Malaysia'

-- With subquery
WHERE user_id IN (SELECT user_id FROM bookings)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">BETWEEN - Ranges</h3>
              <CodeBlock code={`-- Date range (inclusive on both ends)
WHERE booking_date BETWEEN '2024-01-01' AND '2024-12-31'

-- Price range
WHERE price BETWEEN 1000 AND 5000

-- NOT BETWEEN
WHERE star_rating NOT BETWEEN 1 AND 3  -- Only 4-5 stars`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">IS NULL / IS NOT NULL</h3>
              <CodeBlock code={`-- Find users without phone
WHERE phone IS NULL

-- Find bookings with reviews
WHERE review_text IS NOT NULL

-- ❌ WRONG: = NULL doesn't work!
WHERE phone = NULL     -- Returns nothing

-- ✅ RIGHT
WHERE phone IS NULL`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'strings' && (
        <>
          <div className="section">
            <h2 className="section-title">📝 String Functions</h2>

            <div className="card">
              <h3 className="card-title">CONCAT - Join Strings</h3>
              <CodeBlock code={`-- Full name
SELECT CONCAT(first_name, ' ', last_name) AS full_name

-- Location
SELECT CONCAT(city, ', ', country) AS location

-- PostgreSQL: || operator
SELECT first_name || ' ' || last_name

-- MySQL: CONCAT_WS (with separator)
SELECT CONCAT_WS(', ', city, country)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">SUBSTRING - Extract Part</h3>
              <CodeBlock code={`-- First 3 characters (area code)
SELECT SUBSTRING(phone, 1, 3) AS area_code

-- Get domain from email (PostgreSQL)
SELECT SUBSTRING(email FROM '@(.*)') AS domain

-- MySQL: SUBSTRING_INDEX
SELECT SUBSTRING_INDEX(email, '@', -1) AS domain`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">TRIM, UPPER, LOWER</h3>
              <CodeBlock code={`-- Remove whitespace
SELECT TRIM(name)        -- Both sides
SELECT LTRIM(name)       -- Left only
SELECT RTRIM(name)       -- Right only

-- Change case
SELECT UPPER(email)      -- UPPERCASE
SELECT LOWER(email)      -- lowercase

-- Case-insensitive comparison
WHERE LOWER(email) = LOWER('User@Gmail.Com')`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">REPLACE, LENGTH</h3>
              <CodeBlock code={`-- Replace characters
SELECT REPLACE(hotel_name, '-', ' ')
-- 'Grand-Palace-Hotel' → 'Grand Palace Hotel'

-- Remove spaces
SELECT REPLACE(phone, ' ', '')
-- '081 234 5678' → '0812345678'

-- String length
SELECT LENGTH(email)
WHERE LENGTH(phone) = 10  -- Exactly 10 digits`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'dates' && (
        <>
          <div className="section">
            <h2 className="section-title">📅 Date/Time Functions</h2>

            <div className="card">
              <h3 className="card-title">Current Date/Time</h3>
              <CodeBlock code={`-- Current timestamp
SELECT NOW()                    -- 2024-01-30 14:35:22

-- Current date only
SELECT CURRENT_DATE             -- 2024-01-30

-- Bookings from last 7 days
WHERE booking_date >= CURRENT_DATE - INTERVAL '7 days'`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">DATE_TRUNC - Group by Period</h3>
              <CodeBlock code={`-- Truncate to start of month
SELECT DATE_TRUNC('month', booking_date) AS month

-- Truncate to start of week
SELECT DATE_TRUNC('week', booking_date) AS week_start

-- Bookings per month
SELECT
    DATE_TRUNC('month', booking_date) AS month,
    COUNT(*) AS total
FROM bookings
GROUP BY DATE_TRUNC('month', booking_date)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">EXTRACT - Get Date Part</h3>
              <CodeBlock code={`-- Extract year
SELECT EXTRACT(YEAR FROM booking_date)    -- 2024

-- Extract month (1-12)
SELECT EXTRACT(MONTH FROM booking_date)   -- 1

-- Extract day of week (0=Sunday, 6=Saturday)
SELECT EXTRACT(DOW FROM booking_date)

-- Weekend bookings (Saturday, Sunday)
WHERE EXTRACT(ISODOW FROM booking_date) IN (6, 7)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Date Arithmetic</h3>
              <CodeBlock code={`-- Add days
SELECT CURRENT_DATE + INTERVAL '7 days'

-- Subtract days
SELECT CURRENT_DATE - INTERVAL '30 days'

-- Days between dates
SELECT check_in_date - booking_date AS days_advance

-- Common ranges
WHERE booking_date >= CURRENT_DATE - 7           -- Last 7 days
WHERE booking_date >= DATE_TRUNC('month', CURRENT_DATE)  -- This month`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'conditional' && (
        <>
          <div className="section">
            <h2 className="section-title">🎛️ CASE WHEN - Conditional Logic</h2>

            <div className="card">
              <h3 className="card-title">Basic CASE WHEN</h3>
              <CodeBlock code={`-- Categorize by price
SELECT
    hotel_name,
    price,
    CASE
        WHEN price < 1000 THEN 'Budget'
        WHEN price < 3000 THEN 'Mid-Range'
        WHEN price < 10000 THEN 'Luxury'
        ELSE 'Ultra-Luxury'
    END AS category
FROM hotels`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE in Aggregations (Pivot)</h3>
              <CodeBlock code={`-- Count by status (create columns from rows)
SELECT
    hotel_id,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending
FROM bookings
GROUP BY hotel_id`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE for Bucketing</h3>
              <CodeBlock code={`-- Age groups
SELECT
    name,
    age,
    CASE
        WHEN age < 18 THEN 'Under 18'
        WHEN age BETWEEN 18 AND 24 THEN '18-24'
        WHEN age BETWEEN 25 AND 34 THEN '25-34'
        WHEN age BETWEEN 35 AND 44 THEN '35-44'
        WHEN age >= 45 THEN '45+'
    END AS age_group
FROM users`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Simple CASE (Equality Only)</h3>
              <CodeBlock code={`-- Shorter syntax for equality checks
SELECT
    status,
    CASE status
        WHEN 'completed' THEN 'Done'
        WHEN 'pending' THEN 'In Progress'
        WHEN 'cancelled' THEN 'Cancelled'
        ELSE 'Unknown'
    END AS status_label
FROM bookings`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'types' && (
        <>
          <div className="section">
            <h2 className="section-title">🔄 Type Conversion</h2>

            <div className="card">
              <h3 className="card-title">CAST - Convert Types</h3>
              <CodeBlock code={`-- String to integer
SELECT CAST('123' AS INTEGER)

-- String to decimal
SELECT CAST('123.45' AS DECIMAL(10,2))

-- Integer to string
SELECT CAST(user_id AS VARCHAR)

-- PostgreSQL shorthand: ::
SELECT '123'::INTEGER
SELECT user_id::VARCHAR
SELECT booking_date::TEXT`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">COALESCE - NULL Handling</h3>
              <CodeBlock code={`-- Replace NULL with default
SELECT COALESCE(phone, 'No phone') AS contact

-- First non-NULL value
SELECT COALESCE(mobile, phone, email, 'No contact')

-- In calculations
SELECT COALESCE(discount, 0) AS discount`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">NULLIF - Avoid Divide by Zero</h3>
              <CodeBlock code={`-- Avoid error when dividing by zero
SELECT amount / NULLIF(quantity, 0)

-- Returns NULL instead of error when quantity = 0

-- Use with COALESCE for default
SELECT COALESCE(amount / NULLIF(quantity, 0), 0)`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'sets' && (
        <>
          <div className="section">
            <h2 className="section-title">🔗 Set Operations</h2>

            <div className="card">
              <h3 className="card-title">UNION vs UNION ALL</h3>
              <CodeBlock code={`-- UNION: Combines + removes duplicates (slower)
SELECT city FROM hotels
UNION
SELECT city FROM airports

-- UNION ALL: Combines + keeps duplicates (faster)
SELECT city FROM hotels
UNION ALL
SELECT city FROM airports

-- Use UNION ALL when:
-- • You know there are no duplicates
-- • You want to keep duplicates
-- • Performance matters`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">INTERSECT - Common Values</h3>
              <CodeBlock code={`-- Cities with both hotels AND airports
SELECT city FROM hotels
INTERSECT
SELECT city FROM airports

-- Result: Only cities in BOTH tables`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">EXCEPT - Difference</h3>
              <CodeBlock code={`-- Cities with hotels but NO airports
SELECT city FROM hotels
EXCEPT
SELECT city FROM airports

-- Result: Cities in hotels but NOT in airports

-- Note: EXCEPT is like MINUS in Oracle`} />
            </div>

            <div className="alert alert-info mt-2">
              <strong>💡 Remember:</strong><br />
              • All queries must have same number of columns<br />
              • Column types must be compatible<br />
              • ORDER BY goes at the very end (applies to combined result)<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'pagination' && (
        <>
          <div className="section">
            <h2 className="section-title">📄 Pagination</h2>

            <div className="card">
              <h3 className="card-title">LIMIT & OFFSET</h3>
              <CodeBlock code={`-- First 20 rows
SELECT * FROM hotels
ORDER BY hotel_id
LIMIT 20

-- Page 2 (skip first 20, get next 20)
LIMIT 20 OFFSET 20

-- Page 3 (skip first 40, get next 20)
LIMIT 20 OFFSET 40

-- Formula: OFFSET = (page - 1) * page_size`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Cursor Pagination (Efficient)</h3>
              <CodeBlock code={`-- ❌ SLOW on deep pages: OFFSET skips rows one by one
SELECT * FROM bookings
ORDER BY booking_id
LIMIT 20 OFFSET 20000;  -- Scans 20,000 rows!

-- ✅ FAST: Use WHERE with last seen value
-- Page 1
SELECT * FROM bookings ORDER BY booking_id LIMIT 20;
-- Last ID: 20

-- Page 2 (where last_id = 20)
SELECT * FROM bookings
WHERE booking_id > 20
ORDER BY booking_id
LIMIT 20;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">TABLESAMPLE - Random Sample</h3>
              <CodeBlock code={`-- Get random 10% of rows (PostgreSQL)
SELECT * FROM bookings
TABLESAMPLE BERNOULLI(10);

-- Fast 5% sample for analysis
SELECT AVG(amount) FROM bookings
TABLESAMPLE SYSTEM(5);`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          <div className="section">
            <h2 className="section-title">⚡ Performance Quick Reference</h2>

            <div className="card" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
              <h3 className="card-title" style={{ color: '#4CAF50' }}>✅ DO</h3>
              <ul>
                <li><strong>Filter early:</strong> WHERE before JOIN</li>
                <li><strong>Use LIMIT:</strong> Especially during testing</li>
                <li><strong>Decimal division:</strong> <code>100.0</code> not <code>100</code></li>
                <li><strong>Use IN:</strong> Better than multiple OR</li>
                <li><strong>Index-friendly WHERE:</strong> <code>WHERE date BETWEEN</code> not <code>WHERE YEAR(date) = 2024</code></li>
                <li><strong>EXISTS for checking:</strong> Faster than <code>IN (SELECT ...)</code> for large sets</li>
              </ul>
            </div>

            <div className="card mt-2" style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ AVOID</h3>
              <ul>
                <li><strong>SELECT *:</strong> Only select columns you need</li>
                <li><strong>Functions on columns:</strong> Breaks index usage</li>
                <li><strong>Correlated subquery in SELECT:</strong> Runs once per row!</li>
                <li><strong>DISTINCT to hide bad JOIN:</strong> Fix the JOIN instead</li>
                <li><strong>Leading % in LIKE:</strong> <code>LIKE '%end'</code> can't use index</li>
                <li><strong>Deep OFFSET:</strong> Use cursor pagination instead</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Speed Hierarchy</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Speed</th>
                      <th>Operation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'rgba(76, 175, 80, 0.15)' }}>
                      <td style={{ color: '#4CAF50', fontWeight: 600 }}>⚡⚡⚡ FASTEST</td>
                      <td>Index lookup: <code>WHERE id = 123</code></td>
                    </tr>
                    <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                      <td style={{ color: '#4CAF50', fontWeight: 600 }}>⚡⚡ FAST</td>
                      <td>Index scan + LIMIT</td>
                    </tr>
                    <tr style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                      <td style={{ color: '#FF9800', fontWeight: 600 }}>🐌 SLOWER</td>
                      <td>Full table scan</td>
                    </tr>
                    <tr style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
                      <td style={{ color: '#F44336', fontWeight: 600 }}>🐢 SLOW</td>
                      <td>Function on column: <code>YEAR(date)</code></td>
                    </tr>
                    <tr style={{ background: 'rgba(244, 67, 54, 0.2)' }}>
                      <td style={{ color: '#F44336', fontWeight: 600 }}>🐌💀 SLOWEST</td>
                      <td>Cartesian join, correlated subquery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'checklist' && (
        <>
          <div className="section">
            <h2 className="section-title">✅ Pre-Submit Checklist</h2>

            <div className="card">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Output Format
              </h3>
              <ul style={{ padding: '1rem', listStyle: 'none', paddingLeft: 0 }}>
                <li>☑️ All required columns present?</li>
                <li>☑️ Column names match exactly?</li>
                <li>☑️ Correct ORDER BY (ASC vs DESC)?</li>
                <li>☑️ No SELECT *?</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Logic
              </h3>
              <ul style={{ padding: '1rem', listStyle: 'none', paddingLeft: 0 }}>
                <li>☑️ Correct aggregate (COUNT vs SUM vs AVG)?</li>
                <li>☑️ Correct JOIN type (INNER vs LEFT)?</li>
                <li>☑️ WHERE vs HAVING used correctly?</li>
                <li>☑️ GROUP BY includes all non-aggregated columns?</li>
                <li>☑️ NULL handling (COALESCE, IS NULL)?</li>
                <li>☑️ Decimal division (100.0 not 100)?</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Common Mistakes
              </h3>
              <div className="table-container" style={{ padding: '1rem' }}>
                <table>
                  <thead>
                    <tr>
                      <th>❌ Mistake</th>
                      <th>✅ Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>WHERE COUNT(*) &gt; 5</code></td>
                      <td><code>HAVING COUNT(*) &gt; 5</code></td>
                    </tr>
                    <tr>
                      <td><code>WHERE col = NULL</code></td>
                      <td><code>WHERE col IS NULL</code></td>
                    </tr>
                    <tr>
                      <td><code>SELECT 5 / 10</code> (= 0)</td>
                      <td><code>SELECT 5 / 10.0</code> (= 0.5)</td>
                    </tr>
                    <tr>
                      <td>Window function in WHERE</td>
                      <td>Use CTE, filter in outer query</td>
                    </tr>
                    <tr>
                      <td><code>WHERE YEAR(date) = 2024</code></td>
                      <td><code>WHERE date BETWEEN ...</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      <KeyTakeaways
        points={[
          'Bookmark this chapter for quick syntax lookup',
          'Pattern matching table = instant interview help',
          'Use decimal (100.0) not integer (100) for division',
          'LIKE with leading % is slow - avoid in production',
          'CASE WHEN for categorization and pivoting',
          'UNION ALL is faster than UNION (keeps duplicates)',
          'Cursor pagination > OFFSET for deep pages'
        ]}
        nextChapter="Practice with '🎬 Mock Test' using these references"
        relatedChapters="'🎯 Interview Patterns' for pattern recognition practice"
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
