import { signals } from '../enums/signals.enum';
import { semaphoreTypes } from '../enums/semaphoreTypes.enum';

export const SEMAPHORE_STEERING_PORT = 4000;
export const semaphoreSteeringUri = `http://localhost:${SEMAPHORE_STEERING_PORT}`;

/////////////////////////////////////////////////////
/// ADDRESSES OF EACH PCA9685 BOARD
/////////////////////////////////////////////////////

export const boardPCA9685Addresses = [0x40];

/////////////////////////////////////////////////////
/// LEDS PIN NUMBERS OF EACH SEMAPHORE
/////////////////////////////////////////////////////

export const semaphoresLedConfiguration = defineLedPin => [
    {
        GREEN: defineLedPin(0, boardPCA9685Addresses[0]), // first PCA9685 board (address 0x40 as defined above)
        RED: defineLedPin(1, boardPCA9685Addresses[0]),
        ORANGE_ONE: defineLedPin(2, boardPCA9685Addresses[0]),
        ORANGE_TWO: defineLedPin(2, boardPCA9685Addresses[0]), // must be the same pin number as ORANGE_ONE !!!
        WHITE: defineLedPin(3, boardPCA9685Addresses[0]),
    },
    {
        RED: defineLedPin(4, boardPCA9685Addresses[0]),
        GREEN: defineLedPin(5, boardPCA9685Addresses[0]),
    },
    {
        WHITE: defineLedPin(6, boardPCA9685Addresses[0]),
        BLUE: defineLedPin(7, boardPCA9685Addresses[0]),
    },
    {
        GREEN: defineLedPin(8, boardPCA9685Addresses[0]),
        ORANGE: defineLedPin(9, boardPCA9685Addresses[0]),
    },
];

/////////////////////////////////////////////////////
/// DEFAULT SIGNALS OF EACH SEMAPHORE
//  NOTICE: The order must be the same as in semaphoresLedConfiguration !!!
/////////////////////////////////////////////////////

export const semaphoresGeneralConfiguration = [
    {
        type: semaphoreTypes.SmGROW,
        number: 1,
        signal: signals.S1,
        label: 'Sm1',
    },
    {
        type: semaphoreTypes.SmRG,
        number: 1,
        signal: signals.S1,
        label: 'Sm2',
    },
    {
        type: semaphoreTypes.Tm,
        number: 1,
        signal: signals.MS1,
        label: 'Tm1',
    },
    {
        type: semaphoreTypes.To,
        number: 1,
        signal: signals.OS1,
        label: 'To1',
    },
];
