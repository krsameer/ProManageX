# ProManageX - Issue Tracking System

A full-stack MERN (MongoDB, Express, React, Node.js) issue tracking and project management system with an interactive Kanban board, real-time updates, and comprehensive analytics.

This web app is live and can be visited on - https://promanagex.vercel.app/login

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Admin/Member)
- Secure password hashing with bcrypt

### Project Management
- Create, edit, and delete projects
- Add/remove team members
- Project status tracking (Active/Archived/Completed)
- Project overview dashboard

### Issue Management
- Create issues with title, description, priority, status, assignee, and tags
- Update issue details and status
- Delete issues
- Issue priority levels: Low, Medium, High, Critical
- Issue status: To-Do, In-Progress, Review, Done
- Activity logging for all issue changes

### Kanban Board
- Interactive drag-and-drop Kanban board using react-beautiful-dnd
- Four columns: To-Do, In-Progress, Review, Done
- Real-time status updates on drag-and-drop
- Visual priority indicators

### Comments & Activity
- Comment threads on issues
- Activity timeline tracking all changes
- User mentions and timestamps

### Analytics Dashboard
- Total issues count
- Issues by status (pie chart)
- Issues by priority (pie chart)
- Member-wise task distribution (bar chart)
- Completion rate tracking
- Team performance metrics

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router v6** - Routing
- **Tailwind CSS** - Styling
- **react-beautiful-dnd** - Drag and drop
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **date-fns** - Date formatting
- **React Icons** - Icon library

## Project Structure

```
ProManageX/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   ├── issueController.js
│   │   ├── commentController.js
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── error.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Issue.js
│   │   ├── Comment.js
│   │   └── Activity.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── projects.js
│   │   ├── issues.js
│   │   ├── comments.js
│   │   └── analytics.js
│   ├── .env.example
│   ├── package.json
│   ├── seed.js
│   └── server.js
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── Analytics.jsx
    │   │   ├── IssueCard.jsx
    │   │   ├── IssueDetailModal.jsx
    │   │   ├── IssueModal.jsx
    │   │   ├── KanbanBoard.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── PrivateRoute.jsx
    │   │   └── ProjectSettings.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Projects.jsx
    │   │   └── ProjectDetail.jsx
    │   ├── utils/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promanagex
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Make sure MongoDB is running on your system

6. Seed the database with sample data:
```bash
npm run seed
```

7. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update the `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Demo Accounts

After running the seed script, you can login with these accounts:

**Admin Account:**
- Email: `admin@promanagex.com`
- Password: `admin123`

**Member Accounts:**
- Email: `kumarsameer@promanagex.com` / Password: `kumarsameer123`
- Email: `kunaltiwari@promanagex.com` / Password: `kunaltiwari123`
- Email: `shapunpoonja@promanagex.com` / Password: `shapunpoonja123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/users` - Get all users (protected)

### Projects
- `GET /api/projects` - Get all user projects (protected)
- `GET /api/projects/:id` - Get single project (protected)
- `POST /api/projects` - Create new project (protected)
- `PUT /api/projects/:id` - Update project (protected, admin)
- `DELETE /api/projects/:id` - Delete project (protected, owner)
- `POST /api/projects/:id/members` - Add member (protected, admin)
- `DELETE /api/projects/:id/members/:userId` - Remove member (protected, admin)

### Issues
- `GET /api/issues/project/:projectId` - Get project issues (protected)
- `GET /api/issues/:id` - Get single issue (protected)
- `POST /api/issues` - Create issue (protected)
- `PUT /api/issues/:id` - Update issue (protected)
- `PATCH /api/issues/:id/status` - Update issue status (protected)
- `DELETE /api/issues/:id` - Delete issue (protected)
- `GET /api/issues/:id/activities` - Get issue activities (protected)

### Comments
- `GET /api/comments/issue/:issueId` - Get issue comments (protected)
- `POST /api/comments` - Create comment (protected)
- `PUT /api/comments/:id` - Update comment (protected, owner)
- `DELETE /api/comments/:id` - Delete comment (protected, owner)

### Analytics
- `GET /api/analytics/:projectId` - Get project analytics (protected)
- `GET /api/analytics/user/me` - Get user analytics (protected)

## API Request Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "member"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@promanagex.com",
    "password": "admin123"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Project",
    "description": "Project description",
    "members": []
  }'
```

### Create Issue
```bash
curl -X POST http://localhost:5000/api/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cannot login with correct credentials",
    "project": "PROJECT_ID",
    "priority": "High",
    "status": "To-Do",
    "assignee": "USER_ID",
    "tags": ["bug", "urgent"]
  }'
```

### Update Issue Status (Drag & Drop)
```bash
curl -X PATCH http://localhost:5000/api/issues/ISSUE_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "In-Progress",
    "position": 0
  }'
```

## Features in Detail

### Drag and Drop Kanban Board
- Uses `react-beautiful-dnd` for smooth drag-and-drop experience
- Instantly updates issue status when moved between columns
- Maintains issue position within columns
- Visual feedback during drag operations

### Real-time Activity Tracking
- Tracks all issue changes (status, priority, assignee)
- Displays activity timeline with timestamps
- Shows who made changes and when

### Analytics & Reporting
- Interactive charts using Recharts library
- Visual representation of project progress
- Team performance metrics
- Identifies bottlenecks and workload distribution

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

## Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/promanagex
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For support, email support@promanagex.com or open an issue in the repository.

## Acknowledgments

- React Beautiful DnD for drag-and-drop functionality
- Recharts for data visualization
- Tailwind CSS for styling
- MongoDB for database
- Express.js for backend framework
