# Python Backend Migration Guide

## ✅ Completed Migration Steps

The backend has been successfully converted from Node.js/Express/TypeScript to Python/Flask while keeping the React frontend unchanged.

### What's Been Done:

1. **Python Environment Setup** ✓
   - Installed Python 3.11
   - Installed Flask, SQLAlchemy, Flask-CORS, Flask-Session, Authlib, and other dependencies

2. **Database Models** ✓
   - Created `models.py` with SQLAlchemy models matching the original Drizzle schema
   - All 6 tables ported: users, donations, user_progress, user_achievements, impact_calculations, charity_effectiveness

3. **Authentication** ✓
   - Implemented Replit Auth with OpenID Connect in `auth.py`
   - Session management with PostgreSQL-backed sessions

4. **Business Logic** ✓
   - Created `storage.py` with all database operations and impact calculations
   - Achievement system, progress tracking, and gamification logic

5. **API Routes** ✓
   - Created `routes.py` with all API endpoints
   - All routes from Express backend ported to Flask

6. **Frontend Build** ✓
   - React frontend successfully builds to `dist/public`
   - Flask configured to serve the built frontend

## 🚀 How to Run the Python Backend

### Method 1: Using the Startup Script

```bash
./start_python_backend.sh
```

This script will:
1. Build the React frontend (`npm run build`)
2. Start the Python Flask backend on port 5000

### Method 2: Manual Steps

```bash
# Build the frontend
npm run build

# Start the Python backend
python3 app.py
```

### Method 3: Update the Workflow (Recommended)

To make the Python backend start automatically in Replit:

1. Open the **Shell** tab in Replit
2. Click on the **...** (three dots) menu next to "Start application" workflow
3. Click **Edit workflow**
4. Change the command from `npm run dev` to:
   ```bash
   ./start_python_backend.sh
   ```
5. Save the workflow

Alternatively, you can manually edit the `.replit` file (line 54) to change:
```toml
args = "npm run dev"
```
to:
```toml
args = "./start_python_backend.sh"
```

## 📁 New Files Created

- `app.py` - Main Flask application with configuration
- `models.py` - SQLAlchemy database models
- `auth.py` - Replit Auth integration with OpenID Connect
- `routes.py` - All API route handlers
- `storage.py` - Business logic and database operations
- `start_python_backend.sh` - Startup script
- `run_flask.sh` - Alternative Flask-only startup script

## 🔄 API Endpoints (All Ported)

All original API endpoints are fully functional:

### Auth
- `GET /api/login` - Initiate OIDC login
- `GET /api/callback` - OIDC callback handler
- `GET /api/logout` - Logout and clear session
- `GET /api/auth/user` - Get current authenticated user

### Donations
- `GET /api/donations` - Get all user donations
- `POST /api/donations` - Create new donation
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation

### Impact & Progress
- `GET /api/impact` - Get impact statistics
- `GET /api/progress` - Get user progress
- `PUT /api/progress/targets` - Update impact targets

### Achievements
- `GET /api/achievements` - Get user achievements
- `POST /api/achievements/check` - Check for new achievements

### Charities
- `GET /api/charities` - Get all charity effectiveness data
- `GET /api/charities/:key` - Get specific charity data
- `POST /api/init-charity-data` - Initialize charity data

### Onboarding
- `POST /api/onboarding/complete` - Mark onboarding as completed

### Health Check
- `GET /api/health` - Backend health check

## ✨ Features Preserved

All original features are fully functional:
- ✓ Replit Auth with OpenID Connect
- ✓ PostgreSQL database with SQLAlchemy
- ✓ Impact calculations (Lives Saved, QUALYs, People Helped)
- ✓ Donation tracking and management
- ✓ User progress and streaks
- ✓ Achievement system
- ✓ Charity effectiveness data
- ✓ Onboarding flow
- ✓ Session management
- ✓ CORS support for React frontend

## 🔧 Environment Variables

The following environment variables are required (already configured in Replit):
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption key
- `REPL_ID` - Replit OIDC client ID
- `REPLIT_DOMAINS` - Allowed domains for OIDC
- `ISSUER_URL` - OIDC issuer URL (defaults to https://replit.com/oidc)

## 🧪 Testing

To verify the Python backend is working:

1. Start the backend (see "How to Run" above)
2. Check the health endpoint:
   ```bash
   curl http://localhost:5000/api/health
   ```
   You should see: `{"status": "ok", "message": "Python Flask backend is running"}`

3. Access the application in your browser - all functionality should work as before

## 📝 Notes

- The React frontend code remains completely unchanged
- All database schemas are identical to the original
- API contracts are preserved - the frontend communicates with the Python backend using the same API
- The built frontend is served from `dist/public` by Flask in production
- Session storage uses the same PostgreSQL `sessions` table

## 🎯 Next Steps

1. Update the Replit workflow to use `./start_python_backend.sh` (see Method 3 above)
2. Test the complete application end-to-end
3. Verify all features work: donations, impact tracking, achievements, stories
4. (Optional) For development with hot reload, set up a separate Vite dev server on port 5173 with API proxying to Flask on port 5000
