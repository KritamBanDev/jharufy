import { create } from "zustand";

// Helper to safely get theme from localStorage
const getStoredTheme = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("jharufy-theme") || "forest";
  }
  return "forest";
};

export const useThemeStore = create((set) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("jharufy-theme", theme);
    }
    set({ theme });
  },
}));