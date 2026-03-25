import { useState } from "react";
import toast from "react-hot-toast";
import { HiArrowPath, HiEnvelope, HiLockClosed } from "react-icons/hi2";
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

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow dark:shadow-gray-900 border border-gray-200 dark:border-gray-800 w-96 transition-colors duration-200">
        <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Sign in to your account
        </p>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <div className="relative mb-4">
          <HiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="email"
            placeholder="admin@example.com"
            value={email}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
              dark:focus:ring-indigo-400 transition-colors"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <div className="relative mb-6">
          <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          <input
            type="password"
            placeholder="123456"
            value={password}
            className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
              pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
              dark:focus:ring-indigo-400 transition-colors"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
            disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          {loading && <HiArrowPath className="w-4 h-4 animate-spin" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Login;
