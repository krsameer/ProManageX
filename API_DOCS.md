## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "member"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "avatar": ""
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as Register

### Get Current User
```http
GET /api/auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "member",
    "avatar": ""
  }
}
```

### Get All Users
```http
GET /api/auth/users
```

**Headers:** `Authorization: Bearer <token>`

---

## Project Endpoints

### Get All Projects
```http
GET /api/projects
```

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "ProManageX Development",
      "description": "Main development project",
      "owner": {
        "_id": "507f191e810c19729de860ea",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "members": [...],
      "status": "active",
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Project
```http
GET /api/projects/:id
```

### Create Project
```http
POST /api/projects
```

**Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "members": ["userId1", "userId2"]
}
```

### Update Project
```http
PUT /api/projects/:id
```

**Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active"
}
```

### Delete Project
```http
DELETE /api/projects/:id
```

### Add Member
```http
POST /api/projects/:id/members
```

**Body:**
```json
{
  "userId": "507f191e810c19729de860ea",
  "role": "member"
}
```

### Remove Member
```http
DELETE /api/projects/:id/members/:userId
```

---

## Issue Endpoints

### Get Project Issues
```http
GET /api/issues/project/:projectId
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "issues": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Implement user authentication",
      "description": "Set up JWT-based auth",
      "project": "507f191e810c19729de860ea",
      "status": "In-Progress",
      "priority": "High",
      "assignee": {...},
      "reporter": {...},
      "tags": ["backend", "authentication"],
      "position": 0,
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

### Get Single Issue
```http
GET /api/issues/:id
```

### Create Issue
```http
POST /api/issues
```

**Body:**
```json
{
  "title": "Fix login bug",
  "description": "Users cannot login",
  "project": "507f191e810c19729de860ea",
  "priority": "High",
  "status": "To-Do",
  "assignee": "507f1f77bcf86cd799439011",
  "tags": ["bug", "urgent"]
}
```

### Update Issue
```http
PUT /api/issues/:id
```

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "In-Progress",
  "priority": "Critical",
  "assignee": "507f1f77bcf86cd799439011",
  "tags": ["bug", "critical"]
}
```

### Update Issue Status (Drag & Drop)
```http
PATCH /api/issues/:id/status
```

**Body:**
```json
{
  "status": "In-Progress",
  "position": 2
}
```

### Delete Issue
```http
DELETE /api/issues/:id
```

### Get Issue Activities
```http
GET /api/issues/:id/activities
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "activities": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "issue": "507f191e810c19729de860ea",
      "user": {...},
      "action": "status_changed",
      "field": "status",
      "oldValue": "To-Do",
      "newValue": "In-Progress",
      "description": "Status changed from To-Do to In-Progress",
      "createdAt": "2025-12-01T00:00:00.000Z"
    }
  ]
}
```

---

## Comment Endpoints

### Get Issue Comments
```http
GET /api/comments/issue/:issueId
```

### Create Comment
```http
POST /api/comments
```

**Body:**
```json
{
  "issue": "507f191e810c19729de860ea",
  "content": "This is a comment"
}
```

### Update Comment
```http
PUT /api/comments/:id
```

**Body:**
```json
{
  "content": "Updated comment content"
}
```

### Delete Comment
```http
DELETE /api/comments/:id
```

---

## Analytics Endpoints

### Get Project Analytics
```http
GET /api/analytics/:projectId
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalIssues": 20,
    "issuesByStatus": {
      "To-Do": 5,
      "In-Progress": 8,
      "Review": 4,
      "Done": 3
    },
    "issuesByPriority": {
      "Low": 2,
      "Medium": 10,
      "High": 6,
      "Critical": 2
    },
    "memberWiseDistribution": [
      {
        "user": {...},
        "count": 8,
        "byStatus": {
          "To-Do": 2,
          "In-Progress": 3,
          "Review": 2,
          "Done": 1
        }
      }
    ],
    "unassignedCount": 2,
    "completionRate": 15.0
  }
}
```

### Get User Analytics
```http
GET /api/analytics/user/me
```

---

## Error Responses

**400 Bad Request:**
```json
{
  "message": "Validation error message"
}
```

**401 Unauthorized:**
```json
{
  "message": "Not authorized to access this route"
}
```

**403 Forbidden:**
```json
{
  "message": "Access denied"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Server Error:**
```json
{
  "message": "Server error",
  "error": "Error details"
}
```
