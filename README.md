# SemafoR

![Pulpit Image](/images/semaphore.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![GitHub release](https://img.shields.io/github/v/release/Class66/SemafoR)](https://GitHub.com/Class66/SemafoR/releases/)

<a href="https://github.com/Class66/SemafoR/blob/master/README_PL.md"><code>Polska wersja instrukcji **TUTAJ**</code></a><br>

This is application for steering KLUBA semaphores using Arduino platform.<br>

You can control all types of KLUBA semaphores such as:

- Sm (including 5, 4 or 3 chambers with different signal configuration)
- Sp (3 chambers) 
- To (2 chambers)
- Tm (2 chambers)

Reference to KLUBA semaphores here:<br>
http://modelarstwo-kluba.pl/h0/sygnalizatory-swietlne-h0/sygnalizatory-z-komora-na-slupie-h0/

> As Arduino supplies 5V to semaphores, theirs LED brightness is lower than if they were powered with 12V. The advantage of this is that the brightness is very similar as in real semaphore.

## Contents

  - [Hardware requirements](#hardware-requirements)
  - [Software requirements](#software-requirements)
  - [How to make circuit with Arduino, PCA9685 and semaphores](#how-to-make-circuit-with-arduino-pca9685-and-semaphores)
  - [How to install the application](#how-to-install-the-application)
  - [How to run the application](#how-to-run-the-application)
  - [How to add a new semaphore definition to the configuration file](#how-to-add-a-new-semaphore-definition-to-the-configuration-file)
  - [How to define semaphores in the configuration file](#how-to-define-semaphores-in-the-configuration-file)
  - [Predefined configurations](#predefined-configurations)
  - [License and copyrights](#license-and-copyrights)

## Hardware requirements

- Arduino (ex. Arduino UNO)
- One or more PCA9685 board (for semaphores steering)
  > The Arduino board has available 6 PWM pins only, so that you can control only one "Sm" semaphore with 5 chambers. If you want to connect there more semaphores you will need to use PCA9685 (that board that has 16 pins). You can combine more than one PCA9685 board in your Arduino circuit.
- Couple of Semaphores from KLUBA (http://modelarstwo-kluba.pl/)
- Cables to connect all parts together
- Computer with Windows/Mac/Linux operating system

## Software requirements

- NodeJS - to be installed on your computer (https://nodejs.org/en/)
- Arduino IDE - to be installed on your computer (https://www.arduino.cc/en/software)

## How to make circuit with Arduino, PCA9685 and semaphores

This is example with 3x PCA9685 boards:

![Pulpit Image](/images/adafruit-pca9685-circuit.jpg)

![Pulpit Image](/images/real-circuit.jpg)

<br>

[![SemafoR Live](/images/youtube.png)](https://youtu.be/MvsVsbWXQEk)

Other reference:<br>

- How to connect the PCA9685 board:
http://johnny-five.io/examples/led-PCA9685/

- How to connect more than one PCA9685 board:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## How to install the application

1. Install NodeJS (https://nodejs.org/en/)

2. Install Arduino IDE application (https://www.arduino.cc/en/software)

3. Connect your Arduino via USB to your computer
   
4. Open Arduino IDE application
 
5. Using the Arduino IDE write to the Arduino memory program from a file ***StandardFirmataPlus.ino***:
- select from Arduino IDE option "Files/Open..." and select the file ***StandardFirmataPlus.ino***.
 (it's located in folder 'Johnny-Five/firmware/StandardFirmataPlus').<br>
- then, select from Arduino IDE option "Sketch/Save" to save the program in the Arduino memory

![Writing to Arduino memory](/images/arduino.gif)
> If there is an issue while loading the file, chceck if proper port is selected:<br>
> Select from Arduino IDE option: 'Tools/Port > COM3' or other COM prepared for the Arduino Uno (if you use this type of Arduino)
        
6. Download this application by clicking green "Code" button at the top of this page and next clicking "Download ZIP" option

7. Unzip the application to some folder

8. To install all needed packages for this application, open the main application folder and<br>
click ```install.bat``` file (NOTICE: the file works only under Windows)<br>
**OR**<br>
open a console window in this folder and run command:
```
npm install
```

## How to run the application

1. Connect your circuit (Arduino, PCA9685 and conected semaphores) to the selected USB port
   
2. Run the application by clicking ```start-steering.bat``` and next ```start-ui.bat``` (NOTICE: the file works only under Windows)<br>
   **OR**<br>
   open a console window in this folder and run commands:<br>
```
node server
```
```
npm start
```

The application is composed of two separate programs, so you can run them separately too:

- **The steering application** - it's the main program responsible for steering semaphores via Arduino. It's based on Johnny-Five platform.<br>
  > Before run: Connect your circuit (Arduino, PCA9685 and conected semaphores) to the selected USB port.

  Can be run by command:
  ```
  node server
  ```
  (by default it will be started on http://localhost:4000)

- **The user interface application** - it's a visual user interface that makes it easier to control semaphores through the browser.<br>
  > Before run the user interface application, you must run **the steering application** as described above.
  > Otherwise, you will not be able to steering connected semaphores.

  Can be run by command:
  ```
  npm start
  ```
  (by default it will be started on http://localhost:3000)

![Pulpit Image](/images/ui-interface-screenshot.jpg)

## How to add a new semaphore definition to the configuration file

All configuration for this application is defined in ```common\semaphoreConfig.js``` file.

> By default the application is prepared for using 3x "Sm" semaphores, 3x "Tm" semaphores and 1x "Sp" semaphore. The current circuit has two PCA9685 boards with defined addresses such as ```0x40``` and ```0x41``` . These addresses are defined in the ```boardPCA9685Addresses``` array in the same configuration file.

To add a new semaphore, firstly, you need to connect it to some PCA9685 board (connected to the Arduino). After than you need to add its definition by modifying two arrays:
1. ```semaphoresLedConfiguration```
2. ```semaphoresGeneralConfiguration```

> These semaphores will be displayed on the screen exactly the same order as defined in these arrays.

For example, if you need to add one "To" semaphore (let's assume it's connected to the second PCA9685 board with address ```0x41```) we just need to add additional objects in two arrays:<br><br>

***CONFIGURATION IN ARRAY ONE:***

1. In the ```semaphoresLedConfiguration``` array just add a new object. For our "To" semaphore it will be:

```javascript
{
  GREEN: defineLedPin(9, boardPCA9685Addresses[1]), // 9 means pin number 9 on PCA9685 number 2
  ORANGE: defineLedPin(8, boardPCA9685Addresses[1]), // 8 means pin number 8 on PCA9685 number 2
}
```

The GREEN and ORANGE is defined as leds color used in particular semaphore. Because we use "To" semaphore, the semaphore has two possible signals: GREEN and ORANGE. Our semaphore is connected to the pins with number 9 and 8. Moreover, the pins are located on the second PCA9685 board.

```boardPCA9685Addresses[1]``` - means that we use second PCA9685 board here.<br>
(0 - for first board, 1 - for second board and so on...)<br>
All these boards must be defined in ```boardPCA9685Addresses``` array.<br><br>

***CONFIGURATION IN ARRAY TWO:***

1. In the ```semaphoresGeneralConfiguration``` array just add new object. For our "To" semaphore it will be:

```javascript
{
  type: semaphoreTypes.To, // defines semaphore type (here we use "To" semaphore)
  number: 1, // defines another number for the same type of the semaphore in the array
  // (here is 1 because we've just connected only one "To" semaphore)
  signal: signals.OS1, // defines default signal for this semaphore after application start
  // (here is OS1 as default signal for "To" semaphore)
  label: 'To1', // it's NOT REQUIRED but defines a name of the semaphore, visible on the UI interface
  // if it's not defined, the type + number will be displayed
}
```
<br>

***And that's all!*** :rocket: Now, you have to reload all application and everything should work fine :smile:

## How to define semaphores in the configuration file

There are 10 types of semaphores in the application that correspons to the semaphores produced by KLUBA.

Examples of KLUBA semaphores object definiton:
> You can copy it to your configuration file called ```semaphoreConfig.js```.<br>
> Remember to change pin numbers and board numbers.<br>
> Optionally you can add 'label' property to define your own semaphore name.

- **Sm**<br>
It's 5 chambers semaphore with leds: GREEN, ORANGE, RED, ORANGE, WHITE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]), // pin number 0, connected to PCA9685 number 1
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]), // pin number 1, connected to PCA9685 number 1
  RED: defineLedPin(2, boardPCA9685Addresses[0]), // pin number 2, connected to PCA9685 number 1
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]), // pin number 3, connected to PCA9685 number 1
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]), // pin number 4, connected to PCA9685 number 1
}
```
```javascript
{
  type: semaphoreTypes.SmGORO, // type of the semaphore (all types are defined in semaphoreTypes)
  number: 1, // next number of this particular semaphore type (must be unique for this type)
  signal: signals.S1, // default signal of the semaphore (it will be set on starting the application)
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
> **IMPORTANT!** ORANGE_ONE and ORANGE_TWO must have the same pin number as there is only one ORANGE led in this semaphore
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
It's 2 chambers semaphore with leds: RED, GREEN
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

- **Sp**<br>
It's 3 chambers semaphore with leds: RED, GREEN, WHITE
```javascript
{
  ORANGE: defineLedPin(0, boardPCA9685Addresses[0]),
  GREEN: defineLedPin(1, boardPCA9685Addresses[0]),
  WHITE: defineLedPin(2, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.Sp,
  number: 1,
  signal: signals.SP1,
}
```
<br>

- **To**<br>
It's 2 chambers semaphore with leds: BLUE, WHITE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  ORANGE: defineLedPin(1, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.To,
  number: 1,
  signal: signals.OS1,
}
```
<br>

- **Tm**<br>
It's 2 chambers semaphore with leds: BLUE, WHITE
```javascript
{
  WHITE: defineLedPin(0, boardPCA9685Addresses[0]),
  BLUE: defineLedPin(1, boardPCA9685Addresses[0]),
}
```
```javascript
{
  type: semaphoreTypes.Tm,
  number: 1,
  signal: signals.MS1,
}
```

## Predefined configurations

There are two predefined configurations you can find in folder ```common\predefined```.<br>
If you want to use one of them just change the filename to ```semaphoreConfig.js``` and replace the original file in ```common``` folder.<br>
**Remember to restart the whole application!**

> These configuration are just examples so you can realy on them while building your own config file.

## License and copyrights

Copyright (c) Marcin Gierczak

Licensed under the MIT license: https://github.com/Class66/SemafoR/blob/master/LICENSE
