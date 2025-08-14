"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Heart,
  Lightbulb,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Star,
  HelpCircle,
  ChevronDown,
  Trophy,
  Target,
  Smile,
} from "lucide-react"

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

interface FriendlyModeProps {
  questions: Question[]
  studentName: string
  onComplete: (answers: Record<string, string>, progress: any) => void
  onExit: () => void
}

export function FriendlyMode({ questions, studentName, onComplete, onExit }: FriendlyModeProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showHints, setShowHints] = useState<Record<string, boolean>>({})
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({})
  const [encouragementShown, setEncouragementShown] = useState<Record<number, boolean>>({})
  const [streak, setStreak] = useState(0)
  const [totalScore, setTotalScore] = useState(0)

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))

    // Show encouragement for first answer
    if (!encouragementShown[currentQuestion] && answer.trim()) {
      setEncouragementShown((prev) => ({ ...prev, [currentQuestion]: true }))
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      // Update streak and score (simplified logic)
      if (answers[questions[currentQuestion].id]) {
        setStreak((prev) => prev + 1)
        setTotalScore((prev) => prev + questions[currentQuestion].points)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const toggleHints = (questionId: string) => {
    setShowHints((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanation((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const handleComplete = () => {
    const progress = {
      streak,
      totalScore,
      hintsUsed: Object.keys(showHints).filter((id) => showHints[id]).length,
      questionsAttempted: Object.keys(answers).length,
    }
    onComplete(answers, progress)
  }

  const getProgressPercentage = () => {
    return (Object.keys(answers).length / questions.length) * 100
  }

  const getEncouragementMessage = () => {
    const progress = getProgressPercentage()
    if (progress === 0) return "Let's get started! Take your time and think through each question."
    if (progress < 25) return "Great start! You're building momentum."
    if (progress < 50) return "You're doing wonderfully! Keep up the excellent work."
    if (progress < 75) return "Fantastic progress! You're more than halfway there."
    if (progress < 100) return "Almost there! You're doing amazing work."
    return "Congratulations! You've completed all questions!"
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6 bg-slate-900 min-h-screen p-6 text-slate-100">
      {/* Friendly Header */}
      <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-slate-600">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" />
                <span className="font-medium text-slate-100">Hi {studentName}!</span>
              </div>
              <Badge variant="secondary" className="gap-1 bg-slate-700 text-slate-200 border-slate-600">
                <Star className="w-3 h-3" />
                {streak} streak
              </Badge>
              <Badge variant="outline" className="gap-1 border-slate-600 text-slate-300">
                <Trophy className="w-3 h-3" />
                {totalScore} points
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={onExit}
              className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent"
            >
              Save & Exit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress and Encouragement */}
      <Card className="bg-slate-800 border-slate-600">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-slate-100">Your Progress</h3>
              <span className="text-sm text-slate-400">
                {Object.keys(answers).length} of {questions.length} questions
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="w-full bg-slate-700" />
            <Alert className="bg-slate-700 border-slate-600">
              <Smile className="h-4 w-4 text-emerald-400" />
              <AlertDescription className="text-slate-200">{getEncouragementMessage()}</AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question Overview */}
        <Card className="lg:col-span-1 bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-slate-100">
              <BookOpen className="w-4 h-4" />
              Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "ghost"}
                  size="sm"
                  className={`w-full justify-start ${
                    currentQuestion === index
                      ? "bg-slate-600 text-slate-100 hover:bg-slate-500"
                      : answers[questions[index].id]
                        ? "bg-emerald-900/40 hover:bg-emerald-900/60 text-slate-200"
                        : "text-slate-300 hover:bg-slate-700"
                  }`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  <div className="flex items-center gap-2">
                    <span>{index + 1}</span>
                    {answers[questions[index].id] && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </div>
                </Button>
              ))}
            </div>

            {currentQuestion === questions.length - 1 && Object.keys(answers).length === questions.length && (
              <Button onClick={handleComplete} className="w-full mt-4 gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Trophy className="w-4 h-4" />
                Complete Practice
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Current Question */}
        <Card className="lg:col-span-3 bg-slate-800 border-slate-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-slate-100">
                <Target className="w-5 h-5" />
                Question {currentQuestion + 1}
                <Badge variant="outline" className="border-slate-600 text-slate-300">
                  {currentQ.points} points
                </Badge>
              </CardTitle>
              <Badge variant="secondary" className="capitalize bg-slate-700 text-slate-200 border-slate-600">
                {currentQ.type.replace("-", " ")}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-100 leading-relaxed text-lg">{currentQ.question}</p>

            {/* Answer Input */}
            <div className="space-y-4">
              {currentQ.type === "multiple-choice" && currentQ.options && (
                <RadioGroup
                  value={answers[currentQ.id] || ""}
                  onValueChange={(value) => handleAnswerChange(currentQ.id, value)}
                >
                  {currentQ.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-3 rounded-lg border border-slate-600 hover:bg-slate-700/50"
                    >
                      <RadioGroupItem
                        value={option}
                        id={`option-${index}`}
                        className="border-slate-500 text-slate-100"
                      />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base text-slate-200">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {(currentQ.type === "short-answer" || currentQ.type === "calculation") && (
                <Textarea
                  placeholder="Take your time and write your answer here..."
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="min-h-[120px] text-base bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              )}

              {currentQ.type === "essay" && (
                <Textarea
                  placeholder="Express your thoughts clearly. Remember, there's no rush!"
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  className="min-h-[200px] text-base bg-slate-700 border-slate-600 text-slate-100 placeholder:text-slate-400"
                />
              )}
            </div>

            {/* Encouragement for answering */}
            {encouragementShown[currentQuestion] && (
              <Alert className="bg-emerald-900/30 border-emerald-700">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <AlertDescription className="text-slate-200">
                  Great job getting started on this question! Take your time to think it through.
                </AlertDescription>
              </Alert>
            )}

            {/* Hints Section */}
            {currentQ.hints && currentQ.hints.length > 0 && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                    onClick={() => toggleHints(currentQ.id)}
                  >
                    <Lightbulb className="w-4 h-4" />
                    Need a hint?
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card className="bg-amber-900/20 border-amber-700/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2 text-slate-100">
                          <Lightbulb className="w-4 h-4 text-amber-400" />
                          Helpful Hints
                        </h4>
                        <ul className="space-y-2">
                          {currentQ.hints.map((hint, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              <span className="text-sm text-slate-300">{hint}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Explanation Section */}
            {currentQ.explanation && (
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600"
                    onClick={() => toggleExplanation(currentQ.id)}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Learn more about this topic
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4">
                  <Card className="bg-blue-900/20 border-blue-700/50">
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2 text-slate-100">
                          <BookOpen className="w-4 h-4 text-blue-400" />
                          Background Information
                        </h4>
                        <p className="text-sm leading-relaxed text-slate-300">{currentQ.explanation}</p>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-600">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="gap-2 bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600 disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="text-center">
                {answers[currentQ.id] ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Nice work!</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Take your time</span>
                )}
              </div>

              <Button
                onClick={handleNext}
                disabled={currentQuestion === questions.length - 1}
                className="gap-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
              >
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
