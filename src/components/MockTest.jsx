import { useState } from 'react'

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
  }
]

export default function MockTest({ onComplete, isCompleted }) {
  const [showSolutions, setShowSolutions] = useState(false)
  const [timerStarted, setTimerStarted] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(60 * 60) // 60 minutes in seconds

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
        1. Set a 60-minute timer<br />
        2. No looking at notes<br />
        3. Write actual queries<br />
        4. Move on if stuck
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

          <div className="code-block">
            <pre><code>-- Your answer:</code></pre>
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

      <button
        className="quiz-btn"
        onClick={() => setShowSolutions(!showSolutions)}
      >
        {showSolutions ? 'Hide Solutions' : 'Show Solutions'}
      </button>

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
