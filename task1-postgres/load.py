import json
import os
from pathlib import Path
from time import perf_counter

import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv


# ==========================================
# Configuration
# ==========================================

load_dotenv()


DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}


DATA_DIR = Path("data_pack")
SCHEMA_FILE = Path("schema.sql")


# ==========================================
# Database
# ==========================================

def connect_db():
    """Create PostgreSQL connection."""
    
    return psycopg2.connect(**DB_CONFIG)


def execute_schema(connection):
    """Execute schema.sql."""

    with open(SCHEMA_FILE, "r", encoding="utf-8") as file:
        sql = file.read()

    with connection.cursor() as cursor:
        cursor.execute(sql)

    connection.commit()


# ==========================================
# Reading JSON
# ==========================================

def read_all_companies():
    """
    Read all page_*.json files
    and return companies list.
    """

    companies = []

    files = sorted(DATA_DIR.glob("page_*.json"))

    if not files:
        raise FileNotFoundError(
            "No JSON files found in data_pack directory"
        )

    for file_path in files:

        print(f"Reading {file_path.name}")

        with open(file_path, "r", encoding="utf-8") as file:
            page = json.load(file)

        companies.extend(
            page.get("items", [])
        )

    return companies


# ==========================================
# Insert
# ==========================================

def insert_companies(connection, companies):
    """
    Insert companies into PostgreSQL.
    Duplicate companies are updated.
    """

    sql = """
    INSERT INTO companies (
        id,
        name,
        category,
        city,
        address,
        rating,
        reviews_count,
        site,
        phone
    )
    VALUES %s

    ON CONFLICT (id)
    DO UPDATE SET

        id = EXCLUDED.id,
        category = EXCLUDED.category,
        rating = EXCLUDED.rating,
        reviews_count = EXCLUDED.reviews_count,
        site = EXCLUDED.site,
        phone = EXCLUDED.phone;
    """


    values = []

    for company in companies:

        values.append(
            (
                company.get("id"),
                company.get("name"),
                company.get("category"),
                company.get("city"),
                company.get("address"),
                company.get("rating"),
                company.get("reviews_count", 0),
                company.get("site"),
                company.get("phone"),
            )
        )


    with connection.cursor() as cursor:
        execute_values(
            cursor,
            sql,
            values
        )

    connection.commit()


# ==========================================
# Main
# ==========================================

def main():

    start = perf_counter()


    print("=" * 45)
    print("Company Loader")
    print("=" * 45)


    print("\nConnecting to PostgreSQL...")

    connection = connect_db()

    print("Connected")


    print("\nApplying schema...")

    execute_schema(connection)

    print("Schema ready")


    print("\nLoading JSON files...")

    companies = read_all_companies()

    print(f"\nFound {len(companies)} companies")


    print("\nWriting to database...")

    insert_companies(
        connection,
        companies
    )


    connection.close()


    elapsed = perf_counter() - start


    print("\nDone!")
    print(f"Processed: {len(companies)} companies")
    print(f"Time: {elapsed:.2f} sec")


if __name__ == "__main__":
    main()