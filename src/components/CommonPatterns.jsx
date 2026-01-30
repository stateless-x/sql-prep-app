import { useState } from 'react'

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

export default function CommonPatterns({ onComplete, isCompleted }) {
  const [selectedPattern, setSelectedPattern] = useState(0)

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🎨 Common Patterns</h1>
        <p className="chapter-subtitle">80% of interview questions use these</p>
      </div>

      <div className="alert alert-info">
        <strong>💡 Study Tip:</strong> Memorize these patterns. Most questions are variations of these!
      </div>

      <div className="section">
        <h2 className="section-title">Quick Recognition Guide</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Question Contains</th>
                <th>Pattern</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>"conversion rate", "% who"</td>
                <td>Conversion funnel</td>
              </tr>
              <tr>
                <td>"but not", "never", "without"</td>
                <td>LEFT JOIN + IS NULL</td>
              </tr>
              <tr>
                <td>"top N per", "best in each"</td>
                <td>ROW_NUMBER + WHERE rn ≤ N</td>
              </tr>
              <tr>
                <td>"compare to previous", "growth"</td>
                <td>LAG</td>
              </tr>
              <tr>
                <td>"cumulative", "running"</td>
                <td>SUM() OVER (ORDER BY)</td>
              </tr>
              <tr>
                <td>"first time", "new vs returning"</td>
                <td>MIN() for first, then compare</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="section">
        <h2 className="section-title">Patterns</h2>
        <div className="tabs" style={{ overflowX: 'auto', flexWrap: 'nowrap' }}>
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

        <div className="card mt-2">
          <h3 className="card-title">{patterns[selectedPattern].title}</h3>
          <div className="code-block">
            <pre><code>{patterns[selectedPattern].code}</code></pre>
          </div>
        </div>
      </div>

      <div className="alert alert-success">
        <strong>💪 Practice:</strong> Try to write each pattern from memory before the test!
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
