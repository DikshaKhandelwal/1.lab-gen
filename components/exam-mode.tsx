"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Clock, AlertTriangle, CheckCircle, ArrowRight, ArrowLeft, Flag, Timer, Lock } from "lucide-react"

interface Question {
  id: string
  question: string
  type: "multiple-choice" | "short-answer" | "essay" | "calculation"
  options?: string[]
  correctAnswer?: string
  points: number
}

interface ExamModeProps {
  questions: Question[]
  timeLimit: number // in minutes
  studentName: string
  onComplete: (answers: Record<string, string>, timeSpent: number) => void
  onExit: () => void
}

export function ExamMode({ questions, timeLimit, studentName, onComplete, onExit }: ExamModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60) // Convert to seconds
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())
  const [showWarning, setShowWarning] = useState(false)
  const [examStarted, setExamStarted] = useState(false)

  // Timer effect
  useEffect(() => {
    if (!examStarted || isSubmitted) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmit()
          return 0
        }
        if (prev <= 300 && !showWarning) {
          // 5 minutes warning
          setShowWarning(true)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examStarted, isSubmitted, showWarning])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const toggleFlag = (questionIndex: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex)
      } else {
        newSet.add(questionIndex)
      }
      return newSet
    })
  }

  const handleSubmit = () => {
    const timeSpent = timeLimit * 60 - timeRemaining
    setIsSubmitted(true)
    onComplete(answers, timeSpent)
  }

  const handleAutoSubmit = () => {
    const timeSpent = timeLimit * 60
    setIsSubmitted(true)
    onComplete(answers, timeSpent)
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const startExam = () => {
    setExamStarted(true)
  }

  if (!examStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Lock className="w-6 h-6" />
              Exam Mode
            </CardTitle>
            <CardDescription>You are about to start an exam session for {studentName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Important Exam Instructions:</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>
                      You have {timeLimit} minutes to complete {questions.length} questions
                    </li>
                    <li>Once started, the timer cannot be paused</li>
                    <li>You can navigate between questions and flag them for review</li>
                    <li>The exam will auto-submit when time expires</li>
                    <li>Make sure you have a stable internet connection</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Exam Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span>{timeLimit} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span>{questions.reduce((sum, q) => sum + q.points, 0)}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Question Types</h4>
                <div className="space-y-1 text-sm">
                  {Array.from(new Set(questions.map((q) => q.type))).map((type) => (
                    <div key={type} className="flex justify-between">
                      <span className="capitalize">{type.replace("-", " ")}:</span>
                      <span>{questions.filter((q) => q.type === type).length}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={onExit}>
                Cancel
              </Button>
              <Button onClick={startExam} className="gap-2">
                <Timer className="w-4 h-4" />
                Start Exam
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-chart-3 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Exam Submitted Successfully</h2>
            <p className="text-muted-foreground mb-4">Your answers have been recorded and will be reviewed.</p>
            <div className="grid gap-4 md:grid-cols-2 text-sm">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Questions Answered</p>
                <p className="text-lg">
                  {getAnsweredCount()} / {questions.length}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">Time Used</p>
                <p className="text-lg">{formatTime(timeLimit * 60 - timeRemaining)}</p>
              </div>
            </div>
            <Button onClick={onExit} className="mt-4">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-4">
      {/* Exam Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="destructive" className="gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(timeRemaining)}
              </Badge>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="secondary">{getAnsweredCount()} Answered</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSubmit}>
              Submit Exam
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Time Warning */}
      {showWarning && timeRemaining > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Warning: Only {Math.floor(timeRemaining / 60)} minutes remaining!</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Navigation */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 lg:grid-cols-3 gap-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`relative ${answers[questions[index].id] ? "bg-chart-3 hover:bg-chart-3/80" : ""}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                  {flaggedQuestions.has(index) && (
                    <Flag className="w-3 h-3 absolute -top-1 -right-1 text-destructive" />
                  )}
                </Button>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-chart-3 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-3 h-3 text-destructive" />
                <span>Flagged</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Question {currentQuestion + 1}
                <span className="ml-2 text-sm font-normal text-muted-foreground">({currentQ.points} points)</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(currentQuestion)}
                className={flaggedQuestions.has(currentQuestion) ? "text-destructive" : ""}
              >
                <Flag className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground leading-relaxed">{currentQ.question}</p>

            {/* Answer Input */}
            <div className="space-y-3">
              {currentQ.type === "multiple-choice" && currentQ.options && (
                <RadioGroup
                  value={answers[currentQ.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                >
                  {currentQ.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {(currentQ.type === "short-answer" || currentQ.type === "calculation") && (
                <Textarea
                  placeholder="Enter your answer..."
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="min-h-[100px]"
                />
              )}

              {currentQ.type === "essay" && (
                <Textarea
                  placeholder="Write your essay response..."
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="min-h-[200px]"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-sm text-muted-foreground">{answers[currentQ.id] ? "Answered" : "Not answered"}</div>

              <Button onClick={handleNext} disabled={currentQuestion === questions.length - 1} className="gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
