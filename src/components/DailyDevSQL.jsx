import { useState } from 'react'
import CodeBlock from './CodeBlock'

export default function DailyDevSQL({ onComplete, isCompleted }) {
  const [activeTab, setActiveTab] = useState('text')

  const tabs = [
    { id: 'text', label: '🔍 Text Search' },
    { id: 'filters', label: '⚡ Smart Filtering' },
    { id: 'strings', label: '📝 String Functions' },
    { id: 'dates', label: '📅 Date/Time Magic' },
    { id: 'types', label: '🔄 Type Conversion' },
    { id: 'conditional', label: '🎛️ CASE WHEN' },
    { id: 'pagination', label: '📄 Pagination' },
    { id: 'aggregation', label: '📋 List Aggregation' }
  ]

  return (
    <div className="chapter">
      <div className="chapter-header">
        <h1 className="chapter-title">💼 Daily Developer SQL</h1>
        <p className="chapter-subtitle">Practical clauses you'll use every day</p>
      </div>

      <div className="alert alert-info">
        <strong>🎯 What This Is:</strong><br />
        This isn't interview prep - this is your daily toolkit! These are the SQL clauses and functions
        you'll use constantly in real BI/analytics work. Bookmark this page!
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

      {activeTab === 'text' && (
        <>
          <div className="section">
            <h2 className="section-title">🔍 Text Search with LIKE</h2>
            <p className="section-content">
              <strong>Use Case:</strong> Search for partial matches in text fields (emails, names, addresses)
            </p>

            <div className="card">
              <h3 className="card-title">Wildcards</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Wildcard</th>
                      <th>Meaning</th>
                      <th>Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>%</code></td>
                      <td>Any number of characters (0+)</td>
                      <td><code>'%@gmail.com'</code> matches "user@gmail.com"</td>
                    </tr>
                    <tr>
                      <td><code>_</code></td>
                      <td>Exactly one character</td>
                      <td><code>'202_'</code> matches "2024", "2025"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Common Patterns</h3>
              <CodeBlock code={`-- Emails from Gmail
SELECT * FROM users
WHERE email LIKE '%@gmail.com';

-- Emails from any Gmail domain (gmail.com, gmail.co.th, etc.)
SELECT * FROM users
WHERE email LIKE '%@gmail.%';

-- Names starting with 'John'
SELECT * FROM users
WHERE name LIKE 'John%';

-- Names ending with 'son' (Johnson, Anderson, etc.)
SELECT * FROM users
WHERE name LIKE '%son';

-- Names containing 'van' anywhere (Evan, Ivan, Savannah)
SELECT * FROM users
WHERE name LIKE '%van%';

-- Phone numbers with area code 02 (Thailand Bangkok)
SELECT * FROM users
WHERE phone LIKE '02%';

-- Hotel codes: 'BKK_____' (BKK + exactly 5 chars)
SELECT * FROM hotels
WHERE hotel_code LIKE 'BKK_____';`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Case-Insensitive Search</h3>
              <CodeBlock code={`-- PostgreSQL: ILIKE (case-insensitive)
SELECT * FROM users
WHERE email ILIKE '%GMAIL.COM';  -- Matches gmail.com, Gmail.com, GMAIL.COM

-- MySQL/Other DBs: Use LOWER() or UPPER()
SELECT * FROM users
WHERE LOWER(email) LIKE '%@gmail.com';

-- Search for 'bangkok' in any case
SELECT * FROM hotels
WHERE LOWER(city) LIKE '%bangkok%';`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Multiple Patterns (OR)</h3>
              <CodeBlock code={`-- Find Gmail OR Yahoo emails
SELECT * FROM users
WHERE email LIKE '%@gmail.com'
   OR email LIKE '%@yahoo.com';

-- Better: Use SIMILAR TO (PostgreSQL)
SELECT * FROM users
WHERE email SIMILAR TO '%@(gmail|yahoo|hotmail).com';`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">NOT LIKE (Exclusion)</h3>
              <CodeBlock code={`-- Find non-Gmail users
SELECT * FROM users
WHERE email NOT LIKE '%@gmail.com';

-- Find hotels NOT in Bangkok
SELECT * FROM hotels
WHERE city NOT LIKE '%Bangkok%';`} />
            </div>

            <div className="alert alert-warning mt-2">
              <strong>⚠️ Performance Warning:</strong><br />
              • <code>LIKE '%end'</code> (leading wildcard) is SLOW - can't use index<br />
              • <code>LIKE 'start%'</code> (trailing wildcard) is FAST - can use index<br />
              • <code>LIKE '%middle%'</code> (both sides) is SLOW - full table scan<br />
              <br />
              <strong>Tip:</strong> For full-text search, use dedicated search engines (Elasticsearch) or
              database full-text search features instead of LIKE.
            </div>
          </div>
        </>
      )}

      {activeTab === 'filters' && (
        <>
          <div className="section">
            <h2 className="section-title">⚡ Smart Filtering Tricks</h2>

            <div className="card">
              <h3 className="card-title">IN - Multiple Values</h3>
              <p>
                <strong>Use Case:</strong> Filter by a list of specific values
              </p>
              <CodeBlock code={`-- Find users from Thailand, Singapore, Malaysia
SELECT * FROM users
WHERE country IN ('Thailand', 'Singapore', 'Malaysia');

-- Much cleaner than:
WHERE country = 'Thailand' OR country = 'Singapore' OR country = 'Malaysia';

-- Find specific hotel IDs
SELECT * FROM bookings
WHERE hotel_id IN (101, 205, 387, 492);

-- IN with subquery (find users who made bookings)
SELECT * FROM users
WHERE user_id IN (
    SELECT DISTINCT user_id FROM bookings
);`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">NOT IN - Exclusion</h3>
              <CodeBlock code={`-- Find users NOT from these countries
SELECT * FROM users
WHERE country NOT IN ('USA', 'UK', 'Canada');

-- ⚠️ NULL TRAP! NOT IN fails if subquery returns NULL
-- WRONG (if any booking has NULL user_id, returns no results!)
SELECT * FROM users
WHERE user_id NOT IN (SELECT user_id FROM bookings);

-- ✅ RIGHT: Use NOT EXISTS or IS NOT NULL
SELECT * FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM bookings b WHERE b.user_id = u.user_id
);`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">BETWEEN - Range Filtering</h3>
              <p>
                <strong>Use Case:</strong> Filter by numeric or date ranges (inclusive!)
              </p>
              <CodeBlock code={`-- Bookings in a date range (INCLUSIVE on both ends)
SELECT * FROM bookings
WHERE booking_date BETWEEN '2024-01-01' AND '2024-12-31';

-- Same as:
WHERE booking_date >= '2024-01-01' AND booking_date <= '2024-12-31';

-- Price range
SELECT * FROM hotels
WHERE price_per_night BETWEEN 1000 AND 5000;

-- NOT BETWEEN (outside range)
SELECT * FROM hotels
WHERE star_rating NOT BETWEEN 1 AND 3;  -- Only 4 and 5 star hotels`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">IS NULL / IS NOT NULL</h3>
              <CodeBlock code={`-- Find users without phone numbers
SELECT * FROM users
WHERE phone IS NULL;

-- Find bookings with reviews (review column exists)
SELECT * FROM bookings
WHERE review_text IS NOT NULL;

-- ⚠️ COMMON MISTAKE: Using = NULL doesn't work!
WHERE phone = NULL     -- ❌ WRONG - returns nothing!
WHERE phone IS NULL    -- ✅ RIGHT`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">IS DISTINCT FROM (PostgreSQL)</h3>
              <p>
                <strong>Use Case:</strong> Compare values treating NULL as a regular value
              </p>
              <CodeBlock code={`-- Normal comparison: NULL = NULL returns NULL (not TRUE!)
SELECT * FROM users WHERE phone = phone;  -- Excludes NULLs!

-- IS DISTINCT FROM: NULL = NULL returns FALSE (they're the same!)
SELECT * FROM users WHERE phone IS NOT DISTINCT FROM phone;  -- Includes NULLs!

-- Real example: Find users whose email changed
SELECT * FROM user_history
WHERE old_email IS DISTINCT FROM new_email;
-- This correctly handles cases where both are NULL (no change)`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Combining Conditions Smartly</h3>
              <CodeBlock code={`-- Use parentheses to group conditions correctly!
-- Find premium users from Asia OR any user who spent > $10k
SELECT * FROM users
WHERE (account_type = 'premium' AND country IN ('Thailand', 'Singapore'))
   OR total_spent > 10000;

-- Find hotels: (4-5 star) AND (Bangkok OR Phuket)
SELECT * FROM hotels
WHERE star_rating >= 4
  AND city IN ('Bangkok', 'Phuket');`} />
            </div>
          </div>
        </>
      )}

      {activeTab === 'strings' && (
        <>
          <div className="section">
            <h2 className="section-title">📝 String Functions</h2>

            <div className="card">
              <h3 className="card-title">CONCAT - Join Strings</h3>
              <CodeBlock code={`-- Create full name
SELECT CONCAT(first_name, ' ', last_name) AS full_name
FROM users;

-- Create email-like identifier
SELECT CONCAT(user_id, '@user.local') AS fake_email
FROM users;

-- Multiple values with separator
SELECT CONCAT(city, ', ', country) AS location
FROM hotels;

-- PostgreSQL alternative: || operator
SELECT first_name || ' ' || last_name AS full_name
FROM users;

-- MySQL: CONCAT_WS (concat with separator)
SELECT CONCAT_WS(', ', city, country) AS location
FROM hotels;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">SUBSTRING / SUBSTR - Extract Part of String</h3>
              <CodeBlock code={`-- Extract first 3 characters (area code from phone)
SELECT SUBSTRING(phone, 1, 3) AS area_code
FROM users;
-- '0812345678' → '081'

-- Get domain from email (PostgreSQL)
SELECT SUBSTRING(email FROM '@(.*)') AS domain
FROM users;
-- 'user@gmail.com' → 'gmail.com'

-- MySQL: SUBSTRING_INDEX
SELECT SUBSTRING_INDEX(email, '@', -1) AS domain
FROM users;

-- Extract year from date string '2024-01-15'
SELECT SUBSTRING(booking_date::text, 1, 4) AS year
FROM bookings;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">TRIM, LTRIM, RTRIM - Remove Whitespace</h3>
              <CodeBlock code={`-- Remove spaces from both sides
SELECT TRIM(name) AS clean_name
FROM users;
-- '  John Doe  ' → 'John Doe'

-- Remove from left only
SELECT LTRIM(name) AS clean_name
FROM users;
-- '  John Doe' → 'John Doe'

-- Remove from right only
SELECT RTRIM(name) AS clean_name
FROM users;
-- 'John Doe  ' → 'John Doe'

-- Remove specific characters (PostgreSQL)
SELECT TRIM(BOTH '/' FROM '/path/to/file/') AS clean_path;
-- '/path/to/file/' → 'path/to/file'`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">UPPER, LOWER - Change Case</h3>
              <CodeBlock code={`-- Convert to uppercase
SELECT UPPER(email) AS upper_email
FROM users;
-- 'user@Gmail.Com' → 'USER@GMAIL.COM'

-- Convert to lowercase (useful for case-insensitive comparison)
SELECT * FROM users
WHERE LOWER(email) = LOWER('User@Gmail.Com');

-- Clean data: standardize country names
UPDATE hotels
SET country = UPPER(SUBSTRING(country, 1, 1)) || LOWER(SUBSTRING(country, 2));
-- 'tHaILand' → 'Thailand'`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">REPLACE - Find and Replace</h3>
              <CodeBlock code={`-- Replace dashes with spaces in hotel names
SELECT REPLACE(hotel_name, '-', ' ') AS clean_name
FROM hotels;
-- 'Grand-Palace-Hotel' → 'Grand Palace Hotel'

-- Remove all spaces
SELECT REPLACE(phone, ' ', '') AS clean_phone
FROM users;
-- '081 234 5678' → '0812345678'

-- Replace multiple (chain them)
SELECT REPLACE(REPLACE(text, '\n', ' '), '\t', ' ') AS clean_text
FROM reviews;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">LENGTH / CHAR_LENGTH - String Length</h3>
              <CodeBlock code={`-- Find emails that are too long (> 50 chars)
SELECT email FROM users
WHERE LENGTH(email) > 50;

-- Find short hotel names (might be abbreviations)
SELECT hotel_name FROM hotels
WHERE CHAR_LENGTH(hotel_name) < 5;

-- Validate phone number length
SELECT * FROM users
WHERE LENGTH(REPLACE(phone, ' ', '')) = 10;  -- Exactly 10 digits`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">SPLIT_PART - Split String (PostgreSQL)</h3>
              <CodeBlock code={`-- Get email username (before @)
SELECT SPLIT_PART(email, '@', 1) AS username
FROM users;
-- 'john.doe@gmail.com' → 'john.doe'

-- Get email domain (after @)
SELECT SPLIT_PART(email, '@', 2) AS domain
FROM users;
-- 'john.doe@gmail.com' → 'gmail.com'

-- Parse CSV data: '2024-01-15,Bangkok,1500'
SELECT
    SPLIT_PART(data, ',', 1) AS date,
    SPLIT_PART(data, ',', 2) AS city,
    SPLIT_PART(data, ',', 3) AS amount
FROM raw_data;`} />
            </div>

            <div className="alert alert-success mt-2">
              <strong>💡 Real-World Use Cases:</strong><br />
              • Data Cleaning: TRIM, UPPER, LOWER, REPLACE<br />
              • Validation: LENGTH, LIKE pattern matching<br />
              • Parsing: SUBSTRING, SPLIT_PART<br />
              • Display: CONCAT for user-friendly names<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'dates' && (
        <>
          <div className="section">
            <h2 className="section-title">📅 Date/Time Magic</h2>

            <div className="card">
              <h3 className="card-title">Current Date/Time</h3>
              <CodeBlock code={`-- Current timestamp (with time)
SELECT NOW();
-- 2024-01-30 14:35:22.123456+00

-- Current date (no time)
SELECT CURRENT_DATE;
-- 2024-01-30

-- Current time (no date)
SELECT CURRENT_TIME;
-- 14:35:22.123456+00

-- Use in queries: Find bookings from today
SELECT * FROM bookings
WHERE booking_date = CURRENT_DATE;

-- Bookings from last 7 days
SELECT * FROM bookings
WHERE booking_date >= CURRENT_DATE - INTERVAL '7 days';`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Date Arithmetic</h3>
              <CodeBlock code={`-- Add days
SELECT CURRENT_DATE + INTERVAL '7 days' AS next_week;
SELECT CURRENT_DATE + 7 AS next_week;  -- Shorthand

-- Subtract days
SELECT CURRENT_DATE - INTERVAL '30 days' AS last_month;

-- Add months
SELECT CURRENT_DATE + INTERVAL '3 months';

-- Add years
SELECT CURRENT_DATE + INTERVAL '1 year';

-- Calculate days between dates
SELECT booking_date - created_date AS days_to_book
FROM bookings;

-- Find bookings 30+ days in advance
SELECT * FROM bookings
WHERE check_in_date - booking_date >= 30;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">DATE_TRUNC - Truncate to Period</h3>
              <p>
                <strong>Use Case:</strong> Group by day/week/month/year
              </p>
              <CodeBlock code={`-- Truncate to start of day
SELECT DATE_TRUNC('day', booking_timestamp) AS booking_day
FROM bookings;
-- '2024-01-30 14:35:22' → '2024-01-30 00:00:00'

-- Truncate to start of week (Monday)
SELECT DATE_TRUNC('week', booking_date) AS week_start
FROM bookings;

-- Truncate to start of month
SELECT DATE_TRUNC('month', booking_date) AS month_start
FROM bookings;

-- Truncate to start of year
SELECT DATE_TRUNC('year', booking_date) AS year_start
FROM bookings;

-- Real example: Bookings per month
SELECT
    DATE_TRUNC('month', booking_date) AS month,
    COUNT(*) AS total_bookings
FROM bookings
GROUP BY DATE_TRUNC('month', booking_date)
ORDER BY month;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">EXTRACT - Get Date Part</h3>
              <CodeBlock code={`-- Extract year
SELECT EXTRACT(YEAR FROM booking_date) AS year
FROM bookings;
-- '2024-01-30' → 2024

-- Extract month (1-12)
SELECT EXTRACT(MONTH FROM booking_date) AS month
FROM bookings;
-- '2024-01-30' → 1

-- Extract day of month (1-31)
SELECT EXTRACT(DAY FROM booking_date) AS day
FROM bookings;

-- Extract day of week (0=Sunday, 6=Saturday)
SELECT EXTRACT(DOW FROM booking_date) AS day_of_week
FROM bookings;

-- Extract ISO day of week (1=Monday, 7=Sunday)
SELECT EXTRACT(ISODOW FROM booking_date) AS iso_day_of_week
FROM bookings;

-- Real example: Find weekend bookings
SELECT * FROM bookings
WHERE EXTRACT(ISODOW FROM booking_date) IN (6, 7);  -- Saturday, Sunday

-- Bookings by day of week
SELECT
    EXTRACT(ISODOW FROM booking_date) AS day_of_week,
    COUNT(*) AS total
FROM bookings
GROUP BY EXTRACT(ISODOW FROM booking_date)
ORDER BY day_of_week;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Date Formatting</h3>
              <CodeBlock code={`-- Format date as string (PostgreSQL: TO_CHAR)
SELECT TO_CHAR(booking_date, 'YYYY-MM-DD') AS formatted_date
FROM bookings;

-- Format with month name
SELECT TO_CHAR(booking_date, 'Mon DD, YYYY') AS formatted_date
FROM bookings;
-- 'Jan 30, 2024'

-- Format with day name
SELECT TO_CHAR(booking_date, 'Day, DD Month YYYY') AS formatted_date
FROM bookings;
-- 'Tuesday, 30 January 2024'

-- Common formats:
-- YYYY-MM-DD          → 2024-01-30
-- DD/MM/YYYY          → 30/01/2024
-- Mon DD, YYYY        → Jan 30, 2024
-- Day                 → Tuesday
-- HH24:MI:SS          → 14:35:22

-- MySQL: DATE_FORMAT
SELECT DATE_FORMAT(booking_date, '%Y-%m-%d') AS formatted_date
FROM bookings;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">AGE - Calculate Time Between Dates</h3>
              <CodeBlock code={`-- PostgreSQL: AGE function
SELECT AGE(check_out_date, check_in_date) AS stay_duration
FROM bookings;
-- '3 days 0 hours'

-- Calculate age from birthdate
SELECT AGE(CURRENT_DATE, birthdate) AS age
FROM users;
-- '28 years 5 months 12 days'

-- Get just the years
SELECT EXTRACT(YEAR FROM AGE(CURRENT_DATE, birthdate)) AS age_years
FROM users;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Common Date Ranges</h3>
              <CodeBlock code={`-- Today
WHERE booking_date = CURRENT_DATE

-- Yesterday
WHERE booking_date = CURRENT_DATE - 1

-- Last 7 days (including today)
WHERE booking_date >= CURRENT_DATE - INTERVAL '7 days'

-- Last 30 days
WHERE booking_date >= CURRENT_DATE - INTERVAL '30 days'

-- This month (from 1st to today)
WHERE booking_date >= DATE_TRUNC('month', CURRENT_DATE)
  AND booking_date < CURRENT_DATE + 1

-- Last month (entire month)
WHERE booking_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 month'
  AND booking_date < DATE_TRUNC('month', CURRENT_DATE)

-- This year
WHERE booking_date >= DATE_TRUNC('year', CURRENT_DATE)

-- Between specific dates (inclusive)
WHERE booking_date BETWEEN '2024-01-01' AND '2024-12-31'`} />
            </div>

            <div className="alert alert-success mt-2">
              <strong>💡 Pro Tips:</strong><br />
              • Always use DATE_TRUNC for grouping by periods (faster than EXTRACT + GROUP BY)<br />
              • Store dates in UTC and convert at display time<br />
              • Use BETWEEN for date ranges (inclusive on both ends)<br />
              • Test your date logic with edge cases (month boundaries, leap years)<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'types' && (
        <>
          <div className="section">
            <h2 className="section-title">🔄 Type Conversion & Casting</h2>

            <div className="card">
              <h3 className="card-title">CAST - Convert Data Types</h3>
              <CodeBlock code={`-- Convert string to integer
SELECT CAST('123' AS INTEGER) AS num;
-- '123' → 123

-- Convert string to decimal
SELECT CAST('123.45' AS DECIMAL(10,2)) AS price;
-- '123.45' → 123.45

-- Convert integer to string
SELECT CAST(user_id AS VARCHAR) AS user_id_str
FROM users;

-- Convert date to string
SELECT CAST(booking_date AS VARCHAR) AS date_str
FROM bookings;

-- PostgreSQL shorthand: :: operator
SELECT '123'::INTEGER AS num;
SELECT user_id::VARCHAR AS user_id_str;
SELECT booking_date::TEXT AS date_str;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">String to Date/Timestamp</h3>
              <CodeBlock code={`-- PostgreSQL: CAST or ::
SELECT '2024-01-30'::DATE AS booking_date;
SELECT CAST('2024-01-30' AS DATE) AS booking_date;

-- Parse timestamp
SELECT '2024-01-30 14:35:22'::TIMESTAMP AS booking_time;

-- MySQL: STR_TO_DATE
SELECT STR_TO_DATE('30/01/2024', '%d/%m/%Y') AS booking_date;

-- PostgreSQL: TO_DATE with format
SELECT TO_DATE('30-01-2024', 'DD-MM-YYYY') AS booking_date;

-- TO_TIMESTAMP for timestamps
SELECT TO_TIMESTAMP('2024-01-30 14:35:22', 'YYYY-MM-DD HH24:MI:SS');`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Number Formatting</h3>
              <CodeBlock code={`-- Format number as string with decimals
SELECT TO_CHAR(1234.5, '9,999.99') AS formatted_price;
-- '1,234.50'

-- Format as currency
SELECT TO_CHAR(amount, 'L9,999.99') AS price
FROM bookings;
-- '$1,234.50'

-- Format percentage
SELECT TO_CHAR(0.1523, '99.99%') AS percentage;
-- '15.23%'

-- Round to 2 decimals
SELECT ROUND(amount, 2) AS rounded_amount
FROM bookings;

-- Truncate decimals (no rounding)
SELECT TRUNC(amount, 2) AS truncated_amount
FROM bookings;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">NULL Handling in Conversions</h3>
              <CodeBlock code={`-- NULLIF: Convert value to NULL if it matches condition
SELECT NULLIF(discount, 0) AS discount
FROM bookings;
-- Converts 0 to NULL (useful for divide by zero)

-- Avoid divide by zero
SELECT amount / NULLIF(quantity, 0) AS price_per_unit
FROM orders;

-- COALESCE: Convert NULL to default value
SELECT COALESCE(phone, 'No phone') AS phone
FROM users;

-- Chain multiple COALESCE
SELECT COALESCE(mobile, phone, email, 'No contact') AS contact
FROM users;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Type Checking</h3>
              <CodeBlock code={`-- Check if string can be converted to number (PostgreSQL)
-- This will error if not a number:
SELECT CAST(value AS INTEGER) FROM data;

-- Safe version with TRY_CAST (SQL Server/Azure)
SELECT TRY_CAST(value AS INTEGER) AS num
FROM data;
-- Returns NULL if conversion fails

-- PostgreSQL: Use regex to validate first
SELECT value FROM data
WHERE value ~ '^[0-9]+$';  -- Only digits

-- Check if valid date
SELECT value FROM data
WHERE value::DATE IS NOT NULL;`} />
            </div>

            <div className="alert alert-warning mt-2">
              <strong>⚠️ Common Type Conversion Mistakes:</strong><br />
              • Integer division: <code>5 / 2 = 2</code> (not 2.5!). Use <code>5.0 / 2</code> or <code>5::DECIMAL / 2</code><br />
              • String concatenation: <code>'User' + 123</code> fails! Use <code>CONCAT('User', 123)</code> or <code>'User' || 123::TEXT</code><br />
              • Date comparison: <code>'2024-01-30' > '2024-02-01'</code> works as strings by luck, but use <code>::DATE</code> to be safe<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'conditional' && (
        <>
          <div className="section">
            <h2 className="section-title">🎛️ CASE WHEN - Conditional Logic</h2>
            <p className="section-content">
              <strong>Think of CASE WHEN as if-else statements in SQL!</strong>
            </p>

            <div className="card">
              <h3 className="card-title">Basic CASE WHEN</h3>
              <CodeBlock code={`-- Categorize hotels by price
SELECT
    hotel_name,
    price_per_night,
    CASE
        WHEN price_per_night < 1000 THEN 'Budget'
        WHEN price_per_night < 3000 THEN 'Mid-Range'
        WHEN price_per_night < 10000 THEN 'Luxury'
        ELSE 'Ultra-Luxury'
    END AS price_category
FROM hotels;

-- Mark VIP users (spent > $10k or premium account)
SELECT
    user_id,
    name,
    CASE
        WHEN total_spent > 10000 THEN 'VIP'
        WHEN account_type = 'premium' THEN 'Premium'
        ELSE 'Regular'
    END AS user_tier
FROM users;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE in Aggregations (Pivot-style)</h3>
              <CodeBlock code={`-- Count bookings by status (create columns from rows)
SELECT
    hotel_id,
    COUNT(*) AS total_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completed,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) AS cancelled,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending
FROM bookings
GROUP BY hotel_id;

-- Calculate revenue by platform
SELECT
    hotel_id,
    SUM(CASE WHEN platform = 'mobile' THEN amount ELSE 0 END) AS mobile_revenue,
    SUM(CASE WHEN platform = 'web' THEN amount ELSE 0 END) AS web_revenue,
    SUM(CASE WHEN platform = 'app' THEN amount ELSE 0 END) AS app_revenue
FROM bookings
GROUP BY hotel_id;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE for Bucketing</h3>
              <CodeBlock code={`-- Age groups
SELECT
    name,
    age,
    CASE
        WHEN age < 18 THEN 'Under 18'
        WHEN age BETWEEN 18 AND 24 THEN '18-24'
        WHEN age BETWEEN 25 AND 34 THEN '25-34'
        WHEN age BETWEEN 35 AND 44 THEN '35-44'
        WHEN age BETWEEN 45 AND 54 THEN '45-54'
        WHEN age >= 55 THEN '55+'
    END AS age_group
FROM users;

-- Booking lead time buckets
SELECT
    booking_id,
    check_in_date - booking_date AS days_advance,
    CASE
        WHEN check_in_date - booking_date = 0 THEN 'Same Day'
        WHEN check_in_date - booking_date <= 7 THEN '1 Week'
        WHEN check_in_date - booking_date <= 30 THEN '1 Month'
        WHEN check_in_date - booking_date <= 90 THEN '1-3 Months'
        ELSE '3+ Months'
    END AS booking_window
FROM bookings;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE for Conditional Calculations</h3>
              <CodeBlock code={`-- Apply discount based on tier
SELECT
    user_id,
    amount,
    CASE
        WHEN user_tier = 'VIP' THEN amount * 0.8     -- 20% off
        WHEN user_tier = 'Premium' THEN amount * 0.9  -- 10% off
        ELSE amount                                    -- No discount
    END AS final_amount
FROM bookings;

-- Calculate commission rate by hotel star rating
SELECT
    hotel_id,
    star_rating,
    revenue,
    CASE
        WHEN star_rating >= 4 THEN revenue * 0.15  -- 15% for 4-5 star
        WHEN star_rating = 3 THEN revenue * 0.18   -- 18% for 3 star
        ELSE revenue * 0.20                        -- 20% for 1-2 star
    END AS commission
FROM hotel_revenue;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">CASE with NULL Handling</h3>
              <CodeBlock code={`-- Classify review sentiment (handle NULL)
SELECT
    booking_id,
    rating,
    CASE
        WHEN rating IS NULL THEN 'No Review'
        WHEN rating >= 4 THEN 'Positive'
        WHEN rating >= 3 THEN 'Neutral'
        ELSE 'Negative'
    END AS sentiment
FROM bookings;

-- Safe division with CASE
SELECT
    user_id,
    searches,
    bookings,
    CASE
        WHEN searches = 0 THEN 0
        ELSE bookings::DECIMAL / searches
    END AS conversion_rate
FROM user_metrics;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Simple CASE (when checking equality)</h3>
              <CodeBlock code={`-- Shorter syntax when just checking equality
SELECT
    booking_id,
    status,
    CASE status
        WHEN 'completed' THEN 'Done'
        WHEN 'pending' THEN 'In Progress'
        WHEN 'cancelled' THEN 'Cancelled'
        ELSE 'Unknown'
    END AS status_label
FROM bookings;

-- Same as:
SELECT
    booking_id,
    CASE
        WHEN status = 'completed' THEN 'Done'
        WHEN status = 'pending' THEN 'In Progress'
        WHEN status = 'cancelled' THEN 'Cancelled'
        ELSE 'Unknown'
    END AS status_label
FROM bookings;`} />
            </div>

            <div className="alert alert-success mt-2">
              <strong>💡 Common Use Cases:</strong><br />
              • **Categorization**: Group numeric values into buckets (age groups, price tiers)<br />
              • **Pivoting**: Turn rows into columns for reporting<br />
              • **Conditional Math**: Apply different calculations based on conditions<br />
              • **Data Cleaning**: Replace NULL or invalid values with defaults<br />
              • **Labeling**: Convert codes to human-readable labels<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'pagination' && (
        <>
          <div className="section">
            <h2 className="section-title">📄 Pagination & Sampling</h2>

            <div className="card">
              <h3 className="card-title">LIMIT - Restrict Number of Rows</h3>
              <CodeBlock code={`-- Get top 10 hotels by rating
SELECT * FROM hotels
ORDER BY rating DESC
LIMIT 10;

-- Get first 100 bookings
SELECT * FROM bookings
LIMIT 100;

-- ⚠️ Always use ORDER BY with LIMIT!
-- Otherwise results are unpredictable/random
SELECT * FROM hotels
ORDER BY hotel_id  -- Make it deterministic!
LIMIT 10;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">OFFSET - Skip Rows (Pagination)</h3>
              <CodeBlock code={`-- Page 1: First 20 rows
SELECT * FROM hotels
ORDER BY hotel_id
LIMIT 20 OFFSET 0;

-- Page 2: Skip first 20, get next 20
SELECT * FROM hotels
ORDER BY hotel_id
LIMIT 20 OFFSET 20;

-- Page 3: Skip first 40, get next 20
SELECT * FROM hotels
ORDER BY hotel_id
LIMIT 20 OFFSET 40;

-- Generic formula: Page N (1-indexed), Page Size = 20
-- OFFSET = (page - 1) * page_size
-- For page 5: OFFSET = (5-1) * 20 = 80
SELECT * FROM hotels
ORDER BY hotel_id
LIMIT 20 OFFSET 80;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">FETCH - SQL Standard Alternative</h3>
              <CodeBlock code={`-- Standard SQL syntax (works in PostgreSQL, SQL Server)
SELECT * FROM hotels
ORDER BY hotel_id
FETCH FIRST 10 ROWS ONLY;

-- With OFFSET
SELECT * FROM hotels
ORDER BY hotel_id
OFFSET 20 ROWS
FETCH NEXT 20 ROWS ONLY;

-- Same as LIMIT 20 OFFSET 20, but SQL standard`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Efficient Pagination (Keyset/Cursor)</h3>
              <p>
                <strong>Problem:</strong> OFFSET is slow on large datasets (skips rows one by one)<br />
                <strong>Solution:</strong> Use WHERE with last seen value (cursor pagination)
              </p>
              <CodeBlock code={`-- ❌ SLOW: Traditional OFFSET pagination on page 1000
SELECT * FROM bookings
ORDER BY booking_id
LIMIT 20 OFFSET 20000;
-- Database must scan and skip 20,000 rows!

-- ✅ FAST: Cursor pagination
-- Page 1
SELECT * FROM bookings
ORDER BY booking_id
LIMIT 20;
-- Get last booking_id from results: e.g., 20

-- Page 2 (where last_seen_id = 20)
SELECT * FROM bookings
WHERE booking_id > 20
ORDER BY booking_id
LIMIT 20;
-- Get last booking_id: e.g., 40

-- Page 3 (where last_seen_id = 40)
SELECT * FROM bookings
WHERE booking_id > 40
ORDER BY booking_id
LIMIT 20;

-- Can jump directly to any cursor without scanning!`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">TABLESAMPLE - Random Sampling</h3>
              <CodeBlock code={`-- PostgreSQL: Get random 10% of rows (fast, approximate)
SELECT * FROM bookings
TABLESAMPLE BERNOULLI(10);

-- System sampling (even faster, block-level)
SELECT * FROM bookings
TABLESAMPLE SYSTEM(10);

-- Fixed number of rows (approximately)
SELECT * FROM bookings
TABLESAMPLE BERNOULLI(10)
LIMIT 1000;

-- Use case: Quick data analysis on large table
SELECT AVG(amount) FROM bookings
TABLESAMPLE SYSTEM(5);  -- 5% sample instead of full scan`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Random Row Selection</h3>
              <CodeBlock code={`-- Get 10 random rows (SLOW on large tables!)
SELECT * FROM hotels
ORDER BY RANDOM()
LIMIT 10;

-- Better for large tables: Use TABLESAMPLE
SELECT * FROM hotels
TABLESAMPLE BERNOULLI(1)  -- 1% sample
LIMIT 10;

-- Deterministic random (same seed = same results)
SELECT setseed(0.5);  -- Set seed
SELECT * FROM hotels
ORDER BY RANDOM()
LIMIT 10;`} />
            </div>

            <div className="alert alert-warning mt-2">
              <strong>⚠️ Pagination Performance Tips:</strong><br />
              • **OFFSET is slow**: On page 1000, it skips 20,000 rows! Use cursor pagination for deep pages<br />
              • **Always ORDER BY**: Without it, results are unpredictable<br />
              • **Index your ORDER BY column**: Makes pagination much faster<br />
              • **Show page count carefully**: <code>COUNT(*)</code> on huge table = slow. Cache it or estimate it<br />
              • **Use TABLESAMPLE for analytics**: 5-10% sample often good enough for exploratory analysis<br />
            </div>
          </div>
        </>
      )}

      {activeTab === 'aggregation' && (
        <>
          <div className="section">
            <h2 className="section-title">📋 List Aggregation</h2>
            <p className="section-content">
              <strong>Use Case:</strong> Combine multiple rows into a single comma-separated string or array
            </p>

            <div className="card">
              <h3 className="card-title">STRING_AGG - Concatenate Strings (PostgreSQL)</h3>
              <CodeBlock code={`-- Combine hotel names by city into comma-separated list
SELECT
    city,
    STRING_AGG(hotel_name, ', ') AS hotels
FROM hotels
GROUP BY city;

-- Result:
-- Bangkok | Grand Palace Hotel, Riverside Inn, City Center Lodge
-- Phuket  | Beach Resort, Sunset Villa

-- With ORDER BY inside aggregation
SELECT
    city,
    STRING_AGG(hotel_name, ', ' ORDER BY rating DESC) AS top_hotels
FROM hotels
GROUP BY city;

-- Distinct values only
SELECT
    user_id,
    STRING_AGG(DISTINCT platform, ', ') AS platforms_used
FROM bookings
GROUP BY user_id;
-- Result: user_id | platforms_used
--         123     | mobile, web, app`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">GROUP_CONCAT (MySQL)</h3>
              <CodeBlock code={`-- MySQL version of STRING_AGG
SELECT
    city,
    GROUP_CONCAT(hotel_name SEPARATOR ', ') AS hotels
FROM hotels
GROUP BY city;

-- With ORDER BY
SELECT
    city,
    GROUP_CONCAT(hotel_name ORDER BY rating DESC SEPARATOR ', ') AS hotels
FROM hotels
GROUP BY city;

-- Distinct values
SELECT
    user_id,
    GROUP_CONCAT(DISTINCT platform SEPARATOR ', ') AS platforms_used
FROM bookings
GROUP BY user_id;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">ARRAY_AGG - Create Array (PostgreSQL)</h3>
              <CodeBlock code={`-- Create array of hotel IDs per city
SELECT
    city,
    ARRAY_AGG(hotel_id) AS hotel_ids
FROM hotels
GROUP BY city;

-- Result (PostgreSQL array type):
-- Bangkok | {101, 102, 103, 104}
-- Phuket  | {201, 202, 203}

-- With ORDER BY
SELECT
    user_id,
    ARRAY_AGG(booking_id ORDER BY booking_date DESC) AS recent_bookings
FROM bookings
GROUP BY user_id;

-- Filter NULL values
SELECT
    user_id,
    ARRAY_AGG(phone) FILTER (WHERE phone IS NOT NULL) AS phone_numbers
FROM user_contacts
GROUP BY user_id;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">JSON Aggregation (PostgreSQL)</h3>
              <CodeBlock code={`-- Aggregate rows as JSON array
SELECT
    city,
    JSON_AGG(
        JSON_BUILD_OBJECT(
            'hotel_id', hotel_id,
            'name', hotel_name,
            'rating', rating
        )
    ) AS hotels
FROM hotels
GROUP BY city;

-- Result:
-- Bangkok | [
--   {"hotel_id": 101, "name": "Grand Palace", "rating": 4.5},
--   {"hotel_id": 102, "name": "Riverside Inn", "rating": 4.2}
-- ]

-- With ordering
SELECT
    city,
    JSON_AGG(
        JSON_BUILD_OBJECT('name', hotel_name, 'rating', rating)
        ORDER BY rating DESC
    ) AS top_hotels
FROM hotels
GROUP BY city;`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Real-World Examples</h3>
              <CodeBlock code={`-- Example 1: User's booking history summary
SELECT
    u.user_id,
    u.name,
    COUNT(b.booking_id) AS total_bookings,
    STRING_AGG(h.hotel_name, ' → ' ORDER BY b.booking_date) AS booking_timeline
FROM users u
LEFT JOIN bookings b ON u.user_id = b.user_id
LEFT JOIN hotels h ON b.hotel_id = h.hotel_id
GROUP BY u.user_id, u.name;

-- Result:
-- user_id | name | total_bookings | booking_timeline
-- 123 | John | 3 | Grand Palace → Beach Resort → City Center

-- Example 2: Cities visited per user
SELECT
    user_id,
    COUNT(DISTINCT h.city) AS cities_visited,
    STRING_AGG(DISTINCT h.city, ', ' ORDER BY h.city) AS cities_list
FROM bookings b
JOIN hotels h ON b.hotel_id = h.hotel_id
GROUP BY user_id;

-- Example 3: Email list for marketing
SELECT
    country,
    STRING_AGG(email, '; ') AS email_list
FROM users
WHERE account_type = 'premium'
  AND marketing_opt_in = true
GROUP BY country;

-- Example 4: Tags for each hotel
SELECT
    hotel_id,
    hotel_name,
    ARRAY_AGG(DISTINCT tag) AS tags
FROM hotel_tags
GROUP BY hotel_id, hotel_name;
-- Result: {beach, pool, wifi, breakfast}`} />
            </div>

            <div className="card mt-2">
              <h3 className="card-title">Limiting Aggregated Lists</h3>
              <CodeBlock code={`-- Show only top 3 hotels per city (in aggregated string)
SELECT
    city,
    STRING_AGG(hotel_name, ', ') AS top_3_hotels
FROM (
    SELECT
        city,
        hotel_name,
        ROW_NUMBER() OVER (PARTITION BY city ORDER BY rating DESC) AS rn
    FROM hotels
) ranked
WHERE rn <= 3
GROUP BY city;

-- Alternative: Use LIMIT in subquery
SELECT
    city,
    (
        SELECT STRING_AGG(hotel_name, ', ')
        FROM (
            SELECT hotel_name
            FROM hotels h2
            WHERE h2.city = h1.city
            ORDER BY rating DESC
            LIMIT 3
        ) top_hotels
    ) AS top_3_hotels
FROM hotels h1
GROUP BY city;`} />
            </div>

            <div className="alert alert-success mt-2">
              <strong>💡 When to Use List Aggregation:</strong><br />
              • **Reporting**: Show all values in one cell (Excel export-friendly)<br />
              • **User Summaries**: "User visited: Bangkok, Phuket, Chiang Mai"<br />
              • **Tag Lists**: "Tags: beach, pool, wifi, breakfast"<br />
              • **Audit Trails**: "Changes: 2024-01-15 (price), 2024-01-20 (name)"<br />
              • **Email Lists**: Create semicolon-separated email lists for BCC<br />
            </div>
          </div>
        </>
      )}

      <div className="alert alert-success mt-3">
        <strong>🎯 Keep This Bookmarked!</strong><br />
        <br />
        These are the SQL functions you'll use EVERY DAY as a BI developer. When you forget syntax,
        come back to this page for quick examples.
        <br /><br />
        <strong>Most Used Daily:</strong><br />
        • LIKE, IN, BETWEEN (filtering)<br />
        • CONCAT, SUBSTRING, TRIM (string cleanup)<br />
        • DATE_TRUNC, EXTRACT (date analysis)<br />
        • CASE WHEN (categorization & pivots)<br />
        • LIMIT/OFFSET (pagination)<br />
        • STRING_AGG (reporting)
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
