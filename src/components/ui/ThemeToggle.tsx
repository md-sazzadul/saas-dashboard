import { HiMoon, HiSun } from "react-icons/hi2";
import { useTheme } from "../../hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="relative inline-flex items-center justify-center w-8 h-8 rounded-lg
        text-gray-400 hover:text-gray-700 hover:bg-gray-100
        dark:text-gray-600 dark:hover:text-gray-300 dark:hover:bg-gray-800/60
        transition-all duration-200"
    >
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "dark" ? 1 : 0,
          transform: `scale(${theme === "dark" ? 1 : 0.7}) rotate(${theme === "dark" ? 0 : 30}deg)`,
        }}
      >
        <HiSun className="w-4 h-4" />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: theme === "light" ? 1 : 0,
          transform: `scale(${theme === "light" ? 1 : 0.7}) rotate(${theme === "light" ? 0 : -30}deg)`,
        }}
      >
        <HiMoon className="w-4 h-4" />
      </span>
    </button>
  );
};

export default ThemeToggle;
