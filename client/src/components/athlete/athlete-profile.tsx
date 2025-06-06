import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Trophy, 
  Calendar, 
  TrendingUp,
  Star,
  Target,
  Clock
} from "lucide-react";

interface AthleteProfileProps {
  athlete: any;
}

export default function AthleteProfile({ athlete }: AthleteProfileProps) {
  const { data: registrations = [] } = useQuery({
    queryKey: [`/api/registrations?athlete_id=${athlete.id}`],
  });

  const { data: achievements = [] } = useQuery({
    queryKey: [`/api/achievements/${athlete.id}`],
  });

  const getInitials = (fullName: string) => {
    return fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  };

  const getSkillBadgeColor = (skillLevel: number) => {
    if (skillLevel >= 5.0) return "bg-[hsl(var(--sports-green))] text-white";
    if (skillLevel >= 4.0) return "bg-[hsl(var(--competition-blue))] text-white";
    if (skillLevel >= 3.0) return "bg-[hsl(var(--championship-orange))] text-white";
    return "bg-gray-500 text-white";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-[hsl(var(--approval-green))] text-white">Được duyệt</Badge>;
      case "pending":
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Chờ duyệt</Badge>;
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const totalRegistrations = registrations.length;
  const approvedRegistrations = registrations.filter((r: any) => r.status === "approved").length;
  const totalAchievements = achievements.length;
  const totalPoints = achievements.reduce((sum: number, achievement: any) => sum + (achievement.points || 0), 0);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="bg-[hsl(var(--sports-green))] text-white text-2xl">
                {getInitials(athlete.fullName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{athlete.fullName}</h2>
                  <p className="text-muted-foreground">@{athlete.username}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {athlete.skillLevel && (
                    <Badge className={`skill-badge ${getSkillBadgeColor(athlete.skillLevel)}`}>
                      Cấp độ {athlete.skillLevel}
                    </Badge>
                  )}
                  <Badge variant={athlete.isActive ? "default" : "secondary"}>
                    {athlete.isActive ? "Hoạt động" : "Không hoạt động"}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {athlete.email}
                </div>
                {athlete.phone && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="mr-2 h-4 w-4" />
                    {athlete.phone}
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tham gia: {formatDate(athlete.createdAt)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-[hsl(var(--sports-green))] mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalAchievements}</p>
                <p className="text-sm text-muted-foreground">Thành tích</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-[hsl(var(--championship-orange))] mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalPoints}</p>
                <p className="text-sm text-muted-foreground">Tổng điểm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-[hsl(var(--competition-blue))] mr-3" />
              <div>
                <p className="text-2xl font-bold">{approvedRegistrations}</p>
                <p className="text-sm text-muted-foreground">Giải đã tham gia</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-gray-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{totalRegistrations}</p>
                <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="registrations" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="registrations">Lịch sử đăng ký</TabsTrigger>
          <TabsTrigger value="achievements">Thành tích & Giải thưởng</TabsTrigger>
        </TabsList>
        
        <TabsContent value="registrations">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Sử Đăng Ký Giải Đấu</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chưa có đăng ký giải đấu nào
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giải đấu</TableHead>
                      <TableHead>Hạng mục</TableHead>
                      <TableHead>Cấp độ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration: any) => (
                      <TableRow key={registration.id}>
                        <TableCell className="font-medium">
                          Giải #{registration.tournamentId}
                        </TableCell>
                        <TableCell>
                          {registration.category.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>
                          <Badge className={getSkillBadgeColor(registration.skillLevel)}>
                            {registration.skillLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(registration.status)}
                        </TableCell>
                        <TableCell>
                          {formatDate(registration.registeredAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="achievements">
          <Card>
            <CardHeader>
              <CardTitle>Thành Tích & Giải Thưởng</CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Chưa có thành tích nào</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Giải đấu</TableHead>
                      <TableHead>Hạng mục</TableHead>
                      <TableHead>Thứ hạng</TableHead>
                      <TableHead>Điểm</TableHead>
                      <TableHead>Ngày đạt được</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {achievements.map((achievement: any) => (
                      <TableRow key={achievement.id}>
                        <TableCell className="font-medium">
                          Giải #{achievement.tournamentId}
                        </TableCell>
                        <TableCell>
                          {achievement.category.replace(/_/g, " ")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {achievement.position === 1 && <Trophy className="h-4 w-4 text-yellow-500 mr-1" />}
                            {achievement.position === 2 && <Award className="h-4 w-4 text-gray-400 mr-1" />}
                            {achievement.position === 3 && <Award className="h-4 w-4 text-orange-400 mr-1" />}
                            <span>#{achievement.position}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">+{achievement.points || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          {formatDate(achievement.awardedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
