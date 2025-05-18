import { createContext } from 'react';

export interface User {
  username: string;
  email: string;
  profilePicture?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
