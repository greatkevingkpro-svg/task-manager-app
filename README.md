# Task Manager (Spring Boot + MongoDB + Expo React Native)

A simple full-stack Task Manager project for learning a new stack:

- Backend: Java, Spring Boot, Maven, Spring Data MongoDB
- Frontend: React Native with Expo
- API client: Axios

## Project Structure

```text
task-manager/
  backend/
    pom.xml
    src/main/java/com/example/taskmanager/
      TaskManagerApplication.java
      config/CorsConfig.java
      controller/TaskController.java
      entity/Task.java
      repository/TaskRepository.java
    src/main/resources/application.properties
  mobile/
    App.js
    app.json
    babel.config.js
    package.json
```

## Features

- Create tasks
- View all tasks
- Complete tasks (status changes to `DONE`)
- Delete tasks

## Backend Setup

### Prerequisites

- Java 17+
- Maven
- Local MongoDB running on default port `27017`

### Run

```bash
cd backend
mvn spring-boot:run
```

The backend runs at:

- `http://localhost:8080`
- `http://10.50.25.43:8080` (current frontend API target in `mobile/App.js`)

MongoDB connection is configured in `backend/src/main/resources/application.properties`.

## Frontend Setup (Expo)

### Prerequisites

- Node.js 18+
- npm

### Run

```bash
cd mobile
npm install
npx expo start
```

Then choose one target:

- Press `w` for web
- Press `a` for Android emulator
- Scan QR code with Expo Go for physical device

### Frontend API URL

The frontend currently calls:

- `http://10.50.25.43:8080/api/tasks`

This value is defined in `mobile/App.js` as `API_URL`.  
If your machine IP changes, update `API_URL` to the new IP and keep port `8080`.

## API Endpoints

- `GET /api/tasks` - fetch all tasks
- `POST /api/tasks` - create a task
- `PATCH /api/tasks/{id}/complete` - mark as DONE
- `DELETE /api/tasks/{id}` - delete a task
- `POST /api/tasks/{id}/delete` - delete fallback for clients where DELETE may be blocked

## CORS Notes

If you call backend from Expo web (`http://localhost:8081`), browser preflight requests are required for `PATCH/DELETE`.
Global CORS is configured in `backend/src/main/java/com/example/taskmanager/config/CorsConfig.java`.

After backend code changes, restart Spring Boot so new CORS settings/endpoints are active.

## Common Troubleshooting

1. **Network Error from Axios**
   - Ensure backend is running on port `8080`.
   - Ensure `API_URL` in `mobile/App.js` points to reachable host.

2. **CORS blocked**
   - Confirm backend restarted after CORS changes.
   - Confirm requests are hitting this backend instance (correct host/IP).

3. **Task actions not updating**
   - Open browser dev tools/network tab for failed request details.
   - Check backend logs for endpoint hits and HTTP status codes.

