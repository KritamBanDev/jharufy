import { useState, useEffect } from 'react';
import { Phone, PhoneOff, Video, Mic, MicOff } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const IncomingCallModal = ({ 
  isOpen, 
  callerName, 
  callerAvatar, 
  callType, 
  onAccept, 
  onDecline 
}) => {
  const [isRinging, setIsRinging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsRinging(true);
      // Play ringing sound (you can add actual audio later)
      const interval = setInterval(() => {
        setIsRinging(prev => !prev);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Incoming Call UI */}
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
                <span>Incoming Video Call</span>
              </>
            ) : (
              <>
                <Phone className="w-4 h-4" />
                <span>Incoming Audio Call</span>
              </>
            )}
          </div>
        </div>

        {/* Caller Avatar with Ringing Animation */}
        <div className="text-center mb-6">
          <motion.div 
            animate={{ 
              scale: isRinging ? 1.1 : 1,
              opacity: isRinging ? 0.8 : 1 
            }}
            transition={{ duration: 0.5 }}
            className="relative inline-block"
          >
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-green-500 shadow-xl">
              <img 
                src={callerAvatar} 
                alt={callerName}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Ringing Rings Animation */}
            <div className="absolute inset-0 rounded-full">
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1.6],
                  opacity: [0.5, 0.3, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut"
                }}
                className="absolute inset-0 border-2 border-green-400 rounded-full"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1.6],
                  opacity: [0.5, 0.3, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5
                }}
                className="absolute inset-0 border-2 border-green-400 rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Caller Name */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-1">{callerName}</h3>
          <p className="text-gray-400">
            {callType === 'video' ? 'wants to video chat' : 'is calling you'}
          </p>
        </div>

        {/* Call Action Buttons */}
        <div className="flex justify-center gap-6">
          {/* Decline Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDecline}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </motion.button>

          {/* Accept Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAccept}
            className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200"
          >
            {callType === 'video' ? (
              <Video className="w-8 h-8 text-white" />
            ) : (
              <Phone className="w-8 h-8 text-white" />
            )}
          </motion.button>
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-200">
            <MicOff className="w-5 h-5 text-white" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default IncomingCallModal;
