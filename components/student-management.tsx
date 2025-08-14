"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  UserPlus,
  Upload,
  Download,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Target,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { StudentImport } from "./student-import"
import { StudentProfile } from "./student-profile"

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

interface StudentGroup {
  id: string
  name: string
  description: string
  studentCount: number
  createdDate: string
}

interface AllocationHistory {
  id: string
  generatedAt: string
  subject: string
  topic: string
  difficulty: string
  mode: string
  totalStudents: number
  questionsPerStudent: number
  studentsAssigned: Array<{
    id: string
    name: string
    class: string
  }>
}

export function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      studentId: "STU001",
      class: "Physics 101",
      status: "active",
      joinedDate: "2024-01-15",
      totalQuestions: 45,
      completedQuestions: 42,
      averageScore: 87.5,
      lastActivity: "2024-01-20",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      studentId: "STU002",
      class: "Physics 101",
      status: "active",
      joinedDate: "2024-01-15",
      totalQuestions: 45,
      completedQuestions: 38,
      averageScore: 82.3,
      lastActivity: "2024-01-19",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@university.edu",
      studentId: "STU003",
      class: "Chemistry 201",
      status: "active",
      joinedDate: "2024-01-16",
      totalQuestions: 32,
      completedQuestions: 30,
      averageScore: 91.2,
      lastActivity: "2024-01-20",
    },
  ])

  const [groups, setGroups] = useState<StudentGroup[]>([
    {
      id: "1",
      name: "Physics 101 - Section A",
      description: "Introduction to Physics for first-year students",
      studentCount: 25,
      createdDate: "2024-01-10",
    },
    {
      id: "2",
      name: "Chemistry 201 - Advanced",
      description: "Advanced Chemistry for second-year students",
      studentCount: 18,
      createdDate: "2024-01-12",
    },
  ])

  const [allocationHistory, setAllocationHistory] = useState<AllocationHistory[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState("all")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    studentId: "",
    class: "",
  })

  // Load allocation history from localStorage on component mount
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('allocationHistory')
    if (savedHistory) {
      try {
        setAllocationHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Failed to load allocation history:', error)
      }
    }
  }, [])

  // Save allocation history to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('allocationHistory', JSON.stringify(allocationHistory))
  }, [allocationHistory])

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesClass = selectedClass === "all" || student.class === selectedClass
    return matchesSearch && matchesClass
  })

  const uniqueClasses = Array.from(new Set(students.map((s) => s.class)))

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.studentId) return

    const student: Student = {
      id: Date.now().toString(),
      ...newStudent,
      status: "active",
      joinedDate: new Date().toISOString().split("T")[0],
      totalQuestions: 0,
      completedQuestions: 0,
      averageScore: 0,
      lastActivity: new Date().toISOString().split("T")[0],
    }

    setStudents([...students, student])
    setNewStudent({ name: "", email: "", studentId: "", class: "" })
    setIsAddStudentOpen(false)
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(students.filter((s) => s.id !== studentId))
  }

  const exportStudents = () => {
    const csvContent = [
      [
        "Name",
        "Email",
        "Student ID",
        "Class",
        "Status",
        "Total Questions",
        "Completed",
        "Average Score",
        "Last Activity",
      ],
      ...students.map((student) => [
        student.name,
        student.email,
        student.studentId,
        student.class,
        student.status,
        student.totalQuestions.toString(),
        student.completedQuestions.toString(),
        student.averageScore.toString(),
        student.lastActivity,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `students-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Student Management</h1>
          <p className="text-muted-foreground">Manage student allocation and track progress</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Users className="w-3 h-3" />
            {students.length} Students
          </Badge>
          <Badge variant="outline" className="gap-1">
            <BookOpen className="w-3 h-3" />
            {groups.length} Groups
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{students.filter((s) => s.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / students.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-chart-3" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    (students.reduce((sum, s) => sum + s.completedQuestions, 0) /
                      students.reduce((sum, s) => sum + s.totalQuestions, 0)) *
                      100,
                  )}
                  %
                </p>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-chart-4" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    students.filter((s) => {
                      const lastActivity = new Date(s.lastActivity)
                      const today = new Date()
                      const diffTime = Math.abs(today.getTime() - lastActivity.getTime())
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                      return diffDays <= 7
                    }).length
                  }
                </p>
                <p className="text-sm text-muted-foreground">Active This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="allocation">Allocation History</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          {/* Controls */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full md:w-64"
                    />
                  </div>

                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {uniqueClasses.map((className) => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={exportStudents}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" onClick={() => setIsImportOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </Button>
                  <Button onClick={() => setIsAddStudentOpen(true)}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Students Table */}
          <Card>
            <CardHeader>
              <CardTitle>Students ({filteredStudents.length})</CardTitle>
              <CardDescription>Manage your student roster and track their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Avg Score</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          <p className="text-xs text-muted-foreground">ID: {student.studentId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.class}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>
                              {student.completedQuestions}/{student.totalQuestions}
                            </span>
                            <span>{Math.round((student.completedQuestions / student.totalQuestions) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(student.completedQuestions / student.totalQuestions) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{student.averageScore}%</span>
                          {student.averageScore >= 90 ? (
                            <CheckCircle className="w-4 h-4 text-chart-3" />
                          ) : student.averageScore >= 70 ? (
                            <AlertCircle className="w-4 h-4 text-accent" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-destructive" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{new Date(student.lastActivity).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>{student.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(student)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Groups</CardTitle>
              <CardDescription>Organize students into classes and groups for better management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold">{group.name}</h3>
                          <Badge variant="outline">{group.studentCount} students</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Created: {new Date(group.createdDate).toLocaleDateString()}
                          </span>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Allocation History</CardTitle>
              <CardDescription>Track question allocations and student assignments</CardDescription>
            </CardHeader>
            <CardContent>
              {allocationHistory.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No allocation history available yet.</p>
                  <p className="text-sm">Generate questions to see allocation records here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allocationHistory.map((allocation) => (
                    <Card key={allocation.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{allocation.subject}</h3>
                              {allocation.topic && (
                                <Badge variant="outline">{allocation.topic}</Badge>
                              )}
                              <Badge variant="secondary" className="capitalize">{allocation.difficulty}</Badge>
                              <Badge variant={allocation.mode === "friendly" ? "default" : "destructive"}>
                                {allocation.mode}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>{allocation.totalStudents} students • {allocation.questionsPerStudent} questions each</p>
                              <p>Generated: {new Date(allocation.generatedAt).toLocaleString()}</p>
                            </div>
                            {allocation.studentsAssigned && (
                              <div className="text-sm">
                                <p className="font-medium">Assigned to:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {allocation.studentsAssigned.slice(0, 5).map((student, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {student.name}
                                    </Badge>
                                  ))}
                                  {allocation.studentsAssigned.length > 5 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{allocation.studentsAssigned.length - 5} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="w-4 h-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Student Dialog */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>Enter the student's information to add them to your roster.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={newStudent.name}
                onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                placeholder="Enter student's full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="student@university.edu"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input
                id="studentId"
                value={newStudent.studentId}
                onChange={(e) => setNewStudent({ ...newStudent, studentId: e.target.value })}
                placeholder="STU001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Input
                id="class"
                value={newStudent.class}
                onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                placeholder="Physics 101"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent}>Add Student</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Student Import Dialog */}
      {isImportOpen && (
        <StudentImport
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onImport={(importedStudents) => {
            setStudents([...students, ...importedStudents])
            setIsImportOpen(false)
          }}
        />
      )}

      {/* Student Profile Dialog */}
      {selectedStudent && (
        <StudentProfile student={selectedStudent} isOpen={!!selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  )
}
