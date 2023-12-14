import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './app'
import {
  ReactQueryConfigProvider,
} from 'react-query'

// In the `src/index.js` file, create a queryConfig object here and enable
// `useErrorBoundary` and disable `refetchOnWindowFocus` for queries (not for
// mutations though). You may also consider customizing the `retry` option as well.
// See if you can figure out how to make it not retry if the error status is 404 or
// if the failure count is greater than 2.

// ignore the rootRef in this file. I'm just doing it here to make
// the tests I write to check your work easier.


const queryConfig = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry(failureCount, error){
      if (error.status === 404) return false
      else if (failureCount < 2) return true
      else return false
    }
  },
}

function WrappedApp () {
  return (    
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>
  )
}

export const rootRef = {}
loadDevTools(() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <WrappedApp />
  )
  rootRef.current = root
})
