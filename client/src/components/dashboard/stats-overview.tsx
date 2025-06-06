import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Calendar, Star } from "lucide-react";

interface StatsOverviewProps {
  stats?: {
    activeTournaments: number;
    registeredAthletes: number;
    todayMatches: number;
    averageRating: number;
  };
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: "Giải Đấu Đang Diễn Ra",
      value: stats.activeTournaments,
      icon: Trophy,
      color: "text-[hsl(var(--championship-orange))]",
      bgColor: "bg-orange-100",
    },
    {
      title: "Vận Động Viên Đăng Ký",
      value: stats.registeredAthletes,
      icon: Users,
      color: "text-[hsl(var(--competition-blue))]",
      bgColor: "bg-blue-100",
    },
    {
      title: "Trận Đấu Hôm Nay",
      value: stats.todayMatches,
      icon: Calendar,
      color: "text-[hsl(var(--sports-green))]",
      bgColor: "bg-green-100",
    },
    {
      title: "Đánh Giá Trung Bình",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-muted-foreground truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
