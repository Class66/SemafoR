import styles from './signal-label.module.css';

type SignalLabelProps = {
  signal: string;
};

export const SignalLabel = ({ signal }: SignalLabelProps) => (
  <span className={styles.signalLabel}>{signal}</span>
);
