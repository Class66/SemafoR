# SemafoR

![Pulpit Image](/images/pulpit.jpg)

## Introduction

This is application for semaphores steering.

## Requirements

- Arduino (ex. UNO)
- PCA 9685 board one or more (for PWM steering)
- Semaphores from KLUBA (http://modelarstwo-kluba.pl/)

## How to prepare connection between PWA and Arduino and PCA9685 board(s)

- How to connect the PCA9685 board:
http://johnny-five.io/examples/led-PCA9685/

- How to connect more than one PCA9685 board:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## The application parts

The application is composed of two separate programs:

- **The steering application** - it's the main program responsible for steering semaphores via Arduino. It's based on Johnny-Five platform.

- **The user interface (UI) application** - it's a visual user interface that makes it easier to control semaphores through the browser.

## THE STEERING APPLICATION - How to run

## How to run the steering application for the first time

1. Install Johhny-Five platform:
```npm install johnny-five```
(https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting)

2. Open Arduino IDE
   
3. Connect our circuit (with Arduino and PCA9685) to the selected USB port
   
4. Using Arduino IDE load to the Arduino a file ***SandardFirmataPlus.ino***
(it's located in folder'Johnny-Five/firmware').
If there is an issue while loading the file:
				Select from top menu Tools/Port > COM3 or other COM prepared for the Arduino Uno
			
5. To be able to steering semaphores via our computer (localhost) install Node Express:
```npm install express --save```

6. Run our application:
```node semaphore```

## How to run the steering application for the next time

1. Connect our circuit (with Arduino and PCA9685) to the selected USB port

2. Run our application:
```node semaphore```

## THE USER INTERFACE APPLICATION - How to run

## How to run the user interface for the first time

1. In folder <b>ui</b> run:
```npm install```

2. Then run the UI:
```npm start```

## How to run the user interface for the next time

1. In folder <b>ui</b> run:
```npm start```
