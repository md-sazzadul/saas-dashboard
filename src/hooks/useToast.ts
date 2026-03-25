import toast from "react-hot-toast";

/**
 * Thin wrapper around react-hot-toast that keeps toast calls consistent.
 * Import and use `useToast()` instead of importing `toast` directly in most
 * components so the styling/duration defaults live in one place.
 */
export const useToast = () => {
  return {
    success: (message: string, duration = 4000) =>
      toast.success(message, { duration }),

    error: (message: string, duration = 5000) =>
      toast.error(message, { duration }),

    info: (message: string, duration = 4000) =>
      toast(message, {
        duration,
        icon: "ℹ️",
      }),

    loading: (message: string) => toast.loading(message),

    /** Resolve a loading toast created with `loading()` */
    resolve: (id: string, type: "success" | "error", message: string) => {
      if (type === "success") {
        toast.success(message, { id });
      } else {
        toast.error(message, { id });
      }
    },

    dismiss: (id?: string) => toast.dismiss(id),
  };
};
