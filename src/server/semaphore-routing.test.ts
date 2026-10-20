import { describe, expect, it, vi } from 'vitest'
import { createSignalRequestHandler } from './semaphore-routing.ts'

type Semaphore = { name: string }

const createSetup = () => {
  const smOne: Semaphore = { name: 'sm-one' }
  const smTwo: Semaphore = { name: 'sm-two' }
  const tmOne: Semaphore = { name: 'tm-one' }
  const setS1 = vi.fn()
  const setS2 = vi.fn()
  const handler = createSignalRequestHandler<Semaphore>({
    routingSignals: [
      { routeSignal: 'S1', setSignal: setS1 },
      { routeSignal: 'S2', setSignal: setS2 }
    ],
    semaphores: [smOne, smTwo, tmOne],
    semaphoreConfigurations: [
      { type: 'Sm', number: 1 },
      { type: 'Sm', number: 2 },
      { type: 'Tm', number: 1 }
    ]
  })

  return { handler, setS1, setS2, smOne, smTwo, tmOne }
}

const createResponse = () => {
  const send = vi.fn()
  const status = vi.fn()
  const res = { send, status }

  status.mockReturnValue(res)

  return res
}

describe('createSignalRequestHandler', () => {
  it('sets the signal on the semaphore that matches the route name', () => {
    const { handler, setS1, setS2, smTwo } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Sm2', signal: 'S1' } }, res)

    expect(setS1).toHaveBeenCalledTimes(1)
    expect(setS1).toHaveBeenCalledWith(smTwo)
    expect(setS2).not.toHaveBeenCalled()
  })

  it('maps a route name to the semaphore at the same configuration index', () => {
    const { handler, setS2, tmOne } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Tm1', signal: 'S2' } }, res)

    expect(setS2).toHaveBeenCalledTimes(1)
    expect(setS2).toHaveBeenCalledWith(tmOne)
  })

  it('confirms the change in the response without an error status', () => {
    const { handler } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Sm1', signal: 'S2' } }, res)

    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith('Semaphore Sm1 S2 ON!')
    expect(res.status).not.toHaveBeenCalled()
  })

  it('accepts the signal name in any letter case', () => {
    const { handler, setS1, setS2, smOne } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Sm1', signal: 's2' } }, res)

    expect(setS2).toHaveBeenCalledTimes(1)
    expect(setS2).toHaveBeenCalledWith(smOne)
    expect(setS1).not.toHaveBeenCalled()
    expect(res.send).toHaveBeenCalledWith('Semaphore Sm1 s2 ON!')
  })

  it('treats the semaphore name as case sensitive', () => {
    const { handler, setS1, setS2 } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'sm1', signal: 'S1' } }, res)

    expect(setS1).not.toHaveBeenCalled()
    expect(setS2).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
  })

  it('answers 404 and sets nothing for an unknown signal', () => {
    const { handler, setS1, setS2 } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Sm1', signal: 'S99' } }, res)

    expect(setS1).not.toHaveBeenCalled()
    expect(setS2).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledTimes(1)
    expect(res.send).toHaveBeenCalledWith('Unknown semaphore or signal')
  })

  it('answers 404 and sets nothing for an unknown semaphore', () => {
    const { handler, setS1, setS2 } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: 'Sm9', signal: 'S1' } }, res)

    expect(setS1).not.toHaveBeenCalled()
    expect(setS2).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.send).toHaveBeenCalledWith('Unknown semaphore or signal')
  })

  it('does not echo request values in the 404 body', () => {
    const { handler } = createSetup()
    const res = createResponse()

    handler({ params: { semaphore: '<script>x</script>', signal: 'S1' } }, res)

    expect(res.send).toHaveBeenCalledTimes(1)
    expect(String(res.send.mock.calls[0][0])).not.toContain('<script>')
  })

  it('does not let a semaphore without a configuration entry be addressed', () => {
    const smOne: Semaphore = { name: 'sm-one' }
    const setS1 = vi.fn()
    const handler = createSignalRequestHandler<Semaphore>({
      routingSignals: [{ routeSignal: 'S1', setSignal: setS1 }],
      semaphores: [smOne, { name: 'unconfigured' }],
      semaphoreConfigurations: [{ type: 'Sm', number: 1 }]
    })
    const res = createResponse()

    handler({ params: { semaphore: 'Sm2', signal: 'S1' } }, res)

    expect(setS1).not.toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(404)
  })
})
