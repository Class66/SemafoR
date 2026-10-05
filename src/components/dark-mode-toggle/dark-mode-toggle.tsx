import { useEffect, useState } from 'react'

import styles from './dark-mode-toggle.module.css'

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--background-color',
      isDark ? 'var(--black)' : 'var(--white)'
    )
  }, [isDark])

  return (
    <label className={styles.themeToggle}>
      <input
        className={styles.themeToggleInput}
        type="checkbox"
        checked={isDark}
        onChange={event => setIsDark(event.currentTarget.checked)}
        aria-label="Dark mode toggle"
      />
      <span className={styles.themeToggleTrack} aria-hidden="true">
        <span
          className={`${styles.themeToggleIcon} ${styles.themeToggleIconChecked}`}
        >
          ☀️
        </span>
        <span
          className={`${styles.themeToggleIcon} ${styles.themeToggleIconUnchecked}`}
        >
          🌙
        </span>
        <span className={styles.themeToggleThumb} />
      </span>
    </label>
  )
}
