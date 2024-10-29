const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes:1 })

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if(!username || !password){
    return response.status(400).send({ error: 'Username or password is missing' })
  }

  if(username.length <3 ) return response.status(400).send({ error: 'Username must have 3 or more characters' })
  if(password.length <3 ) return response.status(400).send({ error: 'Password must have 3 or more characters' })
  
  const existingUser = await User.findOne({ username: username })
  if(existingUser) return response.status(409).send({ username: 'Username must be unique' })


  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter