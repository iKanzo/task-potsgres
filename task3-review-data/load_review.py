import csv
from pathlib import Path
from urllib.parse import urlparse


FILE_PATH = Path(__file__).parent / "review.csv"


def load_csv():
    with open(FILE_PATH, "r", encoding="utf-8") as file:
        return list(csv.DictReader(file))


def check_duplicates(rows):
    ids = [row["id"] for row in rows if row["id"]]

    return {
        item
        for item in ids
        if ids.count(item) > 1
    }


def check_empty_rows(rows):
    return [
        index + 2
        for index, row in enumerate(rows)
        if not any(row.values())
    ]


def check_rating(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        rating = row["rating"]

        if not rating:
            continue

        try:
            value = float(rating.replace(",", "."))

            if value < 0 or value > 5:
                problems.append((index, rating))

        except ValueError:
            problems.append((index, rating))

    return problems


def check_reviews_count(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        value = row["reviews_count"]

        if not value:
            continue

        try:
            number = float(value)

            if number < 0 or number % 1 != 0:
                problems.append((index, value))

        except ValueError:
            problems.append((index, value))

    return problems


def check_encoding(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        for value in row.values():
            if value and "РћР" in value:
                problems.append(index)
                break

    return problems


def check_empty_contacts(rows):
    site_missing = []
    phone_missing = []

    for index, row in enumerate(rows, start=2):
        if not row["site"]:
            site_missing.append(index)

        if not row["phone"]:
            phone_missing.append(index)

    return site_missing, phone_missing


def check_urls(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        site = row["site"]

        if not site:
            continue

        if site == "нет сайта":
            problems.append((index, site))
            continue

        try:
            parsed = urlparse(site)

            if parsed.scheme not in ["http", "https"]:
                problems.append((index, site))

        except Exception:
            problems.append((index, site))

    return problems


def check_phones(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        phone = row["phone"]

        if not phone:
            continue

        digits = "".join(
            char for char in phone
            if char.isdigit()
        )

        if len(digits) != 11 or not phone.startswith("+7"):
            problems.append((index, phone))

    return problems


def check_cities(rows):
    problems = []

    for index, row in enumerate(rows, start=2):
        city = row["city"]

        if city.lower() != city and city in ["Moscow", "москва"]:
            problems.append((index, city))

        if "Санкат" in city:
            problems.append((index, city))

    return problems


def main():
    rows = load_csv()

    print("Всего строк:", len(rows))

    print("\nДубликаты id:")
    print(check_duplicates(rows))

    print("\nПустые строки:")
    print(check_empty_rows(rows))

    print("\nНекорректный rating:")
    print(check_rating(rows))

    print("\nНекорректный reviews_count:")
    print(check_reviews_count(rows))

    print("\nПроблемы кодировки:")
    print(check_encoding(rows))

    missing_site, missing_phone = check_empty_contacts(rows)

    print("\nНет сайта:")
    print(missing_site)

    print("\nНет телефона:")
    print(missing_phone)

    print("\nПроблемы URL:")
    print(check_urls(rows))

    print("\nПроблемы телефонов:")
    print(check_phones(rows))

    print("\nПроблемы городов:")
    print(check_cities(rows))


if __name__ == "__main__":
    main()