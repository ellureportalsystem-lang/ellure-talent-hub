import { useState } from "react";
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

// Mock data for charts
const registrationData = [
  { date: "Mon", applicants: 45 },
  { date: "Tue", applicants: 52 },
  { date: "Wed", applicants: 38 },
  { date: "Thu", applicants: 65 },
  { date: "Fri", applicants: 48 },
  { date: "Sat", applicants: 22 },
  { date: "Sun", applicants: 18 },
];

const skillDistribution = [
  { name: "Java", value: 245, color: "hsl(var(--primary))" },
  { name: "React", value: 189, color: "hsl(var(--secondary))" },
  { name: "Python", value: 156, color: "hsl(var(--warning))" },
  { name: "DevOps", value: 134, color: "hsl(var(--success))" },
  { name: "Data Science", value: 98, color: "hsl(var(--info))" },
  { name: "Others", value: 425, color: "hsl(var(--muted-foreground))" },
];

const experienceData = [
  { range: "Fresher", count: 245 },
  { range: "1-3 yrs", count: 389 },
  { range: "3-5 yrs", count: 298 },
  { range: "5-8 yrs", count: 187 },
  { range: "8+ yrs", count: 128 },
];

const educationData = [
  { level: "B.Tech", count: 456 },
  { level: "MCA", count: 234 },
  { level: "MBA", count: 189 },
  { level: "M.Tech", count: 145 },
  { level: "Others", count: 223 },
];

const recentActivity = [
  {
    id: 1,
    action: "New applicant registered",
    name: "Priya Sharma",
    time: "2 mins ago",
    type: "new",
  },
  {
    id: 2,
    action: "Client added",
    name: "TCS India",
    time: "15 mins ago",
    type: "client",
  },
  {
    id: 3,
    action: "200 applicants imported",
    name: "Batch Import",
    time: "1 hour ago",
    type: "import",
  },
  {
    id: 4,
    action: "Applicant shortlisted",
    name: "Rahul Kumar",
    time: "2 hours ago",
    type: "shortlist",
  },
  {
    id: 5,
    action: "Resume downloaded",
    name: "Anita Patel",
    time: "3 hours ago",
    type: "download",
  },
];

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  sparklineData?: number[];
}

const KPICard = ({
  title,
  value,
  change,
  icon,
  color,
  sparklineData,
}: KPICardProps) => {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="card-hover shadow-md border-0 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                {title}
              </p>
              <p className="text-3xl font-bold">{value}</p>
              <div className="flex items-center gap-1">
                {isPositive ? (
                  <TrendingUp className="h-4 w-4 text-success" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-sm font-medium ${
                    isPositive ? "text-success" : "text-destructive"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {change}%
                </span>
                <span className="text-xs text-muted-foreground">vs last week</span>
              </div>
            </div>
            <div
              className={`h-12 w-12 rounded-xl flex items-center justify-center ${color}`}
            >
              {icon}
            </div>
          </div>
          {sparklineData && (
            <div className="mt-4 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData.map((v, i) => ({ v }))}>
                  <Line
                    type="monotone"
                    dataKey="v"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminHome = () => {
  const [dateRange, setDateRange] = useState("7days");

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your recruitment summary.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total Applicants"
          value="1,247"
          change={12.5}
          icon={<Users className="h-6 w-6 text-primary-foreground" />}
          color="bg-primary"
          sparklineData={[30, 45, 38, 52, 48, 60, 55]}
        />
        <KPICard
          title="New Today"
          value="43"
          change={8.2}
          icon={<TrendingUp className="h-6 w-6 text-success-foreground" />}
          color="bg-success"
        />
        <KPICard
          title="Shortlisted"
          value="89"
          change={-2.4}
          icon={<Star className="h-6 w-6 text-warning-foreground" />}
          color="bg-warning"
        />
        <KPICard
          title="Favorites"
          value="156"
          change={5.7}
          icon={<Star className="h-6 w-6 text-info-foreground" />}
          color="bg-info"
        />
        <KPICard
          title="Imported"
          value="847"
          change={23.1}
          icon={<Download className="h-6 w-6 text-secondary-foreground" />}
          color="bg-secondary"
        />
        <KPICard
          title="Active Clients"
          value="24"
          change={4.3}
          icon={<Building2 className="h-6 w-6 text-accent-foreground" />}
          color="bg-accent"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Jobs Posted</p>
              <p className="text-xl font-bold">32</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Resumes Downloaded</p>
              <p className="text-xl font-bold">187</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profiles Updated</p>
              <p className="text-xl font-bold">56</p>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-info" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Response Time</p>
              <p className="text-xl font-bold">2.4h</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trend */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Applicant Registrations</CardTitle>
              <Badge variant="outline" className="text-xs">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="applicants"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Distribution */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Skill Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Experience Distribution */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Experience Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={experienceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis
                    dataKey="range"
                    type="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Education Distribution */}
        <Card className="shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Education Background</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={educationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="level"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--secondary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary">
              View All
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-4 pb-4 border-b last:border-0 last:pb-0"
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  {activity.type === "new" && (
                    <Users className="h-4 w-4 text-success" />
                  )}
                  {activity.type === "client" && (
                    <Building2 className="h-4 w-4 text-info" />
                  )}
                  {activity.type === "import" && (
                    <Download className="h-4 w-4 text-primary" />
                  )}
                  {activity.type === "shortlist" && (
                    <Star className="h-4 w-4 text-warning" />
                  )}
                  {activity.type === "download" && (
                    <FileText className="h-4 w-4 text-secondary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.name}</p>
                </div>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {activity.time}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHome;
