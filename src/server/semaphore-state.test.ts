import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock
} from 'vitest'
import {
  createSemaphoreState,
  getLedPinNumber,
  type LedLike
} from './semaphore-state.ts'

type TestLed = LedLike & { off: Mock<() => void> }
type TestSemaphore = Record<string, TestLed>

const createLed = (pin: number): TestLed => ({
  pins: [pin],
  off: vi.fn<() => void>()
})

const createSemaphore = (...pins: number[]): TestSemaphore =>
  Object.fromEntries(pins.map(pin => [`LED${pin}`, createLed(pin)]))

const createState = () => createSemaphoreState<TestLed, TestSemaphore, string>()

const startLoop = (
  state: ReturnType<typeof createState>,
  semaphore: TestSemaphore,
  ledPin: number
) => {
  const tick = vi.fn()

  state.addLoopInstance({
    semaphore,
    ledPin,
    instance: setInterval(tick, 10) as unknown as ReturnType<typeof setInterval>
  })

  return tick
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.spyOn(console, 'table').mockImplementation(() => {})
  vi.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  vi.clearAllTimers()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('getLedPinNumber', () => {
  it('returns the first pin of the LED', () => {
    expect(getLedPinNumber(createLed(7))).toBe(7)
  })
})

describe('LED status', () => {
  it('is false for an LED that has no status yet', () => {
    const state = createState()
    const semaphore = createSemaphore(0)

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe(false)
  })

  it('returns the status stored for the LED', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)

    state.putLedStatus(semaphore, semaphore.LED0, 'on')

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe('on')
    expect(state.getLedStatus(semaphore, semaphore.LED1)).toBe(false)
  })

  it('replaces the status of the same LED instead of adding a second one', () => {
    const state = createState()
    const semaphore = createSemaphore(0)

    state.putLedStatus(semaphore, semaphore.LED0, 'on')
    state.putLedStatus(semaphore, semaphore.LED0, 'pulse')

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe('pulse')

    state.removeLedsStatus(semaphore, [])

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe(false)
  })

  it('keeps statuses of different semaphores apart even for the same pin', () => {
    const state = createState()
    const first = createSemaphore(3)
    const second = createSemaphore(3)

    state.putLedStatus(first, first.LED3, 'on')

    expect(state.getLedStatus(second, second.LED3)).toBe(false)

    state.putLedStatus(second, second.LED3, 'pulse')

    expect(state.getLedStatus(first, first.LED3)).toBe('on')
    expect(state.getLedStatus(second, second.LED3)).toBe('pulse')
  })

  it('updateLedStatus changes an existing status', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)

    state.putLedStatus(semaphore, semaphore.LED0, 'on')
    state.putLedStatus(semaphore, semaphore.LED1, 'on')
    state.updateLedStatus(semaphore, semaphore.LED1, 'pulse')

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe('on')
    expect(state.getLedStatus(semaphore, semaphore.LED1)).toBe('pulse')
  })
})

describe('removeLedsStatus', () => {
  it('keeps only the statuses of the LEDs that stay on', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1, 2)

    state.putLedStatus(semaphore, semaphore.LED0, 'on')
    state.putLedStatus(semaphore, semaphore.LED1, 'pulse')
    state.putLedStatus(semaphore, semaphore.LED2, 'on')

    state.removeLedsStatus(semaphore, [1])

    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe(false)
    expect(state.getLedStatus(semaphore, semaphore.LED1)).toBe('pulse')
    expect(state.getLedStatus(semaphore, semaphore.LED2)).toBe(false)
  })

  it('does not touch statuses of other semaphores', () => {
    const state = createState()
    const first = createSemaphore(0)
    const second = createSemaphore(0)

    state.putLedStatus(first, first.LED0, 'on')
    state.putLedStatus(second, second.LED0, 'pulse')

    state.removeLedsStatus(first, [])

    expect(state.getLedStatus(first, first.LED0)).toBe(false)
    expect(state.getLedStatus(second, second.LED0)).toBe('pulse')
  })

  it('does nothing when there are no statuses', () => {
    const state = createState()
    const semaphore = createSemaphore(0)

    expect(() => state.removeLedsStatus(semaphore, [0])).not.toThrow()
    expect(state.getLedStatus(semaphore, semaphore.LED0)).toBe(false)
  })
})

describe('turnOffLeds', () => {
  it('turns off every LED except those that should stay on', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1, 2)

    state.turnOffLeds(semaphore, [1])

    expect(semaphore.LED0.off).toHaveBeenCalledTimes(1)
    expect(semaphore.LED1.off).not.toHaveBeenCalled()
    expect(semaphore.LED2.off).toHaveBeenCalledTimes(1)
  })

  it('turns off all LEDs when none should stay on', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)

    state.turnOffLeds(semaphore, [])

    expect(semaphore.LED0.off).toHaveBeenCalledTimes(1)
    expect(semaphore.LED1.off).toHaveBeenCalledTimes(1)
  })

  it('ignores semaphore properties that are not LEDs', () => {
    const state = createState()
    const semaphore = {
      ...createSemaphore(0),
      label: 'Sm1'
    } as unknown as TestSemaphore

    expect(() => state.turnOffLeds(semaphore, [])).not.toThrow()
    expect(semaphore.LED0.off).toHaveBeenCalledTimes(1)
  })
})

describe('current signal', () => {
  it('is not set before it was registered', () => {
    const state = createState()
    const semaphore = createSemaphore(0)

    expect(state.isSignalSet(semaphore, 'S1')).toBeFalsy()
  })

  it('is set only for the registered semaphore and signal', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const other = createSemaphore(0)

    state.setCurrentSignal(semaphore, 'S1')

    expect(state.isSignalSet(semaphore, 'S1')).toBeTruthy()
    expect(state.isSignalSet(semaphore, 'S2')).toBeFalsy()
    expect(state.isSignalSet(other, 'S1')).toBeFalsy()
  })

  it('removeSignal clears the signal of that semaphore only', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const other = createSemaphore(0)

    state.setCurrentSignal(other, 'S1')
    state.setCurrentSignal(semaphore, 'S1')

    state.removeSignal(semaphore)

    expect(state.isSignalSet(semaphore, 'S1')).toBeFalsy()
    expect(state.isSignalSet(other, 'S1')).toBeTruthy()
  })

  it('removeSignal does nothing for a semaphore without a signal', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const other = createSemaphore(0)

    state.setCurrentSignal(other, 'S1')

    expect(() => state.removeSignal(semaphore)).not.toThrow()
    expect(state.isSignalSet(other, 'S1')).toBeTruthy()
  })
})

describe('stopAllLoops', () => {
  it('stops loops of LEDs that should go off and keeps the rest running', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)
    const other = createSemaphore(0)
    const stoppedTick = startLoop(state, semaphore, 0)
    const keptTick = startLoop(state, semaphore, 1)
    const otherTick = startLoop(state, other, 0)

    expect(vi.getTimerCount()).toBe(3)

    state.stopAllLoops(semaphore, [1])
    vi.advanceTimersByTime(10)

    expect(vi.getTimerCount()).toBe(2)
    expect(stoppedTick).not.toHaveBeenCalled()
    expect(keptTick).toHaveBeenCalledTimes(1)
    expect(otherTick).toHaveBeenCalledTimes(1)
    expect(
      state.getLoopInstances().map(({ semaphore: s, ledPin }) => [s, ledPin])
    ).toEqual([
      [other, 0],
      [semaphore, 1]
    ])
  })

  it('stops every loop of the semaphore when no LED should stay on', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)
    const other = createSemaphore(0)
    const firstTick = startLoop(state, semaphore, 0)
    const secondTick = startLoop(state, semaphore, 1)
    const otherTick = startLoop(state, other, 0)

    state.stopAllLoops(semaphore, [])
    vi.advanceTimersByTime(10)

    expect(firstTick).not.toHaveBeenCalled()
    expect(secondTick).not.toHaveBeenCalled()
    expect(otherTick).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(1)
    expect(state.getLoopInstances()).toHaveLength(1)
  })

  it('does nothing when no loop is running', () => {
    const state = createState()

    expect(() => state.stopAllLoops(createSemaphore(0), [])).not.toThrow()
    expect(state.getLoopInstances()).toHaveLength(0)
  })
})

describe('generateSignal', () => {
  it('registers the signal and runs all effects in order', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const calls: string[] = []

    state.generateSignal(
      semaphore,
      'S1',
      [],
      [() => calls.push('first'), () => calls.push('second')]
    )

    expect(calls).toEqual(['first', 'second'])
    expect(state.isSignalSet(semaphore, 'S1')).toBeTruthy()
  })

  it('does not run the effects again for the signal that is already set', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const effect = vi.fn()

    state.generateSignal(semaphore, 'S1', [], [effect])
    state.generateSignal(semaphore, 'S1', [], [effect])

    expect(effect).toHaveBeenCalledTimes(1)
  })

  it('replaces the signal of the semaphore and runs the new effects', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const firstEffect = vi.fn()
    const secondEffect = vi.fn()

    state.generateSignal(semaphore, 'S1', [], [firstEffect])
    state.generateSignal(semaphore, 'S2', [], [secondEffect])

    expect(firstEffect).toHaveBeenCalledTimes(1)
    expect(secondEffect).toHaveBeenCalledTimes(1)
    expect(state.isSignalSet(semaphore, 'S1')).toBeFalsy()
    expect(state.isSignalSet(semaphore, 'S2')).toBeTruthy()
  })

  it('runs the effects again after returning to a previous signal', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const effect = vi.fn()

    state.generateSignal(semaphore, 'S1', [], [effect])
    state.generateSignal(semaphore, 'S2', [], [])
    state.generateSignal(semaphore, 'S1', [], [effect])

    expect(effect).toHaveBeenCalledTimes(2)
  })

  it('treats the same signal on another semaphore as a new signal', () => {
    const state = createState()
    const first = createSemaphore(0)
    const second = createSemaphore(0)
    const effect = vi.fn()

    state.generateSignal(first, 'S1', [], [])
    state.generateSignal(second, 'S1', [], [effect])

    expect(effect).toHaveBeenCalledTimes(1)
    expect(state.isSignalSet(first, 'S1')).toBeTruthy()
    expect(state.isSignalSet(second, 'S1')).toBeTruthy()
  })

  it('stops loops of LEDs that are off in the new signal', () => {
    const state = createState()
    const semaphore = createSemaphore(0, 1)
    const stoppedTick = startLoop(state, semaphore, 0)
    const keptTick = startLoop(state, semaphore, 1)

    state.generateSignal(semaphore, 'S2', [1], [])
    vi.advanceTimersByTime(10)

    expect(stoppedTick).not.toHaveBeenCalled()
    expect(keptTick).toHaveBeenCalledTimes(1)
  })

  it('stops the old loops before the new effects start their own', () => {
    const state = createState()
    const semaphore = createSemaphore(0)
    const oldTick = startLoop(state, semaphore, 0)
    let newTick = vi.fn()

    state.generateSignal(
      semaphore,
      'S2',
      [],
      [
        () => {
          newTick = startLoop(state, semaphore, 0)
        }
      ]
    )
    vi.advanceTimersByTime(10)

    expect(oldTick).not.toHaveBeenCalled()
    expect(newTick).toHaveBeenCalledTimes(1)
    expect(vi.getTimerCount()).toBe(1)
  })
})
