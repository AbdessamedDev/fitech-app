import LoginForm from "../../features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen bg-[#0d0d0d]">

      {/* LEFT SIDE */}
      <div className="w-[42%] flex flex-col justify-center px-20 bg-[#111111]">
        <h1 className="text-5xl font-bold text-white mb-1">
          Welcome Back<span className="text-[#6c3fff]">.</span>
        </h1>
        <p className="text-white text-sm mb-10">Login to your Account</p>
        <LoginForm />
      </div>

      {/* RIGHT SIDE */}
      <div
        className="w-[58%] bg-cover bg-center relative flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: "url('/gym-bg.png')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-black/60 to-black/40" />
        <div className="relative z-10 text-left">
          <h2 className="text-5xl font-medium text-white leading-tight">Control the System</h2>
          <h2 className="text-5xl font-medium text-white leading-tight">
            <span className="text-[#6c3fff]">Shape</span> the Growth
            <span className="text-[#6c3fff]">.</span>
          </h2>
        </div>
        <img
          src="/logo_v.svg"
          alt=""
          className="absolute -bottom-4 -right-2 w-32 z-10 brightness-0 invert opacity-90"
        />
      </div>

    </div>
  );
}