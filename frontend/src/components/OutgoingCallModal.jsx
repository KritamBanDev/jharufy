import { useState, useEffect } from 'react';
import { PhoneOff, Video, Phone } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const OutgoingCallModal = ({ 
  isOpen, 
  receiverName, 
  receiverAvatar, 
  callType, 
  callStatus, 
  onCancel 
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (isOpen && callStatus === 'ringing') {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isOpen, callStatus]);

  if (!isOpen) return null;

  const getStatusText = () => {
    switch (callStatus) {
      case 'ringing':
        return `Calling${dots}`;
      case 'connecting':
        return 'Connecting...';
      case 'offline':
        return 'User is offline';
      case 'declined':
        return 'Call declined';
      default:
        return 'Calling...';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700 max-w-sm w-full mx-4"
      >
        {/* Call Type Indicator */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-white/70 text-sm mb-2">
            {callType === 'video' ? (
              <>
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Audio Call</span>
              </>
            )}
          </div>
        </div>

        {/* Receiver Avatar with Calling Animation */}
        <div className="text-center mb-6">
          <motion.div 
            animate={{ 
              scale: callStatus === 'ringing' ? [1, 1.05, 1] : 1
            }}
            transition={{ 
              duration: 2,
              repeat: callStatus === 'ringing' ? Infinity : 0,
              ease: "easeInOut"
            }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-blue-500 shadow-xl">
              <img 
                src={receiverAvatar} 
                alt={receiverName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Calling Pulse Animation */}
            {callStatus === 'ringing' && (
              <div className="absolute inset-0 rounded-full">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1.4],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                  className="absolute inset-0 border-2 border-blue-400 rounded-full"
                />
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1.4],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{ 
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                    delay: 0.3
                  }}
                  className="absolute inset-0 border-2 border-blue-400 rounded-full"
                />
              </div>
            )}
          </motion.div>
        </div>

        {/* Receiver Name */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-1">{receiverName}</h3>
          <p className={`text-sm ${
            callStatus === 'offline' || callStatus === 'declined' 
              ? 'text-red-400' 
              : 'text-gray-400'
          }`}>
            {getStatusText()}
          </p>
        </div>

        {/* Cancel Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </motion.button>
        </div>

        {/* Status Messages */}
        {(callStatus === 'offline' || callStatus === 'declined') && (
          <div className="text-center mt-4">
            <p className="text-gray-400 text-sm">
              {callStatus === 'offline' 
                ? 'The user is currently offline' 
                : 'Maybe try again later'
              }
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OutgoingCallModal;
