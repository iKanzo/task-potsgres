-- ==========================================
-- 1. Top 5 categories by number of companies
-- ==========================================

SELECT
    category,
    COUNT(*) AS companies_count

FROM companies

GROUP BY category

ORDER BY companies_count DESC

LIMIT 5;



-- ==========================================
-- 2. Average rating by city
--    Companies with 10+ reviews
-- ==========================================

SELECT
    city,
    ROUND(AVG(rating), 2) AS average_rating

FROM companies

WHERE
    reviews_count >= 10
    AND rating IS NOT NULL

GROUP BY city

ORDER BY average_rating DESC;



-- ==========================================
-- 3. Percentage of companies with website
--    by category
-- ==========================================

SELECT
    category,

    ROUND(
        COUNT(*) FILTER (
            WHERE site IS NOT NULL
        )::numeric
        /
        COUNT(*) * 100,
        2
    ) AS website_percent

FROM companies

GROUP BY category

ORDER BY website_percent DESC;