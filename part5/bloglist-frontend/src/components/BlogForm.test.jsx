import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test.only('the event handler that creates a new blog gets all correct input', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} user={{ name: 'test user' }} />)

  const button = screen.getByText('create new blog')
  await user.click(button)

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  expect(title, author, url).toBeVisible()

  await user.type(title, 'test title')
  await user.type(author, 'test author')
  await user.type(url, 'testing.com')
  const submitButton = screen.getByText('create')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('testing.com')
})