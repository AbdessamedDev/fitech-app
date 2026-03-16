import { createContext, useContext, useState } from "react";
import { saveToken, removeToken, saveRole } from "../utils/authHelpers";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    if (userData.token) saveToken(userData.token);
    if (userData.role) saveRole(userData.role);
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