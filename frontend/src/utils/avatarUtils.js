// Available avatar styles (high quality ones)
const AVATAR_STYLES = [
  'avataaars',     // Most popular, cartoon-like
  'big-smile',     // Friendly and cheerful
  'personas',      // Professional looking
  'adventurer-neutral', // Clean illustrated style
];

// Utility function to generate consistent avatar URLs
export const generateAvatarUrl = (userId) => {
  // Use the user ID to generate a consistent random number
  const seed = userId ? parseInt(userId.slice(-8), 16) : Math.floor(Math.random() * 100);
  const avatarId = (seed % 1000) + 1;
  const styleIndex = seed % AVATAR_STYLES.length;
  const style = AVATAR_STYLES[styleIndex];
  
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${avatarId}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

// Generate a random avatar URL with better styling
export const generateRandomAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  // Use avataaars as it's the most popular and best looking
  const style = 'avataaars';
  
  // Add background colors and better styling
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${idx}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&radius=50`;
};

// Generate a professional avatar (for business contexts)
export const generateProfessionalAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  return `https://api.dicebear.com/7.x/personas/svg?seed=${idx}&backgroundColor=f1f5f9,e2e8f0,cbd5e1`;
};

// Generate a fun/casual avatar
export const generateFunAvatar = () => {
  const idx = Math.floor(Math.random() * 1000) + 1;
  return `https://api.dicebear.com/7.x/big-smile/svg?seed=${idx}&backgroundColor=fef3c7,fed7d7,d9f99d,bfdbfe`;
};

// Get profile picture with fallback to avatar
export const getProfilePicture = (user) => {
  if (user?.profilePic) {
    // If user has a custom profile picture, use it
    return user.profilePic;
  }
  
  // If no profile picture, generate a consistent avatar based on user ID
  if (user?._id) {
    return generateAvatarUrl(user._id);
  }
  
  // Fallback to a default high-quality avatar
  return "https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4&radius=50";
};
