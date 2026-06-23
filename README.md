# Campus Issue Management System

A platform for managing and tracking issues on campus. Students can report problems, staff can respond and track resolutions, and administrators have full oversight and management capabilities.

## Live Demo

[View Live Application](https://campus-issue-management-system-flax.vercel.app/)

## Features

- **Issue Tracking**: Students report issues with categories and descriptions
- **Real-time Responses**: Staff can respond to issues and provide updates
- **Role-based Access**: Student, staff, and admin roles with appropriate permissions
- **Admin Dashboard**: Manage users, staff, categories, and view system analytics
- **Notifications**: Real-time updates on issue status and responses
- **Staff Management**: Add, edit, and manage staff members
- **Student Directory**: Maintain student records and profiles

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT with bcryptjs
- **UI Components**: shadcn/ui, Base UI

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection
- Environment variables configured

### Installation

1. Clone the repository
```bash
git clone https://github.com/Wondirad-Kifelew/Campus-Issue-Management-System.git
cd Campus-Issue-Management-System
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
Create a `.env.local` file in the root directory:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
```

For MongoDB URI, use your connection string from MongoDB Atlas or local MongoDB instance.
For JWT_SECRET, generate a random string: `openssl rand -base64 32`

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing the Live Demo

The system uses role-based access: students, staff, and admins. Here's how to test each role:

### Step 1: Register a Student
1. Navigate to the register page
2. Fill in the form with student details (name, email, password)
3. Complete registration as a student

### Step 2: Make Yourself an Admin
1. Open your MongoDB database
2. Find the user you just registered in the `users` collection
3. Change the `role` field from `"student"` to `"admin"`
4. Save the document

### Step 3: Access the Admin Dashboard
1. Log in with your student account credentials
2. You now have admin access and can use the admin dashboard
3. From the admin dashboard, you can create staff members

### Step 4: Create and Test Other Roles
- **Create Staff**: Use the admin dashboard to create staff members (staff accounts must be created by admin)
- **Test as Staff**: Create a staff account and log in to access the staff dashboard
- **Test as Student**: Register another student account to test the student interface

## Usage

- **Students**: Register and log in to report issues, track responses, and view their submissions
- **Staff**: Log in to respond to issues, provide updates, and manage assigned tasks
- **Admins**: Access the admin dashboard to manage users, create staff, configure categories, and view system analytics

## Project Structure

```
├── app/
│   ├── admin/           # Admin dashboard and management
│   ├── api/             # API routes
│   └── ...              # Other pages
├── components/          # React components
├── lib/                 # Utilities and helpers
└── public/              # Static assets
```

## License

This project is open source and available under the MIT License.
