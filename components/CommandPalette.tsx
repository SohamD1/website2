import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'

type Command = {
  id: string
  icon: string
  text: string
  action: () => void
}

const copy = {
  inputPlaceholder: 'Type a command...',
  closeHint: 'Press Escape to close',
  emptyResults: 'No commands found',
  commands: {
    home: 'Go to Home',
    projects: 'View Projects',
    x: 'View X',
    github: 'View GitHub',
    linkedin: 'View LinkedIn',
    resume: 'Download Resume',
  },
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
      icon: 'H',
      text: copy.commands.home,
      action: () => router.push('/'),
    },
    {
      id: 'projects',
      icon: 'P',
      text: copy.commands.projects,
      action: () => router.push('/projects'),
    },
    { id: 'x', icon: 'X', text: copy.commands.x, action: () => window.open('https://x.com/_sohamdave', '_blank') },
    {
      id: 'github',
      icon: 'G',
      text: copy.commands.github,
      action: () => window.open('https://github.com/SohamD1', '_blank'),
    },
    {
      id: 'linkedin',
      icon: 'L',
      text: copy.commands.linkedin,
      action: () => window.open('https://linkedin.com/in/sohamdave1', '_blank'),
    },
    {
      id: 'resume',
      icon: 'R',
      text: copy.commands.resume,
      action: () => window.open('/resume.pdf', '_blank'),
    },
  ]

  const filteredCommands = commands.filter((command) => command.text.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
        setQuery('')
        setSelectedIndex(0)
        return
      }

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
            placeholder={copy.inputPlaceholder}
            autoComplete="off"
          />
          <span className="command-hint">{copy.closeHint}</span>
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
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="command-item">
              <span className="command-icon">?</span>
              <span className="command-text">{copy.emptyResults}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
