import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Custom theme matching our app colors
const customTheme = {
  ...vscDarkPlus,
  'pre[class*="language-"]': {
    ...vscDarkPlus['pre[class*="language-"]'],
    background: '#1a1f2e',
    padding: 0,
    margin: 0,
    fontSize: '0.92rem',
    lineHeight: '1.7'
  },
  'code[class*="language-"]': {
    ...vscDarkPlus['code[class*="language-"]'],
    background: '#1a1f2e',
    fontSize: '0.92rem',
    lineHeight: '1.7',
    fontFamily: "'JetBrains Mono', monospace"
  }
}

export default function CodeBlock({ code, language = 'sql', showLineNumbers = false }) {
  return (
    <div className="code-block">
      <SyntaxHighlighter
        language={language}
        style={customTheme}
        showLineNumbers={showLineNumbers}
        customStyle={{
          background: '#1a1f2e',
          padding: '1.25rem',
          margin: 0,
          borderRadius: 0,
          fontSize: '0.92rem'
        }}
        codeTagProps={{
          style: {
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.92rem'
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
