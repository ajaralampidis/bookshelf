// 🐨 you'll need to import react and createRoot from react-dom up here
import React from 'react'
import {createRoot} from 'react-dom'

// 🐨 you'll also need to import the Logo component from './components/logo'
import {Logo} from './components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

// 🐨 create an App component here and render the logo, the title ("Bookshelf"), a login button, and a register button.
// 🐨 for fun, you can add event handlers for both buttons to alert that the button was clicked

// function App() {

//     const handleLogin = () => {
//         alert("handleLogin")
//     }

//     const handleRegister = () => {
//         alert("handleRegister")
//     }

//     return (
//         <>
//             <title>Bookshelf</title>
//             <Logo />
//             <button type='button' onClick={handleLogin} > login </button>
//             <button type='button' onClick={handleRegister} > register </button>

//         </>
//     )
// }


function LoginForm({onSubmit, buttonText}) {
// username` and `password
    function handleSubmit(event) {
        event.preventDefault()
        const {username, password} = event.target.elements

        onSubmit({
        username: username.value,
        password: password.value,
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Username:
                <input name="username" type='text' />
            </label>

            <label>
                Password:
                <input name="password" type='password' />
            </label>

            <button type='submit'>
                {buttonText}
            </button>
            

        </form>
    )

}

function App(props) {
  const [showDialog, setShowDialog] = React.useState('none')
  const open = DialogId => setShowDialog(DialogId)
  const close = () => setShowDialog('none')

  const handleLogin = () => {
    // alert("handleLogin")
    open('login')
  }

  const handleRegister = () => {
    // alert("handleRegister")
    open('register')
  }

  const handleSubmit = () => {

  }

  return (
    <div>
      <title>Bookshelf</title>
      <Logo />
      <button type="button" onClick={handleLogin}>
        login
      </button>
      <button type="button" onClick={handleRegister}>
        register
      </button>

      <Dialog isOpen={showDialog === 'login'} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <span aria-hidden>×</span>
        </button>
        <LoginForm onSubmit={handleSubmit} buttonText="Login" />
      </Dialog>

      <Dialog isOpen={showDialog === 'register'} onDismiss={close}>
        <button className="close-button" onClick={close}>
          <span aria-hidden>×</span>
        </button>
        <p>Hello there. I am register</p>
      </Dialog>
    </div>
  )
}

const domNode = document.getElementById('root')
const root = createRoot(domNode)
root.render(<App />)

// 🐨 use createRoot to render the <App /> to the root element
// 💰 find the root element with: document.getElementById('root')
