import { useEffect, useRef } from "react";
import {
  HiCheckCircle,
  HiCurrencyDollar,
  HiIdentification,
  HiXCircle,
  HiXMark,
} from "react-icons/hi2";
import type { User } from "../types";

type Props = {
  user: User | null;
  onClose: () => void;
};

const AVATAR_COLORS = [
  {
    bg: "bg-indigo-100 dark:bg-indigo-950/60",
    text: "text-indigo-600 dark:text-indigo-400",
    accent: "#6366f1",
  },
  {
    bg: "bg-sky-100 dark:bg-sky-950/60",
    text: "text-sky-600 dark:text-sky-400",
    accent: "#0ea5e9",
  },
  {
    bg: "bg-violet-100 dark:bg-violet-950/60",
    text: "text-violet-600 dark:text-violet-400",
    accent: "#8b5cf6",
  },
  {
    bg: "bg-emerald-100 dark:bg-emerald-950/60",
    text: "text-emerald-600 dark:text-emerald-400",
    accent: "#10b981",
  },
  {
    bg: "bg-amber-100 dark:bg-amber-950/60",
    text: "text-amber-600 dark:text-amber-400",
    accent: "#f59e0b",
  },
  {
    bg: "bg-rose-100 dark:bg-rose-950/60",
    text: "text-rose-600 dark:text-rose-400",
    accent: "#f43f5e",
  },
];

const FOCUSABLE_SELECTORS =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const UserDrawer = ({ user, onClose }: Props) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  /*
    triggerRef: store the element that opened the drawer so we can
    return focus to it when the drawer closes (WCAG 2.4.3 Focus Order).
    Without this, focus would land on <body> after closing, disorienting
    keyboard users.
  */
  const triggerRef = useRef<Element | null>(null);

  // Escape key to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (user) {
      // Remember what triggered the drawer before we move focus
      triggerRef.current = document.activeElement;
      window.addEventListener("keydown", handler);
      // Move focus into the drawer
      setTimeout(() => drawerRef.current?.focus(), 50);
    }
    return () => window.removeEventListener("keydown", handler);
  }, [user, onClose]);

  // Restore focus when drawer closes
  useEffect(() => {
    if (!user && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [user]);

  /*
    Focus trap: prevent Tab from leaving the drawer while it's open.
    Cycles focus between the first and last focusable elements within
    the drawer (WAI-ARIA Modal Dialog pattern).
  */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !drawerRef.current) return;

    const focusable = Array.from(
      drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
    ).filter((el) => !el.hasAttribute("disabled"));

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      // Shift+Tab: wrap to last element
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      // Tab: wrap to first element
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!user) return null;

  const color = getColor(user.name);
  const revenuePercent = Math.min(100, (user.revenue / 600) * 100);

  return (
    <>
      {/*
        Backdrop: aria-hidden because it's a purely visual overlay.
        The <dialog> / role="dialog" on the drawer itself is what AT
        announces. onClick closes the drawer for mouse users.
      */}
      <div
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
        role="dialog" + aria-modal="true" tells AT:
          1. This is a modal dialog (navigation is constrained inside it)
          2. The rest of the page is inert
        aria-labelledby links the dialog to its visible title for AT
        aria-describedby gives an optional longer description
      */}
      <div
        ref={drawerRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        aria-describedby="drawer-description"
        onKeyDown={handleKeyDown}
        className="fixed right-0 top-0 bottom-0 z-50 w-80 flex flex-col outline-none"
        style={{
          background: "var(--surface-1)",
          borderLeft:
            "1px solid color-mix(in srgb, currentColor 8%, transparent)",
          boxShadow: "-24px 0 64px rgba(0,0,0,0.1)",
          animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        {/* Header */}
        <div
          className="px-5 pt-5 pb-4 border-b flex items-center justify-between shrink-0"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          {/*
            id="drawer-title" is referenced by aria-labelledby on the dialog.
            This is what AT announces when the drawer opens:
            "User Details, dialog"
          */}
          <span
            id="drawer-title"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600"
          >
            User Details
          </span>
          <button
            onClick={onClose}
            type="button"
            aria-label="Close user details panel"
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400
              hover:text-gray-600 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-all duration-150"
          >
            <HiXMark aria-hidden="true" className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div
          id="drawer-description"
          className="flex-1 overflow-y-auto px-5 py-6 space-y-6"
        >
          {/* Avatar + Name */}
          <div className="flex flex-col items-center text-center gap-3">
            {/* aria-hidden: initials avatar is decorative; the heading below names the user */}
            <div
              aria-hidden="true"
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold ${color.bg} ${color.text}`}
            >
              {getInitials(user.name)}
            </div>
            <div>
              <h3
                className="text-base font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {user.name}
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5 font-mono">
                <abbr title={`User identifier ${user.id}`}>
                  #{user.id.toString().padStart(4, "0")}
                </abbr>
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex justify-center">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                user.status === "active"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500"
              }`}
              role="status"
              aria-label={`Account status: ${user.status === "active" ? "Active" : "Inactive"}`}
            >
              {user.status === "active" ? (
                <HiCheckCircle aria-hidden="true" className="w-4 h-4" />
              ) : (
                <HiXCircle aria-hidden="true" className="w-4 h-4" />
              )}
              {user.status === "active" ? "Active account" : "Inactive account"}
            </span>
          </div>

          {/* Divider */}
          <hr
            className="border-t"
            style={{
              borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
            }}
          />

          {/* Stats */}
          <div className="space-y-4">
            {/* Revenue stat */}
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "var(--surface-0)",
                borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    aria-hidden="true"
                    className={`w-6 h-6 rounded-md flex items-center justify-center ${color.bg} ${color.text}`}
                  >
                    <HiCurrencyDollar className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                    Revenue
                  </span>
                </div>
                <span
                  className="text-lg font-bold text-gray-900 dark:text-white tabular-nums"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  ${user.revenue.toLocaleString()}
                </span>
              </div>
              {/*
                Progress bar: role="meter" semantically represents a value
                within a known range. aria-valuenow/min/max/label give AT
                the full picture without relying on visual width.
              */}
              <div
                role="meter"
                aria-valuenow={revenuePercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Revenue is ${revenuePercent.toFixed(0)}% of top earner`}
                className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden"
              >
                <div
                  aria-hidden="true"
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${revenuePercent}%`,
                    background: color.accent,
                    opacity: 0.8,
                  }}
                />
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-600 mt-1.5">
                {revenuePercent.toFixed(0)}% of top earner
              </p>
            </div>

            {/* ID stat */}
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "var(--surface-0)",
                borderColor: "color-mix(in srgb, currentColor 6%, transparent)",
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <HiIdentification
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-gray-400 dark:text-gray-600"
                />
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
                  User ID
                </span>
              </div>
              <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                USR-{user.id.toString().padStart(6, "0")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer action */}
        <div
          className="px-5 py-4 border-t shrink-0"
          style={{
            borderColor: "color-mix(in srgb, currentColor 8%, transparent)",
          }}
        >
          <button
            onClick={onClose}
            type="button"
            className="w-full py-2 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-500
              hover:text-gray-700 dark:hover:text-gray-300
              hover:bg-gray-100 dark:hover:bg-gray-800
              transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDrawer;
