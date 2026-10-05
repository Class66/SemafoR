import classNames from 'classnames'

import styles from './signal.module.css'

type SignalProps = {
  isMiddle?: boolean
  image: string
}

export const Signal = ({ isMiddle = false, image }: SignalProps) => (
  <img
    alt="chamber"
    className={classNames(styles.signal, {
      [styles.signalMiddle]: isMiddle
    })}
    src={image}
  />
)
