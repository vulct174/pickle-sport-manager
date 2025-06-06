import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { UserRoles } from "@shared/schema";
import { Tablet } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    fullName: "",
    phone: "",
    role: UserRoles.ATHLETE,
    clubId: "",
    skillLevel: "",
  });

  const { data: clubs = [] } = useQuery({
    queryKey: ["/api/clubs"],
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${data.user.fullName}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Đăng nhập thất bại",
        description: error.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/auth/register", data);
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user);
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Đăng ký thất bại",
        description: error.message || "Có lỗi xảy ra",
        variant: "destructive",
      });
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(loginForm);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...registerForm,
      clubId: registerForm.clubId ? parseInt(registerForm.clubId) : null,
      skillLevel: registerForm.skillLevel ? parseFloat(registerForm.skillLevel) : null,
    };
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Tablet className="h-12 w-12 text-[hsl(var(--sports-green))] mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Pickleball Pro</h1>
          </div>
          <p className="text-sm text-gray-600">Hệ thống quản lý giải đấu pickleball</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Chào mừng</CardTitle>
            <CardDescription>
              Đăng nhập vào tài khoản của bạn hoặc tạo tài khoản mới
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Đăng nhập</TabsTrigger>
                <TabsTrigger value="register">Đăng ký</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Tên đăng nhập</Label>
                    <Input
                      id="username"
                      type="text"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="Nhập tên đăng nhập"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Nhập mật khẩu"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-[hsl(var(--sports-green))] hover:bg-[hsl(var(--sports-green))]/90"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </form>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Tài khoản demo:</strong><br />
                    Tên đăng nhập: admin<br />
                    Mật khẩu: admin123
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="registerUsername">Tên đăng nhập</Label>
                      <Input
                        id="registerUsername"
                        type="text"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="Nhập tên đăng nhập"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@example.com"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="registerPassword">Mật khẩu</Label>
                      <Input
                        id="registerPassword"
                        type="password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Nhập mật khẩu"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="0123456789"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Vai trò</Label>
                      <Select value={registerForm.role} onValueChange={(value) => setRegisterForm(prev => ({ ...prev, role: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vai trò" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRoles.ATHLETE}>Vận động viên</SelectItem>
                          <SelectItem value={UserRoles.ORGANIZER}>Tổ chức</SelectItem>
                          <SelectItem value={UserRoles.REFEREE}>Trọng tài</SelectItem>
                          <SelectItem value={UserRoles.ASSESSOR}>Đánh giá</SelectItem>
                          <SelectItem value={UserRoles.CLUB_OWNER}>Chủ CLB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {registerForm.role === UserRoles.ATHLETE && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="skillLevel">Cấp độ kỹ năng</Label>
                        <Select value={registerForm.skillLevel} onValueChange={(value) => setRegisterForm(prev => ({ ...prev, skillLevel: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn cấp độ" />
                          </SelectTrigger>
                          <SelectContent>
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
                      <div className="space-y-2">
                        <Label htmlFor="clubId">Câu lạc bộ</Label>
                        <Select value={registerForm.clubId} onValueChange={(value) => setRegisterForm(prev => ({ ...prev, clubId: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn CLB" />
                          </SelectTrigger>
                          <SelectContent>
                            {clubs.map((club: any) => (
                              <SelectItem key={club.id} value={club.id.toString()}>
                                {club.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-[hsl(var(--competition-blue))] hover:bg-[hsl(var(--competition-blue))]/90"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
