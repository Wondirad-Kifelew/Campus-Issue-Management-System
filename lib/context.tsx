'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, Issue, Notification, AuthContextType, IssueContextType } from './types';
import { toast } from 'sonner'; // [INTEGRATED] Toast notifications for API operations
import { usePathname } from 'next/navigation';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
  const login = useCallback(async (userId: string, password: string, role: 'student' | 'staff' | 'admin' = 'student') => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password, role }),
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
  const register = useCallback(async (name: string, userId: string, password: string, role: 'student' | 'staff' | 'admin' = 'student') => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, userId, password, role }),
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

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingIssues, setIsLoadingIssues] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const pathname = usePathname(); 

  // [INTEGRATED] Fetch issues from API on mount
  useEffect(() => {
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
  }, [pathname]);

  // [INTEGRATED] Fetch notifications from API on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoadingNotifications(true);
      try {
        const response = await fetch('/api/notifications', { credentials: 'include' });
        console.log('API response for notifications:(in context)', response);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications || []);
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
      console.log('Agreeing with issue:(inContext)', issueId, 'by student:', studentId);
      const response = await fetch(`/api/issues/${issueId}/agree`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
        credentials: 'include',
      });
      console.log('API response for agree:(in context)', response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to agree with issue');
      }

      const data = await response.json();
      console.log('Data from agree API:(in context)', data);
      // console.log('Normalized issue after agree:(in context)', normalizeIssue(data.issue));
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
        method: 'PUT',
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

  // [INTEGRATED] Call /api/issues/:id to update status
  const updateStatus = useCallback(async (issueId: string, status: string) => {
    try {
      const response = await fetch(`/api/issues/${issueId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });
console.log('API response for status update:(in context)', response);
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add response');
      }

      const data = await res.json();
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
        addIssue,
        updateIssue,
        deleteIssue,
        agreeWithIssue,
        markNotificationAsRead,
        updateStatus,
        addResponse,
      }}
    >
      {/* Show loading spinner while fetching initial data */}
      {isLoadingIssues && isLoadingNotifications ? (
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
