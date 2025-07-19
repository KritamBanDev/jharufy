import { Users, Globe, MessageSquare, Star, ArrowDown, Sparkles } from "lucide-react";

const NoFriendsFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="card bg-gradient-to-br from-base-200 to-base-300 p-12 text-center border border-base-300 shadow-xl w-full">
        {/* Icon with animation */}
        <div className="relative mb-8">
          <div className="size-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shadow-lg border-4 border-base-100">
            <Users className="size-12 text-primary animate-pulse" />
          </div>
          
          {/* Floating decorative icons */}
          <div className="absolute -top-2 -right-6 size-10 rounded-full bg-accent/20 flex items-center justify-center animate-bounce shadow-md">
            <Globe className="size-5 text-accent" />
          </div>
          <div className="absolute -bottom-2 -left-6 size-10 rounded-full bg-secondary/20 flex items-center justify-center animate-bounce shadow-md" style={{ animationDelay: '0.3s' }}>
            <MessageSquare className="size-5 text-secondary" />
          </div>
          <div className="absolute top-4 -left-8 size-8 rounded-full bg-primary/20 flex items-center justify-center animate-bounce" style={{ animationDelay: '0.6s' }}>
            <Sparkles className="size-4 text-primary" />
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-3xl text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ready to make language friends?
            </h3>
            <p className="text-lg text-base-content/80 leading-relaxed max-w-lg mx-auto">
              Connect with language partners and start practicing together to build meaningful connections across cultures!
            </p>
          </div>

          {/* Enhanced Benefits section */}
          <div className="bg-base-100/70 rounded-xl p-6 mt-8 shadow-inner border border-base-300/50">
            <h4 className="font-bold text-base text-base-content mb-5 flex items-center justify-center gap-2">
              <Star className="size-5 text-warning" />
              What you'll get
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col items-center justify-center gap-3 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors text-center">
                <div className="p-2 rounded-full bg-warning/20">
                  <Star className="size-4 text-warning" />
                </div>
                <span className="font-medium">Practice conversations</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors text-center">
                <div className="p-2 rounded-full bg-info/20">
                  <Globe className="size-4 text-info" />
                </div>
                <span className="font-medium">Cultural exchange</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors text-center">
                <div className="p-2 rounded-full bg-success/20">
                  <MessageSquare className="size-4 text-success" />
                </div>
                <span className="font-medium">Real-time chat</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-3 rounded-lg bg-base-200/50 hover:bg-base-200 transition-colors text-center">
                <div className="p-2 rounded-full bg-primary/20">
                  <Users className="size-4 text-primary" />
                </div>
                <span className="font-medium">Language community</span>
              </div>
            </div>
          </div>

          {/* Enhanced Call to action */}
          <div className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-3 text-primary font-semibold text-lg">
                <span>Discover new friends below</span>
                <div className="animate-bounce">
                  <ArrowDown className="size-6 text-primary" />
                </div>
              </div>
              <div className="text-sm text-base-content/60">
                Scroll down to see recommended language partners
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoFriendsFound;