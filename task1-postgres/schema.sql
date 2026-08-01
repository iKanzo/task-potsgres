-- ==========================================
-- Companies database schema
-- ==========================================

CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,

    name TEXT NOT NULL,

    category TEXT NOT NULL,

    city TEXT NOT NULL,

    address TEXT NOT NULL,

    rating NUMERIC(2,1),

    reviews_count INTEGER NOT NULL DEFAULT 0,

    site TEXT,

    phone TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_rating
        CHECK (
            rating IS NULL
            OR rating BETWEEN 0 AND 5
        ),

    CONSTRAINT chk_reviews
        CHECK (
            reviews_count >= 0
        )
);

-- ==========================================
-- Indexes
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_companies_category
ON companies(category);

CREATE INDEX IF NOT EXISTS idx_companies_city
ON companies(city);

CREATE INDEX IF NOT EXISTS idx_companies_reviews
ON companies(reviews_count);