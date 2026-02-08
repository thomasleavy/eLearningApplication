# Primary Pals e-Learning Platform

This repository contains source code for the **Primary Pals e-Learning Platform** - the final project for my Higher Diploma in Science in Computing (Software Development). 
The platform is a full-stack e-learning application for primary school pupils and teachers. 
It has features like user registration, role-based login, quiz taking and creating, avatar selection with unlockable features, statistics tracking, data gathering for teachers, and teacher management of associated pupils.

## URL
- https://thomasleavy.github.io/eLearningApplication/

## Technologies used

**Frontend**
  
- React.js - for fynamic interfaces.
- Axios - for making HTTP requests.
- React Router - for client-side routing.
- CSS/HTML - for styling/layout.
  
**Backend**
  
- Java 17 with Spring boot 3.4.3 - for developing RESTful APIs.
- Spring Data JPA - for persistence/database operations.
- Spring Security with BCrypt - for password encryption.
  
**Database**
  
- PostgreSQL - for storage of data
- pgAdmin 4 - for querying/managing the PostgreSQL database.

**Build Tools/Version Control**

- Maven - for project build/management of dependencies.
- Git and GitHub - for verison control and repository hosting.

## Setup / Running the Project

**Backend prerequisites**

- Java 17
- Maven
- PostgreSQL (running with database `elearning_db` and connection details in `demo/src/main/resources/application.properties`)

- **Database configuration:** The app connects to PostgreSQL with user `postgres` and database `elearning_db`. If you see **"password authentication failed for user postgres"**:
  - **Option A:** Set your PostgreSQL password via environment variable (no file edit):  
    `$env:SPRING_DATASOURCE_PASSWORD="your_password"` (PowerShell) or `set SPRING_DATASOURCE_PASSWORD=your_password` (CMD), then run the backend again.
  - **Option B:** Edit `demo/src/main/resources/application.properties` and set `spring.datasource.password` to your PostgreSQL password.
  - Ensure the database `elearning_db` exists (create it in pgAdmin or: `createdb -U postgres elearning_db`).

- **Forgot your PostgreSQL password?** (e.g. old college project) You can reset it on Windows:
  1. Open **pg_hba.conf** (e.g. `C:\Program Files\PostgreSQL\16\data\pg_hba.conf` — the number is your PostgreSQL version).
  2. Find the two lines near the bottom that look like:
     ```
     host    all    all    127.0.0.1/32    scram-sha-256
     host    all    all    ::1/128         scram-sha-256
     ```
     Change `scram-sha-256` to **trust** on both lines. Save the file (you may need to run Notepad as Administrator).
  3. Open **Services** (Win + R → `services.msc`). Find **postgresql-x64-16** (or your version), right‑click → **Restart**.
  4. Open a new terminal and run: `psql -U postgres` (no password). Then run:
     ```sql
     ALTER USER postgres PASSWORD 'YourNewPassword123';
     ```
     (Pick a password you’ll remember.)
  5. Change **pg_hba.conf** back: set those two lines to `scram-sha-256` again and save.
  6. Restart the PostgreSQL service again. Use `YourNewPassword123` (or whatever you set) in the app via Option A or B above.

- **To run the backend** (must be running for registration/login and all API calls to work):
  1. Open a terminal and go into the **demo** folder: `cd demo`
  2. Run: `mvn clean install`
  3. Run: `mvn spring-boot:run` (or set `SPRING_DATASOURCE_PASSWORD` first if needed)
  4. Leave this terminal open. The API will be available at **http://localhost:8080** (e.g. `/api/register`, `/api/login`).

**Frontend prerequisites**

- Node.js
- npm

- **To run the frontend** (with the backend already running):
  1. From the project root: `npm install` then `npm start`, **or**
  2. From the **elearning-frontend** directory: `npm install` then `npm start`
  3. The app will open at **http://localhost:3000**. API requests (e.g. `/api/register`) are proxied to the backend on port 8080.

**If you see 404 on `/api/register` or other API calls:** the backend is not running or not reachable. Start the Spring Boot app from the `demo` folder (steps above) and ensure PostgreSQL is running.

## Testing

The project includes frontend/backend tests. Run backend tests in the root terminal with:
***mvn test***
To run frontend tests, use the test command configured in the package.json file.









