import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRoles } from "@shared/schema";
import { 
  UserPlus, 
  Calendar, 
  BarChart3, 
  Settings, 
  Trophy, 
  Users, 
  ClipboardCheck,
  Award
} from "lucide-react";

interface QuickActionsProps {
  userRole?: string;
}

export default function QuickActions({ userRole }: QuickActionsProps) {
  const getActionsForRole = () => {
    switch (userRole) {
      case UserRoles.ORGANIZER:
        return [
          {
            icon: UserPlus,
            title: "Đăng Ký VĐV Mới",
            description: "Thêm vận động viên vào hệ thống",
            color: "bg-blue-50 hover:bg-blue-100 text-[hsl(var(--competition-blue))]",
          },
          {
            icon: Calendar,
            title: "Tạo Lịch Thi Đấu",
            description: "Sắp xếp trận đấu mới",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: BarChart3,
            title: "Báo Cáo Thống Kê",
            description: "Xem thống kê giải đấu",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
          {
            icon: Settings,
            title: "Cài Đặt Hệ Thống",
            description: "Quản lý cấu hình",
            color: "bg-purple-50 hover:bg-purple-100 text-purple-600",
          },
        ];

      case UserRoles.REFEREE:
        return [
          {
            icon: Trophy,
            title: "Cập Nhật Tỷ Số",
            description: "Nhập kết quả trận đấu",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: Calendar,
            title: "Lịch Trọng Tài",
            description: "Xem lịch điều hành",
            color: "bg-blue-50 hover:bg-blue-100 text-[hsl(var(--competition-blue))]",
          },
          {
            icon: ClipboardCheck,
            title: "Báo Cáo Trận Đấu",
            description: "Gửi báo cáo kết thúc",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
        ];

      case UserRoles.ATHLETE:
        return [
          {
            icon: Trophy,
            title: "Đăng Ký Giải Đấu",
            description: "Tham gia giải đấu mới",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: Award,
            title: "Thành Tích Của Tôi",
            description: "Xem lịch sử thi đấu",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
          {
            icon: Calendar,
            title: "Lịch Thi Đấu",
            description: "Xem các trận sắp tới",
            color: "bg-blue-50 hover:bg-blue-100 text-[hsl(var(--competition-blue))]",
          },
        ];

      case UserRoles.ASSESSOR:
        return [
          {
            icon: Award,
            title: "Đánh Giá Kỹ Năng",
            description: "Phê duyệt cấp độ VĐV",
            color: "bg-purple-50 hover:bg-purple-100 text-purple-600",
          },
          {
            icon: ClipboardCheck,
            title: "Duyệt Đăng Ký",
            description: "Xét duyệt tham gia giải",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: BarChart3,
            title: "Báo Cáo Đánh Giá",
            description: "Thống kê đánh giá",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
        ];

      case UserRoles.CLUB_OWNER:
        return [
          {
            icon: Users,
            title: "Quản Lý Thành Viên",
            description: "Thêm/sửa thành viên CLB",
            color: "bg-blue-50 hover:bg-blue-100 text-[hsl(var(--competition-blue))]",
          },
          {
            icon: Trophy,
            title: "Tạo Giải CLB",
            description: "Tổ chức giải nội bộ",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: BarChart3,
            title: "Thống Kê CLB",
            description: "Xem thành tích CLB",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
        ];

      default:
        return [
          {
            icon: Trophy,
            title: "Xem Giải Đấu",
            description: "Theo dõi các giải đấu",
            color: "bg-green-50 hover:bg-green-100 text-[hsl(var(--sports-green))]",
          },
          {
            icon: Award,
            title: "Bảng Xếp Hạng",
            description: "Xem thứ hạng VĐV",
            color: "bg-orange-50 hover:bg-orange-100 text-[hsl(var(--championship-orange))]",
          },
        ];
    }
  };

  const actions = getActionsForRole();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao Tác Nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start p-3 h-auto transition-colors ${action.color}`}
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-medium">{action.title}</div>
                  <div className="text-xs opacity-70">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
