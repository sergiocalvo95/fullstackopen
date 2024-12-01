import { useSelector, useDispatch } from 'react-redux'
import { vote} from '../reducers/anecdoteReducer'
import {setNotificationWithTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if(state.filter === 'ALL'){
            return state.anecdotes
        }
        return state.anecdotes.filter(anecdote =>
            anecdote.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    })
    const dispatch = useDispatch()
  
    const handleVote = (anecdote) => {
      dispatch(vote(anecdote.id,anecdote))
      dispatch(setNotificationWithTimeout(`you voted '${anecdote.content}'`, 5))
    }
    return (
        <div>
        {[...anecdotes]
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
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

export default AnecdoteList