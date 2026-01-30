export default function StudyPlan({ onComplete, isCompleted }) {
  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📅 Study Plan</h1>
        <p className="chapter-subtitle">Your roadmap to success</p>
      </div>

      <div className="section">
        <h2 className="section-title">🎯 Your 5-Day Schedule</h2>

        <div className="card">
          <h3 className="card-title">Day 1: Foundations</h3>
          <ul>
            <li>✓ SQL Fundamentals (25 min)</li>
            <li>✓ GROUP BY & Aggregates (15 min)</li>
            <li>✓ WHERE vs HAVING (10 min)</li>
            <li>✓ Practice drills (30 min)</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Day 2: Combining Data</h3>
          <ul>
            <li>✓ JOINs (20 min)</li>
            <li>✓ Practice JOIN patterns (30 min)</li>
            <li>✓ Drill exercises (30 min)</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Day 3: Window Functions</h3>
          <ul>
            <li>⚠️ Window Functions (30 min) - YOUR BIGGEST GAP</li>
            <li>✓ Practice extensively (45 min)</li>
            <li>✓ Top N per group patterns</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Day 4: Practice</h3>
          <ul>
            <li>✓ Common Patterns (20 min)</li>
            <li>✓ Mock Test (60 min)</li>
            <li>✓ Review errors thoroughly</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title">Day 5: Final Review</h3>
          <ul>
            <li>✓ Review Cheatsheet (10 min)</li>
            <li>✓ Redo weak areas</li>
            <li>🎯 TAKE THE REAL TEST</li>
          </ul>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🧠 ADHD Study Tips</h2>
        <div className="card">
          <p><strong>1. 20-minute chunks</strong> — Read 20 min, break 5 min</p>
        </div>
        <div className="card">
          <p><strong>2. Drill after each section</strong> — Don't just read, DO!</p>
        </div>
        <div className="card">
          <p><strong>3. Check the boxes</strong> — Get that dopamine hit</p>
        </div>
        <div className="card">
          <p><strong>4. Use the progress bar</strong> — Visual motivation!</p>
        </div>
      </div>

      <div className="alert alert-warning">
        <strong>⚡ Only have 2 days?</strong><br />
        Day 1: Window Functions + drill extensively<br />
        Day 2: Mock Test → Take real test
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
