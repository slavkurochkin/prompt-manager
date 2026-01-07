import { useState, useEffect, useCallback, useMemo } from 'react'
import { encode } from 'gpt-tokenizer'
import { 
  FileText, 
  Sparkles, 
  Save, 
  Library, 
  Copy, 
  Check, 
  Trash2, 
  Cpu,
  Hash,
  Calendar,
  Inbox,
  Loader2,
  AlertCircle,
  CheckCircle,
  Download,
  FileSpreadsheet,
  FileDown,
  Star,
  StickyNote,
  Pencil,
  X,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Tag,
  Plus,
  Filter,
  Gauge,
  BookOpen,
  Code,
  Upload
} from 'lucide-react'
import Notes from './Notes'
import RequirementsConstructor from './RequirementsConstructor'

// Prompt confidence/quality analyzer
// Based on prompt engineering best practices + EmotionPrompt research (https://arxiv.org/pdf/2307.11760)
const analyzePromptConfidence = (content, tokenCount) => {
  if (!content || !content.trim()) {
    return { level: 'none', score: 0, label: 'Empty', color: 'gray', hasEmotion: false, factors: [] }
  }

  let score = 0
  let emotionScore = 0
  const text = content.toLowerCase()
  const factors = []
  
  // 1. Token count scoring (0-20 points)
  let tokenPoints = 0
  let tokenDesc = ''
  if (tokenCount >= 20 && tokenCount <= 50) { tokenPoints = 10; tokenDesc = 'Short but adequate' }
  else if (tokenCount > 50 && tokenCount <= 150) { tokenPoints = 18; tokenDesc = 'Good length' }
  else if (tokenCount > 150 && tokenCount <= 500) { tokenPoints = 20; tokenDesc = 'Optimal length' }
  else if (tokenCount > 500 && tokenCount <= 1000) { tokenPoints = 15; tokenDesc = 'Detailed' }
  else if (tokenCount > 1000) { tokenPoints = 10; tokenDesc = 'Very long' }
  else if (tokenCount > 10) { tokenPoints = 5; tokenDesc = 'Too brief' }
  else { tokenDesc = 'Too short' }
  score += tokenPoints
  factors.push({ name: 'Length', points: tokenPoints, max: 20, detail: `${tokenCount} tokens - ${tokenDesc}` })

  // 2. Structure indicators (0-20 points)
  let structurePoints = 0
  const structureDetails = []
  if (/\d+\.\s/.test(content)) { structurePoints += 8; structureDetails.push('Numbered list') }
  if (/[-•]\s/.test(content)) { structurePoints += 5; structureDetails.push('Bullet points') }
  if (content.includes('\n\n')) { structurePoints += 5; structureDetails.push('Clear sections') }
  if (/#{1,3}\s/.test(content)) { structurePoints += 2; structureDetails.push('Headers') }
  score += structurePoints
  factors.push({ 
    name: 'Structure', 
    points: structurePoints, 
    max: 20, 
    detail: structureDetails.length ? structureDetails.join(', ') : 'No structure found'
  })

  // 3. Specificity & clarity (0-25 points)
  let specificityPoints = 0
  const specificityDetails = []
  const actionVerbs = ['explain', 'describe', 'analyze', 'create', 'write', 'generate', 'list', 'compare', 'summarize', 'translate', 'convert', 'review', 'evaluate', 'suggest', 'provide', 'identify', 'implement', 'design', 'develop', 'build']
  const foundVerbs = actionVerbs.filter(v => text.includes(v))
  const verbPoints = Math.min(foundVerbs.length * 3, 15)
  specificityPoints += verbPoints
  if (foundVerbs.length) specificityDetails.push(`Action verbs: ${foundVerbs.slice(0, 3).join(', ')}${foundVerbs.length > 3 ? '...' : ''}`)
  
  if (/format|json|xml|markdown|table|list/i.test(text)) { 
    specificityPoints += 5
    specificityDetails.push('Output format specified')
  }
  if (/must|should|always|never|only|exactly/i.test(text)) { 
    specificityPoints += 5
    specificityDetails.push('Has constraints')
  }
  score += specificityPoints
  factors.push({ 
    name: 'Specificity', 
    points: specificityPoints, 
    max: 25, 
    detail: specificityDetails.length ? specificityDetails.join(', ') : 'Could be more specific'
  })

  // 4. Few-shot / examples (0-15 points)
  let examplePoints = 0
  const exampleDetails = []
  if (/example\s*\d*\s*:/i.test(text)) { examplePoints += 10; exampleDetails.push('Has examples') }
  if (/input:|output:/i.test(text)) { examplePoints += 5; exampleDetails.push('I/O patterns') }
  score += examplePoints
  factors.push({ 
    name: 'Examples', 
    points: examplePoints, 
    max: 15, 
    detail: exampleDetails.length ? exampleDetails.join(', ') : 'No examples (few-shot)'
  })
  
  // 5. Role/persona (0-10 points)
  let rolePoints = 0
  if (/you are|act as|pretend|role|expert|specialist|professional/i.test(text)) rolePoints = 10
  score += rolePoints
  factors.push({ 
    name: 'Role/Persona', 
    points: rolePoints, 
    max: 10, 
    detail: rolePoints ? 'Role defined' : 'No role assigned'
  })

  // 6. Chain of thought indicators (0-10 points)
  let cotPoints = 0
  if (/step by step|think through|reasoning|let's think|show your work|explain your/i.test(text)) cotPoints = 10
  score += cotPoints
  factors.push({ 
    name: 'Chain of Thought', 
    points: cotPoints, 
    max: 10, 
    detail: cotPoints ? 'CoT prompting detected' : 'No reasoning guidance'
  })

  // 7. EmotionPrompt stimuli detection (0-15 points bonus)
  const emotionDetails = []
  if (/important to my|crucial for my|critical to my|essential for my/i.test(text)) { emotionScore += 5; emotionDetails.push('Importance stated') }
  if (/my career|my job|my work|my success|my future/i.test(text)) { emotionScore += 3; emotionDetails.push('Personal stakes') }
  if (/you('d| would) better|you must|you need to|make sure/i.test(text)) { emotionScore += 3; emotionDetails.push('Urgency') }
  if (/are you sure|are you certain|double.?check/i.test(text)) { emotionScore += 2; emotionDetails.push('Verification request') }
  if (/believe in (you|your)|have confidence|trust (you|your)/i.test(text)) { emotionScore += 3; emotionDetails.push('Confidence boost') }
  if (/do your best|give it your all|take a deep breath|stay calm/i.test(text)) { emotionScore += 3; emotionDetails.push('Encouragement') }
  if (/this is (very )?important|this matters|this is critical/i.test(text)) { emotionScore += 4; emotionDetails.push('Emphasis') }
  if (/take pride|be proud|embrace.*challenge/i.test(text)) { emotionScore += 2; emotionDetails.push('Pride/challenge') }

  const cappedEmotionScore = Math.min(emotionScore, 15)
  score += cappedEmotionScore
  const hasEmotion = emotionScore >= 3
  if (hasEmotion) {
    factors.push({ 
      name: 'EmotionPrompt', 
      points: cappedEmotionScore, 
      max: 15, 
      detail: emotionDetails.join(', '),
      isBonus: true
    })
  }

  // Determine level
  let level, label, color
  if (score >= 70) {
    level = 'high'
    label = 'High'
    color = '#22c55e'
  } else if (score >= 45) {
    level = 'good'
    label = 'Good'
    color = '#3b82f6'
  } else if (score >= 25) {
    level = 'medium'
    label = 'Med'
    color = '#f59e0b'
  } else {
    level = 'low'
    label = 'Low'
    color = '#ef4444'
  }

  return { level, score, label, color, hasEmotion, emotionScore: cappedEmotionScore, factors }
}

// Confidence Breakdown Popover Component
const ConfidenceBreakdown = ({ confidence, onClose, position }) => {
  if (!confidence || !confidence.factors || !position) return null
  
  return (
    <>
      <div className="confidence-backdrop" onClick={onClose} />
      <div 
        className="confidence-breakdown" 
        style={{ top: position.top, left: position.left }}
        onClick={(e) => e.stopPropagation()}
      >
      <div className="confidence-breakdown-header">
        <span className={`confidence-level-badge confidence-${confidence.level}`}>
          {confidence.label}
        </span>
        <span className="confidence-score">{confidence.score}/100</span>
        <button className="confidence-close" onClick={onClose}>
          <X size={14} />
        </button>
      </div>
      <div className="confidence-breakdown-list">
        {confidence.factors.map((factor, idx) => (
          <div key={idx} className={`confidence-factor ${factor.isBonus ? 'bonus' : ''}`}>
            <div className="factor-header">
              <span className="factor-name">
                {factor.isBonus && '✨ '}{factor.name}
              </span>
              <span className="factor-points">
                +{factor.points}/{factor.max}
              </span>
            </div>
            <div className="factor-bar">
              <div 
                className="factor-bar-fill" 
                style={{ width: `${(factor.points / factor.max) * 100}%` }}
              />
            </div>
            <div className="factor-detail">{factor.detail}</div>
          </div>
        ))}
      </div>
      <div className="confidence-breakdown-footer">
        <a 
          href="https://arxiv.org/pdf/2307.11760" 
          target="_blank" 
          rel="noopener noreferrer"
          className="emotion-paper-link"
        >
          Learn about EmotionPrompt ↗
        </a>
      </div>
    </div>
    </>
  )
}

// Prompt technique examples
const PROMPT_EXAMPLES = [
  {
    id: 'cot',
    name: 'Chain of Thought',
    short: 'CoT',
    description: 'Guide the model to reason step-by-step before giving a final answer.',
    example: `Solve this problem step by step:

A store sells apples for $2 each and oranges for $3 each. If someone buys 5 fruits and spends exactly $12, how many of each fruit did they buy?

Think through this carefully, showing your reasoning at each step before providing the final answer.`,
    tip: 'Add "Let\'s think step by step" or "Show your reasoning" to encourage detailed thinking.'
  },
  {
    id: 'few-shot',
    name: 'Few-Shot Learning',
    short: 'Few-Shot',
    description: 'Provide examples of desired input/output pairs to guide the model.',
    example: `Convert the following sentences to formal business language:

Example 1:
Input: "Hey, can you send me that report ASAP?"
Output: "I would appreciate it if you could send me the report at your earliest convenience."

Example 2:
Input: "This idea is totally awesome!"
Output: "This proposal demonstrates significant merit and potential."

Now convert:
Input: "Let's grab coffee and chat about the project stuff."
Output:`,
    tip: 'Use 2-5 diverse examples. More examples = more consistent outputs.'
  },
  {
    id: 'role',
    name: 'Role Playing',
    short: 'Role',
    description: 'Assign a specific persona or expertise to shape the response style.',
    example: `You are a senior software architect with 20 years of experience in distributed systems. You have a talent for explaining complex concepts using simple analogies.

A junior developer asks you: "What's the difference between horizontal and vertical scaling?"

Explain this in a way that's easy to understand, using real-world analogies.`,
    tip: 'Be specific about expertise, personality traits, and communication style.'
  },
  {
    id: 'zero-shot',
    name: 'Zero-Shot',
    short: 'Zero-Shot',
    description: 'Direct instruction without examples—relies on the model\'s training.',
    example: `Classify the sentiment of the following customer review as "positive", "negative", or "neutral". Only respond with one word.

Review: "The product arrived on time but the packaging was slightly damaged. The item itself works perfectly though."`,
    tip: 'Be very specific about the expected format and constraints.'
  },
  {
    id: 'structured',
    name: 'Structured Output',
    short: 'Structured',
    description: 'Request specific formats like JSON, markdown tables, or lists.',
    example: `Analyze the following text and extract key information in JSON format:

Text: "John Smith, a 35-year-old software engineer from Seattle, recently published his first book on machine learning. The book, titled 'ML Made Simple', has sold over 10,000 copies since its release in March 2024."

Return a JSON object with these fields: name, age, profession, location, book_title, sales, release_date`,
    tip: 'Specify exact field names and data types you expect.'
  },
  {
    id: 'constraints',
    name: 'Constraints & Guardrails',
    short: 'Constraints',
    description: 'Set explicit boundaries and rules for the response.',
    example: `You are a helpful cooking assistant. Follow these rules strictly:
1. Only suggest vegetarian recipes
2. Keep responses under 200 words
3. Always include cooking time
4. Never suggest recipes requiring more than 5 ingredients
5. Use metric measurements only

User request: "I want to make something quick for dinner with tomatoes and cheese."`,
    tip: 'Numbered rules are clearer. State what to avoid, not just what to do.'
  },
  {
    id: 'iterative',
    name: 'Iterative Refinement',
    short: 'Iterative',
    description: 'Ask the model to improve upon its own output or critique it.',
    example: `Write a product description for a wireless bluetooth speaker.

After writing your initial draft, critique it for:
- Clarity
- Persuasiveness  
- Key features mentioned

Then write an improved version based on your critique.`,
    tip: 'Great for improving quality. Can also ask the model to rate its confidence.'
  },
  {
    id: 'socratic',
    name: 'Socratic Method',
    short: 'Socratic',
    description: 'Guide learning through questions rather than direct answers.',
    example: `You are a patient teacher using the Socratic method. A student is trying to understand recursion in programming.

Instead of explaining directly, guide them to understanding through a series of thoughtful questions. Start with something they likely already understand and build from there.

Student: "I don't understand what recursion means in programming."`,
    tip: 'Useful for educational content and deeper understanding.'
  }
]
import { jsPDF } from 'jspdf'

const API_BASE = '/api/prompts'

function App() {
  const [currentPage, setCurrentPage] = useState('prompts') // 'prompts', 'notes', or 'requirements'
  const [prompts, setPrompts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [promptToLoad, setPromptToLoad] = useState(null) // Prompt to load into constructor
  const [constructorKey, setConstructorKey] = useState(0) // Key to force remount when loading prompt
  const [model, setModel] = useState('')
  const [note, setNote] = useState('')
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [copiedId, setCopiedId] = useState(null)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [editingNoteValue, setEditingNoteValue] = useState('')
  const [examplesExpanded, setExamplesExpanded] = useState(false)
  const [activeExample, setActiveExample] = useState(null)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [filterTags, setFilterTags] = useState([])
  const [confidencePopover, setConfidencePopover] = useState(null) // { id, position, confidence }
  const [editingTagsId, setEditingTagsId] = useState(null)
  const [editingTagsValue, setEditingTagsValue] = useState([])
  const [editingTagInput, setEditingTagInput] = useState('')

  // Calculate token count for current content
  const tokenCount = useMemo(() => {
    if (!content.trim()) return 0
    try {
      return encode(content).length
    } catch {
      // Fallback: rough estimate of ~4 chars per token
      return Math.ceil(content.length / 4)
    }
  }, [content])

  // Calculate prompt confidence
  const promptConfidence = useMemo(() => {
    return analyzePromptConfidence(content, tokenCount)
  }, [content, tokenCount])

  // Show toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  // Fetch all prompts
  const fetchPrompts = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(API_BASE)
      if (!response.ok) throw new Error('Failed to fetch prompts')
      const data = await response.json()
      setPrompts(data)
      setError(null)
    } catch (err) {
      setError('Unable to load prompts. Please try again.')
      console.error('Fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load prompts on mount
  useEffect(() => {
    fetchPrompts()
  }, [fetchPrompts])

  // Save new prompt
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      showToast('Please fill in both title and content', 'error')
      return
    }

    try {
      setSaving(true)
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: content.trim(),
          model: model.trim() || null,
          token_count: tokenCount,
          rating: rating,
          note: note.trim() || null,
          tags: tags
        }),
      })

      if (!response.ok) throw new Error('Failed to save prompt')

      const newPrompt = await response.json()
      setPrompts(prev => [newPrompt, ...prev])
      setTitle('')
      setContent('')
      setModel('')
      setNote('')
      setTags([])
      setTagInput('')
      setRating(0)
      showToast('Prompt saved successfully!')
    } catch (err) {
      showToast('Failed to save prompt', 'error')
      console.error('Save error:', err)
    } finally {
      setSaving(false)
    }
  }

  // Delete prompt
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete prompt')

      setPrompts(prev => prev.filter(p => p.id !== id))
      showToast('Prompt deleted')
    } catch (err) {
      showToast('Failed to delete prompt', 'error')
      console.error('Delete error:', err)
    }
  }

  // Copy prompt content
  const handleCopy = async (id, promptContent) => {
    try {
      await navigator.clipboard.writeText(promptContent)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
      showToast('Copied to clipboard!')
    } catch (err) {
      showToast('Failed to copy', 'error')
    }
  }

  // Update prompt rating
  const handleRatingUpdate = async (id, newRating) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/rating`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: newRating }),
      })

      if (!response.ok) throw new Error('Failed to update rating')

      const updatedPrompt = await response.json()
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p))
    } catch (err) {
      showToast('Failed to update rating', 'error')
      console.error('Rating error:', err)
    }
  }

  // Update prompt note
  const handleNoteUpdate = async (id, newNote) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/note`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      })

      if (!response.ok) throw new Error('Failed to update note')

      const updatedPrompt = await response.json()
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p))
      setEditingNoteId(null)
      showToast('Note updated!')
    } catch (err) {
      showToast('Failed to update note', 'error')
      console.error('Note error:', err)
    }
  }

  // Start editing note
  const startEditingNote = (id, currentNote) => {
    setEditingNoteId(id)
    setEditingNoteValue(currentNote || '')
  }

  // Cancel editing note
  const cancelEditingNote = () => {
    setEditingNoteId(null)
    setEditingNoteValue('')
  }

  // Use example prompt
  const useExample = (example) => {
    setTitle(example.name + ' Example')
    setContent(example.example)
    setNote(example.tip)
    setExamplesExpanded(false)
    showToast('Example loaded into form!')
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Add tag to form
  const addTag = (tag) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
    }
    setTagInput('')
  }

  // Remove tag from form
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove))
  }

  // Handle tag input keydown
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(tagInput)
    } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  // Update prompt tags
  const handleTagsUpdate = async (id, newTags) => {
    try {
      const response = await fetch(`${API_BASE}/${id}/tags`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: newTags }),
      })

      if (!response.ok) throw new Error('Failed to update tags')

      const updatedPrompt = await response.json()
      setPrompts(prev => prev.map(p => p.id === id ? updatedPrompt : p))
      setEditingTagsId(null)
      setEditingTagsValue([])
      setEditingTagInput('')
    } catch (err) {
      showToast('Failed to update tags', 'error')
      console.error('Tags error:', err)
    }
  }

  // Start editing tags on a prompt card
  const startEditingTags = (id, currentTags) => {
    setEditingTagsId(id)
    setEditingTagsValue(currentTags || [])
    setEditingTagInput('')
  }

  // Add tag while editing
  const addEditingTag = (tag) => {
    const trimmed = tag.trim().toLowerCase()
    if (trimmed && !editingTagsValue.includes(trimmed)) {
      setEditingTagsValue([...editingTagsValue, trimmed])
    }
    setEditingTagInput('')
  }

  // Remove tag while editing
  const removeEditingTag = (tagToRemove) => {
    setEditingTagsValue(editingTagsValue.filter(t => t !== tagToRemove))
  }

  // Toggle filter tag
  const toggleFilterTag = (tag) => {
    if (filterTags.includes(tag)) {
      setFilterTags(filterTags.filter(t => t !== tag))
    } else {
      setFilterTags([...filterTags, tag])
    }
  }

  // Get all unique tags from prompts
  const allTags = useMemo(() => {
    const tagSet = new Set()
    prompts.forEach(p => {
      (p.tags || []).forEach(tag => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }, [prompts])

  // Filter prompts by selected tags
  const filteredPrompts = useMemo(() => {
    if (filterTags.length === 0) return prompts
    return prompts.filter(p => 
      filterTags.every(tag => (p.tags || []).includes(tag))
    )
  }, [prompts, filterTags])

  // Star Rating Component
  const StarRating = ({ value, onChange, onHover, hoverValue, size = 16, interactive = true }) => {
    return (
      <div className={`star-rating ${interactive ? 'interactive' : ''}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star-btn ${(hoverValue || value) >= star ? 'filled' : ''}`}
            onClick={() => interactive && onChange && onChange(star === value ? 0 : star)}
            onMouseEnter={() => interactive && onHover && onHover(star)}
            onMouseLeave={() => interactive && onHover && onHover(0)}
            disabled={!interactive}
          >
            <Star 
              size={size} 
              strokeWidth={1.5}
              fill={(hoverValue || value) >= star ? 'currentColor' : 'none'}
            />
          </button>
        ))}
      </div>
    )
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Export to CSV
  const exportToCSV = () => {
    if (prompts.length === 0) {
      showToast('No prompts to export', 'error')
      return
    }

    const headers = ['Title', 'Content', 'Model', 'Tokens', 'Rating', 'Note', 'Tags', 'Created At']
    const rows = prompts.map(p => [
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.content.replace(/"/g, '""')}"`,
      `"${p.model || ''}"`,
      p.token_count || 0,
      p.rating || 0,
      `"${(p.note || '').replace(/"/g, '""')}"`,
      `"${(p.tags || []).join(', ')}"`,
      `"${formatDate(p.created_at)}"`
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `prompts-library-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    
    showToast('Exported to CSV successfully!')
  }

  // Export to PDF
  const exportToPDF = () => {
    if (prompts.length === 0) {
      showToast('No prompts to export', 'error')
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const contentWidth = pageWidth - (margin * 2)
    
    // Title
    doc.setFontSize(24)
    doc.setTextColor(245, 158, 11)
    doc.text('Prompt Library', margin, 25)
    
    // Subtitle
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Exported on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, margin, 33)
    doc.text(`Total: ${prompts.length} prompt${prompts.length !== 1 ? 's' : ''}`, margin, 40)

    // Divider line
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, 45, pageWidth - margin, 45)

    let yPosition = 55

    prompts.forEach((prompt, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Prompt number and title
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.setFont(undefined, 'bold')
      const titleText = `${index + 1}. ${prompt.title}`
      doc.text(titleText, margin, yPosition)
      yPosition += 7

      // Model, tokens, and rating badges
      doc.setFontSize(9)
      doc.setFont(undefined, 'normal')
      let badgeX = margin
      
      if (prompt.model) {
        doc.setTextColor(245, 158, 11)
        doc.text(`[${prompt.model}]`, badgeX, yPosition)
        badgeX += doc.getTextWidth(`[${prompt.model}]`) + 5
      }
      
      if (prompt.token_count) {
        doc.setTextColor(6, 182, 212)
        doc.text(`[${prompt.token_count} tokens]`, badgeX, yPosition)
        badgeX += doc.getTextWidth(`[${prompt.token_count} tokens]`) + 5
      }

      if (prompt.rating) {
        doc.setTextColor(251, 191, 36)
        doc.text(`[${'★'.repeat(prompt.rating)}${'☆'.repeat(5 - prompt.rating)}]`, badgeX, yPosition)
      }
      
      if (prompt.model || prompt.token_count || prompt.rating) {
        yPosition += 7
      }

      // Tags
      if (prompt.tags && prompt.tags.length > 0) {
        doc.setFontSize(9)
        doc.setTextColor(139, 92, 246)
        doc.text(`Tags: ${prompt.tags.join(', ')}`, margin, yPosition)
        yPosition += 6
      }

      // Note
      if (prompt.note) {
        doc.setFontSize(9)
        doc.setTextColor(100, 116, 139)
        doc.setFont(undefined, 'italic')
        const noteText = `Note: ${prompt.note}`
        const splitNote = doc.splitTextToSize(noteText, contentWidth)
        splitNote.forEach(line => {
          if (yPosition > 275) {
            doc.addPage()
            yPosition = 20
          }
          doc.text(line, margin, yPosition)
          yPosition += 5
        })
        doc.setFont(undefined, 'normal')
        yPosition += 2
      }

      // Content
      doc.setFontSize(10)
      doc.setTextColor(60, 60, 60)
      const splitContent = doc.splitTextToSize(prompt.content, contentWidth)
      
      splitContent.forEach(line => {
        if (yPosition > 275) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(line, margin, yPosition)
        yPosition += 5
      })

      // Date
      yPosition += 2
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`Created: ${formatDate(prompt.created_at)}`, margin, yPosition)
      
      yPosition += 12
      
      // Separator between prompts
      if (index < prompts.length - 1) {
        doc.setDrawColor(230, 230, 230)
        doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)
      }
    })

    doc.save(`prompts-library-${new Date().toISOString().split('T')[0]}.pdf`)
    showToast('Exported to PDF successfully!')
  }

  // If on Notes page, render Notes component
  if (currentPage === 'notes') {
    return (
      <>
        <Notes onNavigateBack={() => setCurrentPage('prompts')} />
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        )}
      </>
    )
  }

  // Load prompt into constructor
  const handleLoadIntoConstructor = (prompt) => {
    setPromptToLoad(prompt)
    setConstructorKey(prev => prev + 1) // Force component remount
    setCurrentPage('requirements')
  }

  // If on Requirements Constructor page, render RequirementsConstructor component
  if (currentPage === 'requirements') {
    return (
      <>
        <RequirementsConstructor 
          onNavigateBack={() => {
            setCurrentPage('prompts')
            setPromptToLoad(null) // Clear loaded prompt when navigating back
          }}
          loadedPrompt={promptToLoad}
          key={constructorKey} // Force remount when loading a new prompt
        />
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{toast.message}</span>
          </div>
        )}
      </>
    )
  }

  return (
    <div className="app">
      <div className="app-layout">
        {/* Left Panel - Header & Form */}
        <div className="left-panel">
          {/* Header */}
          <header className="header">
            <div className="header-icon">
              <FileText size={28} strokeWidth={1.5} />
            </div>
            <h1>Prompt Library</h1>
            <p>Store and manage your AI prompts in one place</p>
            <div className="header-nav-buttons">
              <button 
                className="btn-notes-nav"
                onClick={() => setCurrentPage('requirements')}
              >
                <Code size={16} />
                Requirements Constructor
              </button>
              <button 
                className="btn-notes-nav"
                onClick={() => setCurrentPage('notes')}
              >
                <BookOpen size={16} />
                Research Notes
              </button>
            </div>
          </header>

          {/* Create Form */}
          <section className="form-section">
        <div className="form-header">
          <div className="form-header-icon">
            <Sparkles size={18} strokeWidth={2} />
          </div>
          <h2>Create New Prompt</h2>
        </div>
        
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group form-group-title">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your prompt a memorable name..."
                disabled={saving}
              />
            </div>
            
            <div className="form-group form-group-model">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., GPT-4, Claude 3.5..."
                disabled={saving}
              />
            </div>

            <div className="form-group form-group-rating">
              <label>Rating</label>
              <StarRating 
                value={rating} 
                onChange={setRating}
                hoverValue={hoverRating}
                onHover={setHoverRating}
                size={20}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-label-row">
              <label htmlFor="content">Prompt Content</label>
              <div className="prompt-metrics">
                <span className={`token-counter ${tokenCount > 4000 ? 'warning' : ''}`}>
                  <Hash size={12} strokeWidth={2.5} />
                  {tokenCount.toLocaleString()} tokens
                </span>
                {tokenCount > 0 && (
                  <span 
                    className={`confidence-badge confidence-${promptConfidence.level} ${promptConfidence.hasEmotion ? 'has-emotion' : ''} clickable`}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (confidencePopover?.id === 'form') {
                        setConfidencePopover(null)
                      } else {
                        const rect = e.currentTarget.getBoundingClientRect()
                        const popoverWidth = 280
                        const popoverHeight = 350
                        let top = rect.bottom + 8
                        let left = rect.left
                        if (top + popoverHeight > window.innerHeight - 20) {
                          top = Math.max(20, rect.top - popoverHeight - 8)
                        }
                        if (left + popoverWidth > window.innerWidth - 20) {
                          left = window.innerWidth - popoverWidth - 20
                        }
                        if (left < 20) left = 20
                        setConfidencePopover({ id: 'form', position: { top, left }, confidence: promptConfidence })
                      }
                    }}
                  >
                    <Gauge size={12} strokeWidth={2.5} />
                    {promptConfidence.label}
                    {promptConfidence.hasEmotion && <span className="emotion-indicator">💡</span>}
                  </span>
                )}
              </div>
            </div>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt template here..."
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note">
              <StickyNote size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Note <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="text"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this prompt..."
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">
              <Tag size={14} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.35rem' }} />
              Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
            </label>
            <div className="tags-input-container">
              {tags.map((tag) => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={() => tagInput && addTag(tagInput)}
                placeholder={tags.length === 0 ? "Type and press Enter to add tags..." : "Add more..."}
                disabled={saving}
                className="tag-input"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving || !title.trim() || !content.trim()}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} strokeWidth={2} />
                Save Prompt
              </>
            )}
          </button>
        </form>
      </section>
        </div>

        {/* Right Panel - Examples & Prompts */}
        <div className="right-panel">
          {/* Prompt Techniques Guide */}
          <section className="examples-section">
        <button 
          className="examples-toggle"
          onClick={() => setExamplesExpanded(!examplesExpanded)}
        >
          <div className="examples-toggle-left">
            <Lightbulb size={16} strokeWidth={2} />
            <span>Prompt Techniques Guide</span>
            <span className="examples-count">{PROMPT_EXAMPLES.length} techniques</span>
          </div>
          {examplesExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </button>

        {examplesExpanded && (
          <div className="examples-content">
            <div className="examples-tabs">
              {PROMPT_EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  className={`example-tab ${activeExample === ex.id ? 'active' : ''}`}
                  onClick={() => setActiveExample(activeExample === ex.id ? null : ex.id)}
                >
                  {ex.short}
                </button>
              ))}
            </div>

            {activeExample && (
              <div className="example-detail">
                {PROMPT_EXAMPLES.filter(ex => ex.id === activeExample).map(ex => (
                  <div key={ex.id}>
                    <div className="example-header">
                      <div>
                        <h4>{ex.name}</h4>
                        <p className="example-description">{ex.description}</p>
                      </div>
                      <button 
                        className="btn btn-use-example"
                        onClick={() => useExample(ex)}
                      >
                        Use This
                        <ArrowUpRight size={14} />
                      </button>
                    </div>
                    <div className="example-code">
                      <pre>{ex.example}</pre>
                    </div>
                    <div className="example-tip">
                      <Lightbulb size={13} />
                      <span>{ex.tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!activeExample && (
              <p className="examples-hint">Click a technique above to see an example</p>
            )}
          </div>
        )}
      </section>

      {/* Prompts List */}
      <section className="prompts-section">
        <div className="prompts-header">
          <h2>
            <Library size={20} strokeWidth={2} />
            Your Prompts
          </h2>
          <div className="prompts-header-actions">
            {prompts.length > 0 && (
              <div className="export-buttons">
                <button 
                  className="btn btn-export"
                  onClick={exportToCSV}
                  title="Export to CSV"
                >
                  <FileSpreadsheet size={15} strokeWidth={2} />
                  CSV
                </button>
                <button 
                  className="btn btn-export"
                  onClick={exportToPDF}
                  title="Export to PDF"
                >
                  <FileDown size={15} strokeWidth={2} />
                  PDF
                </button>
              </div>
            )}
            <span className="prompts-count">
              {filterTags.length > 0 
                ? `${filteredPrompts.length} of ${prompts.length}` 
                : prompts.length} prompt{(filterTags.length > 0 ? filteredPrompts.length : prompts.length) !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {allTags.length > 0 && (
          <div className="tags-filter-bar">
            <div className="tags-filter-label">
              <Filter size={14} />
              <span>Filter by tags:</span>
            </div>
            <div className="tags-filter-list">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-filter-chip ${filterTags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleFilterTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {filterTags.length > 0 && (
                <button 
                  className="tag-filter-clear"
                  onClick={() => setFilterTags([])}
                >
                  Clear all
                </button>
              )}
            </div>
          </div>
        )}

        {error && <div className="error">{error}</div>}

        {loading ? (
          <div className="loading">
            <Loader2 size={32} className="spin" />
            <p>Loading your prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <div className="empty-state">
            <Inbox size={48} strokeWidth={1} />
            <h3>No prompts yet</h3>
            <p>Create your first prompt above to get started!</p>
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="empty-state">
            <Filter size={48} strokeWidth={1} />
            <h3>No matching prompts</h3>
            <p>Try selecting different tags or <button className="link-btn" onClick={() => setFilterTags([])}>clear filters</button></p>
          </div>
        ) : (
          <div className="prompts-grid">
            {filteredPrompts.map((prompt, index) => (
              <article 
                key={prompt.id} 
                className="prompt-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="prompt-card-header">
                  <div className="prompt-card-title-row">
                    <h3>{prompt.title}</h3>
                    <div className="prompt-card-badges">
                      {prompt.model && (
                        <span className="prompt-card-model">
                          <Cpu size={11} strokeWidth={2} />
                          {prompt.model}
                        </span>
                      )}
                      {prompt.token_count > 0 && (
                        <span className="prompt-card-tokens-badge">
                          <Hash size={11} strokeWidth={2.5} />
                          {prompt.token_count.toLocaleString()} tokens
                        </span>
                      )}
                      {(() => {
                        const conf = analyzePromptConfidence(prompt.content, prompt.token_count)
                        return conf.level !== 'none' && (
                          <span 
                            className={`prompt-card-confidence-badge confidence-${conf.level} ${conf.hasEmotion ? 'has-emotion' : ''} clickable`}
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confidencePopover?.id === prompt.id) {
                                setConfidencePopover(null)
                              } else {
                                const rect = e.currentTarget.getBoundingClientRect()
                                const popoverWidth = 280
                                const popoverHeight = 350
                                let top = rect.bottom + 8
                                let left = rect.left
                                if (top + popoverHeight > window.innerHeight - 20) {
                                  top = Math.max(20, rect.top - popoverHeight - 8)
                                }
                                if (left + popoverWidth > window.innerWidth - 20) {
                                  left = window.innerWidth - popoverWidth - 20
                                }
                                if (left < 20) left = 20
                                setConfidencePopover({ id: prompt.id, position: { top, left }, confidence: conf })
                              }
                            }}
                          >
                            <Gauge size={11} strokeWidth={2.5} />
                            {conf.label}
                            {conf.hasEmotion && <span className="emotion-indicator">💡</span>}
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                  <div className="prompt-card-actions">
                    <div className="prompt-card-rating">
                      <StarRating 
                        value={prompt.rating || 0} 
                        onChange={(newRating) => handleRatingUpdate(prompt.id, newRating)}
                        size={14}
                      />
                    </div>
                    <button
                      className="btn btn-load-constructor"
                      onClick={() => handleLoadIntoConstructor(prompt)}
                      title="Load into Requirements Constructor"
                    >
                      <Upload size={14} />
                    </button>
                    <button
                      className={`btn btn-copy ${copiedId === prompt.id ? 'copied' : ''}`}
                      onClick={() => handleCopy(prompt.id, prompt.content)}
                      title="Copy to clipboard"
                    >
                      {copiedId === prompt.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
                
                <div className="prompt-card-content">
                  {prompt.content}
                </div>

                <div className="prompt-card-note">
                  {editingNoteId === prompt.id ? (
                    <div className="note-edit-form">
                      <input
                        type="text"
                        value={editingNoteValue}
                        onChange={(e) => setEditingNoteValue(e.target.value)}
                        placeholder="Add a note..."
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNoteUpdate(prompt.id, editingNoteValue)
                          } else if (e.key === 'Escape') {
                            cancelEditingNote()
                          }
                        }}
                      />
                      <button
                        className="btn btn-note-save"
                        onClick={() => handleNoteUpdate(prompt.id, editingNoteValue)}
                        title="Save note"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="btn btn-note-cancel"
                        onClick={cancelEditingNote}
                        title="Cancel"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="note-display"
                      onClick={() => startEditingNote(prompt.id, prompt.note)}
                    >
                      <StickyNote size={13} strokeWidth={2} />
                      {prompt.note ? (
                        <span className="note-text">{prompt.note}</span>
                      ) : (
                        <span className="note-placeholder">Add a note...</span>
                      )}
                      <Pencil size={12} className="note-edit-icon" />
                    </div>
                  )}
                </div>

                <div className="prompt-card-tags">
                  {editingTagsId === prompt.id ? (
                    <div className="tags-edit-form">
                      <div className="tags-edit-chips">
                        {editingTagsValue.map((tag) => (
                          <span key={tag} className="tag-chip small">
                            {tag}
                            <button 
                              type="button" 
                              onClick={() => removeEditingTag(tag)}
                              className="tag-remove"
                            >
                              <X size={10} />
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={editingTagInput}
                          onChange={(e) => setEditingTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault()
                              addEditingTag(editingTagInput)
                            } else if (e.key === 'Escape') {
                              setEditingTagsId(null)
                            } else if (e.key === 'Backspace' && !editingTagInput && editingTagsValue.length > 0) {
                              removeEditingTag(editingTagsValue[editingTagsValue.length - 1])
                            }
                          }}
                          onBlur={() => editingTagInput && addEditingTag(editingTagInput)}
                          placeholder="Add tag..."
                          autoFocus
                          className="tag-edit-input"
                        />
                      </div>
                      <div className="tags-edit-actions">
                        <button
                          className="btn btn-note-save"
                          onClick={() => handleTagsUpdate(prompt.id, editingTagsValue)}
                          title="Save tags"
                        >
                          <Check size={14} />
                        </button>
                        <button
                          className="btn btn-note-cancel"
                          onClick={() => setEditingTagsId(null)}
                          title="Cancel"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="tags-display"
                      onClick={() => startEditingTags(prompt.id, prompt.tags)}
                    >
                      <Tag size={13} strokeWidth={2} />
                      {(prompt.tags || []).length > 0 ? (
                        <div className="tags-list">
                          {prompt.tags.map((tag) => (
                            <span key={tag} className="tag-display">{tag}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="tags-placeholder">Add tags...</span>
                      )}
                      <Pencil size={12} className="tags-edit-icon" />
                    </div>
                  )}
                </div>
                
                <div className="prompt-card-footer">
                  <span className="prompt-card-date">
                    <Calendar size={12} strokeWidth={2} />
                    {formatDate(prompt.created_at)}
                  </span>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleDelete(prompt.id)}
                  >
                    <Trash2 size={14} strokeWidth={2} />
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
        </div>
      </div>

      {/* Confidence Breakdown Popover */}
      {confidencePopover && (
        <ConfidenceBreakdown 
          confidence={confidencePopover.confidence}
          position={confidencePopover.position}
          onClose={() => setConfidencePopover(null)}
        />
      )}

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

export default App
