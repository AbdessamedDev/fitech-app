import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { saveToken } from "../utils/authHelpers";

export function useAuth() {
  const { login, logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const data = await loginUser(email, password);
    
    // Save token
    saveToken(data.Data.Token);
    login(data.Data);

    // Redirect to dashboard (update later when roles are added)
    navigate("/admin/dashboard");

    return data;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return { handleLogin, handleLogout, user };
}