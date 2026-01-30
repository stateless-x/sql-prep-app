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

          <div className="alert alert-info">
            <strong>🎯 Grain = The level of detail in your result</strong><br />
            Think of grain as: "What does EVERY SINGLE ROW in my result represent?"<br />
            NOT just one row - but ALL rows in your output!
          </div>

          <div className="mt-2">
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>
              Real-World Analogy: Receipts vs Summary
            </h3>
            <p className="section-content">
              <strong>Detailed Receipts</strong> (Fine Grain): Each row = one purchase<br />
              <strong>Monthly Summary</strong> (Coarse Grain): Each row = one month's total
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Example 1: Fine Grain (No GROUP BY)</h3>
            <p><strong>Query:</strong></p>
            <CodeBlock code={`SELECT * FROM bookings;`} />

            <p className="mt-2"><strong>Result:</strong> Grain = ONE ROW = ONE BOOKING</p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>booking_id</th>
                    <th>user_id</th>
                    <th>hotel_id</th>
                    <th>amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>101</td>
                    <td>5</td>
                    <td>200</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>101</td>
                    <td>5</td>
                    <td>350</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>102</td>
                    <td>7</td>
                    <td>800</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>102</td>
                    <td>5</td>
                    <td>150</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              ☝️ Each row = a different booking. User 101 appears twice because they made 2 bookings!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Example 2: Coarser Grain (GROUP BY user_id)</h3>
            <p><strong>Query:</strong></p>
            <CodeBlock code={`SELECT user_id, SUM(amount) AS total_spent
FROM bookings
GROUP BY user_id;`} />

            <p className="mt-2"><strong>Result:</strong> Grain = ONE ROW = ONE USER</p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>user_id</th>
                    <th>total_spent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td>550</td>
                  </tr>
                  <tr>
                    <td>102</td>
                    <td>950</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ color: 'var(--success)' }}>
              ☝️ Now EVERY row represents ONE user. User 101's two bookings (200 + 350) collapsed into one row!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Example 3: Even Finer Grain (GROUP BY user_id, hotel_id)</h3>
            <p><strong>Query:</strong></p>
            <CodeBlock code={`SELECT user_id, hotel_id, COUNT(*) AS booking_count, SUM(amount) AS total
FROM bookings
GROUP BY user_id, hotel_id;`} />

            <p className="mt-2"><strong>Result:</strong> Grain = ONE ROW = ONE USER-HOTEL COMBO</p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>user_id</th>
                    <th>hotel_id</th>
                    <th>booking_count</th>
                    <th>total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>101</td>
                    <td>5</td>
                    <td>2</td>
                    <td>550</td>
                  </tr>
                  <tr>
                    <td>102</td>
                    <td>5</td>
                    <td>1</td>
                    <td>150</td>
                  </tr>
                  <tr>
                    <td>102</td>
                    <td>7</td>
                    <td>1</td>
                    <td>800</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              ☝️ EVERY row = one unique user-hotel pair. User 102 appears TWICE because they booked 2 different hotels!
            </p>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚠️ Why "Grain" Matters</strong><br />
            <br />
            <strong>Wrong grain = wrong answer!</strong><br />
            <br />
            Question: "How much did each user spend?"<br />
            ❌ If you use fine grain (one row = one booking), you get multiple rows per user<br />
            ✅ You need coarse grain (one row = one user) with GROUP BY user_id
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Interview Pro Tip:</strong><br />
            When reading any query or writing your own, ALWAYS identify the grain:<br />
            1. Look at GROUP BY columns → each unique combination = one row<br />
            2. No GROUP BY? → each row in the source table = one row in result<br />
            3. Say it out loud: "One row represents..."
          </div>
        </div>
      )}

      {activeTab === 'ops' && (
        <div className="section">
          <h2 className="section-title">The 6 Building Blocks</h2>

          <div className="card">
            <h3 className="card-title">1. SELECT — What columns to show</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like choosing which columns to display in your Excel spreadsheet<br />
              <strong>What it does:</strong> Picks which columns appear in your result and can create new calculated columns
            </p>
            <CodeBlock code={`SELECT user_id, email, amount * 1.1 AS amount_with_tax`} />
            <p className="mt-1">
              Shows user_id, email as-is, and creates a NEW column with 10% tax added
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">2. FROM / JOIN — What tables to pull from</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like getting data from multiple spreadsheet tabs and connecting them<br />
              <strong>What it does:</strong> Specifies which table(s) to query and how to connect them
            </p>
            <CodeBlock code={`FROM bookings b
JOIN users u ON b.user_id = u.user_id`} />
            <p className="mt-1">
              Start with bookings table, connect to users table where IDs match<br />
              Result: Each booking row now has user info attached
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">3. WHERE — Filter individual rows</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like using Excel's AutoFilter on raw data<br />
              <strong>What it does:</strong> Removes rows BEFORE any grouping happens<br />
              <strong>Use for:</strong> Filtering based on conditions of individual records
            </p>
            <CodeBlock code={`WHERE status = 'completed' AND amount > 100`} />
            <p className="mt-1">
              Only keep rows where booking is completed AND costs more than $100<br />
              <strong style={{ color: 'var(--warning)' }}>Runs BEFORE GROUP BY!</strong> So it filters original rows
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">4. GROUP BY — Collapse rows into groups</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like creating a pivot table in Excel<br />
              <strong>What it does:</strong> Takes multiple rows with the same value and squashes them into ONE row<br />
              <strong>Use for:</strong> Creating summaries per user/product/category/etc.
            </p>
            <CodeBlock code={`GROUP BY user_id    -- Now one row per user`} />
            <p className="mt-1">
              If user 101 had 5 bookings, they become ONE row representing that user<br />
              Then you can COUNT those 5 bookings or SUM their amounts
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">5. HAVING — Filter groups (not rows!)</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like filtering a pivot table to show only categories with high totals<br />
              <strong>What it does:</strong> Removes entire GROUPS after they've been created<br />
              <strong>Use for:</strong> "Show me users who spent >$1000" or "Only countries with 100+ bookings"
            </p>
            <CodeBlock code={`HAVING COUNT(*) >= 5 AND SUM(amount) > 1000`} />
            <p className="mt-1">
              Only show groups (users) who have 5+ bookings AND spent over $1000 total<br />
              <strong style={{ color: 'var(--success)' }}>Runs AFTER GROUP BY!</strong> So it filters groups, not individual rows
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">6. ORDER BY / LIMIT — Sort and trim results</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like sorting Excel by a column and showing top 10<br />
              <strong>What it does:</strong> Orders your final results and optionally cuts off after N rows<br />
              <strong>Use for:</strong> "Top 10 spenders", "Latest 50 bookings", "Alphabetical list"
            </p>
            <CodeBlock code={`ORDER BY total DESC LIMIT 10`} />
            <p className="mt-1">
              Sort by total (highest first), then only show the top 10 rows<br />
              <strong style={{ color: 'var(--warning)' }}>Always ORDER BY before LIMIT!</strong> Otherwise you get random 10
            </p>
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Memory Trick:</strong><br />
            <strong>WHERE</strong> = filter individual transactions/records<br />
            <strong>HAVING</strong> = filter summaries/totals/groups<br />
            <br />
            WHERE comes before grouping (filter rows)<br />
            HAVING comes after grouping (filter groups)
          </div>
        </div>
      )}

      {activeTab === 'distinct' && (
        <div className="section">
          <h2 className="section-title">DISTINCT vs GROUP BY</h2>

          <div className="alert alert-info">
            <strong>🎯 Key Difference:</strong><br />
            <strong>DISTINCT</strong> = "Show me unique values, that's all"<br />
            <strong>GROUP BY</strong> = "Show me unique values AND let me count/sum them"
          </div>

          <div className="card mt-2">
            <h3 className="card-title">DISTINCT — Simple deduplication</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> You have a list of customer cities and want to know which unique cities you serve<br />
              <strong>What it does:</strong> Removes duplicate rows, shows each unique combination once<br />
              <strong>Limitation:</strong> You CANNOT use aggregates like COUNT, SUM with DISTINCT alone
            </p>
            <CodeBlock code={`-- Get unique countries (no counting)
SELECT DISTINCT country FROM users;
-- Result: USA, UK, Japan, Germany (each appears once)

-- Unique combinations of country + account type
SELECT DISTINCT country, account_type FROM users;
-- Result: (USA, premium), (USA, free), (UK, premium), etc.`} />
            <p className="mt-1"><strong>Use when:</strong> You just want to see unique values, no math needed</p>
          </div>

          <div className="card">
            <h3 className="card-title">GROUP BY — Deduplication + Aggregation</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Not just "which cities?" but "HOW MANY customers per city?"<br />
              <strong>What it does:</strong> Removes duplicates AND lets you calculate totals, counts, averages per group<br />
              <strong>Power:</strong> Can use COUNT, SUM, AVG, MIN, MAX on each group
            </p>
            <CodeBlock code={`-- Count users per country
SELECT country, COUNT(*) AS user_count
FROM users
GROUP BY country;
-- Result: (USA, 543), (UK, 102), (Japan, 87)

-- Can do complex aggregations!
SELECT country,
       COUNT(*) AS total_users,
       COUNT(DISTINCT account_type) AS different_types,
       AVG(age) AS avg_age
FROM users
GROUP BY country;`} />
            <p className="mt-1"><strong>Use when:</strong> You need to count, sum, or aggregate grouped data</p>
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Quick Decision Tree:</strong><br />
            Need to count/sum things? → Use GROUP BY<br />
            Just need unique values? → Use DISTINCT<br />
            <br />
            <strong>Bonus:</strong> DISTINCT country ≈ GROUP BY country (same result, but GROUP BY lets you add counts)
          </div>

          <h2 className="section-title mt-3">UNION vs UNION ALL</h2>

          <div className="alert alert-info">
            <strong>🎯 Key Difference:</strong><br />
            Both combine results from multiple queries (stacking rows)<br />
            <strong>UNION</strong> = Remove duplicates (slower)<br />
            <strong>UNION ALL</strong> = Keep duplicates (faster)
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Real-World Scenario</h3>
            <p>
              <strong>Situation:</strong> You have separate tables for 2024 bookings and 2025 bookings.
              You want all bookings in one result.
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">UNION ALL — Keep everything (faster)</h3>
            <p className="mb-1">
              <strong>Use when:</strong> You KNOW there are no duplicates OR duplicates are OK<br />
              <strong>Performance:</strong> Fast! No duplicate checking needed
            </p>
            <CodeBlock code={`-- Combine all bookings from both years
SELECT user_id, booking_date, amount FROM bookings_2024
UNION ALL
SELECT user_id, booking_date, amount FROM bookings_2025;

-- Result: If 2024 has 1000 rows and 2025 has 500 rows = 1500 rows total`} />
            <p className="mt-1" style={{ color: 'var(--success)' }}>
              ✅ Each booking has a unique booking_id and date, so duplicates are impossible → Use UNION ALL
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">UNION — Remove duplicates (slower)</h3>
            <p className="mb-1">
              <strong>Use when:</strong> Same row might appear in both queries and you want it only once<br />
              <strong>Performance:</strong> Slower because SQL has to compare ALL rows to find duplicates
            </p>
            <CodeBlock code={`-- Get users who are EITHER premium OR have spent >$5000
SELECT user_id FROM users WHERE account_type = 'premium'
UNION
SELECT user_id FROM bookings GROUP BY user_id HAVING SUM(amount) > 5000;

-- If user 101 is premium AND spent $6000, they appear in BOTH queries
-- UNION ensures they only appear ONCE in final result`} />
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              ⚠️ Some users might be in both groups → Use UNION to deduplicate
            </p>
          </div>

          <div className="table-container mt-2">
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
                  <td>Removed automatically</td>
                  <td>Kept (shows all rows)</td>
                </tr>
                <tr>
                  <td><strong>Speed</strong></td>
                  <td>Slower (has to check)</td>
                  <td>Faster (no checking)</td>
                </tr>
                <tr>
                  <td><strong>Use when</strong></td>
                  <td>Same data might be in both queries</td>
                  <td>No duplicates possible OR you want them</td>
                </tr>
                <tr>
                  <td><strong>Example</strong></td>
                  <td>Combining overlapping user lists</td>
                  <td>Combining time-partitioned data (2024 + 2025)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚡ Performance Best Practice:</strong><br />
            Default to UNION ALL (faster). Only use UNION if duplicates are actually possible and you don't want them.<br />
            <br />
            <strong>Interview Tip:</strong> If asked to combine results, always mention performance:<br />
            "I'll use UNION ALL since these are from different time periods, so duplicates aren't possible"
          </div>
        </div>
      )}

      {activeTab === 'nulls' && (
        <div className="section">
          <h2 className="section-title">NULL Handling</h2>

          <div className="alert alert-warning">
            <strong>⚠️ NULL ≠ empty string ≠ 0 ≠ false</strong><br />
            NULL means "unknown" or "missing value" or "not applicable"
          </div>

          <div className="card mt-2">
            <h3 className="card-title">What NULL Really Means</h3>
            <p>
              <strong>Real-world examples:</strong><br />
              • User hasn't provided their phone number yet → phone = NULL<br />
              • Product has no reviews → rating = NULL (not 0! Zero would mean "terrible rating")<br />
              • Booking hasn't been completed → completion_date = NULL<br />
              • Optional field left blank → NULL (empty string '' is different!)
            </p>
          </div>

          <div className="card">
            <h3 className="card-title">Common NULL Confusion</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Value</th>
                    <th>Meaning</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="inline-code">NULL</code></td>
                    <td>Unknown / Missing / Not applicable</td>
                    <td>User didn't enter phone</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">'' (empty string)</code></td>
                    <td>Known to be empty</td>
                    <td>User entered blank text</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">0</code></td>
                    <td>Actual value of zero</td>
                    <td>Item costs $0 (free)</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">FALSE</code></td>
                    <td>Boolean false</td>
                    <td>Email not verified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Checking for NULL (Most Common Mistake!)</h3>
            <p className="mb-1">
              <strong>Why = NULL doesn't work:</strong><br />
              NULL means "unknown". Is unknown equal to unknown? SQL says "I don't know!" (returns NULL, not TRUE)<br />
              Since WHERE needs TRUE to keep a row, NULL = NULL never keeps any rows!
            </p>
            <CodeBlock code={`-- ❌ WRONG: Never use = or !=
WHERE country = NULL     -- Always returns 0 rows! NULL = NULL is unknown, not true
WHERE country != NULL    -- Also returns 0 rows!
WHERE country <> NULL    -- Same problem

-- ✅ RIGHT: Use IS NULL / IS NOT NULL
WHERE country IS NULL         -- Returns rows where country is unknown/missing
WHERE country IS NOT NULL     -- Returns rows where country has a value

-- Real example: Find users without phone numbers
SELECT user_id, email
FROM users
WHERE phone IS NULL;`} />
          </div>

          <div className="card">
            <h3 className="card-title">COALESCE — Provide fallback values</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Like saying "use phone if available, otherwise email, otherwise show 'No contact'"<br />
              <strong>What it does:</strong> Returns the FIRST non-NULL value from a list<br />
              <strong>Use when:</strong> You want to replace NULLs with default values
            </p>
            <CodeBlock code={`-- Try phone, fallback to email, fallback to literal string
SELECT
    user_id,
    COALESCE(phone, email, 'No contact info') AS contact_method
FROM users;
-- If phone exists → shows phone
-- If phone is NULL but email exists → shows email
-- If both NULL → shows 'No contact info'

-- Replace NULL with 0 in calculations (common in reports!)
SELECT
    user_id,
    COALESCE(total_spent, 0) AS spent,
    COALESCE(booking_count, 0) AS bookings
FROM user_summary;
-- Users with no bookings show 0 instead of NULL

-- Useful for sorting (NULLs to the end)
ORDER BY COALESCE(last_login, '1900-01-01') DESC;`} />
          </div>

          <div className="card">
            <h3 className="card-title">NULLIF — Avoid divide by zero errors</h3>
            <p className="mb-1">
              <strong>Real-world:</strong> Calculating average order value, but some users have 0 orders<br />
              <strong>What it does:</strong> Returns NULL if two values are equal, otherwise returns the first value<br />
              <strong>Use when:</strong> You want to convert a specific value (like 0) to NULL
            </p>
            <CodeBlock code={`-- ❌ This crashes when bookings = 0
SELECT user_id, revenue / bookings AS avg_order_value
FROM user_stats;  -- ERROR: division by zero!

-- ✅ NULLIF converts 0 to NULL, avoiding error
SELECT user_id, revenue / NULLIF(bookings, 0) AS avg_order_value
FROM user_stats;
-- If bookings = 0 → NULLIF(0, 0) = NULL → result is NULL (no error!)
-- If bookings = 5 → NULLIF(5, 0) = 5 → calculates normally

-- How NULLIF works:
-- NULLIF(value1, value2):
--   If value1 = value2 → return NULL
--   Otherwise → return value1`} />
          </div>

          <div className="card">
            <h3 className="card-title">NULL in Aggregates (Critical to understand!)</h3>
            <p className="mb-1">
              <strong>Rule:</strong> Most aggregates IGNORE NULL values (except COUNT(*))<br />
              This can cause unexpected results if you're not careful!
            </p>
            <CodeBlock code={`-- Scenario: 5 users, 3 have phone numbers, 2 don't

-- COUNT(*) counts ALL rows (including NULLs)
SELECT COUNT(*) FROM users;
-- Result: 5 (counts all 5 users)

-- COUNT(column) counts only non-NULL values
SELECT COUNT(phone) FROM users;
-- Result: 3 (only users with phone numbers)

-- SUM, AVG, MIN, MAX ignore NULLs
SELECT AVG(rating) FROM reviews WHERE product_id = 100;
-- If 3 reviews: 5, NULL, 4 → Average is (5+4)/2 = 4.5
-- NOT (5+NULL+4)/3! NULL is ignored

-- This can skew results! Be careful
SELECT AVG(discount_amount) FROM bookings;
-- If many bookings have NULL discount → average only counts those WITH discounts
-- Might show "average discount: $50" when most customers got $0!

-- Solution: Use COALESCE if you want NULLs as 0
SELECT AVG(COALESCE(discount_amount, 0)) FROM bookings;
-- Now NULLs treated as 0 in the average`} />
          </div>

          <div className="card">
            <h3 className="card-title">NULL in WHERE Conditions (Gotcha!)</h3>
            <p className="mb-1">
              <strong>Important:</strong> NULL in any comparison makes the whole condition NULL (not TRUE or FALSE)<br />
              WHERE only keeps rows where condition is TRUE, so NULLs are filtered out!
            </p>
            <CodeBlock code={`-- If age is NULL, these ALL filter out that row:
WHERE age > 18        -- NULL > 18 = NULL (not TRUE) → row filtered out
WHERE age <= 18       -- NULL <= 18 = NULL → row filtered out
WHERE age = 25        -- NULL = 25 = NULL → row filtered out
WHERE age != 25       -- NULL != 25 = NULL → row filtered out!

-- To include NULLs, you must explicitly check:
WHERE age > 18 OR age IS NULL     -- Now keeps rows where age is NULL

-- Real example: Find users who are NOT premium
WHERE account_type != 'premium'   -- ❌ Excludes users with NULL account_type!
WHERE account_type != 'premium' OR account_type IS NULL  -- ✅ Includes NULLs`} />
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 Interview Pro Tips:</strong><br />
            1. Always ask: "Can this column be NULL? What should happen?"<br />
            2. When doing != comparisons, consider if you need OR column IS NULL<br />
            3. When averaging, decide if NULLs should be 0 or ignored<br />
            4. Use COUNT(*) for total rows, COUNT(column) for non-NULL count<br />
            5. Divide by zero? Use NULLIF(divisor, 0) to return NULL instead of error
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
