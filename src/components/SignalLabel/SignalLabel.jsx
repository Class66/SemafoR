import React from 'react';
import { PropTypes } from 'prop-types';

import './SignalLabel.scss';

export const SignalLabel = ({ signal }) => (
  <span className="SignalLabel">
    {signal}
  </span>
)

SignalLabel.propTypes = {
  signal: PropTypes.string.isRequired,
}
