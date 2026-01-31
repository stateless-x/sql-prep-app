import { useState, useEffect } from 'react'

const problems = [
  {
    id: 1,
    title: 'Problem 1 (5 min, 10 pts)',
    question: 'Find all premium users from Thailand, sorted by signup date (newest first).',
    solution: `SELECT email, signup_date
FROM users
WHERE account_type = 'premium' AND country = 'Thailand'
ORDER BY signup_date DESC;`
  },
  {
    id: 2,
    title: 'Problem 2 (8 min, 15 pts)',
    question: 'Calculate total revenue and booking count per hotel. Only include hotels with revenue over $10,000. Sort by revenue descending.',
    solution: `SELECT h.hotel_id, h.name,
    COUNT(*) AS total_bookings,
    SUM(b.amount) AS total_revenue
FROM hotels h
JOIN bookings b ON h.hotel_id = b.hotel_id
WHERE b.status = 'completed'
GROUP BY h.hotel_id, h.name
HAVING SUM(b.amount) > 10000
ORDER BY total_revenue DESC;`
  },
  {
    id: 3,
    title: 'Problem 3 (10 min, 15 pts)',
    question: 'Rank hotels within each city by total revenue. Include all hotels even with no bookings.',
    solution: `SELECT h.name, h.city,
    COALESCE(SUM(b.amount), 0) AS revenue,
    RANK() OVER (
        PARTITION BY h.city
        ORDER BY COALESCE(SUM(b.amount), 0) DESC
    ) AS city_rank
FROM hotels h
LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
GROUP BY h.hotel_id, h.name, h.city;`
  },
  {
    id: 4,
    title: 'Problem 4 (10 min, 15 pts)',
    question: "For each user's booking history, show: booking_id, booking_date, amount, previous booking amount (LAG), days since previous booking, running total",
    solution: `SELECT user_id, booking_id, booking_date, amount,
    LAG(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS prev_amount,
    booking_date - LAG(booking_date) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS days_since_last,
    SUM(amount) OVER (
        PARTITION BY user_id
        ORDER BY booking_date
    ) AS running_total
FROM bookings
ORDER BY user_id, booking_date;`
  },
  {
    id: 5,
    title: 'Problem 5 (15 min, 20 pts) ⭐ CTEs - CRITICAL FOR AGODA',
    question: `User Segmentation with Cascading CTEs:

Segment users into VIP/Regular/New based on their 2024 booking history:
- VIP: 10+ bookings AND average booking value > $200
- Regular: 3-9 bookings OR average booking value > $150
- New: Everything else

Then calculate for each segment:
- Total number of users
- Total revenue
- Average revenue per user

Use CTEs to solve this. Show segment, user_count, segment_revenue, avg_revenue_per_user.`,
    solution: `WITH user_metrics AS (
    -- Step 1: Calculate metrics per user
    SELECT
        user_id,
        COUNT(*) as booking_count,
        AVG(amount) as avg_booking_value,
        SUM(amount) as total_spent
    FROM bookings
    WHERE booking_date >= '2024-01-01'
    GROUP BY user_id
),
user_segments AS (
    -- Step 2: Classify users into segments
    SELECT
        user_id,
        booking_count,
        avg_booking_value,
        total_spent,
        CASE
            WHEN booking_count >= 10 AND avg_booking_value > 200 THEN 'VIP'
            WHEN booking_count >= 3 OR avg_booking_value > 150 THEN 'Regular'
            ELSE 'New'
        END as segment
    FROM user_metrics
)
-- Step 3: Aggregate by segment
SELECT
    segment,
    COUNT(user_id) as user_count,
    SUM(total_spent) as segment_revenue,
    ROUND(AVG(total_spent), 2) as avg_revenue_per_user
FROM user_segments
GROUP BY segment
ORDER BY segment_revenue DESC;

-- Key pattern: CTE 1 calculates → CTE 2 classifies → Final query aggregates
-- This 3-step CTE pattern appears in 80% of Agoda interviews!`
  },
  {
    id: 6,
    title: 'Problem 6 (12 min, 20 pts) ⭐ CTEs + Window Functions',
    question: `Top 3 Hotels Per City:

Find the top 3 revenue-generating hotels in each city for completed bookings.

Show: city, hotel_name, total_revenue, city_rank

Requirements:
- Only include completed bookings (status = 'completed')
- Use CTEs for readability
- Use ROW_NUMBER() for ranking (no ties)
- Order final results by city, then city_rank`,
    solution: `WITH hotel_revenue AS (
    -- Step 1: Calculate revenue per hotel
    SELECT
        h.hotel_id,
        h.city,
        h.name as hotel_name,
        SUM(b.amount) as total_revenue
    FROM hotels h
    JOIN bookings b ON h.hotel_id = b.hotel_id
    WHERE b.status = 'completed'
    GROUP BY h.hotel_id, h.city, h.name
),
ranked_hotels AS (
    -- Step 2: Rank hotels within each city
    SELECT
        city,
        hotel_name,
        total_revenue,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY total_revenue DESC
        ) as city_rank
    FROM hotel_revenue
)
-- Step 3: Filter to top 3 per city
SELECT
    city,
    hotel_name,
    total_revenue,
    city_rank
FROM ranked_hotels
WHERE city_rank <= 3
ORDER BY city, city_rank;

-- Critical pattern: CTE → window function → filter window results
-- You CANNOT filter ROW_NUMBER() in WHERE without a CTE!`
  },
  {
    id: 7,
    title: 'Problem 7 (8 min, 15 pts) ⭐ Business Case Analysis',
    question: `Revenue Drop Investigation:

Bangkok bookings dropped this month vs last month.

Compare current month vs previous month for Bangkok only. Show:
- star_rating (hotel star rating)
- current_month_bookings
- previous_month_bookings
- booking_change_pct (percentage change)
- current_month_avg_value
- previous_month_avg_value
- value_change_pct (percentage change in avg booking value)

Use CTEs. Round percentages to 2 decimals. Order by star_rating DESC.

Hint: Use DATE_TRUNC('month', CURRENT_DATE) for current month, subtract INTERVAL '1 month' for previous.`,
    solution: `WITH current_month AS (
    -- Step 1: Current month metrics by star rating
    SELECT
        h.star_rating,
        COUNT(*) as bookings,
        AVG(b.amount) as avg_booking_value
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE h.city = 'Bangkok'
    AND b.booking_date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY h.star_rating
),
previous_month AS (
    -- Step 2: Previous month metrics by star rating
    SELECT
        h.star_rating,
        COUNT(*) as bookings,
        AVG(b.amount) as avg_booking_value
    FROM bookings b
    JOIN hotels h ON b.hotel_id = h.hotel_id
    WHERE h.city = 'Bangkok'
    AND b.booking_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
    AND b.booking_date < DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY h.star_rating
)
-- Step 3: Compare and calculate changes
SELECT
    COALESCE(cm.star_rating, pm.star_rating) as star_rating,
    COALESCE(cm.bookings, 0) as current_month_bookings,
    COALESCE(pm.bookings, 0) as previous_month_bookings,
    ROUND(
        100.0 * (COALESCE(cm.bookings, 0) - COALESCE(pm.bookings, 0))
        / NULLIF(pm.bookings, 0),
        2
    ) as booking_change_pct,
    ROUND(COALESCE(cm.avg_booking_value, 0), 2) as current_month_avg_value,
    ROUND(COALESCE(pm.avg_booking_value, 0), 2) as previous_month_avg_value,
    ROUND(
        100.0 * (COALESCE(cm.avg_booking_value, 0) - COALESCE(pm.avg_booking_value, 0))
        / NULLIF(pm.avg_booking_value, 0),
        2
    ) as value_change_pct
FROM current_month cm
FULL OUTER JOIN previous_month pm ON cm.star_rating = pm.star_rating
ORDER BY star_rating DESC;

-- Business insight: Compare booking_change_pct vs value_change_pct
-- If bookings down but value stable → volume problem (marketing)
-- If bookings stable but value down → pricing problem`
  }
]

export default function MockTest({ onComplete, isCompleted }) {
  const [showSolutions, setShowSolutions] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds

  // Load answers from localStorage
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem('mockTestAnswers')
    return saved ? JSON.parse(saved) : {}
  })

  // Save answers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('mockTestAnswers', JSON.stringify(answers))
  }, [answers])

  const handleAnswerChange = (problemId, value) => {
    setAnswers(prev => ({
      ...prev,
      [problemId]: value
    }))
  }

  const handleReset = () => {
    if (window.confirm('⚠️ Are you sure you want to reset all your answers? This cannot be undone!')) {
      setAnswers({})
      localStorage.removeItem('mockTestAnswers')
      setTimerStarted(false)
      setTimeRemaining(60 * 60)
      setShowSolutions(false)
    }
  }

  const startTimer = () => {
    setTimerStarted(true)
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const minutes = Math.floor(timeRemaining / 60)
  const seconds = timeRemaining % 60

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎬 Mock Test</h1>
        <p className="chapter-subtitle">60-minute simulation</p>
      </div>

      <div className="alert alert-warning">
        <strong>⏱️ Instructions:</strong><br />
        1. Click "Start Timer" for 60-minute countdown<br />
        2. Type your SQL answers in the text boxes<br />
        3. Your answers auto-save to browser (persist across refresh!)<br />
        4. No looking at notes during the test<br />
        5. Use "Reset All Answers" to clear and start fresh<br />
        6. Check solutions after you finish (or if you're stuck)
      </div>

      {!timerStarted ? (
        <div className="section">
          <button className="quiz-btn" onClick={startTimer}>
            🚀 Start 60-Minute Timer
          </button>
        </div>
      ) : (
        <div className="alert alert-info">
          <strong>⏱️ Time Remaining: {minutes}:{seconds.toString().padStart(2, '0')}</strong>
          {timeRemaining === 0 && <div className="text-danger mt-1">⏰ Time's up!</div>}
        </div>
      )}

      <div className="section">
        <h2 className="section-title">Schema Reference</h2>
        <div className="code-block">
          <pre><code>{`users (user_id, email, country, signup_date, account_type)
hotels (hotel_id, name, city, country, star_rating)
bookings (booking_id, user_id, hotel_id, booking_date, amount, status, platform)
searches (search_id, user_id, destination, search_date, converted)`}</code></pre>
        </div>
      </div>

      {problems.map((problem) => (
        <div key={problem.id} className="section">
          <h2 className="section-title">{problem.title}</h2>
          <p className="section-content">{problem.question}</p>

          <div className="mt-2">
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your SQL Answer:
            </label>
            <textarea
              value={answers[problem.id] || ''}
              onChange={(e) => handleAnswerChange(problem.id, e.target.value)}
              placeholder="-- Write your SQL query here..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                background: 'var(--code-bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.9rem',
                lineHeight: '1.6',
                resize: 'vertical'
              }}
            />
            {answers[problem.id] && (
              <p style={{ fontSize: '0.85rem', color: 'var(--success)', marginTop: '0.5rem' }}>
                ✅ Answer saved! ({answers[problem.id].length} characters)
              </p>
            )}
          </div>

          {showSolutions && (
            <div className="mt-2">
              <div className="alert alert-success">
                <strong>✅ Solution:</strong>
              </div>
              <div className="code-block">
                <pre><code>{problem.solution}</code></pre>
              </div>
            </div>
          )}
        </div>
      ))}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className="quiz-btn"
          onClick={() => setShowSolutions(!showSolutions)}
        >
          {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
        </button>

        <button
          className="quiz-btn"
          onClick={handleReset}
          style={{ background: 'var(--danger)' }}
        >
          🗑️ Reset All Answers
        </button>
      </div>

      <div className="section mt-3">
        <h2 className="section-title">Scoring</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Problem</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>10</td></tr>
              <tr><td>2</td><td>15</td></tr>
              <tr><td>3</td><td>15</td></tr>
              <tr><td>4</td><td>15</td></tr>
              <tr><td><strong>Total</strong></td><td><strong>55</strong></td></tr>
            </tbody>
          </table>
        </div>

        <div className="mt-2">
          <p><strong>90-100:</strong> Ready! 🎉</p>
          <p><strong>75-89:</strong> Quick review, then test 👍</p>
          <p><strong>60-74:</strong> Review weak areas ⚠️</p>
          <p><strong>&lt;60:</strong> More practice needed 📚</p>
        </div>
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
