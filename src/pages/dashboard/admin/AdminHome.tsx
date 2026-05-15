import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  TrendingUp,
  TrendingDown,
  Star,
  Download,
  Building2,
  Briefcase,
  FileText,
  UserCheck,
  Clock,
  Calendar,
  ArrowRight,
  Activity,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  useAdminDashboardStats,
  useRegistrationTrend,
  useSkillDistribution,
  useExperienceDistribution,
  useEducationDistribution,
  useRecentActivity,
} from "@/hooks/useDashboardStats";

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

const KPICard = ({ title, value, change, icon, color, delay = 0 }: KPICardProps) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                {title}
              </p>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              {change !== 0 && (
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 text-destructive" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? "text-success" : "text-destructive"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {change}%
                  </span>
                </div>
              )}
            </div>
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}
            >
              {icon}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminHome = () => {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "quarter" | "ytd">("7days");

  const { stats, loading: statsLoading, error: statsError } = useAdminDashboardStats(dateRange);
  const { data: registrationData, loading: trendLoading } = useRegistrationTrend(
    dateRange === "7days" || dateRange === "30days" ? dateRange : "7days"
  );
  const { data: skillDistribution, loading: skillsLoading } = useSkillDistribution(6);
  const { data: experienceData, loading: expLoading } = useExperienceDistribution();
  const { data: educationData, loading: eduLoading } = useEducationDistribution();
  const { data: recentActivity, loading: activityLoading } = useRecentActivity(10);

  const isLoading = statsLoading || trendLoading || skillsLoading || expLoading || eduLoading || activityLoading;

  useEffect(() => {
    if (statsError) {
      console.error('Error loading dashboard stats:', statsError);
    }
  }, [statsError]);

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time recruitment analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
            <SelectTrigger className="w-40 h-9">
              <Calendar className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {statsError && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Error Loading Dashboard Data</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {statsError.message || 'Failed to fetch dashboard statistics. Please check your admin permissions.'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading dashboard data...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Primary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              title="Total Applicants"
              value={stats?.totalApplicants.toLocaleString() || "0"}
              change={0}
              icon={<Users className="h-5 w-5 text-primary-foreground" />}
              color="bg-primary"
              delay={0}
            />
            <KPICard
              title="New Today"
              value={stats?.newToday.toLocaleString() || "0"}
              change={0}
              icon={<TrendingUp className="h-5 w-5 text-success-foreground" />}
              color="bg-success"
              delay={0.05}
            />
            <KPICard
              title="Shortlisted"
              value={stats?.shortlisted.toLocaleString() || "0"}
              change={0}
              icon={<Star className="h-5 w-5 text-warning-foreground" />}
              color="bg-warning"
              delay={0.1}
            />
            <KPICard
              title="This Week"
              value={stats?.newThisWeek.toLocaleString() || "0"}
              change={0}
              icon={<Star className="h-5 w-5 text-info-foreground" />}
              color="bg-info"
              delay={0.15}
            />
            <KPICard
              title="Imported"
              value={stats?.importedApplicants.toLocaleString() || "0"}
              change={0}
              icon={<Download className="h-5 w-5 text-secondary-foreground" />}
              color="bg-secondary"
              delay={0.2}
            />
            <KPICard
              title="Active Clients"
              value={stats?.activeClients.toLocaleString() || "0"}
              change={0}
              icon={<Building2 className="h-5 w-5 text-primary-foreground" />}
              color="bg-primary"
              delay={0.25}
            />
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jobs Posted</p>
                  <p className="text-lg font-bold">{stats?.jobsPosted || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Resumes</p>
                  <p className="text-lg font-bold">{stats?.resumesDownloaded || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                  <UserCheck className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Folders</p>
                  <p className="text-lg font-bold">{stats?.totalFolders || 0}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Avg. Response</p>
                  <p className="text-lg font-bold">2.4h</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 px-5 pt-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Applicant Registrations</CardTitle>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={registrationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="date"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="applicants"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2.5}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, fill: "hsl(var(--primary))" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base font-semibold">Skill Distribution</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: "11px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Second Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base font-semibold">Experience Levels</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={experienceData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        type="number"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="range"
                        type="category"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        width={65}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--primary))"
                        radius={[0, 4, 4, 0]}
                        barSize={20}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2 px-5 pt-5">
                <CardTitle className="text-base font-semibold">Education Background</CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={educationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis
                        dataKey="level"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--secondary))"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-2 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                <Button variant="ghost" size="sm" className="text-primary text-xs h-8">
                  View All
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              {recentActivity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No recent activity found
                </div>
              ) : (
                <div className="space-y-1">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex items-center gap-3 py-3 border-b last:border-0 last:pb-0"
                    >
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        {activity.type === "new" && <Users className="h-3.5 w-3.5 text-success" />}
                        {activity.type === "client" && <Building2 className="h-3.5 w-3.5 text-info" />}
                        {activity.type === "import" && <Download className="h-3.5 w-3.5 text-primary" />}
                        {activity.type === "shortlist" && <Star className="h-3.5 w-3.5 text-warning" />}
                        {activity.type === "download" && <FileText className="h-3.5 w-3.5 text-secondary" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.name}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-normal flex-shrink-0">
                        {activity.time}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminHome;
