import * as React from 'react'
import {render, screen, waitForElementToBeRemoved, within} from '@testing-library/react'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import {buildUser, buildBook} from 'test/generate'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {AppProviders} from 'context'
import {App} from 'app'
import userEvent from '@testing-library/user-event'

// general cleanup
afterEach(async () => {
  queryCache.clear()
  await Promise.all([
    auth.logout(),
    usersDB.reset(),
    booksDB.reset(),
    listItemsDB.reset(),
  ])
})

test('renders all the book information', async () => {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)

  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  window.history.pushState({}, 'Test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})

test('can create a list item for the book', async () => {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)

  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  window.history.pushState({}, 'Test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

  const AddToListButton = screen.getByRole('button', {name: /add to list/i})
  await userEvent.click(AddToListButton)
  await waitForElementToBeRemoved(() => within(AddToListButton).queryByLabelText(/loading/i))

  const markAsRead = screen.getByRole('button', {name: /mark as read/i})
  const removeFromList = screen.getByRole('button', {name: /remove from list/i})


  expect(markAsRead).toHaveAttribute('aria-label', "Mark as read")
  expect(markAsRead).toBeInTheDocument()
  expect(removeFromList).toHaveAttribute('aria-label', "Remove from list")
  expect(markAsRead).toBeInTheDocument()

  const ReadingListNav = screen.getByRole('link', {name: /reading list/i})
  await userEvent.click(ReadingListNav)


  const listItem = screen.getByRole('listitem', {name: book.title})
  expect(listItem).toBeInTheDocument()
})

test('can create a list item for the book (this is in the /discover page)', async () => {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)

  // const book = await booksDB.create(buildBook())
  const route = `/discover`
  window.history.pushState({}, 'Test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])

  const book = screen.getByRole('listitem', {name: /the hobbit/i})
  const AddToListButton = within(book).getByRole('button', {name: /add to list/i})
  await userEvent.click(AddToListButton)
  await waitForElementToBeRemoved(() => within(AddToListButton).queryByLabelText(/loading/i))

  const [markAsRead, removeFromList] = within(book).getAllByRole('button')

  expect(markAsRead).toHaveAttribute('aria-label', "Mark as read")
  expect(markAsRead).toBeInTheDocument()
  expect(removeFromList).toHaveAttribute('aria-label', "Remove from list")
  expect(markAsRead).toBeInTheDocument()

  const ReadingListNav = screen.getByRole('link', {name: /reading list/i})
  await userEvent.click(ReadingListNav)
  
  const listItem = screen.getByRole('listitem', {name: /the hobbit/i})
  expect(listItem).toBeInTheDocument()
  expect(listItem.innerHTML).toMatch(book.innerHTML)

})