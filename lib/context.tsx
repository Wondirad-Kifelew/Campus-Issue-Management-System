'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, Issue, Notification, Category, AuthContextType, IssueContextType } from './types';
import { toast } from 'sonner'; // [INTEGRATED] Toast notifications for API operations
import { usePathname } from 'next/navigation';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const normalizeUser = (user: any) => {
  if (user.id && !user._id) return user;
  const { _id, ...rest } = user;
  return {
    ...rest,
    id: _id?.toString() ?? user.id,
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // [INTEGRATED] Check if user session exists on mount via JWT cookie
  // The API sets httpOnly cookies that persist across page refreshes
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('[v0] Auth check failed:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // [INTEGRATED] Call /api/auth/login instead of mock authentication
  const login = useCallback(async (userId: string, password: string, role?: 'student' | 'staff' | 'admin') => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, role: role || 'student' }),
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  // [INTEGRATED] Call /api/auth/register instead of mock registration
  const register = useCallback(async (name: string, userId: string, password: string, role?: 'student' | 'staff' | 'admin') => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId, password, role: role || 'student' }),
      credentials: 'include', // Send cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  // [INTEGRATED] Call /api/auth/logout to clear session
  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {/* Show loading state while checking session - prevents flash of login page */}
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// Issue Context
const IssueContext = createContext<IssueContextType | undefined>(undefined);

const normalizeIssue = (issue: any) => {
  // If already normalized (has id, no _id), return as-is
  if (issue.id && !issue._id) return issue;
  
  const { _id, ...rest } = issue;
  return {
    ...rest,
    id: _id?.toString() ?? issue.id,
  };
};

const normailzeNotification = (notification: any) => {
  if (notification.id && !notification._id) return notification;

  const { _id, ...rest } = notification;
  return {
    ...rest,
    id: _id?.toString() ?? notification.id,
  };
};

const normalizeCategory = (category: any): Category => {
  if (category.id && !category._id) return category;

  const { _id, ...rest } = category;
  return {
    ...rest,
    id: _id?.toString() ?? category.id,
  };
};
export function IssueProvider({ children }: { children: ReactNode }) {
   const { isAuthenticated } = useAuth(); 
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const pathname = usePathname(); 

  // [INTEGRATED] Fetch issues from API on mount
  useEffect(() => {
    if (!isAuthenticated) return; 
    const fetchIssues = async () => {
      setIsLoadingIssues(true);
      try {
        const response = await fetch('/api/issues', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
            // normalize _id to id for frontend consistency

            const normalized = data.issues.map(normalizeIssue);
          setIssues(normalized || []);
          
        } else {  
          console.error('[v0] Failed to fetch issues:', response.statusText);
          setIssues([]);
        }
      } catch (error) {
        console.error('[v0] Error fetching issues:', error);
        setIssues([]);
      } finally {
        setIsLoadingIssues(false);
      }
    };

    fetchIssues();
  }, [isAuthenticated, pathname]);

  // [INTEGRATED] Fetch notifications from API on mount
  useEffect(() => {
    if (!isAuthenticated) return; 
    const fetchNotifications = async () => {
      setIsLoadingNotifications(true);
      try {
        
        const response = await fetch('/api/notifications', { credentials: 'include' });
        
        if (response.ok) {
          const data = await response.json();
          
            // normalize _id to id for frontend consistency
          const normalized = data.notifications.map(normailzeNotification);  
          setNotifications(normalized || []);
        } else {
          console.error('[v0] Failed to fetch notifications:', response.statusText);
          setNotifications([]);
        }
      } catch (error) {
        console.error('[v0] Error fetching notifications:', error);
        setNotifications([]);
      } finally {
        setIsLoadingNotifications(false);
      }
    };

    fetchNotifications();
  }, [isAuthenticated]);

  // [INTEGRATED] Fetch categories from API on mount
  useEffect(() => {
    if (!isAuthenticated) return; 
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setCategories((data.categories || []).map(normalizeCategory));
        } else {
          console.error('[v0] Failed to fetch categories:', response.statusText);
          setCategories([]);
        }
      } catch (error) {
        console.error('[v0] Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, [isAuthenticated]);

  // [INTEGRATED] Call /api/categories POST to create a new category
  const addCategory = useCallback(async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add category');
      }

      const data = await response.json();
      setCategories((prev) => [...prev, normalizeCategory(data.category)]);
      toast.success('Category added successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add category';
      toast.error(errorMsg);
      console.error('[v0] Error adding category:', error);
    }
  }, []);

  // [INTEGRATED] Call /api/categories/:id PATCH to update a category
  const updateCategory = useCallback(
    async (id: string, updates: { name?: string; description?: string }) => {
      try {
        const response = await fetch(`/api/categories/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update category');
        }

        const data = await response.json();
        const updated = normalizeCategory(data.category);
        setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
        toast.success('Category updated successfully');
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Failed to update category';
        toast.error(errorMsg);
        console.error('[v0] Error updating category:', error);
      }
    },
    []
  );

  // [INTEGRATED] Call /api/categories/:id DELETE to remove a category
  const deleteCategory = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success('Category deleted successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to delete category';
      toast.error(errorMsg);
      console.error('[v0] Error deleting category:', error);
    }
  }, []);

  // [INTEGRATED] Call /api/issues POST to create new issue
  const addIssue = useCallback(async (issue: Omit<Issue, 'id' | 'agreementCount' | 'agreedBy'>) => {
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: issue.title,
          description: issue.description,
          category: issue.category,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit issue');
      }

      const data = await response.json();
      setIssues((prev) => [normalizeIssue(data.issue), ...prev]);
      toast.success('Issue submitted successfully!');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to submit issue';
      toast.error(errorMsg);
      console.error('[v0] Error adding issue:', error);
    }
  }, []);

  // [INTEGRATED] Call /api/issues/:id PUT to update issue
  const updateIssue = useCallback(async (id: string, updates: Partial<Issue>) => {
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
      });
      
       
      if (!response.ok) {
        const text = await response.text();
        console.log("Error response:", text);

        throw new Error(text || "Failed to update issue");
        // throw new Error(errorData.error || 'Failed to update issue');
      }

      const data = await response.json();
      setIssues((prev) =>
        prev.map((issue) => (issue.id === id ? normalizeIssue(data.issue) : issue))
      );
    } catch (error) {
      console.error('[v0] Error updating issue:', error);
      toast.error('Failed to update issue');
    }
  }, []);

  // [INTEGRATED] Call /api/issues/:id DELETE to delete issue
  const deleteIssue = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete issue');
      }

      setIssues((prev) => prev.filter((issue) => issue.id !== id));
      toast.success('Issue deleted successfully');
    } catch (error) {
      console.error('[v0] Error deleting issue:', error);
      toast.error('Failed to delete issue');
    }
  }, []);

  // [INTEGRATED] Call /api/issues/:id/agree to toggle agreement
  const agreeWithIssue = useCallback(async (issueId: string, studentId: string) => {
    try {
      
      const response = await fetch(`/api/issues/${issueId}/agree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to agree with issue');
      }

      const data = await response.json();
      
      
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? data.issue : issue))
      );
    } catch (error) {
      console.error('[v0] Error agreeing with issue:(in context)', error);
      toast.error('Failed to update agreement');
    }
  }, []);

  // [INTEGRATED] Call /api/notifications/:id to mark as read
  const markNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
        credentials: 'include',
      });

      if (response.ok) {

        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('[v0] Error marking notification as read:', error);
    }
  }, []);
  // call /api/notifications/mark-all-read to mark all non-reply notifications as read
  const markAllNonReplyAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        credentials: 'include',
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.type !== 'staff_reply' ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error('[v0] Error marking all non-reply notifications as read:', error);
    }
  }, []);
  // [INTEGRATED] Call /api/issues/:id to update status
  const updateStatus = useCallback(async (issueId: string, status: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? normalizeIssue(data.issue) : issue))
      );
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('[v0] Error updating status:', error);
      toast.error('Failed to update status');
    }
  }, []);

  // [INTEGRATED] Call /api/issues/:id/respond to add response
  const addResponse = useCallback(async (issueId: string, staffId: string, staffName: string, response: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response }),
        credentials: 'include',
      });
      console.log("response from api??: , res")

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add response');
      }
      
      const data = await res.json();
      console.log("response added on 1st try??: , data")
      setIssues((prev) =>
        prev.map((issue) => (issue.id === issueId ? data.issue: issue))
      );
      toast.success('Response added successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add response';
      console.error('Error adding response:', error);
      toast.error(errorMsg);
    }
  }, []);

  return (
    <IssueContext.Provider
      value={{
        issues,
        notifications,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addIssue,
        updateIssue,
        deleteIssue,
        agreeWithIssue,
        markNotificationAsRead,
        markAllNonReplyAsRead,
        updateStatus,
        addResponse,
      }}
    >
      {/* Show loading spinner while fetching initial data */}
      {isLoadingIssues || isLoadingNotifications ? (
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </IssueContext.Provider>
  );
}

export function useIssue() {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssue must be used within IssueProvider');
  }
  return context;
}

// Admin Context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminStats {
  totalUsers: number;
  totalStaffs: number;
  totalStudents: number;
  totalIssues: number;
}

interface AdminContextType {
  stats: AdminStats | null;
  users: User[];
  isLoadingStats: boolean;
  isLoadingUsers: boolean;
  fetchStats: () => Promise<void>;
  fetchUsers: (role?: string) => Promise<void>;
  addUser: (name: string, userId: string, password: string, role: string, staffCategory?: string) => Promise<void>;
  updateUser: (id: string, updates: any) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await fetch('/api/users', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        const allUsers = data.users || [];
        
        const staffCount = allUsers.filter((u: User) => u.role === 'staff').length;
        const studentCount = allUsers.filter((u: User) => u.role === 'student').length;
        
        // Fetch issues count
        const issuesRes = await fetch('/api/issues', { credentials: 'include' });
        const issuesData = issuesRes.ok ? await issuesRes.json() : { issues: [] };
        
        setStats({
          totalUsers: allUsers.length,
          totalStaffs: staffCount,
          totalStudents: studentCount,
          totalIssues: issuesData.issues?.length || 0,
        });
      }
    } catch (error) {
      console.error('[v0] Error fetching admin stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  const fetchUsers = useCallback(async (role?: string) => {
    setIsLoadingUsers(true);
    try {
      const url = role ? `/api/users?role=${role}` : '/api/users';
      const response = await fetch(url, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        
        setUsers(data.users?.map(normalizeUser) || []);
    
      }
    } catch (error) {
      console.error('[v0] Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  const addUser = useCallback(async (name: string, userId: string, password: string, role: string, staffCategory?: string) => {
    try {
      const body: any = { name, userId, password, role };
      if (role === 'staff' && staffCategory) {
        body.staffCategory = staffCategory;
        //i may add default active if needed
      }
      if (role === 'student') {
        body.status = 'Active'; // Default status for new students
      } 
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add user');
      }

      const data = await response.json();
      
      // setUsers((prev) => [data.user, ...prev]);
      setUsers(data.users?.map(normalizeUser) || [])
      
      window.location.reload();
      toast.success('User added successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to add user';
      toast.error(errorMsg);
      console.error('[v0] Error adding user:', error);
    }
  }, []);

  const updateUser = useCallback(async (id: string, updates: any) => {
    try {
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const data = await response.json();
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? normalizeUser(data.user) : user))
      );
      
      toast.success('User updated successfully');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to update user';
      toast.error(errorMsg);
      console.error('[v0] Error updating user:', error);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('[v0] Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  }, []);

  return (
    <AdminContext.Provider value={{ stats, users, isLoadingStats, isLoadingUsers, fetchStats, fetchUsers, addUser, updateUser, deleteUser }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}
