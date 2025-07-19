/**
 * HAUPTSKRIPT - EVA & YANNIK WEBSITE
 * Von: MrMcMicky (Michael)
 * Version: 3.5.5 Documented
 * 
 * Dies ist der Einstiegspunkt für alle JavaScript-Funktionalitäten.
 * Hier werden alle Module initialisiert und koordiniert.
 * 
 * ARCHITEKTUR-ÜBERSICHT:
 * - countdown.js: Timer-Funktionalität
 * - milestones.js: Meilenstein-System
 * - easter-eggs.js: Versteckte Features
 * - menu.js: Navigations-Menüs
 * - ui-animations.js: Animationen und Übergänge
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. DOMContentLoaded wartet bis HTML vollständig geladen ist
 * 2. Module Pattern hilft Code zu organisieren
 * 3. Error Handling ist wichtig für Stabilität
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Service Worker für Offline-Funktionalität
 * - Progressive Web App (PWA) Manifest
 * - Lazy Loading für bessere Performance
 * - Analytics für Nutzungsstatistiken
 */

// Warte bis DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Eva & Yannik Website wird initialisiert...');
    
    // Performance Messung starten
    const startTime = performance.now();
    
    try {
        // 1. Initialisiere Countdown
        if (window.countdownModule) {
            window.countdownModule.init();
            console.log('✅ Countdown initialisiert');
        } else {
            console.error('❌ Countdown Modul nicht gefunden');
        }
        
        // 2. Initialisiere Meilensteine
        if (window.milestonesModule) {
            window.milestonesModule.init();
            console.log('✅ Meilensteine initialisiert');
        } else {
            console.error('❌ Meilenstein Modul nicht gefunden');
        }
        
        // 3. Initialisiere Easter Eggs
        if (window.easterEggsModule) {
            window.easterEggsModule.init();
            console.log('✅ Easter Eggs initialisiert');
        } else {
            console.error('❌ Easter Egg Modul nicht gefunden');
        }
        
        // 4. Initialisiere Menü-System
        if (window.menuModule) {
            window.menuModule.init();
            console.log('✅ Menü-System initialisiert');
        } else {
            console.error('❌ Menü Modul nicht gefunden');
        }
        
        // 5. Initialisiere UI Animationen
        if (window.uiAnimationsModule) {
            window.uiAnimationsModule.init();
            console.log('✅ UI Animationen initialisiert');
        } else {
            console.error('❌ UI Animations Modul nicht gefunden');
        }
        
        // 6. Initialisiere Performance-Optimierungen
        if (window.performanceModule) {
            window.performanceModule.init();
            console.log('✅ Performance-Optimierungen initialisiert');
        } else {
            console.error('❌ Performance Modul nicht gefunden');
        }
        
    } catch (error) {
        console.error('❌ Fehler bei der Initialisierung:', error);
        // Zeige Fehlermeldung für Entwickler
        showDeveloperError(error);
    }
    
    // Performance Log
    const loadTime = performance.now() - startTime;
    console.log(`⏱️ Initialisierung abgeschlossen in ${loadTime.toFixed(2)}ms`);
    
    // Entwickler-Modus aktivieren (für Debugging)
    initDeveloperMode();
    
    // PWA Service Worker registrieren (wenn verfügbar)
    registerServiceWorker();
});

/**
 * Zeigt Entwickler-Fehler in der Konsole
 * @param {Error} error - Der aufgetretene Fehler
 */
function showDeveloperError(error) {
    // Nur in Entwicklungsumgebung anzeigen
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            max-width: 400px;
            z-index: 99999;
        `;
        errorDiv.textContent = `Error: ${error.message}`;
        document.body.appendChild(errorDiv);
        
        // Entferne nach 10 Sekunden
        setTimeout(() => errorDiv.remove(), 10000);
    }
}

/**
 * Aktiviert Entwickler-Modus mit nützlichen Shortcuts
 * TIPP: Drücke Ctrl+Shift+D für Debug-Infos!
 */
function initDeveloperMode() {
    let keys = {};
    
    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        
        // Ctrl+Shift+D = Debug Mode
        if (keys['Control'] && keys['Shift'] && keys['d']) {
            showDebugInfo();
        }
        
        // Ctrl+Shift+R = Reload ohne Cache
        if (keys['Control'] && keys['Shift'] && keys['r']) {
            e.preventDefault();
            window.location.reload(true);
        }
    });
    
    document.addEventListener('keyup', (e) => {
        delete keys[e.key];
    });
}

/**
 * Zeigt Debug-Informationen
 */
function showDebugInfo() {
    const debugInfo = {
        version: '3.5.5 Documented',
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        localStorage: Object.keys(localStorage).length + ' items',
        performance: {
            memory: performance.memory ? 
                `${(performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB` : 
                'N/A',
            loadTime: `${performance.timing.loadEventEnd - performance.timing.navigationStart}ms`
        }
    };
    
    console.table(debugInfo);
    alert('Debug-Infos in der Konsole! 🔍');
}

/**
 * Registriert Service Worker für Offline-Funktionalität
 * VERBESSERUNG: Implementiere einen Service Worker für bessere Performance
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            // Momentan deaktiviert - kann später implementiert werden
            // const registration = await navigator.serviceWorker.register('/sw.js');
            // console.log('✅ Service Worker registriert:', registration);
        } catch (error) {
            console.log('Service Worker Registration fehlgeschlagen:', error);
        }
    }
}

/**
 * Globale Fehlerbehandlung
 * Fängt alle nicht behandelten Fehler ab
 */
window.addEventListener('error', (event) => {
    console.error('Globaler Fehler:', event.error);
    // VERBESSERUNG: Sende Fehler an Logging-Service
    // z.B. Sentry, LogRocket, etc.
});

/**
 * Behandle unhandled Promise Rejections
 */
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // VERBESSERUNG: Auch diese an Logging-Service senden
});

/**
 * Performance Monitoring
 * TIPP: Nutze die Performance API für detaillierte Messungen
 */
window.addEventListener('load', () => {
    // Warte einen Moment damit alle async Operationen fertig sind
    setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('📊 Performance Metriken:');
            console.log(`- DNS Lookup: ${perfData.domainLookupEnd - perfData.domainLookupStart}ms`);
            console.log(`- TCP Verbindung: ${perfData.connectEnd - perfData.connectStart}ms`);
            console.log(`- Antwortzeit: ${perfData.responseEnd - perfData.requestStart}ms`);
            console.log(`- DOM Verarbeitung: ${perfData.domComplete - perfData.domInteractive}ms`);
            console.log(`- Gesamte Ladezeit: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
        }
    }, 0);
});

// Exportiere nützliche Funktionen für Debugging
window.evaYannikDebug = {
    showDebugInfo,
    showAllEasterEggs: () => window.easterEggsModule?.showAll(),
    resetLocalStorage: () => {
        if (confirm('Wirklich alle gespeicherten Daten löschen?')) {
            localStorage.clear();
            location.reload();
        }
    },
    version: '3.5.5 Documented'
};