import './signal-label.css';

type SignalLabelProps = {
  signal: string;
};

export const SignalLabel = ({ signal }: SignalLabelProps) => (
  <span className="SignalLabel">{signal}</span>
);
