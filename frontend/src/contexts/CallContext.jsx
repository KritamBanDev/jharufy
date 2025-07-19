import { createContext, useState, useEffect, useCallback } from 'react';
import socketService from '../lib/socketService';
import useAuthUser from '../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CallContext = createContext();



export const CallProvider = ({ children }) => {
  const { authUser } = useAuthUser();
  const navigate = useNavigate();

  // Call states
  const [incomingCall, setIncomingCall] = useState(null);
  const [outgoingCall, setOutgoingCall] = useState(null);
  const [callStatus, setCallStatus] = useState(null); // 'ringing', 'connecting', 'connected', 'ended'

  const setupCallListeners = useCallback(() => {
    // Incoming call
    socketService.onIncomingCall((callData) => {
      console.log('Incoming call:', callData);
      setIncomingCall(callData);
      toast('📞 Incoming call!', {
        icon: '🔔',
        duration: 3000
      });
    });

    // Call status updates
    socketService.onCallStatus((status) => {
      console.log('Call status:', status);
      setCallStatus(status.status);
      
      if (status.status === 'offline') {
        toast.error('User is offline');
        setTimeout(() => {
          setOutgoingCall(null);
          setCallStatus(null);
        }, 3000);
      }
    });

    // Call accepted
    socketService.onCallAccepted((data) => {
      console.log('Call accepted:', data);
      setCallStatus('connecting');
      toast.success('Call accepted! Connecting...');
    });

    // Call declined
    socketService.onCallDeclined((data) => {
      console.log('Call declined:', data);
      setCallStatus('declined');
      toast.error('Call declined');
      setTimeout(() => {
        setOutgoingCall(null);
        setCallStatus(null);
      }, 3000);
    });

    // Call start (navigate to call page)
    socketService.onCallStart((data) => {
      console.log('Call starting:', data);
      setIncomingCall(null);
      setOutgoingCall(null);
      setCallStatus('connected');
      navigate(`/call/${data.channelId}`);
    });

    // Call ended
    socketService.onCallEnded((data) => {
      console.log('Call ended:', data);
      setIncomingCall(null);
      setOutgoingCall(null);
      setCallStatus('ended');
      toast('Call ended', { icon: '📞' });
      
      // If we're on call page, navigate back
      if (window.location.pathname.startsWith('/call/')) {
        navigate('/');
      }
    });
  }, [navigate]); // useCallback dependencies

  useEffect(() => {
    if (authUser) {
      // Connect to socket
      socketService.connect(authUser._id);

      // Set up event listeners
      setupCallListeners();

      return () => {
        // Clean up listeners
        socketService.off('call:incoming');
        socketService.off('call:status');
        socketService.off('call:accepted');
        socketService.off('call:declined');
        socketService.off('call:start');
        socketService.off('call:ended');
      };
    }
  }, [authUser, setupCallListeners]);

  const initiateCall = (receiverData, callType) => {
    if (!authUser) return;

    console.log('Initiating call:', { receiverData, callType });

    const callData = {
      callerId: authUser._id,
      receiverId: receiverData._id,
      callerName: authUser.fullName,
      callerAvatar: authUser.profilePic,
      callType, // 'video' or 'audio'
      channelId: `call_${authUser._id}_${receiverData._id}_${Date.now()}`
    };

    setOutgoingCall({
      receiverName: receiverData.fullName,
      receiverAvatar: receiverData.profilePic,
      callType,
      channelId: callData.channelId
    });

    setCallStatus('ringing');
    socketService.initiateCall(callData);
  };

  const acceptCall = () => {
    if (!incomingCall || !authUser) return;

    console.log('Accepting call');

    const callData = {
      callerId: incomingCall.callerId,
      receiverId: authUser._id,
      channelId: incomingCall.channelId
    };

    socketService.acceptCall(callData);
    setCallStatus('connecting');
  };

  const declineCall = () => {
    if (!incomingCall || !authUser) return;

    console.log('Declining call');

    const callData = {
      callerId: incomingCall.callerId,
      receiverId: authUser._id
    };

    socketService.declineCall(callData);
    setIncomingCall(null);
    setCallStatus(null);
  };

  const endCall = () => {
    if (!authUser) return;

    console.log('Ending call');

    const callData = {
      callerId: authUser._id,
      receiverId: outgoingCall?.receiverId || incomingCall?.callerId
    };

    socketService.endCall(callData);
    setIncomingCall(null);
    setOutgoingCall(null);
    setCallStatus('ended');
  };

  const cancelCall = () => {
    endCall();
  };

  const value = {
    incomingCall,
    outgoingCall,
    callStatus,
    initiateCall,
    acceptCall,
    declineCall,
    endCall,
    cancelCall
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export default CallContext;
