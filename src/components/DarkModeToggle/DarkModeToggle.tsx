import { useEffect, useState } from 'react';

import './DarkModeToggle.css';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--background-color',
      isDark ? 'var(--black)' : 'var(--white)'
    );
  }, [isDark]);

  return (
    <label className="theme-toggle">
      <input
        className="theme-toggle__input"
        type="checkbox"
        checked={isDark}
        onChange={event => setIsDark(event.currentTarget.checked)}
        aria-label="Dark mode toggle"
      />
      <span className="theme-toggle__track" aria-hidden="true">
        <span className="theme-toggle__icon theme-toggle__icon--checked">
          ☀️
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--unchecked">
          🌙
        </span>
        <span className="theme-toggle__thumb" />
      </span>
    </label>
  );
};
