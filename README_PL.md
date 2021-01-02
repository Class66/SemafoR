# SemafoR

![Pulpit Image](/images/semaphore.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT) [![GitHub release](https://img.shields.io/github/v/release/Class66/SemafoR)](https://GitHub.com/Class66/SemafoR/releases/)

<a href="https://github.com/Class66/SemafoR/blob/master/README.md"><code>English version **HERE**</code></a><br>

Jest to aplikacja do sterowania semaforami firmy KLUBA za pomocą platformy Arduino.<br>

Za pomocą tej aplikacji można kontrolować dowolne semafory firmy KLUBA:

- Sm (5, 4, 3 lub 2 komorowe z różnym układem diod)
- Sp (3 komorowe) 
- To (2 komorowe)
- Tm (2 komorowe)

Oficjalna strona z semaforami firmy KLUBA:<br>
http://modelarstwo-kluba.pl/h0/sygnalizatory-swietlne-h0/sygnalizatory-z-komora-na-slupie-h0/

> Ponieważ Arduino dostarcza 5 V do semaforów, ich jasność diody LED jest niższa niż gdyby były zasilane napięciem 12V. Zaletą jednak jest to, że jasność jest bardzo podobna do świecenia rzeczywistego semafora.

## Menu

  - [Wymagania sprzętowe](#wymagania-sprzętowe)
  - [Wymagane oprogramowanie](#wymagane-oprogramowanie)
  - [Jak wykonac cały układ z Arduino, PCA9685 i semaforami](#jak-wykonac-cały-układ-z-Arduino,-PCA9685-i-semaforami)
  - [Jak zainstalować tę aplikację](#jak-zainstalować-tę-aplikację)
  - [Jak uruchomić tę aplikację](#jak-uruchomić-tę-aplikację)
  - [Jak dodać nową definicję semafora do pliku konfiguracyjnego](#jak-dodać-nową-definicję-semafora-do-pliku-konfiguracyjnego)
  - [Jak zdefiniować semafory w pliku konfiguracyjnym](#jak-zdefiniować-semafory-w-pliku-konfiguracyjnym)
  - [Predefiniowane konfiguracje](#predefiniowane-konfiguracje)
  - [Licencja i prawa autorskie](#licencja-i-prawa-autorskie)

## Wymagania sprzętowe

- Arduino (np. Arduino UNO)
- Jedna lub więcej płytek PCA9685 (do sterowania semaforami)
  > Płytka Arduino ma dostępnych tylko 6 pinów PWM, dzięki czemu można sterować tylko jednym semaforem „Sm” z 5 komorami. Jeśli chcesz podłączyć więcej semaforów, będziesz musiał użyć układu PCA9685 (płytka ta posiada aż 16 pinów). Możesz połączyć więcej niż jedną płytkę PCA9685 w swoim układzie Arduino.
- Kilka semaforów firmy KLUBA (http://modelarstwo-kluba.pl/)
- Kabelki do podłączenia wszystkiego razem
- Komputer z systemem operacyjnym Windows/Mac/Linux

## Wymagane oprogramowanie

- NodeJS - do zainstalowania na Twoim komputerze (https://nodejs.org/en/)
- Arduino IDE - do zainstalowania na Twoim komputerze (https://www.arduino.cc/en/software)

## Jak wykonac cały układ z Arduino, PCA9685 i semaforami

Prosty przykład bazujący na 3 płytkach PCA9685:

![Pulpit Image](/images/adafruit-pca9685-circuit_pl.jpg)

![Pulpit Image](/images/real-circuit.jpg)

<br>

[![SemafoR Live](/images/youtube.png)](https://youtu.be/MvsVsbWXQEk)

Dokumentacja zewnętrzna:<br>

- Jak podłączyć płytkę PCA9685:
http://johnny-five.io/examples/led-PCA9685/

- Jak podłączyć wiele płytek PCA9685:
https://learn.adafruit.com/16-channel-pwm-servo-driver?view=all

## Jak zainstalować tę aplikację

1. Zainstaluj NodeJS (https://nodejs.org/en/)

2. Zainstaluj Arduino IDE (https://www.arduino.cc/en/software)

3. Podłącz swój układ Arduino do portu USB w komputerze
   
4. Otwórz aplikację Arduino IDE
 
5. Za pomocą Arduino IDE zapisz do pamięci Arduino program z pliku ***StandardFirmataPlus.ino***:
- wybierz z menu Arduino IDE opcję "Plik/Otwórz..." i zaznacz plik ***StandardFirmataPlus.ino***.
 (plik ten znajduje się w folderze 'Johnny-Five/firmware/StandardFirmataPlus').<br>
- następnie, zaznacz z menu Arduino IDE opcję "Szkic/Wgraj" aby rozpocząć zapis programu do pamięci Arduino

![Writing to Arduino memory](/images/arduino.gif)
> Jeśli podczas zapisu wystąpi błąd sprawdź czy podłączyłeś Arduino pod odpowiedni port USB:<br>
> Zaznacz z menu Arduino IDE opcję: 'Narzędzia/Port > COM3' lub inny COM przygotowany dla Arduino Uno (jeśli używasz konkretnie ten rodzaj Arduino)
        
6. Pobierz tę aplikację klikając zielony przycisk "Code" na górze tej strony a następnie z menu wybierając opcję "Download ZIP"

7. Rozpakuj pobraną aplikację do wybranego folderu

8. Aby zainstalować wszystkie potrzebne pakiety dla tej aplikacji, otwórz folder tej aplikacji i kliknij plik ```install.bat``` (UWAGA! plik ten zadziała tylko pod platformą Windows)<br>
**LUB**<br>
otwórz okno konsoli w tym folderze i wykonaj komendę:
```
npm install
```

## Jak uruchomić tę aplikację

1. Podłącz swój układ (Arduino, PCA9685 i podłączone semafory) do wybranego portu USB
   
2. Uruchom aplikację klikając plik ```start-steering.bat``` a następnie ```start-ui.bat``` (UWAGA! plik ten zadziała tylko pod platformą Windows)<br>
   **LUB**<br>
   otwórz okno konsoli w tym folderze i wykonaj komendę:<br>
```
node server
```
```
npm start
```

Aplikacja ta składa się z dwóch oddzielnych programów, więc możesz je również uruchomić osobno:

- **Aplikacja sterująca** - jest to główny program odpowiedzialny za sterowanie semaforami za pomocą Arduino. Jest oparty na platformie Johnny-Five.<br>
  > Przed uruchomieniem: Podłącz swój obwód (Arduino, PCA9685 i połączone semafory) do wybranego portu USB

  Program ten możesz uruchomić za pomocą komendy:
  ```
  node server
  ```
  (domyślnie startuje pod adresem http://localhost:4000)

- **Interfejs graficzny użytkownika** - jest to wizualny interfejs użytkownika, który ułatwia sterowanie semaforami za pośrednictwem przeglądarki.<br>
  > Przed uruchomieniem aplikacji interfejsu użytkownika należy uruchomić **aplikację sterującą** zgodnie z powyższym opisem.
  > W przeciwnym razie nie będziesz w stanie sterować podłączonymi semaforami.

  Program ten możesz uruchomić za pomocą komendy:
  ```
  npm start
  ```
  (domyślnie startuje pod adresem http://localhost:3000)

![Pulpit Image](/images/ui-interface-screenshot.jpg)

## Jak dodać nową definicję semafora do pliku konfiguracyjnego

Cała konfiguracja semaforów jest zdefiniowana w pliku ```common\semaphoreConfig.js```.

> Domyślna konfiguracja zakłada użycie 3 semaforów „Sm”, 3 semaforów „Tm” i jednego semafora „Sp”. Układ Arduino ma podane dwie płytki PCA9685 ze zdefiniowanymi adresami, takimi jak ```0x40``` i ```0x41```. Adresy te są zdefiniowane w tablicy ```boardPCA9685Addresses``` w tym samym pliku konfiguracyjnym.

Aby dodać nowy semafor należy najpierw podłączyć go do wybranej płytki PCA9685 (podłączonej do Arduino). Następnie musisz dodać jego definicję, modyfikując dwie tablice:
1. ```semaphoresLedConfiguration```
2. ```semaphoresGeneralConfiguration```

> Zdefinowane semafory będą wyświetlane na ekranie dokładnie w takiej samej kolejności, jak zdefiniowano w tych tablicach.

Na przykład, jeśli chcesz dodać jeden semafor "To" (załóżmy, że jest on podłączony do drugiej płytki PCA9685 o adresie ```0x41```), wystarczy, że dodasz dodatkowe definicje w dwóch tablicach<br><br>

***Konfiguracja w tablicy nr jeden:***

1. W tablicy ```semaphoresLedConfiguration``` dodaj nowy obiekt. Dla naszego semafora "To" będzie on wyglądał następująco:

```javascript
{
  GREEN: defineLedPin(9, boardPCA9685Addresses[1]), // 9 oznacza numer pin 9 na pytce PCA9685 numer 2
  ORANGE: defineLedPin(8, boardPCA9685Addresses[1]), // 8 oznacza numer pin 8 na płytce PCA9685 numer 2
}
```

GREEN i ORANGE definiuje się jako kolor diod używanych w danym semaforze. Ponieważ używamy semafora „To”, semafor ma dwa możliwe sygnały: GREEN i ORANGE. Nasz semafor jest podłączony do pinów o numerach 9 i 8, znajdujących się na drugiej płytce PCA9685.

```boardPCA9685Addresses[1]``` - oznacza, że używamy płytki PCA9685 numer dwa.<br>
(0 - dla płytki nr jeden, 1 - dla płytki numer dwa itd.)<br>
Wszystkie adresy płytek musimy zdefiniować w tablicy ```boardPCA9685Addresses```.<br><br>

***Konfiguracja w tablicy nr dwa:***

1. W tablicy ```semaphoresGeneralConfiguration``` dodaj nowy obiekt. Dla naszego semafora "To" będzie on wyglądał następująco:

```javascript
{
  type: semaphoreTypes.To, // definiuje typ semafora (tutaj używamy semafora "To")
  number: 1, // definiuje inną liczbę dla tego samego typu semafora w tablicy
  // (tutaj jest 1, ponieważ właśnie podłączyliśmy tylko jeden semafor „To”)
  signal: signals.OS1, // definiuje domyślny sygnał dla tego semafora po uruchomieniu aplikacji
  // (tutaj jest OS1 jako domyślny sygnał dla semafora „To”).
  label: 'To1', // ta pozycja NIE jest WYMAGANA, ale definiuje nazwę semafora widoczną w interfejsie UI
  // jeśli nie zdefiniujemy ten nazwy, zostanie wyświetlony typ + numer semafora
}
```
<br>

***To wszystko!*** :rocket: Teraz musisz ponownie załadować wszystkie aplikacje i wszystko powinno działać poprawnie :smile:

## Jak zdefiniować semafory w pliku konfiguracyjnym

W aplikacji występuje 10 typów semaforów, które odpowiadają semaforom produkowanym przez firmę KLUBA.

Przykłady definicji obiektów semaforów KLUBA:
> Możesz skopiować je bezpośrednio do swojego pliku konfiguracyjnego o nazwie ```semaphoreConfig.js```.<br>
> Pamiętaj jednak aby zmienić numery pinów i numer płytki PCA9685, do której semafor jest podłączony.<br>
> Pamiętaj też, że opcjonalnie zawsze możesz dodać pozycję 'label' aby zdefiniować nazwę semafora widoczą w interfejsie użytkownika.

- **Sm**<br>
Jest to 5 komorowy semafor z ledami w kolorach (od góry): GREEN, ORANGE, RED, ORANGE, WHITE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]), // pin numer 0, znajdujący się na płytce PCA9685 numer 1
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]), // pin numer 1, znajdujący się na płytce PCA9685 numer 1
  RED: defineLedPin(2, boardPCA9685Addresses[0]), // pin numer 2, znajdujący się na płytce PCA9685 numer 1
  ORANGE_TWO: defineLedPin(3, boardPCA9685Addresses[0]), // pin numer 3, znajdujący się na płytce PCA9685 numer 1
  WHITE: defineLedPin(4, boardPCA9685Addresses[0]), // pin numer 4, znajdujący się na płytce PCA9685 numer 1
}
```
```javascript
{
  type: semaphoreTypes.SmGORO, // typ semafora (wszystkie typy są zdefiniowane w zmiennej semaphoreTypes)
  number: 1, // następny numer tego konkretnego typu semafora (musi być unikalny dla tego typu)
  signal: signals.S1, // domyślny sygnał semafora (zostanie ustawiony przy uruchomieniu aplikacji)
}
```
<br>

- **SmGORO**<br>
Jest to 5 komorowy semafor z ledami w kolorach (od góry): GREEN, ORANGE, RED, ORANGE
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
Jest to 4 komorowy semafor z ledami w kolorach (od góry): GREEN, RED, ORANGE, WHITE<br>
> **WAŻNE!** ORANGE_ONE jak i ORANGE_TWO muszą koniecznie mieć ten sam numer pinu jako, że w semaforze tym mamy tylko jedną diodę w kolorze ORANGE
```javascript
{
  GREEN: defineLedPin(0, boardPCA9685Addresses[0]),
  RED: defineLedPin(2, boardPCA9685Addresses[0]),
  ORANGE_ONE: defineLedPin(1, boardPCA9685Addresses[0]),
  ORANGE_TWO: defineLedPin(1, boardPCA9685Addresses[0]), // koniecznie musi mieć ten sam numer pin co ORANGE_ONE !!!
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
Jest to 4 komorowy semafor z ledami w kolorach (od góry): ORANGE, RED, ORANGE, WHITE
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
Jest to 3 komorowy semafor z ledami w kolorach (od góry): RED, GREEN, WHITE
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
Jest to 3 komorowy semafor z ledami w kolorach (od góry): GREEN, RED, ORANGE
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
Jest to 2 komorowy semafor z ledami w kolorach (od góry): RED, GREEN
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
Jest to 3 komorowy sygnał powtarzający z ledami w kolorach (od góry): RED, GREEN, WHITE
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
Jest to 2 komorowa tarcza ostrzegawcza z ledami w kolorach (od góry): BLUE, WHITE
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
Jest to 2 komorowa tarcza manewrowa z ledami w kolorach (od góry): BLUE, WHITE
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

## Predefiniowane konfiguracje

W aplikacji w folderze ```common\predefined``` znajdziesz dwie predefiniowane, dodatkowe konfiguracje semaforów.<br>
Jeśli chcesz użyć jednej z nich, po prostu zmień nazwę pliku na ```semaphoreConfig.js``` i zastąp oryginalny plik w folderze ```common```<br>
**Pamiętaj o ponownym uruchomieniu całej aplikacji!**

> Konfiguracje te są przykładowe, więc możesz na nich polegać podczas budowania własnego pliku konfiguracyjnego.

## Licencja i prawa autorskie

Copyright (c) Marcin Gierczak

Aplikacji tej możesz używać w pełni bezpłatnie na zasadach licencji MIT: https://github.com/Class66/SemafoR/blob/master/LICENSE
