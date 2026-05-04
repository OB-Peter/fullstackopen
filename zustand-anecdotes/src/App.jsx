import { useAnecdotes } from './hooks/useAnecdotes'
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Notification from './components/Notification'

const App = () => {
  const { isPending, isError, error } = useAnecdotes()

  // 6.16: Show loading state
  if (isPending) {
    return <div>loading data...</div>
  }

  // 6.16: Show error page if server is down
  if (isError) {
    return (
      <div>
        <h2>Anecdote app</h2>
        <p>{error.message}</p>
      </div>
    )
  }

  return (
    <div>
      <h2>Anecdote app</h2>
      <Notification />
      <AnecdoteForm />
      <AnecdoteList />
    </div>
  )
}

export default App