import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import NotificationContext, { useNotificationDispatch } from './NotificationContext'


const App = () => {

  const {data:anecdotes, isLoading, error} = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes
  })
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch()


  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
      // Despacha la notificación de éxito cuando se añade una anécdota
      notificationDispatch({
        type: 'ADD',
        payload: { message: `${newAnecdote.content} voted` }
      })

    }
  })

  const handleVote = (anecdote) => {
    const newAnecdote = {...anecdote, votes: anecdote.votes +1 }
    updateAnecdoteMutation.mutate(newAnecdote)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>anecdote service not available due to problems in server</div>
  }

  // const anecdotes = [
  //   {
  //     "content": "If it hurts, do it more often",
  //     "id": "47145",
  //     "votes": 0
  //   },
  // ]

  return (
    <div>
      <h3>Anecdote app</h3>
      
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
