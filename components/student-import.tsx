"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Users, AlertCircle, CheckCircle } from "lucide-react"

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

interface StudentImportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (students: Student[]) => void
}

export function StudentImport({ isOpen, onClose, onImport }: StudentImportProps) {
  const [importData, setImportData] = useState("")
  const [parsedStudents, setParsedStudents] = useState<Student[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [step, setStep] = useState<"input" | "preview" | "complete">("input")

  const sampleCSV = `Name,Email,Student ID,Class
Alice Johnson,alice.johnson@university.edu,STU001,Physics 101
Bob Smith,bob.smith@university.edu,STU002,Physics 101
Carol Davis,carol.davis@university.edu,STU003,Chemistry 201`

  const parseCSV = () => {
    const lines = importData.trim().split("\n")
    if (lines.length < 2) {
      setErrors(["CSV must contain at least a header row and one data row"])
      return
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const requiredHeaders = ["name", "email", "student id", "class"]
    const missingHeaders = requiredHeaders.filter((h) => !headers.some((header) => header.includes(h.replace(" ", ""))))

    if (missingHeaders.length > 0) {
      setErrors([`Missing required columns: ${missingHeaders.join(", ")}`])
      return
    }

    const students: Student[] = []
    const newErrors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())

      if (values.length !== headers.length) {
        newErrors.push(`Row ${i + 1}: Column count mismatch`)
        continue
      }

      const nameIndex = headers.findIndex((h) => h.includes("name"))
      const emailIndex = headers.findIndex((h) => h.includes("email"))
      const studentIdIndex = headers.findIndex((h) => h.includes("student") && h.includes("id"))
      const classIndex = headers.findIndex((h) => h.includes("class"))

      const name = values[nameIndex]
      const email = values[emailIndex]
      const studentId = values[studentIdIndex]
      const studentClass = values[classIndex]

      if (!name || !email || !studentId || !studentClass) {
        newErrors.push(`Row ${i + 1}: Missing required data`)
        continue
      }

      if (!email.includes("@")) {
        newErrors.push(`Row ${i + 1}: Invalid email format`)
        continue
      }

      students.push({
        id: Date.now().toString() + i,
        name,
        email,
        studentId,
        class: studentClass,
        status: "active",
        joinedDate: new Date().toISOString().split("T")[0],
        totalQuestions: 0,
        completedQuestions: 0,
        averageScore: 0,
        lastActivity: new Date().toISOString().split("T")[0],
      })
    }

    setErrors(newErrors)
    setParsedStudents(students)
    setStep("preview")
  }

  const handleImport = () => {
    onImport(parsedStudents)
    setStep("complete")
    setTimeout(() => {
      onClose()
      setStep("input")
      setImportData("")
      setParsedStudents([])
      setErrors([])
    }, 2000)
  }

  const reset = () => {
    setStep("input")
    setImportData("")
    setParsedStudents([])
    setErrors([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Students
          </DialogTitle>
          <DialogDescription>Import multiple students from CSV data</DialogDescription>
        </DialogHeader>

        {step === "input" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>CSV Data</Label>
              <Textarea
                placeholder="Paste your CSV data here..."
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Required columns: Name, Email, Student ID, Class</p>
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">Sample CSV format</summary>
                    <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">{sampleCSV}</pre>
                  </details>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={parseCSV} disabled={!importData.trim()}>
                Parse CSV
              </Button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Import Preview</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Users className="w-3 h-3" />
                  {parsedStudents.length} Students
                </Badge>
                {errors.length > 0 && (
                  <Badge variant="destructive" className="gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.length} Errors
                  </Badge>
                )}
              </div>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p className="font-medium">Import Errors:</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="max-h-64 overflow-y-auto border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Student ID</th>
                    <th className="text-left p-2">Class</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedStudents.map((student, index) => (
                    <tr key={index} className="border-t">
                      <td className="p-2">{student.name}</td>
                      <td className="p-2">{student.email}</td>
                      <td className="p-2">{student.studentId}</td>
                      <td className="p-2">{student.class}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={reset}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={parsedStudents.length === 0}>
                Import {parsedStudents.length} Students
              </Button>
            </div>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-chart-3 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Import Successful!</h3>
            <p className="text-muted-foreground">Successfully imported {parsedStudents.length} students</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
