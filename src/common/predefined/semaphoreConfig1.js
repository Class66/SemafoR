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
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]), // first PCA9685 board (address 0x40 as defined above)
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]),
}, {
  GREEN: defineLedPin(4, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(5, boardPCA9685Addresses[0]),
  RED: defineLedPin(6, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(7, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(8, boardPCA9685Addresses[0]),
}, {
  RED: defineLedPin(9, boardPCA9685Addresses[0]),
  GREEN: defineLedPin(10, boardPCA9685Addresses[0]),
}, {
  WHITE: defineLedPin(11, boardPCA9685Addresses[0]),
  BLUE: defineLedPin(12, boardPCA9685Addresses[0]),
}, {
  WHITE: defineLedPin(13, boardPCA9685Addresses[0]),
  BLUE: defineLedPin(14, boardPCA9685Addresses[0]),
},{
  ORANGE: defineLedPin(0, boardPCA9685Addresses[1]), // second PCA9685 board (address 0x41 as defined above)
  GREEN: defineLedPin(1, boardPCA9685Addresses[1]),
  WHITE: defineLedPin(2, boardPCA9685Addresses[1]),
},{
  GREEN: defineLedPin(3, boardPCA9685Addresses[1]),
  ORANGE: defineLedPin(4, boardPCA9685Addresses[1]),
}]);

/////////////////////////////////////////////////////
/// DEFAULT SIGNALS OF EACH SEMAPHORE
//  NOTICE: The order must be the same as in semaphoresLedConfiguration !!!
/////////////////////////////////////////////////////

export const semaphoresGeneralConfiguration = [{
  type: semaphoreTypes.SmGORO,
  number: 1,
  signal: signals.S1,
  label: 'Sm1',
}, {
  type: semaphoreTypes.Sm,
  number: 1,
  signal: signals.S1,
  label: 'Sm2',
}, {
  type: semaphoreTypes.SmRG,
  number: 1,
  signal: signals.S1,
  label: 'Sm3',
}, {
  type: semaphoreTypes.Tm,
  number: 1,
  signal: signals.MS1,
  label: 'Tm1',
}, {
  type: semaphoreTypes.Tm,
  number: 2,
  signal: signals.MS1,
  label: 'Tm2',
}, {
  type: semaphoreTypes.Sp,
  number: 1,
  signal: signals.SP1,
  label: 'Sp1',
}, {
  type: semaphoreTypes.To,
  number: 1,
  signal: signals.OS1,
  label: 'To1',
}];
