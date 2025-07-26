# Eva & Yannik Website 💕

Eine romantische Countdown-Website, die die gemeinsame Zeit seit dem 21.01.2025 zählt.

## 🌐 Live Website
- **URL**: https://eva-yannik.assistent.my.id
- **Status**: ✅ Online
- **Version**: 4.0.0 Beta (Modulare Struktur, UI/UX optimiert)

## 📁 Projekt-Struktur
```
/var/www/eva-yannik/
├── 4.0.0 Beta/          # NEU: Aktuelle Version (Live)
│   ├── index.html       # Hauptdatei mit CSS-Fixes
│   ├── style.css        # Original Styles
│   ├── js/              # Modulare JavaScript-Dateien
│   │   ├── main.js      # Hauptinitialisierung
│   │   ├── countdown.js # Timer-Logik (dokumentiert)
│   │   ├── ui-controls.js # Button & Menu Steuerung
│   │   ├── milestones.js # Meilenstein-Tracking
│   │   └── splash-screen.js # Willkommensfenster
│   ├── images/          # Bilder (breit.jpg, lang.jpg)
│   ├── css/             # Zusätzliche strukturierte CSS
│   └── README.md        # Ausführliche Dokumentation
├── 3.5.5 Documented/    # Version mit Kommentaren
├── 3.5.4 Beta/          # Beta Version
├── 3.5.3 Stable/        # Erste stabile Version
├── current -> 4.0.0 Beta # Symlink zur aktiven Version
├── deploy.sh            # Deployment-Script
├── nginx.conf           # Nginx-Konfiguration
└── README.md           # Diese Datei
```

## 🚀 Deployment

### Automatisches Deployment
```bash
cd /var/www/eva-yannik
./deploy.sh
```

### Manuelles Deployment
```bash
# 1. Neueste Änderungen holen
git pull origin main

# 2. Version auswählen
rm -f current
ln -s "3.5.5 Documented" current  # Neue dokumentierte Version

# 3. Nginx neu laden
sudo systemctl reload nginx
```

## 🔧 Technische Details
- **Typ**: Statische Website (HTML, CSS, JavaScript)
- **JavaScript**: Modular aufgebaut mit ausführlichen deutschen Kommentaren
- **CSS**: Getrennte Dateien für bessere Organisation
- **SSL**: Let's Encrypt Zertifikat
- **Webserver**: Nginx
- **Performance**: Optimiert mit Lazy Loading und effizienten Animationen

## 📝 Versionen
- **4.0.0 Beta**: AKTUELL - Modulare Struktur, UI/UX Fixes, für Anfänger optimiert
- **3.5.5 Documented**: Mit Kommentaren und modularem Code von MrMcMicky
- **3.5.4 Beta**: Beta mit Layout-Verbesserungen
- **3.5.3 Stable**: Erste stabile Version

## 🎮 Easter Eggs
Die Website enthält mehrere versteckte Features:
- **Schwebende Herzen**: Klicke 5x schnell auf die Sekunden-Anzeige
- **Herzenregen**: Tippe "love" (nur Desktop)
- **Christliche Symbole**: Tippe "god" oder "jesus"
- **Easter Egg Liste**: 5x auf den Privacy-Text klicken
- **Mehr Geheimnisse**: Erkunde die Website und finde alle!

## 🛠️ Entwickler-Features (NEU)
- **Debug-Modus**: Drücke `Ctrl+Shift+D` für Debug-Informationen
- **Konsolen-Befehle**: 
  ```javascript
  window.evaYannikDebug.showAllEasterEggs()  // Zeigt alle Easter Eggs
  window.evaYannikDebug.resetLocalStorage()   // Löscht gespeicherte Daten
  window.celebrate()                          // Konfetti-Animation!
  ```

## 📚 Code-Dokumentation
Jede JavaScript-Datei enthält:
- **Ausführliche deutsche Kommentare** von MrMcMicky
- **Lernpunkte für Yannik** zum besseren Verständnis
- **Verbesserungsmöglichkeiten** für zukünftige Updates
- **Best Practices** und moderne JavaScript-Patterns

## ✅ Version 4.0.0 Verbesserungen
1. **Modularer Code**
   - JavaScript in 5 separate Module aufgeteilt (war vorher 56KB inline!)
   - Jedes Modul hat einen klaren Zweck
   - Ausführliche deutsche Kommentare für Anfänger
2. **UI/UX Fixes**
   - CSS-Klassen korrekt zugeordnet
   - Responsive Design für alle Geräte
   - Navigation Buttons richtig positioniert
   - Alle Hover-Effekte und Animationen funktionieren
3. **Performance**
   - Schnellere Ladezeiten durch modularen Code
   - Optimierte Animationen
   - Lazy Loading für Bilder

## 📈 Geplante Verbesserungen
- ✨ Dark Mode (bereits vorbereitet im Code)
- 📸 Foto-Galerie für gemeinsame Erinnerungen
- 🎵 Hintergrundmusik Option
- 📱 Progressive Web App (PWA)
- 🌍 Mehrsprachigkeit (DE/EN)

## 📞 Support
Bei Fragen oder Problemen:
- **Repository**: git@github.com:MrMcMicky/eva-yannik.git
- **Server-Admin**: Michael (MrMcMicky)
- **Original-Entwickler**: Yannik Schluep

## ❤️ Credits
- **Original**: Made with love by Yannik Schluep for Eva
- **Dokumentation & Verbesserungen**: MrMcMicky (Michael)
- **Inspiration**: Die Liebe zwischen Eva & Yannik 💕

---

*"Code ist Poesie, und diese Website ist ein Liebesgedicht."* - MrMcMicky