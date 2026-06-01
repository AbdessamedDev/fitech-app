import { createContext, useContext, useState } from "react";
import {
  getStoredUser,
  removeToken,
  saveRefreshToken,
  saveRole,
  saveToken,
  saveUser,
} from "../utils/authHelpers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const login = (userData) => {
    setUser(userData);
    if (userData.token) saveToken(userData.token);
    if (userData.refreshToken) saveRefreshToken(userData.refreshToken);
    if (userData.role) saveRole(userData.role);
    saveUser(userData);
  };

  const logout = () => {
    setUser(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
