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

export function saveAllocationHistory(metadata: any): void {
  try {
    const existingHistory = localStorage.getItem('allocationHistory')
    const history: AllocationHistory[] = existingHistory ? JSON.parse(existingHistory) : []
    
    const newAllocation: AllocationHistory = {
      id: Date.now().toString(),
      generatedAt: metadata.generatedAt,
      subject: metadata.subject,
      topic: metadata.topic || '',
      difficulty: metadata.difficulty,
      mode: metadata.mode,
      totalStudents: metadata.totalStudents,
      questionsPerStudent: metadata.questionsPerStudent,
      studentsAssigned: metadata.studentsAssigned || []
    }
    
    history.unshift(newAllocation) // Add to beginning
    
    // Keep only last 50 allocations
    const limitedHistory = history.slice(0, 50)
    
    localStorage.setItem('allocationHistory', JSON.stringify(limitedHistory))
  } catch (error) {
    console.error('Failed to save allocation history:', error)
  }
}

export function getAllocationHistory(): AllocationHistory[] {
  try {
    const history = localStorage.getItem('allocationHistory')
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Failed to load allocation history:', error)
    return []
  }
}

export function clearAllocationHistory(): void {
  try {
    localStorage.removeItem('allocationHistory')
  } catch (error) {
    console.error('Failed to clear allocation history:', error)
  }
}
