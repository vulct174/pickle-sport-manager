import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Star, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: leaderboard = [], isLoading } = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-orange-400" />;
      default:
        return <span className="text-sm font-medium text-muted-foreground">{position}</span>;
    }
  };

  const getSkillBadgeColor = (skillLevel: number) => {
    if (skillLevel >= 5.0) return "bg-[hsl(var(--sports-green))] text-white";
    if (skillLevel >= 4.0) return "bg-[hsl(var(--competition-blue))] text-white";
    if (skillLevel >= 3.0) return "bg-[hsl(var(--championship-orange))] text-white";
    return "bg-gray-500 text-white";
  };

  const getInitials = (fullName: string) => {
    return fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-96 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Bảng Xếp Hạng Vận Động Viên</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi thứ hạng và thành tích của các vận động viên pickleball
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Award className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Chọn hạng mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Hạng Mục</SelectItem>
                  <SelectItem value="singles_men">Nam Đơn</SelectItem>
                  <SelectItem value="singles_women">Nữ Đơn</SelectItem>
                  <SelectItem value="doubles_men">Nam Đôi</SelectItem>
                  <SelectItem value="doubles_women">Nữ Đôi</SelectItem>
                  <SelectItem value="mixed_doubles">Đôi Hỗn Hợp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="text-sm text-muted-foreground">
              Tổng cộng: {leaderboard.length} vận động viên
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Podium */}
      {leaderboard.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Second Place */}
          <Card className="order-2 md:order-1">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-8 w-8 text-gray-400" />
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarFallback className="bg-[hsl(var(--competition-blue))] text-white text-lg">
                  {getInitials(leaderboard[1].fullName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{leaderboard[1].fullName}</h3>
              <Badge className={`mt-2 ${getSkillBadgeColor(leaderboard[1].skillLevel || 0)}`}>
                {leaderboard[1].skillLevel}
              </Badge>
              <div className="mt-4 space-y-2">
                <div className="text-2xl font-bold text-[hsl(var(--competition-blue))]">
                  {leaderboard[1].totalPoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">điểm</div>
                <div className="text-sm">
                  <span className="font-medium">{leaderboard[1].wins || 0}</span> thắng
                  <span className="mx-2">•</span>
                  <span className="font-medium">{leaderboard[1].winRate || 0}%</span> tỷ lệ thắng
                </div>
              </div>
            </CardContent>
          </Card>

          {/* First Place */}
          <Card className="order-1 md:order-2 border-[hsl(var(--sports-green))] shadow-lg">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Trophy className="h-10 w-10 text-yellow-500" />
              </div>
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-[hsl(var(--sports-green))] text-white text-xl">
                  {getInitials(leaderboard[0].fullName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-xl">{leaderboard[0].fullName}</h3>
              <Badge className={`mt-2 ${getSkillBadgeColor(leaderboard[0].skillLevel || 0)}`}>
                {leaderboard[0].skillLevel}
              </Badge>
              <div className="mt-4 space-y-2">
                <div className="text-3xl font-bold text-[hsl(var(--sports-green))]">
                  {leaderboard[0].totalPoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">điểm</div>
                <div className="text-sm">
                  <span className="font-medium">{leaderboard[0].wins || 0}</span> thắng
                  <span className="mx-2">•</span>
                  <span className="font-medium">{leaderboard[0].winRate || 0}%</span> tỷ lệ thắng
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Third Place */}
          <Card className="order-3">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <Medal className="h-8 w-8 text-orange-400" />
              </div>
              <Avatar className="h-16 w-16 mx-auto mb-4">
                <AvatarFallback className="bg-[hsl(var(--championship-orange))] text-white text-lg">
                  {getInitials(leaderboard[2].fullName)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{leaderboard[2].fullName}</h3>
              <Badge className={`mt-2 ${getSkillBadgeColor(leaderboard[2].skillLevel || 0)}`}>
                {leaderboard[2].skillLevel}
              </Badge>
              <div className="mt-4 space-y-2">
                <div className="text-2xl font-bold text-[hsl(var(--championship-orange))]">
                  {leaderboard[2].totalPoints || 0}
                </div>
                <div className="text-sm text-muted-foreground">điểm</div>
                <div className="text-sm">
                  <span className="font-medium">{leaderboard[2].wins || 0}</span> thắng
                  <span className="mx-2">•</span>
                  <span className="font-medium">{leaderboard[2].winRate || 0}%</span> tỷ lệ thắng
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle>Bảng Xếp Hạng Chi Tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Hạng</TableHead>
                  <TableHead>Vận Động Viên</TableHead>
                  <TableHead>Cấp Độ</TableHead>
                  <TableHead className="text-center">Điểm</TableHead>
                  <TableHead className="text-center">Giải Thắng</TableHead>
                  <TableHead className="text-center">Tỷ Lệ Thắng</TableHead>
                  <TableHead className="text-center">Hoạt Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Chưa có dữ liệu xếp hạng
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboard.map((athlete: any, index: number) => (
                    <TableRow key={athlete.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {getPositionIcon(index + 1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-[hsl(var(--sports-green))] text-white text-sm">
                              {getInitials(athlete.fullName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{athlete.fullName}</div>
                            <div className="text-sm text-muted-foreground">
                              {athlete.clubId ? `CLB #${athlete.clubId}` : "Độc lập"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {athlete.skillLevel && (
                          <Badge className={`skill-badge ${getSkillBadgeColor(athlete.skillLevel)}`}>
                            {athlete.skillLevel}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-medium">
                        {athlete.totalPoints || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        {athlete.wins || 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <div className="win-rate-bar">
                            <div 
                              className="win-rate-fill" 
                              style={{ width: `${athlete.winRate || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{athlete.winRate || 0}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {athlete.isActive ? (
                          <div className="flex items-center justify-center">
                            <div className="w-2 h-2 bg-[hsl(var(--approval-green))] rounded-full"></div>
                            <span className="ml-2 text-sm">Hoạt động</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span className="ml-2 text-sm">Không hoạt động</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
