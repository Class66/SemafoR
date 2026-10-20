import { createRequire } from 'node:module'
import type { NextFunction, Request, Response } from 'express'
import { semaphoreSteeringPort } from '../common/semaphores-config.ts'
import {
  createSignalRequestHandler,
  type SemaphoreIdentity,
  type SignalRoute
} from './semaphore-routing.ts'

const require = createRequire(import.meta.url)
const express = require('express') as typeof import('express')
const cors = require('cors') as typeof import('cors')
const serveStatic = require('serve-static') as typeof import('serve-static')

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
  const handleSignalRequest = createSignalRequestHandler({
    routingSignals,
    semaphores,
    semaphoreConfigurations
  })

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

  app.get('/:semaphore/:signal', cors(), handleSignalRequest)

  app.listen(port, () =>
    // eslint-disable-next-line no-console
    console.log(`Example app listening on port ${port}!`)
  )
}
