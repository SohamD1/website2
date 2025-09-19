import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

interface Command {
  id: string
  icon: string
  text: string
  shortcut?: string
  action: () => void
}

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const commands: Command[] = [
    {
      id: 'home',
      icon: '🏠',
      text: 'Go to Home',
      action: () => router.push('/')
    },
    {
      id: 'projects',
      icon: '🚀',
      text: 'View Projects',
      action: () => router.push('/projects')
    },
    {
      id: 'email',
      icon: '✉️',
      text: 'Send Email',
      action: () => window.location.href = 'mailto:your.email@waterloo.ca'
    },
    {
      id: 'github',
      icon: '🐙',
      text: 'View GitHub',
      action: () => window.open('https://github.com/yourusername', '_blank')
    },
    {
      id: 'linkedin',
      icon: '💼',
      text: 'View LinkedIn',
      action: () => window.open('https://linkedin.com/in/yourusername', '_blank')
    },
    {
      id: 'resume',
      icon: '📄',
      text: 'Download Resume',
      action: () => window.open('/resume.pdf', '_blank')
    }
  ]

  const filteredCommands = commands.filter(command =>
    command.text.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open command palette
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setQuery('')
        setSelectedIndex(0)
        return
      }


      // Handle command palette navigation when open
      if (isOpen) {
        switch (e.key) {
          case 'Escape':
            e.preventDefault()
            setIsOpen(false)
            break
          case 'ArrowDown':
            e.preventDefault()
            setSelectedIndex(Math.min(selectedIndex + 1, filteredCommands.length - 1))
            break
          case 'ArrowUp':
            e.preventDefault()
            setSelectedIndex(Math.max(selectedIndex - 1, 0))
            break
          case 'Enter':
            e.preventDefault()
            if (filteredCommands[selectedIndex]) {
              filteredCommands[selectedIndex].action()
              setIsOpen(false)
            }
            break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const handleCommandClick = (command: Command) => {
    command.action()
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="command-palette active">
      <div className="command-palette-backdrop" onClick={() => setIsOpen(false)} />
      <div className="command-palette-modal">
        <div className="command-palette-header">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command..."
            autoComplete="off"
          />
          <span className="command-hint">Press Escape to close</span>
        </div>
        <div className="command-palette-results">
          {filteredCommands.map((command, index) => (
            <div
              key={command.id}
              className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
              onClick={() => handleCommandClick(command)}
            >
              <span className="command-icon">{command.icon}</span>
              <span className="command-text">{command.text}</span>
              {command.shortcut && (
                <span className="command-shortcut">{command.shortcut}</span>
              )}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="command-item">
              <span className="command-icon">🔍</span>
              <span className="command-text">No commands found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette