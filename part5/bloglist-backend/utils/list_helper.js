const dummy = () => {
  return 1
}

const totalLikes = (array) => {
  return array.length === 0
    ? 0
    : array.reduce((acc, blog) => acc + blog.likes, 0)
}

const favoriteBlog = array => {
  let mostLikes = array[0]

  array.forEach(blog => {
    if (blog.likes > mostLikes.likes) {
      mostLikes = blog
    }
  })

  return (array.length === 0)
    ? null
    : mostLikes
}

const mostBlogs = array => {
  let obj = {}

  array.forEach(blog => {
    obj[blog.author] = obj[blog.author] + 1 || 1
  })

  const author = Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .at(0)

  return {
    author: author[0],
    blogs: author[1]
  }
}

const mostLikes = array => {
  let obj = {}

  array.forEach(blog => {
    obj[blog.author] = obj[blog.author] + blog.likes || blog.likes
  })

  const author = Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .at(0)

  return {
    author: author[0],
    likes: author[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}