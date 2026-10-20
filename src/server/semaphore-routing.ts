import type { Request, Response } from 'express'

export type SignalRoute<TSemaphore> = {
  routeSignal: string
  setSignal: (semaphore: TSemaphore) => void
}

export type SemaphoreIdentity = {
  type: string
  number: number
}

type SignalRequest = Pick<
  Request<{ semaphore: string; signal: string }>,
  'params'
>
type SignalResponse = Pick<Response, 'send' | 'status'>

export const createSignalRequestHandler = <TSemaphore>({
  routingSignals,
  semaphores,
  semaphoreConfigurations
}: {
  routingSignals: readonly SignalRoute<TSemaphore>[]
  semaphores: readonly TSemaphore[]
  semaphoreConfigurations: readonly SemaphoreIdentity[]
}) => {
  const routingSemaphores = semaphoreConfigurations.map((semaphore, index) => ({
    routeSemaphore: `${semaphore.type}${semaphore.number}`,
    semaphore: semaphores[index]
  }))

  return (req: SignalRequest, res: SignalResponse) => {
    const signalToShow = routingSignals.find(
      signal => signal.routeSignal === req.params.signal.toUpperCase()
    )
    const semaphoreToUse = routingSemaphores.find(
      semaphore => semaphore.routeSemaphore === req.params.semaphore
    )

    if (!signalToShow || !semaphoreToUse) {
      // The request values are intentionally not echoed back (text/html reflection).
      res.status(404).send('Unknown semaphore or signal')
      return
    }

    signalToShow.setSignal(semaphoreToUse.semaphore)
    res.send(`Semaphore ${req.params.semaphore} ${req.params.signal} ON!`)
  }
}
