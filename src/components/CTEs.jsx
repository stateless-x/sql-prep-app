import { useState } from 'react'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'
import TryThis from './TryThis'
import RecallBox from './RecallBox'

export default function CTEs({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('fundamentals')

  const tabs = [
    { id: 'fundamentals', label: '🎯 What & Why', time: '4 min' },
    { id: 'simple', label: '📝 Simple CTEs', time: '5 min' },
    { id: 'cascading', label: '🔗 Cascading CTEs', time: '8 min' },
    { id: 'vs-subqueries', label: '⚖️ CTE vs Subquery', time: '5 min' },
    { id: 'window', label: '🪟 CTEs + Windows', time: '6 min' },
    { id: 'mistakes', label: '⚠️ Common Mistakes', time: '4 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">🏗️ CTEs & Multi-Step Queries</h1>
        <p className="chapter-subtitle">Master WITH clauses - Critical for Agoda interviews!</p>
      </div>

      <LearningObjectives
        objectives={[
          'Understand CTEs (WITH clauses) and when to use them',
          'Write cascading 2-4 step CTEs for complex analysis',
          'Know when to use CTEs vs Subqueries',
          'Combine CTEs with window functions for ranking',
          'Solve real Agoda scenarios with multi-step queries'
        ]}
        time="30 min"
      />

      <TLDRBox
        points={[
          'CTEs = WITH name AS (query) - temporary named result sets',
          'Make complex queries readable by breaking into steps',
          'Can reference previous CTEs in later ones (cascading)',
          'Use CTEs when you need to filter window function results',
          'Agoda LOVES testing multi-step CTEs with window functions'
        ]}
      />

      <div className="alert alert-warning">
        <strong>🎯 AGODA CRITICAL:</strong> CTEs appear in ~80% of Agoda SQL interviews. You MUST master cascading CTEs combined with window functions!
      </div>

      <RecallBox
        chapter="JOINs"
        concept="CTEs can include JOINs. Break complex multi-table queries into readable steps."
      />

      {/* Tab Navigation */}
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label} <span className="tab-time">({tab.time})</span>
          </button>
        ))}
      </div>

      {/* Tab: Fundamentals */}
      {activeTab === 'fundamentals' && (
        <div className="section">
          <h2 className="section-title">What Are CTEs?</h2>

          <div className="card">
            <h3 className="card-title">Definition</h3>
            <p>
              <strong>CTE (Common Table Expression)</strong> = A temporary named result set that exists only for the duration of a single query.
            </p>
            <p>Think of it like: <strong>"Let me give this subquery a name so I can reuse it and make my code readable"</strong></p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Syntax</h3>
            <CodeBlock code={`WITH cte_name AS (
    -- Your query here
    SELECT ...
)
SELECT * FROM cte_name;

-- You can chain multiple CTEs:
WITH first_cte AS (
    SELECT ...
),
second_cte AS (
    SELECT * FROM first_cte WHERE ...
)
SELECT * FROM second_cte;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 Real Agoda Example</h3>
            <p><strong>Problem:</strong> "Find hotels with above-average ratings"</p>

            <div className="mt-1">
              <h4 style={{ color: 'var(--danger)' }}>❌ Without CTE (Messy)</h4>
              <CodeBlock code={`SELECT hotel_name, avg_rating
FROM (
    SELECT hotel_id, AVG(rating) as avg_rating
    FROM reviews
    GROUP BY hotel_id
) hotel_ratings
JOIN hotels h ON hotel_ratings.hotel_id = h.hotel_id
WHERE avg_rating > (
    SELECT AVG(avg_rating) FROM (
        SELECT AVG(rating) as avg_rating
        FROM reviews
        GROUP BY hotel_id
    ) subq
);

-- Hard to read! Nested subqueries!`} />
            </div>

            <div className="mt-1">
              <h4 style={{ color: 'var(--success)' }}>✅ With CTE (Clean)</h4>
              <CodeBlock code={`WITH hotel_ratings AS (
    -- Step 1: Calculate each hotel's rating
    SELECT hotel_id, AVG(rating) as avg_rating
    FROM reviews
    GROUP BY hotel_id
),
overall_avg AS (
    -- Step 2: Calculate average of all hotels
    SELECT AVG(avg_rating) as platform_avg
    FROM hotel_ratings
)
-- Step 3: Filter hotels above average
SELECT h.hotel_name, hr.avg_rating
FROM hotel_ratings hr
JOIN hotels h ON hr.hotel_id = h.hotel_id
CROSS JOIN overall_avg
WHERE hr.avg_rating > overall_avg.platform_avg;

-- Each step is clear and testable!`} />
            </div>
          </div>

          <div className="alert alert-info mt-2">
            <strong>💡 Why Agoda Uses CTEs:</strong><br />
            When analyzing millions of bookings, breaking queries into logical steps makes them:
            <ul>
              <li>✅ Easier to debug (test each CTE independently)</li>
              <li>✅ Easier to understand (business logic is clear)</li>
              <li>✅ Easier to modify (change one step without rewriting everything)</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab: Simple CTEs */}
      {activeTab === 'simple' && (
        <div className="section">
          <h2 className="section-title">Simple CTEs (1 Step)</h2>

          <div className="card">
            <h3 className="card-title">Pattern: Filter Then Join</h3>
            <p><strong>Scenario:</strong> "Find users who made bookings in Bangkok and show their total spending"</p>
            <CodeBlock code={`WITH bangkok_bookings AS (
    SELECT user_id, SUM(amount) as total_spent
    FROM bookings
    WHERE city = 'Bangkok'
    GROUP BY user_id
)
SELECT
    u.user_name,
    bb.total_spent
FROM bangkok_bookings bb
JOIN users u ON bb.user_id = u.user_id
ORDER BY bb.total_spent DESC;

-- Why CTE helps: Separate filtering logic from joining logic`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Pattern: Aggregate Then Calculate</h3>
            <p><strong>Scenario:</strong> "Calculate what percentage each city contributes to total revenue"</p>
            <CodeBlock code={`WITH city_revenue AS (
    SELECT
        city,
        SUM(amount) as revenue
    FROM bookings
    GROUP BY city
)
SELECT
    city,
    revenue,
    ROUND(100.0 * revenue / SUM(revenue) OVER (), 2) as pct_of_total
FROM city_revenue
ORDER BY revenue DESC;

-- CTE makes the window function cleaner to read`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Pattern: Remove Duplicates First</h3>
            <p><strong>Scenario:</strong> "Find unique users per city (they might have multiple bookings)"</p>
            <CodeBlock code={`WITH unique_users_per_city AS (
    SELECT DISTINCT city, user_id
    FROM bookings
)
SELECT
    city,
    COUNT(user_id) as unique_customers
FROM unique_users_per_city
GROUP BY city;

-- Clearer than COUNT(DISTINCT ...) in complex queries`} />
          </div>

          <TryThis
            challenge="Write a CTE to find all 5-star hotels, then calculate the average price for bookings at those hotels."
            hint="Step 1: CTE to get hotel_ids where star_rating = 5. Step 2: Join with bookings and AVG."
            solution={`WITH five_star_hotels AS (
    SELECT hotel_id
    FROM hotels
    WHERE star_rating = 5
)
SELECT
    h.hotel_name,
    AVG(b.amount) as avg_booking_price
FROM five_star_hotels fsh
JOIN hotels h ON fsh.hotel_id = h.hotel_id
JOIN bookings b ON h.hotel_id = b.hotel_id
GROUP BY h.hotel_name;`}
            explanation="✅ The CTE isolates the 5-star filter, making the main query focus on the calculation. Clean separation of concerns!"
          />
        </div>
      )}

      {/* Tab: Cascading CTEs */}
      {activeTab === 'cascading' && (
        <div className="section">
          <h2 className="section-title">Cascading CTEs (2-4 Steps)</h2>

          <div className="alert alert-warning">
            <strong>🎯 THIS IS WHAT AGODA TESTS!</strong> You'll get scenarios requiring 3-4 logical steps.
          </div>

          <div className="card">
            <h3 className="card-title">🏨 2-Step: User Segmentation</h3>
            <p><strong>Business Question:</strong> "Segment users as VIP/Regular/New based on booking count, then calculate revenue per segment"</p>
            <CodeBlock code={`WITH user_booking_counts AS (
    -- Step 1: Count bookings per user
    SELECT
        user_id,
        COUNT(*) as booking_count,
        SUM(amount) as total_spent
    FROM bookings
    WHERE booking_date >= '2024-01-01'
    GROUP BY user_id
),
user_segments AS (
    -- Step 2: Assign segment labels
    SELECT
        user_id,
        booking_count,
        total_spent,
        CASE
            WHEN booking_count >= 10 THEN 'VIP'
            WHEN booking_count >= 3 THEN 'Regular'
            ELSE 'New'
        END as segment
    FROM user_booking_counts
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

-- Notice: Each CTE builds on the previous one!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 3-Step: Monthly Growth Analysis</h3>
            <p><strong>Business Question:</strong> "Calculate month-over-month growth rate for each city"</p>
            <CodeBlock code={`WITH monthly_bookings AS (
    -- Step 1: Count bookings per city per month
    SELECT
        city,
        DATE_TRUNC('month', booking_date) as month,
        COUNT(*) as booking_count
    FROM bookings
    GROUP BY city, DATE_TRUNC('month', booking_date)
),
bookings_with_previous AS (
    -- Step 2: Add previous month's count using LAG
    SELECT
        city,
        month,
        booking_count,
        LAG(booking_count) OVER (
            PARTITION BY city
            ORDER BY month
        ) as previous_month_count
    FROM monthly_bookings
),
growth_rates AS (
    -- Step 3: Calculate growth rate
    SELECT
        city,
        month,
        booking_count,
        previous_month_count,
        CASE
            WHEN previous_month_count IS NULL THEN NULL
            WHEN previous_month_count = 0 THEN NULL
            ELSE ROUND(
                100.0 * (booking_count - previous_month_count) / previous_month_count,
                2
            )
        END as growth_rate_pct
    FROM bookings_with_previous
)
-- Step 4: Find cities with 3+ consecutive months of growth
SELECT * FROM growth_rates
WHERE growth_rate_pct > 0
ORDER BY city, month;

-- This is a typical Agoda interview question!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 4-Step: Top Hotels by City Revenue Contribution</h3>
            <p><strong>Business Question:</strong> "Find top 3 hotels in each city by revenue, show what % of city revenue they represent"</p>
            <CodeBlock code={`WITH hotel_revenue AS (
    -- Step 1: Calculate revenue per hotel
    SELECT
        h.hotel_id,
        h.hotel_name,
        h.city,
        SUM(b.amount) as hotel_revenue
    FROM hotels h
    JOIN bookings b ON h.hotel_id = b.hotel_id
    WHERE b.booking_date >= '2024-01-01'
    GROUP BY h.hotel_id, h.hotel_name, h.city
),
city_totals AS (
    -- Step 2: Calculate total revenue per city
    SELECT
        city,
        SUM(hotel_revenue) as city_revenue
    FROM hotel_revenue
    GROUP BY city
),
hotel_with_city_pct AS (
    -- Step 3: Calculate each hotel's % of city revenue
    SELECT
        hr.hotel_id,
        hr.hotel_name,
        hr.city,
        hr.hotel_revenue,
        ct.city_revenue,
        ROUND(100.0 * hr.hotel_revenue / ct.city_revenue, 2) as pct_of_city
    FROM hotel_revenue hr
    JOIN city_totals ct ON hr.city = ct.city
),
ranked_hotels AS (
    -- Step 4: Rank hotels within each city
    SELECT
        *,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY hotel_revenue DESC
        ) as city_rank
    FROM hotel_with_city_pct
)
-- Final: Get top 3 per city
SELECT
    city,
    hotel_name,
    hotel_revenue,
    pct_of_city,
    city_rank
FROM ranked_hotels
WHERE city_rank <= 3
ORDER BY city, city_rank;

-- This combines: CTEs + JOINs + Window Functions + Aggregations
-- Exactly what Agoda tests!`} />
          </div>

          <TryThis
            challenge="Write a 3-step CTE: (1) Find users who made bookings in 2024, (2) Calculate their average booking value, (3) Identify users whose average is in the top 20% of all users."
            hint="Step 1: Filter bookings. Step 2: GROUP BY user with AVG. Step 3: Use NTILE(5) window function or calculate 80th percentile."
            solution={`WITH bookings_2024 AS (
    SELECT user_id, amount
    FROM bookings
    WHERE booking_date >= '2024-01-01'
),
user_averages AS (
    SELECT
        user_id,
        AVG(amount) as avg_booking_value
    FROM bookings_2024
    GROUP BY user_id
),
top_20_pct AS (
    SELECT
        user_id,
        avg_booking_value,
        NTILE(5) OVER (ORDER BY avg_booking_value DESC) as quintile
    FROM user_averages
)
SELECT user_id, avg_booking_value
FROM top_20_pct
WHERE quintile = 1;  -- Top 20%`}
            explanation="✅ NTILE(5) divides users into 5 equal groups. Quintile 1 = top 20%. This is a common Agoda pattern for identifying high-value segments!"
          />
        </div>
      )}

      {/* Tab: CTE vs Subqueries */}
      {activeTab === 'vs-subqueries' && (
        <div className="section">
          <h2 className="section-title">CTE vs Subquery: When to Use Which?</h2>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Use CTE</th>
                  <th>Use Subquery</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Need to reference result multiple times</td>
                  <td className="text-success">✅ YES</td>
                  <td className="text-danger">❌ NO</td>
                </tr>
                <tr>
                  <td>Multi-step logic (3+ steps)</td>
                  <td className="text-success">✅ YES</td>
                  <td className="text-danger">❌ NO</td>
                </tr>
                <tr>
                  <td>One-time simple filter</td>
                  <td className="text-warning">⚠️ OK</td>
                  <td className="text-success">✅ YES</td>
                </tr>
                <tr>
                  <td>Recursive queries</td>
                  <td className="text-success">✅ ONLY OPTION</td>
                  <td className="text-danger">❌ CAN'T DO</td>
                </tr>
                <tr>
                  <td>Readability matters (interviews!)</td>
                  <td className="text-success">✅ YES</td>
                  <td className="text-danger">❌ NO</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Example: Same Query Both Ways</h3>
            <p><strong>Find hotels with more than average bookings</strong></p>

            <h4 style={{ color: 'var(--danger)' }}>❌ Subquery (Harder to Read)</h4>
            <CodeBlock code={`SELECT h.hotel_name, booking_counts.count
FROM hotels h
JOIN (
    SELECT hotel_id, COUNT(*) as count
    FROM bookings
    GROUP BY hotel_id
) booking_counts ON h.hotel_id = booking_counts.hotel_id
WHERE booking_counts.count > (
    SELECT AVG(count) FROM (
        SELECT COUNT(*) as count
        FROM bookings
        GROUP BY hotel_id
    ) subq
);

-- Nested subqueries are hard to read and debug`} />

            <h4 style={{ color: 'var(--success)' }}>✅ CTE (Clean & Testable)</h4>
            <CodeBlock code={`WITH booking_counts AS (
    SELECT hotel_id, COUNT(*) as count
    FROM bookings
    GROUP BY hotel_id
),
avg_bookings AS (
    SELECT AVG(count) as platform_avg
    FROM booking_counts
)
SELECT h.hotel_name, bc.count
FROM booking_counts bc
JOIN hotels h ON bc.hotel_id = h.hotel_id
CROSS JOIN avg_bookings
WHERE bc.count > avg_bookings.platform_avg;

-- Each CTE can be tested independently!
-- Interviewer can see your thought process!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">When Subquery is OK</h3>
            <CodeBlock code={`-- Simple scalar subquery in WHERE
SELECT * FROM hotels
WHERE city IN (
    SELECT city FROM bookings
    GROUP BY city
    HAVING COUNT(*) > 1000
);

-- This is fine! One-time simple filter.
-- No need for CTE overhead.`} />
          </div>

          <div className="alert alert-info mt-2">
            <strong>🎯 Agoda Interview Tip:</strong><br />
            When in doubt, use CTEs! They show you can break complex problems into logical steps. Interviewers want to see your thinking process, and CTEs make that visible.
          </div>
        </div>
      )}

      {/* Tab: CTEs + Window Functions */}
      {activeTab === 'window' && (
        <div className="section">
          <h2 className="section-title">Combining CTEs with Window Functions</h2>

          <div className="alert alert-warning">
            <strong>🚨 CRITICAL PATTERN:</strong> You CANNOT use WHERE on window function results directly. You MUST use a CTE!
          </div>

          <div className="card">
            <h3 className="card-title">The Problem</h3>
            <CodeBlock code={`-- ❌ THIS FAILS!
SELECT
    hotel_id,
    hotel_name,
    ROW_NUMBER() OVER (PARTITION BY city ORDER BY revenue DESC) as rank
FROM hotel_revenue
WHERE rank <= 3;  -- ERROR! Can't use window function alias in WHERE

-- Why? WHERE runs BEFORE window functions in execution order!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">The Solution: CTE First, Then Filter</h3>
            <CodeBlock code={`-- ✅ THIS WORKS!
WITH ranked_hotels AS (
    SELECT
        hotel_id,
        hotel_name,
        city,
        revenue,
        ROW_NUMBER() OVER (
            PARTITION BY city
            ORDER BY revenue DESC
        ) as rank
    FROM hotel_revenue
)
SELECT * FROM ranked_hotels
WHERE rank <= 3;  -- ✅ Now we can filter on rank!

-- Pattern: Window function in CTE → Filter in outer query`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 Real Agoda Pattern: Top N Per Group</h3>
            <p><strong>"Find the 3 most recent bookings for each user"</strong></p>
            <CodeBlock code={`WITH ranked_bookings AS (
    SELECT
        user_id,
        booking_id,
        booking_date,
        amount,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) as recency_rank
    FROM bookings
)
SELECT
    user_id,
    booking_id,
    booking_date,
    amount
FROM ranked_bookings
WHERE recency_rank <= 3
ORDER BY user_id, recency_rank;

-- This pattern appears in EVERY Agoda SQL interview!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🏨 Advanced: Multiple Window Functions</h3>
            <p><strong>"Find users whose latest booking was above their personal average"</strong></p>
            <CodeBlock code={`WITH user_booking_analysis AS (
    SELECT
        user_id,
        booking_id,
        amount,
        booking_date,
        AVG(amount) OVER (PARTITION BY user_id) as user_avg,
        ROW_NUMBER() OVER (
            PARTITION BY user_id
            ORDER BY booking_date DESC
        ) as recency_rank
    FROM bookings
),
latest_bookings AS (
    SELECT * FROM user_booking_analysis
    WHERE recency_rank = 1
)
SELECT
    user_id,
    amount as latest_booking_amount,
    user_avg,
    ROUND(100.0 * (amount - user_avg) / user_avg, 2) as pct_above_avg
FROM latest_bookings
WHERE amount > user_avg
ORDER BY pct_above_avg DESC;

-- Shows users spending more than usual!`} />
          </div>

          <RecallBox
            chapter="Window Functions & Patterns"
            concept="ROW_NUMBER() creates unique ranks. RANK() allows ties. Use PARTITION BY to reset numbering per group."
          />

          <TryThis
            challenge="Find hotels that had their best revenue month in the last 3 months (use CTEs + window functions)."
            hint="Step 1: Calculate monthly revenue per hotel. Step 2: Use RANK() to find best month. Step 3: Filter where rank=1 AND month is recent."
            solution={`WITH monthly_hotel_revenue AS (
    SELECT
        hotel_id,
        DATE_TRUNC('month', booking_date) as month,
        SUM(amount) as revenue
    FROM bookings
    GROUP BY hotel_id, DATE_TRUNC('month', booking_date)
),
ranked_months AS (
    SELECT
        hotel_id,
        month,
        revenue,
        RANK() OVER (
            PARTITION BY hotel_id
            ORDER BY revenue DESC
        ) as revenue_rank
    FROM monthly_hotel_revenue
)
SELECT
    h.hotel_name,
    rm.month,
    rm.revenue
FROM ranked_months rm
JOIN hotels h ON rm.hotel_id = h.hotel_id
WHERE rm.revenue_rank = 1
  AND rm.month >= CURRENT_DATE - INTERVAL '3 months';`}
            explanation="✅ Pattern: Aggregate in CTE → Rank in CTE → Filter in final query. This is the foundation of most Agoda SQL problems!"
          />
        </div>
      )}

      {/* Tab: Common Mistakes */}
      {activeTab === 'mistakes' && (
        <div className="section">
          <h2 className="section-title">Common CTE Mistakes</h2>

          <div className="card">
            <h3 className="card-title">❌ Mistake #1: Forgetting Comma Between CTEs</h3>
            <CodeBlock code={`-- ❌ WRONG
WITH first_cte AS (
    SELECT ...
)  -- Missing comma here!
second_cte AS (
    SELECT ...
)
SELECT * FROM second_cte;

-- ✅ CORRECT
WITH first_cte AS (
    SELECT ...
),  -- ← Comma needed!
second_cte AS (
    SELECT ...
)
SELECT * FROM second_cte;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Mistake #2: Multiple WITH Keywords</h3>
            <CodeBlock code={`-- ❌ WRONG
WITH first_cte AS (SELECT ...)
WITH second_cte AS (SELECT ...)  -- Extra WITH!
SELECT * FROM second_cte;

-- ✅ CORRECT
WITH first_cte AS (SELECT ...),
     second_cte AS (SELECT ...)  -- No WITH, just comma
SELECT * FROM second_cte;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Mistake #3: Not Using the CTE</h3>
            <CodeBlock code={`-- ❌ WRONG - CTE defined but never used!
WITH hotel_revenue AS (
    SELECT hotel_id, SUM(amount) as revenue
    FROM bookings
    GROUP BY hotel_id
)
SELECT * FROM bookings;  -- Didn't use hotel_revenue!

-- ✅ CORRECT
WITH hotel_revenue AS (
    SELECT hotel_id, SUM(amount) as revenue
    FROM bookings
    GROUP BY hotel_id
)
SELECT * FROM hotel_revenue;  -- Use the CTE!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Mistake #4: Referencing CTE Before It's Defined</h3>
            <CodeBlock code={`-- ❌ WRONG - Order matters!
WITH second_cte AS (
    SELECT * FROM first_cte  -- first_cte doesn't exist yet!
),
first_cte AS (
    SELECT ...
)
SELECT * FROM second_cte;

-- ✅ CORRECT - Define in order
WITH first_cte AS (
    SELECT ...
),
second_cte AS (
    SELECT * FROM first_cte  -- Now it exists!
)
SELECT * FROM second_cte;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Mistake #5: Filtering Window Functions Without CTE</h3>
            <CodeBlock code={`-- ❌ WRONG - Can't filter on window function directly
SELECT
    hotel_id,
    ROW_NUMBER() OVER (ORDER BY revenue DESC) as rank
FROM hotels
WHERE rank <= 10;  -- ERROR!

-- ✅ CORRECT - Use CTE first
WITH ranked_hotels AS (
    SELECT
        hotel_id,
        ROW_NUMBER() OVER (ORDER BY revenue DESC) as rank
    FROM hotels
)
SELECT * FROM ranked_hotels WHERE rank <= 10;`} />
          </div>

          <div className="alert alert-info mt-2">
            <strong>🎯 Debugging Tip:</strong><br />
            Test each CTE independently! Replace your final query with:
            <CodeBlock code={`-- Instead of full query, test step by step:
SELECT * FROM first_cte LIMIT 10;  -- Does step 1 work?
SELECT * FROM second_cte LIMIT 10;  -- Does step 2 work?
SELECT * FROM third_cte LIMIT 10;   -- Does step 3 work?

-- Then run the full query once all CTEs are verified!`} />
          </div>
        </div>
      )}

      <KeyTakeaways
        points={[
          'CTEs (WITH clauses) break complex queries into readable steps',
          'Cascade CTEs: each step can reference previous steps',
          'Use CTEs to filter window function results (can\'t filter directly)',
          'CTEs show your thinking process - perfect for interviews!',
          'Agoda tests 3-4 step CTEs combining JOINs, aggregations, and window functions',
          'Syntax: WITH name AS (query), name2 AS (query) SELECT...',
          'Debug by testing each CTE independently with LIMIT 10'
        ]}
        nextChapter="Practice combining CTEs with Window Functions in '🪟 Window Functions & Patterns'"
        relatedChapters="'🔗 JOINs' for multi-table CTEs, '📊 GROUP BY' for aggregations in CTEs"
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
