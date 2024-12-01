import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from '../NotificationContext'; // Importa el hook para despachar notificaciones


const getId = () => (100000 * Math.random()).toFixed(0)


const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationDispatch(); // Accede al dispatch de notificaciones



  const newanecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      // Despacha la notificación de éxito cuando se añade una anécdota
      notificationDispatch({
        type: 'ADD',
        payload: { message: `anecdote ${newAnecdote.content} added` }
      });
      
    },
    onError: () => {
      notificationDispatch({
        type: 'ERROR',
        payload: { message: 'too short anecdote, must have length 5 or more' }
      });
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    const newObject = asObject(content)
    newanecdoteMutation.mutate(newObject)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
