"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, BookOpen, Tag, Users, Clock, TrendingUp } from "lucide-react"

interface Topic {
  id: string
  name: string
  description: string
  subject: string
  difficulty: "beginner" | "intermediate" | "advanced"
  tags: string[]
  questionsCount: number
  studentsAssigned: number
  lastUsed: string
  createdAt: string
}

interface Subject {
  id: string
  name: string
  description: string
  color: string
  topicsCount: number
  totalQuestions: number
  createdAt: string
}

export function TopicManagement() {
  const [activeTab, setActiveTab] = useState("topics")
  const [isAddTopicOpen, setIsAddTopicOpen] = useState(false)
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Mathematics",
      description: "Algebra, Calculus, Statistics, and more",
      color: "bg-blue-500",
      topicsCount: 12,
      totalQuestions: 156,
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Physics",
      description: "Mechanics, Thermodynamics, Electromagnetism",
      color: "bg-green-500",
      topicsCount: 8,
      totalQuestions: 98,
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Chemistry",
      description: "Organic, Inorganic, Physical Chemistry",
      color: "bg-purple-500",
      topicsCount: 10,
      totalQuestions: 124,
      createdAt: "2024-01-25",
    },
  ])

  const [topics, setTopics] = useState<Topic[]>([
    {
      id: "1",
      name: "Linear Algebra",
      description: "Vectors, matrices, eigenvalues, and linear transformations",
      subject: "Mathematics",
      difficulty: "intermediate",
      tags: ["vectors", "matrices", "eigenvalues"],
      questionsCount: 24,
      studentsAssigned: 45,
      lastUsed: "2024-01-28",
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Thermodynamics",
      description: "Heat, work, energy, and entropy in physical systems",
      subject: "Physics",
      difficulty: "advanced",
      tags: ["heat", "energy", "entropy"],
      questionsCount: 18,
      studentsAssigned: 32,
      lastUsed: "2024-01-26",
      createdAt: "2024-01-20",
    },
    {
      id: "3",
      name: "Organic Reactions",
      description: "Mechanisms and synthesis in organic chemistry",
      subject: "Chemistry",
      difficulty: "advanced",
      tags: ["mechanisms", "synthesis", "reactions"],
      questionsCount: 21,
      studentsAssigned: 28,
      lastUsed: "2024-01-25",
      createdAt: "2024-01-22",
    },
  ])

  const [newTopic, setNewTopic] = useState({
    name: "",
    description: "",
    subject: "",
    difficulty: "beginner" as const,
    tags: "",
  })

  const [newSubject, setNewSubject] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  })

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddTopic = () => {
    if (newTopic.name && newTopic.subject) {
      const topic: Topic = {
        id: Date.now().toString(),
        name: newTopic.name,
        description: newTopic.description,
        subject: newTopic.subject,
        difficulty: newTopic.difficulty,
        tags: newTopic.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        questionsCount: 0,
        studentsAssigned: 0,
        lastUsed: "Never",
        createdAt: new Date().toISOString().split("T")[0],
      }
      setTopics([...topics, topic])
      setNewTopic({ name: "", description: "", subject: "", difficulty: "beginner", tags: "" })
      setIsAddTopicOpen(false)
    }
  }

  const handleAddSubject = () => {
    if (newSubject.name) {
      const subject: Subject = {
        id: Date.now().toString(),
        name: newSubject.name,
        description: newSubject.description,
        color: newSubject.color,
        topicsCount: 0,
        totalQuestions: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setSubjects([...subjects, subject])
      setNewSubject({ name: "", description: "", color: "bg-blue-500" })
      setIsAddSubjectOpen(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground">Topics & Subjects</h1>
          <p className="text-muted-foreground">Organize and manage your academic content</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddSubjectOpen} onOpenChange={setIsAddSubjectOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>Create a new subject category for organizing topics</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="subject-name">Subject Name</Label>
                  <Input
                    id="subject-name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="e.g., Mathematics, Physics, Chemistry"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-description">Description</Label>
                  <Textarea
                    id="subject-description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Brief description of the subject"
                  />
                </div>
                <div>
                  <Label htmlFor="subject-color">Color Theme</Label>
                  <Select
                    value={newSubject.color}
                    onValueChange={(value) => setNewSubject({ ...newSubject, color: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bg-blue-500">Blue</SelectItem>
                      <SelectItem value="bg-green-500">Green</SelectItem>
                      <SelectItem value="bg-purple-500">Purple</SelectItem>
                      <SelectItem value="bg-red-500">Red</SelectItem>
                      <SelectItem value="bg-orange-500">Orange</SelectItem>
                      <SelectItem value="bg-teal-500">Teal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubjectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddTopicOpen} onOpenChange={setIsAddTopicOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Topic</DialogTitle>
                <DialogDescription>Create a new topic within a subject</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="topic-name">Topic Name</Label>
                  <Input
                    id="topic-name"
                    value={newTopic.name}
                    onChange={(e) => setNewTopic({ ...newTopic, name: e.target.value })}
                    placeholder="e.g., Linear Algebra, Thermodynamics"
                  />
                </div>
                <div>
                  <Label htmlFor="topic-description">Description</Label>
                  <Textarea
                    id="topic-description"
                    value={newTopic.description}
                    onChange={(e) => setNewTopic({ ...newTopic, description: e.target.value })}
                    placeholder="Detailed description of the topic"
                  />
                </div>
                <div>
                  <Label htmlFor="topic-subject">Subject</Label>
                  <Select
                    value={newTopic.subject}
                    onValueChange={(value) => setNewTopic({ ...newTopic, subject: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topic-difficulty">Difficulty Level</Label>
                  <Select
                    value={newTopic.difficulty}
                    onValueChange={(value: any) => setNewTopic({ ...newTopic, difficulty: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topic-tags">Tags (comma-separated)</Label>
                  <Input
                    id="topic-tags"
                    value={newTopic.tags}
                    onChange={(e) => setNewTopic({ ...newTopic, tags: e.target.value })}
                    placeholder="e.g., vectors, matrices, eigenvalues"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTopicOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTopic}>Add Topic</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Search topics and subjects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-4">
          <div className="grid gap-4">
            {filteredTopics.map((topic) => (
              <Card key={topic.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {topic.name}
                      </CardTitle>
                      <CardDescription>{topic.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary">{topic.subject}</Badge>
                      <Badge className={getDifficultyColor(topic.difficulty)}>{topic.difficulty}</Badge>
                      <div className="flex gap-1">
                        {topic.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        {topic.questionsCount} questions
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {topic.studentsAssigned} students
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Last used: {topic.lastUsed}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map((subject) => (
              <Card key={subject.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${subject.color}`} />
                        {subject.name}
                      </CardTitle>
                      <CardDescription>{subject.description}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Topics</span>
                      <span className="font-medium">{subject.topicsCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Questions</span>
                      <span className="font-medium">{subject.totalQuestions}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="font-medium">{subject.createdAt}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
