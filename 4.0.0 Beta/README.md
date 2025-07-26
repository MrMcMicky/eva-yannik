# Eva & Yannik Website v4.0.0 - Dokumentation

## 🎯 Übersicht

Diese Website ist eine Liebeserklärung an Eva & Yannik, die ihre gemeinsame Zeit seit dem 21. Januar 2025 zählt.

### Was ist neu in Version 4.0.0?

- **Modularer Code**: JavaScript ist jetzt in übersichtliche Module aufgeteilt
- **Bessere Performance**: Optimierte Ladezeiten und Animationen  
- **Für Anfänger optimiert**: Ausführliche Kommentare und klare Struktur
- **Neue Features**: Splash Screen, erweiterte Einstellungen, Version History

## 📁 Dateistruktur

```
4.0.0 Beta/
├── index.html              # Original HTML (komplex)
├── index-simplified.html   # Vereinfachte Version (empfohlen!)
├── style.css              # Alle Styles
├── js/                    # JavaScript Module
│   ├── main.js           # Haupt-Initialisierung
│   ├── countdown.js      # Countdown Timer
│   ├── ui-controls.js    # Buttons und Menüs
│   ├── milestones.js     # Meilensteine
│   └── splash-screen.js  # Willkommensfenster
├── images/               # Bilder
│   ├── breit.jpg        # Hauptbild (Querformat)
│   └── lang.jpg         # Alternatives Bild
└── tcp.html             # Test/Debug Seite
```

## 🚀 Installation & Start

### 1. Dateien auf Server kopieren
```bash
# Ins Projektverzeichnis wechseln
cd /var/www/eva-yannik/4.0.0\ Beta

# Oder lokal testen mit einem Webserver
python3 -m http.server 8000
# Dann im Browser: http://localhost:8000/index-simplified.html
```

### 2. Welche Version verwenden?

- **index-simplified.html** → Für Anfänger empfohlen! Sauberer, modularer Code
- **index.html** → Original mit allem inline (schwerer zu verstehen)

## 🎨 Features

### 1. Countdown Timer
Zeigt die Zeit seit dem 21.01.2025 in Tagen, Stunden, Minuten und Sekunden.

**Datei**: `js/countdown.js`

**Anpassbar**:
- Startdatum ändern: Zeile 11 in `countdown.js`
- Easter Egg bei Klick auf Sekunden (10x klicken = Konfetti)

### 2. Meilensteine
Zeigt wichtige Tage in der Beziehung (1 Woche, 1 Monat, 100 Tage, etc.)

**Datei**: `js/milestones.js`

**Anpassbar**:
- Neue Meilensteine hinzufügen: Array in Zeile 20
- Emojis und Texte ändern

### 3. Navigation & Menüs
4 Hauptbuttons unten rechts:
- Menü (Hamburger)
- Bibel (Buch-Icon)
- Einstellungen (Zahnrad)
- Info (i)

**Datei**: `js/ui-controls.js`

### 4. Splash Screen
Begrüßungsfenster beim ersten Besuch des Tages.

**Datei**: `js/splash-screen.js`

**Features**:
- Wird nur 1x pro Tag gezeigt
- Automatisches Schließen nach 10 Sekunden
- ESC-Taste oder Klick zum Schließen

## 🛠️ Anpassungen für Anfänger

### Farben ändern
In `style.css` die CSS-Variablen anpassen:
```css
:root {
    --primary-color: #667eea;    /* Hauptfarbe */
    --secondary-color: #764ba2;   /* Sekundärfarbe */
    --text-color: #ffffff;        /* Textfarbe */
}
```

### Texte ändern
Alle Texte sind direkt im HTML zu finden und können einfach geändert werden.

### Neues Bild einbinden
1. Bild in `images/` Ordner kopieren
2. In HTML: `<img src="images/dein-bild.jpg" alt="Beschreibung">`

### Datum ändern
In `js/countdown.js` Zeile 11:
```javascript
this.startDate = new Date('2025-01-21T00:00:00+01:00');
```

## 🐛 Bekannte Probleme & Lösungen

### Problem: Buttons funktionieren nicht
**Lösung**: Prüfe ob alle JS-Dateien geladen werden (Browser-Konsole mit F12)

### Problem: Countdown zeigt 0
**Lösung**: Datum liegt in der Zukunft? Countdown funktioniert nur für vergangene Daten.

### Problem: Bilder laden nicht
**Lösung**: Pfade prüfen - Bilder müssen im `images/` Ordner sein

## 📚 Für Entwickler

### Code-Stil
- **Kommentare**: Jede Funktion hat Beschreibung
- **Variablen**: Sprechende Namen (nicht `x` sondern `daysSinceMeeting`)
- **Module**: Ein Feature = Eine Datei

### Neue Features hinzufügen
1. Neue JS-Datei in `js/` erstellen
2. Klasse mit `init()` Methode schreiben
3. In `main.js` initialisieren
4. In HTML einbinden

### Testing
```bash
# Einfacher Test ohne Browser
node test-simplified.js

# Code-Analyse
node analyze-code.js
```

## 💡 Tipps & Tricks

1. **Browser-Konsole nutzen** (F12): Zeigt Fehler und Logs
2. **Kleine Änderungen**: Erst eine Sache ändern, dann testen
3. **Backup machen**: Vor großen Änderungen Dateien kopieren
4. **Comments lesen**: Der Code erklärt sich selbst

## 🎯 Nächste Schritte

1. **Performance**: Bilder in WebP konvertieren für schnelleres Laden
2. **PWA**: Progressive Web App für Offline-Nutzung
3. **Galerie**: Mehrere Bilder mit Slideshow
4. **Dark Mode**: Automatischer Wechsel nach Uhrzeit

## 📞 Hilfe & Support

Bei Fragen oder Problemen:
- Code-Kommentare lesen
- Browser-Konsole checken (F12)
- GitHub Issues erstellen

---

**Mit Liebe gemacht für Eva & Yannik 💕**

*Version 4.0.0 - Juli 2025*