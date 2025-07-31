import { useState, type ReactNode } from "react";
import { AuthContext } from "./authContext";
import API from "../service/axiosInterceptor";

const LOCAL_KEY = "auth";

interface User {
  fname: string;
  lname: string;
  email: string;
}

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
    console.log(user);
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
