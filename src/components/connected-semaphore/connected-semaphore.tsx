import classNames from 'classnames'

import { Semaphore } from '../semaphore/semaphore'
import type { SemaphoreData } from '../../types/semaphore'

import styles from './connected-semaphore.module.css'

type Props = {
  setSemaphoreHandler: () => void
  semaphore: SemaphoreData
  selectedSemaphore?: SemaphoreData
}

export function ConnectedSemaphore({
  setSemaphoreHandler,
  semaphore,
  selectedSemaphore
}: Props) {
  return (
    <div
      onClick={setSemaphoreHandler}
      className={classNames(styles.connectedSemaphore, {
        [styles.connectedSemaphoreSelected]:
          semaphore.type === selectedSemaphore?.type &&
          semaphore.number === selectedSemaphore?.number
      })}
    >
      <Semaphore
        setSignalHandler={() => {}}
        signalType={semaphore.signal}
        semaphoreType={semaphore.type}
        className={styles.semaphore}
      />
      <button>
        {semaphore.label ?? `${semaphore.type}${semaphore.number}`}
      </button>
    </div>
  )
}
