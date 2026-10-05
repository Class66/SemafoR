import { signals } from '../enums/signals'
import { semaphoreTypes } from '../enums/semaphore-types'

export type SignalName = (typeof signals)[keyof typeof signals]
export type SemaphoreType = (typeof semaphoreTypes)[keyof typeof semaphoreTypes]

export type SemaphoreData = {
  type: SemaphoreType
  number: number
  signal: SignalName
  label?: string
}
