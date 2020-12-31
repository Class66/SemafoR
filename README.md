# SemafoR

![Pulpit Image](/images/semaphore.jpg)

## Introduction

This is application for control KLUBA semaphores via Arduino platform.

## Hardware requirements

- Arduino (ex. Arduino UNO)
- One or more PCA9685 board (for semaphores steering)
  > The Arduino has available 6 PWM pins only, so that you can control only one "Sm" semaphore (with 5 chambers). This is why we need to use PCA9685 - the board that has 16 pins. You can combine more than one PCA9685 board in your Arduino circuit. Look at the later example.
- Couple of Semaphores from KLUBA (http://modelarstwo-kluba.pl/)
- Cables to connect all parts together
- Computer with Windows/Mac/Linux

## Software requirements

- NodeJS - to be installed on your computer (https://nodejs.org/en/)
- Arduino IDE - to be installed on your computer (https://www.arduino.cc/en/software)

## What kind of semaphores can be controled by this application

...Sm, (including 5, 4 or 3 chambers with different signal configuration)
Sp ()
To
Tm

## How to create circuit with Arduino and PCA9685 board(s)

- How to connect the PCA9685 board:
http://johnny-five.io/examples/led-PCA9685/

- How to connect more than one PCA9685 board:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## How to make complete circuit with Arduino, PCA9685 and semaphores (example)

...

## The application parts

The application is composed of two separate programs:

- **The steering application** - it's the main program responsible for steering semaphores via Arduino. It's based on Johnny-Five platform. It's Node application.

- **The user interface application** - it's a visual user interface that makes it easier to control semaphores through the browser. It's React application.

## How to install the application :rocket:

1. Install NodeJS (https://nodejs.org/en/)

2. Install Arduino IDE (https://www.arduino.cc/en/software)

3. Connect your Arduino via USB to your computer
   
4. Open Arduino IDE
 
5. Connect your circuit (with Arduino, PCA9685 and semaphores) to the selected USB port
   
6. Using Arduino IDE save to the Arduino file ***SandardFirmataPlus.ino***<br>
(it's located in folder 'Johnny-Five/firmware').<br>
If there is an issue while loading the file:<br>
Select from Arduino IDE top menu 'Tools/Port > COM3' or other COM prepared for the Arduino Uno (if you use this type of Arduino)
        
7. Download this application from this repo by clicking 'Code > Download ZIP" and unzip it

8. In the main application folder, type in console:
```
npm install
```
   
9. Run the application by typing in console:
```
node server
```

## How to run **the steering application** :rocket:

1. Connect your circuit (with Arduino, PCA9685 and semaphores) to the selected USB port,

2. Run the application by typing in console (be sure you are in the application folder):
```
node server
```
(by default at http://localhost:4000)

## How to run **the user interface application** :rocket:

1. Run the application by typing in console (be sure you are in the application folder):
```
npm start
```
 (by default at http://localhost:3000)

> Before run the application, to be able to steering semaphores you need to run **the steering application** as described above.

## How to add a new semaphore definition to the configuration file

All configuration for this application is defined in ```common\semaphoreConfig.js``` file.

> By default the application is prepared for using 3x "Sm" semaphores, 3x "Tm" semaphores and 1x "Sp" semaphore. The current circuit has two PCA9685 boards with defined addresses such as ```0x40``` and ```0x41``` . These addresses are defined in the ```boardPCA9685Addresses``` array in the same configuration file.

To add a new semaphore, firstly, you need to connect it to some PCA9685 board (connected to the Arduino). After than you need to add its definition by modifying two arrays:
1. ```semaphoresLedConfiguration```
2. ```semaphoresGeneralConfiguration```

> These semaphores will be displayed on the screen exactly the same order as defined in these arrays.

For example, if you need to add one "To" semaphore (let's assume it's connected to the second PCA9685 board with address ```0x41```) we just need to add additional objects in two arrays:<br><br>

***CONFIGURATION IN ARRAY ONE:***

1. In the ```semaphoresLedConfiguration``` array just add a new object - for our "To" semaphore it will be:

```javascript
{
  GREEN: defineLedPin(9, boardPCA9685Addresses[1]), // number 9 means pin number 9 on PCA9685 board number 2
  ORANGE: defineLedPin(8, boardPCA9685Addresses[1]), // number 8 means pin number 8 on PCA9685 board number 2
}
```

The GREEN and ORANGE is defined as leds color used in particular semaphore. Because we use "To" semaphore, the semaphore has two possible signals: GREEN and ORANGE.

Our semaphore is connected to the pins with number 9 and 8. Moreover, the pins are located on the second PCA9685 board.

```boardPCA9685Addresses[1]``` - means that we use second PCA9685 board here.<br>
(0 - for first board, 1 - for second board and so on...)<br>
All these boards must be defined in ```boardPCA9685Addresses``` array.<br><br>

***CONFIGURATION IN ARRAY TWO:***

1. In the ```semaphoresGeneralConfiguration``` array just add new object - for our "To" semaphore it will be:

```javascript
{
  type: semaphoreTypes.To, // defines semaphore type (here we use "To" semaphore)
  number: 1, // defines another number for the same type of the semaphore in the array (here is just 1 value because we've just connected only one "To" semaphore),
  signal: signals.OS1, // defines default signal for this semaphore after application start (here OS1 as default signal for "To" semaphore).
}
```

<br>

***And that's it!***  
Now, you have to reload all application and everything should work fine :smile:
<br><br>

## How to define semaphores in the configuration file

There are 10 types of semaphores in the application that correspons to the same semaphores produced by KLUBA.
<br><br>

Examples of KLUBA semaphores object definiton:
> You can copy it to your configuration.<br>
> All you need to change there pin number and board number.

<br>

- **Sm**<br>
It's 5 chambers semaphore with leds: GREEN, ORANGE, RED, ORANGE, WHITE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]), // pin number 0, connected to PCA9685 board number 1
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]), // pin number 1, connected to PCA9685 board number 1
  RED: defineLedPin(2, boardPCA9685Addresses[0]), // pin number 2, connected to PCA9685 board number 1
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]), // pin number 3, connected to PCA9685 board number 1
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]), // pin number 4, connected to PCA9685 board number 1
}
```
```javascript
{
  type: semaphoreTypes.SmGORO, // type of the semaphore
  number: 1, // next number of the semaphore type
  signal: signals.S1, // default signal of the semaphore
}
```
<br>

- **SmGORO**<br>
It's 4 chambers semaphore with leds: GREEN, ORANGE, RED, ORANGE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.SmGORO,
  number: 1,
  signal: signals.S1,
}
```
<br>

- **SmGROW**<br>
It's 4 chambers semaphore with leds: GREEN, RED, ORANGE, WHITE<br>
> <br>**IMPORTANT!** ORANGE_ONE and ORANGE_TWO must have the same pin number as there is only one ORANGE led in this semaphore<br><br>
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(1, boardPCA9685Addresses[0]), // must be the same pin number as ORANGE_ONE !!!
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.SmGROW,
  number: 1,
  signal: signals.S1,
}
```
<br>

- **SmOROW**<br>
It's 4 chambers semaphore with leds: ORANGE, RED, ORANGE, WHITE
```javascript
{
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.SmOROW,
  number: 1,
  signal: signals.S1,
}
```
<br>


- **SmRGW**<br>
It's 3 chambers semaphore with leds: RED, GREEN, WHITE
```javascript
{
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.SmGROW,
  number: 1,
  signal: signals.S1,
}
```
<br>

- **SmGRO**<br>
It's 3 chambers semaphore with leds: GREEN, RED, ORANGE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(1, boardPCA9685Addresses[0]), // must be the same pin number as ORANGE_ONE !!!
}
```
```javascript
{
  type: semaphoreTypes.SmGRO,
  number: 1,
  signal: signals.S1,
}
```
<br>

- **SmRG**<br>
It's 2 chambers semaphore with leds: RED, GREEN, WHITE
```javascript
{
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.SmRG,
  number: 1,
  signal: signals.S1,
}
```
<br>

...
