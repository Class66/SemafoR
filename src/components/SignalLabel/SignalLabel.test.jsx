import React from 'react';
import { shallow } from 'enzyme';

import { SignalLabel } from '../SignalLabel/SignalLabel';
import { signals } from '../../enums/signals.enum';

describe('SignalLabel', () => {

    it('renders button correctly', () => {
        const wrapper = shallow(
            <SignalLabel signal={signals.S1} />
        );
  
        const content = wrapper.find('.SignalLabel').text().includes(signals.S1);

        expect(content).toBe(true);
    });

});
