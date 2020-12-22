# SemafoR

![Pulpit Image](/images/semaphore.jpg)

## Introduction

This is application for control KLUBA semaphores.

## Requirements

- Arduino (ex. UNO)
- PCA 9685 board one or more (for PWM steering)
- Semaphores from KLUBA (http://modelarstwo-kluba.pl/)

## How to create circuit with Arduino and PCA9685 board(s)

- How to connect the PCA9685 board:
http://johnny-five.io/examples/led-PCA9685/

- How to connect more than one PCA9685 board:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## The application parts

The application is composed of two separate programs:

- **The steering application** - it's the main program responsible for steering semaphores via Arduino. It's based on Johnny-Five platform. It's Node application.

- **The user interface application** - it's a visual user interface that makes it easier to control semaphores through the browser. It's React application.

## How to run the steering application for the first time

1. Install Johhny-Five platform:
```npm install johnny-five```
(https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting)

2. Open Arduino IDE
   
3. Connect your circuit (with Arduino and PCA9685) to the selected USB port
   
4. Using Arduino IDE load to the Arduino a file ***SandardFirmataPlus.ino***
(it's located in folder'Johnny-Five/firmware').
If there is an issue while loading the file:
				Select from top menu Tools/Port > COM3 or other COM prepared for the Arduino Uno
			
5. To be able to steering semaphores via your computer (localhost) install Node Express:
```npm install express --save```

6. Run application:
```node semaphore```

## How to run the steering application for the next time

1. Connect your circuit (with Arduino and PCA9685) to the selected USB port

2. Run application:
```node semaphore```

## How to run the user interface application

1. Run application:
```npm start```
