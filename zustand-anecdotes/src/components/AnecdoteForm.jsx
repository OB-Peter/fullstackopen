import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdotes()

  const handleSubmit = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value

    if (content.length < 5) {
      alert('Anecdote must be at least 5 characters long')
      return
    }

    addAnecdote(content)
    event.target.anecdote.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="anecdote"
          placeholder="write anecdote here (min 5 chars)..."
        />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm