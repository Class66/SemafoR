import { PropTypes } from 'prop-types';

export const semaphoreShape = PropTypes.shape({
  type: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  signal: PropTypes.string.isRequired,
}).isRequired;
