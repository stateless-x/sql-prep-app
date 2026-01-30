import './Sidebar.css'

export default function Sidebar({
  chapters,
  currentChapter,
  setCurrentChapter,
  completedChapters,
  toggleChapterComplete,
  isOpen,
  setIsOpen,
  progress
}) {
  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">SQL Mastery</h1>
          <p className="sidebar-subtitle">Agoda BI Prep</p>

          <div className="progress-section">
            <div className="progress-label">
              <span>Progress</span>
              <span className="progress-percent">{progress}%</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>
            <p className="progress-text">
              {completedChapters.length} of {chapters.length} completed
            </p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {chapters.map((chapter) => {
            const isActive = currentChapter === chapter.id
            const isCompleted = completedChapters.includes(chapter.id)

            return (
              <div key={chapter.id} className="nav-item-wrapper">
                <button
                  className={`nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  onClick={() => {
                    setCurrentChapter(chapter.id)
                    if (window.innerWidth <= 768) setIsOpen(false)
                  }}
                >
                  <div className="nav-item-content">
                    <span className="nav-item-title">{chapter.title}</span>
                    <span className="nav-item-time">{chapter.time}</span>
                  </div>
                  {isCompleted && <span className="check-mark">✓</span>}
                </button>
              </div>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <div>
              <p className="tip-title">Study Tip</p>
              <p className="tip-text">Take 5-min breaks between chapters!</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
