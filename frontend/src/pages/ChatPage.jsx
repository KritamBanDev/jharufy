import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import useAuthUser from "../hooks/useAuthUser";
import useCall from "../hooks/useCall";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken, getUserById } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import { ArrowLeft, AlertCircle, Wifi, WifiOff } from "lucide-react";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";
import "../styles/chat.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get target user ID from either path params or query params
  const actualTargetUserId = targetUserId || searchParams.get('userId');

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [targetUser, setTargetUser] = useState(null);

  const { authUser } = useAuthUser();
  const { initiateCall } = useCall();

  // Early validation
  useEffect(() => {
    console.log("🔍 Debug - targetUserId:", targetUserId);
    console.log("🔍 Debug - searchParams userId:", searchParams.get('userId'));
    console.log("🔍 Debug - actualTargetUserId:", actualTargetUserId);
    
    if (!actualTargetUserId || actualTargetUserId === ':id') {
      console.log("❌ No target user provided, redirecting to chat list");
      navigate('/chat');
      return;
    }
    if (!authUser) {
      setError("Authentication required");
      setLoading(false);
      return;
    }
    console.log("📋 ChatPage initialized with:", { actualTargetUserId, authUser: authUser?.fullName });
  }, [actualTargetUserId, authUser, targetUserId, searchParams, navigate]);

  const { data: tokenData, error: tokenError, isLoading: tokenLoading } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser && !error,
    retry: 3,
    retryDelay: 1000,
  });

  // Get target user information
  const { data: targetUserData, error: userError, isLoading: userLoading } = useQuery({
    queryKey: ["user", actualTargetUserId],
    queryFn: () => getUserById(actualTargetUserId),
    enabled: !!actualTargetUserId && !error,
    retry: 2,
  });

  useEffect(() => {
    if (targetUserData?.data) {
      setTargetUser(targetUserData.data);
    }
  }, [targetUserData]);

  // Handle API errors
  useEffect(() => {
    if (tokenError) {
      console.error("❌ Token Error:", tokenError);
      
      // Check if it's an authentication error
      if (tokenError.response?.status === 401) {
        setError("Please log in to access chat");
        toast.error("Authentication required. Redirecting to login...");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(`Authentication failed: ${tokenError.message}`);
      }
      setLoading(false);
    }
    if (userError) {
      console.error("❌ User Error:", userError);
      if (userError.response?.status === 404) {
        setError("User not found. They may have deleted their account.");
      } else {
        setError(`User not found: ${userError.message}`);
      }
      setLoading(false);
    }
  }, [tokenError, userError, navigate]);

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser || error) return;

      try {
        console.log("🚀 Initializing stream chat client...");
        console.log("📋 Token available:", !!tokenData?.token);
        console.log("📋 STREAM_API_KEY:", STREAM_API_KEY);
        setError(null);

        if (!STREAM_API_KEY) {
          throw new Error("Stream API key is not configured");
        }

        const client = StreamChat.getInstance(STREAM_API_KEY);

        // Set up connection event listeners
        client.on('connection.changed', (event) => {
          console.log('📡 Connection status:', event.online);
          setIsConnected(event.online);
          if (!event.online) {
            toast.error("Connection lost. Trying to reconnect...");
          } else {
            toast.success("Connected to chat!");
          }
        });

        console.log("🔑 Connecting user with token...");
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        console.log("✅ User connected successfully");

        // Create channel ID by sorting user IDs for consistency
        const channelId = [authUser._id, actualTargetUserId].sort().join("-");
        console.log("📺 Creating channel:", channelId);

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, actualTargetUserId],
          name: `Chat with ${targetUser?.fullName || 'User'}`,
        });

        await currChannel.watch();
        console.log("👀 Channel watching started");

        setChatClient(client);
        setChannel(currChannel);
        setIsConnected(true);
      } catch (error) {
        console.error("❌ Error initializing chat:", error);
        setError(error.message || "Could not connect to chat");
        toast.error(`Chat connection failed: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    initChat();
  }, [tokenData, authUser, actualTargetUserId, targetUser?.fullName, error]);

  // Separate cleanup effect for when component unmounts
  useEffect(() => {
    return () => {
      if (chatClient) {
        console.log("🧹 Component unmounting, disconnecting chat...");
        chatClient.disconnectUser();
      }
    };
  }, [chatClient]);

  const handleVideoCall = () => {
    if (!targetUser) {
      toast.error("Unable to start call. Target user not found.");
      return;
    }

    console.log('Starting video call with:', targetUser.fullName);
    initiateCall(targetUser, 'video');
  };

  const handleAudioCall = () => {
    if (!targetUser) {
      toast.error("Unable to start call. Target user not found.");
      return;
    }

    console.log('Starting audio call with:', targetUser.fullName);
    initiateCall(targetUser, 'audio');
  };

  const handleBackToHome = () => {
    // On mobile or when coming from chat, go back to chat list
    // Otherwise go to home
    const isMobile = window.innerWidth < 1024; // lg breakpoint
    if (isMobile) {
      navigate('/chat');
    } else {
      navigate('/');
    }
  };

  // Enhanced error state
  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-base-100 p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="p-4 rounded-full bg-error/10 w-fit mx-auto">
            <AlertCircle className="h-12 w-12 text-error" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-base-content">
              {error.includes("log in") ? "Authentication Required" : 
               error.includes("select a user") ? "No Chat Selected" : "Connection Failed"}
            </h2>
            <p className="text-base-content/70">{error}</p>
            {error.includes("log in") && (
              <p className="text-sm text-base-content/50">
                You'll be redirected to login shortly...
              </p>
            )}
            {error.includes("select a user") && (
              <p className="text-sm text-base-content/50">
                Choose a friend from your friends list to start a conversation
              </p>
            )}
          </div>
          <div className="flex gap-3 justify-center">
            {error.includes("select a user") && (
              <button 
                onClick={() => navigate('/friends')}
                className="btn btn-primary"
              >
                Browse Friends
              </button>
            )}
            {!error.includes("log in") && !error.includes("select a user") && (
              <button 
                onClick={() => window.location.reload()} 
                className="btn btn-primary"
              >
                Try Again
              </button>
            )}
            <button 
              onClick={handleBackToHome}
              className="btn btn-ghost"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced loading condition
  if (loading || tokenLoading || userLoading || !chatClient || !channel) {
    return <ChatLoader message={
      tokenLoading ? "Getting authentication..." :
      userLoading ? "Loading user information..." :
      loading ? "Connecting to chat..." :
      "Preparing chat interface..."
    } />;
  }

  return (
    <div className="h-screen flex flex-col bg-base-100">
      {/* Clean Header */}
      <div className="flex-shrink-0 bg-base-100 border-b border-base-300">
        <div className="flex items-center justify-between p-3 sm:p-4">
          {/* Back Button & User Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button 
              onClick={handleBackToHome}
              className="btn btn-ghost btn-sm btn-circle flex-shrink-0"
              title="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            
            {targetUser && (
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="avatar online">
                  <div className="w-10 h-10 rounded-full">
                    <img 
                      src={targetUser.profilePic} 
                      alt={targetUser.fullName}
                      className="object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/40/22c55e/ffffff?text=' + targetUser.fullName.charAt(0);
                      }}
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-base-content truncate text-sm sm:text-base">
                    {targetUser.fullName}
                  </h2>
                  <div className="flex items-center gap-2 text-xs">
                    {isConnected ? (
                      <>
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-success">Online</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                        <span className="text-warning">Connecting...</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <CallButton 
              handleVideoCall={handleVideoCall}
              handleAudioCall={handleAudioCall}
              disabled={!isConnected}
            />
          </div>
        </div>
      </div>

      {/* Clean Chat Interface */}
      <div className="flex-1 relative overflow-hidden">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;
