/**
 * countdown.js - Countdown Timer für Eva & Yannik
 * Zeigt die Zeit seit dem 21. Januar 2025 an
 * 
 * Für Anfänger: Dieser Code berechnet, wie lange Eva und Yannik schon zusammen sind
 */

// Die Klasse CountdownTimer verwaltet unseren Timer
class CountdownTimer {
    constructor() {
        // Das Startdatum: 21. Januar 2025
        this.startDate = new Date('2025-01-21T00:00:00+01:00');
        
        // HTML-Elemente finden und speichern
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            secondsWrapper: document.querySelector('.seconds-wrapper')
        };
        
        // Prüfen ob alle Elemente gefunden wurden
        this.isReady = this.checkElements();
        
        // Konfetti-Animation aktiviert?
        this.confettiEnabled = true;
    }
    
    /**
     * Prüft ob alle benötigten HTML-Elemente existieren
     * @returns {boolean} true wenn alle Elemente da sind
     */
    checkElements() {
        for (let key in this.elements) {
            if (!this.elements[key]) {
                console.warn(`Element '${key}' nicht gefunden`);
                return false;
            }
        }
        return true;
    }
    
    /**
     * Startet den Countdown
     */
    start() {
        if (!this.isReady) {
            console.error('Countdown kann nicht gestartet werden - Elemente fehlen');
            return;
        }
        
        // Sofort einmal updaten
        this.update();
        
        // Dann jede Sekunde updaten
        this.interval = setInterval(() => this.update(), 1000);
        
        // Klick-Event für Sekunden-Animation
        this.setupSecondsClick();
    }
    
    /**
     * Stoppt den Countdown
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
    
    /**
     * Berechnet und zeigt die verstrichene Zeit an
     */
    update() {
        const now = new Date();
        const diff = now - this.startDate;
        
        // Zeit in Tage, Stunden, Minuten und Sekunden umrechnen
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Werte in HTML anzeigen
        this.elements.days.textContent = days;
        this.elements.hours.textContent = this.padZero(hours);
        this.elements.minutes.textContent = this.padZero(minutes);
        this.elements.seconds.textContent = this.padZero(seconds);
        
        // Spezielle Momente prüfen (z.B. volle 100 Tage)
        this.checkSpecialMoments(days, hours, minutes, seconds);
    }
    
    /**
     * Fügt eine führende Null hinzu wenn die Zahl kleiner als 10 ist
     * @param {number} num - Die Zahl
     * @returns {string} Die Zahl mit führender Null
     */
    padZero(num) {
        return num < 10 ? '0' + num : num.toString();
    }
    
    /**
     * Prüft auf besondere Momente (z.B. Jubiläen)
     */
    checkSpecialMoments(days, hours, minutes, seconds) {
        // Bei vollen 100 Tagen
        if (days > 0 && days % 100 === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            this.celebrate(`🎉 ${days} Tage zusammen!`);
        }
        
        // Am Jahrestag (21. eines Monats)
        const today = new Date();
        if (today.getDate() === 21 && hours === 0 && minutes === 0 && seconds === 0) {
            this.celebrate('💕 Happy Monthiversary!');
        }
    }
    
    /**
     * Zeigt eine Celebration-Animation
     * @param {string} message - Die Nachricht
     */
    celebrate(message) {
        if (this.confettiEnabled && window.triggerConfetti) {
            window.triggerConfetti();
        }
        console.log(message);
    }
    
    /**
     * Setup für Klick-Animation auf Sekunden
     */
    setupSecondsClick() {
        this.elements.secondsWrapper.addEventListener('click', () => {
            // Kurze Bounce-Animation
            this.elements.secondsWrapper.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.elements.secondsWrapper.style.transform = 'scale(1)';
            }, 200);
            
            // Easter Egg: Bei 10 Klicks Konfetti
            this.clickCount = (this.clickCount || 0) + 1;
            if (this.clickCount >= 10) {
                this.celebrate('🎊 Secret unlocked!');
                this.clickCount = 0;
            }
        });
    }
}

// Export für andere Module
window.CountdownTimer = CountdownTimer;