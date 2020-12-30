# SemafoR

![Pulpit Image](/images/semaphore.jpg)

## Introduction

This is application for control KLUBA semaphores via Arduino platform.

## Hardware requirements

- Arduino (ex. Arduino UNO)
- One or more PCA9685 board (for PWM semaphores steering)
- Couple of Semaphores from KLUBA (http://modelarstwo-kluba.pl/)
- Cables to connect all parts together
- Computer with Windows/Mac/Linux OS

## Software requirements

- NodeJS - to be installed on your computer (https://nodejs.org/en/)

## How to create circuit with Arduino and PCA9685 board(s)

- How to connect the PCA9685 board:
http://johnny-five.io/examples/led-PCA9685/

- How to connect more than one PCA9685 board:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## The application parts

The application is composed of two separate programs:

- **The steering application** - it's the main program responsible for steering semaphores via Arduino. It's based on Johnny-Five platform. It's Node application.

- **The user interface application** - it's a visual user interface that makes it easier to control semaphores through the browser. It's React application.

## How to run **the steering application** for the first time :rocket:

1. Install NodeJS - depends on your platform (Windows/Mac/Linux) install proper version (https://nodejs.org/en/)

2. Install Arduino IDE - (https://www.arduino.cc/en/software)

3. Connect your Arduino via USB to your computer
   
4. Open Arduino IDE
 
5. Connect your circuit (with Arduino, PCA9685 and semaphores) to the selected USB port
   
6. Using Arduino IDE load to the Arduino a file ***SandardFirmataPlus.ino***  
(it's located in folder 'Johnny-Five/firmware').  
If there is an issue while loading the file:  
Select from Arduino IDE top menu 'Tools/Port > COM3' or other COM prepared for the Arduino Uno (if you use this type of Arduino)
        
7. Download this application from this repo by clicking 'Code > Download ZIP" and unzip it

8. In the main application folder, type in console:  
```npm install```
   
9. Run the application by typing in console:  
```node server```

## How to run **the steering application** for the next time :rocket:

1. Connect your circuit (with Arduino, PCA9685 and semaphores) to the selected USB port,

2. Run the application by typing in console (be sure you are in the application folder):  
```node server```  
(by default http://localhost:4000)

## How to run **the user interface application** :rocket:

1. Run the application by typing in console (be sure you are in the application folder):  
```npm start```  
 (by default http://localhost:3000)

***NOTE***: Before run the application, to be able to steering semaphores you need to run **the steering application** as described above.

## Adding new semaphores

All configuration for this application is defined in ```common\semaphoreConfig.js``` file.

***NOTE***: By default the application is prepared for using 3 "Sm" semaphores, 3 "Tm" semaphores and 1 "Sp" semaphore. The current circuit has two PCA9685 boards with defined addresses such as ```0x40``` and ```0x41```. These addresses are defined in the ```boardPCA9685Addresses``` array in the same configuration file.

To add a new semaphore, firstly, you need to connect it to the Arduino circuit. After than you need to add them by modifying two arrays:
1. ```semaphoresLedConfiguration```
2. ```semaphoresGeneralConfiguration```

(The semaphores will be displayed on the screen exactly the same order as defined in these arrays.)

For example, if we need to add one "To" semaphore (let's assume it's connected to the second PCA9685 board) we just need to add additional objects in two arrays:

***STEP ONE:***

1. In the ```semaphoresLedConfiguration``` array add new object:

```
{
  GREEN: defineLedPin(9, boardPCA9685Addresses[1]),
  ORANGE: defineLedPin(8, boardPCA9685Addresses[1]),
}
```

***Description:***

The GREEN and ORANGE is defined as leds color used in particular semaphore. Because we use "To" semaphore, the semaphore has two possible signals: GREEN and ORANGE.

Our semaphore is connected to the pins with number 9 and 8. Moreover, the pins are located on the second PCA9685 board.

```boardPCA9685Addresses[1]``` - means that we use second PCA9685 board here.
(0 - for first board, 1 - for second board and so on...)
All these boards must be defined in ```boardPCA9685Addresses``` array.

***STEP TWO:***

1. In the ```semaphoresGeneralConfiguration``` array add new object:

```
{
  type: semaphoreTypes.To,
  number: 1,
  signal: signals.OS1,
}
```

***Description:***

Here we have 3 keys:
- type - defines semaphore type - here we use "To" semaphore,
- number - defines another number for the same type of the semaphore in the array - here is just 1 value because we've just connected only one "To" semaphore,
- signal - defines default signal for this semaphore after application start.

***An tht's it!*** Now, you have to reload all application and everything should work fine :smile:

## Predefined configurations

...
