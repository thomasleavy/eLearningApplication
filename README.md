# The Primary Pals e-Learning Platform

This repository contains source code for the **Primary Pals e-Learing Platform** - the final project for my Higher Diploma in Science in Computing (Software Development). 
The platform is a full-stack e-learning application for primary school pupils and teachers. 
It has features like user registration, role-based login, quiz taking and creating, avatar selection with unlockable features, statistics tracking, data gathering for teachers, and teacher management of associated pupils.

## Technologies used

**Frontend**
React.js - for fynamic interfaces.
Axios - for making HTTP requests.
React Router - for client-side routing.
CSS/HTML - for styling/layout.
**Backend**
Java 17 with Spring boot 3.4.3 - for developing RESTful APIs.
Spring Data JPA - for persistence/database operations.
Spring Security with BCrypt - for password encryption.
**Database**
PostgreSQL - for storage of data
pgAdmin 4 - for querying/managing the PostgreSQL database.
**Build Tools/Version Control
Maven - for project build/management of dependencies.
Git and GitHub - for verison control and repository hosting.

## Setup / Running the Project

**Backend prerequisites**
Java 17
Maven
PostgreSQL (configured w/ connection details in application.properties
**To run the backend...**
Open a terminal in the project root directory. Execute:
***Maven clean install***
followed by:
***mvn spring-boot:run***

**Frontend prerequisites**
Node.js and npm
**To run the frontend...**
Open a terminal in the elearning-frontend directory and bash:
***npm install**
followed by:
***npm start***

## Testing

The project includes frontend/backend tests. Run backend tests in the root terminal with:
***mvn test***
To run frontend tests, use the test command configured in the package.json file.









