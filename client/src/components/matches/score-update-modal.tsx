import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MatchStatus } from "@shared/schema";
import { Trophy, Clock, Users } from "lucide-react";

interface ScoreUpdateModalProps {
  match: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreUpdateModal({ match, isOpen, onClose }: ScoreUpdateModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [sets, setSets] = useState([
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 },
    { player1: 0, player2: 0 }, // Best of 3 sets
  ]);
  const [matchStatus, setMatchStatus] = useState(match.status);
  const [winner, setWinner] = useState<number | null>(null);

  useEffect(() => {
    // Initialize with existing score if available
    if (match.score && match.score.sets) {
      setSets(prev => {
        const newSets = [...prev];
        match.score.sets.forEach((set: any, index: number) => {
          if (index < newSets.length) {
            newSets[index] = { player1: set.player1, player2: set.player2 };
          }
        });
        return newSets;
      });
    }
    if (match.score && match.score.winner) {
      setWinner(match.score.winner);
    }
  }, [match]);

  const updateScoreMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/matches/${match.id}/score`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/matches"] });
      toast({
        title: "Cập nhật tỷ số thành công",
        description: "Tỷ số trận đấu đã được cập nhật",
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Cập nhật tỷ số thất bại",
        description: error.message || "Có lỗi xảy ra khi cập nhật tỷ số",
        variant: "destructive",
      });
    },
  });

  const handleSetScoreChange = (setIndex: number, player: 'player1' | 'player2', value: string) => {
    const numValue = Math.max(0, Math.min(11, parseInt(value) || 0));
    setSets(prev => {
      const newSets = [...prev];
      newSets[setIndex] = { ...newSets[setIndex], [player]: numValue };
      return newSets;
    });
  };

  const determineWinner = () => {
    const player1Sets = sets.filter(set => set.player1 > set.player2 && (set.player1 >= 11 || set.player2 >= 11)).length;
    const player2Sets = sets.filter(set => set.player2 > set.player1 && (set.player1 >= 11 || set.player2 >= 11)).length;
    
    if (player1Sets >= 2) return 1;
    if (player2Sets >= 2) return 2;
    return null;
  };

  const isValidScore = (set: any) => {
    const { player1, player2 } = set;
    if (player1 < 11 && player2 < 11) return true; // Game in progress
    if (player1 >= 11 || player2 >= 11) {
      if (Math.abs(player1 - player2) >= 2) return true;
    }
    return false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate scores
    const validSets = sets.filter(set => set.player1 > 0 || set.player2 > 0);
    if (validSets.length === 0) {
      toast({
        title: "Tỷ số không hợp lệ",
        description: "Vui lòng nhập tỷ số ít nhất một set",
        variant: "destructive",
      });
      return;
    }

    const isGameComplete = matchStatus === MatchStatus.COMPLETED;
    const gameWinner = isGameComplete ? determineWinner() : null;

    const scoreData = {
      score: {
        sets: validSets,
        winner: gameWinner,
      },
      status: matchStatus,
    };

    updateScoreMutation.mutate(scoreData);
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-[hsl(var(--championship-orange))]" />
            Cập Nhật Tỷ Số
          </DialogTitle>
        </DialogHeader>
        
        {/* Match Info */}
        <div className="space-y-3 pb-4 border-b">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{match.category?.replace(/_/g, " ")}</Badge>
            {match.court && (
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-1 h-4 w-4" />
                {match.court}
              </div>
            )}
          </div>
          
          {match.scheduledTime && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              {formatTime(match.scheduledTime)}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Players */}
          <div className="space-y-2">
            <div className="font-medium">VĐV #{match.player1Id} vs VĐV #{match.player2Id}</div>
          </div>

          {/* Sets Scores */}
          <div className="space-y-4">
            <Label>Tỷ số các set</Label>
            {sets.map((set, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium w-12">Set {index + 1}:</span>
                <Input
                  type="number"
                  min="0"
                  max="15"
                  value={set.player1}
                  onChange={(e) => handleSetScoreChange(index, 'player1', e.target.value)}
                  className="w-16 text-center"
                  placeholder="0"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  min="0"
                  max="15"
                  value={set.player2}
                  onChange={(e) => handleSetScoreChange(index, 'player2', e.target.value)}
                  className="w-16 text-center"
                  placeholder="0"
                />
                {!isValidScore(set) && (set.player1 > 0 || set.player2 > 0) && (
                  <span className="text-xs text-red-500">Không hợp lệ</span>
                )}
              </div>
            ))}
          </div>

          {/* Match Status */}
          <div className="space-y-2">
            <Label>Trạng thái trận đấu</Label>
            <Select value={matchStatus} onValueChange={setMatchStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={MatchStatus.IN_PROGRESS}>Đang diễn ra</SelectItem>
                <SelectItem value={MatchStatus.COMPLETED}>Kết thúc</SelectItem>
                <SelectItem value={MatchStatus.CANCELLED}>Hủy bỏ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Winner Display */}
          {matchStatus === MatchStatus.COMPLETED && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm text-green-800">
                {determineWinner() === 1 ? (
                  <span className="font-medium">🏆 VĐV #{match.player1Id} thắng</span>
                ) : determineWinner() === 2 ? (
                  <span className="font-medium">🏆 VĐV #{match.player2Id} thắng</span>
                ) : (
                  <span className="text-yellow-700">Chưa xác định được người thắng</span>
                )}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
              disabled={updateScoreMutation.isPending}
            >
              {updateScoreMutation.isPending ? "Đang cập nhật..." : "Cập Nhật"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
