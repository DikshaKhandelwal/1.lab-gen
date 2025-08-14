"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { QuestionGenerator } from "@/components/question-generator"
import { StudentManagement } from "@/components/student-management"
import { TopicManagement } from "@/components/topic-management"
import { Analytics } from "@/components/analytics"
import { Settings } from "@/components/settings"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("generator")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "generator":
        return <QuestionGenerator />
      case "students":
        return <StudentManagement />
      case "topics":
        return <TopicManagement />
      case "analytics":
        return <Analytics />
      case "settings":
        return <Settings />
      default:
        return <QuestionGenerator />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />

      <main className="lg:pl-64">
        <div className="p-6 lg:p-8">{renderActiveSection()}</div>
      </main>
    </div>
  )
}
