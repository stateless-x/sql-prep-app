import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function WindowPatterns({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('intro')

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎯 Window Functions: Pattern Recognition</h1>
        <p className="chapter-subtitle">Learn to spot the pattern in 3 seconds ⚡</p>
      </div>

      <div className="alert alert-warning">
        <strong>🚨 THIS IS YOUR SECRET WEAPON</strong><br />
        Window functions show up in 80%+ of BI SQL tests. Master pattern recognition = ace the test!
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'intro' ? 'active' : ''}`} onClick={() => setActiveTab('intro')}>
          🧠 The Aha! Moment
        </button>
        <button className={`tab ${activeTab === 'topn' ? 'active' : ''}`} onClick={() => setActiveTab('topn')}>
          👑 Top N Pattern
        </button>
        <button className={`tab ${activeTab === 'compare' ? 'active' : ''}`} onClick={() => setActiveTab('compare')}>
          ⏮️ Compare Pattern
        </button>
        <button className={`tab ${activeTab === 'running' ? 'active' : ''}`} onClick={() => setActiveTab('running')}>
          📈 Running Total
        </button>
        <button className={`tab ${activeTab === 'frames' ? 'active' : ''}`} onClick={() => setActiveTab('frames')}>
          🪟 Window Frames
        </button>
        <button className={`tab ${activeTab === 'gotchas' ? 'active' : ''}`} onClick={() => setActiveTab('gotchas')}>
          💣 Gotchas
        </button>
      </div>

      {activeTab === 'intro' && (
        <div className="section">
          <h2 className="section-title">The "Aha!" Moment</h2>

          <div className="card">
            <h3 className="card-title">🎬 Imagine This Conversation</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <strong style={{ color: 'var(--secondary)' }}>Boss:</strong> "Show me each booking with how that user ranks among all our customers by total spend."<br />
              <br />
              <strong style={{ color: 'var(--text-primary)' }}>Your brain:</strong> "Wait... I need ALL bookings (individual rows)... but ALSO each user's rank (calculated across all users)..."<br />
              <br />
              <strong style={{ color: 'var(--danger)' }}>Problem:</strong> GROUP BY would collapse the rows! I'd lose the individual bookings!<br />
              <br />
              <strong style={{ color: 'var(--success)' }}>Solution:</strong> WINDOW FUNCTIONS! Keep all rows + add calculated column! 🎉
            </p>
          </div>

          <div className="alert alert-info mt-2">
            <strong>🎯 The Core Insight:</strong><br />
            Window functions let you "look around" at related rows while staying on your current row.<br />
            <br />
            Think of it like you're in a line at a concert:<br />
            • You can see who's in front of you (LAG)<br />
            • You can see who's behind you (LEAD)<br />
            • You can count everyone in your group (PARTITION BY)<br />
            • You can rank yourself within your group (RANK)<br />
            <br />
            <strong>But you never leave your spot in line!</strong> (Row stays, calculation added)
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🔑 The Pattern Recognition Game</h3>
            <p>
              In HackerRank, when you see certain phrases, your brain should IMMEDIATELY think window function:
            </p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>They Say...</th>
                    <th>You Think...</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>"Top 3 hotels <strong>per city</strong>"</td>
                    <td style={{ color: 'var(--success)' }}>ROW_NUMBER() PARTITION BY city!</td>
                  </tr>
                  <tr>
                    <td>"Compare to <strong>previous month</strong>"</td>
                    <td style={{ color: 'var(--success)' }}>LAG() time!</td>
                  </tr>
                  <tr>
                    <td>"<strong>Running</strong> total of revenue"</td>
                    <td style={{ color: 'var(--success)' }}>SUM() OVER (ORDER BY)!</td>
                  </tr>
                  <tr>
                    <td>"<strong>Rank</strong> users by bookings"</td>
                    <td style={{ color: 'var(--success)' }}>RANK() or ROW_NUMBER()!</td>
                  </tr>
                  <tr>
                    <td>"7-day <strong>moving average</strong>"</td>
                    <td style={{ color: 'var(--success)' }}>AVG() with ROWS BETWEEN!</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-success mt-2">
            <strong>✨ Your New Superpower:</strong><br />
            After this chapter, you'll read a problem and instantly know: "Oh, this is a Top N pattern" or "This is a LAG comparison!"<br />
            <br />
            That 3-second recognition = 10+ minutes saved in the test!
          </div>
        </div>
      )}

      {activeTab === 'topn' && (
        <div className="section">
          <h2 className="section-title">👑 The "Top N Per Group" Pattern</h2>

          <div className="alert alert-warning">
            <strong>🔥 MOST COMMON PATTERN IN BI INTERVIEWS</strong><br />
            If you only memorize ONE pattern, make it this one!
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎯 Spot the Pattern</h3>
            <p>When you see ANY of these phrases:</p>
            <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li>"<strong>Top 3</strong> products <strong>per category</strong>"</li>
              <li>"<strong>Best</strong> hotel in <strong>each city</strong>"</li>
              <li>"<strong>Highest</strong> revenue users <strong>per country</strong>"</li>
              <li>"<strong>Latest</strong> booking <strong>for each customer</strong>"</li>
              <li>"Top <strong>N</strong> whatever <strong>per/in each/by</strong> something"</li>
            </ul>
            <p className="mt-1" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
              <strong>→ Your brain should scream: "ROW_NUMBER() OVER (PARTITION BY _____ ORDER BY _____)!"</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏗️ The Template (Memorize This!)</h3>
            <CodeBlock code={`-- Step 1: Create rankings with CTE
WITH ranked AS (
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY [group_column]    -- "per city" → city
            ORDER BY [value_column] DESC   -- "highest revenue" → revenue DESC
        ) AS rn
    FROM your_table
)
-- Step 2: Filter to top N
SELECT *
FROM ranked
WHERE rn <= 3;  -- "top 3"`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">📖 Real Example: Top 3 Hotels Per City</h3>
            <p><strong>Question:</strong> "Find the top 3 hotels by revenue in each city"</p>

            <p className="mt-2"><strong>Your thought process (3 seconds):</strong></p>
            <ol style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li>"Top 3" → Need ROW_NUMBER</li>
              <li>"per city" → PARTITION BY city</li>
              <li>"by revenue" → ORDER BY revenue DESC</li>
              <li>Then filter WHERE rn &lt;= 3</li>
            </ol>

            <CodeBlock code={`-- The solution (you can write this in 60 seconds now!)
WITH ranked AS (
    SELECT
        city,
        hotel_name,
        revenue,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY revenue DESC
        ) AS rn
    FROM hotels
)
SELECT city, hotel_name, revenue
FROM ranked
WHERE rn <= 3
ORDER BY city, rn;`} />

            <p className="mt-2"><strong>What this does visually:</strong></p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>city</th>
                    <th>hotel_name</th>
                    <th>revenue</th>
                    <th>rn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Bangkok</td>
                    <td>Grand Palace Hotel</td>
                    <td>$500K</td>
                    <td><strong>1</strong> ✅</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Bangkok</td>
                    <td>Riverside Resort</td>
                    <td>$450K</td>
                    <td><strong>2</strong> ✅</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Bangkok</td>
                    <td>City Center Inn</td>
                    <td>$400K</td>
                    <td><strong>3</strong> ✅</td>
                  </tr>
                  <tr style={{ background: 'rgba(100, 100, 100, 0.1)' }}>
                    <td>Bangkok</td>
                    <td>Budget Stay</td>
                    <td>$200K</td>
                    <td>4 ❌ (filtered out)</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Phuket</td>
                    <td>Beach Paradise</td>
                    <td>$600K</td>
                    <td><strong>1</strong> ✅</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Phuket</td>
                    <td>Ocean View</td>
                    <td>$550K</td>
                    <td><strong>2</strong> ✅</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Phuket</td>
                    <td>Sunset Villa</td>
                    <td>$500K</td>
                    <td><strong>3</strong> ✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              ☝️ Notice: Ranking <strong>restarts at 1</strong> for each city! That's PARTITION BY magic!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎨 Variations You'll See</h3>

            <p><strong>Variation 1: "Latest booking per user"</strong></p>
            <CodeBlock code={`WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY booking_date DESC  -- Latest first!
           ) AS rn
    FROM bookings
)
SELECT * FROM ranked WHERE rn = 1;  -- Just the latest (rn = 1, not <= N)`} />

            <p className="mt-2"><strong>Variation 2: "Top 5 with ties included"</strong></p>
            <CodeBlock code={`-- Use DENSE_RANK instead of ROW_NUMBER
WITH ranked AS (
    SELECT *,
           DENSE_RANK() OVER (
               PARTITION BY category
               ORDER BY sales DESC
           ) AS rn
    FROM products
)
SELECT * FROM ranked WHERE rn <= 5;  -- Includes ties!`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>💪 Practice Recognition:</strong><br />
            Next time you see "top", "best", "latest", "highest" + "per/each/by/in" → immediately think:<br />
            <br />
            <code style={{ fontSize: '1.05rem' }}>ROW_NUMBER() OVER (PARTITION BY ___ ORDER BY ___)</code>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="section">
          <h2 className="section-title">⏮️ The "Compare to Previous/Next" Pattern</h2>

          <div className="card">
            <h3 className="card-title">🎯 Spot the Pattern</h3>
            <p>When you see these magic words:</p>
            <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li>"<strong>Compare to previous</strong> month"</li>
              <li>"<strong>Growth</strong> from last period"</li>
              <li>"<strong>Change</strong> since yesterday"</li>
              <li>"<strong>Difference</strong> between consecutive days"</li>
              <li>"<strong>Next</strong> value in sequence"</li>
            </ul>
            <p className="mt-1" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
              <strong>→ Think: LAG() or LEAD()!</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🔍 LAG() vs LEAD() - Visual Explanation</h3>
            <p>
              Imagine you're standing in a row of people. Each person has a number:<br />
              <br />
              <strong style={{ color: 'var(--warning)' }}>Person 1</strong> →
              <strong style={{ color: 'var(--warning)' }}> Person 2</strong> →
              <strong style={{ color: 'var(--success)' }}> 👤 YOU (Person 3)</strong> →
              <strong style={{ color: 'var(--warning)' }}> Person 4</strong> →
              <strong style={{ color: 'var(--warning)' }}> Person 5</strong>
            </p>
            <ul className="mt-1" style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li><strong>LAG()</strong> = Look <strong>backwards</strong> (Person 2's value)</li>
              <li><strong>LEAD()</strong> = Look <strong>forwards</strong> (Person 4's value)</li>
            </ul>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">📖 Example: Month-over-Month Growth</h3>
            <p><strong>Question:</strong> "Show monthly revenue and the % change from previous month"</p>

            <CodeBlock code={`SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month_revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) AS change_amount,
    ROUND(
        100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
        / LAG(revenue) OVER (ORDER BY month),
        2
    ) AS growth_pct
FROM monthly_stats
ORDER BY month;`} />

            <p className="mt-2"><strong>Result visualization:</strong></p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>month</th>
                    <th>revenue</th>
                    <th>prev_month</th>
                    <th>change</th>
                    <th>growth_pct</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>2024-01</td>
                    <td>$100K</td>
                    <td><em style={{ color: 'var(--text-muted)' }}>NULL</em></td>
                    <td><em style={{ color: 'var(--text-muted)' }}>NULL</em></td>
                    <td><em style={{ color: 'var(--text-muted)' }}>NULL</em></td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>2024-02</td>
                    <td>$120K</td>
                    <td>$100K ⬅️</td>
                    <td>+$20K</td>
                    <td style={{ color: 'var(--success)' }}>+20%</td>
                  </tr>
                  <tr style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                    <td>2024-03</td>
                    <td>$110K</td>
                    <td>$120K ⬅️</td>
                    <td>-$10K</td>
                    <td style={{ color: 'var(--danger)' }}>-8.33%</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>2024-04</td>
                    <td>$150K</td>
                    <td>$110K ⬅️</td>
                    <td>+$40K</td>
                    <td style={{ color: 'var(--success)' }}>+36.36%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
              ☝️ Notice: First row has NULL for prev_month (no previous row exists!)
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎛️ LAG/LEAD Parameters</h3>
            <CodeBlock code={`LAG(column, offset, default_value) OVER (ORDER BY...)

-- LAG(revenue, 1)      → Previous row (1 row back)
-- LAG(revenue, 2)      → 2 rows back
-- LAG(revenue, 1, 0)   → Previous row, but use 0 if NULL

-- Same for LEAD:
-- LEAD(revenue, 1)     → Next row
-- LEAD(revenue, 2)     → 2 rows ahead`} />

            <p className="mt-2"><strong>Pro tip:</strong> Use the default value to avoid NULLs!</p>
            <CodeBlock code={`-- Instead of NULL for first row, show 0
LAG(revenue, 1, 0) OVER (ORDER BY month)`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🌟 Common Variations</h3>

            <p><strong>With PARTITION BY (compare within groups):</strong></p>
            <CodeBlock code={`-- Compare each user's booking to their PREVIOUS booking
SELECT
    user_id,
    booking_date,
    amount,
    LAG(amount) OVER (
        PARTITION BY user_id  -- Compare within same user!
        ORDER BY booking_date
    ) AS prev_booking_amount
FROM bookings;`} />

            <p className="mt-2"><strong>Calculating streaks (did value increase?):</strong></p>
            <CodeBlock code={`SELECT
    date,
    revenue,
    CASE
        WHEN revenue > LAG(revenue) OVER (ORDER BY date) THEN '📈 Up'
        WHEN revenue < LAG(revenue) OVER (ORDER BY date) THEN '📉 Down'
        ELSE '➡️ Same'
    END AS trend
FROM daily_stats;`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>🧠 Remember:</strong><br />
            • LAG = look backwards in time ⏮️<br />
            • LEAD = look forwards in time ⏭️<br />
            • ORDER BY determines what's "previous" or "next"<br />
            • PARTITION BY makes it compare within groups<br />
            • First/last rows will have NULL (unless you set default)
          </div>
        </div>
      )}

      {activeTab === 'running' && (
        <div className="section">
          <h2 className="section-title">📈 The "Running Total" Pattern</h2>

          <div className="card">
            <h3 className="card-title">🎯 Spot the Pattern</h3>
            <p>When you hear:</p>
            <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li>"<strong>Running</strong> total"</li>
              <li>"<strong>Cumulative</strong> sum"</li>
              <li>"<strong>Year-to-date</strong> revenue"</li>
              <li>"<strong>Accumulated</strong> count"</li>
            </ul>
            <p className="mt-1" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
              <strong>→ Think: SUM() OVER (ORDER BY date)!</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏗️ The Simple Template</h3>
            <CodeBlock code={`SELECT
    date,
    daily_amount,
    SUM(daily_amount) OVER (ORDER BY date) AS running_total
FROM transactions;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">📖 Visual Example</h3>
            <p><strong>Question:</strong> "Show daily bookings and cumulative bookings for January"</p>

            <CodeBlock code={`SELECT
    booking_date,
    COUNT(*) AS daily_bookings,
    SUM(COUNT(*)) OVER (ORDER BY booking_date) AS cumulative_bookings
FROM bookings
WHERE booking_date >= '2024-01-01' AND booking_date < '2024-02-01'
GROUP BY booking_date;`} />

            <div className="table-container mt-2">
              <table>
                <thead>
                  <tr>
                    <th>date</th>
                    <th>daily</th>
                    <th>cumulative</th>
                    <th>How it's calculated</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jan 1</td>
                    <td>100</td>
                    <td><strong>100</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>100</td>
                  </tr>
                  <tr>
                    <td>Jan 2</td>
                    <td>150</td>
                    <td><strong>250</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>100 + 150</td>
                  </tr>
                  <tr>
                    <td>Jan 3</td>
                    <td>120</td>
                    <td><strong>370</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>100 + 150 + 120</td>
                  </tr>
                  <tr style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                    <td>Jan 4</td>
                    <td>200</td>
                    <td><strong>570</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>100 + 150 + 120 + 200</td>
                  </tr>
                  <tr>
                    <td>Jan 5</td>
                    <td>180</td>
                    <td><strong>750</strong></td>
                    <td style={{ fontSize: '0.9rem' }}>All previous + 180</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ fontSize: '0.95rem', color: 'var(--success)' }}>
              ☝️ Each row adds to the sum of all previous rows!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎨 Running Total Per Group</h3>
            <p>What if you want running total <strong>per country</strong>?</p>

            <CodeBlock code={`SELECT
    country,
    booking_date,
    daily_bookings,
    SUM(daily_bookings) OVER (
        PARTITION BY country       -- Reset for each country!
        ORDER BY booking_date
    ) AS country_cumulative
FROM daily_stats;`} />

            <p className="mt-2"><strong>What this looks like:</strong></p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>country</th>
                    <th>date</th>
                    <th>daily</th>
                    <th>cumulative</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                    <td><strong>Thailand</strong></td>
                    <td>Jan 1</td>
                    <td>50</td>
                    <td>50</td>
                  </tr>
                  <tr style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                    <td><strong>Thailand</strong></td>
                    <td>Jan 2</td>
                    <td>75</td>
                    <td>125</td>
                  </tr>
                  <tr style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
                    <td><strong>Thailand</strong></td>
                    <td>Jan 3</td>
                    <td>60</td>
                    <td>185</td>
                  </tr>
                  <tr style={{ background: 'rgba(236, 72, 153, 0.05)' }}>
                    <td><strong>Japan</strong></td>
                    <td>Jan 1</td>
                    <td>30</td>
                    <td>30 ⬅️ Starts over!</td>
                  </tr>
                  <tr style={{ background: 'rgba(236, 72, 153, 0.05)' }}>
                    <td><strong>Japan</strong></td>
                    <td>Jan 2</td>
                    <td>45</td>
                    <td>75</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ fontSize: '0.95rem', color: 'var(--warning)' }}>
              ☝️ Notice: Cumulative total RESETS for each country!
            </p>
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Quick Tips:</strong><br />
            • No PARTITION BY = one running total across everything<br />
            • With PARTITION BY = running total restarts for each group<br />
            • ORDER BY determines the sequence (usually date/time)<br />
            • Works with SUM, COUNT, AVG, MIN, MAX
          </div>
        </div>
      )}

      {activeTab === 'frames' && (
        <div className="section">
          <h2 className="section-title">🪟 Window Frames (The Moving Average Secret)</h2>

          <div className="alert alert-info">
            <strong>🤔 Quick question:</strong><br />
            What's the difference between these two?<br />
            <br />
            <code>SUM(amount) OVER (ORDER BY date)</code><br />
            <code>SUM(amount) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)</code><br />
            <br />
            <strong>Answer:</strong> The first = running total (ALL previous rows)<br />
            The second = sum of just the last 7 rows (moving window!)
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎯 When You Need This</h3>
            <p>Spot these keywords:</p>
            <ul style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <li>"<strong>7-day</strong> moving average"</li>
              <li>"<strong>Last 3 months</strong> total"</li>
              <li>"<strong>Rolling</strong> sum"</li>
              <li>"<strong>Previous N</strong> records"</li>
            </ul>
            <p className="mt-1" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
              <strong>→ Think: ROWS BETWEEN!</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">📖 Example: 7-Day Moving Average</h3>
            <p><strong>Question:</strong> "Calculate the 7-day moving average of daily bookings"</p>

            <CodeBlock code={`SELECT
    booking_date,
    daily_bookings,
    AVG(daily_bookings) OVER (
        ORDER BY booking_date
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS ma_7day
FROM daily_stats;`} />

            <div className="table-container mt-2">
              <table>
                <thead>
                  <tr>
                    <th>date</th>
                    <th>daily</th>
                    <th>7-day avg</th>
                    <th>Which rows included?</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jan 1</td>
                    <td>100</td>
                    <td>100</td>
                    <td style={{ fontSize: '0.85rem' }}>Just day 1</td>
                  </tr>
                  <tr>
                    <td>Jan 2</td>
                    <td>120</td>
                    <td>110</td>
                    <td style={{ fontSize: '0.85rem' }}>Days 1-2</td>
                  </tr>
                  <tr>
                    <td>Jan 3</td>
                    <td>110</td>
                    <td>110</td>
                    <td style={{ fontSize: '0.85rem' }}>Days 1-3</td>
                  </tr>
                  <tr>
                    <td>...</td>
                    <td>...</td>
                    <td>...</td>
                    <td style={{ fontSize: '0.85rem' }}>...</td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Jan 10</td>
                    <td>150</td>
                    <td>125</td>
                    <td style={{ fontSize: '0.85rem' }}><strong>Days 4-10 (7 days!)</strong></td>
                  </tr>
                  <tr style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                    <td>Jan 11</td>
                    <td>140</td>
                    <td>128</td>
                    <td style={{ fontSize: '0.85rem' }}><strong>Days 5-11 (7 days)</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1" style={{ fontSize: '0.95rem', color: 'var(--warning)' }}>
              ☝️ The window "slides" forward! Always includes current row + 6 before it.
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🔢 Understanding "6 PRECEDING"</h3>
            <p style={{ fontSize: '1.05rem', lineHeight: '1.8' }}>
              <strong>Brain teaser:</strong> Why "6 PRECEDING" for a 7-day average?<br />
              <br />
              <strong>Answer:</strong> Because you also include CURRENT ROW!<br />
              <br />
              6 rows before + 1 current row = 7 total rows ✅
            </p>
            <CodeBlock code={`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
             ↑                    ↑
          6 rows back      + this row = 7 total`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🎛️ Frame Options Cheat Sheet</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Frame</th>
                    <th>Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code className="inline-code">ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code></td>
                    <td>Last 7 rows (including current)</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code></td>
                    <td>Running total (all rows from start)</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING</code></td>
                    <td>3 rows: previous, current, next</td>
                  </tr>
                  <tr>
                    <td><code className="inline-code">ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING</code></td>
                    <td>Current + all future rows</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-warning mt-2">
            <strong>⚠️ Common Mistake:</strong><br />
            <code>ROWS BETWEEN 7 PRECEDING AND CURRENT ROW</code> = 8 rows, not 7!<br />
            <br />
            For N-day window, use <code>N-1 PRECEDING</code>
          </div>
        </div>
      )}

      {activeTab === 'gotchas' && (
        <div className="section">
          <h2 className="section-title">💣 Window Function Gotchas</h2>

          <div className="alert alert-warning">
            <strong>🚨 These trip up even experienced developers!</strong>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Gotcha #1: Can't Use Window Functions in WHERE</h3>
            <CodeBlock code={`-- ❌ THIS FAILS:
SELECT user_id, revenue,
       ROW_NUMBER() OVER (ORDER BY revenue DESC) AS rank
FROM users
WHERE rank <= 10;  -- ERROR! Window functions don't work in WHERE

-- ✅ SOLUTION: Use CTE or subquery
WITH ranked AS (
    SELECT user_id, revenue,
           ROW_NUMBER() OVER (ORDER BY revenue DESC) AS rank
    FROM users
)
SELECT * FROM ranked WHERE rank <= 10;`} />
            <p className="mt-1" style={{ color: 'var(--danger)' }}>
              <strong>Why?</strong> WHERE runs BEFORE window functions. The rank doesn't exist yet!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Gotcha #2: ORDER BY in Window ≠ Query ORDER BY</h3>
            <CodeBlock code={`SELECT
    city,
    hotel_name,
    ROW_NUMBER() OVER (ORDER BY revenue DESC) AS overall_rank
FROM hotels
ORDER BY city;  -- Different from window ORDER BY!`} />
            <p className="mt-1" style={{ color: 'var(--warning)' }}>
              <strong>Result:</strong> Rows ordered by city, but rank is based on revenue!<br />
              The two ORDER BYs are independent!
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Gotcha #3: RANK vs ROW_NUMBER with Ties</h3>
            <p>What happens when two hotels have the same revenue?</p>
            <div className="table-container mt-1">
              <table>
                <thead>
                  <tr>
                    <th>hotel</th>
                    <th>revenue</th>
                    <th>ROW_NUMBER</th>
                    <th>RANK</th>
                    <th>DENSE_RANK</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Hotel A</td>
                    <td>$100K</td>
                    <td>1</td>
                    <td>1</td>
                    <td>1</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td>Hotel B</td>
                    <td>$90K</td>
                    <td>2</td>
                    <td>2</td>
                    <td>2</td>
                  </tr>
                  <tr style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                    <td>Hotel C</td>
                    <td>$90K</td>
                    <td>3 ⚠️</td>
                    <td>2 (tie!)</td>
                    <td>2 (tie!)</td>
                  </tr>
                  <tr>
                    <td>Hotel D</td>
                    <td>$80K</td>
                    <td>4</td>
                    <td>4 (gap!)</td>
                    <td>3 (no gap)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-1">
              <strong>Use ROW_NUMBER when:</strong> You need exactly N rows (top 10 = 10 rows, even if ties)<br />
              <strong>Use RANK when:</strong> Ties should have same rank, gaps are OK<br />
              <strong>Use DENSE_RANK when:</strong> Ties should have same rank, no gaps
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Gotcha #4: LAST_VALUE Default Frame</h3>
            <CodeBlock code={`-- ❌ CONFUSING: This often doesn't do what you expect!
SELECT
    date,
    FIRST_VALUE(amount) OVER (ORDER BY date) AS first,
    LAST_VALUE(amount) OVER (ORDER BY date) AS last  -- ⚠️ Gotcha!
FROM sales;

-- Default frame = "RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW"
-- So LAST_VALUE = current row value! Not the actual last!

-- ✅ EXPLICIT FRAME:
LAST_VALUE(amount) OVER (
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
) AS actual_last`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Gotcha #5: NULLs in ORDER BY</h3>
            <CodeBlock code={`-- What happens if revenue is NULL?
ROW_NUMBER() OVER (ORDER BY revenue DESC)

-- NULLs come first or last depending on database!
-- PostgreSQL: NULLs LAST by default
-- MySQL: NULLs FIRST by default

-- ✅ BE EXPLICIT:
ROW_NUMBER() OVER (ORDER BY revenue DESC NULLS LAST)`} />
          </div>

          <div className="alert alert-success mt-2">
            <strong>✅ Quick Checklist Before Submitting:</strong><br />
            <br />
            ☐ Did I try to use window function in WHERE? (use CTE instead)<br />
            ☐ Do I need ROW_NUMBER (no ties) or RANK (with ties)?<br />
            ☐ Is my window ORDER BY what I actually want?<br />
            ☐ Am I using LAST_VALUE? (check if I need explicit frame)<br />
            ☐ Could there be NULLs? (handle them in ORDER BY)
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
