import { useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowPath,
  HiEnvelope,
  HiLockClosed,
  HiSquares2X2,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import { setToken } from "../../../utils/auth";
import { loginApi } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    const loginToast = toast.loading("Signing in…");

    try {
      setLoading(true);
      const res = await loginApi({ email, password });
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name}!`, { id: loginToast });
      navigate("/dashboard");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Login failed. Please try again.",
        { id: loginToast },
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div
      className="h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Subtle background geometry */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, color-mix(in srgb, var(--accent) 6%, transparent) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, color-mix(in srgb, #06b6d4 5%, transparent) 0%, transparent 40%)`,
        }}
      />

      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Card */}
      <div
        className="relative w-full max-w-sm mx-4 rounded-2xl border p-8 animate-fade-up"
        style={{
          background: "var(--surface-1)",
          borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <HiSquares2X2 className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-base font-semibold text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Meridian
          </span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h2
            className="text-xl font-bold text-gray-900 dark:text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5">
              Email
            </label>
            <div className="relative">
              <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none" />
              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-gray-900 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-700
                  border border-gray-200 dark:border-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                  transition-all"
                style={{ background: "var(--surface-0)" }}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-gray-900 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-700
                  border border-gray-200 dark:border-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent
                  transition-all"
                style={{ background: "var(--surface-0)" }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="mt-6 w-full py-2.5 rounded-lg text-sm font-semibold text-white
            disabled:opacity-60 transition-all duration-150
            flex items-center justify-center gap-2
            hover:shadow-lg active:scale-[0.99]"
          style={{
            background: loading ? "var(--accent)" : "var(--accent)",
            boxShadow: loading
              ? "none"
              : "0 4px 16px color-mix(in srgb, var(--accent) 40%, transparent)",
          }}
          onMouseEnter={(e) => {
            if (!loading)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent)";
          }}
        >
          {loading && <HiArrowPath className="w-4 h-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>

        {/* Hint */}
        <p className="mt-5 text-center text-xs text-gray-300 dark:text-gray-700">
          Use{" "}
          <span className="font-mono text-gray-400 dark:text-gray-600">
            admin@example.com
          </span>{" "}
          /{" "}
          <span className="font-mono text-gray-400 dark:text-gray-600">
            123456
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
