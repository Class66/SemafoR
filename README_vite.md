# Dokumentacja techniczna

## Stos technologiczny

- **React 19** — interfejs użytkownika.
- **Vite 8** — serwer developerski i build części frontendowej.
- **TypeScript 7** — kod UI i sterownika semaforów (`src/server/semaphore-controller.ts`).
- **Express 4**, **Johnny-Five** i **SerialPort** — API sterujące diodami przez Arduino.
- **CSS Modules** — lokalne style komponentów; pliki mają rozszerzenie `.module.css`.

## Struktura projektu

- `src/app.tsx`, `src/main.tsx` — główny komponent React i punkt wejścia UI.
- `src/components/` — komponenty interfejsu oraz ich moduły CSS.
- `src/common/semaphores-config.ts` — port API i konfiguracja adresów, pinów LED oraz semaforów.
- `src/common/predefined/` — przykładowe konfiguracje sprzętu.
- `src/enums/`, `src/types/` — typy sygnałów, semaforów i wspólne typy TypeScript.
- `src/server/semaphore-controller.ts` — inicjalizacja Arduino, konfiguracja diod i logika obsługi sygnałów. Po zdarzeniu `ready` płytki uruchamia serwer, przekazując mu semafory oraz funkcje ustawiające sygnały.
- `src/server/semaphore-server.ts` — wydzielona logika HTTP: konfiguracja middleware, mapowanie adresów na semafory i sygnały, obsługa endpointu `/:semaphore/:signal` oraz uruchomienie Express.

Podział oddziela obsługę HTTP od sterowania sprzętem. Moduł Express nie inicjalizuje Arduino ani nie steruje diodami bezpośrednio — korzysta z funkcji przekazanych przez `semaphore-controller.ts`. Serwer startuje dopiero po zgłoszeniu gotowości przez płytkę.

Kolejność wpisów w `semaphoresLedConfiguration` musi odpowiadać kolejności wpisów w `semaphoresGeneralConfiguration`.

## Skrypty npm

| Polecenie              | Działanie                                                               |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run steering`     | Uruchamia sterownik Arduino i serwer Node Express.                       |
| `npm run dev`          | Uruchamia developerski serwer Vite dla UI.                              |
| `npm run build`        | Buduje produkcyjną wersję UI do katalogu `dist/`.                       |
| `npm run preview`      | Serwuje lokalnie ostatni build Vite.                                    |
| `npm run lint`         | Uruchamia Oxlint dla projektu.                                          |
| `npm run lint:fix`     | Uruchamia Oxlint z automatycznymi poprawkami dla plików JS/TS w `src/`. |
| `npm run stylelint`    | Sprawdza arkusze CSS w `src/`.                                          |
| `npm run type:check`   | Sprawdza typy TypeScript bez generowania plików.                        |
| `npm run format`       | Formatuje pliki obsługiwane przez Oxfmt.                                |
| `npm run format:check` | Sprawdza formatowanie bez modyfikowania plików.                         |
| `npm run check:staged` | Uruchamia lint-staged dla plików dodanych do indeksu Git.                |
| `npm run prepare`      | Konfiguruje hooki Git przez Husky.                                      |

Hook `.husky/pre-commit` przed commitem uruchamia `check:staged`, a następnie `type:check`.

## Formatowanie i lintowanie

- **Oxfmt** formatuje kod. Konfiguracja znajduje się w `oxfmt.config.ts`: bez średników, pojedyncze cudzysłowy, wcięcia dwuspacjowe i szerokość linii 80 znaków. Dokumentacja Markdown, pliki lock oraz wybrane katalogi są pomijane.
- **Oxlint** analizuje JavaScript/TypeScript. `oxlint.config.ts` włącza reguły React `rules-of-hooks` (błąd) oraz `only-export-components` (ostrzeżenie); pozostałe aktywne reguły pochodzą z domyślnych konfiguracji Oxlint.
- **Stylelint** sprawdza CSS. `stylelint.config.cjs` definiuje reguły dotyczące nieznanych at-rules, nieprawidłowych wartości kolorów hex, jednostek przy zerze, brakującej ogólnej rodziny fontów i wzorca nazw klas.
- **TypeScript** działa w trybie `strict`. `tsconfig.json` obejmuje `src/`, nie emituje plików JS oraz dopuszcza importowanie istniejących plików JS (`allowJs`), ale nie sprawdza ich typów (`checkJs: false`).
- **lint-staged** uruchamia kontrole tylko dla plików dodanych do indeksu Git (staged), dzięki czemu przed commitem nie trzeba ponownie sprawdzać całego projektu. Dla plików `.js`, `.jsx`, `.ts` i `.tsx` najpierw Oxfmt zapisuje formatowanie, a potem Oxlint sprawdza kod. Dla `.css` Oxfmt formatuje plik, po czym Stylelint go sprawdza. Pliki `.json`, `.jsonc`, `.scss` i `.html` są formatowane przez Oxfmt. Jeśli formatowanie zmieni plik, zmiana pozostaje w indeksie i trafia do commita; błąd lintera lub formatowania przerywa commit.

VS Code ma skonfigurowany Oxfmt jako formatter przy zapisie. Wymaga to rozszerzenia **Oxc** (`oxc.oxc-vscode`).

## Uruchamianie

Zainstaluj zależności poleceniem `npm install`. Przed uruchomieniem sterownika podłącz Arduino i wgraj firmware StandardFirmataPlus. Sterownik wraz z API Express uruchom poleceniem `npm run steering`, a interfejs użytkownika w osobnym terminalu poleceniem `npm run dev`. W systemie Windows odpowiadają im skrypty `start-steering.bat` i `start-ui.bat`. Nie używaj `node server` ani `npm start` — punkt wejścia `server.js` został usunięty.

Port API (`4000`), pinout i adresy PCA9685 konfiguruje się w `src/common/semaphores-config.ts`. Port szeregowy Arduino jest obecnie ustawiony w `src/server/semaphore-controller.ts` na `COM3`; w razie potrzeby zmień go na port właściwy dla danego komputera.
