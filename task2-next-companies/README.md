# Companies App

## Описание

Мини-приложение на Next.js с отображением списка компаний из PostgreSQL.

Страница `/companies` получает данные серверно и предоставляет:

* таблицу компаний;
* поиск по названию;
* фильтрацию по городу;
* пагинацию по 50 записей на странице.

Данные используются из базы PostgreSQL, созданной в рамках задачи `task1-postgres`.

---

## Стек

* Next.js 16 (App Router)
* React
* TypeScript
* PostgreSQL
* node-postgres (`pg`)
* Tailwind CSS

---

## Структура проекта

```
.
├── app/
│   ├── companies/
│   │   ├── page.tsx
│   │   ├── CompaniesFilter.tsx
│   │   └── Pagination.tsx
│   ├── layout.tsx
│   └── globals.css
│
├── lib/
│   ├── db.ts
│   └── companies.ts
│
├── types/
│   └── company.ts
│
├── public/
│
├── .env.example
├── package.json
└── README.md
```

---

## Требования

Перед запуском необходимо:

* Node.js 20+
* PostgreSQL
* Заполненная база данных из задачи `task1-postgres`

---

## Установка

Установить зависимости:

```bash
npm install
```

---

## Настройка окружения

Создать файл:

```
.env
```

на основе:

```
.env.example
```

Пример:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=companies
DB_USER=postgres
DB_PASSWORD=postgres
```

Файл `.env` не добавляется в репозиторий.

---

## Запуск в режиме разработки

```bash
npm run dev
```

После запуска приложение доступно:

```
http://localhost:3000/companies
```

---

## Production build

Проверка production-сборки:

```bash
npm run build
```

Запуск собранного приложения:

```bash
npm run start
```

---

## Проверка работы

Проверка выполнялась следующим образом:

1. Запустил PostgreSQL с базой `companies`.
2. Запустил Next.js приложение и открыл страницу `/companies`.
3. Проверил загрузку данных из базы, поиск по названию и фильтрацию по городам.
4. Проверил переходы между страницами пагинации.
5. В процессе разработки исправил подключение PostgreSQL через `pg` и проверил успешную production-сборку через `npm run build`.

---

## Особенности реализации

* Данные загружаются серверно через Server Component.
* Секретные данные подключения к PostgreSQL хранятся только в `.env`.
* В репозиторий добавлен только `.env.example`.
* Запросы к базе вынесены отдельно в слой `lib`.

---
