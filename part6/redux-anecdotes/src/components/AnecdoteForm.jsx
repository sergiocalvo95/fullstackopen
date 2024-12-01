import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotificationWithTimeout } from '../reducers/notificationReducer'
import anecdotes from '../services/anecdotes'


const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const anecdote = event.target.anecdote.value 
        event.target.anecdote.value = ''
        const newAnecdote = await anecdotes.createNew(anecdote)
        dispatch(appendAnecdote(newAnecdote))
        
        dispatch(setNotificationWithTimeout(`you added '${newAnecdote.content}'`, 5))
      }

    return (
        <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input type='text' name='anecdote'  /></div>
            <button type='submit'>create</button>
        </form>
    </div>
    )
}


export default AnecdoteForm