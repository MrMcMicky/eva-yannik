/**
 * EASTER EGGS MODUL
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul verwaltet alle versteckten Features (Easter Eggs) der Website.
 * Easter Eggs sind kleine Überraschungen die Nutzer entdecken können!
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. Event Listener sind das Herzstück interaktiver Websites
 * 2. CSS Animationen + JavaScript = Coole Effekte
 * 3. LocalStorage speichert Daten im Browser (überlebt Seitenreloads)
 * 
 * AKTUELLE EASTER EGGS:
 * - 5x auf Sekunden klicken → Schwebende Herzen
 * - "love" tippen → Herzenregen
 * - "god" oder "jesus" tippen → Christliche Symbole
 * - 5x auf Privacy-Text klicken → Zeigt alle Easter Eggs
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Neue Easter Eggs: Konami Code, Shake-Geste (Mobile)
 * - Sound-Effekte bei Aktivierung
 * - Achievements/Badges für gefundene Easter Eggs
 * - Teilen-Funktion für entdeckte Easter Eggs
 */

// Konfiguration
const CLICK_TIMEOUT = 2000; // Millisekunden zwischen Klicks
const REQUIRED_CLICKS = 5; // Anzahl Klicks für Aktivierung
const TYPING_BUFFER_SIZE = 10; // Maximale Länge des Tipp-Buffers

// Status-Variablen
let secretClickCount = 0;
let lastClickTime = 0;
let typedString = '';
let easterEggsFound = JSON.parse(localStorage.getItem('easterEggsFound') || '[]');

/**
 * Erstellt ein schwebendes Herz an zufälliger Position
 * LERNPUNKT: DOM-Elemente dynamisch erstellen und animieren
 */
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️'; // Unicode-Herz Emoji
    
    // Zufällige Startposition (horizontal)
    const startX = Math.random() * window.innerWidth;
    heart.style.left = `${startX}px`;
    heart.style.bottom = '-50px'; // Startet unterhalb des Bildschirms
    
    // Zufällige Eigenschaften für Variation
    const size = Math.random() * 20 + 20; // 20-40px
    const duration = Math.random() * 3 + 5; // 5-8 Sekunden
    const swayAmount = Math.random() * 100 - 50; // -50 bis +50px Schwanken
    
    heart.style.fontSize = `${size}px`;
    heart.style.setProperty('--float-duration', `${duration}s`);
    heart.style.setProperty('--sway-amount', `${swayAmount}px`);
    
    // Füge zum Body hinzu
    document.body.appendChild(heart);
    
    // Starte Animation
    requestAnimationFrame(() => {
        heart.style.transform = `translateY(-${window.innerHeight + 100}px)`;
        heart.style.opacity = '0';
    });
    
    // Entferne nach Animation
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

/**
 * Aktiviert schwebende Herzen für einige Sekunden
 * @param {number} duration - Dauer in Millisekunden
 */
function activateFloatingHearts(duration = 10000) {
    // Markiere als gefunden
    markEasterEggFound('floating-hearts');
    
    // Erstelle Herzen in Intervallen
    const interval = setInterval(() => {
        createFloatingHeart();
    }, 300); // Alle 300ms ein neues Herz
    
    // Stoppe nach der angegebenen Dauer
    setTimeout(() => {
        clearInterval(interval);
    }, duration);
    
    // Zeige Erfolgsmeldung
    showEasterEggNotification('Schwebende Herzen aktiviert! ❤️');
}

/**
 * Erstellt ein christliches Symbol mit Animation
 * VERBESSERUNG: Könnte verschiedene Animationsmuster haben
 */
function createChristianSymbol() {
    const symbols = ['✝️', '✟', '✞', '†'];
    const symbol = document.createElement('div');
    symbol.className = 'christian-symbol';
    symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    
    // Zufällige Position und Eigenschaften
    const posX = Math.random() * (window.innerWidth - 100);
    const posY = Math.random() * (window.innerHeight - 100);
    const size = Math.random() * 100 + 50; // 50-150px
    const rotation = Math.random() * 360;
    const opacity = Math.random() * 0.7 + 0.3;
    
    // Setze Styles
    Object.assign(symbol.style, {
        left: `${posX}px`,
        top: `${posY}px`,
        fontSize: `${size}px`,
        transform: `rotate(${rotation}deg) scale(0)`,
        opacity: opacity
    });
    
    document.body.appendChild(symbol);
    
    // Animiere Erscheinen
    setTimeout(() => {
        symbol.style.transition = 'all 1s ease-out';
        symbol.style.transform = `rotate(${rotation + 360}deg) scale(1)`;
    }, 10);
    
    // Animiere Verschwinden
    setTimeout(() => {
        symbol.style.transition = 'all 2s ease-in';
        symbol.style.opacity = '0';
        symbol.style.transform = `rotate(${rotation + 720}deg) scale(0)`;
        
        setTimeout(() => symbol.remove(), 2000);
    }, 3000);
}

/**
 * Aktiviert christliche Symbole
 */
function activateChristianSymbols() {
    markEasterEggFound('christian-symbols');
    
    // Erstelle 10 Symbole mit Verzögerung
    for (let i = 0; i < 10; i++) {
        setTimeout(createChristianSymbol, i * 300);
    }
    
    showEasterEggNotification('Gottes Segen sei mit euch! ✝️');
}

/**
 * Zeigt eine Benachrichtigung wenn ein Easter Egg gefunden wurde
 * @param {string} message - Die anzuzeigende Nachricht
 */
function showEasterEggNotification(message) {
    // Erstelle Notification-Element
    const notification = document.createElement('div');
    notification.className = 'easter-egg-notification';
    notification.textContent = message;
    
    // Style für die Notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%) translateY(-100px)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px 30px',
        borderRadius: '30px',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        zIndex: '10000',
        transition: 'transform 0.5s ease-out'
    });
    
    document.body.appendChild(notification);
    
    // Animiere Einblenden
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Entferne nach 3 Sekunden
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(-100px)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

/**
 * Markiert ein Easter Egg als gefunden und speichert es
 * @param {string} eggId - Eindeutige ID des Easter Eggs
 */
function markEasterEggFound(eggId) {
    if (!easterEggsFound.includes(eggId)) {
        easterEggsFound.push(eggId);
        localStorage.setItem('easterEggsFound', JSON.stringify(easterEggsFound));
        
        // VERBESSERUNG: Zeige Fortschritt (z.B. "3/5 Easter Eggs gefunden!")
        const totalEggs = 4; // Anzahl aller Easter Eggs
        if (easterEggsFound.length === totalEggs) {
            showEasterEggNotification('🎉 Alle Easter Eggs gefunden! Du bist amazing!');
        }
    }
}

/**
 * Zeigt Modal mit allen Easter Eggs
 */
function showAllEasterEggs() {
    // Modal erstellen
    const modal = document.createElement('div');
    modal.className = 'easter-egg-modal';
    
    // Backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'easter-egg-backdrop';
    backdrop.onclick = () => modal.remove();
    
    // Content
    const content = document.createElement('div');
    content.className = 'easter-egg-content';
    content.onclick = (e) => e.stopPropagation();
    
    // Titel
    const title = document.createElement('h2');
    title.textContent = '🎉 Easter Eggs';
    title.style.color = '#f8f8f2';
    title.style.marginBottom = '20px';
    
    // Easter Egg Liste
    const eggList = [
        {
            title: '1. Schwebende Herzen ❤️',
            description: 'Klicke 5x schnell auf die Sekunden-Anzeige',
            found: easterEggsFound.includes('floating-hearts'),
            id: 'floating-hearts'
        },
        {
            title: '2. Herzenregen 💕',
            description: 'Tippe "love" (nur auf Desktop)',
            found: easterEggsFound.includes('love-rain'),
            id: 'love-rain'
        },
        {
            title: '3. Christliche Symbole ✝️',
            description: 'Tippe "god" oder "jesus"',
            found: easterEggsFound.includes('christian-symbols'),
            id: 'christian-symbols'
        },
        {
            title: '4. Easter Egg Liste 📋',
            description: 'Du hast sie gerade gefunden! 😄',
            found: true,
            id: 'egg-list'
        }
    ];
    
    // Erstelle Liste
    const list = document.createElement('div');
    eggList.forEach(egg => {
        const item = document.createElement('div');
        item.style.marginBottom = '15px';
        item.style.opacity = egg.found ? '1' : '0.5';
        
        const titleEl = document.createElement('h3');
        titleEl.textContent = egg.title + (egg.found ? ' ✓' : ' ?');
        titleEl.style.color = egg.found ? '#50fa7b' : '#ff79c6';
        titleEl.style.marginBottom = '5px';
        
        const descEl = document.createElement('p');
        descEl.textContent = egg.found ? egg.description : '???';
        descEl.style.color = '#f8f8f2';
        descEl.style.margin = '0';
        
        item.appendChild(titleEl);
        item.appendChild(descEl);
        list.appendChild(item);
    });
    
    // Fortschrittsanzeige
    const progress = document.createElement('div');
    const foundCount = easterEggsFound.length;
    const totalCount = eggList.length;
    progress.textContent = `Gefunden: ${foundCount}/${totalCount}`;
    progress.style.marginTop = '20px';
    progress.style.textAlign = 'center';
    progress.style.color = '#f8f8f2';
    
    // Schließen-Button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Schließen';
    closeBtn.className = 'easter-egg-close-btn';
    closeBtn.onclick = () => modal.remove();
    
    // Zusammenbauen
    content.appendChild(title);
    content.appendChild(list);
    content.appendChild(progress);
    content.appendChild(closeBtn);
    modal.appendChild(backdrop);
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Easter Egg für das Finden der Liste markieren
    markEasterEggFound('egg-list');
}

/**
 * Initialisiert das Sekunden-Klick Easter Egg
 */
function initSecondsClickEasterEgg() {
    const secondsElement = document.getElementById('seconds');
    if (!secondsElement) return;
    
    // Füge Hover-Effekt hinzu als Hinweis
    secondsElement.style.cursor = 'pointer';
    secondsElement.title = 'Klick mich! 😊';
    
    secondsElement.addEventListener('click', () => {
        const now = Date.now();
        
        // Reset wenn zu viel Zeit vergangen ist
        if (now - lastClickTime > CLICK_TIMEOUT) {
            secretClickCount = 0;
        }
        
        secretClickCount++;
        lastClickTime = now;
        
        // Visuelles Feedback bei jedem Klick
        secondsElement.style.transform = `scale(${1 + secretClickCount * 0.05})`;
        setTimeout(() => {
            secondsElement.style.transform = 'scale(1)';
        }, 100);
        
        // Aktiviere Easter Egg bei 5 Klicks
        if (secretClickCount >= REQUIRED_CLICKS) {
            secretClickCount = 0;
            activateFloatingHearts();
        }
    });
}

/**
 * Initialisiert das Tastatur-Easter Egg
 */
function initKeyboardEasterEggs() {
    document.addEventListener('keypress', (e) => {
        // Ignoriere Eingaben in Formularfeldern
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        typedString += e.key.toLowerCase();
        
        // Behalte nur die letzten Zeichen
        if (typedString.length > TYPING_BUFFER_SIZE) {
            typedString = typedString.slice(-TYPING_BUFFER_SIZE);
        }
        
        // Prüfe auf Easter Eggs
        if (typedString.includes('love')) {
            typedString = '';
            markEasterEggFound('love-rain');
            activateFloatingHearts(5000);
        }
        
        if (typedString.includes('god') || typedString.includes('jesus')) {
            typedString = '';
            activateChristianSymbols();
        }
        
        // VERBESSERUNG: Füge weitere Keywords hinzu
        // z.B. "eva", "yannik", "forever", etc.
    });
}

/**
 * Initialisiert das Privacy-Klick Easter Egg
 */
function initPrivacyClickEasterEgg() {
    // Suche nach dem Privacy-Text (muss angepasst werden je nach HTML)
    const privacyElement = document.querySelector('.privacy-text, .info-footer, .app-version');
    if (!privacyElement) return;
    
    let privacyClickCount = 0;
    let privacyLastClickTime = 0;
    
    privacyElement.style.cursor = 'help';
    privacyElement.title = 'Psst... hier ist ein Geheimnis versteckt!';
    
    privacyElement.addEventListener('click', () => {
        const now = Date.now();
        
        if (now - privacyLastClickTime > 2000) {
            privacyClickCount = 0;
        }
        
        privacyClickCount++;
        privacyLastClickTime = now;
        
        if (privacyClickCount >= 5) {
            privacyClickCount = 0;
            showAllEasterEggs();
        }
    });
}

/**
 * Initialisiert alle Easter Eggs
 */
function initEasterEggs() {
    // Initialisiere alle Easter Eggs
    initSecondsClickEasterEgg();
    initKeyboardEasterEggs();
    initPrivacyClickEasterEgg();
    
    // VERBESSERUNG: Konami Code Easter Egg
    // ↑ ↑ ↓ ↓ ← → ← → B A
    
    // VERBESSERUNG: Shake Detection für Mobile
    // if (window.DeviceMotionEvent) { ... }
    
    console.log('🎮 Easter Eggs geladen! Viel Spaß beim Entdecken!');
}

// Exportiere Modul
window.easterEggsModule = {
    init: initEasterEggs,
    showAll: showAllEasterEggs,
    activateHearts: activateFloatingHearts,
    activateSymbols: activateChristianSymbols
};