export default function Cheatsheet({ onComplete, isCompleted }) {
  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📋 Cheatsheet</h1>
        <p className="chapter-subtitle">Quick reference - Print this!</p>
      </div>

      <div className="alert alert-success">
        <strong>💡 Pro Tip:</strong> Review this the morning of your test!
      </div>

      <div className="section">
        <h2 className="section-title">Execution Order</h2>
        <div className="code-block">
          <pre><code>FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code></pre>
        </div>
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
                <td><strong>Aggregates</strong></td>
                <td className="text-danger">❌</td>
                <td className="text-success">✅</td>
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
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>INNER</td>
                <td>Only matches</td>
              </tr>
              <tr>
                <td>LEFT</td>
                <td>All left + matches</td>
              </tr>
              <tr>
                <td>LEFT + IS NULL</td>
                <td>Left with no match</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Aggregates</h2>
        <div className="code-block">
          <pre><code>{`COUNT(*), COUNT(col), SUM(), AVG(), MAX(), MIN()`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Window Functions</h2>
        <div className="code-block">
          <pre><code>{`FUNCTION() OVER (PARTITION BY x ORDER BY y)

ROW_NUMBER()  -- 1,2,3,4
RANK()        -- 1,1,3,4
DENSE_RANK()  -- 1,1,2,3
SUM() OVER    -- Running total
LAG()         -- Previous row
LEAD()        -- Next row`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Top Patterns</h2>

        <div className="card">
          <h3 className="card-title">Top N per group</h3>
          <div className="code-block">
            <pre><code>{`WITH ranked AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY g ORDER BY v DESC
        ) AS rn
    FROM t
)
SELECT * FROM ranked WHERE rn <= N;`}</code></pre>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Find missing</h3>
          <div className="code-block">
            <pre><code>{`SELECT * FROM a
LEFT JOIN b ON ...
WHERE b.id IS NULL;`}</code></pre>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Running total</h3>
          <div className="code-block">
            <pre><code>{`SUM(x) OVER (PARTITION BY g ORDER BY d)`}</code></pre>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Compare to previous</h3>
          <div className="code-block">
            <pre><code>{`x - LAG(x) OVER (PARTITION BY g ORDER BY d)`}</code></pre>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Conversion rate</h3>
          <div className="code-block">
            <pre><code>{`100.0 * SUM(CASE WHEN converted THEN 1 ELSE 0 END) / COUNT(*)`}</code></pre>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">NULL Handling</h2>
        <div className="code-block">
          <pre><code>{`IS NULL / IS NOT NULL
COALESCE(col, default)
col / NULLIF(divisor, 0)  -- Avoid divide by zero`}</code></pre>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">✅ Final Checklist</h2>
        <p className="section-content"><strong>Before submitting any query:</strong></p>
        <ul>
          <li>☑️ Correct columns in SELECT?</li>
          <li>☑️ All JOINs have ON conditions?</li>
          <li>☑️ WHERE vs HAVING used correctly?</li>
          <li>☑️ GROUP BY includes all non-aggregated columns?</li>
          <li>☑️ PARTITION BY where needed?</li>
          <li>☑️ ORDER BY for LIMIT queries?</li>
          <li>☑️ NULLs handled?</li>
          <li>☑️ Division by zero protected?</li>
        </ul>
      </div>

      <div className="alert alert-success">
        <strong>🎯 You've Got This!</strong><br />
        <br />
        <strong>Morning of test:</strong><br />
        1. Re-read this cheatsheet<br />
        2. Do 3-4 quick drills<br />
        3. Take the test with confidence!<br />
        <br />
        <strong>When stuck:</strong><br />
        1. Break down the problem<br />
        2. Start with simple SELECT<br />
        3. Build incrementally<br />
        4. Check edge cases
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
