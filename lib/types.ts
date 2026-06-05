export type UserRole = 'student' | 'staff' | 'admin';

export type IssueCategory = 'Infrastructure' | 'Cleanliness' | 'Technology' | 'Safety' | 'Cafeteria' | 'Others';

export type IssueStatus = 'Pending' | 'In Progress' | 'Resolved';

export type NotificationType = 'status_update' | 'staff_reply' | 'issue_resolved';

export interface User {
  id: string;
  name: string;
  userId: string;
  role: UserRole;
  registeredDate: string;
  staffCategory?: IssueCategory; // Category assigned to staff members
}

export interface StaffResponse {
  id: string;
  staffId: string;
  staffName: string;
  response: string;
  timestamp: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  studentId: string;
  studentName: string;
  submittedDate: string;
  agreementCount: number;
  agreedBy: string[]; // Array of student IDs who agreed
  responses?: StaffResponse[]; // Staff responses to the issue
}

export interface Notification {
  id: string;
  type: NotificationType;
  issueId: string;
  issueTitle: string;
  message: string;
  timestamp: string;
  read: boolean;
  staffName?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userId: string, password: string) => Promise<void>;
  register: (name: string, userId: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface IssueContextType {
  issues: Issue[];
  notifications: Notification[];
  addIssue: (issue: Omit<Issue, 'id' | 'agreementCount' | 'agreedBy'>) => void;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;
  agreeWithIssue: (issueId: string, studentId: string) => void;
  markNotificationAsRead: (notificationId: string) => void;
  updateStatus: (issueId: string, status: IssueStatus) => void;
  addResponse: (issueId: string, staffId: string, staffName: string, response: string) => void;
}
