import { useState, useEffect, useRef, useCallback, useMemo } from 'react'

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
    x: 'View X',
    github: 'View GitHub',
    linkedin: 'View LinkedIn',
  },
}

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = useMemo(
    () => [
      {
        id: 'home',
        icon: 'H',
        text: copy.commands.home,
        action: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
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
    ],
    []
  )

  const filteredCommands = useMemo(
    () => commands.filter((command) => command.text.toLowerCase().includes(query.toLowerCase())),
    [commands, query]
  )

  const filteredCommandsRef = useRef(filteredCommands)
  const selectedIndexRef = useRef(selectedIndex)

  useEffect(() => {
    filteredCommandsRef.current = filteredCommands
  }, [filteredCommands])

  useEffect(() => {
    selectedIndexRef.current = selectedIndex
  }, [selectedIndex])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
        setQuery('')
        setSelectedIndex(0)
        return
      }

      if (!isOpen) return

      switch (e.key) {
        case 'Escape':
          e.preventDefault()
          setIsOpen(false)
          break
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommandsRef.current.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          {
            const cmd = filteredCommandsRef.current[selectedIndexRef.current]
            if (cmd) {
              cmd.action()
              setIsOpen(false)
            }
          }
          break
      }
    },
    [isOpen]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

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
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
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
