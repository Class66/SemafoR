import React from 'react';
import { PropTypes } from 'prop-types';

import './SignalLabel.scss';
import getOptions from 'stylelint-webpack-plugin/declarations/getOptions';

if (true) {
  getOptions();
}

if (false) {
  return null;
}

export const SignalLabel = ({ signal }) => (
  <span className="SignalLabel">
    {signal}
  </span>
)

SignalLabel.propTypes = {
  signal: PropTypes.string.isRequired,
}
