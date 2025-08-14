import { type NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface GenerationRequest {
  mode: "exam" | "friendly"
  difficulty: "easy" | "medium" | "hard"
  subject: string
  topic: string
  context?: string
  studentCount: number
  questionCount?: number // Made optional with default of 1
  students?: Array<{
    id: string
    name: string
    email: string
    studentId: string
    class: string
    status: "active" | "inactive"
  }>
}

interface Question {
  id: string
  question: string
  type: "practical-task" | "coding-exercise" | "implementation" | "design-task" | "analysis-task" | "multiple-choice" | "short-answer" | "essay" | "calculation"
  options?: string[]
  correctAnswer?: string
  points: number
  explanation?: string
  hints?: string[]
}

interface StudentAllocation {
  studentId: string
  studentName: string
  questions: Question[]
  difficulty: string
  generatedAt: string
}

async function generateAIQuestions(
  subject: string,
  topic: string,
  difficulty: string,
  mode: string,
  count: number,
  context?: string,
): Promise<Question[]> {
  const difficultyDescriptions = {
    easy: "basic implementation with clear step-by-step guidance",
    medium: "intermediate tasks requiring problem-solving and application",
    hard: "complex projects involving multiple concepts and advanced implementation",
  }

  const modeInstructions = {
    exam: "practical lab tasks and hands-on exercises for formal assessment",
    friendly: "guided lab exercises with step-by-step instructions and helpful tips",
  }

  const systemPrompt = `You are an expert lab instructor creating practical, hands-on ${modeInstructions[mode as keyof typeof modeInstructions]} for ${subject}.

Generate ${count} unique LAB TASKS/EXERCISES about "${topic}" at ${difficulty} level (${difficultyDescriptions[difficulty as keyof typeof difficultyDescriptions]}).

${context ? `Additional context: ${context}` : ""}

IMPORTANT: Create PRACTICAL LAB TASKS, not theoretical questions. Each task should:
- Be a specific, actionable exercise or project
- Include clear deliverables and objectives
- Be hands-on and practical
- Specify what students need to create, implement, or demonstrate

For each lab task, provide:
1. A clear task description with specific objectives and deliverables
2. Task type: "practical-task", "coding-exercise", "implementation", "design-task", or "analysis-task"
3. For coding tasks: specify expected output or functionality
4. Point value (easy: 10-15, medium: 20-30, hard: 35-50 points for substantial lab work)
${mode === "friendly" ? "5. 3-4 helpful implementation hints\n6. Brief guidance on approach or methodology" : ""}

IMPORTANT: Return ONLY valid JSON in this exact format, no additional text:
{
  "questions": [
    {
      "question": "Lab Task: [Specific practical task with clear deliverables]",
      "type": "practical-task",
      "options": null,
      "correctAnswer": null,
      "points": 25,
      "hints": ["Implementation hint 1", "Approach hint 2", "Testing suggestion 3"],
      "explanation": "Brief methodology guidance"
    }
  ]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate ${count} practical lab tasks/exercises about ${topic} in ${subject} at ${difficulty} difficulty level. Each task should be hands-on and specify clear deliverables.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      console.error("No response from OpenAI")
      throw new Error("No response from OpenAI")
    }

    let parsed
    try {
      // Clean the response - remove any markdown formatting or extra text
      const cleanResponse = response
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()
      parsed = JSON.parse(cleanResponse)
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError)
      console.error("Raw response:", response)
      throw new Error("Invalid JSON response from OpenAI")
    }

    // Validate the response structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      console.error("Invalid response structure:", parsed)
      throw new Error("Invalid response structure from OpenAI")
    }

    const questions: Question[] = parsed.questions.map((q: any, index: number) => ({
      id: Math.random().toString(36).substr(2, 9),
      question: q.question || `Lab Task ${index + 1}: Implement a practical exercise for ${topic}`,
      type: q.type || "practical-task",
      options: q.options,
      correctAnswer: q.correctAnswer,
      points: q.points || (difficulty === "easy" ? 15 : difficulty === "medium" ? 25 : 40),
      explanation: q.explanation,
      hints: q.hints,
    }))

    return questions
  } catch (error) {
    console.error("OpenAI generation error:", error)
    // Fallback to template-based generation
    return generateFallbackQuestions(subject, topic, difficulty, mode, count)
  }
}

function generateFallbackQuestions(
  subject: string,
  topic: string,
  difficulty: string,
  mode: string,
  count: number,
): Question[] {
  const questions: Question[] = []

  for (let i = 0; i < count; i++) {
    const points = difficulty === "easy" ? 15 : difficulty === "medium" ? 25 : 40

    questions.push({
      id: Math.random().toString(36).substr(2, 9),
      question: `Lab Task: Create a practical ${difficulty} level implementation demonstrating ${topic} concepts in ${subject}. Provide complete working solution with documentation.`,
      type: "practical-task",
      points,
      explanation: mode === "friendly" ? `This lab task focuses on hands-on implementation of ${topic} concepts in ${subject}. Create a working solution and document your approach.` : undefined,
      hints: mode === "friendly" ? ["Start with basic setup and requirements", "Break the task into smaller components", "Test each component thoroughly", "Document your implementation approach"] : undefined,
    })
  }

  return questions
}

async function generateRobustAllocation(
  studentCount: number,
  questionCount: number,
  difficulty: string,
  subject: string,
  topic: string,
  mode: string,
  context?: string,
  students?: Array<{
    id: string
    name: string
    email: string
    studentId: string
    class: string
    status: "active" | "inactive"
  }>,
): Promise<StudentAllocation[]> {
  const allocations: StudentAllocation[] = []

  // Generate enough unique questions to ensure each student gets different ones
  const totalQuestionsNeeded = studentCount * questionCount
  const questionPool = await generateAIQuestions(
    subject,
    topic,
    difficulty,
    mode,
    Math.max(totalQuestionsNeeded, studentCount * 2), // Ensure enough variety
    context,
  )

  for (let studentIndex = 0; studentIndex < studentCount; studentIndex++) {
    const studentQuestions: Question[] = []

    // Use actual student data if provided, otherwise generate generic data
    const actualStudent = students?.[studentIndex]
    const studentId = actualStudent?.studentId || `student_${studentIndex + 1}`
    const studentName = actualStudent?.name || `Student ${studentIndex + 1}`

    // For lab questions (typically 1 per student), ensure each student gets a unique question
    for (let i = 0; i < questionCount; i++) {
      const questionIndex = (studentIndex + i * studentCount) % questionPool.length
      const baseQuestion = questionPool[questionIndex]

      // Create a unique question for this student
      const questionVariation: Question = {
        ...baseQuestion,
        id: `${baseQuestion.id}_${studentId}`,
      }

      studentQuestions.push(questionVariation)
    }

    allocations.push({
      studentId,
      studentName,
      questions: studentQuestions,
      difficulty,
      generatedAt: new Date().toISOString(),
    })
  }

  return allocations
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerationRequest = await request.json()
    const {
      mode,
      difficulty,
      subject,
      topic,
      context,
      studentCount,
      questionCount = 1, // Default to 1 question per student for lab questions
      students,
    } = body

    // Validate input
    if (!subject || !difficulty || studentCount <= 0 || questionCount <= 0) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    if (studentCount > 100) {
      return NextResponse.json({ error: "Maximum 100 students allowed" }, { status: 400 })
    }

    if (questionCount > 10) {
      // Reduced max questions for lab setting
      return NextResponse.json({ error: "Maximum 10 questions per student allowed" }, { status: 400 })
    }

    const allocations = await generateRobustAllocation(
      studentCount,
      questionCount,
      difficulty,
      subject,
      topic || "",
      mode,
      context,
      students,
    )

    // Calculate statistics
    const totalQuestions = allocations.reduce((sum, alloc) => sum + alloc.questions.length, 0)
    const averagePoints =
      allocations.reduce((sum, alloc) => sum + alloc.questions.reduce((qSum, q) => qSum + q.points, 0), 0) /
      allocations.length

    const response = {
      success: true,
      allocations,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalStudents: studentCount,
        questionsPerStudent: questionCount,
        totalQuestions,
        averagePoints: Math.round(averagePoints * 100) / 100,
        difficulty,
        subject,
        topic,
        mode,
        aiGenerated: true,
        studentsAssigned: students ? students.map(s => ({ id: s.studentId, name: s.name, class: s.class })) : null,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Question generation error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
