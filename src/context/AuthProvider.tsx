import { useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import API from "../service/axiosInterceptor";

const LOCAL_KEY = "auth";

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  profileImage: string | null;
}

/**
 * AuthProvider is a context provider component that manages user authentication state.
 * It provides `currentUser`, `accessToken`, `login`, and `logout` functions to children components via context.
 *
 * @param {ReactNode} children - React child components that will consume the context.
 * @returns {JSX.Element} AuthContext.Provider
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved).user : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    return saved ? JSON.parse(saved).accessToken : null;
  });

  const login = (user: User, token: string) => {
    setCurrentUser(user);
    setAccessToken(token);
    localStorage.setItem(
      LOCAL_KEY,
      JSON.stringify({ user, accessToken: token }),
    );
  };

  const logout = async () => {
    setCurrentUser(null);
    setAccessToken(null);
    localStorage.clear();
    await API.post("auth/logout");
  };

  return (
    <AuthContext.Provider value={{ currentUser, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
