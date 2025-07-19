// Language mapping utility with proper names and flag emojis
export const languageMap = {
  // Popular languages with their proper names and flag emojis
  english: { name: "English", flag: "🇺🇸" },
  spanish: { name: "Spanish", flag: "🇪🇸" },
  french: { name: "French", flag: "🇫🇷" },
  german: { name: "German", flag: "🇩🇪" },
  italian: { name: "Italian", flag: "🇮🇹" },
  portuguese: { name: "Portuguese", flag: "🇵🇹" },
  russian: { name: "Russian", flag: "🇷🇺" },
  chinese: { name: "Chinese", flag: "🇨🇳" },
  japanese: { name: "Japanese", flag: "🇯🇵" },
  korean: { name: "Korean", flag: "🇰🇷" },
  arabic: { name: "Arabic", flag: "🇸🇦" },
  hindi: { name: "Hindi", flag: "🇮🇳" },
  dutch: { name: "Dutch", flag: "🇳🇱" },
  swedish: { name: "Swedish", flag: "🇸🇪" },
  norwegian: { name: "Norwegian", flag: "🇳🇴" },
  danish: { name: "Danish", flag: "🇩🇰" },
  finnish: { name: "Finnish", flag: "🇫🇮" },
  polish: { name: "Polish", flag: "🇵🇱" },
  turkish: { name: "Turkish", flag: "🇹🇷" },
  greek: { name: "Greek", flag: "🇬🇷" },
  hebrew: { name: "Hebrew", flag: "🇮🇱" },
  thai: { name: "Thai", flag: "🇹🇭" },
  vietnamese: { name: "Vietnamese", flag: "🇻🇳" },
  czech: { name: "Czech", flag: "🇨🇿" },
  hungarian: { name: "Hungarian", flag: "🇭🇺" },
  romanian: { name: "Romanian", flag: "🇷🇴" },
  bulgarian: { name: "Bulgarian", flag: "🇧🇬" },
  ukrainian: { name: "Ukrainian", flag: "🇺🇦" },
  urdu: { name: "Urdu", flag: "🇵🇰" },
  bengali: { name: "Bengali", flag: "🇧🇩" },
  tamil: { name: "Tamil", flag: "🇱🇰" },
  telugu: { name: "Telugu", flag: "🇮🇳" },
  marathi: { name: "Marathi", flag: "🇮🇳" },
  gujarati: { name: "Gujarati", flag: "🇮🇳" },
  punjabi: { name: "Punjabi", flag: "🇮🇳" },
  malayalam: { name: "Malayalam", flag: "🇮🇳" },
  kannada: { name: "Kannada", flag: "🇮🇳" },
  swahili: { name: "Swahili", flag: "🇰🇪" },
  amharic: { name: "Amharic", flag: "🇪🇹" },
  yoruba: { name: "Yoruba", flag: "🇳🇬" },
  hausa: { name: "Hausa", flag: "🇳🇬" },
  igbo: { name: "Igbo", flag: "🇳🇬" },
  zulu: { name: "Zulu", flag: "🇿🇦" },
  afrikaans: { name: "Afrikaans", flag: "🇿🇦" },
  malay: { name: "Malay", flag: "🇲🇾" },
  indonesian: { name: "Indonesian", flag: "🇮🇩" },
  tagalog: { name: "Tagalog", flag: "🇵🇭" },
  // Add fallback for unknown languages
};

// Helper function to get formatted language with flag
export const getFormattedLanguage = (languageKey) => {
  if (!languageKey) return { name: "Not specified", flag: "🌍" };
  
  const language = languageMap[languageKey.toLowerCase()];
  if (language) {
    return language;
  }
  
  // Fallback: capitalize first letter for unknown languages
  const capitalizedName = languageKey.charAt(0).toUpperCase() + languageKey.slice(1).toLowerCase();
  return { name: capitalizedName, flag: "🌍" };
};
