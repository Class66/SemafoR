# Dokumentacja techniczna

## Stos technologiczny

- **React 19** — interfejs użytkownika.
- **Vite 8** — serwer developerski i build części frontendowej.
- **TypeScript 7** — kod UI i sterownika semaforów (`semaphore.ts`).
- **Express 4**, **Johnny-Five** i **SerialPort** — API sterujące diodami przez Arduino.
- **CSS Modules** — lokalne style komponentów; pliki mają rozszerzenie `.module.css`.

## Struktura projektu

- `src/app.tsx`, `src/main.tsx` — główny komponent React i punkt wejścia UI.
- `src/components/` — komponenty interfejsu oraz ich moduły CSS.
- `src/common/semaphore-config.ts` — port API i konfiguracja adresów, pinów LED oraz semaforów.
- `src/common/predefined/` — przykładowe konfiguracje sprzętu.
- `src/enums/`, `src/types/` — typy sygnałów, semaforów i wspólne typy TypeScript.
- `semaphore.ts` — serwer Express oraz sterowanie Arduino i diodami.
- `server.js` — punkt wejścia uruchamiający `semaphore.ts`.

Kolejność wpisów w `semaphoresLedConfiguration` musi odpowiadać kolejności wpisów w `semaphoresGeneralConfiguration`.

## Skrypty npm

| Polecenie              | Działanie                                                               |
| ---------------------- | ----------------------------------------------------------------------- |
| `npm run dev`          | Uruchamia developerski serwer Vite dla UI.                              |
| `npm run build`        | Buduje produkcyjną wersję UI do katalogu `dist/`.                       |
| `npm run preview`      | Serwuje lokalnie ostatni build Vite.                                    |
| `npm run lint`         | Uruchamia Oxlint dla projektu.                                          |
| `npm run lint:fix`     | Uruchamia Oxlint z automatycznymi poprawkami dla plików JS/TS w `src/`. |
| `npm run stylelint`    | Sprawdza arkusze CSS w `src/`.                                          |
| `npm run type:check`   | Sprawdza typy TypeScript bez generowania plików.                        |
| `npm run format`       | Formatuje pliki obsługiwane przez Oxfmt.                                |
| `npm run format:check` | Sprawdza formatowanie bez modyfikowania plików.                         |
| `npm run prepare`      | Konfiguruje hooki Git przez Husky.                                      |

Hook `.husky/pre-commit` przed commitem uruchamia kolejno `format:check`, `lint`, `stylelint` i `type:check`.

## Formatowanie i lintowanie

- **Oxfmt** formatuje kod. Konfiguracja znajduje się w `oxfmt.config.ts`: bez średników, pojedyncze cudzysłowy, wcięcia dwuspacjowe i szerokość linii 80 znaków. Dokumentacja Markdown, pliki lock oraz wybrane katalogi są pomijane.
- **Oxlint** analizuje JavaScript/TypeScript. `oxlint.config.ts` włącza reguły React `rules-of-hooks` (błąd) oraz `only-export-components` (ostrzeżenie); pozostałe aktywne reguły pochodzą z domyślnych konfiguracji Oxlint.
- **Stylelint** sprawdza CSS. `stylelint.config.js` definiuje reguły dotyczące nieznanych at-rules, nieprawidłowych wartości kolorów hex, jednostek przy zerze, brakującej ogólnej rodziny fontów i wzorca nazw klas.
- **TypeScript** działa w trybie `strict`. `tsconfig.json` obejmuje `src/` i główny `semaphore.ts`, nie emituje plików JS oraz dopuszcza importowanie istniejących plików JS (`allowJs`), ale nie sprawdza ich typów (`checkJs: false`).

VS Code ma skonfigurowany Oxfmt jako formatter przy zapisie. Wymaga to rozszerzenia **Oxc** (`oxc.oxc-vscode`).

## Uruchamianie

Zainstaluj zależności poleceniem `npm install`. UI uruchom przez `npm run dev`. Sterownik uruchom skryptem `start-steering.bat` (równoważnie: `node server`); przed uruchomieniem Arduino powinno być podłączone i skonfigurowane z firmware StandardFirmataPlus.

Port API (`4000`), pinout i adresy PCA9685 konfiguruje się w `src/common/semaphore-config.ts`. Port szeregowy Arduino jest obecnie ustawiony w `semaphore.ts` na `COM3`; w razie potrzeby zmień go na port właściwy dla danego komputera.
