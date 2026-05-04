import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// ✅ STEP 1: mock FIRST before any imports
vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

// ✅ STEP 2: imports AFTER mock
import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

// ─────────────────────────────────────────
// Test data
// ─────────────────────────────────────────
const mockAnecdotes = [
  { id: 1, content: 'If it hurts, do it more often', votes: 5 },
  { id: 2, content: 'Adding manpower to a late project makes it later', votes: 3 },
  { id: 3, content: 'Premature optimization is the root of all evil', votes: 8 },
]

// ✅ STEP 3: reset store and mocks before each test
beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
  vi.clearAllMocks()
})

// ─────────────────────────────────────────
// 6.12: Initialize loads anecdotes from backend
// ─────────────────────────────────────────
describe('6.12 - initialize', () => {
  it('loads anecdotes from the backend into the store', async () => {
    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())

    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
  })

  it('store starts empty before initialize is called', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(0)
  })

  it('initialize replaces existing anecdotes with server data', async () => {
    useAnecdoteStore.setState({
      anecdotes: [{ id: 99, content: 'Old anecdote', votes: 0 }]
    })

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.initialize()
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current).toEqual(mockAnecdotes)
    expect(anecdotesResult.current).not.toContainEqual(
      expect.objectContaining({ id: 99 })
    )
  })
})

// ─────────────────────────────────────────
// 6.14: Filter returns correct anecdotes
// ─────────────────────────────────────────
describe('6.14 - filtering', () => {
  const anecdotes = [
    { id: 1, content: 'If it hurts do it more often', votes: 5 },
    { id: 2, content: 'Adding manpower makes it later', votes: 3 },
    { id: 3, content: 'Premature optimization is evil', votes: 8 },
  ]

  beforeEach(() => {
    useAnecdoteStore.setState({ anecdotes, filter: '' })
  })

  it('returns all anecdotes when filter is empty', () => {
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(3)
  })

  it('filters anecdotes by matching content string', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'hurts' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe(1)
  })

  it('filter is case insensitive', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'HURTS' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(1)
    expect(result.current[0].id).toBe(1)
  })

  it('returns empty array when filter matches nothing', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'zzzzzzz' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current).toHaveLength(0)
  })

  it('returns multiple anecdotes when filter matches several', () => {
    useAnecdoteStore.setState({ anecdotes, filter: 'it' })
    const { result } = renderHook(() => useAnecdotes())
    expect(result.current.length).toBeGreaterThan(1)
  })
})

// ─────────────────────────────────────────
// 6.15: Voting increases vote count
// ─────────────────────────────────────────
describe('6.15 - voting', () => {
  it('increases the vote count of the voted anecdote by 1', async () => {
    const anecdotes = [
      { id: 1, content: 'If it hurts, do it more often', votes: 5 },
      { id: 2, content: 'Adding manpower makes it later', votes: 3 },
    ]
    useAnecdoteStore.setState({ anecdotes })

    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 6 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.voteAnecdote(1)
    })

    const state = useAnecdoteStore.getState()
    const voted = state.anecdotes.find((a) => a.id === 1)
    expect(voted.votes).toBe(6)
  })

  it('only changes the voted anecdote, not others', async () => {
    const anecdotes = [
      { id: 1, content: 'If it hurts, do it more often', votes: 5 },
      { id: 2, content: 'Adding manpower makes it later', votes: 3 },
    ]
    useAnecdoteStore.setState({ anecdotes })

    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 6 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.voteAnecdote(1)
    })

    const state = useAnecdoteStore.getState()
    const unvoted = state.anecdotes.find((a) => a.id === 2)
    expect(unvoted.votes).toBe(3)
  })

  it('calls the update service with correct data', async () => {
    const anecdotes = [
      { id: 1, content: 'If it hurts, do it more often', votes: 5 },
    ]
    useAnecdoteStore.setState({ anecdotes })
    anecdoteService.update.mockResolvedValue({ ...anecdotes[0], votes: 6 })

    const { result } = renderHook(() => useAnecdoteActions())
    await act(async () => {
      await result.current.voteAnecdote(1)
    })

    expect(anecdoteService.update).toHaveBeenCalledWith(
      1,
      { id: 1, content: 'If it hurts, do it more often', votes: 6 }
    )
  })
})