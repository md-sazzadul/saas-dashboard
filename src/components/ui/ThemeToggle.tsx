import { HiMoon, HiSun } from "react-icons/hi2";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      /*
        aria-label describes the ACTION, not the current state.
        "Switch to light mode" (when currently dark) is more useful than
        "Dark mode" — it tells users what will happen, not what is.
        This follows the ARIA authoring practices for toggle buttons.
      */
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      /*
        aria-pressed communicates the toggle state to AT.
        "true" = dark mode is on; "false" = dark mode is off.
        Screen readers announce: "Switch to light mode, toggle button, pressed"
      */
      aria-pressed={isDark}
      className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg
        text-gray-400 hover:text-gray-700 hover:bg-gray-100
        dark:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-gray-800/60
        transition-all duration-200"
    >
      {/* Dark mode icon (sun = shown when dark, click to go light) */}
      <span
        aria-hidden="true"
        className="absolute transition-all duration-300"
        style={{
          opacity: isDark ? 1 : 0,
          transform: `scale(${isDark ? 1 : 0.7}) rotate(${isDark ? 0 : 30}deg)`,
        }}
      >
        <HiSun className="w-4 h-4" />
      </span>

      {/* Light mode icon (moon = shown when light, click to go dark) */}
      <span
        aria-hidden="true"
        className="absolute transition-all duration-300"
        style={{
          opacity: !isDark ? 1 : 0,
          transform: `scale(${!isDark ? 1 : 0.7}) rotate(${!isDark ? 0 : -30}deg)`,
        }}
      >
        <HiMoon className="w-4 h-4" />
      </span>
    </button>
  );
};

export default ThemeToggle;
