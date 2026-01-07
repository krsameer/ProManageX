# ProManageX - Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Install Dependencies

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Setup Environment Files

**Backend - Create `.env` file:**
```bash
cd backend
cp .env.example .env
```

The default configuration works with local MongoDB. If you need to change it, edit the `.env` file.

**Frontend - Create `.env` file:**
```bash
cd frontend
cp .env.example .env
```

### Step 3: Start MongoDB

Make sure MongoDB is running on your system:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Windows:**
- Start MongoDB from Services or use `mongod` command

**Alternative: Use MongoDB Atlas (Cloud)**
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

### Step 4: Seed Database

```bash
cd backend
npm run seed
```

This creates sample projects, issues, and test accounts.

### Step 5: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

### Step 6: Login

Open http://localhost:3000 in your browser and login with:

**Admin:**
- Email: `admin@promanagex.com`
- Password: `admin123`

**Member:**
- Email: `john@promanagex.com`
- Password: `john123`

## What You Can Do

1. **View Projects** - See all your projects on the dashboard
2. **Open a Project** - Click on a project to view its Kanban board
3. **Drag & Drop Issues** - Move issues between columns (To-Do, In-Progress, Review, Done)
4. **Create Issues** - Click the + button in any column to add new issues
5. **View Analytics** - Check the Analytics tab to see project statistics
6. **Manage Team** - Add/remove team members in the Settings tab
7. **Add Comments** - Click on any issue card to view details and add comments

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod --version`
- Check the connection string in `backend/.env`
- Try: `mongodb://127.0.0.1:27017/promanagex` instead of `localhost`

### Port Already in Use
**Backend (5000):**
```bash
# Find process using port 5000
lsof -ti:5000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9
```

### Cannot Login
- Make sure you ran the seed script: `npm run seed`
- Check backend logs for errors
- Verify MongoDB is running and accessible

### CORS Errors
- Backend must be running on port 5000
- Frontend must be running on port 3000
- Check `backend/server.js` has CORS enabled

## Project Structure Overview

```
ProManageX/
├── backend/          # Node.js + Express API
│   ├── models/       # Database schemas
│   ├── controllers/  # Business logic
│   ├── routes/       # API endpoints
│   └── server.js     # Main server file
└── frontend/         # React + Vite app
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── context/     # Auth context
    │   └── utils/       # API helpers
    └── public/
```

## Next Steps

- Create your own projects
- Invite team members
- Track issues on the Kanban board
- Monitor progress with analytics
- Customize the application to your needs

## Need Help?

- Check the main README.md for detailed documentation
- Review API endpoints in README.md
- Inspect browser console for frontend errors
- Check terminal logs for backend errors

Enjoy using ProManageX! 🚀
