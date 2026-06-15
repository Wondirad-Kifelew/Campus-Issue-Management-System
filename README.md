# Campus Issue Management System

A platform for managing and tracking issues on campus. Students can report problems, staff can respond and track resolutions, and administrators have full oversight and management capabilities.

## Live Demo

[View Live Application](your-deployment-link-here)

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
Create a `.env.local` file with required variables (database URL, JWT secret, etc.)

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

- **Students**: Log in to report issues and track responses
- **Staff**: Access the staff dashboard to respond to and manage issues
- **Admins**: Use the admin dashboard for system management and oversight

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
