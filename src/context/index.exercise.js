import React from 'react'
import {ReactQueryConfigProvider} from 'react-query/dist/react-query.development'
import {BrowserRouter as Router} from 'react-router-dom'
import {AuthProvider} from 'context/auth-context.exercise.js'

const queryConfig = {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry(failureCount, error) {
        if (error.status === 404) return false
        else if (failureCount < 2) return true
        else return false
      },
    },
  }
  

// this module doesn't do anything for the exercise. But you'll use this for
// the extra credit!
function AppProviders({children}) {
  return (
    <ReactQueryConfigProvider config={queryConfig}>
      <AuthProvider>
        <Router>{children}</Router>
      </AuthProvider>
    </ReactQueryConfigProvider>
  )
}

export {AppProviders}
