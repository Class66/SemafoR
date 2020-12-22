const express = require('express');
const serveStatic = require('serve-static');

const app = express();
const port = 4000;

// Arduino initialization
const temporal = require('temporal');
const { Board, Led } = require('johnny-five');
const board = new Board();

board.on('ready', function () {

    /////////////////////////////////////////////////////
    /// PCA9685 BOARDS CONFIGURATION - CAN BE EXTENDED/MODIFIED BY A USER
    /////////////////////////////////////////////////////

    const defineLedsPinPCA9685BoardOne = (pin) => {
        return new Led.RGB({
            controller: 'PCA9685',
            address: 0x40,
            pins: { red: pin, green: pin, blue: pin },
            isAnode: true,
        });
    };

    const defineLedsPinPCA9685BoardTwo = (pin) => {
        return new Led.RGB({
            controller: 'PCA9685',
            address: 0x41,
            pins: { red: pin, green: pin, blue: pin },
            isAnode: true,
        });
    };

    /////////////////////////////////////////////////////
    /// SEMAPHORES LED'S PINS CONFIGURATION - CAN BE EXTENDED/MODIFIED BY A USER
    /////////////////////////////////////////////////////

    const ledsSemaphore1 = {
        GREEN: defineLedsPinPCA9685BoardOne(0),
        ORANGE_ONE: defineLedsPinPCA9685BoardOne(1),
        RED: defineLedsPinPCA9685BoardOne(2),
        ORANGE_TWO: defineLedsPinPCA9685BoardOne(3),
        WHITE: defineLedsPinPCA9685BoardOne(4),
    };

    const ledsSemaphore2 = {
        GREEN: defineLedsPinPCA9685BoardOne(5),
        ORANGE_ONE: defineLedsPinPCA9685BoardOne(6),
        RED: defineLedsPinPCA9685BoardOne(7),
        ORANGE_TWO: defineLedsPinPCA9685BoardOne(8),
        WHITE: defineLedsPinPCA9685BoardOne(9),
    };

    const ledsSemaphore3 = {
        GREEN: defineLedsPinPCA9685BoardOne(10),
        ORANGE_ONE: defineLedsPinPCA9685BoardOne(11),
        RED: defineLedsPinPCA9685BoardOne(12),
        ORANGE_TWO: defineLedsPinPCA9685BoardOne(13),
        WHITE: defineLedsPinPCA9685BoardOne(14),
    };

    const ledsSemaphore1Man = {
        WHITE: defineLedsPinPCA9685BoardTwo(0),
        BLUE: defineLedsPinPCA9685BoardTwo(1),
    };

    const ledsSemaphore2Man = {
        WHITE: defineLedsPinPCA9685BoardTwo(2),
        BLUE: defineLedsPinPCA9685BoardTwo(3),
    };

    const ledsSemaphore3Man = {
        WHITE: defineLedsPinPCA9685BoardTwo(4),
        BLUE: defineLedsPinPCA9685BoardTwo(5),
    };

    const ledsSemaphore1Pow = {
        ORANGE: defineLedsPinPCA9685BoardTwo(8),
        GREEN: defineLedsPinPCA9685BoardTwo(9),
        WHITE: defineLedsPinPCA9685BoardTwo(10),
    };

    /////////////////////////////////////////////////////
    /// LEDS CONFIGURATION - CAN BE EXTENDED/MODIFIED BY A USER
    /////////////////////////////////////////////////////

    // Maximum LED brightness (closely related to the parameters in ledsEffectConfig)
    const ledsMaxBrightness = { 
        GREEN: 4,
        ORANGE: 45,
        RED: 15,
        WHITE: 15,
        BLUE: 5,
    };

    // Timing of leds effects (closely related to the parameters in ladsMaxBrightness)
    const ledsEffectConfig = {
        GREEN: {
            pulse: {
                brightnessStep: 0.5,
                delayLoop: 35,
                delayMax: 15,
                delayDownMax: 5,
            },
            fadeIn: {
                brightnessStep: 0.5,
                delayLoop: 40,
            },
        },
        ORANGE: {
            pulse: {
                brightnessStep: 1.5,
                delayLoop: 13,
                delayMax: 15,
                delayDownMax: 15,
            },
            fadeIn: {
                brightnessStep: 1,
                delayLoop: 10,
            },
        },
        RED: {
            fadeIn: {
                brightnessStep: 1,
                delayLoop: 10,
            },
        },
        WHITE: {
            pulse: {
                brightnessStep: 1,
                delayLoop: 16,
                delayMax: 45,
                delayDownMax: 15,
            },
            fadeIn: {
                brightnessStep: 1,
                delayLoop: 10,
            },
        },
        BLUE: {
            fadeIn: {
                brightnessStep: 1,
                delayLoop: 10,
            },
        },
    };

    const status = {
        ON: 'on',
        PULSE: 'pulse',
    };

    const signal = {
        // Main semaphore
        S1: 'S1', S2: 'S2', S3: 'S3', S4: 'S4', S5: 'S5', S10: 'S10',
        S11: 'S11', S12: 'S12', S13: 'S13', SZ: 'SZ', MS2: 'MS2',
        // Maneuvering shield
        MS1: 'MS1', MS2: 'MS2',
        // Repeating signal
        SP1: 'SP1', SP2: 'SP2', SP3: 'SP3', SP4: 'SP4',
        // Off
        OFF: 'OFF',
    };

    let loopInstances = [];
    let ledsStatus = [];
    let currentSignals = [];

    /////////////////////////////////////////////////////
    /// LED STEERING METHODS - DO NOT MODIFY !!!
    /////////////////////////////////////////////////////

    const stopAllLoops = (semaphore, ledsPinToBeOn) => {
        if (loopInstances.length) {
            const loopInstancesForOtherSemaphores = loopInstances
                .filter(loop => loop.semaphore !== semaphore);
            const loopInstancesForThisSemaphore = loopInstances
                .filter(loop => loop.semaphore === semaphore);
            const loopInstancesForLedsToBeOff = loopInstancesForThisSemaphore
                .filter(loop => !ledsPinToBeOn.includes(loop.ledPin));

            loopInstancesForLedsToBeOff.forEach(loop => loop.instance.stop());

            const loopInstancesForLedsToBeOn = loopInstancesForThisSemaphore
                .filter(loop => ledsPinToBeOn.includes(loop.ledPin));

            loopInstances = [];
            loopInstances = loopInstances
                .concat(loopInstancesForOtherSemaphores)
                .concat(loopInstancesForLedsToBeOn);
        }
    };

    const getLedPinNumber = (led) => led.pins[0];

    const setCurrentSignal = (semaphore, signal) => {
        const currentSignal = {
            semaphore: semaphore,
            signal: signal,
        };

        currentSignals.push(currentSignal);
    };

    const isSignalSet = (semaphore, signal) => {
        if (currentSignals.length) {
            return currentSignals
                .find(cs => cs.semaphore === semaphore && cs.signal === signal);
        }

        return false;
    };

    const removeSignal = (semaphore) => {
        if (currentSignals.length) {
            const index = currentSignals
                .findIndex(cs => cs.semaphore === semaphore);

            if (index !== -1) {
                console.table(currentSignals);
                currentSignals.splice(index, 1);
                console.table(currentSignals);
            }
        }
    };

    const putLedStatus = (semaphore, led, status) => {
        const ledPin = getLedPinNumber(led);
        const ledStatus = {
            semaphore: semaphore,
            ledPin: ledPin,
            status: status,
        }
        const isLedActive = ledsStatus
            .some(l => l.ledPin === ledPin && l.semaphore == semaphore);

        if (isLedActive) {
            updateLedStatus(semaphore, led, status);
            console.table(ledsStatus);
        } else {
            ledsStatus.push(ledStatus);
            console.table(ledsStatus);
        }
    };

    const updateLedStatus = (semaphore, led, status) => {
        const idx = ledsStatus
            .findIndex(
                ledStatus => ledStatus.semaphore === semaphore &&
                ledStatus.ledPin === getLedPinNumber(led)
            );
        ledsStatus[idx].status = status;
    };

    const removeLedsStatus = (semaphore, ledsPinToBeOn) => {
        if (ledsStatus.length) {
            const ledsStatusForOthersSemaphores = ledsStatus
                .filter(ledStatus => ledStatus.semaphore !== semaphore);
            const ledsStatusForThisSemaphore = ledsStatus
                .filter(ledStatus => ledStatus.semaphore === semaphore);
            const ledsStatusForledsToBeOff = ledsStatusForThisSemaphore
                .filter(ledStatus => ledsPinToBeOn.includes(ledStatus.ledPin));
            ledsStatus = [];
            ledsStatus = ledsStatus
                .concat(ledsStatusForOthersSemaphores)
                .concat(ledsStatusForledsToBeOff);
        }
    };

    const getLedStatus = (semaphore, led) => {
        if (ledsStatus.length) {
            const ledPin = getLedPinNumber(led);
            const ledStatus = ledsStatus
                .find(
                    ledStatus => ledStatus.ledPin === ledPin &&
                    ledStatus.semaphore === semaphore
                );

            if (ledStatus && ledStatus.hasOwnProperty('status')) {
                return ledStatus.status;
            }
        }

        return false;
    };

    const turnOffLeds = (semaphore, ledsPinToBeOn) => {
        const ledsToBeOff = Object.values(semaphore)
            .filter(sem => !ledsPinToBeOn.includes(sem.pins[0]));
        ledsToBeOff.forEach(led => led.off());
    };

    /////////////////////////////////////////////////////
    /// LED EFFECTS METHODS - DO NOT MODIFY !!!
    /////////////////////////////////////////////////////

    const fadeIn = (led, maxBrightness, effectConfig) => {
        let brightness = 0;

        return temporal.loop(effectConfig.delayLoop, function() {
            // Here can't be defined arrow function because of this
            brightness = brightness + effectConfig.brightnessStep;
            if (brightness === maxBrightness) {
                this.stop(); // |this| is a reference to the temporal instance use it to cancel the loop
            }
            if (brightness <= maxBrightness) {
                led.intensity(brightness);
            }
        });
    };

    const fadeOut = (led, maxBrightness, effectConfig) => {
        let brightness = maxBrightness;
        led.intensity(maxBrightness);

        return temporal.loop(effectConfig.delayLoop, function () {
            // Here can't be defined arrow function because of this
            brightness = brightness - effectConfig.brightnessStep;
            if (brightness < 0) {
                this.stop(); // |this| is a reference to the temporal instance use it to cancel the loop
            }
            if (brightness < maxBrightness) {
                led.intensity(brightness);
            }
        });
    };

    const pulse = (led, maxBrightness, effectConfig) => {
        let brightness = 0;
        let delay = 0;
        let delayDown = 0;
        let direction = 'up';

        return temporal.loop(effectConfig.delayLoop, function () {
            direction === 'up' && (brightness = brightness + effectConfig.brightnessStep);
            direction === 'down' && (brightness = brightness - effectConfig.brightnessStep);
            direction === 'stopUp' && delay++;
            if (brightness <= maxBrightness && direction === 'up') {
                led.intensity(brightness);
            }
            if (brightness >= 0 && direction === 'down') {
                led.intensity(brightness);
            }
            if (brightness > maxBrightness) {
                direction = 'stopUp';
                delay++;
            }
            if (delay > effectConfig.delayMax) {
                direction = 'down';
                delay = 0;
            }
            if (brightness < 0 && direction === 'down') {
                direction = 'stopDown';
            }
            if (brightness < 0 && direction === 'stopDown') {
                delayDown++;
            }
            if (delayDown > effectConfig.delayDownMax) {
                direction = 'up';
                delayDown = 0;
            }
        });
    };

    const pulseFromOn = (led, maxBrightness, effectConfig) => {
        let brightness = maxBrightness;
        let delay = 0;
        let delayDown = 0;
        let direction = 'down';
        led.intensity(maxBrightness);

        return temporal.loop(effectConfig.delayLoop, function () {
            direction === 'up' && (brightness = brightness + effectConfig.brightnessStep);
            direction === 'down' && (brightness = brightness - effectConfig.brightnessStep);
            direction === 'stopUp' && delay++;
            if (brightness <= maxBrightness && direction === 'up') {
                led.intensity(brightness);
            }
            if (brightness >= 0 && direction === 'down') {
                led.intensity(brightness);
            }
            if (brightness > maxBrightness) {
                direction = 'stopUp';
                delay++;
            }
            if (delay > effectConfig.delayMax) {
                direction = 'down';
                delay = 0;
            }
            if (brightness < 0 && direction === 'down') {
                direction = 'stopDown';
            }
            if (brightness < 0 && direction === 'stopDown') {
                delayDown++;
            }
            if (delayDown > effectConfig.delayDownMax) {
                direction = 'up';
                delayDown = 0;
            }
        });
    };

    const pulseComplex = (semaphore, led, ledMaxBrightness, ledEffectConfig, ledsPinToBeOn) => {
        if (getLedStatus(semaphore, led) === status.ON) {
            const loopInstance = pulseFromOn(led, ledMaxBrightness, ledEffectConfig.pulse);
            const instance = {
                semaphore: semaphore,
                ledPin: getLedPinNumber(led),
                instance: loopInstance,
            };

            loopInstances.push(instance);
        } else if (
            getLedStatus(semaphore, led) !== status.PULSE &&
            getLedStatus(semaphore, led) !== status.ON
        ) {
            const loopInstance = pulse(led, ledMaxBrightness, ledEffectConfig.pulse);
            const instance = {
                semaphore: semaphore,
                ledPin: getLedPinNumber(led),
                instance: loopInstance,
            };

            loopInstances.push(instance);
        }

        turnOffLeds(semaphore, ledsPinToBeOn, status.PULSE);
        removeLedsStatus(semaphore, ledsPinToBeOn);
        putLedStatus(semaphore, led, status.PULSE);
    };

    const fadeInComplex = (semaphore, led, ledMaxBrightness, ledEffectConfig, ledsPinToBeOn) => {
        if (getLedStatus(semaphore, led) !== status.ON) {
            fadeIn(led, ledMaxBrightness, ledEffectConfig.fadeIn);
        }

        turnOffLeds(semaphore, ledsPinToBeOn, status.ON);
        removeLedsStatus(semaphore, ledsPinToBeOn);
        putLedStatus(semaphore, led, status.ON);
    };

    /////////////////////////////////////////////////////
    /// CHANGE SIGNAL METHODS - DO NOT MODIFY !!!
    /////////////////////////////////////////////////////

    const generateSignal = (semaphore, signalStatus, ledsPinToBeOn, effects) => {
        if (!isSignalSet(semaphore, signalStatus)) {
            removeSignal(semaphore);
            setCurrentSignal(semaphore, signalStatus);
            stopAllLoops(semaphore, ledsPinToBeOn);

            effects.forEach(effect => {
                typeof effect === 'function' && effect()
            });
        }
    };

    const setSignalS1 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.RED,
                ledsMaxBrightness.RED,
                ledsEffectConfig.RED,
                [getLedPinNumber(semaphore.RED)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.S1, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S1} signal`);
    };

    const setSignalS2 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.S2, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S2} signal`);
    };

    const setSignalS3 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN)];

        generateSignal(semaphore, signal.S3, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S3} signal`);
    };

    const setSignalS4 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.ORANGE_ONE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE_ONE)];

        generateSignal(semaphore, signal.S4, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S4} signal`);
    };

    const setSignalS5 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_ONE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.S5, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S5} signal`);
    };

    const setSignalS10 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_TWO,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.S10, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S10} signal`);
    };

    const setSignalS11 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_TWO,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN)];

        generateSignal(semaphore, signal.S11, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S11} signal`);
    };

    const setSignalS12 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.ORANGE_ONE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_TWO,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE_ONE)];

        generateSignal(semaphore, signal.S12, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S12} signal`);
    };

    const setSignalS13 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_ONE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE_TWO,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE_ONE), getLedPinNumber(semaphore.ORANGE_TWO)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.S13, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.S13} signal`);
    };

    const setSignalSZ = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.RED), getLedPinNumber(semaphore.WHITE)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.RED,
                ledsMaxBrightness.RED,
                ledsEffectConfig.RED,
                [getLedPinNumber(semaphore.RED), getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.RED), getLedPinNumber(semaphore.WHITE)];

        generateSignal(semaphore, signal.SZ, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.SZ} signal`);
    };

    const setSignalMs1 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.BLUE,
                ledsMaxBrightness.BLUE,
                ledsEffectConfig.BLUE,
                [getLedPinNumber(semaphore.BLUE)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.MS1, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.MS1} signal`);
    };

    const setSignalMs2 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.MS2, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.MS2} signal`);
    };

    const setSignalSp1 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.ORANGE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.SP1, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.SP1} signal`);
    };

    const setSignalSp2 = (semaphore) => {
        const effects = [
            () => fadeInComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [];

        generateSignal(semaphore, signal.SP2, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.SP2} signal`);
    };

    const setSignalSp3 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.GREEN,
                ledsMaxBrightness.GREEN,
                ledsEffectConfig.GREEN,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.GREEN), getLedPinNumber(semaphore.WHITE)];

        generateSignal(semaphore, signal.SP3, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.SP3} signal`);
    };

    const setSignalSp4 = (semaphore) => {
        const effects = [
            () => pulseComplex(
                semaphore,
                semaphore.ORANGE,
                ledsMaxBrightness.ORANGE,
                ledsEffectConfig.ORANGE,
                [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
            ),
            () => fadeInComplex(
                semaphore,
                semaphore.WHITE,
                ledsMaxBrightness.WHITE,
                ledsEffectConfig.WHITE,
                [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)]
            ),
        ];
        const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE), getLedPinNumber(semaphore.WHITE)];

        generateSignal(semaphore, signal.SP4, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.SP4} signal`);
    };

    const setSignalOff = (semaphore) => {
        const effects = [];
        const ledsPinToBeOn = [];

        turnOffLeds(semaphore, ledsPinToBeOn, status.OFF);
        removeLedsStatus(semaphore, ledsPinToBeOn);

        generateSignal(semaphore, signal.OFF, ledsPinToBeOn, effects);
        console.log(`Choosed ${signal.OFF} signal`);
    };

    /////////////////////////////////////////////////////
    /// SET INITIAL SIGNALS - CAN BE EXTENDED/MODIFIED BY A USER
    /////////////////////////////////////////////////////

    const setInitialSignals = () => {
        setSignalS1(ledsSemaphore1);
        //setSignalS1(ledsSemaphore2);
        //setSignalS1(ledsSemaphore3);
        setSignalMs1(ledsSemaphore1Man);
        //setSignalMs1(ledsSemaphore2Man);
        //setSignalMs1(ledsSemaphore3Man);
        //setSignalSp1(ledsSemaphore1Pow);
    };

    setInitialSignals();

    /////////////////////////////////////////////////////
    /// NODE ROUTING
    /////////////////////////////////////////////////////

    const routingSignals = [ // DO NOT MODIFY !!!
        {
            routeSignal: signal.S1,
            setSignal: (semaphore) => setSignalS1(semaphore),
        },
        {
            routeSignal: signal.S2,
            setSignal: (semaphore) => setSignalS2(semaphore),
        },
        {
            routeSignal: signal.S3,
            setSignal: (semaphore) => setSignalS3(semaphore),
        },
        {
            routeSignal: signal.S4,
            setSignal: (semaphore) => setSignalS4(semaphore),
        },
        {
            routeSignal: signal.S5,
            setSignal: (semaphore) => setSignalS5(semaphore),
        },
        {
            routeSignal: signal.S10,
            setSignal: (semaphore) => setSignalS10(semaphore),
        },
        {
            routeSignal: signal.S11,
            setSignal: (semaphore) => setSignalS11(semaphore),
        },
        {
            routeSignal: signal.S12,
            setSignal: (semaphore) => setSignalS12(semaphore),
        },
        {
            routeSignal: signal.S13,
            setSignal: (semaphore) => setSignalS13(semaphore),
        },
        {
            routeSignal: signal.SZ,
            setSignal: (semaphore) => setSignalSZ(semaphore),
        },
        {
            routeSignal: signal.MS1,
            setSignal: (semaphore) => setSignalMs1(semaphore),
        },
        {
            routeSignal: signal.MS2,
            setSignal: (semaphore) => setSignalMs2(semaphore),
        },
        {
            routeSignal: signal.SP1,
            setSignal: (semaphore) => setSignalSp1(semaphore),
        },
        {
            routeSignal: signal.SP2,
            setSignal: (semaphore) => setSignalSp2(semaphore),
        },
        {
            routeSignal: signal.SP3,
            setSignal: (semaphore) => setSignalSp3(semaphore),
        },
        {
            routeSignal: signal.SP4,
            setSignal: (semaphore) => setSignalSp4(semaphore),
        },
        {
            routeSignal: signal.OFF,
            setSignal: (semaphore) => setSignalOff(semaphore),
        },
    ];

    const routingSemaphores = [ // CAN BE EXTENDED/MODIFIED BY A USER
        {
            routeSemaphore: 'sem1',
            semaphore: ledsSemaphore1,
        },
        {
            routeSemaphore: 'sem2',
            semaphore: ledsSemaphore2,
        },
        {
            routeSemaphore: 'sem3',
            semaphore: ledsSemaphore3,
        },
        {
            routeSemaphore: 'sem1man',
            semaphore: ledsSemaphore1Man,
        },
        {
            routeSemaphore: 'sem2man',
            semaphore: ledsSemaphore2Man,
        },
        {
            routeSemaphore: 'sem3man',
            semaphore: ledsSemaphore3Man,
        },
        {
            routeSemaphore: 'sem1pow',
            semaphore: ledsSemaphore1Pow,
        },
    ];

    /////////////////////////////////////////////////////
    /// MIDDLEWARES https://expressjs.com/en/guide/writing-middleware.html - DO NOT MODIFY !!!
    /////////////////////////////////////////////////////

    const writeTimeOnConsole = (req, res, next) => {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        console.log('Time of calling request:', date, time);
        next();
    };

    // Middleware - Our static files - https://expressjs.com/en/starter/static-files.html
    app.use(serveStatic('.', {
        'index': ['semaphore.html']
    }));

    // Middleware - Our function for logging time
    app.use(writeTimeOnConsole);

    // Express Routing: https://expressjs.com/en/guide/routing.html
    app.get('/:semaphore/:signal', (req, res) => {
        const signalToShow = routingSignals
            .filter(s => s.routeSignal === req.params.signal.toUpperCase());
        const semaphoreToUse = routingSemaphores
            .filter(s => s.routeSemaphore === req.params.semaphore);

        signalToShow[0].setSignal(semaphoreToUse[0].semaphore);
        // Express Response: https://expressjs.com/en/4x/api.html#res
        res.send(`Semaphore ${req.params.semaphore} ${req.params.signal} ON!`);
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
