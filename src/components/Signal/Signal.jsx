import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import './Signal.scss';

export const Signal = ({ isMiddle, image }) => (
    <img
        alt="chamber"
        className={classNames({ 'Signal-middle': isMiddle })}
        src={image} />
);

Signal.propTypes = {
    isMiddle: PropTypes.bool,
    image: PropTypes.string.isRequired,
};

Signal.defaultProps = {
    isMiddle: false,
};
