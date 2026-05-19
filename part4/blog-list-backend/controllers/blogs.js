const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.title) {
    return response.status(400).json({ error: 'title is missing' })
  } else if (!body.url) {
    return response.status(400).json({ error: 'url is missing' })
  }

  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

  await Blog.findByIdAndDelete(id)
  response.status(204).end()

})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    response.status(404).end()
  }

  blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter