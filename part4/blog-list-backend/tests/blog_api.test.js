const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

const api = supertest(app)

describe('Some blogs are saved before each test', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    await Promise.all(blogObjects.map(blog => blog.save()))
  })

  test('All blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  describe('Testing GET requests', () => {
    test('returned blogs have a property named id', async () => {
      const response = await api.get('/api/blogs')

      assert(Object.prototype.hasOwnProperty.call(response.body[0], 'id'))
    })
  })

  describe('Testing POST requests', () => {
    test('A blog is added', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('If the value of the likes propery is missing, the default value is zero', async () => {
      const newBlog = {
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }

      const savedBlog = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      assert.strictEqual(savedBlog.body.likes, 0)
    })

    test('If the value of either title or url property is missing, the result is a status code 400', async () => {
      const newBlog1 = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      }

      const newBlog2 = {
        title: 'First class tests',
        author: 'Robert C. Martin',
      }

      await api
        .post('/api/blogs')
        .send(newBlog1)
        .expect(400)

      await api
        .post('/api/blogs')
        .send(newBlog2)
        .expect(400)
    })
  })

  describe('Testing DELETE requests', () => {
    test('A blog is deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()
      const ids = blogsAtEnd.map(blog => blog.id)
      assert(!ids.includes(blogToDelete.id))
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })
  })

  describe('Testing PUT requests', () => {
    test('A blog is updated, the value of the likes property is increased by 5', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: blogToUpdate.likes + 5 })
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id)
      assert.strictEqual(updatedBlog.likes, helper.initialBlogs[0].likes + 5)
    })
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'test', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'panda',
      name: 'My Name',
      password: 'myPassword',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test.only('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'test',
      name: 'test user',
      password: 'test'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})




after(async () => {
  await mongoose.connection.close()
})