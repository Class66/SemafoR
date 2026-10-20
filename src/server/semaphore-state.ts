export type LedLike = {
  pins: [number]
  off: () => unknown
}

export const signalStatus = {
  ON: 'on',
  PULSE: 'pulse'
} as const

export type SignalStatus = (typeof signalStatus)[keyof typeof signalStatus]

export type LoopInstance<TSemaphoreLeds> = {
  semaphore: TSemaphoreLeds
  ledPin: number
  instance: ReturnType<typeof setInterval>
}

type LedStatus<TSemaphoreLeds> = {
  semaphore: TSemaphoreLeds
  ledPin: number
  status: SignalStatus
}

type CurrentSignal<TSemaphoreLeds, TSignal> = {
  semaphore: TSemaphoreLeds
  signal: TSignal
}

export const getLedPinNumber = (led: LedLike): number => led.pins[0]

export const createSemaphoreState = <
  TLedPin extends LedLike,
  TSemaphoreLeds extends Record<string, TLedPin>,
  TSignal extends string
>() => {
  let loopInstances: LoopInstance<TSemaphoreLeds>[] = []
  let ledsStatus: LedStatus<TSemaphoreLeds>[] = []
  const currentSignals: CurrentSignal<TSemaphoreLeds, TSignal>[] = []

  const addLoopInstance = (loopInstance: LoopInstance<TSemaphoreLeds>) => {
    loopInstances.push(loopInstance)
  }

  const getLoopInstances = (): readonly LoopInstance<TSemaphoreLeds>[] =>
    loopInstances

  const stopAllLoops = (semaphore: TSemaphoreLeds, ledsPinToBeOn: number[]) => {
    if (loopInstances.length) {
      const loopInstancesForOtherSemaphores = loopInstances.filter(
        loop => loop.semaphore !== semaphore
      )
      const loopInstancesForThisSemaphore = loopInstances.filter(
        loop => loop.semaphore === semaphore
      )
      const loopInstancesForLedsToBeOff = loopInstancesForThisSemaphore.filter(
        loop => !ledsPinToBeOn.includes(loop.ledPin)
      )

      loopInstancesForLedsToBeOff.forEach(loop => clearInterval(loop.instance))

      const loopInstancesForLedsToBeOn = loopInstancesForThisSemaphore.filter(
        loop => ledsPinToBeOn.includes(loop.ledPin)
      )

      loopInstances = []
      loopInstances = loopInstances
        .concat(loopInstancesForOtherSemaphores)
        .concat(loopInstancesForLedsToBeOn)
    }
  }

  const setCurrentSignal = (semaphore: TSemaphoreLeds, signal: TSignal) => {
    const currentSignal = {
      semaphore: semaphore,
      signal: signal
    }

    currentSignals.push(currentSignal)
  }

  const isSignalSet = (semaphore: TSemaphoreLeds, signal: TSignal) => {
    if (currentSignals.length) {
      return currentSignals.find(
        cs => cs.semaphore === semaphore && cs.signal === signal
      )
    }

    return false
  }

  const removeSignal = (semaphore: TSemaphoreLeds) => {
    if (currentSignals.length) {
      const index = currentSignals.findIndex(cs => cs.semaphore === semaphore)

      if (index !== -1) {
        console.table(currentSignals)
        currentSignals.splice(index, 1)
        console.table(currentSignals)
      }
    }
  }

  const updateLedStatus = (
    semaphore: TSemaphoreLeds,
    led: TLedPin,
    status: SignalStatus
  ) => {
    const idx = ledsStatus.findIndex(
      ledStatus =>
        ledStatus.semaphore === semaphore &&
        ledStatus.ledPin === getLedPinNumber(led)
    )
    ledsStatus[idx].status = status
  }

  const putLedStatus = (
    semaphore: TSemaphoreLeds,
    led: TLedPin,
    status: SignalStatus
  ) => {
    const ledPin = getLedPinNumber(led)
    const ledStatus = {
      semaphore: semaphore,
      ledPin: ledPin,
      status: status
    }
    const isLedActive = ledsStatus.some(
      l => l.ledPin === ledPin && l.semaphore === semaphore
    )

    if (isLedActive) {
      updateLedStatus(semaphore, led, status)
      // eslint-disable-next-line no-console
      console.table(ledsStatus)
    } else {
      ledsStatus.push(ledStatus)
      // eslint-disable-next-line no-console
      console.table(ledsStatus)
    }
  }

  const removeLedsStatus = (
    semaphore: TSemaphoreLeds,
    ledsPinToBeOn: number[]
  ) => {
    if (ledsStatus.length) {
      const ledsStatusForOthersSemaphores = ledsStatus.filter(
        ledStatus => ledStatus.semaphore !== semaphore
      )
      const ledsStatusForThisSemaphore = ledsStatus.filter(
        ledStatus => ledStatus.semaphore === semaphore
      )
      const ledsStatusForledsToBeOff = ledsStatusForThisSemaphore.filter(
        ledStatus => ledsPinToBeOn.includes(ledStatus.ledPin)
      )
      ledsStatus = []
      ledsStatus = ledsStatus
        .concat(ledsStatusForOthersSemaphores)
        .concat(ledsStatusForledsToBeOff)
    }
  }

  const getLedStatus = (
    semaphore: TSemaphoreLeds,
    led: TLedPin
  ): SignalStatus | false => {
    if (ledsStatus.length) {
      const ledPin = getLedPinNumber(led)
      const ledStatus = ledsStatus.find(
        ledStatus =>
          ledStatus.ledPin === ledPin && ledStatus.semaphore === semaphore
      )

      if (ledStatus && Object.hasOwn(ledStatus, 'status')) {
        return ledStatus.status
      }
    }

    return false
  }

  const turnOffLeds = (semaphore: TSemaphoreLeds, ledsPinToBeOn: number[]) => {
    const ledsToBeOff = Object.values(semaphore)
      .filter(val => val.pins) // the semaphore object could includes other props too
      .filter(val => !ledsPinToBeOn.includes(val.pins[0]))
    ledsToBeOff.forEach(led => led.off())
  }

  const generateSignal = (
    semaphore: TSemaphoreLeds,
    signalStatus: TSignal,
    ledsPinToBeOn: number[],
    effects: (() => void)[]
  ) => {
    if (!isSignalSet(semaphore, signalStatus)) {
      removeSignal(semaphore)
      setCurrentSignal(semaphore, signalStatus)
      stopAllLoops(semaphore, ledsPinToBeOn)

      effects.forEach(effect => {
        if (typeof effect === 'function') {
          effect()
        }
      })
    }
  }

  return {
    addLoopInstance,
    getLoopInstances,
    stopAllLoops,
    setCurrentSignal,
    isSignalSet,
    removeSignal,
    putLedStatus,
    updateLedStatus,
    removeLedsStatus,
    getLedStatus,
    turnOffLeds,
    generateSignal
  }
}
