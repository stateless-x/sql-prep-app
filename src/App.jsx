import { useState, useEffect } from 'react'
import './App.css'
import Sidebar from './components/Sidebar'
import QuickDiagnostic from './components/QuickDiagnostic'
import StudyPlan from './components/StudyPlan'
import SQLFundamentals from './components/SQLFundamentals'
import GroupBy from './components/GroupBy'
import WhereHaving from './components/WhereHaving'
import Joins from './components/Joins'
import WindowFunctionsPatterns from './components/WindowFunctionsPatterns'
import InterviewPatterns from './components/InterviewPatterns'
import QueryOptimization from './components/QueryOptimization'
import SQLReference from './components/SQLReference'
import MockTest from './components/MockTest'

const CHAPTERS = [
  { id: 'diagnostic', title: '🎯 Quick Diagnostic', component: QuickDiagnostic, time: '5 min' },
  { id: 'plan', title: '📅 Study Plan', component: StudyPlan, time: '5 min' },
  { id: 'fundamentals', title: '🧠 SQL Fundamentals', component: SQLFundamentals, time: '25 min' },
  { id: 'groupby', title: '📊 GROUP BY & Aggregates', component: GroupBy, time: '15 min' },
  { id: 'where-having', title: '⚖️ WHERE vs HAVING', component: WhereHaving, time: '10 min' },
  { id: 'joins', title: '🔗 JOINs', component: Joins, time: '20 min' },
  { id: 'window', title: '🪟 Window Functions & Patterns', component: WindowFunctionsPatterns, time: '40 min' },
  { id: 'interview-patterns', title: '🎯 Interview Patterns & Strategy', component: InterviewPatterns, time: '40 min' },
  { id: 'query-optimization', title: '🚀 Query Optimization', component: QueryOptimization, time: '15 min' },
  { id: 'sql-reference', title: '📋 SQL Reference & Cheatsheet', component: SQLReference, time: '35 min' },
  { id: 'mock', title: '🎬 Mock Test', component: MockTest, time: '60 min' }
]

function App() {
  const [currentChapter, setCurrentChapter] = useState('diagnostic')
  const [completedChapters, setCompletedChapters] = useState(() => {
    const saved = localStorage.getItem('completedChapters')
    return saved ? JSON.parse(saved) : []
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    localStorage.setItem('completedChapters', JSON.stringify(completedChapters))
  }, [completedChapters])

  const toggleChapterComplete = (chapterId) => {
    setCompletedChapters(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    )
  }

  const CurrentComponent = CHAPTERS.find(ch => ch.id === currentChapter)?.component || QuickDiagnostic
  const progress = Math.round((completedChapters.length / CHAPTERS.length) * 100)

  return (
    <div className="app">
      <Sidebar
        chapters={CHAPTERS}
        currentChapter={currentChapter}
        setCurrentChapter={setCurrentChapter}
        completedChapters={completedChapters}
        toggleChapterComplete={toggleChapterComplete}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        progress={progress}
      />

      <main className={`main-content ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <button
          className="mobile-menu-btn"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? '✕' : '☰'}
        </button>

        <div className="content-wrapper">
          <CurrentComponent
            onComplete={() => toggleChapterComplete(currentChapter)}
            isCompleted={completedChapters.includes(currentChapter)}
          />
        </div>
      </main>
    </div>
  )
}

export default App
