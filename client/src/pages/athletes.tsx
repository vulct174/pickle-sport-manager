import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AthleteRegistrationModal from "@/components/athlete/athlete-registration-modal";
import AthleteProfile from "@/components/athlete/athlete-profile";
import { useAuth } from "@/lib/auth";
import { UserRoles } from "@shared/schema";
import { Search, UserPlus, Phone, Mail, Award, TrendingUp } from "lucide-react";

export default function Athletes() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("all");
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);

  const { data: athletes = [], isLoading } = useQuery({
    queryKey: ["/api/users", { role: UserRoles.ATHLETE }],
    queryKey: ["/api/users?role=athlete"],
  });

  const filteredAthletes = athletes.filter((athlete: any) => {
    const matchesSearch = athlete.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkill = skillFilter === "all" || 
                        (athlete.skillLevel && athlete.skillLevel.toString() === skillFilter);
    
    return matchesSearch && matchesSkill;
  });

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quản Lý Vận Động Viên</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Theo dõi và quản lý thông tin vận động viên
            </p>
          </div>
          {(user?.role === UserRoles.ORGANIZER || user?.role === UserRoles.ASSESSOR) && (
            <Button 
              onClick={() => setShowRegistrationModal(true)}
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Đăng Ký VĐV Mới
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm vận động viên..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={skillFilter} onValueChange={setSkillFilter}>
                <SelectTrigger>
                  <Award className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Lọc theo cấp độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả cấp độ</SelectItem>
                  <SelectItem value="2.0">2.0</SelectItem>
                  <SelectItem value="2.5">2.5</SelectItem>
                  <SelectItem value="3.0">3.0</SelectItem>
                  <SelectItem value="3.5">3.5</SelectItem>
                  <SelectItem value="4.0">4.0</SelectItem>
                  <SelectItem value="4.5">4.5</SelectItem>
                  <SelectItem value="5.0">5.0</SelectItem>
                  <SelectItem value="5.5">5.5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Athletes Grid */}
      {selectedAthlete ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedAthlete(null)}>
              ← Quay lại danh sách
            </Button>
            <h2 className="text-xl font-semibold">{selectedAthlete.fullName}</h2>
          </div>
          <AthleteProfile athlete={selectedAthlete} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAthletes.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm || skillFilter !== "all" 
                  ? "Không tìm thấy vận động viên nào phù hợp với bộ lọc"
                  : "Chưa có vận động viên nào được đăng ký"
                }
              </div>
            </div>
          ) : (
            filteredAthletes.map((athlete: any) => (
              <Card key={athlete.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-[hsl(var(--sports-green))] text-white">
                        {getInitials(athlete.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{athlete.fullName}</CardTitle>
                      <p className="text-sm text-muted-foreground">@{athlete.username}</p>
                    </div>
                    {athlete.skillLevel && (
                      <Badge className={`skill-badge ${getSkillBadgeColor(athlete.skillLevel)}`}>
                        {athlete.skillLevel}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {athlete.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="mr-2 h-4 w-4" />
                        {athlete.email}
                      </div>
                    )}
                    
                    {athlete.phone && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="mr-2 h-4 w-4" />
                        {athlete.phone}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        <span>Hoạt động: {athlete.isActive ? "Có" : "Không"}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAthlete(athlete)}
                      >
                        Xem Chi Tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Registration Modal */}
      <AthleteRegistrationModal 
        isOpen={showRegistrationModal} 
        onClose={() => setShowRegistrationModal(false)} 
      />
    </div>
  );
}
