import { PropTypes } from 'prop-types';

import { Signal } from '../Signal/Signal';
import { Pole } from '../Pole/Pole';
import { SignalLabel } from '../SignalLabel/SignalLabel';
import { signals } from '../../enums/signals.enum';
import { semaphoreTypes } from './../../enums/semaphoreTypes.enum';
import { signalLights } from './../../enums/signalLights.enum';

import './Semaphore.scss';

export const Semaphore = ({ setSignalHandler, signalType, semaphoreType }) => {
	const signalDefinitionsForSmSemaphore = {
		S1: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.RED_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S1} />
			</>
		),
		S2: (
			<>
				<Signal image={signalLights.GREEN_UP_SOLID} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S2} />
			</>
		),
		S3: (
			<>
				<Signal image={signalLights.GREEN_UP_BLINKING} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S3} />
			</>
		),
		S4: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_MIDDLE_BLINKING} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S4} />
			</>
		),
		S5: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S5} />
			</>
		),
		S10: (
			<>
				<Signal image={signalLights.GREEN_UP_SOLID} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S10} />
			</>
		),
		S11: (
			<>
				<Signal image={signalLights.GREEN_UP_BLINKING} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S11} />
			</>
		),
		S12: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_MIDDLE_BLINKING} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S12} />
			</>
		),
		S13: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.S13} />
			</>
		),
		SZ: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.RED_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_BLINKING} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.SZ} />
			</>
		),
		MS2: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_BLINKING} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.MS2} />
			</>
		),
		OFF: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sm} />
				<SignalLabel signal={signals.OFF} />
			</>
		),
	};

	const signalDefinitionsForSpSemaphore = {
		SP1: (
			<>
				<Signal image={signalLights.ORANGE_UP_SOLID} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sp} />
				<SignalLabel signal={signals.SP1} />
			</>
		),
		SP2: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.GREEN_MIDDLE_SOLID} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sp} />
				<SignalLabel signal={signals.SP2} />
			</>
		),
		SP3: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.GREEN_MIDDLE_BLINKING} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sp} />
				<SignalLabel signal={signals.SP3} />
			</>
		),
		SP4: (
			<>
				<Signal image={signalLights.ORANGE_UP_BLINKING} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sp} />
				<SignalLabel signal={signals.SP4} />
			</>
		),
		OFF: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Sp} />
				<SignalLabel signal={signals.OFF} />
			</>
		),
	};

	const signalDefinitionsForToSemaphore = {
		OS1: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.To} />
				<SignalLabel signal={signals.OS1} />
			</>
		),
		OS2: (
			<>
				<Signal image={signalLights.GREEN_UP_SOLID} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.To} />
				<SignalLabel signal={signals.OS2} />
			</>
		),
		OS3: (
			<>
				<Signal image={signalLights.GREEN_UP_BLINKING} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.To} />
				<SignalLabel signal={signals.OS3} />
			</>
		),
		OS4: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.ORANGE_DOWN_BLINKING} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.To} />
				<SignalLabel signal={signals.OS4} />
			</>
		),
		OFF: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.To} />
				<SignalLabel signal={signals.OFF} />
			</>
		),
	};

	const signalDefinitionsForTmSemaphore = {
		MS1: (
			<>
				<Signal image={signalLights.BLUE_UP_SOLID} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Tm} />
				<SignalLabel signal={signals.MS1} />
			</>
		),
		MS2: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Tm} />
				<SignalLabel signal={signals.MS2} />
			</>
		),
		OFF: (
			<>
				<Signal image={signalLights.OFF_UP} />
				<Signal image={signalLights.OFF_DOWN} isMiddle={true} />
				<Pole semaphoreType={semaphoreTypes.Tm} />
				<SignalLabel signal={signals.OFF} />
			</>
		),
	};

	const displaySignals = () => {
		switch (semaphoreType) {
			case semaphoreTypes.Sm:
				return signalDefinitionsForSmSemaphore[signalType];
			case semaphoreTypes.Sp:
				return signalDefinitionsForSpSemaphore[signalType];
			case semaphoreTypes.To:
				return signalDefinitionsForToSemaphore[signalType];
			case semaphoreTypes.Tm:
				return signalDefinitionsForTmSemaphore[signalType];
			default:
				return signalDefinitionsForSmSemaphore[signalType];
		};
	};

	return (
		<div className="Semaphore" onClick={() => setSignalHandler(signalType)}>
			{ displaySignals()}
		</div>
	);
};

Semaphore.propTypes = {
	setSignalHandler: PropTypes.func.isRequired,
	signalType: PropTypes.string.isRequired,
	semaphoreType: PropTypes.string.isRequired,
};
