import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { UserRoles } from "@shared/schema";
import { 
  Tablet, 
  LayoutDashboard, 
  Trophy, 
  Users, 
  Award, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    return path !== "/" && location.startsWith(path);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRoles.ORGANIZER:
        return "bg-[hsl(var(--championship-orange))] text-white";
      case UserRoles.REFEREE:
        return "bg-[hsl(var(--competition-blue))] text-white";
      case UserRoles.ATHLETE:
        return "bg-[hsl(var(--sports-green))] text-white";
      case UserRoles.ASSESSOR:
        return "bg-purple-600 text-white";
      case UserRoles.CLUB_OWNER:
        return "bg-indigo-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case UserRoles.ORGANIZER:
        return "Tổ Chức";
      case UserRoles.REFEREE:
        return "Trọng Tài";
      case UserRoles.ATHLETE:
        return "VĐV";
      case UserRoles.ASSESSOR:
        return "Đánh Giá";
      case UserRoles.CLUB_OWNER:
        return "Chủ CLB";
      case UserRoles.FORUM_ADMIN:
        return "Quản Trị";
      default:
        return "Khách";
    }
  };

  return (
    <nav className="bg-[hsl(var(--sports-green))] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Tablet className="text-white text-2xl mr-3 h-8 w-8" />
                <span className="text-white text-xl font-bold">Pickleball Pro</span>
              </Link>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link href="/">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-green-700 ${
                      isActive("/") ? "bg-green-800" : ""
                    }`}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Bảng Điều Khiển
                  </Button>
                </Link>
                
                <Link href="/tournaments">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-green-700 ${
                      isActive("/tournaments") ? "bg-green-800" : ""
                    }`}
                  >
                    <Trophy className="mr-2 h-4 w-4" />
                    Giải Đấu
                  </Button>
                </Link>
                
                <Link href="/athletes">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-green-700 ${
                      isActive("/athletes") ? "bg-green-800" : ""
                    }`}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Vận Động Viên
                  </Button>
                </Link>
                
                <Link href="/leaderboard">
                  <Button
                    variant="ghost"
                    className={`text-white hover:bg-green-700 ${
                      isActive("/leaderboard") ? "bg-green-800" : ""
                    }`}
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Bảng Xếp Hạng
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">{user?.fullName}</span>
              <Badge className={getRoleBadgeColor(user?.role || "")}>
                {getRoleDisplayName(user?.role || "")}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-green-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-green-700"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
