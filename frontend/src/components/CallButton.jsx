import { VideoIcon, Phone } from "lucide-react";

function CallButton({ handleVideoCall, handleAudioCall, isCallActive = false, disabled = false, className = "" }) {
  
  // Clean, minimal design
  const getCallButtonStyle = (type) => {
    const baseStyle = `
      flex items-center justify-center w-10 h-10 rounded-full
      transition-opacity duration-150 ease-out
      disabled:opacity-30 disabled:cursor-not-allowed
      border border-opacity-20
    `;

    if (type === 'video') {
      return `${baseStyle} bg-green-700 hover:opacity-90 text-white border-green-600`;
    } else {
      return `${baseStyle} bg-green-600 hover:opacity-90 text-white border-green-500`;
    }
  };

  const handleAudioCallClick = () => {
    if (handleAudioCall) {
      handleAudioCall();
    } else {
      handleVideoCall();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Audio Call Button */}
      <button 
        onClick={handleAudioCallClick}
        disabled={disabled}
        className={getCallButtonStyle('audio')}
        title="Audio Call"
      >
        <Phone className="w-4 h-4" />
      </button>

      {/* Video Call Button */}
      <button 
        onClick={handleVideoCall}
        disabled={disabled}
        className={getCallButtonStyle('video')}
        title="Video Call"
      >
        <VideoIcon className="w-4 h-4" />
      </button>

      {/* Call Status Indicator */}
      {isCallActive && (
        <div className="flex items-center gap-1 ml-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-red-500">In Call</span>
        </div>
      )}
    </div>
  );
}

export default CallButton;