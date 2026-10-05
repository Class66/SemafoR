import classNames from 'classnames'

import styles from './signal.module.css'

type SignalProps = {
  isMiddle?: boolean
  image: string
}

export function Signal({ isMiddle = false, image }: SignalProps) {
  return (
    <img
      alt="chamber"
      className={classNames(styles.signal, {
        [styles.signalMiddle]: isMiddle
      })}
      src={image}
    />
  )
}
