import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import TournamentCard from "@/components/tournament/tournament-card";
import TournamentBracket from "@/components/tournament/tournament-bracket";
import CreateTournamentModal from "@/components/tournament/create-tournament-modal";
import { useAuth } from "@/lib/auth";
import { UserRoles, TournamentStatus } from "@shared/schema";
import { Plus, Search, Filter, Calendar, MapPin, Users } from "lucide-react";

export default function Tournaments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<any>(null);

  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const filteredTournaments = tournaments.filter((tournament: any) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tournament.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case TournamentStatus.ACTIVE:
        return <Badge className="bg-[hsl(var(--sports-green))] text-white">Đang Diễn Ra</Badge>;
      case TournamentStatus.REGISTRATION:
        return <Badge variant="outline" className="border-yellow-500 text-yellow-700">Đăng Ký</Badge>;
      case TournamentStatus.UPCOMING:
        return <Badge variant="outline">Sắp Diễn Ra</Badge>;
      case TournamentStatus.COMPLETED:
        return <Badge variant="secondary">Đã Kết Thúc</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
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
            <h1 className="text-2xl font-bold text-foreground">Quản Lý Giải Đấu</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Theo dõi và quản lý tất cả các giải đấu pickleball
            </p>
          </div>
          {(user?.role === UserRoles.ORGANIZER || user?.role === UserRoles.CLUB_OWNER) && (
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo Giải Đấu Mới
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
                  placeholder="Tìm kiếm giải đấu..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={TournamentStatus.ACTIVE}>Đang diễn ra</SelectItem>
                  <SelectItem value={TournamentStatus.REGISTRATION}>Đang đăng ký</SelectItem>
                  <SelectItem value={TournamentStatus.UPCOMING}>Sắp diễn ra</SelectItem>
                  <SelectItem value={TournamentStatus.COMPLETED}>Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Grid */}
      {selectedTournament ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setSelectedTournament(null)}>
              ← Quay lại danh sách
            </Button>
            <h2 className="text-xl font-semibold">{selectedTournament.name}</h2>
          </div>
          <TournamentBracket tournament={selectedTournament} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" 
                  ? "Không tìm thấy giải đấu nào phù hợp với bộ lọc"
                  : "Chưa có giải đấu nào được tạo"
                }
              </div>
            </div>
          ) : (
            filteredTournaments.map((tournament: any) => (
              <Card key={tournament.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    {getStatusBadge(tournament.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="mr-2 h-4 w-4" />
                      {tournament.location}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {tournament.currentParticipants}/{tournament.maxParticipants} VĐV
                    </div>

                    {tournament.categories && tournament.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {tournament.categories.slice(0, 3).map((category: string) => (
                          <Badge key={category} variant="outline" className="text-xs">
                            {category.replace(/_/g, " ")}
                          </Badge>
                        ))}
                        {tournament.categories.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{tournament.categories.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTournament(tournament)}
                      >
                        Xem Chi Tiết
                      </Button>
                      
                      {tournament.status === TournamentStatus.REGISTRATION && (
                        <Button 
                          size="sm"
                          className="bg-[hsl(var(--competition-blue))] hover:bg-[hsl(var(--competition-blue))]/90"
                        >
                          Đăng Ký
                        </Button>
                      )}
                      
                      {tournament.status === TournamentStatus.ACTIVE && (
                        <Button 
                          size="sm"
                          className="bg-[hsl(var(--championship-orange))] hover:bg-[hsl(var(--championship-orange))]/90"
                        >
                          Xem Trực Tiếp
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Create Tournament Modal */}
      <CreateTournamentModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </div>
  );
}
