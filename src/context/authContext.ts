import { createContext } from "react";

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);
