"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Download,
  Eye,
  Users,
  BookOpen,
  Target,
  Clock,
  BarChart3,
  FileText,
  ArrowLeft,
  Play,
  Heart,
  AlertTriangle,
} from "lucide-react"

interface GenerationResultsProps {
  results: {
    success: boolean
    allocations: Array<{
      studentId: string
      studentName: string
      questions: Array<{
        id: string
        question: string
        type: string
        options?: string[]
        points: number
        hints?: string[]
        explanation?: string
      }>
      difficulty: string
      generatedAt: string
    }>
    metadata: {
      generatedAt: string
      totalStudents: number
      questionsPerStudent: number
      totalQuestions: number
      averagePoints: number
      difficulty: string
      subject: string
      topic: string
      mode: string
    }
  }
  onGenerateNew: () => void
  onStartSession?: (studentName: string) => void
}

export function GenerationResults({ results, onGenerateNew, onStartSession }: GenerationResultsProps) {
  const [selectedStudent, setSelectedStudent] = useState(0)
  const { allocations, metadata } = results

  const exportToCSV = () => {
    const csvContent = [
      ["Student", "Task ID", "Lab Task", "Type", "Points", "Difficulty"],
      ...allocations.flatMap((allocation) =>
        allocation.questions.map((question) => [
          allocation.studentName,
          question.id,
          question.question.replace(/,/g, ";"), // Replace commas to avoid CSV issues
          question.type,
          question.points.toString(),
          allocation.difficulty,
        ]),
      ),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `lab-tasks-${metadata.subject}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportToPDF = () => {
    // In a real implementation, you'd use a PDF library like jsPDF
    alert("PDF export would be implemented with a library like jsPDF")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onGenerateNew}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Generate New
          </Button>
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground">Generation Results</h1>
            <p className="text-muted-foreground">
              Successfully generated {metadata.totalQuestions} lab tasks for {metadata.totalStudents} students
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            Completed
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {new Date(metadata.generatedAt).toLocaleTimeString()}
          </Badge>
          {metadata.mode === "friendly" ? (
            <Badge variant="secondary" className="gap-1">
              <Heart className="w-3 h-3" />
              Friendly Mode
            </Badge>
          ) : (
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="w-3 h-3" />
              Exam Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{metadata.totalStudents}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <div>
                <p className="text-2xl font-bold">{metadata.questionsPerStudent}</p>
                <p className="text-sm text-muted-foreground">Lab Tasks Each</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-chart-3" />
              <div>
                <p className="text-2xl font-bold capitalize">{metadata.difficulty}</p>
                <p className="text-sm text-muted-foreground">Difficulty</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-chart-4" />
              <div>
                <p className="text-2xl font-bold">{metadata.averagePoints}</p>
                <p className="text-sm text-muted-foreground">Avg Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Sessions */}
      {onStartSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Student Sessions
            </CardTitle>
            <CardDescription>Launch interactive sessions for individual students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {allocations.slice(0, 6).map((allocation) => (
                <div key={allocation.studentId} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{allocation.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {allocation.questions.length} lab tasks • {allocation.difficulty}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => onStartSession(allocation.studentName)}>
                    <Play className="w-4 h-4 mr-1" />
                    Start
                  </Button>
                </div>
              ))}
            </div>
            {allocations.length > 6 && (
              <p className="text-sm text-muted-foreground mt-3 text-center">
                +{allocations.length - 6} more students available
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Options
          </CardTitle>
          <CardDescription>Download your generated lab tasks in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportToCSV}>
              <FileText className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={exportToPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Question Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Lab Task Preview
          </CardTitle>
          <CardDescription>Review generated lab tasks for each student</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={selectedStudent.toString()}
            onValueChange={(value) => setSelectedStudent(Number.parseInt(value))}
          >
            <div className="mb-4">
              <ScrollArea className="w-full">
                <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                  {allocations.slice(0, 10).map((allocation, index) => (
                    <TabsTrigger
                      key={allocation.studentId}
                      value={index.toString()}
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      {allocation.studentName}
                    </TabsTrigger>
                  ))}
                  {allocations.length > 10 && (
                    <div className="px-3 py-1.5 text-sm text-muted-foreground">+{allocations.length - 10} more</div>
                  )}
                </TabsList>
              </ScrollArea>
            </div>

            {allocations.slice(0, 10).map((allocation, index) => (
              <TabsContent key={allocation.studentId} value={index.toString()} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{allocation.studentName}</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {allocation.questions.length} Lab Tasks • {allocation.difficulty}
                    </Badge>
                    {onStartSession && (
                      <Button size="sm" onClick={() => onStartSession(allocation.studentName)}>
                        <Play className="w-4 h-4 mr-1" />
                        Start Session
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {allocation.questions.map((question, qIndex) => (
                    <Card key={question.id} className="border-l-4 border-l-primary">
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm text-muted-foreground">
                              Lab Task {qIndex + 1} • {question.type} • {question.points} points
                            </h4>
                          </div>

                          <p className="text-foreground">{question.question}</p>

                          {question.options && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Options:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {question.options.map((option, optIndex) => (
                                  <li key={optIndex}>{option}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {question.hints && metadata.mode === "friendly" && (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-muted-foreground">Hints:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-accent-foreground">
                                {question.hints.map((hint, hintIndex) => (
                                  <li key={hintIndex}>{hint}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
