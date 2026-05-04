import { useAnecdotes } from '../hooks/useAnecdotes'

const AnecdoteList = () => {
  const { anecdotes, voteAnecdote } = useAnecdotes()

  // Sort by votes descending
  const sortedAnecdotes = anecdotes.toSorted((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id} style={{ marginBottom: '1rem' }}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes} votes{' '}
            <button onClick={() => voteAnecdote(anecdote)}>
              vote
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList