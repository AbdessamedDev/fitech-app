import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import { getDefaultRouteForRole, getRoleFromToken, normalizeRole } from "../utils/authHelpers";

export function useAuth() {
  const { login, logout, user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    const response = await loginUser(email, password);
    const token = response.data.Token ?? response.data.token;
    const refreshToken = response.data.RefreshToken ?? response.data.refreshToken;
    const role = normalizeRole(getRoleFromToken(token));

    if (!token) {
      throw new Error("Login response did not include an access token.");
    }

    const userData = {
      ...response.data,
      token,
      refreshToken,
      role,
    };

    login(userData);
    navigate(getDefaultRouteForRole(role), { replace: true });

    return response;
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return { handleLogin, handleLogout, user };
}
