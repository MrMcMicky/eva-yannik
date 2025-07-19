# Eva & Yannik Website 💕

Eine romantische Countdown-Website, die die gemeinsame Zeit seit dem 21.01.2025 zählt.

## 🌐 Live Website
- **URL**: https://eva-yannik.assistent.my.id
- **Status**: ✅ Online
- **Version**: 3.5.5 Documented (mit ausführlichen Kommentaren von MrMcMicky)

## 📁 Projekt-Struktur
```
/var/www/eva-yannik/
├── 3.5.3 Stable/        # Stabile Version
├── 3.5.4 Beta/          # Beta Version mit neuen Features
├── 3.5.5 Documented/    # NEU: Version mit Kommentaren & modularem Code
├── current -> 3.5.5     # Symlink zur aktiven Version
├── js/                  # Modulare JavaScript-Dateien
│   ├── main.js          # Haupteinstiegspunkt
│   ├── countdown.js     # Countdown-Timer Logik
│   ├── milestones.js    # Meilenstein-System
│   ├── easter-eggs.js   # Versteckte Features
│   ├── menu.js          # Menü-System
│   └── ui-animations.js # Animationen & Effekte
├── css/
│   └── easter-eggs.css  # Styles für Easter Eggs
├── deploy.sh            # Deployment-Script
├── nginx.conf           # Nginx-Konfiguration
├── IMPROVEMENTS.md      # Verbesserungsvorschläge
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
- **3.5.3 Stable**: Erste stabile Version
- **3.5.4 Beta**: Beta mit Layout-Verbesserungen
- **3.5.5 Documented**: NEU - Mit Kommentaren und modularem Code von MrMcMicky

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

## 🐛 Bekannte Probleme & Lösungen
1. **Layout-Probleme auf manchen Geräten**
   - Lösung: CSS Grid/Flexbox wurde optimiert
2. **Performance auf älteren Geräten**
   - Lösung: Animationen werden auf Mobile reduziert
3. **Easter Eggs auf Mobile**
   - Lösung: Touch-Events wurden hinzugefügt

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