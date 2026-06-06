'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User, Issue, Notification, AuthContextType, IssueContextType } from './types';
import { mockIssues, mockNotifications, mockStaff } from './mock-data';

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  const login = useCallback(async (userId: string, password: string, role: 'student' | 'staff' | 'admin' = 'student') => {
    // Mock authentication
    if (userId && password.length >= 6) {
      let newUser: User;
      
      // If staff, try to find matching staff in mock data
      if (role === 'staff') {
        const staffMember = mockStaff.find(s => s.userId === userId);
        if (staffMember) {
          newUser = staffMember;
        } else {
          // Create new staff user without category if not found
          newUser = {
            id: `user_${Date.now()}`,
            name: 'Staff Member',
            userId: userId,
            role: role,
            registeredDate: new Date().toISOString().split('T')[0],
          };
          
        }
      } else if (role === 'admin') {
        // Admin user
        newUser = {
          id: `user_${Date.now()}`,
          name: 'Ayalu Sisay',
          userId: userId,
          role: role,
          registeredDate: new Date().toISOString().split('T')[0],
        };
      } else {
        // Student user
        newUser = {
          id: `user_${Date.now()}`,
          name: 'Meoza Sisay', // Default mock user
          userId: userId,
          role: role,
          registeredDate: new Date().toISOString().split('T')[0],
        };
      }
      
      setUser(newUser);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const register = useCallback(async (name: string, userId: string, password: string, role: 'student' | 'staff' | 'admin' = 'student') => {
    // Mock registration
    if (name && userId && password.length >= 6) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        name: name,
        userId: userId,
        role: role,
        registeredDate: new Date().toISOString().split('T')[0],
      };
      setUser(newUser);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid registration data');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
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
  // console.log("issues in context", issues);
// console.log("newly added issue", issues[issues.length - 1], "agreed by for the newly added issue", issues[issues.length - 1]?.agreedBy  );

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
