import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function Cheatsheet({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('patterns')

  const tabs = [
    { id: 'patterns', label: '🔍 Pattern Matching' },
    { id: 'syntax', label: '📝 Syntax Quick Ref' },
    { id: 'performance', label: '⚡ Performance' },
    { id: 'checklist', label: '✅ Checklists' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📋 Cheatsheet</h1>
        <p className="chapter-subtitle">Quick reference - Print this!</p>
      </div>

      <div className="alert alert-success">
        <strong>💡 Pro Tip:</strong> Review this the morning of your test!
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

      {activeTab === 'patterns' && (
        <>
          <div className="section">
            <h2 className="section-title">🎯 When You See This... Think This!</h2>
            <p className="section-content">
              <strong>Memorize these keyword → solution mappings!</strong>
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

          <div className="section">
            <h2 className="section-title">Common Pattern Templates</h2>

            <div className="card">
              <h3 className="card-title" style={{ color: '#4CAF50' }}>Top N per Group (Most Common!)</h3>
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
              <h3 className="card-title" style={{ color: '#2196F3' }}>Find Missing Records</h3>
              <CodeBlock code={`SELECT a.*
FROM left_table a
LEFT JOIN right_table b ON a.id = b.id
WHERE b.id IS NULL;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#FF9800' }}>Running Total / Cumulative</h3>
              <CodeBlock code={`SELECT date, amount,
       SUM(amount) OVER (
           PARTITION BY user_id
           ORDER BY date
       ) AS running_total
FROM transactions;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#E91E63' }}>Compare to Previous Row</h3>
              <CodeBlock code={`SELECT date, value,
       value - LAG(value) OVER (
           PARTITION BY category
           ORDER BY date
       ) AS change_from_previous
FROM metrics;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#9C27B0' }}>Conversion Rate / Percentage</h3>
              <CodeBlock code={`SELECT category,
       100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*) AS conversion_rate
FROM events
GROUP BY category;`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'syntax' && (
        <>
          <div className="section">
            <h2 className="section-title">Execution Order (Memorize!)</h2>
            <CodeBlock code={`FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT

Remember: WHERE runs BEFORE grouping, HAVING runs AFTER`} />
          </div>

          <div className="section">
            <h2 className="section-title">WHERE vs HAVING</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>WHERE</th>
                    <th>HAVING</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>When</strong></td>
                    <td>Before GROUP BY</td>
                    <td>After GROUP BY</td>
                  </tr>
                  <tr>
                    <td><strong>Can use aggregates?</strong></td>
                    <td style={{ color: '#F44336', fontWeight: 600 }}>❌ NO</td>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>✅ YES</td>
                  </tr>
                  <tr>
                    <td><strong>Use for</strong></td>
                    <td>Row-level filters<br />(status = 'completed')</td>
                    <td>Aggregate filters<br />(SUM(amount) &gt; 1000)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">JOIN Types</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Returns</th>
                    <th>Use When</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>INNER JOIN</strong></td>
                    <td>Only matches</td>
                    <td>"users who made bookings"</td>
                  </tr>
                  <tr>
                    <td><strong>LEFT JOIN</strong></td>
                    <td>All left + matches (right NULLs)</td>
                    <td>"all hotels, even without bookings"</td>
                  </tr>
                  <tr>
                    <td><strong>LEFT + IS NULL</strong></td>
                    <td>Left with no match</td>
                    <td>"hotels with NO bookings"</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Aggregates Quick Ref</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Function</th>
                    <th>What It Does</th>
                    <th>NULL Behavior</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>COUNT(*)</code></td>
                    <td>Number of rows</td>
                    <td>Counts NULLs</td>
                  </tr>
                  <tr>
                    <td><code>COUNT(col)</code></td>
                    <td>Non-NULL values in column</td>
                    <td>Skips NULLs</td>
                  </tr>
                  <tr>
                    <td><code>SUM(col)</code></td>
                    <td>Total of values</td>
                    <td>Skips NULLs</td>
                  </tr>
                  <tr>
                    <td><code>AVG(col)</code></td>
                    <td>Average</td>
                    <td>Skips NULLs (can skew results!)</td>
                  </tr>
                  <tr>
                    <td><code>MAX(col)</code></td>
                    <td>Highest value</td>
                    <td>Skips NULLs</td>
                  </tr>
                  <tr>
                    <td><code>MIN(col)</code></td>
                    <td>Lowest value</td>
                    <td>Skips NULLs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Window Functions Syntax</h2>
            <CodeBlock code={`FUNCTION() OVER (
    PARTITION BY category  -- Optional: separate groups
    ORDER BY value         -- Optional (required for LAG/LEAD/running totals)
    ROWS BETWEEN ...       -- Optional: for moving averages
)

Common Functions:
ROW_NUMBER()   -- 1, 2, 3, 4 (always unique)
RANK()         -- 1, 1, 3, 4 (ties get same, gaps after)
DENSE_RANK()   -- 1, 1, 2, 3 (ties get same, no gaps)
SUM() OVER     -- Running total
LAG(col)       -- Previous row value
LEAD(col)      -- Next row value`} />
          </div>

          <div className="section">
            <h2 className="section-title">NULL Handling</h2>
            <CodeBlock code={`-- Check for NULL
WHERE col IS NULL
WHERE col IS NOT NULL

-- Replace NULL with default
COALESCE(col, 0)           -- First non-NULL value
COALESCE(col, 'N/A')

-- Avoid divide by zero
col / NULLIF(divisor, 0)   -- Returns NULL if divisor = 0

-- NULL in comparisons
NULL = NULL        → NULL (not TRUE!)
NULL = 5           → NULL
NULL AND TRUE      → NULL
NULL OR TRUE       → TRUE`} />
          </div>
        </>
      )}

      {activeTab === 'performance' && (
        <>
          <div className="section">
            <h2 className="section-title">⚡ Speed Hierarchy (Fast → Slow)</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Speed</th>
                    <th>Operation</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.15)' }}>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>⚡⚡⚡ FASTEST</td>
                    <td>Index lookup</td>
                    <td><code>WHERE id = 123</code></td>
                  </tr>
                  <tr style={{ background: 'rgba(76, 175, 80, 0.1)' }}>
                    <td style={{ color: '#4CAF50', fontWeight: 600 }}>⚡⚡ FAST</td>
                    <td>Index scan + LIMIT</td>
                    <td><code>WHERE status = 'active' LIMIT 10</code></td>
                  </tr>
                  <tr style={{ background: 'rgba(255, 152, 0, 0.1)' }}>
                    <td style={{ color: '#FF9800', fontWeight: 600 }}>🐌 SLOWER</td>
                    <td>Full table scan</td>
                    <td><code>SELECT * FROM large_table</code></td>
                  </tr>
                  <tr style={{ background: 'rgba(244, 67, 54, 0.1)' }}>
                    <td style={{ color: '#F44336', fontWeight: 600 }}>🐢 SLOW</td>
                    <td>Function on column</td>
                    <td><code>WHERE YEAR(date) = 2024</code></td>
                  </tr>
                  <tr style={{ background: 'rgba(244, 67, 54, 0.2)' }}>
                    <td style={{ color: '#F44336', fontWeight: 600 }}>🐌💀 SLOWEST</td>
                    <td>Cartesian join, correlated subquery</td>
                    <td><code>FROM a, b (no ON)</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Quick Wins (Easy Performance Boosts)</h2>

            <div className="card">
              <h3 className="card-title" style={{ color: '#4CAF50' }}>✅ DO</h3>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li><strong>Filter early:</strong> WHERE before JOIN</li>
                <li><strong>Use LIMIT:</strong> Especially during testing</li>
                <li><strong>Decimal division:</strong> <code>100.0</code> not <code>100</code></li>
                <li><strong>Use IN:</strong> <code>IN ('A', 'B', 'C')</code> instead of multiple OR</li>
                <li><strong>Index-friendly WHERE:</strong> <code>WHERE date BETWEEN</code> not <code>WHERE YEAR(date) = 2024</code></li>
                <li><strong>EXISTS for checking:</strong> <code>WHERE EXISTS (...)</code> faster than <code>WHERE id IN (SELECT ...)</code> for large sets</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ color: '#F44336' }}>❌ AVOID</h3>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li><strong>SELECT *:</strong> Only select columns you need</li>
                <li><strong>Functions on columns:</strong> Breaks index usage</li>
                <li><strong>Correlated subquery in SELECT:</strong> Runs once per row!</li>
                <li><strong>DISTINCT to hide bad JOIN:</strong> Fix the JOIN instead</li>
                <li><strong>Leading % in LIKE:</strong> <code>LIKE '%end'</code> can't use index</li>
                <li><strong>Multiple passes:</strong> Don't query same table multiple times</li>
              </ul>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">When to Use What</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Best Choice</th>
                    <th>Why</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Checking if exists (small list)</td>
                    <td><code>IN (...)</code></td>
                    <td>Simple, readable</td>
                  </tr>
                  <tr>
                    <td>Checking if exists (large subquery)</td>
                    <td><code>EXISTS</code></td>
                    <td>Stops at first match</td>
                  </tr>
                  <tr>
                    <td>Need columns from both tables</td>
                    <td><code>JOIN</code></td>
                    <td>Get data in one pass</td>
                  </tr>
                  <tr>
                    <td>Multiple aggregates per group</td>
                    <td><code>GROUP BY</code></td>
                    <td>One pass, multiple calcs</td>
                  </tr>
                  <tr>
                    <td>Ranking within groups</td>
                    <td><code>Window Function</code></td>
                    <td>Keep all rows, add rank</td>
                  </tr>
                  <tr>
                    <td>Complex multi-step logic</td>
                    <td><code>CTE (WITH)</code></td>
                    <td>Readable, debuggable</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'checklist' && (
        <>
          <div className="section">
            <h2 className="section-title">Pre-Submit Checklist</h2>
            <p className="section-content">
              <strong>Check these BEFORE clicking Submit!</strong>
            </p>

            <div className="card">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Output Format
              </h3>
              <div style={{ padding: '1rem' }}>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>☑️ All required columns present?</li>
                  <li>☑️ Column names match exactly?</li>
                  <li>☑️ Correct ORDER BY (ASC vs DESC)?</li>
                  <li>☑️ No SELECT *?</li>
                </ul>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                Logic
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
                Edge Cases
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

          <div className="section">
            <h2 className="section-title">Common Mistakes to Avoid</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}>
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
                    <td><code>WHERE date BETWEEN '2024-01-01' AND '2024-12-31'</code></td>
                  </tr>
                  <tr>
                    <td>INNER JOIN for "all hotels"</td>
                    <td>LEFT JOIN (includes those without matches)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Test Day Strategy</h2>
            <div className="card">
              <h3 className="card-title">Before the Test</h3>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Re-read this cheatsheet (especially Pattern Matching tab)</li>
                <li>Do 3-4 warm-up problems on HackerRank</li>
                <li>Get water, use bathroom</li>
                <li>Close all distractions</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">During the Test (60 min)</h3>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li><strong>Minutes 0-5:</strong> Skim ALL problems, identify easy ones</li>
                <li><strong>Do easy problems first!</strong> Quick wins = confidence + points</li>
                <li><strong>"Stuck at 10 min" rule:</strong> If stuck 10+ min, skip and come back</li>
                <li><strong>Test small first:</strong> Add <code>LIMIT 10</code>, verify, then remove</li>
                <li><strong>Final 2 min:</strong> Check all queries with checklist</li>
              </ul>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">When Stuck</h3>
              <ul style={{ marginLeft: '1.5rem' }}>
                <li>Re-read problem statement (circle keywords!)</li>
                <li>Check Pattern Matching table - does keyword match?</li>
                <li>Start with basic <code>SELECT * FROM table LIMIT 10</code></li>
                <li>Build incrementally (add JOIN, then WHERE, then GROUP BY)</li>
                <li>If still stuck → skip, do next problem</li>
              </ul>
            </div>
          </div>
        </>
      )}

      <div className="alert alert-success mt-3">
        <strong>🎯 You've Got This!</strong><br />
        <br />
        Review this cheatsheet the morning of your test. During the test, come back to the
        Pattern Matching tab whenever you see keywords like "top N", "previous", "running total", etc.
        <br /><br />
        <strong>Remember:</strong> Better to get 80% of all problems partially right than 100% of
        one problem perfect. Manage your time!
      </div>

      <button
        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
        onClick={onComplete}
      >
        {isCompleted ? '✓ Completed' : 'Mark as Complete'}
      </button>
    </div>
  )
}
