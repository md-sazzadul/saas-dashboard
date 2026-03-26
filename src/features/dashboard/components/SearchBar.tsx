import { useEffect, useRef } from "react";
import { HiMagnifyingGlass, HiXMark } from "react-icons/hi2";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search users…",
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="relative flex items-center">
      <HiMagnifyingGlass className="absolute left-3 w-3.5 h-3.5 text-gray-400 dark:text-gray-600 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-48 pl-8 pr-8 py-1.5 rounded-lg text-xs
          text-gray-700 dark:text-gray-300
          placeholder-gray-300 dark:placeholder-gray-700
          border border-gray-200 dark:border-gray-800
          focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-600 focus:w-64
          transition-all duration-200"
        style={{ background: "var(--surface-0)" }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
      />
      {value && (
        <button
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <HiXMark className="w-3.5 h-3.5" />
        </button>
      )}
      {!value && (
        <kbd className="absolute right-2.5 hidden sm:inline-flex items-center gap-0.5 text-[9px] font-medium text-gray-300 dark:text-gray-700 font-mono">
          ⌘K
        </kbd>
      )}
    </div>
  );
};

export default SearchBar;
