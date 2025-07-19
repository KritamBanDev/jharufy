import { PaletteIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="dropdown dropdown-end">
      {/* DROPDOWN TRIGGER */}
      <button 
        tabIndex={0} 
        className="w-10 h-10 rounded-full flex items-center justify-center tooltip tooltip-bottom hover:bg-primary/10 transition-all duration-300" 
        data-tip="Change theme"
      >
        <PaletteIcon className="size-5 text-base-content hover:text-primary transition-colors duration-300" />
      </button>

      <div
        tabIndex={0}
        className="dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl
        w-56 border border-base-content/10 max-h-80 overflow-y-auto z-50"
      >
        <div className="space-y-1">
          {THEMES.map((themeOption) => (
            <button
              key={themeOption.name}
              className={`
              w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
              ${
                theme === themeOption.name
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "hover:bg-base-content/5"
              }
            `}
              onClick={() => setTheme(themeOption.name)}
            >
              <PaletteIcon className="size-4" />
              <span className="text-sm font-medium">{themeOption.label}</span>
              {/* THEME PREVIEW COLORS */}
              <div className="ml-auto flex gap-1">
                {themeOption.colors.map((color, i) => (
                  <span
                    key={i}
                    className="size-2 rounded-full ring-1 ring-base-content/20"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {theme === themeOption.name && (
                <div className="size-2 rounded-full bg-primary ml-1" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ThemeSelector;