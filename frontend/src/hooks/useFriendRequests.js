import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sendFriendRequest, getOutgoingFriendRequests, getFriendRequests, acceptFriendRequest, cancelFriendRequest } from '../lib/api';
import toast from 'react-hot-toast';

export const useFriendRequests = () => {
  const queryClient = useQueryClient();

  // Get outgoing friend requests (requests I sent)
  const { data: outgoingRequests = [] } = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: getOutgoingFriendRequests,
  });

  // Get incoming friend requests (requests sent to me)
  const { data: incomingRequests = [] } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  // Send friend request mutation
  const { mutate: sendRequest, isPending: isSending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      toast.success('Friend request sent!');
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to send friend request';
      toast.error(errorMessage);
    },
  });

  // Accept friend request mutation
  const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      toast.success('Friend request accepted!');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to accept friend request';
      toast.error(errorMessage);
    },
  });

  // Cancel/Decline friend request mutation
  const { mutate: cancelRequest, isPending: isCanceling } = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      toast.success('Friend request cancelled');
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['recommendedUsers'] });
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'Failed to cancel friend request';
      toast.error(errorMessage);
    },
  });

  // Helper function to check request status for a specific user
  const getRequestStatus = (userId) => {
    // Ensure arrays exist and are actually arrays
    const safeOutgoingRequests = Array.isArray(outgoingRequests) ? outgoingRequests : [];
    const safeIncomingRequests = Array.isArray(incomingRequests) ? incomingRequests : [];
    
    // Check if I sent a request to this user
    const outgoingRequest = safeOutgoingRequests.find(
      request => request.recipient?._id === userId || request.recipient === userId
    );
    
    if (outgoingRequest) {
      return {
        status: 'sent',
        requestId: outgoingRequest._id,
        isPending: outgoingRequest.status === 'pending'
      };
    }

    // Check if this user sent me a request
    const incomingRequest = safeIncomingRequests.find(
      request => request.sender?._id === userId || request.sender === userId
    );
    
    if (incomingRequest) {
      return {
        status: 'received',
        requestId: incomingRequest._id,
        isPending: incomingRequest.status === 'pending'
      };
    }

    return {
      status: 'none',
      requestId: null,
      isPending: false
    };
  };

  return {
    sendRequest,
    isSending,
    acceptRequest,
    isAccepting,
    cancelRequest,
    isCanceling,
    getRequestStatus,
    outgoingRequests,
    incomingRequests,
  };
};
