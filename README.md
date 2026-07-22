# Task Manager App

React + TypeScript + Redux frontend, .NET 8 Web API backend, PostgreSQL database, JWT authentication.

## Project Structure
```
task-manager/
├── backend/TaskManager.API/   # .NET 8 Web API
└── frontend/                 # React + TS + Redux (Vite)
```

## Backend Setup
1. Install .NET 8 SDK and PostgreSQL locally.
2. Create the database: `createdb taskmanager`
3. Edit `backend/TaskManager.API/appsettings.json`:
   - Set your PostgreSQL password in `ConnectionStrings:DefaultConnection`
   - Set `Jwt:Key` to a long random string (32+ chars) — **never commit the real value to GitHub**
4. Install EF Core CLI tools (one-time): `dotnet tool install --global dotnet-ef`
5. From `backend/TaskManager.API`, restore and create the first migration:
   ```
   dotnet restore
   dotnet ef migrations add InitialCreate
   dotnet run
   ```
   Program.cs auto-applies migrations on startup, so the DB schema is created automatically.
6. API runs at `https://localhost:5001` (check console output for exact port). Swagger UI at `/swagger`.

## Frontend Setup
1. From `frontend/`: `npm install`
2. Create `.env` file: `VITE_API_URL=https://localhost:5001/api`
3. `npm run dev` — runs at `http://localhost:5173`

## Key Features Implemented
- **JWT Login**: Register/login endpoints issue a JWT; frontend stores it and attaches it to every API call via Axios interceptor; expired/invalid tokens auto-redirect to login.
- **Dashboard**: Shows logged-in user's name, task list, and a form to add tasks.
- **CRUD Tasks**: Create, read, update, delete — all scoped to the logged-in user (a user can only see/edit their own tasks, enforced server-side via the JWT claim, not just hidden in the UI).

## GitHub Hosting
1. `git init`, commit, then create a repo on GitHub and push:
   ```
   git remote add origin https://github.com/SamruddhiNadgouda/task-manager.git
   git branch -M main
   git push -u origin main
   ```
2. **Add a `.gitignore`** before your first commit — exclude `bin/`, `obj/`, `node_modules/`, and `.env` (never push secrets or the real JWT key/DB password).
3. GitHub itself only hosts the *code*. For a live demo:
   - **Frontend**: deploy free on Vercel or Netlify (connect the GitHub repo, it auto-builds `frontend/`)
   - **Backend**: needs real hosting since it's a server — Azure App Service (free tier) fits your existing stack; point its connection string to an Azure PostgreSQL instance
4. Update `VITE_API_URL` in the deployed frontend's environment variables to point to the deployed backend URL, and update `Frontend:Url` in the backend's config to the deployed frontend URL (for CORS).

## Next Steps to Extend
- Add task filtering/sorting on the dashboard
- Add pagination if task lists grow large
- Add a "forgot password" flow
- Write a few unit tests (xUnit for backend, React Testing Library for frontend) — good to mention in interviews
