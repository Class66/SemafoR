# Makieta-Soft

![Pulpit Image](/images/pulpit.jpg)

## Wstęp

Jest to aplikacja do sterowania semaforami firmy KLUBA oraz symulacji wirtualnego pulpitu nastawczego typu kostkowego.

## Co potrzebne do obsługi programu

- Układ Arduino
- Płytki PWM PCA 9685
- Semafory firmy KLUBA (http://modelarstwo-kluba.pl/)

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

