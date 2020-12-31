import { signals } from '../enums/signals.enum';
import { semaphoreTypes } from '../enums/semaphoreTypes.enum';

export const semaphoreSteeringPort = 4000;
export const semaphoreSteeringUri = `http://localhost:${semaphoreSteeringPort}`;

/////////////////////////////////////////////////////
/// ADDRESSES OF EACH PCA9685 BOARD
/////////////////////////////////////////////////////

export const boardPCA9685Addresses = [0x40, 0x41];

/////////////////////////////////////////////////////
/// LEDS PIN NUMBERS OF EACH SEMAPHORE
/////////////////////////////////////////////////////

export const semaphoresLedConfiguration = (defineLedPin) => ([{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]),
}, {
  GREEN: defineLedPin(5, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(6, boardPCA9685Addresses[0]),
  RED: defineLedPin(7, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(8, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(9, boardPCA9685Addresses[0]),
}, {
  GREEN: defineLedPin(10, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(11, boardPCA9685Addresses[0]),
  RED: defineLedPin(12, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(13, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(14, boardPCA9685Addresses[0]),
}, {
  WHITE: defineLedPin(0, boardPCA9685Addresses[1]),
  BLUE: defineLedPin(1, boardPCA9685Addresses[1]),
}, {
  WHITE: defineLedPin(2, boardPCA9685Addresses[1]),
  BLUE: defineLedPin(3, boardPCA9685Addresses[1]),
}, {
  WHITE: defineLedPin(4, boardPCA9685Addresses[1]),
  BLUE: defineLedPin(5, boardPCA9685Addresses[1]),
}, {
  ORANGE: defineLedPin(8, boardPCA9685Addresses[1]),
  GREEN: defineLedPin(9, boardPCA9685Addresses[1]),
  WHITE: defineLedPin(10, boardPCA9685Addresses[1]),
}]);

/////////////////////////////////////////////////////
/// DEFAULT SIGNALS OF EACH SEMAPHORE
//  NOTICE: The order must be the same as in semaphoresLedConfiguration !!!
/////////////////////////////////////////////////////

export const semaphoresGeneralConfiguration = [{
  type: semaphoreTypes.Sm, // type of the semaphore (all types are defined in semaphoreTypes)
  number: 1, // next number of this particular semaphore type (must be unique for this type)
  signal: signals.S1, // default signal of the semaphore (it will be set on starting the application)
}, {
  type: semaphoreTypes.Sm,
  number: 2,
  signal: signals.S1,
}, {
  type: semaphoreTypes.Sm,
  number: 3,
  signal: signals.S1,
}, {
  type: semaphoreTypes.Tm,
  number: 1,
  signal: signals.MS1,
}, {
  type: semaphoreTypes.Tm,
  number: 2,
  signal: signals.MS1,
}, {
  type: semaphoreTypes.Tm,
  number: 3,
  signal: signals.MS1,
}, {
  type: semaphoreTypes.Sp,
  number: 1,
  signal: signals.SP1,
}];
