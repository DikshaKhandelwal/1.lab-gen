"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  Activity,
  Download,
  Calendar,
} from "lucide-react"

export function Analytics() {
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")

  // Sample analytics data
  const overviewStats = [
    {
      title: "Total Students",
      value: "1,247",
      change: "+12.5%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Questions Generated",
      value: "8,432",
      change: "+23.1%",
      trend: "up",
      icon: BookOpen,
    },
    {
      title: "Avg. Completion Time",
      value: "24.3 min",
      change: "-8.2%",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Success Rate",
      value: "87.4%",
      change: "+5.7%",
      trend: "up",
      icon: Target,
    },
  ]

  const performanceData = [
    { name: "Mon", questions: 120, students: 45, avgScore: 78 },
    { name: "Tue", questions: 145, students: 52, avgScore: 82 },
    { name: "Wed", questions: 132, students: 48, avgScore: 75 },
    { name: "Thu", questions: 168, students: 61, avgScore: 85 },
    { name: "Fri", questions: 155, students: 58, avgScore: 79 },
    { name: "Sat", questions: 89, students: 32, avgScore: 88 },
    { name: "Sun", questions: 76, students: 28, avgScore: 91 },
  ]

  const difficultyDistribution = [
    { name: "Beginner", value: 35, color: "#10b981" },
    { name: "Intermediate", value: 45, color: "#f59e0b" },
    { name: "Advanced", value: 20, color: "#ef4444" },
  ]

  const subjectPerformance = [
    { subject: "Mathematics", avgScore: 82, totalQuestions: 1245, students: 156 },
    { subject: "Physics", avgScore: 78, totalQuestions: 987, students: 134 },
    { subject: "Chemistry", avgScore: 85, totalQuestions: 876, students: 142 },
    { subject: "Biology", avgScore: 79, totalQuestions: 654, students: 98 },
    { subject: "Computer Science", avgScore: 88, totalQuestions: 543, students: 87 },
  ]

  const recentActivity = [
    {
      id: 1,
      action: "Question set generated",
      details: "Advanced Physics - 25 questions for Class 12A",
      timestamp: "2 minutes ago",
      type: "generation",
    },
    {
      id: 2,
      action: "Student completed exam",
      details: "John Doe finished Mathematics exam (Score: 92%)",
      timestamp: "5 minutes ago",
      type: "completion",
    },
    {
      id: 3,
      action: "New topic added",
      details: "Quantum Mechanics added to Physics",
      timestamp: "12 minutes ago",
      type: "topic",
    },
    {
      id: 4,
      action: "Bulk student import",
      details: "45 students imported to Chemistry class",
      timestamp: "1 hour ago",
      type: "import",
    },
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "generation":
        return <BookOpen className="h-4 w-4" />
      case "completion":
        return <Award className="h-4 w-4" />
      case "topic":
        return <Target className="h-4 w-4" />
      case "import":
        return <Users className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewStats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                    <span className="ml-1">from last period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
                <CardDescription>Questions generated and student participation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="questions"
                      stackId="1"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Area
                      type="monotone"
                      dataKey="students"
                      stackId="2"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Difficulty Distribution</CardTitle>
                <CardDescription>Question difficulty breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={difficultyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {difficultyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {difficultyDistribution.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Average scores and completion rates over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="avgScore"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Question Generation</CardTitle>
              <CardDescription>Number of questions generated per day</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="questions" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>Average scores and activity by subject</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subjectPerformance.map((subject) => (
                  <div key={subject.subject} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <h3 className="font-medium">{subject.subject}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{subject.totalQuestions} questions</span>
                        <span>{subject.students} students</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{subject.avgScore}%</div>
                      <div className="text-sm text-muted-foreground">avg score</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and events in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="p-2 bg-muted rounded-full">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{activity.action}</h4>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {activity.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
