# Makieta-Soft

![Pulpit Image](/images/pulpit.jpg)

## Wstęp

Jest to aplikacja do sterowania semaforami firmy KLUBA oraz symulacji wirtualnego pulpitu nastawczego typu kostkowego.

## Wymagane urządzenia do działania aplikacji

- Układ Arduino
- Płytki PWM PCA 9685
- Semafory firmy KLUBA (http://modelarstwo-kluba.pl/)

## Jak przygotować połączenie PWA przy pomocy Arduino i PCA9685

- Jak podłączyć płytkę PCA9685:
http://johnny-five.io/examples/led-PCA9685/

- Jak podłączyć większą ilość płytek PCA9685:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## Jak uruchomić aplikację po raz pierwszy

1. Instalujemy platformę Johnny-Five:
```npm install johnny-five```
(https://github.com/rwaldron/johnny-five/wiki/Getting-Started#trouble-shooting)

2. Uruchamiamy Arduino IDE
3. Podłączamy nasz układ z Arduino pod wybrany port USB
4. Przy pomocy Arduino IDE wgrywamy do Arduino plik ***SandardFirmataPlus.ino***
(znajduje się on w katalogu 'Johnny-Five/firmware').
Jeśli występuje błąd przy wgrywaniu ustawić w Arduino IDE:
				Narzędzia/Port > COM3 lub inny COM skazany dla Arduino Uno

5. Aby móc sterować semaforami przez nasz komputer (localhost)
potrzebujemy zainstalować jeszcze serwer Node Express:
```npm install express --save```

6. Uruchamiamy naszą aplikację:
```node semaphores-steering```

## Jak uruchomić aplikację po raz kolejny

1. Podłączamy nasz układ z Arduino pod wybrany port USB

2. Uruchamiamy naszą aplikację:
```node semaphores-steering```

