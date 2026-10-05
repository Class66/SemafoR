import { signals } from '../enums/signals';
import { semaphoreTypes } from '../enums/semaphore-types';

type SignalName = (typeof signals)[keyof typeof signals];
type SemaphoreType = (typeof semaphoreTypes)[keyof typeof semaphoreTypes];

export declare const semaphoreSteeringPort: number;
export declare const semaphoreSteeringUri: string;
export declare const boardPCA9685Addresses: number[];
export declare function semaphoresLedConfiguration<T>(
  defineLedPin: (pin: number, address: number) => T
): Record<string, T>[];
export declare const semaphoresGeneralConfiguration: {
  type: SemaphoreType;
  number: number;
  signal: SignalName;
  label?: string;
}[];
