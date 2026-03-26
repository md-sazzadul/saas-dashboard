import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  HiArrowPath,
  HiEnvelope,
  HiExclamationCircle,
  HiLockClosed,
  HiSquares2X2,
} from "react-icons/hi2";
import { useNavigate } from "react-router";
import ThemeToggle from "../../../components/ui/ThemeToggle";
import { setToken } from "../../../utils/auth";
import { loginApi } from "../api/authApi";

// ── Types ───────────────────────────────────────────────────────────────────

type FieldErrors = {
  email?: string;
  password?: string;
};

// ── Validation helpers ──────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (email: string, password: string): FieldErrors => {
  const errors: FieldErrors = {};

  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

const hasErrors = (errors: FieldErrors) => Object.keys(errors).length > 0;

// ── Sub-components ──────────────────────────────────────────────────────────

const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500 dark:text-red-400 animate-fade-in">
      <HiExclamationCircle className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
};

// ── Login page ──────────────────────────────────────────────────────────────

const Login = () => {
  const navigate = useNavigate();
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // Track whether the user has attempted submission (to show inline errors)
  const [submitted, setSubmitted] = useState(false);

  // Auto-focus email on mount
  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  // Re-validate live once the user has attempted to submit
  useEffect(() => {
    if (submitted) {
      setFieldErrors(validate(email, password));
    }
  }, [email, password, submitted]);

  const handleLogin = async () => {
    setSubmitted(true);
    const errors = validate(email, password);
    setFieldErrors(errors);

    if (hasErrors(errors)) {
      // Focus the first invalid field for accessibility
      if (errors.email) emailRef.current?.focus();
      return;
    }

    const loginToast = toast.loading("Signing in…");

    try {
      setLoading(true);
      const res = await loginApi({ email: email.trim(), password });
      setToken(res.token);
      toast.success(`Welcome back, ${res.user.name}!`, { id: loginToast });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please try again.";

      toast.error(message, { id: loginToast });

      // Surface credential errors as a field hint so users know what to fix
      if (
        message.toLowerCase().includes("invalid") ||
        message.toLowerCase().includes("credential") ||
        message.toLowerCase().includes("password") ||
        message.toLowerCase().includes("email")
      ) {
        setFieldErrors({
          email: " ", // non-empty to trigger red border without duplicate text
          password: "Incorrect email or password.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  const emailInvalid = submitted && !!fieldErrors.email?.trim();
  const passwordInvalid = submitted && !!fieldErrors.password;

  return (
    <div
      className="h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "var(--surface-0)" }}
    >
      {/* Background geometry */}
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
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5"
            >
              Email
            </label>
            <div className="relative">
              <HiEnvelope
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
                  emailInvalid
                    ? "text-red-400"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              />
              <input
                id="email"
                ref={emailRef}
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={emailInvalid}
                aria-describedby={emailInvalid ? "email-error" : undefined}
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-gray-900 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-700
                  border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    emailInvalid
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400/30"
                      : "border-gray-200 dark:border-gray-800 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  }`}
                style={{ background: "var(--surface-0)" }}
              />
            </div>
            <div id="email-error">
              {/* Only show the error text if it's a real message (not the
                  sentinel space we set for credential errors) */}
              {fieldErrors.email?.trim() && (
                <FieldError message={fieldErrors.email.trim()} />
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-500 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <HiLockClosed
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
                  passwordInvalid
                    ? "text-red-400"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-invalid={passwordInvalid}
                aria-describedby={
                  passwordInvalid ? "password-error" : undefined
                }
                className={`w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-gray-900 dark:text-gray-100
                  placeholder-gray-300 dark:placeholder-gray-700
                  border focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    passwordInvalid
                      ? "border-red-400 dark:border-red-500 focus:ring-red-400/30"
                      : "border-gray-200 dark:border-gray-800 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  }`}
                style={{ background: "var(--surface-0)" }}
              />
            </div>
            <div id="password-error">
              <FieldError message={fieldErrors.password} />
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
            background: "var(--accent)",
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
