import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchStatus } from "@shared/schema";
import { Clock, MapPin, Users } from "lucide-react";
import ScoreUpdateModal from "./score-update-modal";

export default function LiveMatches() {
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  
  const { data: liveMatches = [] } = useQuery({
    queryKey: ["/api/matches?live=true"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const getMatchStatusColor = (status: string) => {
    switch (status) {
      case MatchStatus.IN_PROGRESS:
        return "border-red-500 bg-red-50";
      case MatchStatus.SCHEDULED:
        return "border-yellow-500 bg-yellow-50";
      case MatchStatus.COMPLETED:
        return "border-[hsl(var(--approval-green))] bg-green-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case MatchStatus.IN_PROGRESS:
        return (
          <Badge className="bg-red-500 text-white">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></div>
            ĐANG DIỄN RA
          </Badge>
        );
      case MatchStatus.SCHEDULED:
        return <Badge className="bg-yellow-100 text-yellow-800">SẮP BẮT ĐẦU</Badge>;
      case MatchStatus.COMPLETED:
        return <Badge className="bg-[hsl(var(--approval-green))] text-white">KẾT THÚC</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreDisplay = (match: any) => {
    if (!match.score || !match.score.sets) return null;
    
    return match.score.sets.map((set: any, index: number) => (
      <span key={index} className="text-xs bg-white px-1 py-0.5 rounded shadow-sm mr-1">
        {set.player1}-{set.player2}
      </span>
    ));
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              Trận Đấu Trực Tiếp
              <div className="live-indicator ml-2"></div>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {liveMatches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Hiện tại không có trận đấu nào đang diễn ra</p>
              </div>
            ) : (
              liveMatches.map((match: any) => (
                <div
                  key={match.id}
                  className={`p-3 rounded-lg border-l-4 transition-all cursor-pointer hover:shadow-md ${getMatchStatusColor(match.status)}`}
                  onClick={() => setSelectedMatch(match)}
                >
                  <div className="flex justify-between items-center mb-2">
                    {getStatusBadge(match.status)}
                    <div className="flex items-center text-xs text-muted-foreground">
                      {match.court && (
                        <>
                          <MapPin className="h-3 w-3 mr-1" />
                          {match.court}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${
                        match.winnerId === match.player1Id ? "font-semibold text-[hsl(var(--sports-green))]" : ""
                      }`}>
                        VĐV #{match.player1Id}
                        {match.partner1Id && ` & VĐV #${match.partner1Id}`}
                      </span>
                      {match.status === MatchStatus.COMPLETED && match.score && (
                        <div className="flex space-x-1">
                          {getScoreDisplay(match)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${
                        match.winnerId === match.player2Id ? "font-semibold text-[hsl(var(--sports-green))]" : ""
                      }`}>
                        {match.player2Id ? (
                          <>
                            VĐV #{match.player2Id}
                            {match.partner2Id && ` & VĐV #${match.partner2Id}`}
                          </>
                        ) : (
                          "Chờ kết quả"
                        )}
                      </span>
                      {match.status === MatchStatus.IN_PROGRESS && match.score && (
                        <div className="flex space-x-1">
                          {getScoreDisplay(match)}
                        </div>
                      )}
                    </div>
                  </div>

                  {match.scheduledTime && (
                    <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      {formatTime(match.scheduledTime)}
                    </div>
                  )}

                  {match.status === MatchStatus.IN_PROGRESS && (
                    <Button 
                      size="sm" 
                      className="w-full mt-2 bg-[hsl(var(--competition-blue))] hover:bg-[hsl(var(--competition-blue))]/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMatch(match);
                      }}
                    >
                      Cập Nhật Tỷ Số
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Score Update Modal */}
      {selectedMatch && (
        <ScoreUpdateModal
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}
