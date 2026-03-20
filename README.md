# Nest Publishing System

## Project Description

This information system manages data about books, authors, publication dates, materials used for publishing, wholesale buyers, and the number of books sold to buyers.

### Roles and Permissions

- **Administrator (Manager)**
  - Can create, edit, and delete any entity.

- **Publishing Employee**
  - View information about books and offices.
  - Add sales, books, and book categories.
  - Edit books, categories, and materials.

- **Client**
  - Can add sales.

## Technological Stack

- **Programming Language:** TypeScript
- **Web API Framework:** Nest.js
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication & Authorization:** JWT

## Requirements

- Node.js 
- PostgreSQL
- pnpm package manager

## Setup Instructions

1. **Install dependencies:**
	```sh
	pnpm install
	```

2. **Configure environment variables:**
	Create a `.env` file in the project root with the following content:
	```
	DB_HOST=localhost
	DB_PORT=5432
	DB_USERNAME=admin
	DB_PASSWORD=root
	DB_NAME=publishing_db
	JWT_SECRET=your_jwt_secret_key
	GOOGLE_CLIENT_ID=your_google_client_id
	GOOGLE_CLIENT_SECRET=your_google_client_secret
	GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
	```


3. **Database Management:**
		- To purge (truncate) all tables in the database:
			```sh
			./db-down.sh
			```
		- To seed/init the database with sample data:
			```sh
			./db-up.sh
			```

4. **Run the project:**
	```sh
	pnpm run start
	```

5. **API Documentation:**
	Swagger is available at [http://localhost:3000/api](http://localhost:3000/api)

## Running all microservices

You can start every Nest application concurrently in development/watch mode in two ways:

- With npm (uses concurrently):

You can start every Nest application concurrently (Nx-native) in two modes:

- Watch mode (development):

	```sh
	npx nx run run-all:serve
	# or
	npm run start:all
	```

- No-watch (production-style start):

	```sh
	npx nx run run-all:start
	# or
	npm run start:all:no-watch
	```

These targets use Nx's run-many orchestration to start each app's `serve` (watch) or `start` (no-watch) target in parallel. If you add more apps, add `serve`/`start` targets in their `apps/<app>/project.json` and update the `run-all` project's `projects` list in `tools/run-all/project.json` if needed.

## Google Authentication

The application supports login via Google OAuth 2.0. Users who authenticate through Google are automatically created with the **client** role if they don't already exist.

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (or select an existing one).
3. Navigate to **APIs & Services → OAuth consent screen**.
4. Configure the consent screen — choose **External** user type, fill in the app name and email.
5. Under **Scopes**, add `email` and `profile`.
6. Navigate to **APIs & Services → Credentials**.
7. Click **Create Credentials → OAuth 2.0 Client ID**.
8. Set **Application type** to **Web application**.
9. Add `http://localhost:3000/auth/google/callback` under **Authorized redirect URIs**.
10. Copy the generated **Client ID** and **Client Secret** into your `.env` file.

### Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID from Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret from Google Cloud Console |
| `GOOGLE_CALLBACK_URL` | Redirect URI registered in Google Console (e.g. `http://localhost:3000/auth/google/callback`) |

### Auth Flow

```
Client                     Gateway                     Google                  User Microservice
  │                          │                           │                          │
  │  GET /auth/google        │                           │                          │
  ├─────────────────────────►│                           │                          │
  │  302 Redirect            │                           │                          │
  │◄─────────────────────────┤                           │                          │
  │                          │                           │                          │
  │  User authenticates on Google consent screen         │                          │
  ├─────────────────────────────────────────────────────►│                          │
  │                          │                           │                          │
  │  Redirect to callback with ?code=...                 │                          │
  │◄─────────────────────────────────────────────────────┤                          │
  │                          │                           │                          │
  │  GET /auth/google/callback?code=...                  │                          │
  ├─────────────────────────►│                           │                          │
  │                          │  Exchange code for tokens │                          │
  │                          ├──────────────────────────►│                          │
  │                          │  User info (email, name)  │                          │
  │                          │◄──────────────────────────┤                          │
  │                          │                           │                          │
  │                          │  FIND_OR_CREATE_BY_GOOGLE (TCP)                      │
  │                          ├─────────────────────────────────────────────────────►│
  │                          │  UserRO                                              │
  │                          │◄─────────────────────────────────────────────────────┤
  │                          │                           │                          │
  │  { user: { email, name, token, role, office } }      │                          │
  │◄─────────────────────────┤                           │                          │
```

### Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/auth/google` | Redirects the user to Google's OAuth consent screen |
| `GET` | `/auth/google/callback` | Handles the Google callback, returns JWT in the same format as `POST /user/sign-in` |

The returned JWT can be used in the `Authorization: Bearer <token>` header for all protected endpoints.

## NBRB Currency Conversion

The application integrates with the [National Bank of the Republic of Belarus (NBRB) Exchange Rates API](https://www.nbrb.by/engl/apihelp/exrates) to convert book prices from BYN (Belarusian Ruble) to any supported currency using today's official exchange rate.

### How It Works

1. The client sends a request with a book ID and a target currency code (e.g. `USD`, `EUR`, `RUB`).
2. The book microservice fetches the book's base price (stored in BYN).
3. It calls the NBRB API (`https://api.nbrb.by/exrates/rates/{currency}?parammode=2`) to get today's official exchange rate.
4. The converted price is calculated as: `bookValueBYN / (Cur_OfficialRate / Cur_Scale)`.
5. The response includes the original BYN price, the converted price, and the rate details.

### Endpoint

| Method | Path | Guards | Description |
|---|---|---|---|
| `GET` | `/book/:id/price/:currency` | AuthGuard, RolesGuard (ADMIN, SALES, CLIENT) | Returns book price converted to the target currency |

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `id` | integer | Book ID |
| `currency` | string | 3-letter currency abbreviation (e.g. `USD`, `EUR`, `RUB`, `GBP`, `PLN`) |

**Example request:**
```
GET /book/1/price/USD
Authorization: Bearer <token>
```

**Example response:**
```json
{
  "bookId": 1,
  "bookName": "Some Book",
  "originalPrice": {
    "amount": 50.00,
    "currency": "BYN"
  },
  "convertedPrice": {
    "amount": 16.56,
    "currency": "USD"
  },
  "rate": {
    "officialRate": 3.0194,
    "scale": 1,
    "date": "2026-03-20T00:00:00"
  }
}
```

### NBRB API Reference

- **All rates for today:** `GET https://api.nbrb.by/exrates/rates?periodicity=0`
- **Single currency by abbreviation:** `GET https://api.nbrb.by/exrates/rates/USD?parammode=2`
- **Available currencies:** USD, EUR, RUB, GBP, PLN, UAH, CNY, JPY, CHF, CAD, and [more](https://api.nbrb.by/exrates/currencies)

No API key or additional configuration is required — the NBRB API is public.

## Google Sheets Export

Export all books from the database to a new Google Spreadsheet.

### Google Cloud Console Setup (Service Account)

1. Go to **Google Cloud Console** → **IAM & Admin** → **Service Accounts**
2. Create a service account (or reuse one from the same project)
3. Click the service account → **Keys** → **Add Key** → **Create new key** → **JSON**
4. Download the JSON file — you need the `client_email` and `private_key` fields
5. Enable the **Google Sheets API** and **Google Drive API** in your project

### Environment Variables

Add to your `.env`:

```dotenv
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SHARE_EMAIL=your-personal@gmail.com
```

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the `client_email` from the JSON key file
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` — the `private_key` from the JSON key file (keep the `\n` escapes)
- `GOOGLE_SHEETS_SHARE_EMAIL` — the email to share the created spreadsheet with (optional, but needed if you want to open it in your browser)

### API Endpoint

```
POST /book/export/sheets
Authorization: Bearer <token>
Role: ADMIN
```

**Response:**

```json
{
  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/<id>/edit"
}
```

### Flow

```
Client → POST /book/export/sheets
  → Gateway (AuthGuard + RolesGuard ADMIN)
    → TCP → Book Microservice
      → BookService.exportToSheets()
        → findAll() books from DB
        → GoogleSheetsService.exportBooks()
          → Create spreadsheet via Sheets API
          → Write header + book rows
          → Share with configured email via Drive API
          → Return spreadsheetUrl
```

## Google Docs Sales Export

Export book sales for a selected date range to a formatted Google Docs document. Uses the same Service Account credentials as the Sheets export — no additional setup needed (just enable the **Google Docs API** in your Google Cloud project).

### Prerequisites

- Same Service Account env vars as Google Sheets Export (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`, `GOOGLE_SHEETS_SHARE_EMAIL`)
- **Google Docs API** enabled in Google Cloud Console (in addition to Sheets/Drive APIs)

### API Endpoint

```
POST /sale/export/docs?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
Authorization: Bearer <token>
Roles: ADMIN, SALES
```

**Query Parameters:**

| Parameter   | Type   | Description                          |
|-------------|--------|--------------------------------------|
| `startDate` | string | Start of period (ISO date, inclusive) |
| `endDate`   | string | End of period (ISO date, inclusive)   |

**Response:**

```json
{
  "documentUrl": "https://docs.google.com/document/d/<id>/edit"
}
```

### Document Contents

The generated Google Doc includes:

- **Title:** "Sales Report: {startDate} — {endDate}"
- **Summary:** period, total transactions, total items sold, total revenue (BYN)
- **Table** with columns: #, Date, Book, Buyer, Office, Amount, Price (BYN), External

### Flow

```
Client → POST /sale/export/docs?startDate=...&endDate=...
  → Gateway (AuthGuard + RolesGuard ADMIN/SALES)
    → TCP → Sale Microservice
      → SaleService.exportToDocs(startDate, endDate)
        → findByPeriod() — query sales with date Between()
        → GoogleDocsService.exportSalesReport()
          → Create document via Docs API
          → Insert summary text + table with sales data
          → Bold header row
          → Share with configured email via Drive API
          → Return documentUrl
```

