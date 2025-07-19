import { TrendingUp, Users, Heart, MessageCircle } from 'lucide-react';

const StatusStats = ({ totalStatuses, totalReactions, totalComments, activeUsers }) => {
  const stats = [
    {
      label: 'Total Posts',
      value: totalStatuses || 0,
      icon: TrendingUp,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Active Users',
      value: activeUsers || 0,
      icon: Users,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Total Reactions',
      value: totalReactions || 0,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Total Comments',
      value: totalComments || 0,
      icon: MessageCircle,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-base-100 rounded-lg p-3 sm:p-4 shadow-sm border border-base-200">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-lg sm:text-2xl font-bold text-base-content truncate">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm text-base-content/60 truncate">{stat.label}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusStats;
