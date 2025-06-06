import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trophy, Clock, MapPin } from "lucide-react";
import { Categories, MatchStatus } from "@shared/schema";
import ScoreUpdateModal from "@/components/matches/score-update-modal";

interface TournamentBracketProps {
  tournament: any;
}

export default function TournamentBracket({ tournament }: TournamentBracketProps) {
  const [selectedCategory, setSelectedCategory] = useState(Categories.SINGLES_MEN);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);

  const { data: matches = [] } = useQuery({
    queryKey: [`/api/matches?tournament_id=${tournament.id}`],
  });

  const categoryMatches = matches.filter((match: any) => match.category === selectedCategory);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case Categories.SINGLES_MEN:
        return "Nam Đơn";
      case Categories.SINGLES_WOMEN:
        return "Nữ Đơn";
      case Categories.DOUBLES_MEN:
        return "Nam Đôi";
      case Categories.DOUBLES_WOMEN:
        return "Nữ Đôi";
      case Categories.MIXED_DOUBLES:
        return "Đôi Hỗn Hợp";
      default:
        return category.replace(/_/g, " ");
    }
  };

  const getRoundDisplayName = (round: string) => {
    switch (round) {
      case "round_of_32":
        return "Vòng 1/32";
      case "round_of_16":
        return "Vòng 1/16";
      case "quarterfinals":
        return "Tứ Kết";
      case "semifinals":
        return "Bán Kết";
      case "finals":
        return "Chung Kết";
      default:
        return round;
    }
  };

  const getMatchStatusBadge = (status: string) => {
    switch (status) {
      case MatchStatus.IN_PROGRESS:
        return <Badge className="bg-red-500 text-white">Đang đấu</Badge>;
      case MatchStatus.COMPLETED:
        return <Badge className="bg-[hsl(var(--approval-green))] text-white">Kết thúc</Badge>;
      case MatchStatus.SCHEDULED:
        return <Badge variant="outline">Đã lên lịch</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const getScoreDisplay = (match: any) => {
    if (!match.score || !match.score.sets) return null;
    
    return match.score.sets.map((set: any, index: number) => (
      <span key={index} className="text-xs bg-gray-100 px-1 rounded">
        {set.player1}-{set.player2}
      </span>
    ));
  };

  const groupedMatches = categoryMatches.reduce((acc: any, match: any) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {});

  const rounds = ["round_of_16", "quarterfinals", "semifinals", "finals"];
  const availableRounds = rounds.filter(round => groupedMatches[round]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Bảng Đấu - {tournament.name}</CardTitle>
          <div className="flex space-x-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tournament.categories?.map((category: string) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryDisplayName(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm"
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
            >
              Cập Nhật
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {availableRounds.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Chưa có lịch thi đấu cho hạng mục này</p>
          </div>
        ) : (
          <div className="tournament-bracket">
            <div className="flex justify-between items-start space-x-8 min-w-full overflow-x-auto pb-4">
              {availableRounds.map((round, roundIndex) => (
                <div key={round} className="flex-shrink-0 text-center min-w-[240px]">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    {getRoundDisplayName(round)}
                  </h4>
                  <div className="space-y-8">
                    {groupedMatches[round].map((match: any) => (
                      <Card 
                        key={match.id} 
                        className={`match-card cursor-pointer transition-all ${
                          match.status === MatchStatus.IN_PROGRESS 
                            ? "border-red-500 bg-red-50" 
                            : match.status === MatchStatus.COMPLETED
                            ? "border-[hsl(var(--approval-green))] bg-green-50"
                            : "border-[hsl(var(--competition-blue))] bg-blue-50"
                        }`}
                        onClick={() => setSelectedMatch(match)}
                      >
                        <CardContent className="p-3">
                          <div className="space-y-2">
                            <div className="flex justify-between items-center mb-2">
                              {getMatchStatusBadge(match.status)}
                              {match.court && (
                                <span className="text-xs text-muted-foreground">
                                  {match.court}
                                </span>
                              )}
                            </div>
                            
                            {/* Player 1 */}
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${
                                match.winnerId === match.player1Id ? "font-semibold text-[hsl(var(--sports-green))]" : ""
                              }`}>
                                VĐV #{match.player1Id}
                              </span>
                              {match.status === MatchStatus.COMPLETED && match.score && (
                                <div className="flex space-x-1">
                                  {getScoreDisplay(match)}
                                </div>
                              )}
                            </div>
                            
                            {/* Player 2 */}
                            <div className="flex justify-between items-center">
                              <span className={`text-sm ${
                                match.winnerId === match.player2Id ? "font-semibold text-[hsl(var(--sports-green))]" : ""
                              }`}>
                                {match.player2Id ? `VĐV #${match.player2Id}` : "Chờ kết quả"}
                              </span>
                              {match.status === MatchStatus.IN_PROGRESS && match.score && (
                                <div className="flex space-x-1">
                                  {getScoreDisplay(match)}
                                </div>
                              )}
                            </div>

                            {/* Match info */}
                            {match.scheduledTime && (
                              <div className="flex items-center justify-center mt-2 text-xs text-muted-foreground">
                                <Clock className="mr-1 h-3 w-3" />
                                {formatDate(match.scheduledTime)} - {formatTime(match.scheduledTime)}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Finals Winner */}
              {groupedMatches.finals && groupedMatches.finals[0]?.winnerId && (
                <div className="flex-shrink-0 text-center min-w-[200px]">
                  <h4 className="text-sm font-medium text-muted-foreground mb-4">
                    Vô Địch
                  </h4>
                  <Card className="bg-yellow-50 border-[hsl(var(--championship-orange))]">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 text-[hsl(var(--championship-orange))] mx-auto mb-2" />
                      <div className="font-semibold text-[hsl(var(--championship-orange))]">
                        VĐV #{groupedMatches.finals[0].winnerId}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Nhà Vô Địch
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      {/* Score Update Modal */}
      {selectedMatch && (
        <ScoreUpdateModal
          match={selectedMatch}
          isOpen={!!selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </Card>
  );
}
