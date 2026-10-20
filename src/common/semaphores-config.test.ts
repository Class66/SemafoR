import { describe, expect, it } from 'vitest'
import {
  boardPCA9685Addresses,
  semaphoreSteeringPort,
  semaphoreSteeringUri,
  semaphoresGeneralConfiguration,
  semaphoresLedConfiguration
} from './semaphores-config.ts'

type LedPosition = { pin: number; address: number }

const ledConfiguration = semaphoresLedConfiguration<LedPosition>(
  (pin, address) => ({ pin, address })
)

describe('steering endpoint', () => {
  it('uses port 4000 on localhost', () => {
    expect(semaphoreSteeringPort).toBe(4000)
    expect(semaphoreSteeringUri).toBe('http://localhost:4000')
  })
})

describe('boardPCA9685Addresses', () => {
  it('lists the two PCA9685 boards', () => {
    expect(boardPCA9685Addresses).toEqual([0x40, 0x41])
  })
})

describe('semaphoresLedConfiguration', () => {
  it('passes the pin and the board address to the pin factory', () => {
    const calls: [number, number][] = []

    semaphoresLedConfiguration((pin, address) => {
      calls.push([pin, address])
      return null
    })

    expect(calls).toHaveLength(24)
    expect(calls[0]).toEqual([0, 0x40])
    expect(calls[calls.length - 1]).toEqual([10, 0x41])
  })

  it('returns the value created by the pin factory for every LED', () => {
    const result = semaphoresLedConfiguration(
      (pin, address) => `${address}:${pin}`
    )

    expect(result[0].RED).toBe('64:2')
    expect(result[6].GREEN).toBe('65:9')
  })

  it('has one LED set per semaphore', () => {
    expect(ledConfiguration).toHaveLength(7)
  })

  it.each([
    ['Sm1', 0, 'RED', { pin: 2, address: 0x40 }],
    ['Sm2', 1, 'GREEN', { pin: 5, address: 0x40 }],
    ['Sm3', 2, 'WHITE', { pin: 14, address: 0x40 }],
    ['Tm1', 3, 'BLUE', { pin: 1, address: 0x41 }],
    ['Tm3', 5, 'WHITE', { pin: 4, address: 0x41 }],
    ['Sp1', 6, 'ORANGE', { pin: 8, address: 0x41 }]
  ])('wires %s LED %s to the expected pin', (_name, index, led, expected) => {
    expect(ledConfiguration[index][led]).toEqual(expected)
  })

  it('never assigns the same pin of the same board twice', () => {
    const positions = ledConfiguration.flatMap(leds =>
      Object.values(leds).map(({ pin, address }) => `${address}:${pin}`)
    )

    expect(positions).toHaveLength(24)
    expect(new Set(positions).size).toBe(positions.length)
  })

  it('uses only valid PCA9685 channels (0-15) and known board addresses', () => {
    const allLeds = ledConfiguration.flatMap(leds => Object.values(leds))

    expect(allLeds).toHaveLength(24)
    allLeds.forEach(({ pin, address }) => {
      expect(Number.isInteger(pin)).toBe(true)
      expect(pin).toBeGreaterThanOrEqual(0)
      expect(pin).toBeLessThanOrEqual(15)
      expect(boardPCA9685Addresses).toContain(address)
    })
  })
})

describe('semaphoresGeneralConfiguration', () => {
  it('describes exactly as many semaphores as there are LED sets', () => {
    expect(semaphoresGeneralConfiguration).toHaveLength(7)
    expect(semaphoresGeneralConfiguration).toHaveLength(ledConfiguration.length)
  })

  it('has unique type + number pairs (they become the route names)', () => {
    const routeNames = semaphoresGeneralConfiguration.map(
      ({ type, number }) => `${type}${number}`
    )

    expect(routeNames).toEqual([
      'Sm1',
      'Sm2',
      'Sm3',
      'Tm1',
      'Tm2',
      'Tm3',
      'Sp1'
    ])
    expect(new Set(routeNames).size).toBe(routeNames.length)
  })

  // Order must be the same as in semaphoresLedConfiguration
  it.each([
    [0, 'Sm', 'S1', ['GREEN', 'ORANGE_ONE', 'ORANGE_TWO', 'RED', 'WHITE']],
    [1, 'Sm', 'S1', ['GREEN', 'ORANGE_ONE', 'ORANGE_TWO', 'RED', 'WHITE']],
    [2, 'Sm', 'S1', ['GREEN', 'ORANGE_ONE', 'ORANGE_TWO', 'RED', 'WHITE']],
    [3, 'Tm', 'MS1', ['BLUE', 'WHITE']],
    [4, 'Tm', 'MS1', ['BLUE', 'WHITE']],
    [5, 'Tm', 'MS1', ['BLUE', 'WHITE']],
    [6, 'Sp', 'SP1', ['GREEN', 'ORANGE', 'WHITE']]
  ])(
    'semaphore #%i is a %s with default signal %s and matching LEDs',
    (index, type, signal, ledNames) => {
      const semaphore = semaphoresGeneralConfiguration[index]

      expect(semaphore.type).toBe(type)
      expect(semaphore.signal).toBe(signal)
      expect(Object.keys(ledConfiguration[index]).sort()).toEqual(ledNames)
    }
  )

  it('labels each semaphore with its route name', () => {
    expect(semaphoresGeneralConfiguration).not.toHaveLength(0)
    semaphoresGeneralConfiguration.forEach(({ type, number, label }) => {
      expect(label).toBe(`${type}${number}`)
    })
  })
})
