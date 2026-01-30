import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function HackerRankStrategy({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('framework')

  const tabs = [
    { id: 'framework', label: '🎯 4-Step Framework' },
    { id: 'patterns', label: '🔍 Pattern Matching' },
    { id: 'time', label: '⏱️ Time Management' },
    { id: 'mistakes', label: '⚠️ Common Mistakes' },
    { id: 'checklist', label: '✅ Pre-Submit' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎯 HackerRank Strategy</h1>
        <p className="chapter-subtitle">Ace the 60-minute test like a pro</p>
      </div>

      <div className="alert alert-warning">
        <strong>🎬 Test Reality Check:</strong><br />
        60 minutes ÷ 4-5 problems = ~12-15 min per problem<br />
        You need speed + accuracy. This guide teaches you BOTH.
      </div>

      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'framework' && (
        <>
          <div className="section">
            <h2 className="section-title">The 4-Step Framework</h2>
            <p className="section-content">
              <strong>Use this for EVERY problem. No exceptions!</strong>
            </p>

            <div className="card">
              <h3 className="card-title" style={{ color: '#4CAF50' }}>Step 1: Read & Identify (2 min)</h3>
              <p>
                <strong>What to do:</strong><br />
                • Read problem statement carefully (look for hidden requirements!)<br />
                • Identify the grain: "What does one row represent in the output?"<br />
                • Spot keywords that hint at patterns<br />
                • Note all required columns in output<br />
                <br />
                <strong>Keywords to watch for:</strong><br />
                "top N" → ROW_NUMBER() or RANK()<br />
                "each category/group" → PARTITION BY<br />
                "running total" → SUM() OVER (ORDER BY)<br />
                "previous/next" → LAG/LEAD<br />
                "missing" → LEFT JOIN or NOT EXISTS<br />
                "percentage" → GROUP BY with division<br />
              </p>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#2196F3' }}>Step 2: Plan Your Attack (1 min)</h3>
              <p>
                <strong>Before writing ANY code, decide:</strong><br />
                <br />
                1️⃣ <strong>What tables do I need?</strong><br />
                → Start with smallest table that has the key data<br />
                <br />
                2️⃣ <strong>What JOIN type?</strong><br />
                → INNER (only matching records)<br />
                → LEFT (include non-matches from left table)<br />
                <br />
                3️⃣ <strong>Do I need grouping?</strong><br />
                → If counting/summing per category → GROUP BY<br />
                → If ranking within groups → Window function<br />
                <br />
                4️⃣ <strong>What's my filter strategy?</strong><br />
                → WHERE (before grouping) for row filters<br />
                → HAVING (after grouping) for aggregate filters<br />
              </p>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#FF9800' }}>Step 3: Write & Test Small (5-8 min)</h3>
              <p>
                <strong>DON'T write the full query yet!</strong><br />
                <br />
                <strong>The "Test Small First" technique:</strong><br />
                <br />
                1. Start with basic SELECT from main table<br />
                2. Add WHERE user_id = 1 (or any small filter) + LIMIT 10<br />
                3. Verify you get some rows<br />
                4. Add JOIN one at a time, check output after each<br />
                5. Add GROUP BY or window function<br />
                6. Add final filters and ORDER BY<br />
                7. Remove LIMIT and test filter for full results<br />
              </p>

              <div className="mt-2">
                <CodeBlock code={`-- WRONG: Writing full query at once (risky!)
SELECT u.name, COUNT(*) as total, SUM(b.amount) as revenue
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed' AND u.country = 'Thailand'
GROUP BY u.user_id, u.name
HAVING SUM(b.amount) > 5000
ORDER BY revenue DESC;

-- RIGHT: Build incrementally!

-- Step 1: Start small
SELECT * FROM users WHERE user_id = 1;

-- Step 2: Add JOIN + test
SELECT u.*, b.*
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE u.user_id = 1;

-- Step 3: Add filters + test
SELECT u.*, b.*
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed' AND u.country = 'Thailand'
LIMIT 10;

-- Step 4: Add aggregation
SELECT u.user_id, u.name, COUNT(*) as total, SUM(b.amount) as revenue
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed' AND u.country = 'Thailand'
GROUP BY u.user_id, u.name
LIMIT 10;

-- Step 5: Final query (remove LIMIT, add HAVING)
SELECT u.user_id, u.name, COUNT(*) as total, SUM(b.amount) as revenue
FROM users u
JOIN bookings b ON u.user_id = b.user_id
WHERE b.status = 'completed' AND u.country = 'Thailand'
GROUP BY u.user_id, u.name
HAVING SUM(b.amount) > 5000
ORDER BY revenue DESC;`} />
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#9C27B0' }}>Step 4: Final Check (1-2 min)</h3>
              <p>
                <strong>Before hitting Submit, check these:</strong><br />
                <br />
                ✅ Output has ALL required columns from problem statement<br />
                ✅ Column names match exactly (or use AS to rename)<br />
                ✅ ORDER BY matches requirement (ASC vs DESC)<br />
                ✅ No SELECT * (only select what's needed)<br />
                ✅ Used correct aggregate (SUM vs COUNT vs AVG)<br />
                ✅ Check NULL handling (use COALESCE if needed)<br />
                ✅ Test edge case: What if no data? (use LEFT JOIN or COALESCE)<br />
              </p>
            </div>
          </div>

          <div className="alert alert-success">
            <strong>💡 Pro Tip:</strong> The "Test Small First" technique is the #1 time-saver!
            It catches bugs early instead of debugging a complex query for 10 minutes.
          </div>
        </>
      )}

      {activeTab === 'patterns' && (
        <>
          <div className="section">
            <h2 className="section-title">Pattern Matching Cheat Sheet</h2>
            <p className="section-content">
              <strong>When you see these keywords, immediately think of these solutions!</strong><br />
              This is your "Aha! Moment" shortcut. Memorize this table!
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
                    <td><strong>"top 3 per category"</strong><br />"best N in each group"<br />"highest/lowest per X"</td>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>ROW_NUMBER() + CTE</td>
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
                    <td><strong>"compare to previous"</strong><br />"difference from last"<br />"change since prior"</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>LAG() or LEAD()</td>
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
                    <td><strong>"running total"</strong><br />"cumulative sum"<br />"year-to-date"</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>SUM() OVER (ORDER BY)</td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        SUM(amount) OVER (<br />
                        &nbsp;&nbsp;ORDER BY date<br />
                        )
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>"rank teams"</strong><br />"assign ranking"<br />"position by score"</td>
                    <td style={{ color: '#E91E63', fontWeight: 600 }}>RANK() or DENSE_RANK()</td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        RANK() OVER (<br />
                        &nbsp;&nbsp;ORDER BY score DESC<br />
                        )
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>"total per category"</strong><br />"count by group"<br />"sum by type"</td>
                    <td style={{ color: '#9C27B0', fontWeight: 600 }}>GROUP BY + Aggregate</td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        SELECT category, SUM(amount)<br />
                        FROM table<br />
                        GROUP BY category
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>"users who never"</strong><br />"hotels with no bookings"<br />"find missing"</td>
                    <td style={{ color: '#00BCD4', fontWeight: 600 }}>LEFT JOIN + IS NULL</td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        SELECT h.*<br />
                        FROM hotels h<br />
                        LEFT JOIN bookings b<br />
                        &nbsp;&nbsp;ON h.id = b.hotel_id<br />
                        WHERE b.id IS NULL
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>"percentage of total"</strong><br />"share of revenue"<br />"proportion"</td>
                    <td style={{ color: '#FF5722', fontWeight: 600 }}>Window SUM() for denominator</td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>
                        100.0 * amount /<br />
                        SUM(amount) OVER ()
                      </code>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>"moving average"</strong><br />"last 7 days average"<br />"rolling calculation"</td>
                    <td style={{ color: '#795548', fontWeight: 600 }}>Window with ROWS BETWEEN</td>
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

          <div className="alert alert-info">
            <strong>🎯 How to Use This Table:</strong><br />
            1. Read problem statement<br />
            2. Scan for these exact keywords<br />
            3. When you find a match → use that SQL pattern<br />
            4. Adapt the pattern to your specific tables/columns<br />
            <br />
            <strong>Example:</strong> "Find the top 3 highest-rated hotels in each city"<br />
            → Keyword: "top 3 ... in each" → Pattern: ROW_NUMBER() PARTITION BY city
          </div>
        </>
      )}

      {activeTab === 'time' && (
        <>
          <div className="section">
            <h2 className="section-title">60-Minute Time Management</h2>

            <div className="alert alert-warning">
              <strong>⚠️ Reality:</strong> You'll have 4-5 problems. If you spend 20 min on problem #1,
              you'll run out of time and fail problems #4 and #5!
            </div>

            <div className="card">
              <h3 className="card-title">The Time Budget</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Problem Difficulty</th>
                      <th>Time Budget</th>
                      <th>What To Do</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                      <td><strong>Easy (10 pts)</strong></td>
                      <td>8-10 min</td>
                      <td>Simple SELECT, basic JOIN, no grouping</td>
                    </tr>
                    <tr style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                      <td><strong>Medium (15 pts)</strong></td>
                      <td>12-15 min</td>
                      <td>GROUP BY, HAVING, multiple JOINs</td>
                    </tr>
                    <tr style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
                      <td><strong>Hard (15-20 pts)</strong></td>
                      <td>15-20 min</td>
                      <td>Window functions, CTEs, complex logic</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">The "Stuck at 10 Minutes" Rule</h3>
              <p>
                <strong style={{ color: '#F44336' }}>If you've been stuck on one problem for 10+ minutes:</strong><br />
                <br />
                1️⃣ <strong>STOP!</strong> Don't keep banging your head against it<br />
                2️⃣ Write down what you tried so far<br />
                3️⃣ <strong>Skip to next problem</strong> (come back later if time permits)<br />
                4️⃣ Better to get 80% of problems partially right than 100% of one problem perfect<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Why this works:</strong><br />
                • Easy problems give you quick points<br />
                • Your brain keeps working on the hard problem in the background<br />
                • When you come back, you often see the solution immediately!<br />
              </p>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Suggested Order of Attack</h3>
              <div className="mt-1">
                <CodeBlock code={`Minutes 0-5: Skim ALL problems
• Identify easy vs hard
• Plan your order (do easy ones first!)

Minutes 5-15: Problem #1 (easiest)
• Quick win, build confidence
• Test your setup (syntax, table access)

Minutes 15-30: Problems #2 & #3
• Medium difficulty
• Use "Test Small First" technique

Minutes 30-50: Problem #4 (hardest)
• This is where window functions usually appear
• Don't panic if it's complex!

Minutes 50-58: Problem #5 or revisit skipped
• Finish remaining problem
• Or go back to stuck problems

Minutes 58-60: Final check ALL queries
• Verify output format
• Check for typos
• Submit!`} />
              </div>
            </div>
          </div>

          <div className="alert alert-success">
            <strong>💡 Pro Tip:</strong> Keep a rough timer in your head. If you're at minute 40
            and still on problem #2, you're in trouble! Speed up or skip ahead.
          </div>
        </>
      )}

      {activeTab === 'mistakes' && (
        <>
          <div className="section">
            <h2 className="section-title">Common Mistakes That Kill Your Score</h2>

            <div className="card">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #1: Not Reading Carefully</h3>
              <p>
                <strong>What happens:</strong><br />
                Problem says "show hotels with NO bookings" → You write INNER JOIN (only shows hotels WITH bookings!)<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Fix:</strong><br />
                • Read problem statement 2-3 times<br />
                • Circle keywords: "no", "all", "missing", "at least", "exactly"<br />
                • Check sample output to understand expected format<br />
              </p>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #2: Wrong Aggregate</h3>
              <p>
                <strong>What happens:</strong><br />
                Problem asks for "number of bookings" → You write SUM(bookings) instead of COUNT(*)<br />
                <br />
                <strong>Common confusions:</strong><br />
                • COUNT(*) = number of rows<br />
                • COUNT(column) = number of non-NULL values in that column<br />
                • SUM(column) = total of values<br />
                • AVG(column) = average (watch out for NULLs!)<br />
              </p>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #3: Forgetting NULL Handling</h3>
              <p>
                <strong>What happens:</strong><br />
                You calculate average rating, but NULL ratings cause incorrect result<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Fix:</strong><br />
                • Use COALESCE(column, 0) for NULLs that should be zero<br />
                • Use LEFT JOIN carefully (creates NULLs on right side)<br />
                • Remember: WHERE column = NULL doesn't work! Use IS NULL<br />
              </p>

              <div className="mt-2">
                <CodeBlock code={`-- ❌ WRONG: NULL breaks the calculation
SELECT AVG(rating) FROM hotels;
-- If some hotels have NULL rating, AVG skips them (might be desired!)

-- ✅ RIGHT: Decide what NULL means
SELECT AVG(COALESCE(rating, 0)) FROM hotels;
-- Treats NULL as 0 in average

-- ❌ WRONG: This finds nothing!
SELECT * FROM hotels WHERE rating = NULL;

-- ✅ RIGHT: Use IS NULL
SELECT * FROM hotels WHERE rating IS NULL;`} />
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #4: Wrong JOIN Type</h3>
              <p>
                <strong>Decision tree:</strong><br />
                <br />
                <strong>Use INNER JOIN when:</strong><br />
                → Only want matching records (e.g., "users who made bookings")<br />
                <br />
                <strong>Use LEFT JOIN when:</strong><br />
                → Want all records from left table, even without matches (e.g., "all hotels, including those with no bookings")<br />
                → Finding missing records (WHERE right.id IS NULL)<br />
              </p>

              <div className="mt-2">
                <CodeBlock code={`-- Problem: "Find all hotels and their booking counts (include hotels with 0 bookings)"

-- ❌ WRONG: INNER JOIN excludes hotels with no bookings
SELECT h.name, COUNT(b.booking_id) as total
FROM hotels h
JOIN bookings b ON h.hotel_id = b.hotel_id
GROUP BY h.hotel_id, h.name;

-- ✅ RIGHT: LEFT JOIN includes all hotels
SELECT h.name, COUNT(b.booking_id) as total
FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
GROUP BY h.hotel_id, h.name;`} />
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #5: Window Function in WHERE</h3>
              <p>
                <strong>What happens:</strong><br />
                You try to filter by window function result → SQL error!<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Fix:</strong><br />
                Use CTE or subquery to create the window column first, THEN filter in outer query<br />
              </p>

              <div className="mt-2">
                <CodeBlock code={`-- ❌ WRONG: Can't use window function in WHERE
SELECT name,
       ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC) AS rn
FROM hotels
WHERE rn <= 3;  -- ERROR!

-- ✅ RIGHT: Use CTE to filter window results
WITH ranked AS (
    SELECT name,
           ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC) AS rn
    FROM hotels
)
SELECT * FROM ranked WHERE rn <= 3;`} />
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #6: Integer Division</h3>
              <p>
                <strong>What happens:</strong><br />
                You calculate 5/10 expecting 0.5, but get 0 instead!<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Fix:</strong><br />
                Use 100.0 (decimal) in division, not 100 (integer)<br />
              </p>

              <div className="mt-2">
                <CodeBlock code={`-- ❌ WRONG: Integer division gives 0
SELECT 5 / 10;  -- Result: 0

-- ✅ RIGHT: Use decimal
SELECT 5 / 10.0;  -- Result: 0.5

-- Real example: Conversion rate
-- ❌ WRONG
SELECT 100 * converted / total FROM searches;

-- ✅ RIGHT
SELECT 100.0 * converted / total FROM searches;`} />
              </div>
            </div>
          </div>

          <div className="alert alert-warning">
            <strong>🎯 Pre-Test Ritual:</strong> Day before the test, re-read this Mistakes tab.
            On test day, keep these mistakes in the back of your mind as you code!
          </div>
        </>
      )}

      {activeTab === 'checklist' && (
        <>
          <div className="section">
            <h2 className="section-title">Pre-Submit Checklist</h2>
            <p className="section-content">
              <strong>Before clicking Submit on EACH problem, verify all of these!</strong><br />
              This 30-second check can save you from losing points on silly mistakes.
            </p>

            <div className="card">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Output Format Checks
              </h3>
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>All required columns present?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Re-read problem: "Show user_id, name, and total_spent" → Your SELECT has all 3?
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Column names match exactly?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Problem says "total_revenue" → Use AS total_revenue (not revenue, not total)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>ORDER BY correct?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    "Highest to lowest" = DESC, "Oldest to newest" = ASC
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>No SELECT * ?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Only select the columns you need (better performance + matches expected output)
                  </p>
                </div>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Logic Checks
              </h3>
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Correct aggregate?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    "Count bookings" = COUNT(*), "Total revenue" = SUM(amount), "Average" = AVG(amount)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Correct JOIN type?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    "All hotels" or "include 0" = LEFT JOIN. "Only matching" = INNER JOIN
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>WHERE vs HAVING correct?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Row-level filter = WHERE. Aggregate filter = HAVING
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>NULL handling?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Use COALESCE if NULLs should be 0. Use IS NULL (not = NULL)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Decimal division?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Use 100.0 (not 100) when calculating percentages
                  </p>
                </div>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Performance Checks
              </h3>
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Filter early?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    WHERE before JOIN when possible (reduces rows to join)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>No functions on indexed columns?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    WHERE date BETWEEN ... (not WHERE YEAR(date) = 2024)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Used IN for multiple values?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    WHERE country IN ('TH', 'SG', 'MY') instead of country = 'TH' OR country = 'SG' OR...
                  </p>
                </div>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Edge Case Checks
              </h3>
              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>What if no matching data?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    LEFT JOIN or COALESCE to handle empty results
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>What if ties in ranking?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ROW_NUMBER (no ties) vs RANK (gaps) vs DENSE_RANK (no gaps)
                  </p>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>Divide by zero possible?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Use NULLIF(denominator, 0) to avoid errors
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="alert alert-success">
            <strong>💡 Time-Saving Tip:</strong> Print or write this checklist on paper.
            During the test, physically tick off each item before submitting. Takes 30 seconds,
            saves you from losing points!
          </div>

          <div className="mt-2">
            <CodeBlock code={`🎯 FINAL MENTAL CHECK BEFORE SUBMIT:

1. Did I read the problem carefully? (circle keywords!)
2. Does my output match the sample format?
3. Did I test with LIMIT 10 first?
4. Are column names exact?
5. Is ORDER BY correct (ASC vs DESC)?
6. Correct aggregate (SUM vs COUNT vs AVG)?
7. Correct JOIN (INNER vs LEFT)?
8. WHERE vs HAVING correct?
9. Handled NULLs (COALESCE, IS NULL)?
10. Used 100.0 for division?

IF ALL YES → SUBMIT! ✅
IF ANY NO → FIX IT FIRST! ⚠️`} />
          </div>
        </>
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
