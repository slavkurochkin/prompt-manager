import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { 
  FileText, 
  Plus,
  Search,
  Pin,
  PinOff,
  Trash2,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  FolderOpen,
  Palette,
  Link2,
  ExternalLink,
  ChevronLeft,
  MoreHorizontal,
  X,
  Clock,
  Eye,
  Pencil
} from 'lucide-react'

const API_BASE = '/api/notes'

// Available note colors
const NOTE_COLORS = [
  { id: 'default', name: 'Default', bg: 'var(--bg-card)', border: 'var(--border-primary)' },
  { id: 'amber', name: 'Amber', bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.25)' },
  { id: 'emerald', name: 'Emerald', bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.25)' },
  { id: 'sky', name: 'Sky', bg: 'rgba(14, 165, 233, 0.08)', border: 'rgba(14, 165, 233, 0.25)' },
  { id: 'violet', name: 'Violet', bg: 'rgba(139, 92, 246, 0.08)', border: 'rgba(139, 92, 246, 0.25)' },
  { id: 'rose', name: 'Rose', bg: 'rgba(244, 63, 94, 0.08)', border: 'rgba(244, 63, 94, 0.25)' },
]

function Notes({ onNavigateBack }) {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [linkText, setLinkText] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  
  const titleInputRef = useRef(null)
  const contentRef = useRef(null)
  const saveTimeoutRef = useRef(null)

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API_BASE)
      if (!response.ok) throw new Error('Failed to fetch notes')
      const data = await response.json()
      setNotes(data)
      
      // Select first note if none selected
      if (data.length > 0 && !selectedNote) {
        setSelectedNote(data[0])
      }
    } catch (err) {
      showToast('Unable to load notes', 'error')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [showToast])

  // Load notes on mount
  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  // Auto-save note changes
  const saveNote = useCallback(async (note) => {
    if (!note) return
    
    try {
      setSaving(true)
      const response = await fetch(`${API_BASE}/${note.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      })

      if (!response.ok) throw new Error('Failed to save note')

      const updatedNote = await response.json()
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n))
    } catch (err) {
      showToast('Failed to save note', 'error')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }, [showToast])

  // Debounced save
  const debouncedSave = useCallback((note) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveNote(note)
    }, 800)
  }, [saveNote])

  // Create new note
  const createNote = async () => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled', content: '' }),
      })

      if (!response.ok) throw new Error('Failed to create note')

      const newNote = await response.json()
      setNotes(prev => [newNote, ...prev])
      setSelectedNote(newNote)
      
      // Focus title input
      setTimeout(() => {
        if (titleInputRef.current) {
          titleInputRef.current.focus()
          titleInputRef.current.select()
        }
      }, 100)
      
      showToast('New note created')
    } catch (err) {
      showToast('Failed to create note', 'error')
      console.error('Create error:', err)
    }
  }

  // Delete note
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete note')

      setNotes(prev => prev.filter(n => n.id !== id))
      
      if (selectedNote?.id === id) {
        const remaining = notes.filter(n => n.id !== id)
        setSelectedNote(remaining.length > 0 ? remaining[0] : null)
      }
      
      showToast('Note deleted')
    } catch (err) {
      showToast('Failed to delete note', 'error')
      console.error('Delete error:', err)
    }
  }

  // Toggle pin
  const togglePin = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/pin`, {
        method: 'PATCH',
      })

      if (!response.ok) throw new Error('Failed to toggle pin')

      const updatedNote = await response.json()
      setNotes(prev => {
        const updated = prev.map(n => n.id === updatedNote.id ? updatedNote : n)
        // Re-sort: pinned first, then by updated_at
        return updated.sort((a, b) => {
          if (a.is_pinned !== b.is_pinned) return b.is_pinned ? 1 : -1
          return new Date(b.updated_at) - new Date(a.updated_at)
        })
      })
      
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote)
      }
    } catch (err) {
      showToast('Failed to update pin', 'error')
    }
  }

  // Update note color
  const updateColor = async (id, color) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/color`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ color }),
      })

      if (!response.ok) throw new Error('Failed to update color')

      const updatedNote = await response.json()
      setNotes(prev => prev.map(n => n.id === updatedNote.id ? updatedNote : n))
      
      if (selectedNote?.id === id) {
        setSelectedNote(updatedNote)
      }
      
      setShowColorPicker(false)
    } catch (err) {
      showToast('Failed to update color', 'error')
    }
  }

  // Handle title change
  const handleTitleChange = (e) => {
    const newTitle = e.target.value
    const updatedNote = { ...selectedNote, title: newTitle }
    setSelectedNote(updatedNote)
    setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n))
    debouncedSave(updatedNote)
  }

  // Handle content change
  const handleContentChange = (e) => {
    const newContent = e.target.value
    const updatedNote = { ...selectedNote, content: newContent }
    setSelectedNote(updatedNote)
    setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n))
    debouncedSave(updatedNote)
  }

  // Insert link into content
  const insertLink = () => {
    if (!linkUrl.trim()) return
    
    const linkMarkdown = linkText.trim() 
      ? `[${linkText}](${linkUrl})`
      : linkUrl
    
    const textarea = contentRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = selectedNote.content.substring(0, start) + linkMarkdown + selectedNote.content.substring(end)
      
      const updatedNote = { ...selectedNote, content: newContent }
      setSelectedNote(updatedNote)
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? updatedNote : n))
      debouncedSave(updatedNote)
    }
    
    setLinkUrl('')
    setLinkText('')
    setShowLinkInput(false)
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    })
  }

  // Get preview text from content
  const getPreview = (content, maxLength = 80) => {
    if (!content) return 'No content'
    const cleaned = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[#*_~`]/g, '')
    return cleaned.length > maxLength ? cleaned.substring(0, maxLength) + '...' : cleaned
  }

  // Get color style for a note
  const getNoteColorStyle = (colorId) => {
    const color = NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0]
    return { background: color.bg, borderColor: color.border }
  }

  // Filter notes by search query
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes
    const query = searchQuery.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    )
  }, [notes, searchQuery])

  // Render content with clickable links
  const renderContent = (content) => {
    if (!content) return ''
    
    // Match markdown links and URLs
    const urlRegex = /\[([^\]]+)\]\(([^)]+)\)|https?:\/\/[^\s]+/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = urlRegex.exec(content)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index))
      }

      if (match[1] && match[2]) {
        // Markdown link [text](url)
        parts.push(
          <a 
            key={match.index} 
            href={match[2]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="note-link"
            onClick={(e) => e.stopPropagation()}
          >
            {match[1]}
            <ExternalLink size={12} />
          </a>
        )
      } else {
        // Plain URL
        parts.push(
          <a 
            key={match.index} 
            href={match[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="note-link"
            onClick={(e) => e.stopPropagation()}
          >
            {match[0]}
            <ExternalLink size={12} />
          </a>
        )
      }
      
      lastIndex = match.index + match[0].length
    }

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex))
    }

    return parts.length > 0 ? parts : content
  }

  return (
    <div className="notes-app">
      {/* Sidebar with notes list */}
      <aside className="notes-sidebar">
        <div className="notes-sidebar-header">
          <button className="btn-back" onClick={onNavigateBack} title="Back to Prompts">
            <ChevronLeft size={20} />
          </button>
          <h1>
            <FileText size={22} strokeWidth={1.5} />
            Notes
          </h1>
          <button className="btn-new-note" onClick={createNote} title="New Note">
            <Plus size={20} />
          </button>
        </div>

        <div className="notes-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="notes-list">
          {loading ? (
            <div className="notes-loading">
              <Loader2 size={24} className="spin" />
              <p>Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="notes-empty">
              {searchQuery ? (
                <>
                  <Search size={32} />
                  <p>No notes found</p>
                </>
              ) : (
                <>
                  <FileText size={32} />
                  <p>No notes yet</p>
                  <button className="btn-create-first" onClick={createNote}>
                    <Plus size={16} />
                    Create your first note
                  </button>
                </>
              )}
            </div>
          ) : (
            filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                style={getNoteColorStyle(note.color)}
                onClick={() => setSelectedNote(note)}
              >
                <div className="note-item-header">
                  <h3>{note.title || 'Untitled'}</h3>
                  {note.is_pinned && <Pin size={12} className="pin-indicator" />}
                </div>
                <p className="note-item-preview">{getPreview(note.content)}</p>
                <span className="note-item-date">
                  <Clock size={11} />
                  {formatDate(note.updated_at)}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="notes-sidebar-footer">
          <span className="notes-count">
            {notes.length} note{notes.length !== 1 ? 's' : ''}
          </span>
        </div>
      </aside>

      {/* Main content area */}
      <main className="notes-main">
        {selectedNote ? (
          <>
            <div className="notes-toolbar">
              <div className="toolbar-left">
                <span className={`save-indicator ${saving ? 'saving' : ''}`}>
                  {saving ? (
                    <>
                      <Loader2 size={12} className="spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={12} />
                      Saved
                    </>
                  )}
                </span>
              </div>
              
              <div className="toolbar-actions">
                <button 
                  className={`toolbar-btn view-toggle ${isPreviewMode ? 'active' : ''}`}
                  onClick={() => setIsPreviewMode(!isPreviewMode)}
                  title={isPreviewMode ? 'Edit mode' : 'Preview mode'}
                >
                  {isPreviewMode ? <Pencil size={18} /> : <Eye size={18} />}
                </button>

                {!isPreviewMode && (
                  <>
                    <div className="color-picker-wrapper">
                      <button 
                        className="toolbar-btn" 
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        title="Change color"
                      >
                        <Palette size={18} />
                      </button>
                      {showColorPicker && (
                        <div className="color-picker-dropdown">
                          {NOTE_COLORS.map(color => (
                            <button
                              key={color.id}
                              className={`color-option ${selectedNote.color === color.id ? 'active' : ''}`}
                              style={{ background: color.bg, borderColor: color.border }}
                              onClick={() => updateColor(selectedNote.id, color.id)}
                              title={color.name}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      className="toolbar-btn"
                      onClick={() => setShowLinkInput(!showLinkInput)}
                      title="Insert link"
                    >
                      <Link2 size={18} />
                    </button>
                  </>
                )}
                
                <button 
                  className={`toolbar-btn ${selectedNote.is_pinned ? 'active' : ''}`}
                  onClick={() => togglePin(selectedNote.id)}
                  title={selectedNote.is_pinned ? 'Unpin' : 'Pin to top'}
                >
                  {selectedNote.is_pinned ? <PinOff size={18} /> : <Pin size={18} />}
                </button>
                
                <button 
                  className="toolbar-btn danger"
                  onClick={() => deleteNote(selectedNote.id)}
                  title="Delete note"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {showLinkInput && !isPreviewMode && (
              <div className="link-input-bar">
                <input
                  type="text"
                  placeholder="Link text (optional)"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="link-text-input"
                />
                <input
                  type="url"
                  placeholder="https://..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                  className="link-url-input"
                  autoFocus
                />
                <button className="btn-insert-link" onClick={insertLink}>
                  Insert
                </button>
                <button className="btn-cancel-link" onClick={() => setShowLinkInput(false)}>
                  <X size={16} />
                </button>
              </div>
            )}

            {isPreviewMode ? (
              /* Preview Mode - Read Only View */
              <div className="note-reader" style={getNoteColorStyle(selectedNote.color)}>
                <h1 className="note-reader-title">{selectedNote.title || 'Untitled'}</h1>
                
                <div className="note-meta">
                  <span>
                    <Calendar size={12} />
                    Created {formatDate(selectedNote.created_at)}
                  </span>
                  <span>
                    <Clock size={12} />
                    Updated {formatDate(selectedNote.updated_at)}
                  </span>
                </div>

                <div className="note-reader-content">
                  {selectedNote.content ? (
                    renderContent(selectedNote.content)
                  ) : (
                    <p className="note-empty-content">This note is empty. Switch to edit mode to add content.</p>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <>
                <div className="note-editor" style={getNoteColorStyle(selectedNote.color)}>
                  <input
                    ref={titleInputRef}
                    type="text"
                    className="note-title-input"
                    value={selectedNote.title}
                    onChange={handleTitleChange}
                    placeholder="Note title..."
                  />
                  
                  <div className="note-meta">
                    <span>
                      <Calendar size={12} />
                      Created {formatDate(selectedNote.created_at)}
                    </span>
                    <span>
                      <Clock size={12} />
                      Updated {formatDate(selectedNote.updated_at)}
                    </span>
                  </div>

                  <textarea
                    ref={contentRef}
                    className="note-content-input"
                    value={selectedNote.content}
                    onChange={handleContentChange}
                    placeholder="Start writing... 

You can add links like:
• Paste a URL directly: https://example.com
• Or use markdown: [Link text](https://example.com)

Tips:
• Use the link button above to insert links
• Notes are saved automatically
• Pin important notes to keep them at the top"
                  />
                </div>

                {/* Preview panel for links in edit mode */}
                {selectedNote.content && /\[([^\]]+)\]\(([^)]+)\)|https?:\/\/[^\s]+/.test(selectedNote.content) && (
                  <div className="note-preview">
                    <h4>Preview</h4>
                    <div className="preview-content">
                      {renderContent(selectedNote.content)}
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="notes-no-selection">
            <FileText size={48} strokeWidth={1} />
            <h3>No Note Selected</h3>
            <p>Select a note from the sidebar or create a new one</p>
            <button className="btn-create-note" onClick={createNote}>
              <Plus size={18} />
              Create New Note
            </button>
          </div>
        )}
      </main>

      {/* Toast Notification */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default Notes

