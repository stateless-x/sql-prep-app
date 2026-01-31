export default function StudyPlan({ onComplete, isCompleted }) {
  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📅 Study Plan</h1>
        <p className="chapter-subtitle">Agoda Interview - 10-Day Roadmap</p>
      </div>

      <div className="alert alert-warning">
        <strong>🎯 AGODA INTERVIEW: February 11, 2026</strong><br />
        This plan is optimized based on what Agoda actually tests in their SQL interviews.
        <strong> Focus: 60% SQL (CTEs!), 25% Business Cases, 15% Speed/Strategy</strong>
      </div>

      <div className="section">
        <h2 className="section-title">📊 Study Time Allocation</h2>
        <div className="card">
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1', minWidth: '200px', background: 'rgba(103, 126, 234, 0.1)', padding: '1rem', borderRadius: '8px', border: '2px solid #667eea' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>60% - SQL Skills</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li><strong>30%</strong> CTEs (biggest gap!)</li>
                <li><strong>20%</strong> Window Functions</li>
                <li><strong>10%</strong> Complex JOINs</li>
              </ul>
            </div>
            <div style={{ flex: '1', minWidth: '200px', background: 'rgba(245, 158, 11, 0.1)', padding: '1rem', borderRadius: '8px', border: '2px solid var(--warning)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--warning)' }}>25% - Business Cases</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Breaking down vague questions</li>
                <li>Choosing right metrics</li>
                <li>Data-driven recommendations</li>
              </ul>
            </div>
            <div style={{ flex: '1', minWidth: '200px', background: 'rgba(76, 175, 80, 0.1)', padding: '1rem', borderRadius: '8px', border: '2px solid var(--success)' }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--success)' }}>15% - Speed & Strategy</h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem' }}>
                <li>Pattern recognition</li>
                <li>Time management</li>
                <li>Pre-submit checklist</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🗓️ Your 10-Day Schedule</h2>

        <div className="card">
          <h3 className="card-title">📚 Days 1-2: Foundation (2 hours/day)</h3>
          <div style={{ background: 'rgba(33, 150, 243, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 1 (Feb 1):</strong>
            <ul>
              <li>✓ Quick Diagnostic (5 min) - Identify weak spots</li>
              <li>✓ Study Plan (5 min) - Review this plan!</li>
              <li>✓ SQL Fundamentals (25 min)</li>
              <li>✓ Practice: Write 5 basic queries (30 min)</li>
              <li>📝 Total: 1.5 hours</li>
            </ul>
          </div>
          <div style={{ background: 'rgba(33, 150, 243, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 2 (Feb 2):</strong>
            <ul>
              <li>✓ GROUP BY & Aggregates (15 min)</li>
              <li>✓ WHERE vs HAVING (10 min)</li>
              <li>✓ Practice: Complex grouping scenarios (30 min)</li>
              <li>💡 Focus: Multi-level aggregations, percentages</li>
              <li>📝 Total: 1.5 hours</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">🔗 Day 3: JOINs & Subqueries (2 hours)</h3>
          <div style={{ background: 'rgba(33, 150, 243, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 3 (Feb 3):</strong>
            <ul>
              <li>✓ JOINs & Subqueries chapter (30 min)</li>
              <li>✓ Practice: LEFT JOIN for missing data (20 min)</li>
              <li>✓ Practice: Subqueries in WHERE/FROM (30 min)</li>
              <li>✓ Practice: Multi-table JOINs (20 min)</li>
              <li>💡 Master the "find missing" pattern!</li>
              <li>📝 Total: 2 hours</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ border: '3px solid var(--warning)' }}>
          <h3 className="card-title" style={{ color: 'var(--warning)' }}>🏗️ Day 4: CTEs - MOST CRITICAL DAY! (2.5 hours)</h3>
          <div className="alert alert-warning" style={{ marginTop: '0.5rem' }}>
            <strong>⚠️ THIS IS YOUR BIGGEST GAP!</strong> CTEs appear in 80% of Agoda SQL interviews.
            Spend extra time here - it's your highest ROI!
          </div>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', border: '2px solid var(--warning)' }}>
            <strong>Day 4 (Feb 4):</strong>
            <ul>
              <li>✓ CTEs & Multi-Step Queries chapter (30 min) - Read carefully!</li>
              <li>✓ Practice: 3 simple 1-step CTEs (20 min)</li>
              <li>✓ Practice: 5 cascading 2-3 step CTEs (40 min)</li>
              <li>✓ Practice: 3 CTEs + window functions (30 min)</li>
              <li>💡 Focus: User segmentation, monthly trends, top N per group</li>
              <li>📝 Total: 2.5 hours</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ border: '3px solid #667eea' }}>
          <h3 className="card-title" style={{ color: '#667eea' }}>🪟 Day 5: Window Functions (2.5 hours)</h3>
          <div style={{ background: 'rgba(103, 126, 234, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 5 (Feb 5):</strong>
            <ul>
              <li>✓ Window Functions & Patterns (40 min)</li>
              <li>✓ Practice: Ranking (ROW_NUMBER, RANK) (30 min)</li>
              <li>✓ Practice: LAG/LEAD time series (30 min)</li>
              <li>✓ Practice: Running totals & moving averages (30 min)</li>
              <li>💡 Always combine with CTEs (can't filter windows without them!)</li>
              <li>📝 Total: 2.5 hours</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">🔥 Day 6: Integration Day (2.5 hours)</h3>
          <div style={{ background: 'rgba(244, 67, 54, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 6 (Feb 6):</strong>
            <ul>
              <li>✓ Practice: 10 complex queries combining:</li>
              <ul>
                <li>CTEs + Window functions (3 queries)</li>
                <li>GROUP BY + HAVING + Window functions (3 queries)</li>
                <li>Multi-table JOINs + Subqueries (2 queries)</li>
                <li>CTEs + JOINs + Window functions (2 queries)</li>
              </ul>
              <li>💡 This simulates real Agoda interview complexity!</li>
              <li>📝 Total: 2.5 hours</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">📈 Day 7: Business & Patterns (2 hours)</h3>
          <div style={{ background: 'rgba(156, 39, 176, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 7 (Feb 7):</strong>
            <ul>
              <li>✓ Interview Patterns & Strategy (40 min)</li>
              <li>✓ Business Case Analysis (25 min)</li>
              <li>✓ Practice: 2-3 business case scenarios (45 min)</li>
              <li>💡 Practice breaking down "bookings are down" type questions</li>
              <li>📝 Total: 2 hours</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">🎬 Day 8: Mock Test #1 (2 hours)</h3>
          <div style={{ background: 'rgba(255, 152, 0, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 8 (Feb 8):</strong>
            <ul>
              <li>✓ Mock Test - TIMED 60 minutes</li>
              <li>✓ Review mistakes thoroughly (30 min)</li>
              <li>✓ Identify weak patterns (15 min)</li>
              <li>✓ Redo failed problems (30 min)</li>
              <li>💡 Track time per question - aim for 12 min/question</li>
              <li>📝 Total: 2 hours</li>
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">🎯 Day 9: Weak Areas (2 hours)</h3>
          <div style={{ background: 'rgba(0, 150, 136, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 9 (Feb 9):</strong>
            <ul>
              <li>✓ Focus on weakest area from Mock Test (1 hour)</li>
              <li>✓ Query Optimization (15 min)</li>
              <li>✓ Practice: 5 more complex problems (45 min)</li>
              <li>💡 If CTEs still weak, do 10 more CTE problems!</li>
              <li>📝 Total: 2 hours</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ border: '3px solid var(--success)' }}>
          <h3 className="card-title" style={{ color: 'var(--success)' }}>✅ Day 10: Final Prep (1.5 hours)</h3>
          <div style={{ background: 'rgba(76, 175, 80, 0.1)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
            <strong>Day 10 (Feb 10):</strong>
            <ul>
              <li>✓ Mock Test #2 - Create 5 new problems (60 min)</li>
              <li>✓ Review SQL Reference - Pattern Matching table (10 min)</li>
              <li>✓ Review CTE syntax template (5 min)</li>
              <li>✓ Review window function syntax (5 min)</li>
              <li>🧘 Light practice only - avoid burnout!</li>
              <li>📝 Total: 1.5 hours</li>
            </ul>
          </div>
        </div>

        <div className="card" style={{ border: '3px solid #2196F3', background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.1) 0%, rgba(103, 126, 234, 0.1) 100%)' }}>
          <h3 className="card-title" style={{ color: '#2196F3' }}>🎯 Day 11 (Feb 11): TEST DAY!</h3>
          <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem', border: '2px solid #2196F3' }}>
            <strong>Morning Routine (30 min before test):</strong>
            <ul>
              <li>✅ SQL Reference → Pattern Matching Tab (10 min)</li>
              <li>✅ CTEs chapter → Quick syntax review (5 min)</li>
              <li>✅ Window Functions → Syntax examples (5 min)</li>
              <li>✅ Interview Patterns → Pre-Submit Checklist (5 min)</li>
              <li>🧘 Deep breath - you've got this!</li>
            </ul>
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              <strong>🎉 You're ready!</strong> Remember:
              <ul>
                <li>✓ Use CTEs to show your thinking</li>
                <li>✓ Break problems into steps</li>
                <li>✓ Test with LIMIT 10 first</li>
                <li>✓ Check the pre-submit list</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">🧠 ADHD Study Tips</h2>
        <div className="card">
          <p><strong>1. 25-minute Pomodoros</strong> — Study 25 min, break 5 min. Use a timer!</p>
        </div>
        <div className="card">
          <p><strong>2. DO after every section</strong> — Don't just read. Write queries immediately!</p>
        </div>
        <div className="card">
          <p><strong>3. Check boxes for dopamine</strong> — Mark chapters complete ✓</p>
        </div>
        <div className="card">
          <p><strong>4. Use the progress bar</strong> — Visual motivation in sidebar!</p>
        </div>
        <div className="card">
          <p><strong>5. Mix it up</strong> — Alternate hard (CTEs) with easier (review) topics</p>
        </div>
      </div>

      <div className="alert alert-warning">
        <strong>⚡ Only have 5 days left?</strong><br />
        <strong>Day 1:</strong> SQL Fundamentals + GROUP BY + WHERE/HAVING (1.5 hrs)<br />
        <strong>Day 2:</strong> JOINs + Subqueries (2 hrs)<br />
        <strong>Day 3:</strong> CTEs chapter + practice 10 cascading CTEs (3 hrs) ⚠️ CRITICAL<br />
        <strong>Day 4:</strong> Window Functions + combine with CTEs (2.5 hrs)<br />
        <strong>Day 5:</strong> Mock Test + review weak areas (2 hrs)
      </div>

      <div className="alert alert-info">
        <strong>💡 Pro Tip:</strong> The TL;DR boxes at the top of each chapter are perfect for quick reviews.
        Review all TL;DR boxes on Day 10!
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
