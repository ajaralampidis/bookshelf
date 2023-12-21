import * as React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  userEvent,
  loginAsUser,
} from 'test/app-test-utils'
import {buildBook} from 'test/generate'
import * as booksDB from 'test/data/books'
import {formatDate} from 'utils/misc'
import {App} from 'app'
import * as listItemsDB from 'test/data/list-items'
import {buildListItem} from 'test/generate'


const fakeTimerUserEvent = userEvent.setup({
  advanceTimers: () => jest.runOnlyPendingTimers(),
})

test('renders all the book information', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

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
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  await userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

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

async function setUp({bookOverwrite = {}} = {}) {
  const user = await loginAsUser()
  const book = await booksDB.create(buildBook())
  await listItemsDB.create(buildListItem({owner: user, book: {...book, ...bookOverwrite}}))
  return {user, book}
}

test('can remove a list item for the book', async () => {
  const {user, book} = await setUp()
  await render(<App />, {user})

  const listItem = screen.getByRole('listitem', {name: book.title})
  expect(listItem).toBeInTheDocument()
  const removeItemButton = screen.getByRole('button', {
    name: /Remove from list/i,
  })
  await userEvent.click(removeItemButton)
  // await waitForLoadingToFinish()
  expect(listItem).not.toBeInTheDocument()
  expect(screen.getByText(/Hey there! Welcome to your bookshelf reading list/i))
    .toMatchInlineSnapshot(`
    <p>
      Hey there! Welcome to your bookshelf reading list. Get started by heading over to 
      <a
        class="css-dkietk-Link e1baol0z8"
        href="/discover"
      >
        the Discover page
      </a>
       to add books to your list.
    </p>
  `)

  const listItems = await listItemsDB.readByOwner(user.id)
  expect(listItems.length).toBe(0)
})

test('can mark a list item as read', async () => {
  const {user, book} = await setUp()
  await render(<App />, {user})

  const unreadBook = (await listItemsDB.readByOwner(user.id))[0]


  const listItem = screen.getByRole('listitem', {name: book.title})
  expect(listItem).toBeInTheDocument()
  const markAsReadButton = screen.getByRole('button', {name: /Mark as read/i})
  await userEvent.click(markAsReadButton)
  // await waitForLoadingToFinish()
  expect(listItem).not.toBeInTheDocument()
  expect(screen.getByText(/Looks like you've finished all your books/i))
    .toMatchInlineSnapshot(`
    <p>
      Looks like you've finished all your books! Check them out in your
       
      <a
        class="css-dkietk-Link e1baol0z8"
        href="/finished"
      >
        finished books
      </a>
       or
       
      <a
        class="css-dkietk-Link e1baol0z8"
        href="/discover"
      >
        discover more
      </a>
      .
    </p>
  `)

  const readBook = (await listItemsDB.readByOwner(user.id))[0]
  expect(readBook).toMatchObject({...unreadBook, finishDate: expect.any(Number)})

})


// > 3. can edit a note
test('can edit a note', async () => {
  jest.useFakeTimers()

  const {user, book} = await setUp({bookOverwrite: {finishDate: 1703191134601}})
  const route = `/book/${book.id}`
  await render(<App />, {user, route})

  const notes = screen.getByRole('textbox')
  const note = "Good Book"
  await fakeTimerUserEvent.clear(notes)
  await fakeTimerUserEvent.type(notes, note)
  await screen.findByLabelText(/loading/i)

  const dbBook = (await listItemsDB.readByOwner(user.id))[0]
  expect(notes.value).toBe(note)
  expect(dbBook.notes).toBe(note)
})