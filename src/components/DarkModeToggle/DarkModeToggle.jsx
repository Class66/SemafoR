import React, { useState } from 'react';
import Toggle from 'react-toggle';

import './DarkModeToggle.scss';
import '../../scss/_colors.scss';

export const DarkModeToggle = () => {
    const [isDark, setIsDark] = useState(false);

    const setColor = ({ color }) => {
        document.documentElement.style.setProperty('--background-color', color);
    };

    isDark ? setColor({ color: '#000000' }) : setColor({ color: '#ffffff' });

    return (
        <Toggle
            checked={isDark}
            onChange={({ target }) => setIsDark(target.checked)}
            icons={{ checked: '☀️', unchecked: '🌙' }}
            aria-label="Dark mode toggle"
        />
    );
};
