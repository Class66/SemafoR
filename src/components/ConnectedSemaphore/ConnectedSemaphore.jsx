import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import { Semaphore } from '../Semaphore/Semaphore';

import './ConnectedSemaphore.scss';

export const ConnectedSemaphore = ({
	setSemaphoreHandler,
	semaphore, selectedSemaphore
}) => (
	<div
		onClick={setSemaphoreHandler}
		className={classNames('ConnectedSemaphore', {
			'ConnectedSemaphore--selected':
				semaphore.type === selectedSemaphore.type
				&& semaphore.number === selectedSemaphore.number
		})}>
		<Semaphore
			setSignalHandler={() => { }}
			signalType={semaphore.signal}
			semaphoreType={semaphore.type} />
		<button>
			{semaphore.hasOwnProperty('label') ?
				semaphore.label : `${semaphore.type}${semaphore.number}`}
		</button>
	</div>
);

const semaphoreProp = PropTypes.shape({
	type: PropTypes.string.isRequired,
	number: PropTypes.number.isRequired,
	signal: PropTypes.string.isRequired,
}).isRequired;

ConnectedSemaphore.propTypes = {
	setSemaphoreHandler: PropTypes.func.isRequired,
	semaphore: semaphoreProp,
	selectedSemaphore: semaphoreProp,
};
