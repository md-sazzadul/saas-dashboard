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
    /*
      role="search" is a landmark role that identifies this as a search
      widget. AT users can jump directly to it via landmark navigation.
      aria-label distinguishes it from any other search regions on the page.
    */
    <div
      role="search"
      aria-label="Search users"
      className="relative flex items-center"
    >
      <HiMagnifyingGlass
        aria-hidden="true"
        className="absolute left-3 w-3.5 h-3.5 text-gray-400 dark:text-gray-600 pointer-events-none"
      />
      <input
        ref={inputRef}
        id="user-search"
        type="search"
        /*
          type="search" activates mobile keyboards with a search action key.
          It also enables the browser's built-in clear button on some
          browsers, which we supplement with our custom clear button.
        */
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        /*
          aria-label provides an accessible name since there is no visible
          <label> element here. If a <label> were present, we'd use htmlFor
          instead (a visible label is preferred per WCAG SC 2.4.6).
        */
        aria-label="Search users by name or ID"
        /*
          aria-describedby references the keyboard shortcut hint so AT
          announces it when the input is focused:
          "Search users by name or ID. Use ⌘K or Ctrl+K to focus."
        */
        aria-describedby="search-hint"
        autoComplete="off"
        spellCheck={false}
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
          type="button"
          aria-label="Clear search"
          className="absolute right-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          <HiXMark aria-hidden="true" className="w-3.5 h-3.5" />
        </button>
      )}
      {/*
        Keyboard hint: visually visible, also read by AT via aria-describedby.
        The hint text spells out what the shortcut does so it's useful
        even when read aloud (avoid "⌘K" without context for screen readers).
      */}
      <span
        id="search-hint"
        className="absolute right-2.5 hidden sm:inline-flex items-center gap-0.5 text-[9px] font-medium text-gray-300 dark:text-gray-700 font-mono pointer-events-none"
        aria-label="Press Command K or Control K to focus search"
      >
        {value ? null : "⌘K"}
      </span>
    </div>
  );
};

export default SearchBar;
