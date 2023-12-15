import * as React from 'react'

const AuthContext = React.createContext()

function useAuth() {
    const auth = React.useContext(AuthContext)

    if (!auth) throw new Error('you are using AuthContext outside the provider')

    return auth
}

export {AuthContext, useAuth}
