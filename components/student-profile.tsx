"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, Calendar, BookOpen, Target, Clock, TrendingUp, Award, Activity } from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  class: string
  status: "active" | "inactive"
  joinedDate: string
  totalQuestions: number
  completedQuestions: number
  averageScore: number
  lastActivity: string
}

interface StudentProfileProps {
  student: Student
  isOpen: boolean
  onClose: () => void
}

export function StudentProfile({ student, isOpen, onClose }: StudentProfileProps) {
  const completionRate = (student.completedQuestions / student.totalQuestions) * 100

  // Mock data for detailed analytics
  const recentActivity = [
    { date: "2024-01-20", activity: "Completed Physics Quiz #5", score: 92 },
    { date: "2024-01-19", activity: "Started Quantum Mechanics Lab", score: null },
    { date: "2024-01-18", activity: "Completed Physics Quiz #4", score: 85 },
    { date: "2024-01-17", activity: "Submitted Lab Report #3", score: 88 },
  ]

  const subjectPerformance = [
    { subject: "Mechanics", completed: 15, total: 18, avgScore: 89 },
    { subject: "Thermodynamics", completed: 12, total: 15, avgScore: 85 },
    { subject: "Quantum Physics", completed: 8, total: 12, avgScore: 91 },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Student Profile
          </DialogTitle>
          <DialogDescription>Detailed information and performance analytics for {student.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">ID: {student.studentId}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Joined: {new Date(student.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Last Active: {new Date(student.lastActivity).toLocaleDateString()}</span>
                  </div>
                  <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{student.averageScore}%</p>
                    <p className="text-sm text-muted-foreground">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">{student.completedQuestions}</p>
                    <p className="text-sm text-muted-foreground">Questions Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-3" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
                    <p className="text-sm text-muted-foreground">Completion Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="performance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="subjects">Subject Breakdown</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Overall Progress
                  </CardTitle>
                  <CardDescription>
                    {student.name} has completed {student.completedQuestions} out of {student.totalQuestions} assigned
                    questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Questions Completed</span>
                        <span>
                          {student.completedQuestions}/{student.totalQuestions}
                        </span>
                      </div>
                      <Progress value={completionRate} className="w-full" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Strengths</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Consistent high performance</li>
                          <li>• Strong in theoretical concepts</li>
                          <li>• Regular participation</li>
                        </ul>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <h4 className="font-medium mb-2">Areas for Improvement</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Could improve calculation speed</li>
                          <li>• More practice with complex problems</li>
                          <li>• Review thermodynamics concepts</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest actions and submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </p>
                        </div>
                        {activity.score && (
                          <Badge
                            variant={
                              activity.score >= 90 ? "default" : activity.score >= 70 ? "secondary" : "destructive"
                            }
                          >
                            {activity.score}%
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Subject Performance</CardTitle>
                  <CardDescription>Breakdown by topic areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subjectPerformance.map((subject, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{subject.subject}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {subject.completed}/{subject.total}
                            </span>
                            <Badge variant="outline">{subject.avgScore}%</Badge>
                          </div>
                        </div>
                        <Progress value={(subject.completed / subject.total) * 100} className="w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
