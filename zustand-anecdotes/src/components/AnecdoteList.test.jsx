import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

// ✅ Clean up DOM after each test
afterEach(() => {
  cleanup()
})

vi.mock('../store', () => ({
  useAnecdotes: vi.fn(),
  useAnecdoteActions: vi.fn(() => ({
    voteAnecdote: vi.fn(),
    deleteAnecdote: vi.fn(),
  })),
}))

vi.mock('../notificationStore', () => ({
  useNotificationActions: vi.fn(() => ({
    setNotification: vi.fn(),
  })),
}))

import { useAnecdotes } from '../store'
import AnecdoteList from './AnecdoteList'

describe('6.13 - AnecdoteList renders anecdotes sorted by votes', () => {

  it('renders anecdotes in descending order by votes', () => {
    const unsortedAnecdotes = [
      { id: 1, content: 'Low votes anecdote', votes: 1 },
      { id: 2, content: 'High votes anecdote', votes: 10 },
      { id: 3, content: 'Medium votes anecdote', votes: 5 },
    ]

    useAnecdotes.mockReturnValue(unsortedAnecdotes)
    render(<AnecdoteList />)

    const anecdoteElements = screen.getAllByText(/votes anecdote/i)

    expect(anecdoteElements[0].textContent).toContain('High votes anecdote')
    expect(anecdoteElements[1].textContent).toContain('Medium votes anecdote')
    expect(anecdoteElements[2].textContent).toContain('Low votes anecdote')
  })

  it('renders all anecdotes received from the store', () => {
    const anecdotes = [
      { id: 1, content: 'First anecdote', votes: 0 },
      { id: 2, content: 'Second anecdote', votes: 0 },
      { id: 3, content: 'Third anecdote', votes: 0 },
    ]

    useAnecdotes.mockReturnValue(anecdotes)
    render(<AnecdoteList />)

    expect(screen.getByText('First anecdote')).toBeDefined()
    expect(screen.getByText('Second anecdote')).toBeDefined()
    expect(screen.getByText('Third anecdote')).toBeDefined()
  })

  it('renders vote count for each anecdote', () => {
    const anecdotes = [
      { id: 1, content: 'Test anecdote', votes: 7 },
    ]

    useAnecdotes.mockReturnValue(anecdotes)
    render(<AnecdoteList />)

    expect(screen.getByText(/7/)).toBeDefined()
  })

  it('renders empty list when no anecdotes', () => {
    // ✅ mockReturnValue([]) so no anecdotes render
    useAnecdotes.mockReturnValue([])
    render(<AnecdoteList />)

    const buttons = screen.queryAllByText('vote')
    expect(buttons).toHaveLength(0)
  })
})