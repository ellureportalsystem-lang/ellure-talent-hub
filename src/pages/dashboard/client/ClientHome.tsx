import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, Star, Download, Search, Folder, Eye, 
  TrendingUp, Clock, FileText, ArrowRight, Briefcase,
  Calendar, BarChart3, Target
} from "lucide-react";
import { mockApplicants } from "@/data/mockApplicants";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ClientHome = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Calculate real stats from mock data
  const totalCandidates = mockApplicants.length;
  const shortlistedCount = mockApplicants.filter(a => a.status === 'Shortlisted').length;
  const favoritesCount = mockApplicants.filter(a => a.isFavorite).length;
  
  // Recent candidates
  const recentCandidates = mockApplicants.slice(0, 5);

  // Skills distribution
  const skillsCount: Record<string, number> = {};
  mockApplicants.forEach(a => {
    a.skills.forEach(skill => {
      skillsCount[skill] = (skillsCount[skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Chart data
  const trendData = [
    { month: 'Jan', candidates: 120 },
    { month: 'Feb', candidates: 145 },
    { month: 'Mar', candidates: 178 },
    { month: 'Apr', candidates: 210 },
    { month: 'May', candidates: 245 },
    { month: 'Jun', candidates: 289 },
  ];

  const skillsPieData = topSkills.map(([skill, count]) => ({
    name: skill,
    value: count,
  }));

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--info))', 'hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (locationQuery) params.set('location', locationQuery);
    navigate(`/dashboard/client/candidates?${params.toString()}`);
  };

  const handleViewProfile = (id: number) => {
    navigate(`/dashboard/client/candidates/${id}`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Welcome to Talent Portal</h1>
          <p className="text-muted-foreground">Find the perfect candidates for your organization</p>
        </div>
        <Button onClick={() => navigate('/dashboard/client/candidates')}>
          <Search className="mr-2 h-4 w-4" />
          Browse All Candidates
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/client/candidates')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Candidates</p>
                <p className="text-3xl font-bold mt-1">{totalCandidates}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-success" />
                  <span className="text-xs text-success">+12% this month</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/dashboard/client/folders')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Shortlists</p>
                <p className="text-3xl font-bold mt-1">3</p>
                <p className="text-xs text-muted-foreground mt-1">{shortlistedCount} candidates total</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                <Folder className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">My Favorites</p>
                <p className="text-3xl font-bold mt-1">{favoritesCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Saved for review</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resumes Downloaded</p>
                <p className="text-3xl font-bold mt-1">28</p>
                <p className="text-xs text-muted-foreground mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Download className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Search */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Quick Candidate Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by skills, designation, company..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>
            <Input 
              placeholder="Location" 
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {['React', 'Python', 'Java', 'Data Analyst', 'DevOps'].map(skill => (
              <Badge 
                key={skill}
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setSearchQuery(skill);
                  handleSearch();
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Candidate Growth Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorCandidates" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="candidates" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorCandidates)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Top Skills Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {skillsPieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Candidates */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recently Added Candidates
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/client/candidates')}>
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCandidates.map((candidate) => (
              <div 
                key={candidate.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => handleViewProfile(candidate.id)}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {candidate.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{candidate.name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{candidate.designation}</span>
                      <span>•</span>
                      <span>{candidate.currentCity}</span>
                      <span>•</span>
                      <span>{candidate.experience} yrs exp</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    {candidate.skills.slice(0, 3).map((skill, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card 
          className="shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-primary/20"
          onClick={() => navigate('/dashboard/client/candidates')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold">Advanced Search</p>
              <p className="text-sm text-muted-foreground">Filter by skills, experience, location</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-info/20"
          onClick={() => navigate('/dashboard/client/folders')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
              <Folder className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="font-semibold">My Shortlists</p>
              <p className="text-sm text-muted-foreground">Manage your candidate folders</p>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-success/20"
          onClick={() => navigate('/dashboard/client/jobs')}
        >
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="font-semibold">Job Requirements</p>
              <p className="text-sm text-muted-foreground">View your job postings</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientHome;
