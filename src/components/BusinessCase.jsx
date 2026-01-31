import { useState } from 'react'
import CodeBlock from './CodeBlock'
import LearningObjectives from './LearningObjectives'
import TLDRBox from './TLDRBox'
import KeyTakeaways from './KeyTakeaways'
import TryThis from './TryThis'
import RecallBox from './RecallBox'

export default function BusinessCase({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('framework')

  const tabs = [
    { id: 'framework', label: '🎯 Analysis Framework', time: '5 min' },
    { id: 'metrics', label: '📊 Choosing Metrics', time: '5 min' },
    { id: 'case1', label: '🏨 Case: Revenue Drop', time: '5 min' },
    { id: 'case2', label: '📈 Case: Growth Strategy', time: '5 min' },
    { id: 'pitfalls', label: '⚠️ Common Pitfalls', time: '5 min' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">📈 Business Case Analysis</h1>
        <p className="chapter-subtitle">Turn vague questions into data-driven answers</p>
      </div>

      <LearningObjectives
        objectives={[
          'Break down ambiguous business questions into SQL queries',
          'Choose the right metrics to measure success',
          'Identify confounding factors in data',
          'Present findings that answer business needs',
          'Handle "what would you recommend?" questions'
        ]}
        time="25 min"
      />

      <TLDRBox
        points={[
          'Start with: What decision needs to be made?',
          'Clarify: What time period? What definition of success?',
          'Consider: Seasonality, confounding factors, data quality',
          'Show: Trends over time, segmentation, comparisons',
          'Recommend: Actionable next steps with supporting data'
        ]}
      />

      <div className="alert alert-warning">
        <strong>🎯 AGODA INTERVIEW FORMAT:</strong> You'll be given a scenario like "bookings are down in Thailand" and asked to analyze it using SQL + business reasoning.
      </div>

      <RecallBox
        chapter="CTEs & Multi-Step Queries"
        concept="Business cases require multi-step analysis. Use CTEs to show your thinking process clearly!"
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

      {/* Tab: Framework */}
      {activeTab === 'framework' && (
        <div className="section">
          <h2 className="section-title">The 5-Step Analysis Framework</h2>

          <div className="card">
            <h3 className="card-title">Step 1: Clarify the Question</h3>
            <p><strong>Vague:</strong> "Why are bookings down?"</p>
            <p><strong>Clarified:</strong></p>
            <ul>
              <li>Down compared to what? (Last month? Last year? Platform average?)</li>
              <li>Down where? (Specific cities? Countries? All regions?)</li>
              <li>Down for whom? (All users? New users? Specific segments?)</li>
              <li>What time period? (Last 7 days? Last month? YTD?)</li>
            </ul>
            <div className="alert alert-info mt-1">
              <strong>💡 In Interviews:</strong> ASK these clarifying questions! Shows you think like an analyst.
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 2: Identify Metrics</h3>
            <CodeBlock code={`Business Question: "Are bookings down?"

Metrics to Calculate:
1. Booking count (absolute numbers)
2. Booking rate (bookings / searches - conversion)
3. Revenue (maybe bookings are down but revenue is up?)
4. Average booking value (quality vs quantity)
5. User segments (new vs returning)

-- Don't just look at one number!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 3: Segment the Data</h3>
            <p>Break down by:</p>
            <ul>
              <li>🌍 Geography (city, country, region)</li>
              <li>👥 User type (new, returning, VIP)</li>
              <li>📅 Time (weekday/weekend, month, season)</li>
              <li>🏨 Product (hotel rating, price range)</li>
              <li>📱 Platform (mobile, desktop, app)</li>
            </ul>
            <p className="mt-1"><strong>Why?</strong> "Overall down 10%" might hide "Bangkok down 40%, Phuket up 20%"</p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 4: Identify Confounding Factors</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Example</th>
                    <th>How to Check</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Seasonality</td>
                    <td>Hotels down in summer (vacation season)</td>
                    <td>Compare to same period last year</td>
                  </tr>
                  <tr>
                    <td>Marketing</td>
                    <td>Ad spend reduced</td>
                    <td>Check traffic sources, new user rate</td>
                  </tr>
                  <tr>
                    <td>Competition</td>
                    <td>Competitor launched promotion</td>
                    <td>Check conversion rate, search volume</td>
                  </tr>
                  <tr>
                    <td>Product Changes</td>
                    <td>Price increase, UI change</td>
                    <td>Check before/after change date</td>
                  </tr>
                  <tr>
                    <td>External Events</td>
                    <td>Pandemic, economy, weather</td>
                    <td>Check news, correlate with dates</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 5: Make Recommendations</h3>
            <p><strong>Good recommendation structure:</strong></p>
            <CodeBlock code={`Finding: "Bangkok bookings down 30% vs last month"

Root Cause Analysis:
- Conversion rate stable (6% → 6.1%) ← Not a product issue
- Search traffic down 35% ← This is the problem!
- New user acquisition down 45% ← Marketing issue
- Returning users stable ← Existing users still engaged

Confounding Factors:
- No major holidays this month vs last month (5% effect)
- Competitor launched 20% off promo 3 weeks ago

Recommendation:
1. Immediate: Launch counter-promotion in Bangkok
2. Short-term: Increase paid marketing to offset traffic drop
3. Long-term: Analyze why competitor is winning new users
4. Monitor: Conversion rate (if it drops, product issue)

Expected Impact: Recover 20-25% of lost bookings`} />
          </div>
        </div>
      )}

      {/* Tab: Choosing Metrics */}
      {activeTab === 'metrics' && (
        <div className="section">
          <h2 className="section-title">How to Choose the Right Metrics</h2>

          <div className="card">
            <h3 className="card-title">The Metric Hierarchy</h3>
            <CodeBlock code={`Level 1: North Star Metric (Business Goal)
└─ Revenue, Active Users, Bookings

Level 2: Input Metrics (What Drives the Goal)
├─ Traffic (searches, visits)
├─ Conversion Rate (searches → bookings)
└─ Average Order Value (booking amount)

Level 3: Diagnostic Metrics (Why is it changing?)
├─ New vs Returning Users
├─ Geographic Breakdown
├─ Device/Platform Mix
└─ Time Trends

-- Always connect lower metrics to business goal!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Common Agoda Business Questions → Metrics</h3>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Question</th>
                    <th>Primary Metric</th>
                    <th>Supporting Metrics</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>"Should we expand to new city?"</td>
                    <td>Search volume from that city</td>
                    <td>Current booking destinations, travel distance, competitor presence</td>
                  </tr>
                  <tr>
                    <td>"Are promotions working?"</td>
                    <td>Incremental bookings (vs baseline)</td>
                    <td>ROI (revenue / promo cost), cannibalization rate</td>
                  </tr>
                  <tr>
                    <td>"Which users to target?"</td>
                    <td>Lifetime Value (LTV)</td>
                    <td>Retention rate, booking frequency, avg booking value</td>
                  </tr>
                  <tr>
                    <td>"Is pricing optimal?"</td>
                    <td>Revenue (price × volume)</td>
                    <td>Demand elasticity, conversion at different price points</td>
                  </tr>
                  <tr>
                    <td>"Hotel quality impact?"</td>
                    <td>Repeat booking rate by rating</td>
                    <td>Cancellation rate, review scores, booking-to-review time</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">🚨 Metrics to Watch Out For</h3>
            <div className="alert alert-warning">
              <strong>Vanity Metrics</strong> (look good but don't drive decisions):
              <ul>
                <li>❌ Total registered users (includes inactive)</li>
                <li>❌ Page views (doesn't mean engagement)</li>
                <li>❌ App downloads (doesn't mean usage)</li>
              </ul>
            </div>
            <div className="alert alert-success mt-1">
              <strong>Actionable Metrics</strong> (you can change behavior):
              <ul>
                <li>✅ Weekly active users (shows engagement trend)</li>
                <li>✅ Search-to-booking conversion (shows funnel health)</li>
                <li>✅ 30-day retention (shows product value)</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Case 1 - Revenue Drop */}
      {activeTab === 'case1' && (
        <div className="section">
          <h2 className="section-title">🏨 Case Study: Revenue Drop Investigation</h2>

          <div className="card">
            <h3 className="card-title">Scenario</h3>
            <p>
              <strong>"You're a BI analyst at Agoda. The Thailand country manager reports that revenue is down 15% this month compared to last month. Investigate and recommend actions."</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 1: Validate the Claim</h3>
            <CodeBlock code={`-- Calculate month-over-month revenue change
WITH monthly_revenue AS (
    SELECT
        DATE_TRUNC('month', booking_date) as month,
        SUM(amount) as revenue,
        COUNT(*) as booking_count
    FROM bookings
    WHERE country = 'Thailand'
    AND booking_date >= CURRENT_DATE - INTERVAL '3 months'
    GROUP BY DATE_TRUNC('month', booking_date)
)
SELECT
    month,
    revenue,
    booking_count,
    LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
    ROUND(100.0 * (revenue - LAG(revenue) OVER (ORDER BY month))
          / LAG(revenue) OVER (ORDER BY month), 2) as revenue_change_pct
FROM monthly_revenue
ORDER BY month DESC;

-- ✅ Confirms: Down 15.3% from last month
-- 💡 But up 5% vs same month last year (seasonality!)`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 2: Decompose Revenue</h3>
            <CodeBlock code={`-- Revenue = Bookings × Average Booking Value
WITH current_vs_previous AS (
    SELECT
        CASE
            WHEN booking_date >= DATE_TRUNC('month', CURRENT_DATE) THEN 'current'
            ELSE 'previous'
        END as period,
        COUNT(*) as bookings,
        SUM(amount) as revenue,
        AVG(amount) as avg_booking_value
    FROM bookings
    WHERE country = 'Thailand'
    AND booking_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
    GROUP BY period
)
SELECT
    period,
    bookings,
    revenue,
    avg_booking_value
FROM current_vs_previous;

-- Findings:
-- Bookings: 10,000 → 8,500 (-15%)
-- Avg Value: $150 → $150 (flat)
-- Conclusion: Volume problem, not pricing problem!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 3: Segment by City</h3>
            <CodeBlock code={`-- Which cities are driving the decline?
WITH monthly_city_revenue AS (
    SELECT
        city,
        DATE_TRUNC('month', booking_date) as month,
        SUM(amount) as revenue
    FROM bookings
    WHERE country = 'Thailand'
    AND booking_date >= CURRENT_DATE - INTERVAL '2 months'
    GROUP BY city, month
),
city_changes AS (
    SELECT
        city,
        MAX(CASE WHEN month = DATE_TRUNC('month', CURRENT_DATE) THEN revenue END) as current_month,
        MAX(CASE WHEN month = DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month' THEN revenue END) as prev_month
    FROM monthly_city_revenue
    GROUP BY city
)
SELECT
    city,
    current_month,
    prev_month,
    ROUND(100.0 * (current_month - prev_month) / prev_month, 2) as pct_change
FROM city_changes
WHERE prev_month > 0
ORDER BY (current_month - prev_month) ASC;

-- Findings:
-- Bangkok: -25% (-$500k) ← Big problem!
-- Phuket: +5% (+$50k)
-- Chiang Mai: -5% (-$20k)
-- Root cause is Bangkok-specific!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 4: Investigate Bangkok</h3>
            <CodeBlock code={`-- Check conversion funnel in Bangkok
WITH bangkok_funnel AS (
    SELECT
        DATE_TRUNC('month', created_at) as month,
        COUNT(DISTINCT user_id) as searchers,
        COUNT(DISTINCT CASE WHEN converted = true THEN user_id END) as bookers
    FROM searches
    WHERE city = 'Bangkok'
    AND created_at >= CURRENT_DATE - INTERVAL '2 months'
    GROUP BY month
)
SELECT
    month,
    searchers,
    bookers,
    ROUND(100.0 * bookers / searchers, 2) as conversion_rate
FROM bangkok_funnel;

-- Findings:
-- Last Month: 100,000 searches, 6,000 bookings (6% conversion)
-- This Month: 70,000 searches, 4,200 bookings (6% conversion)
-- Conclusion: Traffic down 30%, but conversion STABLE
-- → Marketing/acquisition problem, not product problem!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Final Recommendation</h3>
            <div style={{ background: 'rgba(76, 175, 80, 0.1)', padding: '1rem', borderRadius: '8px', border: '2px solid var(--success)' }}>
              <strong style={{ color: 'var(--success)' }}>Analysis Summary:</strong>
              <ul>
                <li>Revenue down 15% Thailand-wide, but 100% driven by Bangkok (-25%)</li>
                <li>Root cause: Search traffic down 30% in Bangkok</li>
                <li>Conversion rate stable → product is fine</li>
                <li>Other cities performing normally or up</li>
              </ul>
              <strong style={{ color: 'var(--success)', marginTop: '1rem', display: 'block' }}>Recommended Actions:</strong>
              <ol>
                <li><strong>Immediate:</strong> Investigate marketing channels for Bangkok (ad spend down? competitor outbidding?)</li>
                <li><strong>1 Week:</strong> Launch Bangkok-specific promotion to boost demand</li>
                <li><strong>2 Weeks:</strong> A/B test Bangkok search ranking algorithm (maybe users not finding good hotels?)</li>
                <li><strong>Monitor:</strong> Daily Bangkok search traffic and conversion rate</li>
              </ol>
            </div>
          </div>

          <TryThis
            challenge="You notice average booking value is up 20% this month, but the CEO is worried bookings are down 10%. What do you investigate?"
            hint="Revenue = Bookings × Avg Value. Calculate revenue change. Then segment by user type, city, price range."
            solution={`-- Calculate actual revenue impact
WITH metrics AS (
    SELECT
        DATE_TRUNC('month', booking_date) as month,
        COUNT(*) as bookings,
        AVG(amount) as avg_value,
        SUM(amount) as revenue
    FROM bookings
    GROUP BY month
    ORDER BY month DESC
    LIMIT 2
)
SELECT
    month,
    bookings,
    avg_value,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_revenue
FROM metrics;

-- Then segment: Are high-value bookings up while low-value down?
-- Check: New luxury hotels? Different user mix? Price increases?`}
            explanation="✅ Revenue is the actual business metric! Down 10% bookings + up 20% avg value = +8% revenue. This is GOOD! CEO's concern is valid only if you want volume growth. Investigate if you're losing low-end customers but gaining high-end (market shift)."
          />
        </div>
      )}

      {/* Tab: Case 2 - Growth Strategy */}
      {activeTab === 'case2' && (
        <div className="section">
          <h2 className="section-title">📈 Case Study: City Expansion Strategy</h2>

          <div className="card">
            <h3 className="card-title">Scenario</h3>
            <p>
              <strong>"Agoda wants to expand to 3 new cities in Southeast Asia. You have budget to add 200 hotels. Which cities should you prioritize and why?"</strong>
            </p>
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 1: Identify Demand Signals</h3>
            <CodeBlock code={`-- Find cities where users search but we have no inventory
WITH search_destinations AS (
    SELECT
        destination_city,
        COUNT(DISTINCT user_id) as unique_searchers,
        COUNT(*) as total_searches
    FROM searches
    WHERE created_at >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY destination_city
),
cities_with_hotels AS (
    SELECT DISTINCT city FROM hotels
)
SELECT
    sd.destination_city,
    sd.unique_searchers,
    sd.total_searches,
    CASE
        WHEN ch.city IS NULL THEN 'No inventory'
        ELSE 'Has inventory'
    END as inventory_status
FROM search_destinations sd
LEFT JOIN cities_with_hotels ch ON sd.destination_city = ch.city
WHERE ch.city IS NULL
ORDER BY sd.unique_searchers DESC
LIMIT 10;

-- Top untapped demand cities`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 2: Calculate Opportunity Size</h3>
            <CodeBlock code={`-- Estimate potential revenue using similar cities
WITH city_metrics AS (
    SELECT
        h.city,
        COUNT(DISTINCT h.hotel_id) as hotel_count,
        COUNT(DISTINCT b.booking_id) as annual_bookings,
        SUM(b.amount) as annual_revenue,
        COUNT(DISTINCT b.user_id) as unique_customers
    FROM hotels h
    LEFT JOIN bookings b ON h.hotel_id = b.hotel_id
        AND b.booking_date >= CURRENT_DATE - INTERVAL '1 year'
    WHERE h.country = 'Thailand'  -- Similar market
    GROUP BY h.city
)
SELECT
    city,
    hotel_count,
    annual_bookings,
    annual_revenue,
    ROUND(annual_revenue / hotel_count, 0) as revenue_per_hotel,
    ROUND(annual_bookings / hotel_count, 1) as bookings_per_hotel
FROM city_metrics
WHERE hotel_count >= 20  -- Mature cities only
ORDER BY revenue_per_hotel DESC;

-- Use avg revenue_per_hotel to estimate new city potential
-- 200 hotels × $50k/hotel = $10M annual revenue potential`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Step 3: Score Candidate Cities</h3>
            <CodeBlock code={`-- Multi-factor scoring
WITH candidate_cities AS (
    SELECT
        'Hanoi' as city, 5000 as searchers, 200000 as population, 50 as competitors, 'mid' as season
    UNION ALL
    SELECT 'Siem Reap', 3000, 150000, 20, 'high'
    UNION ALL
    SELECT 'Yangon', 2000, 500000, 30, 'low'
    -- ... more cities
)
SELECT
    city,
    -- Demand score (0-40 points)
    LEAST(searchers / 100, 40) as demand_score,
    -- Market size score (0-30 points)
    LEAST(population / 10000, 30) as market_score,
    -- Competition score (0-30 points, lower competition = higher score)
    30 - LEAST(competitors / 2, 30) as competition_score,
    -- Seasonality (high season = more urgent)
    CASE season
        WHEN 'high' THEN 10
        WHEN 'mid' THEN 5
        ELSE 0
    END as seasonality_score,
    -- Total score
    LEAST(searchers / 100, 40) +
    LEAST(population / 10000, 30) +
    (30 - LEAST(competitors / 2, 30)) +
    CASE season WHEN 'high' THEN 10 WHEN 'mid' THEN 5 ELSE 0 END as total_score
FROM candidate_cities
ORDER BY total_score DESC;

-- Top 3 cities win!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">Final Recommendation with Trade-offs</h3>
            <div style={{ background: 'rgba(76, 175, 80, 0.1)', padding: '1rem', borderRadius: '8px', border: '2px solid var(--success)' }}>
              <strong style={{ color: 'var(--success)' }}>Recommended Cities:</strong>
              <ol>
                <li><strong>Hanoi (70 points)</strong>
                  <ul>
                    <li>✅ Highest search demand (5,000 monthly searchers)</li>
                    <li>✅ Large market (2M metro population)</li>
                    <li>⚠️ High competition (50 competitors)</li>
                    <li>💰 Est. revenue: $3.5M/year</li>
                  </ul>
                </li>
                <li><strong>Siem Reap (65 points)</strong>
                  <ul>
                    <li>✅ Peak season starting (high urgency)</li>
                    <li>✅ Low competition (only 20 competitors)</li>
                    <li>⚠️ Seasonal demand (low season risk)</li>
                    <li>💰 Est. revenue: $2M/year</li>
                  </ul>
                </li>
                <li><strong>Yangon (58 points)</strong>
                  <ul>
                    <li>✅ Largest population (untapped market)</li>
                    <li>⚠️ Lower current demand (growth market)</li>
                    <li>✅ Medium competition</li>
                    <li>💰 Est. revenue: $1.5M/year</li>
                  </ul>
                </li>
              </ol>
              <strong style={{ marginTop: '1rem', display: 'block' }}>Investment Allocation:</strong>
              <ul>
                <li>Hanoi: 100 hotels (50%) - proven demand</li>
                <li>Siem Reap: 60 hotels (30%) - seasonal boost</li>
                <li>Yangon: 40 hotels (20%) - long-term bet</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Common Pitfalls */}
      {activeTab === 'pitfalls' && (
        <div className="section">
          <h2 className="section-title">⚠️ Common Analysis Pitfalls</h2>

          <div className="card">
            <h3 className="card-title">❌ Pitfall #1: Confusing Correlation with Causation</h3>
            <CodeBlock code={`-- Observation: Cities with more hotels have lower average ratings
SELECT
    city,
    COUNT(*) as hotel_count,
    AVG(rating) as avg_rating
FROM hotels
GROUP BY city
ORDER BY hotel_count DESC;

-- ❌ Wrong conclusion: "More hotels → lower quality"
-- ✅ Real reason: Larger cities have more variety (budget to luxury)
--    → Inclusion of budget hotels lowers average

-- Better analysis: Segment by price tier
SELECT
    city,
    price_tier,
    COUNT(*) as hotel_count,
    AVG(rating) as avg_rating
FROM hotels
GROUP BY city, price_tier;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Pitfall #2: Simpson's Paradox</h3>
            <CodeBlock code={`-- Overall conversion rate improved
Overall: 5% → 6% ✅

-- But BOTH segments got worse!
Mobile: 8% → 7% ❌
Desktop: 3% → 2.5% ❌

-- How? Mix shifted: 50% mobile → 80% mobile
-- Mobile has higher conversion, so overall looks better
-- But individual channels declined!

-- Lesson: ALWAYS segment! Don't trust overall metrics alone.`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Pitfall #3: Survivorship Bias</h3>
            <CodeBlock code={`-- "Let's see why successful hotels succeed"
SELECT hotel_id, strategy
FROM hotels
WHERE rating >= 4.5;

-- ❌ Missing: Hotels that tried same strategy but failed
-- ✅ Better: Compare successful vs unsuccessful hotels

SELECT
    strategy,
    COUNT(*) as total_hotels,
    SUM(CASE WHEN rating >= 4.5 THEN 1 ELSE 0 END) as successful,
    ROUND(100.0 * SUM(CASE WHEN rating >= 4.5 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM hotels
GROUP BY strategy
ORDER BY success_rate DESC;`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Pitfall #4: Ignoring Outliers</h3>
            <CodeBlock code={`-- Average booking value
SELECT AVG(amount) FROM bookings;
-- Result: $500

-- Looks normal, but...
SELECT
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY amount) as median,
    AVG(amount) as mean,
    MIN(amount) as min,
    MAX(amount) as max
FROM bookings;
-- median: $150
-- mean: $500
-- max: $50,000 (luxury suite!)

-- ✅ One luxury booking skews the average!
-- Better: Use median or remove outliers for analysis`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">❌ Pitfall #5: Not Accounting for Time Lags</h3>
            <CodeBlock code={`-- "We launched promotion on May 1st, bookings up 20% on May 2nd!"
-- ❌ Too fast! Most bookings are 2-4 weeks in advance.

-- ✅ Better analysis: Check booking_date vs stay_date
SELECT
    booking_date,
    stay_date,
    AVG(stay_date - booking_date) as avg_lead_time_days
FROM bookings
GROUP BY booking_date, stay_date;

-- Real impact of promo shows 2-3 weeks later
-- When people book for future stays!`} />
          </div>

          <div className="card mt-2">
            <h3 className="card-title">✅ Best Practices Checklist</h3>
            <ul>
              <li>✅ Always compare to a baseline (not just absolute numbers)</li>
              <li>✅ Segment by key dimensions (geography, user type, time)</li>
              <li>✅ Check for seasonality (compare to same period last year)</li>
              <li>✅ Look at both rates AND absolute numbers</li>
              <li>✅ Consider confounding factors (what else changed?)</li>
              <li>✅ Validate data quality (missing data? Definition changes?)</li>
              <li>✅ Present with confidence intervals or error ranges</li>
              <li>✅ Make recommendations actionable and specific</li>
            </ul>
          </div>
        </div>
      )}

      <KeyTakeaways
        points={[
          'Start with clarifying questions: Compared to what? For whom? What timeframe?',
          'Choose metrics that drive decisions, not vanity metrics',
          'Always segment data by geography, user type, and time',
          'Identify confounding factors (seasonality, competition, external events)',
          'Decompose problems: Revenue = Bookings × Avg Value',
          'Use CTEs to show multi-step thinking in SQL',
          'Present recommendations with expected impact and trade-offs',
          'Watch for pitfalls: correlation ≠ causation, survivorship bias, outliers'
        ]}
        nextChapter="Apply these skills in '🎬 Mock Test' with timed practice"
        relatedChapters="Use '🏗️ CTEs' for multi-step analysis queries"
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
