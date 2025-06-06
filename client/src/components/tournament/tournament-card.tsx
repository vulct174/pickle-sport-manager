import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Edit, Eye, Settings } from "lucide-react";
import { TournamentStatus } from "@shared/schema";

interface TournamentCardProps {
  tournament: any;
  showActions?: boolean;
}

export default function TournamentCard({ tournament, showActions = true }: TournamentCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case TournamentStatus.ACTIVE:
        return <Badge className="bg-[hsl(var(--sports-green))] text-white">Đang Diễn Ra</Badge>;
      case TournamentStatus.REGISTRATION:
        return <Badge className="bg-yellow-100 text-yellow-800">Đăng Ký</Badge>;
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

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h4 className="text-md font-medium text-foreground mr-2">{tournament.name}</h4>
            {getStatusBadge(tournament.status)}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-2 h-4 w-4" />
              {tournament.location}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              {formatDateRange(tournament.startDate, tournament.endDate)}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Users className="mr-2 h-4 w-4" />
              <span>{tournament.currentParticipants}/{tournament.maxParticipants} VĐV</span>
            </div>
          </div>

          {tournament.categories && tournament.categories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
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
        </div>
        
        {showActions && (
          <div className="flex items-center space-x-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[hsl(var(--competition-blue))]/10"
            >
              <Edit className="h-4 w-4 text-[hsl(var(--competition-blue))]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[hsl(var(--sports-green))]/10"
            >
              <Eye className="h-4 w-4 text-[hsl(var(--sports-green))]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-[hsl(var(--championship-orange))]/10"
            >
              <Settings className="h-4 w-4 text-[hsl(var(--championship-orange))]" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
