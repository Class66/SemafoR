import classNames from 'classnames';

import './signal.css';

type SignalProps = {
  isMiddle?: boolean;
  image: string;
};

export const Signal = ({ isMiddle = false, image }: SignalProps) => (
  <img
    alt="chamber"
    className={classNames({ 'Signal-middle': isMiddle })}
    src={image}
  />
);
