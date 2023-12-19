// this is for extra credit
import React from 'react'
import {client} from 'utils/api-client'

let queue = []

setInterval(sendProfileQueue, 5000)

function sendProfileQueue() {
  if (!queue.length) return Promise.resolve({success: true})
  const queueToSend = [...queue]
  queue = []
  return client('profile', {data: queueToSend})
}

function Profiler({phases, metadata = {}, ...props}) {
  const handleOnRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions,
  ) => {
    console.log('handleOnRender', phases, phase)
    if (!phases || phases.includes(phase)) {
      queue.push({
        metadata,
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      })
    }
  }
  return <React.Profiler onRender={handleOnRender} {...props} />
}

export {Profiler}
