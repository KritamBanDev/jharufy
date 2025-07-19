// Shared theme styles for consistent theming across all loaders
export const getLoaderThemeStyles = (theme) => {
  const themeConfigs = {
    // Coffee theme - warm amber/orange tones
    coffee: {
      bgGradient: "from-amber-500 via-orange-500 to-red-500",
      iconColor: "text-amber-500",
      loaderColor: "text-orange-400",
      secondaryColor: "text-amber-400",
      glowEffect: "drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.6)]"
    },
    
    // Forest theme - natural green tones
    forest: {
      bgGradient: "from-green-600 via-emerald-500 to-teal-600",
      iconColor: "text-green-500",
      loaderColor: "text-emerald-400",
      secondaryColor: "text-green-400",
      glowEffect: "drop-shadow-[0_0_12px_rgba(34,197,94,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]"
    },
    
    // Dracula theme - purple/pink dark tones
    dracula: {
      bgGradient: "from-purple-400 via-pink-400 to-red-400",
      iconColor: "text-purple-300",
      loaderColor: "text-pink-300",
      secondaryColor: "text-purple-200",
      glowEffect: "drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]"
    },
    
    // Dim theme - muted gray tones
    dim: {
      bgGradient: "from-slate-300 via-gray-400 to-zinc-500",
      iconColor: "text-slate-300",
      loaderColor: "text-gray-300",
      secondaryColor: "text-slate-200",
      glowEffect: "drop-shadow-[0_0_10px_rgba(148,163,184,0.3)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_15px_rgba(148,163,184,0.5)]"
    },
    
    // Light theme - bright blue/purple
    light: {
      bgGradient: "from-blue-400 via-indigo-400 to-purple-500",
      iconColor: "text-blue-400",
      loaderColor: "text-indigo-400",
      secondaryColor: "text-blue-300",
      glowEffect: "drop-shadow-[0_0_15px_rgba(59,130,246,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.6)]"
    },
    
    // Dark theme - emerald/teal
    dark: {
      bgGradient: "from-emerald-300 via-teal-400 to-cyan-500",
      iconColor: "text-emerald-300",
      loaderColor: "text-teal-300",
      secondaryColor: "text-emerald-200",
      glowEffect: "drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_25px_rgba(52,211,153,0.6)]"
    },
    
    // Cupcake theme - pink/rose pastels
    cupcake: {
      bgGradient: "from-pink-300 via-rose-300 to-purple-400",
      iconColor: "text-pink-300",
      loaderColor: "text-rose-300",
      secondaryColor: "text-pink-200",
      glowEffect: "drop-shadow-[0_0_12px_rgba(244,114,182,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.6)]"
    },
    
    // Aqua theme - cyan/teal ocean colors
    aqua: {
      bgGradient: "from-cyan-300 via-teal-300 to-blue-400",
      iconColor: "text-cyan-300",
      loaderColor: "text-teal-300",
      secondaryColor: "text-cyan-200",
      glowEffect: "drop-shadow-[0_0_15px_rgba(34,211,238,0.4)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.6)]"
    },
    
    // Wireframe theme - monochrome
    wireframe: {
      bgGradient: "from-gray-600 via-gray-700 to-black",
      iconColor: "text-gray-500",
      loaderColor: "text-gray-600",
      secondaryColor: "text-gray-400",
      glowEffect: "drop-shadow-[0_0_8px_rgba(107,114,128,0.3)]",
      pulseColor: "animate-pulse",
      hoverGlow: "hover:drop-shadow-[0_0_12px_rgba(107,114,128,0.5)]"
    }
  };

  return themeConfigs[theme] || themeConfigs.forest;
};
