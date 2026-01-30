import { useState } from 'react'

export default function Quiz({ question, code, options, explanation, onAnswer, showAnswer }) {
  const [selected, setSelected] = useState(null)

  const handleSelect = (option) => {
    setSelected(option.id)
    onAnswer(option)
  }

  return (
    <div className="card">
      <div className="quiz-question">{question}</div>

      {code && (
        <div className="code-block">
          <pre><code>{code}</code></pre>
        </div>
      )}

      <div className="quiz-options">
        {options.map((option) => {
          let className = 'quiz-option'
          if (selected === option.id) className += ' selected'
          if (showAnswer && option.correct) className += ' correct'
          if (showAnswer && selected === option.id && !option.correct) className += ' incorrect'

          return (
            <button
              key={option.id}
              className={className}
              onClick={() => handleSelect(option)}
              disabled={showAnswer}
            >
              <strong>{option.id.toUpperCase()})</strong> {option.text}
            </button>
          )
        })}
      </div>

      {showAnswer && explanation && (
        <div className="quiz-explanation">
          <strong>💡 Explanation:</strong><br />
          {explanation}
        </div>
      )}
    </div>
  )
}
