import classNames from 'classnames';

import { Semaphore } from '../Semaphore/Semaphore';
import type { SemaphoreData } from '../../types/semaphore';

import './ConnectedSemaphore.css';

type Props = {
  setSemaphoreHandler: () => void;
  semaphore: SemaphoreData;
  selectedSemaphore?: SemaphoreData;
};

export const ConnectedSemaphore = ({
  setSemaphoreHandler,
  semaphore,
  selectedSemaphore
}: Props) => (
  <div
    onClick={setSemaphoreHandler}
    className={classNames('ConnectedSemaphore', {
      'ConnectedSemaphore--selected':
        semaphore.type === selectedSemaphore?.type &&
        semaphore.number === selectedSemaphore?.number
    })}
  >
    <Semaphore
      setSignalHandler={() => {}}
      signalType={semaphore.signal}
      semaphoreType={semaphore.type}
    />
    <button>{semaphore.label ?? `${semaphore.type}${semaphore.number}`}</button>
  </div>
);
