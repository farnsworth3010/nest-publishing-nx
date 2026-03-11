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

