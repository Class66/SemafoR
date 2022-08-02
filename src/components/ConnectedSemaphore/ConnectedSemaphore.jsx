import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import { Semaphore } from '../Semaphore/Semaphore';
import { semaphoreShape } from './../../types/semaphore.type';

import './ConnectedSemaphore.scss';

export const ConnectedSemaphore = ({
    setSemaphoreHandler,
    semaphore,
    selectedSemaphore,
}) => (
    <div
        onClick={setSemaphoreHandler}
        className={classNames('ConnectedSemaphore', {
            'ConnectedSemaphore--selected':
                semaphore.type === selectedSemaphore.type &&
                semaphore.number === selectedSemaphore.number,
        })}
    >
        <Semaphore
            setSignalHandler={() => {}}
            signalType={semaphore.signal}
            semaphoreType={semaphore.type}
        />
        <button>
            {semaphore.hasOwnProperty('label')
                ? semaphore.label
                : `${semaphore.type}${semaphore.number}`}
        </button>
    </div>
);

ConnectedSemaphore.propTypes = {
    setSemaphoreHandler: PropTypes.func.isRequired,
    semaphore: semaphoreShape,
    selectedSemaphore: semaphoreShape,
};
