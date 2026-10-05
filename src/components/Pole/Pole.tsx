import { Signal } from '../Signal/Signal';
import { semaphoreTypes } from '../../enums/semaphoreTypes';
import { signalLights } from '../../enums/signalLights';

type PoleProps = {
  semaphoreType: string;
};

export const Pole = ({ semaphoreType }: PoleProps) => {
  const displayPole = () => {
    switch (semaphoreType) {
      case semaphoreTypes.Sm:
        return signalLights.POLE;
      case semaphoreTypes.Sp:
        return signalLights.POLE_SP;
      case semaphoreTypes.To:
        return signalLights.POLE_TO;
      case semaphoreTypes.Tm:
        return signalLights.POLE_TM;
      default:
        return signalLights.POLE;
    }
  };

  return <Signal image={displayPole()} />;
};
