# Task-Management-Dashboard-Stealth-Assignment

A full-stack task management application built with Next.js, MongoDB, and NextAuth.js. This application allows users to manage tasks with drag-and-drop functionality, filtering, and search capabilities.

## Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Drag and drop tasks between status columns
- Filter tasks by status
- Search tasks by title or description
- Dark/light theme toggle
- Responsive design

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: NextAuth

## Setup Instructions

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
NEXTAUTH_SECRET=your_nextauth_secret
MONGODB_URI=mongodb://localhost:27017/Task-Management-Dashboard-Stealth-Assignment
MONGODB_DB=Task-Management-Dashboard-Stealth-Assignment
```

### Installation

1. Clone the repository:

```
git clone https://github.com/RutikKulkarni/Task-Management-Dashboard-Stealth-Assignment
cd Task-Management-Dashboard-Stealth-Assignment
```

2. Install dependencies:

```
npm install
```

3. Run the development server:

```
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Users Collection

```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  createdAt: Date
}
```

### Tasks Collection

```
{
  _id: ObjectId,
  title: String,
  description: String,
  status: String (enum: "todo", "in-progress", "completed"),
  priority: String (enum: "low", "medium", "high"),
  userId: String,
  createdAt: Date,
  updatedAt: Date
}
```
