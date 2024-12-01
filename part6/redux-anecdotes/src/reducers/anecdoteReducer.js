import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from '../services/anecdotes'

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

// const reducer = (state = initialState, action) => {
//   console.log('state now: ', state)
//   console.log('action', action)

//   switch (action.type) {
//     case 'ADD_VOTE': {
//       const id = action.payload.id
//       const anecdoteToVote = state.find(a => a.id === id)
//       const votedAnecdote = {
//         ...anecdoteToVote,
//         votes: anecdoteToVote.votes +1
//       }
//       return state.map(anecdote => anecdote.id !== id? anecdote : votedAnecdote)
//     }
//     case 'NEW_ANECDOTE':
//       return [...state, asObject(action.payload.anecdote)]
  
//     default:
//       return state
//   }
// }

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    appendAnecdote(state, action) {
      // const anecdote = asObject(action.payload.anecdote)
      state.push(action.payload)
    },
    addVote(state, action) {
      const votedAnecdote = action.payload;
      return state.map(anecdote =>
        anecdote.id !== votedAnecdote.id ? anecdote : votedAnecdote
      )
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  },
})

// export const createAnecdote = (anecdote) => {
//   return{
//     type: 'NEW_ANECDOTE',
//     payload: {
//       anecdote
//     } 
//   }
// }

// export const addVote = (id) =>{
//   return{
//     type: 'ADD_VOTE',
//     payload: {id}
//   }
// }

export const{ addVote,appendAnecdote ,setAnecdotes} = anecdoteSlice.actions



export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (id,anecdote) => {
  return async dispatch => {
    
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    await anecdoteService.vote(votedAnecdote)
    dispatch(addVote(votedAnecdote))
  }
}



export default anecdoteSlice.reducer