import { createRequire } from 'node:module'
import type { NextFunction, Request, Response } from 'express'
import { semaphoreSteeringPort } from '../common/semaphore-config.ts'

const require = createRequire(import.meta.url)
const express = require('express') as typeof import('express')
const cors = require('cors') as typeof import('cors')
const serveStatic = require('serve-static') as typeof import('serve-static')

type SignalRoute<TSemaphore> = {
  routeSignal: string
  setSignal: (semaphore: TSemaphore) => void
}

type SemaphoreIdentity = {
  type: string
  number: number
}

type SemaphoreServerOptions<TSemaphore> = {
  routingSignals: readonly SignalRoute<TSemaphore>[]
  semaphores: readonly TSemaphore[]
  semaphoreConfigurations: readonly SemaphoreIdentity[]
}

export const startSemaphoreServer = <TSemaphore>({
  routingSignals,
  semaphores,
  semaphoreConfigurations
}: SemaphoreServerOptions<TSemaphore>) => {
  const app = express()
  const port = semaphoreSteeringPort
  const routingSemaphores = semaphoreConfigurations.map((semaphore, index) => ({
    routeSemaphore: `${semaphore.type}${semaphore.number}`,
    semaphore: semaphores[index]
  }))

  const writeTimeOnConsole = (
    _req: Request,
    _res: Response,
    next: NextFunction
  ) => {
    const today = new Date()
    const date =
      today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    const time =
      today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
    // eslint-disable-next-line no-console
    console.log('Time of calling request:', date, time)
    next()
  }

  const serveStaticFiles = (): import('express').RequestHandler =>
    serveStatic('.', {
      index: ['semaphore.html']
    })

  app.use(serveStaticFiles())
  app.use(writeTimeOnConsole)

  /////////////////////////////////////////////////////
  /// NODE EXPRESS ROUTING
  /// Express Routing: https://expressjs.com/en/guide/routing.html
  /// cors - Enable CORS for a Single Route (https://expressjs.com/en/resources/middleware/cors.html)
  /////////////////////////////////////////////////////

  app.get('/:semaphore/:signal', cors(), (req, res) => {
    const signalToShow = routingSignals.filter(
      signal => signal.routeSignal === req.params.signal.toUpperCase()
    )
    const semaphoreToUse = routingSemaphores.filter(
      semaphore => semaphore.routeSemaphore === req.params.semaphore
    )

    signalToShow[0].setSignal(semaphoreToUse[0].semaphore)
    res.send(`Semaphore ${req.params.semaphore} ${req.params.signal} ON!`)
  })

  app.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${port}!`)
  )
}
