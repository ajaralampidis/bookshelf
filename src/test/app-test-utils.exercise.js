import {
    render as rtlRender,
    waitForElementToBeRemoved,
    screen
} from '@testing-library/react'
import * as auth from 'auth-provider'
import {buildUser} from 'test/generate'
import * as usersDB from 'test/data/users'
import {AppProviders} from 'context'
  


async function render(ui, {route = '/list', user, ...renderOptions} = {}) {
    // if you want to render the app unauthenticated then pass "null" as the user
    user = typeof user === 'undefined' ? await loginAsUser() : user
    window.history.pushState({}, 'Test page', route)
  
    const returnValue = {
      ...rtlRender(ui, {wrapper: AppProviders, ...renderOptions}),
      user,
    }
  
    await waitForLoadingToFinish()
  
    return returnValue
  }
  
  async function loginAsUser(userProperties) {
    const user = buildUser(userProperties)
    await usersDB.create(user)
    const authUser = await usersDB.authenticate(user)
    window.localStorage.setItem(auth.localStorageKey, authUser.token)
    return authUser
  }
  
  const waitForLoadingToFinish = () =>
    waitForElementToBeRemoved(() => [
      ...screen.queryAllByLabelText(/loading/i),
      ...screen.queryAllByText(/loading/i),
    ])
  

// re-export everything
export * from '@testing-library/react'

// override render method
export {render, loginAsUser, waitForLoadingToFinish}