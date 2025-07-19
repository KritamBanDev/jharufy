import { BellIcon, Users, MessageCircle, Heart } from "lucide-react";

function NoNotificationsFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Animated bell icon with pulse effect */}
      <div className="relative mb-8">
        <div className="size-20 rounded-full bg-gradient-to-br from-base-300 to-base-200 flex items-center justify-center shadow-lg animate-pulse">
          <BellIcon className="size-10 text-base-content opacity-50" />
        </div>
        
        {/* Floating mini icons */}
        <div className="absolute -top-2 -right-2 size-8 rounded-full bg-primary/10 flex items-center justify-center animate-bounce">
          <Users className="size-4 text-primary" />
        </div>
        <div className="absolute -bottom-2 -left-2 size-8 rounded-full bg-secondary/10 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.5s' }}>
          <MessageCircle className="size-4 text-secondary" />
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-4 max-w-lg">
        <h3 className="text-2xl font-bold text-base-content">
          Your notification center is quiet
        </h3>
        <p className="text-base-content/70 text-lg leading-relaxed">
          When you receive friend requests, messages, or language exchange notifications, they'll appear here.
        </p>
        
        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-base-300">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-base-100/50">
            <Users className="size-6 text-primary" />
            <span className="text-sm font-medium">Friend Requests</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-base-100/50">
            <MessageCircle className="size-6 text-secondary" />
            <span className="text-sm font-medium">New Messages</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-base-100/50">
            <Heart className="size-6 text-accent" />
            <span className="text-sm font-medium">Connections</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoNotificationsFound;