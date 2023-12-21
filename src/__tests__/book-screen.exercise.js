import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import {buildUser, buildBook} from 'test/generate'
import * as usersDB from 'test/data/users'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import {AppProviders} from 'context'
import {App} from 'app'

// > 💰 In my solution I have a custom `render`, a `loginAsUser`, and a
// > `waitForLoadingToFinish`

const _render = async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`
  window.history.pushState({}, 'Test page', route)

  const r = render(<App />, {wrapper: AppProviders})

  return {book, route, r}
}

const loginAsUser = async () => {
  const user = buildUser()
  await usersDB.create(user)
  const authUser = await usersDB.authenticate(user)
  window.localStorage.setItem(auth.localStorageKey, authUser.token)
  return {user, authUser}
}

const waitForLoadingToFinish = async () => {
  await waitForElementToBeRemoved(async () => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i),
  ])
}

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
  // const user = buildUser()
  // await usersDB.create(user)
  // const authUser = await usersDB.authenticate(user)
  // window.localStorage.setItem(auth.localStorageKey, authUser.token)

  // const book = await booksDB.create(buildBook())
  // const route = `/book/${book.id}`
  // window.history.pushState({}, 'Test page', route)

  // render(<App />, {wrapper: AppProviders})
  
  
  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])

  await loginAsUser()
  const {book} = await _render()
  await waitForElementToBeRemoved()


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
  // const user = buildUser()
  // await usersDB.create(user)
  // const authUser = await usersDB.authenticate(user)
  // window.localStorage.setItem(auth.localStorageKey, authUser.token)

  // const book = await booksDB.create(buildBook())
  // const route = `/book/${book.id}`
  // window.history.pushState({}, 'Test page', route)

  // render(<App />, {wrapper: AppProviders})

  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])

  await loginAsUser()
  await _render()
  await waitForElementToBeRemoved()


  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  await userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  // await waitForElementToBeRemoved(() => [
  //   ...screen.queryAllByLabelText(/loading/i),
  //   ...screen.queryAllByText(/loading/i),
  // ])
  await waitForElementToBeRemoved()


  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument()

  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})
