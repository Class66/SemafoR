import styles from './signal-label.module.css'
import type { SignalName } from '../../types/semaphore'

type SignalLabelProps = {
  signal: SignalName
}

export function SignalLabel({ signal }: SignalLabelProps) {
  return <span className={styles.signalLabel}>{signal}</span>
}
