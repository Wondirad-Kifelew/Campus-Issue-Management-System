'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, Issue, Notification, AuthContextType, IssueContextType } from './types';
import { mockIssues, mockNotifications, mockStaff } from './mock-data';

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

export function IssueProvider({ children }: { children: ReactNode }) {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const addIssue = useCallback((issue: Omit<Issue, 'id' | 'agreementCount' | 'agreedBy'>) => {
    const newIssue: Issue = {
      ...issue,
      id: `issue_${Date.now()}`,
      agreementCount: 0,
      agreedBy: [],
    };
    setIssues((prev) => [newIssue, ...prev]);
  }, []);
  
  const updateIssue = useCallback((id: string, updates: Partial<Issue>) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, ...updates } : issue))
    );
  }, []);

  const deleteIssue = useCallback((id: string) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  }, []);

  const agreeWithIssue = useCallback((issueId: string, studentId: string) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const isAlreadyAgreed = issue.agreedBy.includes(studentId);
          return {
            ...issue,
            agreementCount: isAlreadyAgreed
              ? Math.max(0, issue.agreementCount - 1)
              : issue.agreementCount + 1,
            agreedBy: isAlreadyAgreed
              ? issue.agreedBy.filter((id) => id !== studentId)
              : [...issue.agreedBy, studentId],
          };
        }
        return issue;
      })
    );
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const updateStatus = useCallback((issueId: string, status: string) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === issueId ? { ...issue, status: status as any } : issue))
    );
  }, []);

  const addResponse = useCallback(
    (issueId: string, staffId: string, staffName: string, response: string) => {
      setIssues((prev) =>
        prev.map((issue) => {
          if (issue.id === issueId) {
            const newResponse = {
              id: `response_${Date.now()}`,
              staffId,
              staffName,
              response,
              timestamp: new Date().toISOString(),
            };
            return {
              ...issue,
              responses: [...(issue.responses || []), newResponse],
            };
          }
          return issue;
        })
      );
    },
    []
  );

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
      {children}
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
