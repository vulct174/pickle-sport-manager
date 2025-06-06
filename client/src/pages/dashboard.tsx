import { useQuery } from "@tanstack/react-query";
import StatsOverview from "@/components/dashboard/stats-overview";
import TournamentCard from "@/components/tournament/tournament-card";
import LiveMatches from "@/components/matches/live-matches";
import QuickActions from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { UserRoles } from "@shared/schema";
import { Plus, Users, Calendar, BarChart3, Settings } from "lucide-react";
import { useState } from "react";
import CreateTournamentModal from "@/components/tournament/create-tournament-modal";
import AthleteRegistrationModal from "@/components/athlete/athlete-registration-modal";

export default function Dashboard() {
  const { user } = useAuth();
  const [showCreateTournament, setShowCreateTournament] = useState(false);
  const [showAthleteRegistration, setShowAthleteRegistration] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: pendingRegistrations = [] } = useQuery({
    queryKey: ["/api/registrations?status=pending"],
  });

  const activeTournaments = tournaments.filter((t: any) => t.status === "active");
  const upcomingTournaments = tournaments.filter((t: any) => t.status === "registration" || t.status === "upcoming");

  const getDashboardTitle = () => {
    switch (user?.role) {
      case UserRoles.ORGANIZER:
        return "Bảng Điều Khiển Tổ Chức Giải Đấu";
      case UserRoles.REFEREE:
        return "Bảng Điều Khiển Trọng Tài";
      case UserRoles.ATHLETE:
        return "Bảng Điều Khiển Vận Động Viên";
      case UserRoles.ASSESSOR:
        return "Bảng Điều Khiển Đánh Giá";
      case UserRoles.CLUB_OWNER:
        return "Bảng Điều Khiển Câu Lạc Bộ";
      default:
        return "Bảng Điều Khiển";
    }
  };

  const getDashboardDescription = () => {
    switch (user?.role) {
      case UserRoles.ORGANIZER:
        return "Quản lý toàn bộ hệ thống giải đấu pickleball";
      case UserRoles.REFEREE:
        return "Quản lý các trận đấu và cập nhật tỷ số";
      case UserRoles.ATHLETE:
        return "Theo dõi các giải đấu và thành tích của bạn";
      case UserRoles.ASSESSOR:
        return "Đánh giá kỹ năng và phê duyệt cấp độ vận động viên";
      case UserRoles.CLUB_OWNER:
        return "Quản lý câu lạc bộ và thành viên";
      default:
        return "Hệ thống quản lý giải đấu pickleball";
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Dashboard Header */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{getDashboardTitle()}</h1>
                <p className="mt-1 text-sm text-muted-foreground">{getDashboardDescription()}</p>
              </div>
              <div className="flex space-x-4">
                {(user?.role === UserRoles.ORGANIZER || user?.role === UserRoles.CLUB_OWNER) && (
                  <Button 
                    onClick={() => setShowCreateTournament(true)}
                    className="bg-[hsl(var(--competition-blue))] hover:bg-[hsl(var(--competition-blue))]/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tạo Giải Đấu Mới
                  </Button>
                )}
                {(user?.role === UserRoles.ORGANIZER || user?.role === UserRoles.ASSESSOR) && (
                  <Button 
                    onClick={() => setShowAthleteRegistration(true)}
                    className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Quản Lý VĐV
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tournament Management Section */}
        <div className="lg:col-span-2">
          {/* Active Tournaments */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Giải Đấu Đang Diễn Ra</CardTitle>
                <Button variant="outline" size="sm">
                  Xem Tất Cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTournaments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hiện tại không có giải đấu nào đang diễn ra
                  </div>
                ) : (
                  activeTournaments.map((tournament: any) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Tournaments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Giải Đấu Sắp Tới</CardTitle>
                <Button variant="outline" size="sm">
                  Xem Tất Cả
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTournaments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Hiện tại không có giải đấu nào sắp tới
                  </div>
                ) : (
                  upcomingTournaments.slice(0, 3).map((tournament: any) => (
                    <TournamentCard key={tournament.id} tournament={tournament} />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          {/* Live Matches */}
          <LiveMatches />

          {/* Pending Registrations - Only for organizers and assessors */}
          {(user?.role === UserRoles.ORGANIZER || user?.role === UserRoles.ASSESSOR) && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Đăng Ký Mới</CardTitle>
                  {pendingRegistrations.length > 0 && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      {pendingRegistrations.length} chờ duyệt
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pendingRegistrations.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Không có đăng ký nào cần duyệt
                    </div>
                  ) : (
                    pendingRegistrations.slice(0, 5).map((registration: any) => (
                      <div key={registration.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <div className="text-sm font-medium">Đăng ký #{registration.id}</div>
                          <div className="text-xs text-muted-foreground">
                            Cấp độ: {registration.skillLevel} • {registration.category}
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            ✓
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {pendingRegistrations.length > 5 && (
                  <Button variant="outline" className="w-full mt-4">
                    Xem Tất Cả Đăng Ký
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <QuickActions userRole={user?.role} />
        </div>
      </div>

      {/* Modals */}
      <CreateTournamentModal 
        isOpen={showCreateTournament} 
        onClose={() => setShowCreateTournament(false)} 
      />
      <AthleteRegistrationModal 
        isOpen={showAthleteRegistration} 
        onClose={() => setShowAthleteRegistration(false)} 
      />
    </div>
  );
}
