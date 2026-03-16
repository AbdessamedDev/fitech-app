import { useState } from "react";
import { Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();

  const onSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      await handleLogin(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Email</label>
        <div className="flex items-center bg-[#f0f0f0] rounded-lg px-4 py-3 gap-3">
          <Envelope size={18} className="text-gray-500" />
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent outline-none text-gray-700 text-sm w-full placeholder-gray-400"
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Password</label>
        <div className="flex items-center bg-[#f0f0f0] rounded-lg px-4 py-3 gap-3">
          <Lock size={18} className="text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-transparent outline-none text-gray-700 text-sm w-full placeholder-gray-400"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 cursor-pointer hover:text-gray-700"
          >
            {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
          </span>
        </div>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-xs -mt-3">{error}</p>}

      <p className="text-gray-500 text-xs cursor-pointer hover:text-[#6c3fff] -mt-3">
        Forgot password?
      </p>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="bg-[#6c3fff] hover:bg-[#5a2ee0] text-white font-semibold py-3 rounded-lg transition text-base disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

    </div>
  );
}