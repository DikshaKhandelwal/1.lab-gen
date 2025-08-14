"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExamMode } from "./exam-mode"
import { FriendlyMode } from "./friendly-mode"
import { Heart, AlertTriangle, Clock, Lightbulb, Target, Users, BookOpen, Timer, Smile } from "lucide-react"

interface Question {
  id: string
  question: string
  type: "multiple-choice" | "short-answer" | "essay" | "calculation"
  options?: string[]
  correctAnswer?: string
  points: number
  hints?: string[]
  explanation?: string
}

interface ModeSelectorProps {
  questions: Question[]
  studentName: string
  onComplete: (mode: string, answers: Record<string, string>, metadata: any) => void
  onExit: () => void
}

export function ModeSelector({ questions, studentName, onComplete, onExit }: ModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<"exam" | "friendly" | null>(null)
  const [timeLimit, setTimeLimit] = useState(60) // Default 60 minutes for exam

  const handleModeSelect = (mode: "exam" | "friendly") => {
    setSelectedMode(mode)
  }

  const handleComplete = (answers: Record<string, string>, metadata: any) => {
    onComplete(selectedMode!, answers, metadata)
  }

  if (selectedMode === "exam") {
    return (
      <ExamMode
        questions={questions}
        timeLimit={timeLimit}
        studentName={studentName}
        onComplete={handleComplete}
        onExit={() => setSelectedMode(null)}
      />
    )
  }

  if (selectedMode === "friendly") {
    return (
      <FriendlyMode
        questions={questions}
        studentName={studentName}
        onComplete={handleComplete}
        onExit={() => setSelectedMode(null)}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold">Choose Your Learning Mode</h1>
        <p className="text-muted-foreground">Select the experience that best fits your current needs, {studentName}</p>
      </div>

      {/* Mode Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Friendly Mode */}
        <Card className="relative overflow-hidden border-2 hover:border-accent transition-colors cursor-pointer group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-accent/20 to-transparent"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Heart className="w-6 h-6 text-accent" />
              </div>
              <div>
                <span className="text-xl">Friendly Mode</span>
                <Badge variant="secondary" className="ml-2">
                  Recommended
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>
              A supportive learning environment with hints, explanations, and encouragement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Lightbulb className="w-4 h-4 text-accent" />
                <span>Interactive hints and explanations</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Smile className="w-4 h-4 text-accent" />
                <span>Encouraging feedback and progress tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-accent" />
                <span>Learn as you go with detailed guidance</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-accent" />
                <span>No time pressure - learn at your pace</span>
              </div>
            </div>

            <Alert>
              <Heart className="h-4 w-4" />
              <AlertDescription>
                Perfect for practice sessions, homework, and building confidence in new topics.
              </AlertDescription>
            </Alert>

            <Button
              onClick={() => handleModeSelect("friendly")}
              className="w-full gap-2 group-hover:bg-accent group-hover:text-accent-foreground"
            >
              <Heart className="w-4 h-4" />
              Start Friendly Mode
            </Button>
          </CardContent>
        </Card>

        {/* Exam Mode */}
        <Card className="relative overflow-hidden border-2 hover:border-destructive transition-colors cursor-pointer group">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-destructive/20 to-transparent"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <span className="text-xl">Exam Mode</span>
                <Badge variant="outline" className="ml-2">
                  Formal Assessment
                </Badge>
              </div>
            </CardTitle>
            <CardDescription>A formal testing environment with time limits and structured evaluation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="w-4 h-4 text-destructive" />
                <span>Timed assessment with auto-submit</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-destructive" />
                <span>Formal evaluation and scoring</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-destructive" />
                <span>Question navigation and flagging</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span>No hints or explanations during exam</span>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Designed for official assessments, quizzes, and graded evaluations.</AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span>Time Limit:</span>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm"
                >
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                  <option value={90}>90 minutes</option>
                  <option value={120}>120 minutes</option>
                </select>
              </div>
            </div>

            <Button onClick={() => handleModeSelect("exam")} variant="destructive" className="w-full gap-2">
              <AlertTriangle className="w-4 h-4" />
              Start Exam Mode
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Question Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Session Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4 text-center">
            <div className="space-y-1">
              <p className="text-2xl font-bold">{questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{questions.reduce((sum, q) => sum + q.points, 0)}</p>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{Array.from(new Set(questions.map((q) => q.type))).length}</p>
              <p className="text-sm text-muted-foreground">Question Types</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">
                {Math.round(questions.reduce((sum, q) => sum + q.points, 0) / questions.length)}
              </p>
              <p className="text-sm text-muted-foreground">Avg Points</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="outline" onClick={onExit}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  )
}
