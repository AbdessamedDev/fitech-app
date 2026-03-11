import { useState } from "react";
import { Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { useAuth } from "../../features/auth/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleLogin = () => {
    login({ email });
    console.log("Logged in:", email);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0d0d0d]">

      {/* LEFT SIDE */}
      <div className="w-[42%] flex flex-col justify-center px-20 bg-[#111111]">

        <h1 className="text-5xl font-bold text-white mb-1">
          Welcome Back<span className="text-[#6c3fff]">.</span>
        </h1>
        <p className="text-white text-sm mb-10">Login to your Account</p>

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

          <p className="text-gray-500 text-xs cursor-pointer hover:text-[#6c3fff] -mt-3">
            Forgot password?
          </p>

          <button
            onClick={handleLogin}
            className="bg-[#6c3fff] hover:bg-[#5a2ee0] text-white font-semibold py-3 rounded-lg transition text-base"
          >
            Login
          </button>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        className="w-[58%] bg-cover bg-center relative flex items-center justify-center"
        style={{ backgroundImage: "url('/gym-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-black/60 to-black/40" />

        {/* Center text */}
        <div className="relative z-10 text-left">
          <h2 className="text-5xl font-medium text-white leading-tight">Control the System</h2>
          <h2 className="text-5xl font-medium text-white leading-tight">
            <span className="text-[#6c3fff]">Shape</span> the Growth
            <span className="text-[#6c3fff]">.</span>
          </h2>
        </div>

        {/* Logo bottom right */}
        <img
          src="/logo_v.svg"
          alt="Logo"
          className="absolute bottom-6 right-6 w-16 z-10 opacity-80"
        />
      </div>

    </div>
  );
}