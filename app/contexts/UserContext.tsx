'use client';

import { createContext, useContext, ReactNode } from 'react';

export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  user_type?: string;
}

const UserContext = createContext<SessionUser | null>(null);

export function UserProvider({ children, user }: { children: ReactNode; user: SessionUser | null }) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}