import * as auth from 'auth-provider'
const apiURL = process.env.REACT_APP_API_URL

// results in fetch getting called with:
// url: http://example.com/pets
// config:
//  - method: 'POST'
//  - body: '{"name": "Fluffy", "type": "cat"}'
//  - headers:
//    - 'Content-Type': 'application/json'
//    - Authorization: 'Bearer THE_USER_TOKEN'



function client(
  endpoint,
  {token, headers: customHeaders, data, ...customConfig} = {},
) {
  const config = {
    method: data ? 'POST' : 'GET',
    headers: {
      "Content-Type": data ? 'application/json' : undefined,
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    if (response.status === 401) {
      await auth.logout()
      // refresh the page for them
      window.location.assign(window.location)
      return Promise.reject({message: 'Please re-authenticate.'})
    }
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
      return Promise.reject(data)
    }
  })
}

export {client}
