const { test, after, beforeEach, describe, beforeAll } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)





describe('if no users logged', () => {

  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()
    }

    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })


  test('401 unauthorized to get', async () => {
    await api
      .get('/api/blogs')
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })

  test('401 unauthorized post new blog', async () => {
    const newBlog = 
      {
        title: "new blog",
        author: "new blog",
        url: "new blog",
        likes: 7,
      }
    

    await api.post('/api/blogs').send(newBlog).expect(401).expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })



})

describe('when there is initially some blogs saved', () => {
  
  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()

    }


    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }


  })

  test('blogs are returned as json', async () => {

    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('verify id identificator vs _id', async () => {
    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${token}`)

    response.body.forEach(blog => {
        assert.ok(blog.id) 
        assert.strictEqual(blog._id, undefined)
    })
  })

  

})

describe('addition of a new Blog', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()
    }

    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('verify post new blog', async () => {

    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token

    const newBlog = 
      {
        title: "new blog",
        author: "new blog",
        url: "new blog",
        likes: 7,
      }
    

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)
    const titles = blogsAtEnd.map(blog => blog.title);
    assert.ok(titles.includes(newBlog.title));
  })

  test('verify post new blog without likes, starts with 0', async () => {
    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const newBlog = 
      {
        title: "no likes",
        author: "no likes",
        url: "no likes",
      }
    

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(201).expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd[blogsAtEnd.length-1].likes, 0)

  })

  test('verify post new blog without title or url returns 400', async () => {
    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const newBlog = 
      {
        author: "no likes"
      }
    
    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400).expect('Content-Type', /application\/json/)
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

})

describe('deletion of a blog', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()
    }

    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('succeeds with status code 204 if id is valid', async () => {

    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(blogToDelete.title))
  })


  test("only delete user's blog", async () => {

    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[3]

    const deleted = await api
      .delete(`/api/blogs/${blogToDelete.id}`).set('Authorization', `Bearer ${token}`)
      .expect(403).expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(deleted.body, {error: 'user must be who created the blog'})

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length )

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(blogToDelete.title))
  })
})

describe('update of a blog', () => {

  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()
    }

    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })
  test('likes updated', async () => {
    const loginResponse = await api
    .post('/api/login') 
    .send({
      username: helper.initialUsers[0].username,
      password: helper.initialUsers[0].password
    })
  
    const token =  loginResponse.body.token
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      id : blogToUpdate.id,
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes+5
    }

    const updatedBlog= await api
      .put(`/api/blogs/${blogToUpdate.id}`).set('Authorization', `Bearer ${token}`)
      .send(newBlog)

    assert.notStrictEqual(updatedBlog.likes, blogToUpdate.likes)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes(blogToUpdate.title))
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })

  test('401 unauthorized likes updated', async () => {

    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newBlog = {
      id : blogToUpdate.id,
      title: blogToUpdate.title,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes+5
    }

    const updatedBlog=  await api
    .put('/api/blogs')
    .send(newBlog)
    .expect(401)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

  })
})


describe('user test', () => {

  beforeEach(async () => {

    await User.deleteMany({})

    for (let user of helper.initialUsers) {
      
      const saltRounds = 10
      const passHash = await bcrypt.hash(user.password, saltRounds)

      const newUser = new User(
        {
          _id: user._id,
          username: user.username,
          name: user.name,
          passwordHash: passHash,
          blogs: user.blogs,
          __v: user.__v
        }
      )
      let userObject = new User(newUser)
      await userObject.save()
    }

    await Blog.deleteMany({})
  
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog)
      await blogObject.save()
    }
  })

  test('Username must have 3 or more characters', async () => {

    const newUser = {
      username : 'aa',
      password: 'aaaaaa',
      name: 'aaaa',

    }

    

    const userSaved = await api.post(`/api/users/`).send(newUser).expect(400).expect('Content-Type', /application\/json/)
    
    assert.deepStrictEqual(userSaved.body, { error: 'Username must have 3 or more characters' })

    const updatedUsers = await helper.usersInDb()

    assert.strictEqual(helper.initialUsers.length, updatedUsers.length)



  })

  test('Password must have 3 or more characters', async () => {

    const newUser = {
      username : 'bbbb',
      password: 'bb',
      name: 'bbbbb',

    }
    

    const userSaved = await api.post(`/api/users/`).send(newUser).expect(400).expect('Content-Type', /application\/json/)
    assert.deepStrictEqual(userSaved.body, { error: 'Password must have 3 or more characters' })

    const updatedUsers = await helper.usersInDb()

    assert.strictEqual(helper.initialUsers.length, updatedUsers.length)


  })
})




after(async () => {
  await mongoose.connection.close()
})