# DPS Backend Coding Challenge

## Overview

This repository contains a very basic web application based on Typescript and Express.js. Main application file is `index.ts`. Node and npm are required.

## Project Context

You will develop a backend system for managing data about a company's projects and their associated reports. Each project may have multiple reports linked to it, though having reports is not mandatory. Start your implementation using the provided SQLite database([db/db.sqlite3](./db/db.sqlite3)).

Refer to the database schema provided for understanding the data structure 👇

![Database schema](images/database_schema.png)

# Solution

## Environment Setup

Ensure you have Node.js (v14.x or later) and npm (v6.x or later) installed.  
To set up and run the application, execute the following commands:

```
npm install
npm run dev
```

The application will then be accessible at http://localhost:3000.

# DPS Backend API

A RESTful API built with TypeScript and Express.js for managing projects and their associated reports.

## Authentication

All endpoints require authentication token:
```
Authorization: Bearer Password123
```

## API Endpoints

### Projects

#### GET /projects
- Retrieves all projects
- Status: 200 (Success), 500 (Error)

#### GET /projects/:id
- Retrieves specific project
- Status: 200 (Success), 404 (Not Found), 500 (Error)

#### POST /projects
- Creates new project
- Body: `{ "name": "string", "description": "string" }`
- Status: 201 (Created), 500 (Error)

#### PUT /projects
- Updates existing project
- Body: `{ "id": "string", "name": "string", "description": "string" }`
- Status: 200 (Success), 404 (Not Found), 500 (Error)

#### DELETE /projects/:id
- Deletes project and associated reports
- Status: 200 (Success), 404 (Not Found), 500 (Error)

### Reports

#### GET /reports
- Retrieves all reports
- Query param: `?query=word` (finds reports with word ≥3 times)
- Status: 200 (Success), 404 (Not Found for queries), 500 (Error)

#### GET /reports/:id
- Retrieves specific report
- Status: 200 (Success), 404 (Not Found), 500 (Error)

#### POST /reports
- Creates new report
- Body: `{ "text": "string", "projectid": "string" }`
- Status: 201 (Created), 400 (Invalid Project ID), 500 (Error)

#### PUT /reports
- Updates existing report
- Body: `{ "id": "string", "text": "string", "projectid": "string" }`
- Status: 200 (Success), 404 (Not Found), 500 (Error)

#### DELETE /reports/:id
- Deletes specific report
- Status: 200 (Success), 404 (Not Found), 500 (Error)

### Project Reports

#### GET /projectReports/projects/:projectId/reports
- Retrieves all reports for specific project
- Status: 200 (Success), 404 (Not Found), 500 (Error)

#### GET /projectReports/projects/:projectId/reports/:reportId
- Retrieves specific report from specific project
- Status: 200 (Success), 404 (Not Found), 500 (Error)

## Error Handling

All endpoints include handling for:
- Invalid requests
- Not found resources
- Server errors
- Authentication failures
