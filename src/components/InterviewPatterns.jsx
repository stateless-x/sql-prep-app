import { useState } from 'react'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'
import RecallBox from './RecallBox'

const patterns = [
  {
    id: 1,
    title: '1. Conversion Rate',
    code: `SELECT
    platform,
    COUNT(*) AS searches,
    SUM(CASE WHEN converted THEN 1 ELSE 0 END) AS conversions,
    ROUND(100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*), 2) AS conv_rate
FROM searches
GROUP BY platform;`
  },
  {
    id: 2,
    title: '2. Find Missing (No Match)',
    code: `-- "Users who searched but never booked"
SELECT DISTINCT s.user_id
FROM searches s
LEFT JOIN bookings b ON s.user_id = b.user_id
WHERE b.booking_id IS NULL;`
  },
  {
    id: 3,
    title: '3. Top N Per Group ⭐⭐⭐',
    code: `-- "Top 3 hotels per city by revenue"
WITH ranked AS (
    SELECT
        h.city, h.name,
        SUM(b.amount) AS revenue,
        ROW_NUMBER() OVER (
            PARTITION BY h.city
            ORDER BY SUM(b.amount) DESC
        ) AS rn
    FROM hotels h
    JOIN bookings b ON h.hotel_id = b.hotel_id
    GROUP BY h.city, h.hotel_id, h.name
)
SELECT * FROM ranked WHERE rn <= 3;`
  },
  {
    id: 4,
    title: '4. Period Comparison (MoM, YoY)',
    code: `-- "Compare this month to last month"
WITH monthly AS (
    SELECT
        DATE_TRUNC('month', booking_date) AS month,
        SUM(amount) AS revenue
    FROM bookings
    GROUP BY 1
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER (ORDER BY month) AS prev_month,
    revenue - LAG(revenue) OVER (ORDER BY month) AS change
FROM monthly;`
  },
  {
    id: 5,
    title: '5. Running Total',
    code: `SELECT
    booking_date,
    SUM(amount) AS daily_revenue,
    SUM(SUM(amount)) OVER (ORDER BY booking_date) AS cumulative
FROM bookings
GROUP BY booking_date;`
  },
  {
    id: 6,
    title: '6. First-Time vs Returning',
    code: `WITH first_booking AS (
    SELECT user_id, MIN(booking_date) AS first_date
    FROM bookings GROUP BY user_id
)
SELECT
    DATE_TRUNC('month', b.booking_date) AS month,
    SUM(CASE WHEN b.booking_date = fb.first_date THEN b.amount ELSE 0 END) AS new_user_rev,
    SUM(CASE WHEN b.booking_date > fb.first_date THEN b.amount ELSE 0 END) AS returning_rev
FROM bookings b
JOIN first_booking fb ON b.user_id = fb.user_id
GROUP BY 1;`
  },
  {
    id: 7,
    title: '7. Retention / Repeat Rate',
    code: `WITH user_counts AS (
    SELECT user_id, COUNT(*) AS bookings
    FROM bookings GROUP BY user_id
)
SELECT
    COUNT(*) AS total_users,
    SUM(CASE WHEN bookings > 1 THEN 1 ELSE 0 END) AS repeat_users,
    ROUND(100.0 * SUM(CASE WHEN bookings > 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS repeat_rate
FROM user_counts;`
  },
  {
    id: 8,
    title: '8. Deduplication',
    code: `-- "Keep only latest booking per user"
WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) AS rn
    FROM bookings
)
SELECT * FROM ranked WHERE rn = 1;`
  }
]

export default function InterviewPatterns({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('recognition')
  const [selectedPattern, setSelectedPattern] = useState(0)

  const tabs = [
    { id: 'recognition', label: '🔍 Pattern Recognition', time: '5 min' },
    { id: 'patterns', label: '📊 The 8 Patterns', time: '15 min' },
    { id: 'framework', label: '🎯 4-Step Framework', time: '5 min' },
    { id: 'time', label: '⏱️ Time Management', time: '5 min' },
    { id: 'mistakes', label: '⚠️ Common Mistakes', time: '5 min' },
    { id: 'checklist', label: '✅ Pre-Submit', time: '5 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎯 Interview Patterns & Strategy</h1>
        <p className="chapter-subtitle">Ace the HackerRank test like a pro</p>
      </div>

      <LearningObjectives
        objectives={[
          'Recognize keywords in problems and map to SQL patterns',
          'Master the 8 most common interview patterns',
          'Use the 4-step framework for every problem',
          'Manage your 60-minute time budget effectively',
          'Avoid mistakes that cost you points'
        ]}
        time="40 min"
      />

      <TLDRBox
        points={[
          '"conversion rate" → CASE WHEN + division',
          '"top N per group" → ROW_NUMBER() OVER (PARTITION BY...)',
          '"never booked" → LEFT JOIN + WHERE IS NULL',
          '4-Step Framework: Read & Identify → Plan → Test Small → Submit',
          'Stuck at 10 min rule: Skip and come back later',
          'Before submit: Check output format, aggregates, NULLs'
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

      {activeTab === 'recognition' && (
        <>
          <div className="section">
            <h2 className="section-title">Quick Recognition Guide</h2>
            <p className="section-content">
              <strong>Memorize this table!</strong> When you see these keywords, immediately know which pattern to use.
            </p>

            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <th>Question Contains</th>
                    <th>Pattern</th>
                    <th>SQL Approach</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"conversion rate", "% who", "percentage"</td>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>Conversion funnel</td>
                    <td>CASE WHEN + 100.0 * converted / total</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"but not", "never", "without", "missing"</td>
                    <td style={{ color: '#2196F3', fontWeight: 600 }}>LEFT JOIN + IS NULL</td>
                    <td>LEFT JOIN ... WHERE right.id IS NULL</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"top N per", "best in each", "highest per"</td>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>ROW_NUMBER + WHERE</td>
                    <td>ROW_NUMBER() OVER (PARTITION BY...)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"compare to previous", "growth", "change from"</td>
                    <td style={{ color: '#E91E63', fontWeight: 600 }}>LAG/LEAD</td>
                    <td>LAG(value) OVER (ORDER BY date)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"cumulative", "running", "year-to-date"</td>
                    <td style={{ color: '#9C27B0', fontWeight: 600 }}>Running total</td>
                    <td>SUM() OVER (ORDER BY date)</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"first time", "new vs returning"</td>
                    <td style={{ color: '#00BCD4', fontWeight: 600 }}>MIN() + compare</td>
                    <td>MIN(date) in CTE, then compare</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"retention", "repeat", "came back"</td>
                    <td style={{ color: '#FF5722', fontWeight: 600 }}>COUNT + CASE</td>
                    <td>COUNT(*) with CASE for repeat</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 600 }}>"latest", "most recent", "deduplicate"</td>
                    <td style={{ color: '#795548', fontWeight: 600 }}>ROW_NUMBER = 1</td>
                    <td>ROW_NUMBER() ... WHERE rn = 1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="alert alert-success mt-2">
            <strong>💡 Pro Tip:</strong> During the test, come back to this tab when stuck.
            Find the keyword, use the pattern!
          </div>
        </>
      )}

      {activeTab === 'patterns' && (
        <>
          <div className="section">
            <h2 className="section-title">The 8 Core Patterns</h2>
            <p className="section-content">
              <strong>80% of interview questions use these patterns!</strong> Memorize them.
            </p>

            <div className="tabs" style={{ overflowX: 'auto', flexWrap: 'nowrap', marginBottom: '1.5rem' }}>
              {patterns.map((pattern, idx) => (
                <button
                  key={pattern.id}
                  className={`tab ${selectedPattern === idx ? 'active' : ''}`}
                  onClick={() => setSelectedPattern(idx)}
                >
                  {pattern.title.split('.')[0]}
                </button>
              ))}
            </div>

            <div className="card">
              <h3 className="card-title">{patterns[selectedPattern].title}</h3>
              <CodeBlock code={patterns[selectedPattern].code} />
            </div>
          </div>

          <RecallBox
            chapter="Window Functions & Patterns"
            concept="ROW_NUMBER() with PARTITION BY is the #1 most common interview pattern!"
          />

          <div className="alert alert-success">
            <strong>💪 Practice:</strong> Try to write each pattern from memory before the test!
          </div>
        </>
      )}

      {activeTab === 'framework' && (
        <>
          <div className="section">
            <h2 className="section-title">The 4-Step Framework</h2>
            <p className="section-content">
              <strong>Use this for EVERY problem. No exceptions!</strong>
            </p>

            <div className="card" style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
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

            <div className="card mt-2" style={{ background: 'rgba(33, 150, 243, 0.1)' }}>
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

            <div className="card mt-2" style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
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
            </div>

            <div className="card mt-2" style={{ background: 'rgba(156, 39, 176, 0.1)' }}>
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

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--danger)' }}>
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

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
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

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--danger)' }}>
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

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--danger)' }}>
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
            </div>

            <div className="card mt-2" style={{ borderLeft: '4px solid var(--danger)' }}>
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ Mistake #4: Integer Division</h3>
              <p>
                <strong>What happens:</strong><br />
                You calculate 5/10 expecting 0.5, but get 0 instead!<br />
                <br />
                <strong style={{ color: '#4CAF50' }}>Fix:</strong><br />
                Use 100.0 (decimal) in division, not 100 (integer)<br />
              </p>

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

                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" disabled style={{ width: '18px', height: '18px' }} />
                    <strong>No SELECT * ?</strong>
                  </label>
                  <p style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Only select the columns you need
                  </p>
                </div>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Logic Checks
              </h3>
              <div style={{ padding: '1rem' }}>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>☑️ Correct aggregate (COUNT vs SUM vs AVG)?</li>
                  <li>☑️ Correct JOIN type (INNER vs LEFT)?</li>
                  <li>☑️ WHERE vs HAVING used correctly?</li>
                  <li>☑️ GROUP BY includes all non-aggregated columns?</li>
                  <li>☑️ NULL handling (COALESCE, IS NULL)?</li>
                  <li>☑️ Decimal division (100.0 not 100)?</li>
                </ul>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                ✅ Edge Cases
              </h3>
              <div style={{ padding: '1rem' }}>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>☑️ What if no matching data?</li>
                  <li>☑️ What if NULLs in data?</li>
                  <li>☑️ What if ties in ranking?</li>
                  <li>☑️ What if divide by zero?</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="alert alert-success">
            <strong>💡 Time-Saving Tip:</strong> Print or write this checklist on paper.
            During the test, physically tick off each item before submitting. Takes 30 seconds,
            saves you from losing points!
          </div>
        </>
      )}

      <KeyTakeaways
        points={[
          'Memorize keyword → pattern mapping: "top N per" → ROW_NUMBER()',
          'Use 4-step framework for EVERY problem',
          'Stuck at 10 min? Skip and come back later',
          'Test small first: Add LIMIT 10, verify, then remove',
          'Before submit: Check column names, ORDER BY, aggregates, NULLs',
          'Use 100.0 for division, not 100 (avoid integer division)',
          'Easy problems first = quick confidence + points'
        ]}
        nextChapter="Read '🎬 Mock Test' to practice under timed conditions"
        relatedChapters="'📋 SQL Reference' for quick syntax lookup during test"
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
