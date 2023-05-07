import { PropTypes } from 'prop-types';

// import { semaphoreTypes } from '../../enums/semaphoreTypes.enum'; // spike
// import { signalLights } from '../../enums/signalLights.enum';

export const DarkMode = ({ semaphoreType }) => {
    const displayPole = () => {
        switch (semaphoreType) {
            case semaphoreTypes.Sm:
                return signalLights.POLE;
            case semaphoreTypes.Sp:
                return signalLights.POLE_SP;
            case semaphoreTypes.To:
                return signalLights.POLE_TO;
            case semaphoreTypes.Tm:
                return signalLights.POLE_TM;
            default:
                return signalLights.POLE;
        }
    };

    return <Signal image={displayPole()} />;
};

DarkMode.propTypes = {
    semaphoreType: PropTypes.string.isRequired,
};
