import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { insertTournamentSchema, Categories, TournamentStatus } from "@shared/schema";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";

interface CreateTournamentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTournamentModal({ isOpen, onClose }: CreateTournamentModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    registrationStartDate: "",
    registrationEndDate: "",
    maxParticipants: 100,
    categories: [] as string[],
    status: TournamentStatus.UPCOMING,
  });

  const categoryOptions = [
    { value: Categories.SINGLES_MEN, label: "Nam Đơn" },
    { value: Categories.SINGLES_WOMEN, label: "Nữ Đơn" },
    { value: Categories.DOUBLES_MEN, label: "Nam Đôi" },
    { value: Categories.DOUBLES_WOMEN, label: "Nữ Đôi" },
    { value: Categories.MIXED_DOUBLES, label: "Đôi Hỗn Hợp" },
  ];

  const createTournamentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/tournaments", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tournaments"] });
      toast({
        title: "Tạo giải đấu thành công",
        description: "Giải đấu mới đã được tạo và sẵn sàng nhận đăng ký",
      });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Tạo giải đấu thất bại",
        description: error.message || "Có lỗi xảy ra khi tạo giải đấu",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      registrationStartDate: "",
      registrationEndDate: "",
      maxParticipants: 100,
      categories: [],
      status: TournamentStatus.UPCOMING,
    });
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.categories.length === 0) {
      toast({
        title: "Lỗi validation",
        description: "Vui lòng chọn ít nhất một hạng mục thi đấu",
        variant: "destructive",
      });
      return;
    }

    const tournamentData = {
      ...formData,
      organizerId: user?.id,
    };

    try {
      insertTournamentSchema.parse(tournamentData);
      createTournamentMutation.mutate(tournamentData);
    } catch (error: any) {
      toast({
        title: "Dữ liệu không hợp lệ",
        description: error.message || "Vui lòng kiểm tra lại thông tin",
        variant: "destructive",
      });
    }
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-[hsl(var(--sports-green))]" />
            Tạo Giải Đấu Mới
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Thông Tin Cơ Bản</h3>
            
            <div className="space-y-2">
              <Label htmlFor="name">Tên giải đấu *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Giải Vô Địch Pickleball Quốc Gia 2024"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về giải đấu..."
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Địa điểm *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Sân thể thao, địa chỉ"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tournament Schedule */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Lịch Trình Giải Đấu
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Ngày bắt đầu *</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  min={formatDateForInput(tomorrow)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">Ngày kết thúc *</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  min={formData.startDate || formatDateForInput(tomorrow)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationStartDate">Mở đăng ký *</Label>
                <Input
                  id="registrationStartDate"
                  type="datetime-local"
                  value={formData.registrationStartDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationStartDate: e.target.value }))}
                  min={formatDateForInput(new Date())}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="registrationEndDate">Đóng đăng ký *</Label>
                <Input
                  id="registrationEndDate"
                  type="datetime-local"
                  value={formData.registrationEndDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationEndDate: e.target.value }))}
                  min={formData.registrationStartDate}
                  max={formData.startDate}
                  required
                />
              </div>
            </div>
          </div>

          {/* Participants and Categories */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Thông Tin Tham Gia
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Số lượng VĐV tối đa</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) }))}
                min={4}
                max={1000}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Hạng mục thi đấu *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categoryOptions.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={formData.categories.includes(category.value)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={category.value} className="text-sm">
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.categories.length === 0 && (
                <p className="text-sm text-red-600">Vui lòng chọn ít nhất một hạng mục</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              className="bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
              disabled={createTournamentMutation.isPending}
            >
              {createTournamentMutation.isPending ? "Đang tạo..." : "Tạo Giải Đấu"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
