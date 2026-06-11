import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  beforeEach(() => {
    const blog = {
      author: 'Author test',
      likes: 0,
      title: 'Title test',
      url: 'testing.com',
      user: {
        name: 'user test'
      }
    }

    render(
      <Blog blog={blog} />
    )
  })

  test('renders its title and author but not the rest', () => {
    const titleAndAuthor = screen.getByText('Title test Author test')
    const url = screen.queryByText('testing.com')
    const likes = screen.queryByText('likes 0')
    expect(titleAndAuthor).toBeVisible()
    expect(url, likes).toBeNull()
  })

  test('url and likes are displayed when the button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const url = screen.getByText('testing.com')
    const likes = screen.getByText('likes 0')
    expect(url, likes).toBeVisible()
  })
})

test.only('event handler is called twice when the likes button is clicked twice', async() => {
  const blog = {
    author: 'Author test',
    likes: 0,
    title: 'Title test',
    url: 'testing.com',
    user: {
      name: 'user test'
    }
  }

  const increaseLikes = vi.fn()

  render(
    <Blog blog={blog} updateBlog={increaseLikes} />
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)
  const likesButton = screen.getByText('like')
  await user.click(likesButton)
  await user.click(likesButton)

  expect(increaseLikes.mock.calls).toHaveLength(2)
})
