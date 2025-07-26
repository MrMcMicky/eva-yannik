/**
 * splash-screen.js - Willkommens-Bildschirm
 * Zeigt einen schönen Begrüßungsbildschirm beim ersten Besuch
 * 
 * Für Anfänger: Dieser Code zeigt das Willkommensfenster am Anfang
 */

class SplashScreen {
    constructor() {
        // Splash Screen Element
        this.splashScreen = document.querySelector('.splash-screen');
        this.closeButton = document.getElementById('closeSplash');
        
        // Wurde Splash Screen heute schon gezeigt?
        this.storageKey = 'eva-yannik-splash-shown';
    }
    
    /**
     * Initialisiert den Splash Screen
     */
    init() {
        if (!this.splashScreen || !this.closeButton) {
            console.warn('Splash Screen Elemente nicht gefunden');
            return;
        }
        
        // Prüfen ob heute schon gezeigt
        if (this.shouldShowToday()) {
            this.show();
        }
        
        // Events einrichten
        this.setupEvents();
    }
    
    /**
     * Prüft ob der Splash Screen heute gezeigt werden soll
     * @returns {boolean} true wenn er gezeigt werden soll
     */
    shouldShowToday() {
        const lastShown = localStorage.getItem(this.storageKey);
        const today = new Date().toDateString();
        
        // Zeige wenn noch nie gezeigt oder nicht heute
        return lastShown !== today;
    }
    
    /**
     * Zeigt den Splash Screen an
     */
    show() {
        // Mit kleiner Verzögerung für sanfte Animation
        setTimeout(() => {
            this.splashScreen.classList.add('active');
            
            // Fokus auf Schließen-Button für Barrierefreiheit
            this.closeButton.focus();
        }, 100);
    }
    
    /**
     * Versteckt den Splash Screen
     */
    hide() {
        // Fade-out Animation
        this.splashScreen.style.opacity = '0';
        
        // Nach Animation komplett verstecken
        setTimeout(() => {
            this.splashScreen.classList.remove('active');
            
            // Merken dass heute schon gezeigt
            const today = new Date().toDateString();
            localStorage.setItem(this.storageKey, today);
        }, 500);
    }
    
    /**
     * Richtet alle Events ein
     */
    setupEvents() {
        // Schließen-Button
        this.closeButton.addEventListener('click', () => this.hide());
        
        // ESC-Taste
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.splashScreen.classList.contains('active')) {
                this.hide();
            }
        });
        
        // Klick außerhalb
        this.splashScreen.addEventListener('click', (e) => {
            if (e.target === this.splashScreen) {
                this.hide();
            }
        });
        
        // Nach 10 Sekunden automatisch schließen
        setTimeout(() => {
            if (this.splashScreen.classList.contains('active')) {
                this.hide();
            }
        }, 10000);
    }
    
    /**
     * Setzt den Splash Screen zurück (für Tests)
     */
    reset() {
        localStorage.removeItem(this.storageKey);
        console.log('Splash Screen zurückgesetzt - wird beim nächsten Laden angezeigt');
    }
}

// Export für andere Module
window.SplashScreen = SplashScreen;