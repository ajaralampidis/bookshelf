// 🐨 here are the things you're going to need for this test:
import * as React from 'react'
import {findByRole, render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

window.fetch = async (url, config) => {
    console.warn(url, config)
    return Promise.reject(new Error(`NEED TO HANDLE: ${url}`))
}

// 🐨 after each test, clear the queryCache and auth.logout
afterEach(() => {
    queryCache.clear()
    auth.logout()
})


test('renders all the book information', async () => {
    // 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)
    localStorage.setItem(auth.localStorageKey, "auth_key");

    // 🐨 create a user using `buildUser`
    const user = buildUser()
    // 🐨 create a book use `buildBook`
    const book = buildBook()
    // 🐨 update the URL to `/book/${book.id}`
    //   💰 window.history.pushState({}, 'page title', route)
    //   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    const route = `/book/${book.id}`
    window.history.pushState({}, 'page title', route)

    // 🐨 reassign window.fetch to another function and handle the following requests:
    // - url ends with `/bootstrap`: respond with {user, listItems: []}
    // - url ends with `/list-items`: respond with {listItems: []}
    // - url ends with `/books/${book.id}`: respond with {book}
    // 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
    // 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})
    window.fetch = async (url, config) => {

            const res = (data) => Promise.resolve({ok: true, json: async () => data});

            if (url.includes("/bootstrap")) {
                return res({user, listItems: []});
            }
            
            if (url.includes("/list-items")) {
                return res({listItems: []})
            }

            if (url.includes(`/books/${book.id}`)) {
                return res({book});
            }
    }

    
    // 🐨 render the App component and set the wrapper to the AppProviders
    // (that way, all the same providers we have in the app will be available in our tests)
    render(
        <AppProviders>
            <App />
        </AppProviders>
    )

    await waitForElementToBeRemoved(() => screen.getByLabelText(/loading/i))



    // 🐨 use findBy to wait for the book title to appear
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#findby-queries
    const title = await screen.findByRole('heading', { name: book.title });
    
    
    // 🐨 assert the book's info is in the document
    expect(title).toHaveTextContent(book.title)

    // screen.debug()


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
