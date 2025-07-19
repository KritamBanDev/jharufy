import { useState } from 'react';
import { ThumbsUp, Heart, Laugh, Eye, Frown, PlusCircle } from 'lucide-react';

const reactionEmojis = {
  like: { emoji: '👍', icon: ThumbsUp, color: 'text-blue-500', bgColor: 'bg-blue-50' },
  love: { emoji: '❤️', icon: Heart, color: 'text-red-500', bgColor: 'bg-red-50' },
  laugh: { emoji: '😂', icon: Laugh, color: 'text-yellow-500', bgColor: 'bg-yellow-50' },
  wow: { emoji: '😮', icon: Eye, color: 'text-purple-500', bgColor: 'bg-purple-50' },
  sad: { emoji: '😢', icon: Frown, color: 'text-blue-400', bgColor: 'bg-blue-50' },
  angry: { emoji: '😠', icon: PlusCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
};

const ReactionPicker = ({ show, onReaction, userReaction, onClose, position = "left" }) => {
  const [hoveredReaction, setHoveredReaction] = useState(null);

  const handleReaction = (type) => {
    onReaction(type);
    onClose();
  };

  if (!show) return null;

  const positionClasses = {
    left: "bottom-full left-0",
    center: "bottom-full left-1/2 transform -translate-x-1/2",
    right: "bottom-full right-0"
  };

  return (
    <>
      {/* Backdrop to close when clicking outside */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      
      <div
        className={`absolute ${positionClasses[position]} mb-2 bg-base-100 shadow-2xl rounded-full px-3 sm:px-4 py-2 sm:py-3 flex gap-1 sm:gap-2 z-50 border border-base-200 animate-in fade-in slide-in-from-bottom-2 duration-200`}
      >
        {Object.entries(reactionEmojis).map(([type, { emoji }]) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            onMouseEnter={() => setHoveredReaction(type)}
            onMouseLeave={() => setHoveredReaction(null)}
            className={`
              w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl
              transition-all duration-200 hover:bg-base-200 hover:scale-125 active:scale-110
              ${userReaction?.type === type ? 'ring-2 ring-primary bg-primary/10' : ''}
            `}
            title={type.charAt(0).toUpperCase() + type.slice(1)}
          >
            <span>
              {emoji}
            </span>
          </button>
        ))}
        
        {/* Tooltip for desktop */}
        {hoveredReaction && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-base-content text-base-100 text-xs rounded hidden sm:block">
            {hoveredReaction.charAt(0).toUpperCase() + hoveredReaction.slice(1)}
          </div>
        )}
      </div>
    </>
  );
};

export default ReactionPicker;
