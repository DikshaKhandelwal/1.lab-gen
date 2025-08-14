"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Users, Clock, Target, BookOpen, Zap, Heart, AlertCircle, UserCheck } from "lucide-react"
import { GenerationResults } from "./generation-results"
import { ModeSelector } from "./mode-selector"
import { saveAllocationHistory } from "@/lib/allocation-history"

interface GenerationState {
  status: "idle" | "generating" | "completed" | "error" | "mode-selection"
  progress: number
  results?: any
  error?: string
}

interface Student {
  id: string
  name: string
  email: string
  studentId: string
  class: string
  status: "active" | "inactive"
}

export function QuestionGenerator() {
  const [mode, setMode] = useState<"exam" | "friendly">("friendly")
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium")
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [context, setContext] = useState("")
  const [studentCount, setStudentCount] = useState("")
  const [questionCount, setQuestionCount] = useState("1") // Default to 1 lab task per student for lab setting
  const [generationState, setGenerationState] = useState<GenerationState>({ status: "idle", progress: 0 })
  const [selectedStudent, setSelectedStudent] = useState("")
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([])
  const [allStudents, setAllStudents] = useState<Student[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.johnson@university.edu",
      studentId: "STU001",
      class: "Physics 101",
      status: "active",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob.smith@university.edu",
      studentId: "STU002",
      class: "Physics 101",
      status: "active",
    },
    {
      id: "3",
      name: "Carol Davis",
      email: "carol.davis@university.edu",
      studentId: "STU003",
      class: "Chemistry 201",
      status: "active",
    },
  ])
  const [selectionMode, setSelectionMode] = useState<"count" | "specific">("count")

  const handleGenerate = async () => {
    let studentsToUse: Student[] = []
    let effectiveStudentCount = 0

    if (selectionMode === "specific") {
      if (selectedStudents.length === 0) {
        setGenerationState({
          status: "error",
          progress: 0,
          error: "Please select at least one student",
        })
        return
      }
      studentsToUse = selectedStudents
      effectiveStudentCount = selectedStudents.length
    } else {
      if (!subject || !studentCount) {
        setGenerationState({
          status: "error",
          progress: 0,
          error: "Please fill in all required fields",
        })
        return
      }
      // Use active students up to the specified count
      studentsToUse = allStudents.filter(s => s.status === "active").slice(0, Number.parseInt(studentCount))
      effectiveStudentCount = Number.parseInt(studentCount)
    }

    if (!subject) {
      setGenerationState({
        status: "error",
        progress: 0,
        error: "Please select a subject",
      })
      return
    }

    setGenerationState({ status: "generating", progress: 0 })

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setGenerationState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + Math.random() * 20, 90),
        }))
      }, 500)

      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode,
          difficulty,
          subject,
          topic,
          context,
          studentCount: effectiveStudentCount,
          questionCount: Number.parseInt(questionCount),
          students: studentsToUse, // Pass actual student data
        }),
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Generation failed")
      }

      const results = await response.json()

      // Save allocation history
      saveAllocationHistory(results.metadata)

      setGenerationState({
        status: "completed",
        progress: 100,
        results,
      })
    } catch (error) {
      setGenerationState({
        status: "error",
        progress: 0,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    }
  }

  const resetGeneration = () => {
    setGenerationState({ status: "idle", progress: 0 })
  }

  const handleStartSession = (studentName: string) => {
    setSelectedStudent(studentName)
    setGenerationState({ status: "mode-selection", progress: 100 })
  }

  const handleSessionComplete = (mode: string, answers: Record<string, string>, metadata: any) => {
    console.log("Session completed:", { mode, answers, metadata })
    // Here you would typically save the results to a database
    setGenerationState({ status: "completed", progress: 100 })
    setSelectedStudent("")
  }

  const handleSessionExit = () => {
    setGenerationState({ status: "completed", progress: 100 })
    setSelectedStudent("")
  }

  if (generationState.status === "mode-selection" && generationState.results && selectedStudent) {
    // Get questions for the selected student
    const studentAllocation = generationState.results.allocations.find(
      (alloc: any) => alloc.studentName === selectedStudent,
    )

    if (studentAllocation) {
      return (
        <ModeSelector
          questions={studentAllocation.questions}
          studentName={selectedStudent}
          onComplete={handleSessionComplete}
          onExit={handleSessionExit}
        />
      )
    }
  }

  if (generationState.status === "completed" && generationState.results) {
    return (
      <GenerationResults
        results={generationState.results}
        onGenerateNew={resetGeneration}
        onStartSession={handleStartSession}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Lab Task Generator</h1>
          <p className="text-muted-foreground">Create intelligent lab tasks with adaptive difficulty</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <Brain className="w-3 h-3" />
            AI-Powered
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Users className="w-3 h-3" />
            Multi-Student
          </Badge>
        </div>
      </div>

      {/* Generation Progress */}
      {generationState.status === "generating" && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Generating Lab Tasks...</h3>
                <span className="text-sm text-muted-foreground">{Math.round(generationState.progress)}%</span>
              </div>
              <Progress value={generationState.progress} className="w-full" />
              <p className="text-sm text-muted-foreground">
                Creating {questionCount} unique lab {questionCount === "1" ? "task" : "tasks"} for {studentCount}{" "}
                students
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {generationState.status === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generationState.error}</AlertDescription>
        </Alert>
      )}

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Generation Mode
          </CardTitle>
          <CardDescription>Choose between exam mode for assessments or friendly mode for practice</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={mode} onValueChange={(value) => setMode(value as "exam" | "friendly")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="friendly" className="gap-2">
                <Heart className="w-4 h-4" />
                Friendly Mode
              </TabsTrigger>
              <TabsTrigger value="exam" className="gap-2">
                <AlertCircle className="w-4 h-4" />
                Exam Mode
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friendly" className="mt-4">
              <div className="p-4 bg-accent/20 rounded-lg border border-accent/30">
                <h4 className="font-medium text-foreground mb-2">Friendly Mode Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Encouraging feedback and hints</li>
                  <li>• Progressive difficulty adjustment</li>
                  <li>• Learning-focused explanations</li>
                  <li>• Collaborative problem-solving</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="exam" className="mt-4">
              <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                <h4 className="font-medium text-destructive-foreground mb-2">Exam Mode Features</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Formal assessment structure</li>
                  <li>• Time-limited responses</li>
                  <li>• Standardized difficulty</li>
                  <li>• Comprehensive evaluation</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Configuration */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Subject & Topic
            </CardTitle>
            <CardDescription>Define the academic focus for lab task generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                  <SelectItem value="biology">Biology</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="engineering">Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Specific Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Quantum Mechanics, Organic Chemistry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Additional Context</Label>
              <Textarea
                id="context"
                placeholder="Provide any specific requirements, learning objectives, or context..."
                className="min-h-[80px]"
                value={context}
                onChange={(e) => setContext(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Generation Settings
            </CardTitle>
            <CardDescription>Configure difficulty and allocation parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Difficulty Level</Label>
              <Select value={difficulty} onValueChange={(value) => setDifficulty(value as "easy" | "medium" | "hard")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy - Foundational concepts</SelectItem>
                  <SelectItem value="medium">Medium - Applied knowledge</SelectItem>
                  <SelectItem value="hard">Hard - Advanced analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="students">Number of Students *</Label>
                <Input
                  id="students"
                  type="number"
                  placeholder="25"
                  min="1"
                  max="100"
                  value={studentCount}
                  onChange={(e) => setStudentCount(e.target.value)}
                  disabled={selectionMode === "specific"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="questions">Lab Tasks per Student</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Lab Task (Standard)</SelectItem>
                    <SelectItem value="2">2 Lab Tasks</SelectItem>
                    <SelectItem value="3">3 Lab Tasks</SelectItem>
                    <SelectItem value="5">5 Lab Tasks</SelectItem>
                    <SelectItem value="10">10 Lab Tasks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Estimated Generation Time:</span>
                <span className="text-muted-foreground">
                  {questionCount === "1" ? "30-60 seconds" : "2-3 minutes"} for lab task generation
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Student Assignment
            </CardTitle>
            <CardDescription>Choose how to assign lab tasks to students</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs value={selectionMode} onValueChange={(value) => setSelectionMode(value as "count" | "specific")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="count">By Count</TabsTrigger>
                <TabsTrigger value="specific">Select Specific</TabsTrigger>
              </TabsList>

              <TabsContent value="count" className="mt-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Lab tasks will be assigned to the first {studentCount || "N"} active students in your roster.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="specific" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <Label>Select Students ({selectedStudents.length} selected)</Label>
                  <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
                    {allStudents.filter(s => s.status === "active").map((student) => (
                      <div key={student.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={student.id}
                          checked={selectedStudents.some(s => s.id === student.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents([...selectedStudents, student])
                            } else {
                              setSelectedStudents(selectedStudents.filter(s => s.id !== student.id))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <label htmlFor={student.id} className="text-sm font-medium cursor-pointer">
                            {student.name}
                          </label>
                          <p className="text-xs text-muted-foreground">
                            {student.studentId} • {student.class}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStudents(allStudents.filter(s => s.status === "active"))}
                  >
                    Select All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedStudents([])}
                  >
                    Clear All
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-medium">Ready to Generate Questions?</h3>
              <p className="text-sm text-muted-foreground">
                {selectionMode === "specific" 
                  ? `Questions will be assigned to ${selectedStudents.length} selected students`
                  : questionCount === "1"
                  ? "Each student will receive a unique question at the same difficulty level"
                  : "All students will receive the same difficulty level with unique question variations"}
              </p>
            </div>

            <Button
              size="lg"
              className="gap-2"
              onClick={handleGenerate}
              disabled={generationState.status === "generating"}
            >
              {generationState.status === "generating" ? "Generating..." : "Generate Questions"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
