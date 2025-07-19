/**
 * COUNTDOWN TIMER MODUL
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul kümmert sich um den Countdown-Timer der auf der Hauptseite angezeigt wird.
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. Date-Objekte in JavaScript sind sehr mächtig für Zeitberechnungen
 * 2. setInterval() ruft eine Funktion regelmäßig auf (hier jede Sekunde)
 * 3. Math.floor() rundet immer ab (wichtig für Zeitberechnungen)
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Performance: requestAnimationFrame() statt setInterval() für smoothere Updates
 * - Zeitzonen: Moment.js oder date-fns für bessere Zeitzonenunterstützung
 * - Memory Leaks: Interval clearen wenn die Seite verlassen wird
 */

// Speichere das Interval global, damit wir es später stoppen können
let countdownInterval = null;

/**
 * Hauptfunktion für den Countdown
 * Berechnet die Differenz zwischen jetzt und dem Zieldatum
 */
function updateCountdown() {
    // WICHTIG: '+01:00' gibt die Zeitzone an (Schweizer Zeit)
    // Ohne Zeitzone würde es die Browser-Zeitzone nehmen
    const targetDate = new Date('2026-01-21T00:00:00+01:00');
    const now = new Date();
    
    // Differenz in Millisekunden
    let diff = targetDate - now;
    
    // Sicherheitscheck: Wenn das Datum bereits vorbei ist, zeige 0
    // VERBESSERUNG: Hier könntest du eine Glückwunsch-Nachricht anzeigen
    if (diff < 0) {
        diff = 0;
        // TODO: Zeige "Happy Anniversary!" Message
    }
    
    // Zeitberechnungen (von Millisekunden zu lesbaren Einheiten)
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    // DOM Updates
    // VERBESSERUNG: Verwende querySelector statt getElementById (moderner)
    // VERBESSERUNG: Prüfe ob Elemente existieren bevor du sie updatest
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
    if (minutesEl) minutesEl.textContent = minutes;
    if (secondsEl) secondsEl.textContent = seconds;
    
    // EASTER EGG TIPP: Du könntest bei bestimmten Zahlen spezielle Effekte auslösen
    // z.B. wenn seconds === 14 und minutes === 3 (Pi!)
}

/**
 * Initialisiert den Countdown
 * Sollte aufgerufen werden wenn die Seite geladen ist
 */
function initCountdown() {
    // Erste Aktualisierung sofort (sonst würde es 1 Sekunde dauern)
    updateCountdown();
    
    // Dann jede Sekunde updaten
    // WICHTIG: 1000ms = 1 Sekunde
    countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * Stoppt den Countdown (wichtig für Cleanup)
 * Sollte aufgerufen werden wenn die Seite verlassen wird
 */
function stopCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
    }
}

// Exportiere die Funktionen für andere Module
// LERNPUNKT: In modernem JavaScript verwendet man ES6 Module
// Aber für Kompatibilität nutzen wir hier globale Funktionen
window.countdownModule = {
    init: initCountdown,
    stop: stopCountdown,
    update: updateCountdown
};