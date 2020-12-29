import { signals } from './src/enums/signals.enum';
import {
	semaphoreSteeringPort,
	semaphoresLedConfiguration,
	semaphoresGeneralConfiguration
} from './src/common/semaphoreConfig';

const express = require('express');
const cors = require('cors');
const serveStatic = require('serve-static');

const app = express();
const port = semaphoreSteeringPort;

// Arduino initialization
const temporal = require('temporal');
const { Board, Led } = require('johnny-five');
const board = new Board();

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

	/////////////////////////////////////////////////////
	/// BOARD DEFINITION
	/////////////////////////////////////////////////////

	const defineLedsPinPCA9685Board = (pin, address) => {
		return new Led.RGB({
			controller: 'PCA9685',
			address: address,
			pins: { red: pin, green: pin, blue: pin },
			isAnode: true,
		});
	};

	const semaphores = semaphoresLedConfiguration(defineLedsPinPCA9685Board);

	/////////////////////////////////////////////////////
	/// OTHER DEFINITIONS
	/////////////////////////////////////////////////////

	const status = {
		ON: 'on',
		PULSE: 'pulse',
	};

	let loopInstances = [];
	let ledsStatus = [];
	let currentSignals = [];

	/////////////////////////////////////////////////////
	/// LED STEERING METHODS
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
	/// LED EFFECTS METHODS
	/////////////////////////////////////////////////////

	const fadeIn = (led, maxBrightness, effectConfig) => {
		let brightness = 0;

		return temporal.loop(effectConfig.delayLoop, function () {
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
	/// CHANGE SIGNAL METHODS
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

		generateSignal(semaphore, signals.S1, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S1} signal`);
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

		generateSignal(semaphore, signals.S2, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S2} signal`);
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

		generateSignal(semaphore, signals.S3, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S3} signal`);
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

		generateSignal(semaphore, signals.S4, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S4} signal`);
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

		generateSignal(semaphore, signals.S5, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S5} signal`);
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

		generateSignal(semaphore, signals.S10, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S10} signal`);
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

		generateSignal(semaphore, signals.S11, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S11} signal`);
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

		generateSignal(semaphore, signals.S12, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S12} signal`);
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

		generateSignal(semaphore, signals.S13, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.S13} signal`);
	};

	const setSignalSz = (semaphore) => {
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

		generateSignal(semaphore, signals.SZ, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.SZ} signal`);
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

		generateSignal(semaphore, signals.MS1, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.MS1} signal`);
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

		generateSignal(semaphore, signals.MS2, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.MS2} signal`);
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

		generateSignal(semaphore, signals.SP1, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.SP1} signal`);
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

		generateSignal(semaphore, signals.SP2, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.SP2} signal`);
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

		generateSignal(semaphore, signals.SP3, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.SP3} signal`);
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

		generateSignal(semaphore, signals.SP4, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.SP4} signal`);
	};

	const setSignalOs1 = (semaphore) => {
		const effects = [
			() => fadeInComplex(
				semaphore,
				semaphore.ORANGE,
				ledsMaxBrightness.ORANGE,
				ledsEffectConfig.ORANGE,
				[getLedPinNumber(semaphore.ORANGE)]
			),
		];
		const ledsPinToBeOn = [];

		generateSignal(semaphore, signals.OS1, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.OS1} signal`);
	};

	const setSignalOs2 = (semaphore) => {
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

		generateSignal(semaphore, signals.OS2, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.OS2} signal`);
	};

	const setSignalOs3 = (semaphore) => {
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

		generateSignal(semaphore, signals.OS3, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.OS3} signal`);
	};

	const setSignalOs4 = (semaphore) => {
		const effects = [
			() => pulseComplex(
				semaphore,
				semaphore.ORANGE,
				ledsMaxBrightness.ORANGE,
				ledsEffectConfig.ORANGE,
				[getLedPinNumber(semaphore.ORANGE)]
			),
		];
		const ledsPinToBeOn = [getLedPinNumber(semaphore.ORANGE)];

		generateSignal(semaphore, signals.OS4, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.OS4} signal`);
	};

	const setSignalOff = (semaphore) => {
		const effects = [];
		const ledsPinToBeOn = [];

		turnOffLeds(semaphore, ledsPinToBeOn, status.OFF);
		removeLedsStatus(semaphore, ledsPinToBeOn);

		generateSignal(semaphore, signals.OFF, ledsPinToBeOn, effects);
		console.log(`Choosed ${signals.OFF} signal`);
	};

	/////////////////////////////////////////////////////
	/// NODE ROUTING
	/////////////////////////////////////////////////////

	const routingSignals = [
		{
			routeSignal: signals.S1,
			setSignal: (semaphore) => setSignalS1(semaphore),
		},
		{
			routeSignal: signals.S2,
			setSignal: (semaphore) => setSignalS2(semaphore),
		},
		{
			routeSignal: signals.S3,
			setSignal: (semaphore) => setSignalS3(semaphore),
		},
		{
			routeSignal: signals.S4,
			setSignal: (semaphore) => setSignalS4(semaphore),
		},
		{
			routeSignal: signals.S5,
			setSignal: (semaphore) => setSignalS5(semaphore),
		},
		{
			routeSignal: signals.S10,
			setSignal: (semaphore) => setSignalS10(semaphore),
		},
		{
			routeSignal: signals.S11,
			setSignal: (semaphore) => setSignalS11(semaphore),
		},
		{
			routeSignal: signals.S12,
			setSignal: (semaphore) => setSignalS12(semaphore),
		},
		{
			routeSignal: signals.S13,
			setSignal: (semaphore) => setSignalS13(semaphore),
		},
		{
			routeSignal: signals.SZ,
			setSignal: (semaphore) => setSignalSz(semaphore),
		},
		{
			routeSignal: signals.MS1,
			setSignal: (semaphore) => setSignalMs1(semaphore),
		},
		{
			routeSignal: signals.MS2,
			setSignal: (semaphore) => setSignalMs2(semaphore),
		},
		{
			routeSignal: signals.SP1,
			setSignal: (semaphore) => setSignalSp1(semaphore),
		},
		{
			routeSignal: signals.SP2,
			setSignal: (semaphore) => setSignalSp2(semaphore),
		},
		{
			routeSignal: signals.SP3,
			setSignal: (semaphore) => setSignalSp3(semaphore),
		},
		{
			routeSignal: signals.SP4,
			setSignal: (semaphore) => setSignalSp4(semaphore),
		},
		{
			routeSignal: signals.OS1,
			setSignal: (semaphore) => setSignalOs1(semaphore),
		},
		{
			routeSignal: signals.OS2,
			setSignal: (semaphore) => setSignalOs2(semaphore),
		},
		{
			routeSignal: signals.OS3,
			setSignal: (semaphore) => setSignalOs3(semaphore),
		},
		{
			routeSignal: signals.OS4,
			setSignal: (semaphore) => setSignalOs4(semaphore),
		},
		{
			routeSignal: signals.OFF,
			setSignal: (semaphore) => setSignalOff(semaphore),
		},
	];

	const semaphoreRouteName = (type, number) => (
		`${type}${number}`
	);

	const routingSemaphores = () => {
		return semaphoresGeneralConfiguration.map(
			(sem, index) => ({
				routeSemaphore: semaphoreRouteName(sem.type, sem.number),
				semaphore: semaphores[index],
			})
		);
	};

	/////////////////////////////////////////////////////
	/// SET INITIAL SIGNALS
	/////////////////////////////////////////////////////

	const setInitialSignals = () => {
		semaphoresGeneralConfiguration.forEach(
			(sem, index) => {
				routingSignals
					.find(s => s.routeSignal === sem.signal)
					.setSignal(semaphores[index]);
			}
		);
	};

	setInitialSignals();

	/////////////////////////////////////////////////////
	/// MIDDLEWARES - https://expressjs.com/en/guide/writing-middleware.html
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
	// cors - Enable CORS for a Single Route (https://expressjs.com/en/resources/middleware/cors.html)
	app.get('/:semaphore/:signal', cors(), (req, res) => {
		const signalToShow = routingSignals
			.filter(s => s.routeSignal === req.params.signal.toUpperCase());
		const semaphoreToUse = routingSemaphores()
			.filter(s => s.routeSemaphore === req.params.semaphore);

		signalToShow[0].setSignal(semaphoreToUse[0].semaphore);
		// Express Response: https://expressjs.com/en/4x/api.html#res
		res.send(`Semaphore ${req.params.semaphore} ${req.params.signal} ON!`);
	});

	app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
