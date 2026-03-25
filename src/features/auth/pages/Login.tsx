import { useState } from "react";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import { setToken } from "../../../utils/auth";
import { loginApi } from "../api/authApi";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await loginApi({ email, password });

      setToken(res.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
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

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mb-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          placeholder="admin@example.com"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            p-2.5 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
            dark:focus:ring-indigo-400 transition-colors"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="123456"
          className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
            p-2.5 mb-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500
            dark:focus:ring-indigo-400 transition-colors"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600
            disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition-colors"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </div>
  );
};

export default Login;
