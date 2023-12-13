import styled from '@emotion/styled/macro'
import {Dialog as ReachDialog} from '@reach/dialog'
import * as mq from 'styles/media-queries'
import * as c from 'styles/colors'

const buttonVariants = {
  primary: {
    background: c.indigo,
    color: c.base,
  },
  secondary: {
    background: c.gray,
    color: c.text,
  },
}
const Button = styled.button(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
  },
  ({variant = 'primary'}) => buttonVariants[variant],
)

const Input = styled.input({
  borderRadius: '3px',
  border: `1px solid ${c.gray10}`,
  background: c.gray,
  padding: '8px 12px',
})

const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'white',
  color: c.text,
  border: `1px solid ${c.gray10}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  }
  // '@media (max-width: 991px)': {
    // width: '100%',
    // margin: '10vh auto',
  // },
})

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

export {Button, Input, CircleButton, Dialog, FormGroup}
