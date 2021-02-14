import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import { Signal } from '../Signal/Signal';
import { Pole } from '../Pole/Pole';
import { SignalLabel } from '../SignalLabel/SignalLabel';
import { signals } from '../../enums/signals.enum';
import { semaphoreTypes } from './../../enums/semaphoreTypes.enum';
import { signalLights } from './../../enums/signalLights.enum';
import { semaphoreShape } from './../../types/semaphore.type';

import './Semaphore.scss';

export const Semaphore = ({
	setSignalHandler, signalType,
	semaphoreType, selectedSemaphore
}) => {
	const OffUp = <Signal image={signalLights.OFF_UP} />;
	const OffMiddle = <Signal image={signalLights.OFF_MIDDLE} isMiddle={true} />;
	const OffDown = <Signal image={signalLights.OFF_DOWN} isMiddle={true} />;

	const RedUpSolid = <Signal image={signalLights.RED_UP_SOLID} />;
	const RedMiddleSolid = <Signal image={signalLights.RED_MIDDLE_SOLID} isMiddle={true} />;
	const GreenUpSolid = <Signal image={signalLights.GREEN_UP_SOLID} />;
	const GreenUpBlinking = <Signal image={signalLights.GREEN_UP_BLINKING} />;
	const GreenMiddleSolid = <Signal image={signalLights.GREEN_MIDDLE_SOLID} isMiddle={true} />;
	const GreenMiddleBlinking = <Signal image={signalLights.GREEN_MIDDLE_BLINKING} isMiddle={true} />;
	const GreenDownSolid = <Signal image={signalLights.GREEN_DOWN_SOLID} isMiddle={true} />;
	const GreenDownBlinking = <Signal image={signalLights.GREEN_DOWN_BLINKING} isMiddle={true} />;
	const OrangeUpSolid = <Signal image={signalLights.ORANGE_UP_SOLID} />;
	const OrangeUpBlinking = <Signal image={signalLights.ORANGE_UP_BLINKING} />;
	const OrangeMiddleSolid = <Signal image={signalLights.ORANGE_MIDDLE_SOLID} isMiddle={true} />;
	const OrangeMiddleBlinking = <Signal image={signalLights.ORANGE_MIDDLE_BLINKING} isMiddle={true} />;
	const OrangeDownSolid = <Signal image={signalLights.ORANGE_DOWN_SOLID} isMiddle={true} />;
	const OrangeDownBlinking = <Signal image={signalLights.ORANGE_DOWN_BLINKING} isMiddle={true} />;
	const WhiteDownSolid = <Signal image={signalLights.WHITE_DOWN_SOLID} isMiddle={true} />;
	const WhiteDownBlinking = <Signal image={signalLights.WHITE_DOWN_BLINKING} isMiddle={true} />;
	const BlueUpSolid = <Signal image={signalLights.BLUE_UP_SOLID} />;
	
	const PoleSm = <Pole semaphoreType={semaphoreTypes.Sm} />;
	const PoleSp = <Pole semaphoreType={semaphoreTypes.Sp} />;
	const PoleTo = <Pole semaphoreType={semaphoreTypes.To} />;
	const PoleTm = <Pole semaphoreType={semaphoreTypes.Tm} />;

	const SignalS1 = <SignalLabel signal={signals.S1} />;
	const SignalS2 = <SignalLabel signal={signals.S2} />;
	const SignalS3 = <SignalLabel signal={signals.S3} />;
	const SignalS4 = <SignalLabel signal={signals.S4} />;
	const SignalS5 = <SignalLabel signal={signals.S5} />;
	const SignalS10 = <SignalLabel signal={signals.S10} />;
	const SignalS11 = <SignalLabel signal={signals.S11} />;
	const SignalS12 = <SignalLabel signal={signals.S12} />;
	const SignalS13 = <SignalLabel signal={signals.S13} />;
	const SignalSZ = <SignalLabel signal={signals.SZ} />;
	const SignalMS1 = <SignalLabel signal={signals.MS1} />;
	const SignalMS2 = <SignalLabel signal={signals.MS2} />;
	const SignalOS1 = <SignalLabel signal={signals.OS1} />;
	const SignalOS2 = <SignalLabel signal={signals.OS2} />;
	const SignalOS3 = <SignalLabel signal={signals.OS3} />;
	const SignalOS4 = <SignalLabel signal={signals.OS4} />;
	const SignalSP1 = <SignalLabel signal={signals.SP1} />;
	const SignalSP2 = <SignalLabel signal={signals.SP2} />;
	const SignalSP3 = <SignalLabel signal={signals.SP3} />;
	const SignalSP4 = <SignalLabel signal={signals.SP4} />;
	const SignalOFF = <SignalLabel signal={signals.OFF} />;

	const signalDefinitionsForSmSemaphore = {
		S1: (
			<>
				<OffUp />
				<OffMiddle />
				<RedMiddleSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S4: (
			<>
				<OffUp />
				<OrangeMiddleBlinking />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS4 />
			</>
		),
		S5: (
			<>
				<OffUp />
				<OrangeMiddleSolid />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS5 />
			</>
		),
		S10: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS10 />
			</>
		),
		S11: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS11 />
			</>
		),
		S12: (
			<>
				<OffUp />
				<OrangeMiddleBlinking />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS12 />
			</>
		),
		S13: (
			<>
				<OffUp />
				<OrangeMiddleSolid />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS13 />
			</>
		),
		SZ: (
			<>
				<OffUp />
				<OffMiddle />
				<RedMiddleSolid />
				<OffMiddle />
				<WhiteDownBlinking />
				<PoleSm />
				<SignalSZ />
			</>
		),
		MS2: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSm />
				<SignalMS2 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSmGOROSemaphore = {
		S1: (
			<>
				<OffUp />
				<OffMiddle />
				<RedMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S4: (
			<>
				<OffUp />
				<OrangeMiddleBlinking />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS4 />
			</>
		),
		S5: (
			<>
				<OffUp />
				<OrangeMiddleSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS5 />
			</>
		),
		S10: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS10 />
			</>
		),
		S11: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS11 />
			</>
		),
		S12: (
			<>
				<OffUp />
				<OrangeMiddleBlinking />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS12 />
			</>
		),
		S13: (
			<>
				<OffUp />
				<OrangeMiddleSolid />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS13 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSmGROWSemaphore = {
		S1: (
			<>
				<OffUp />
				<RedMiddleSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S4: (
			<>
				<OffUp />
				<OffMiddle />
				<OrangeMiddleBlinking />
				<OffDown />
				<PoleSm />
				<SignalS4 />
			</>
		),
		S5: (
			<>
				<OffUp />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS5 />
			</>
		),
		S10: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS10 />
			</>
		),
		S11: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS11 />
			</>
		),
		SZ: (
			<>
				<OffUp />
				<RedMiddleSolid />
				<OffMiddle />
				<WhiteDownBlinking />
				<PoleSm />
				<SignalSZ />
			</>
		),
		MS2: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSm />
				<SignalMS2 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSmOROWSemaphore = {
		S1: (
			<>
				<OffUp />
				<RedMiddleSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S4: (
			<>
				<OrangeUpBlinking />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS4 />
			</>
		),
		S5: (
			<>
				<OrangeUpSolid />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS5 />
			</>
		),
		S12: (
			<>
				<OrangeUpBlinking />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS12 />
			</>
		),
		S13: (
			<>
				<OrangeUpSolid />
				<OffMiddle />
				<OrangeMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS13 />
			</>
		),
		SZ: (
			<>
				<OffUp />
				<RedMiddleSolid />
				<OffMiddle />
				<WhiteDownBlinking />
				<PoleSm />
				<SignalSZ />
			</>
		),
		MS2: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSm />
				<SignalMS2 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSmRGWSemaphore = {
		S1: (
			<>
				<RedUpSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<OffUp />
				<GreenMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<OffUp />
				<GreenMiddleBlinking />
				<OffDown />
				<PoleSm />
				<SignalS3 />
			</>
		),
		SZ: (
			<>
				<RedUpSolid />
				<OffMiddle />
				<WhiteDownBlinking />
				<PoleSm />
				<SignalSZ />
			</>
		),
		MS2: (
			<>
				<OffUp />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSm />
				<SignalMS2 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSmGROSemaphore = {
		S1: (
			<>
				<OffUp />
				<RedMiddleSolid />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S4: (
			<>
				<OffUp />
				<OffMiddle />
				<OrangeDownBlinking />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S5: (
			<>
				<OffUp />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S10: (
			<>
				<GreenUpSolid />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS3 />
			</>
		),
		S11: (
			<>
				<GreenUpBlinking />
				<OffMiddle />
				<OrangeDownSolid />
				<PoleSm />
				<SignalS3 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSm2Semaphore = {
		S1: (
			<>
				<RedUpSolid />
				<OffDown />
				<PoleSm />
				<SignalS1 />
			</>
		),
		S2: (
			<>
				<OffUp />
				<GreenDownSolid />
				<PoleSm />
				<SignalS2 />
			</>
		),
		S3: (
			<>
				<OffUp />
				<GreenDownBlinking />
				<PoleSm />
				<SignalS3 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffDown />
				<PoleSm />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForSpSemaphore = {
		SP1: (
			<>
				<OrangeUpSolid />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSp />
				<SignalSP1 />
			</>
		),
		SP2: (
			<>
				<OffUp />
				<GreenMiddleSolid />
				<WhiteDownSolid />
				<PoleSp />
				<SignalSP2 />
			</>
		),
		SP3: (
			<>
				<OffUp />
				<GreenMiddleBlinking />
				<WhiteDownSolid />
				<PoleSp />
				<SignalSP3 />
			</>
		),
		SP4: (
			<>
				<OrangeUpBlinking />
				<OffMiddle />
				<WhiteDownSolid />
				<PoleSp />
				<SignalSP4 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffMiddle />
				<OffDown />
				<PoleSp />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForToSemaphore = {
		OS1: (
			<>
				<OffUp />
				<OrangeDownSolid />
				<PoleTo />
				<SignalOS1 />
			</>
		),
		OS2: (
			<>
				<GreenUpSolid />
				<OffDown />
				<PoleTo />
				<SignalOS2 />
			</>
		),
		OS3: (
			<>
				<GreenUpBlinking />
				<OffDown />
				<PoleTo />
				<SignalOS3 />
			</>
		),
		OS4: (
			<>
				<OffUp />
				<OrangeDownBlinking />
				<PoleTo />
				<SignalOS4 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffDown />
				<PoleTo />
				<SignalOFF />
			</>
		),
	};

	const signalDefinitionsForTmSemaphore = {
		MS1: (
			<>
				<BlueUpSolid />
				<OffDown />
				<PoleTm />
				<SignalMS1 />
			</>
		),
		MS2: (
			<>
				<OffUp />
				<WhiteDownSolid />
				<PoleTm />
				<SignalMS2 />
			</>
		),
		OFF: (
			<>
				<OffUp />
				<OffDown />
				<PoleTm />
				<SignalOFF />
			</>
		),
	};

	const displaySignals = () => {
		switch (semaphoreType) {
			case semaphoreTypes.Sm:
				return signalDefinitionsForSmSemaphore[signalType];
			case semaphoreTypes.SmGORO:
				return signalDefinitionsForSmGOROSemaphore[signalType];
			case semaphoreTypes.SmGROW:
				return signalDefinitionsForSmGROWSemaphore[signalType];
			case semaphoreTypes.SmOROW:
				return signalDefinitionsForSmOROWSemaphore[signalType];
			case semaphoreTypes.SmGRO:
				return signalDefinitionsForSmGROSemaphore[signalType];
			case semaphoreTypes.SmRGW:
				return signalDefinitionsForSmRGWSemaphore[signalType];
			case semaphoreTypes.SmRG:
				return signalDefinitionsForSm2Semaphore[signalType];
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
		<div
			className={classNames('Semaphore', {
				'Semaphore--selected': selectedSemaphore?.signal === signalType
			})}
			onClick={() => setSignalHandler(signalType)}>
			{displaySignals()}
		</div>
	);
};

Semaphore.propTypes = {
	setSignalHandler: PropTypes.func.isRequired,
	signalType: PropTypes.string.isRequired,
	semaphoreType: PropTypes.string.isRequired,
	selectedSemaphore: semaphoreShape,
};
