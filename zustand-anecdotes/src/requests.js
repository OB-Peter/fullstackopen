const baseUrl = 'http://localhost:3001/anecdotes'

// 6.16: GET all anecdotes
export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('anecdote service not available due to problems in server')
  }
  return await response.json()
}

// 6.17: POST new anecdote
export const createAnecdote = async (content) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, votes: 0 }),
  })
  if (!response.ok) {
    throw new Error('Failed to create anecdote')
  }
  return await response.json()
}

// 6.18: PUT update anecdote (voting)
export const updateAnecdote = async (updatedAnecdote) => {
  const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedAnecdote),
  })
  if (!response.ok) {
    throw new Error('Failed to update anecdote')
  }
  return await response.json()
}