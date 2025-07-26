/**
 * main.js - Haupt-Initialisierungsdatei
 * Startet alle Module wenn die Seite geladen ist
 * 
 * Für Anfänger: Diese Datei ist der Startpunkt - sie lädt alle anderen Module
 */

// Warte bis die Seite komplett geladen ist
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Eva & Yannik Website wird gestartet...');
    
    try {
        // 1. Countdown Timer starten
        const countdown = new CountdownTimer();
        countdown.start();
        console.log('✅ Countdown gestartet');
        
        // 2. UI Controls initialisieren (Buttons und Menüs)
        const uiControls = new UIControls();
        uiControls.init();
        console.log('✅ UI Controls initialisiert');
        
        // 3. Meilensteine anzeigen
        const milestones = new MilestonesTracker();
        milestones.init();
        console.log('✅ Meilensteine geladen');
        
        // 4. Splash Screen (Willkommensfenster)
        const splashScreen = new SplashScreen();
        splashScreen.init();
        console.log('✅ Splash Screen bereit');
        
        // 5. Easter Eggs aktivieren
        if (window.EasterEggs) {
            const easterEggs = new EasterEggs();
            easterEggs.init();
            console.log('✅ Easter Eggs aktiviert');
        }
        
        // 6. Konfetti-System bereitstellen
        window.triggerConfetti = function() {
            // Konfetti-Animation (falls implementiert)
            console.log('🎊 Konfetti!');
            // TODO: Konfetti-Animation hinzufügen
        };
        
        console.log('✨ Website erfolgreich geladen!');
        
    } catch (error) {
        console.error('❌ Fehler beim Laden:', error);
    }
});

// Globale Fehlerbehandlung
window.addEventListener('error', function(event) {
    console.error('Globaler Fehler:', event.error);
});

// Performance-Logging (optional)
window.addEventListener('load', function() {
    // Lade-Performance messen
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Seite in ${loadTime}ms geladen`);
    }
});