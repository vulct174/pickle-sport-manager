export const SKILL_LEVELS = [
  { value: "2.0", label: "2.0 - Người mới bắt đầu" },
  { value: "2.5", label: "2.5 - Mới học" },
  { value: "3.0", label: "3.0 - Cơ bản" },
  { value: "3.5", label: "3.5 - Trung bình" },
  { value: "4.0", label: "4.0 - Khá" },
  { value: "4.5", label: "4.5 - Giỏi" },
  { value: "5.0", label: "5.0 - Chuyên nghiệp" },
  { value: "5.5", label: "5.5 - Xuất sắc" },
];

export const TOURNAMENT_CATEGORIES = {
  SINGLES_MEN: "singles_men",
  SINGLES_WOMEN: "singles_women",
  DOUBLES_MEN: "doubles_men",
  DOUBLES_WOMEN: "doubles_women",
  MIXED_DOUBLES: "mixed_doubles",
} as const;

export const CATEGORY_LABELS = {
  [TOURNAMENT_CATEGORIES.SINGLES_MEN]: "Nam Đơn",
  [TOURNAMENT_CATEGORIES.SINGLES_WOMEN]: "Nữ Đơn",
  [TOURNAMENT_CATEGORIES.DOUBLES_MEN]: "Nam Đôi",
  [TOURNAMENT_CATEGORIES.DOUBLES_WOMEN]: "Nữ Đôi",
  [TOURNAMENT_CATEGORIES.MIXED_DOUBLES]: "Đôi Hỗn Hợp",
};

export const USER_ROLE_LABELS = {
  athlete: "Vận Động Viên",
  organizer: "Tổ Chức",
  assessor: "Đánh Giá",
  referee: "Trọng Tài",
  club_owner: "Chủ Câu Lạc Bộ",
  forum_admin: "Quản Trị Diễn Đàn",
};

export const TOURNAMENT_STATUS_LABELS = {
  upcoming: "Sắp Diễn Ra",
  registration: "Đang Đăng Ký",
  active: "Đang Diễn Ra",
  completed: "Đã Kết Thúc",
};

export const MATCH_STATUS_LABELS = {
  scheduled: "Đã Lên Lịch",
  in_progress: "Đang Diễn Ra",
  completed: "Kết Thúc",
  cancelled: "Hủy Bỏ",
};

export const REGISTRATION_STATUS_LABELS = {
  pending: "Chờ Duyệt",
  approved: "Được Duyệt",
  rejected: "Từ Chối",
};

export const PICKLEBALL_RULES = {
  MAX_SCORE_PER_SET: 11,
  MIN_WIN_MARGIN: 2,
  BEST_OF_SETS: 3,
  MAX_SETS: 3,
};

export const THEME_COLORS = {
  SPORTS_GREEN: "hsl(122, 39%, 34%)", // #2E7D32
  COMPETITION_BLUE: "hsl(207, 77%, 40%)", // #1976D2
  CHAMPIONSHIP_ORANGE: "hsl(32, 100%, 50%)", // #FF6F00
  APPROVAL_GREEN: "hsl(122, 39%, 49%)", // #4CAF50
  BG_LIGHT: "hsl(220, 14%, 96%)", // #F5F5F5
  TEXT_DARK: "hsl(220, 9%, 13%)", // #212121
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
  },
  USERS: "/api/users",
  CLUBS: "/api/clubs",
  TOURNAMENTS: "/api/tournaments",
  REGISTRATIONS: "/api/registrations",
  MATCHES: "/api/matches",
  LEADERBOARD: "/api/leaderboard",
  STATS: "/api/stats",
  ACHIEVEMENTS: "/api/achievements",
};

export const QUERY_KEYS = {
  STATS: ["/api/stats"],
  TOURNAMENTS: ["/api/tournaments"],
  USERS: ["/api/users"],
  CLUBS: ["/api/clubs"],
  REGISTRATIONS: ["/api/registrations"],
  MATCHES: ["/api/matches"],
  LEADERBOARD: ["/api/leaderboard"],
  ACHIEVEMENTS: (athleteId: number) => [`/api/achievements/${athleteId}`],
  LIVE_MATCHES: ["/api/matches?live=true"],
};

export const DATE_FORMATS = {
  DISPLAY: "dd/MM/yyyy",
  INPUT: "yyyy-MM-dd'T'HH:mm",
  TIME: "HH:mm",
};

export const VALIDATION_RULES = {
  USERNAME: {
    minLength: 3,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9_]+$/,
  },
  PASSWORD: {
    minLength: 6,
    maxLength: 50,
  },
  PHONE: {
    pattern: /^[0-9+\-\s()]+$/,
  },
  SKILL_LEVEL: {
    min: 2.0,
    max: 5.5,
    step: 0.5,
  },
};
