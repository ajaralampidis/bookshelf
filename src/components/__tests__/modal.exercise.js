// 🐨 you're gonna need this stuff:
import {Modal, ModalContents, ModalOpenButton} from '../modal'
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

test('can be opened and closed', async () => {
  // 🐨 render the Modal, ModalOpenButton, and ModalContents
  const user = userEvent.setup()

  const label = 'Modal Label'
  const title = 'Modal Title'
  const content = 'Modal content'

  render(
    <Modal>
      <ModalContents title={title} aria-label={label}>
        <div>{content}</div>
      </ModalContents>
      <ModalOpenButton>
        <button>Open</button>
      </ModalOpenButton>
    </Modal>,
  )

  // 🐨 click the open button
  await user.click(screen.getByRole('button', {name: /open/i}))

  // 🐨 verify the modal contains the modal contents, title, and label
  //   const modal = screen.getByLabelText(label)
  const modal = screen.getByRole('dialog')


  // My test are way faster to create, but they are less scalable and/or reliable.
  // In the future I am not "enforcing" that the modal has a label, a title or renders the content
  expect(modal).toMatchInlineSnapshot(`
    <div
      aria-label="Modal Label"
      aria-modal="true"
      class="css-1hs571h-Dialog e1baol0z6"
      data-reach-dialog-content=""
      role="dialog"
      tabindex="-1"
    >
      <div
        class="css-vl3c6l-ModalContents"
      >
        <button
          class="css-1hp1dc5-CircleButton e1baol0z0"
        >
          <span
            style="border: 0px; height: 1px; margin: -1px; overflow: hidden; padding: 0px; position: absolute; width: 1px; white-space: nowrap; word-wrap: normal;"
          >
            Close
          </span>
          <span
            aria-hidden="true"
          >
            ×
          </span>
        </button>
      </div>
      <h3
        class="css-171r0ze-ModalContents"
      >
        Modal Title
      </h3>
      <div>
        Modal content
      </div>
    </div>
  `)

  // kents tests aiming for more specific things
  expect(modal).toHaveAttribute('aria-label', label)
  const inModal = within(modal)
  expect(inModal.getByRole('heading', {name: title})).toBeInTheDocument()
  expect(inModal.getByText(content)).toBeInTheDocument()

  // 🐨 click the close button
  await user.click(inModal.getByRole('button', {name: /close/i}))
  // 🐨 verify the modal is no longer rendered
  // 💰 (use `query*` rather than `get*` or `find*` queries to verify it is not rendered)
  expect(modal).not.toBeInTheDocument()
  //   expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  // 💰 Remember all userEvent utils are async, so you need to await them.
})
