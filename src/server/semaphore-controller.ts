import { createRequire } from 'node:module'
import { semaphoreTypes } from '../enums/semaphore-types.ts'
import { signals } from '../enums/signals.ts'
import {
  semaphoresLedConfiguration,
  semaphoresGeneralConfiguration
} from '../common/semaphores-config.ts'
import { startSemaphoreServer } from './semaphore-server.ts'
import {
  createSemaphoreState,
  getLedPinNumber,
  signalStatus
} from './semaphore-state.ts'

const require = createRequire(import.meta.url)
const { Board, Led } = require('johnny-five') as typeof import('johnny-five')

// Arduino initialization
const board = new Board({ port: process.env.ARDUINO_PORT })

type LedPin = InstanceType<typeof Led.RGB> & { pins: [number] }
type SemaphoreLeds = Record<string, LedPin>
type SignalName = (typeof signals)[keyof typeof signals]
type SemaphoreType = (typeof semaphoreTypes)[keyof typeof semaphoreTypes]
type PulseEffectConfig = {
  brightnessStep: number
  delayLoop: number
  delayMax: number
  delayDownMax: number
}
type FadeEffectConfig = {
  brightnessStep: number
  delayLoop: number
}
type RoutingSignal = {
  routeSignal: SignalName
  setSignal: (semaphore: SemaphoreLeds) => void
}
type SemaphoreConfiguration = {
  type: SemaphoreType
  number: number
  signal: SignalName
}

board.on('ready', function () {
  /////////////////////////////////////////////////////
  /// LEDS CONFIGURATION
  /////////////////////////////////////////////////////

  // Maximum LED brightness (closely related to the parameters in ledsEffectConfig)
  const ledsMaxBrightness = {
    GREEN: 4,
    ORANGE: 45,
    RED: 15,
    WHITE: 15,
    BLUE: 5
  }

  // Timing of leds effects (closely related to the parameters in ladsMaxBrightness)
  const ledsEffectConfig = {
    GREEN: {
      pulse: {
        brightnessStep: 0.5,
        delayLoop: 35,
        delayMax: 15,
        delayDownMax: 5
      },
      fadeIn: {
        brightnessStep: 0.5,
        delayLoop: 40
      }
    },
    ORANGE: {
      pulse: {
        brightnessStep: 1.5,
        delayLoop: 13,
        delayMax: 15,
        delayDownMax: 15
      },
      fadeIn: {
        brightnessStep: 1,
        delayLoop: 10
      }
    },
    RED: {
      fadeIn: {
        brightnessStep: 1,
        delayLoop: 10
      }
    },
    WHITE: {
      pulse: {
        brightnessStep: 1,
        delayLoop: 16,
        delayMax: 45,
        delayDownMax: 15
      },
      fadeIn: {
        brightnessStep: 1,
        delayLoop: 10
      }
    },
    BLUE: {
      fadeIn: {
        brightnessStep: 1,
        delayLoop: 10
      }
    }
  }

  /////////////////////////////////////////////////////
  /// BOARD DEFINITION
  /////////////////////////////////////////////////////

  const defineLedsPinPCA9685Board = (pin: number, address: number): LedPin => {
    const options: import('johnny-five').Led.RGBOption & { address: number } = {
      controller: 'PCA9685',
      address: address,
      pins: { red: pin, green: pin, blue: pin },
      isAnode: true
    }

    return new Led.RGB(options) as LedPin
  }

  const semaphores: SemaphoreLeds[] = semaphoresLedConfiguration(
    defineLedsPinPCA9685Board
  )
  const semaphoreConfigurations: SemaphoreConfiguration[] =
    semaphoresGeneralConfiguration

  /////////////////////////////////////////////////////
  /// OTHER DEFINITIONS
  /////////////////////////////////////////////////////

  // The controller uses only 6 out of 12 functions, while the other 6 are called
  // exclusively inside the factory. They were also returned so that they could
  // be tested separately.
  const {
    addLoopInstance,
    putLedStatus,
    removeLedsStatus,
    getLedStatus,
    turnOffLeds,
    generateSignal
  } = createSemaphoreState<LedPin, SemaphoreLeds, SignalName>()

  /////////////////////////////////////////////////////
  /// LED EFFECTS METHODS
  /////////////////////////////////////////////////////

  const fadeIn = (
    led: LedPin,
    maxBrightness: number,
    effectConfig: FadeEffectConfig
  ) => {
    let brightness = 0

    const intervalId = setInterval(() => {
      brightness = brightness + effectConfig.brightnessStep

      if (brightness === maxBrightness) {
        clearInterval(intervalId)
      }

      if (brightness <= maxBrightness) {
        led.intensity(brightness)
      }
    }, effectConfig.delayLoop)

    return intervalId
  }

  // eslint-disable-next-line no-unused-vars
  const fadeOut = (
    led: LedPin,
    maxBrightness: number,
    effectConfig: FadeEffectConfig
  ) => {
    let brightness = maxBrightness
    led.intensity(maxBrightness)

    const intervalId = setInterval(() => {
      brightness = brightness - effectConfig.brightnessStep

      if (brightness < 0) {
        clearInterval(intervalId)
      }

      if (brightness < maxBrightness) {
        led.intensity(brightness)
      }
    }, effectConfig.delayLoop)

    return intervalId
  }

  const UP = 'up'
  const DOWN = 'down'
  const STOP_UP = 'stopUp'
  const STOP_DOWN = 'stopDown'

  const pulse = (
    led: LedPin,
    maxBrightness: number,
    effectConfig: PulseEffectConfig
  ) => {
    let brightness = 0
    let delay = 0
    let delayDown = 0
    let direction = UP

    return setInterval(() => {
      if (direction === UP) {
        brightness += effectConfig.brightnessStep
      }
      if (direction === DOWN) {
        brightness -= effectConfig.brightnessStep
      }
      if (direction === STOP_UP) {
        delay++
      }
      if (brightness <= maxBrightness && direction === UP) {
        led.intensity(brightness)
      }
      if (brightness >= 0 && direction === DOWN) {
        led.intensity(brightness)
      }
      if (brightness > maxBrightness) {
        direction = STOP_UP
        delay++
      }
      if (delay > effectConfig.delayMax) {
        direction = DOWN
        delay = 0
      }
      if (brightness < 0 && direction === DOWN) {
        direction = STOP_DOWN
      }
      if (brightness < 0 && direction === STOP_DOWN) {
        delayDown++
      }
      if (delayDown > effectConfig.delayDownMax) {
        direction = UP
        delayDown = 0
      }
    }, effectConfig.delayLoop)
  }

  const pulseFromOn = (
    led: LedPin,
    maxBrightness: number,
    effectConfig: PulseEffectConfig
  ) => {
    let brightness = maxBrightness
    let delay = 0
    let delayDown = 0
    let direction = DOWN
    led.intensity(maxBrightness)

    return setInterval(() => {
      if (direction === UP) {
        brightness += effectConfig.brightnessStep
      }
      if (direction === DOWN) {
        brightness -= effectConfig.brightnessStep
      }
      if (direction === STOP_UP) {
        delay++
      }
      if (brightness <= maxBrightness && direction === UP) {
        led.intensity(brightness)
      }
      if (brightness >= 0 && direction === DOWN) {
        led.intensity(brightness)
      }
      if (brightness > maxBrightness) {
        direction = STOP_UP
        delay++
      }
      if (delay > effectConfig.delayMax) {
        direction = DOWN
        delay = 0
      }
      if (brightness < 0 && direction === DOWN) {
        direction = STOP_DOWN
      }
      if (brightness < 0 && direction === STOP_DOWN) {
        delayDown++
      }
      if (delayDown > effectConfig.delayDownMax) {
        direction = UP
        delayDown = 0
      }
    }, effectConfig.delayLoop)
  }

  const pulseComplex = (
    semaphore: SemaphoreLeds,
    led: LedPin,
    ledMaxBrightness: number,
    ledEffectConfig: { pulse: PulseEffectConfig },
    ledsPinToBeOn: number[]
  ) => {
    if (getLedStatus(semaphore, led) === signalStatus.ON) {
      const loopInstance = pulseFromOn(
        led,
        ledMaxBrightness,
        ledEffectConfig.pulse
      )
      const instance = {
        semaphore: semaphore,
        ledPin: getLedPinNumber(led),
        instance: loopInstance
      }

      addLoopInstance(instance)
    } else if (
      getLedStatus(semaphore, led) !== signalStatus.PULSE &&
      getLedStatus(semaphore, led) !== signalStatus.ON
    ) {
      const loopInstance = pulse(led, ledMaxBrightness, ledEffectConfig.pulse)
      const instance = {
        semaphore: semaphore,
        ledPin: getLedPinNumber(led),
        instance: loopInstance
      }

      addLoopInstance(instance)
    }

    turnOffLeds(semaphore, ledsPinToBeOn)
    removeLedsStatus(semaphore, ledsPinToBeOn)
    putLedStatus(semaphore, led, signalStatus.PULSE)
  }

  const fadeInComplex = (
    semaphore: SemaphoreLeds,
    led: LedPin,
    ledMaxBrightness: number,
    ledEffectConfig: { fadeIn: FadeEffectConfig },
    ledsPinToBeOn: number[]
  ) => {
    if (getLedStatus(semaphore, led) !== signalStatus.ON) {
      fadeIn(led, ledMaxBrightness, ledEffectConfig.fadeIn)
    }

    turnOffLeds(semaphore, ledsPinToBeOn)
    removeLedsStatus(semaphore, ledsPinToBeOn)
    putLedStatus(semaphore, led, signalStatus.ON)
  }

  /////////////////////////////////////////////////////
  /// CHANGE SIGNAL METHODS
  /////////////////////////////////////////////////////

  const setSignalS1 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.RED,
          ledsMaxBrightness.RED,
          ledsEffectConfig.RED,
          [getLedPinNumber(semaphore.RED)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.S1, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S1} signal`)
  }

  const setSignalS2 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.S2, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S2} signal`)
  }

  const setSignalS3 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN)]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN)]

    generateSignal(semaphore, signals.S3, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S3} signal`)
  }

  const setSignalS4 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.ORANGE_ONE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE_ONE)]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE_ONE)]

    generateSignal(semaphore, signals.S4, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S4} signal`)
  }

  const setSignalS5 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_ONE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE_ONE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.S5, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S5} signal`)
  }

  const setSignalS10 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [
            getLedPinNumber(semaphore.GREEN),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_TWO,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.GREEN),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.S10, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S10} signal`)
  }

  const setSignalS11 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [
            getLedPinNumber(semaphore.GREEN),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_TWO,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.GREEN),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN)]

    generateSignal(semaphore, signals.S11, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S11} signal`)
  }

  const setSignalS12 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.ORANGE_ONE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.ORANGE_ONE),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_TWO,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.ORANGE_ONE),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE_ONE)]

    generateSignal(semaphore, signals.S12, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S12} signal`)
  }

  const setSignalS13 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_ONE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.ORANGE_ONE),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE_TWO,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [
            getLedPinNumber(semaphore.ORANGE_ONE),
            getLedPinNumber(semaphore.ORANGE_TWO)
          ]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.S13, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.S13} signal`)
  }

  const setSignalSz = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.RED), getLedPinNumber(semaphore.WHITE)]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.RED,
          ledsMaxBrightness.RED,
          ledsEffectConfig.RED,
          [getLedPinNumber(semaphore.RED), getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn = [
      getLedPinNumber(semaphore.RED),
      getLedPinNumber(semaphore.WHITE)
    ]

    generateSignal(semaphore, signals.SZ, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.SZ} signal`)
  }

  const setSignalMs1 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.BLUE,
          ledsMaxBrightness.BLUE,
          ledsEffectConfig.BLUE,
          [getLedPinNumber(semaphore.BLUE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.MS1, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.MS1} signal`)
  }

  const setSignalMs2 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.MS2, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.MS2} signal`)
  }

  const setSignalSp1 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.SP1, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.SP1} signal`)
  }

  const setSignalSp2 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.SP2, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.SP2} signal`)
  }

  const setSignalSp3 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn = [
      getLedPinNumber(semaphore.GREEN),
      getLedPinNumber(semaphore.WHITE)
    ]

    generateSignal(semaphore, signals.SP3, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.SP3} signal`)
  }

  const setSignalSp4 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.ORANGE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
        ),
      () =>
        fadeInComplex(
          semaphore,
          semaphore.WHITE,
          ledsMaxBrightness.WHITE,
          ledsEffectConfig.WHITE,
          [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
        )
    ]
    const ledsPinToBeOn = [
      getLedPinNumber(semaphore.ORANGE),
      getLedPinNumber(semaphore.WHITE)
    ]

    generateSignal(semaphore, signals.SP4, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.SP4} signal`)
  }

  const setSignalOs1 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.ORANGE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.OS1, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.OS1} signal`)
  }

  const setSignalOs2 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        fadeInComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN)]
        )
    ]
    const ledsPinToBeOn: number[] = []

    generateSignal(semaphore, signals.OS2, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.OS2} signal`)
  }

  const setSignalOs3 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.GREEN,
          ledsMaxBrightness.GREEN,
          ledsEffectConfig.GREEN,
          [getLedPinNumber(semaphore.GREEN)]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN)]

    generateSignal(semaphore, signals.OS3, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.OS3} signal`)
  }

  const setSignalOs4 = (semaphore: SemaphoreLeds) => {
    const effects = [
      () =>
        pulseComplex(
          semaphore,
          semaphore.ORANGE,
          ledsMaxBrightness.ORANGE,
          ledsEffectConfig.ORANGE,
          [getLedPinNumber(semaphore.ORANGE)]
        )
    ]
    const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE)]

    generateSignal(semaphore, signals.OS4, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.OS4} signal`)
  }

  const setSignalOff = (semaphore: SemaphoreLeds) => {
    const effects: (() => void)[] = []
    const ledsPinToBeOn: number[] = []

    turnOffLeds(semaphore, ledsPinToBeOn)
    removeLedsStatus(semaphore, ledsPinToBeOn)

    generateSignal(semaphore, signals.OFF, ledsPinToBeOn, effects)
    // eslint-disable-next-line no-console
    console.log(`Choosed ${signals.OFF} signal`)
  }

  /////////////////////////////////////////////////////
  /// NODE EXPRESS ROUTING CONFIGURATION
  /////////////////////////////////////////////////////

  const routingSignals: RoutingSignal[] = [
    {
      routeSignal: signals.S1,
      setSignal: semaphore => setSignalS1(semaphore)
    },
    {
      routeSignal: signals.S2,
      setSignal: semaphore => setSignalS2(semaphore)
    },
    {
      routeSignal: signals.S3,
      setSignal: semaphore => setSignalS3(semaphore)
    },
    {
      routeSignal: signals.S4,
      setSignal: semaphore => setSignalS4(semaphore)
    },
    {
      routeSignal: signals.S5,
      setSignal: semaphore => setSignalS5(semaphore)
    },
    {
      routeSignal: signals.S10,
      setSignal: semaphore => setSignalS10(semaphore)
    },
    {
      routeSignal: signals.S11,
      setSignal: semaphore => setSignalS11(semaphore)
    },
    {
      routeSignal: signals.S12,
      setSignal: semaphore => setSignalS12(semaphore)
    },
    {
      routeSignal: signals.S13,
      setSignal: semaphore => setSignalS13(semaphore)
    },
    {
      routeSignal: signals.SZ,
      setSignal: semaphore => setSignalSz(semaphore)
    },
    {
      routeSignal: signals.MS1,
      setSignal: semaphore => setSignalMs1(semaphore)
    },
    {
      routeSignal: signals.MS2,
      setSignal: semaphore => setSignalMs2(semaphore)
    },
    {
      routeSignal: signals.SP1,
      setSignal: semaphore => setSignalSp1(semaphore)
    },
    {
      routeSignal: signals.SP2,
      setSignal: semaphore => setSignalSp2(semaphore)
    },
    {
      routeSignal: signals.SP3,
      setSignal: semaphore => setSignalSp3(semaphore)
    },
    {
      routeSignal: signals.SP4,
      setSignal: semaphore => setSignalSp4(semaphore)
    },
    {
      routeSignal: signals.OS1,
      setSignal: semaphore => setSignalOs1(semaphore)
    },
    {
      routeSignal: signals.OS2,
      setSignal: semaphore => setSignalOs2(semaphore)
    },
    {
      routeSignal: signals.OS3,
      setSignal: semaphore => setSignalOs3(semaphore)
    },
    {
      routeSignal: signals.OS4,
      setSignal: semaphore => setSignalOs4(semaphore)
    },
    {
      routeSignal: signals.OFF,
      setSignal: semaphore => setSignalOff(semaphore)
    }
  ]

  /////////////////////////////////////////////////////
  /// SET INITIAL SIGNALS
  /////////////////////////////////////////////////////

  const setInitialSignals = () => {
    semaphoreConfigurations.forEach((sem, index) => {
      const route = routingSignals.find(s => s.routeSignal === sem.signal)
      const semaphore = semaphores[index]

      if (!route || !semaphore) {
        throw new Error(`Invalid semaphore configuration at index ${index}`)
      }

      route.setSignal(semaphore)
    })
  }

  setInitialSignals()

  startSemaphoreServer({
    routingSignals,
    semaphores,
    semaphoreConfigurations
  })
})
