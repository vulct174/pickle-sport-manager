import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertRegistrationSchema, UserRoles, Categories, RegistrationStatus } from "@shared/schema";
import { UserPlus, Award, Trophy } from "lucide-react";

interface AthleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AthleteRegistrationModal({ isOpen, onClose }: AthleteRegistrationModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    tournamentId: "",
    athleteId: "",
    category: "",
    partnerId: "",
    skillLevel: "",
    notes: "",
  });

  const { data: tournaments = [] } = useQuery({
    queryKey: ["/api/tournaments"],
  });

  const { data: athletes = [] } = useQuery({
    queryKey: ["/api/users?role=athlete"],
  });

  const activeTournaments = tournaments.filter((t: any) => 
    t.status === "registration" || t.status === "upcoming"
  );

  const categoryOptions = [
    { value: Categories.SINGLES_MEN, label: "Nam Đơn" },
    { value: Categories.SINGLES_WOMEN, label: "Nữ Đơn" },
    { value: Categories.DOUBLES_MEN, label: "Nam Đôi" },
    { value: Categories.DOUBLES_WOMEN, label: "Nữ Đôi" },
    { value: Categories.MIXED_DOUBLES, label: "Đôi Hỗn Hợp" },
  ];

  const skillLevels = ["2.0", "2.5", "3.0", "3.5", "4.0", "4.5", "5.0", "5.5"];

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/registrations", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/registrations"] });
      toast({
        title: "Đăng ký thành công",
        description: "Đăng ký tham gia giải đấu đã được gửi và đang chờ phê duyệt",
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra khi đăng ký",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      tournamentId: "",
      athleteId: "",
      category: "",
      partnerId: "",
      skillLevel: "",
      notes: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const registrationData = {
      tournamentId: parseInt(formData.tournamentId),
      athleteId: parseInt(formData.athleteId),
      category: formData.category,
      partnerId: formData.partnerId ? parseInt(formData.partnerId) : null,
      skillLevel: parseFloat(formData.skillLevel),
      status: RegistrationStatus.PENDING,
      notes: formData.notes,
    };

    try {
      insertRegistrationSchema.parse(registrationData);
      registerMutation.mutate(registrationData);
    } catch (error: any) {
      toast({
        title: "Dữ liệu không hợp lệ",
        description: error.message || "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      });
    }
  };

  const selectedTournament = tournaments.find((t: any) => t.id.toString() === formData.tournamentId);
  const isDoublesCategory = formData.category.includes("doubles");
  const availablePartners = athletes.filter((a: any) => a.id.toString() !== formData.athleteId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5 text-[hsl(var(--sports-green))]" />
            Đăng Ký Tham Gia Giải Đấu
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tournament Selection */}
          <div className="space-y-2">
            <Label htmlFor="tournament">Giải đấu *</Label>
            <Select value={formData.tournamentId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, tournamentId: value, category: "" }))
            }>
              <SelectTrigger>
                <Trophy className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn giải đấu" />
              </SelectTrigger>
              <SelectContent>
                {activeTournaments.map((tournament: any) => (
                  <SelectItem key={tournament.id} value={tournament.id.toString()}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Athlete Selection */}
          <div className="space-y-2">
            <Label htmlFor="athlete">Vận động viên *</Label>
            <Select value={formData.athleteId} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, athleteId: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Chọn vận động viên" />
              </SelectTrigger>
              <SelectContent>
                {athletes.map((athlete: any) => (
                  <SelectItem key={athlete.id} value={athlete.id.toString()}>
                    {athlete.fullName} - Cấp {athlete.skillLevel || "N/A"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">Hạng mục thi đấu *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, partnerId: "" }))}
              disabled={!selectedTournament}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn hạng mục" />
              </SelectTrigger>
              <SelectContent>
                {selectedTournament?.categories?.map((category: string) => {
                  const option = categoryOptions.find(opt => opt.value === category);
                  return option ? (
                    <SelectItem key={category} value={category}>
                      {option.label}
                    </SelectItem>
                  ) : null;
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Partner Selection for Doubles */}
          {isDoublesCategory && (
            <div className="space-y-2">
              <Label htmlFor="partner">Đồng đội (cho hạng mục đôi)</Label>
              <Select value={formData.partnerId} onValueChange={(value) => 
                setFormData(prev => ({ ...prev, partnerId: value }))
              }>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn đồng đội" />
                </SelectTrigger>
                <SelectContent>
                  {availablePartners.map((partner: any) => (
                    <SelectItem key={partner.id} value={partner.id.toString()}>
                      {partner.fullName} - Cấp {partner.skillLevel || "N/A"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Skill Level */}
          <div className="space-y-2">
            <Label htmlFor="skillLevel">Cấp độ kỹ năng *</Label>
            <Select value={formData.skillLevel} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, skillLevel: value }))
            }>
              <SelectTrigger>
                <Award className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chọn cấp độ" />
              </SelectTrigger>
              <SelectContent>
                {skillLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Thông tin bổ sung (tuỳ chọn)..."
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Đang đăng ký..." : "Đăng Ký"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
