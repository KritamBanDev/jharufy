import { UserPlusIcon, ClockIcon, CheckIcon, XIcon } from 'lucide-react';
import Button from './Button';
import { useFriendRequests } from '../hooks/useFriendRequests';

const FriendRequestButton = ({ userId, className = "" }) => {
  const { sendRequest, acceptRequest, cancelRequest, isSending, isAccepting, isCanceling, getRequestStatus } = useFriendRequests();
  
  const requestStatus = getRequestStatus(userId);

  const handleSendRequest = () => {
    sendRequest(userId);
  };

  const handleAcceptRequest = () => {
    acceptRequest(requestStatus.requestId);
  };

  const handleCancelRequest = () => {
    cancelRequest(requestStatus.requestId);
  };

  // Render different button states based on request status
  const renderButton = () => {
    switch (requestStatus.status) {
      case 'sent':
        return (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              icon={ClockIcon}
              disabled={true}
              className={`border border-orange-500 text-orange-600 hover:bg-orange-50 flex-1 ${className}`}
            >
              Pending
            </Button>
            <Button
              onClick={handleCancelRequest}
              variant="ghost"
              size="sm"
              icon={XIcon}
              isLoading={isCanceling}
              disabled={isCanceling}
              className="border border-red-500 text-red-600 hover:bg-red-50 w-8 h-8 p-0"
              title="Cancel Request"
            />
          </div>
        );

      case 'received':
        return (
          <div className="flex gap-1">
            <Button
              onClick={handleAcceptRequest}
              variant="success"
              size="sm"
              icon={CheckIcon}
              isLoading={isAccepting}
              disabled={isAccepting}
              className={`flex-1 ${className}`}
              title="Accept Request"
            >
              {isAccepting ? 'Accepting...' : 'Accept'}
            </Button>
            <Button
              onClick={handleCancelRequest}
              variant="ghost"
              size="sm"
              icon={XIcon}
              isLoading={isCanceling}
              disabled={isCanceling}
              className="border border-red-500 text-red-600 hover:bg-red-50 w-8 h-8 p-0"
              title="Decline Request"
            />
          </div>
        );

      case 'none':
      default:
        return (
          <Button
            onClick={handleSendRequest}
            variant="primary"
            size="sm"
            icon={UserPlusIcon}
            isLoading={isSending}
            disabled={isSending}
            className={className}
          >
            {isSending ? 'Sending...' : 'Connect'}
          </Button>
        );
    }
  };

  return renderButton();
};

export default FriendRequestButton;
