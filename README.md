# Eva-Yannik Site

Dieses Repository enthält zwei Versionen einer statischen HTML/CSS/JavaScript-Seite ("3.5.3 Stable" und "3.5.4 Beta"). Beide enthalten eine Einzeldatei `index.html`, eine umfangreiche `style.css` und ein Bild `love.jpg`.

Die Seite zählt seit dem 21.01.2025 die Zeit und zeigt Infos über Meilensteine, Easter Eggs und kommende Funktionen an. Elemente wie ein Info-Overlay, ein Versionsverlauf, Countdown, Milestones und kleine Spielereien (herunterfallende Herzen, christliche Symbole, etc.) sind direkt im HTML eingebettet.

## Absicht der Seite

Die Seite richtet sich offenbar an ein Paar und soll gemeinsam erlebte Meilensteine feiern. Mit Countdown, verspielten Grafiken und Easter Eggs dient sie als persönliches Projekt, das fortlaufend erweitert wird.

## Mögliche Verbesserungen

*(von MrMcMicky)*

1. **Aufteilung von Code und Struktur**: `index.html` enthält mehrere tausend Zeilen HTML, CSS und JavaScript. Es wäre wartungsfreundlicher, CSS und JavaScript in eigene Dateien auszulagern.
2. **Versionsverwaltung**: Für stabile Releases könnte ein Tagging/Release-Prozess in Git erfolgen, anstatt Ordner pro Version anzulegen.
3. **Code-Wiederverwendung**: Viele Styles und Skripte sind zwischen den Versionen identisch. Durch gemeinsame Dateien (z.B. `css/`, `js/`) ließe sich Redundanz vermeiden.
4. **Fehlerbehandlung**: Das Skript greift auf `localStorage` zu und setzt Event-Listener. Eine Prüfung auf Browserunterstützung und `try/catch`-Blöcke könnten die Stabilität verbessern.
5. **Performance**: Das Laden von Google Fonts und vielen Inline-Skripten kann die Ladezeit beeinflussen. Ein Minimieren der Assets und Caching hilft, die Seite schneller bereitzustellen.
6. **Responsives Design**: Zwar existiert ein Mobile-Styling, dennoch sollte das Layout mit unterschiedlichen Geräten (iOS/Android/Bildschirmgrößen) getestet werden, um unerwartete Darstellungsprobleme frühzeitig zu finden.
7. **Barrierefreiheit**: Elemente wie Buttons oder Animationen sollten mit `aria`-Labels oder Beschriftungen ausgestattet werden, damit Screenreader sie erfassen können.
8. **Kommentierung**: Eine englischsprachige oder zweisprachige Kommentarstruktur erleichtert die Weitergabe des Projekts. Kommentare im Code sollten kurz erklären, warum bestimmte Easter-Eggs existieren.
9. **Linter/Formatter**: Der Einsatz von Tools wie Prettier oder ESLint (bei Bedarf auch HTMLHint/CSSLint) stellt sicher, dass Syntaxfehler früh erkannt werden und der Code konsistent formatiert bleibt.

Diese Punkte helfen dabei, die Seite langfristig zu pflegen und stabil auszuliefern.
