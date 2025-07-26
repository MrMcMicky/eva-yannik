/**
 * ui-controls.js - User Interface Kontrollen
 * Verwaltet alle Buttons, Menüs und Overlays
 * 
 * Für Anfänger: Dieser Code steuert was passiert, wenn man auf Buttons klickt
 */

class UIControls {
    constructor() {
        // Alle UI-Elemente sammeln
        this.elements = {
            // Hauptbuttons
            menuButton: document.getElementById('newMenuButton'),
            bibleButton: document.getElementById('bibleButton'),
            settingsButton: document.getElementById('newSettingsButton'),
            infoButton: document.getElementById('infoButton'),
            
            // Overlays (die Fenster die sich öffnen)
            menuOverlay: document.querySelector('.menu-overlay'),
            bibleOverlay: document.querySelector('.bible-overlay'),
            settingsOverlay: document.querySelector('.settings-overlay'),
            infoOverlay: document.querySelector('.info-overlay'),
            
            // Schließen-Buttons
            closeBible: document.getElementById('closeBible'),
            closeSettings: document.getElementById('closeSettings'),
            closeInfo: document.getElementById('closeInfo'),
            
            // Weitere Overlays
            versionHistoryOverlay: document.querySelector('.version-history-overlay'),
            configStateOverlay: document.querySelector('.config-state-overlay'),
            upcomingFeaturesOverlay: document.querySelector('.upcoming-features-overlay'),
            
            // Spezial-Buttons
            showVersionHistory: document.getElementById('showVersionHistory'),
            showConfigState: document.getElementById('showConfigState'),
            showUpcomingFeatures: document.getElementById('showUpcomingFeatures'),
            closeVersionHistory: document.getElementById('closeVersionHistory'),
            closeConfigState: document.getElementById('closeConfigState'),
            closeUpcomingFeatures: document.getElementById('closeUpcomingFeatures')
        };
        
        // Aktuelle offene Overlays merken
        this.activeOverlays = new Set();
    }
    
    /**
     * Initialisiert alle Event-Listener
     */
    init() {
        // Hauptbuttons
        this.setupButton('menuButton', 'menuOverlay');
        this.setupButton('bibleButton', 'bibleOverlay');
        this.setupButton('settingsButton', 'settingsOverlay');
        this.setupButton('infoButton', 'infoOverlay');
        
        // Schließen-Buttons
        this.setupCloseButton('closeBible', 'bibleOverlay');
        this.setupCloseButton('closeSettings', 'settingsOverlay');
        this.setupCloseButton('closeInfo', 'infoOverlay');
        
        // Spezial-Buttons in Info-Panel
        this.setupButton('showVersionHistory', 'versionHistoryOverlay');
        this.setupButton('showConfigState', 'configStateOverlay');
        this.setupButton('showUpcomingFeatures', 'upcomingFeaturesOverlay');
        
        // Schließen-Buttons für Spezial-Overlays
        this.setupCloseButton('closeVersionHistory', 'versionHistoryOverlay');
        this.setupCloseButton('closeConfigState', 'configStateOverlay');
        this.setupCloseButton('closeUpcomingFeatures', 'upcomingFeaturesOverlay');
        
        // ESC-Taste zum Schließen
        this.setupEscapeKey();
        
        // Klick außerhalb schließt Overlay
        this.setupOutsideClick();
    }
    
    /**
     * Richtet einen Button ein, der ein Overlay öffnet
     * @param {string} buttonId - ID des Buttons
     * @param {string} overlayId - ID des Overlays
     */
    setupButton(buttonId, overlayId) {
        const button = this.elements[buttonId];
        const overlay = this.elements[overlayId];
        
        if (!button || !overlay) {
            console.warn(`Button ${buttonId} oder Overlay ${overlayId} nicht gefunden`);
            return;
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openOverlay(overlayId);
        });
    }
    
    /**
     * Richtet einen Schließen-Button ein
     * @param {string} buttonId - ID des Schließen-Buttons
     * @param {string} overlayId - ID des zu schließenden Overlays
     */
    setupCloseButton(buttonId, overlayId) {
        const button = this.elements[buttonId];
        const overlay = this.elements[overlayId];
        
        if (!button || !overlay) {
            console.warn(`Close-Button ${buttonId} oder Overlay ${overlayId} nicht gefunden`);
            return;
        }
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeOverlay(overlayId);
        });
    }
    
    /**
     * Öffnet ein Overlay mit Animation
     * @param {string} overlayId - ID des Overlays
     */
    openOverlay(overlayId) {
        const overlay = this.elements[overlayId];
        if (!overlay) return;
        
        // Overlay anzeigen
        overlay.classList.add('active');
        this.activeOverlays.add(overlayId);
        
        // Body scrollen verhindern
        document.body.style.overflow = 'hidden';
        
        // Animation
        requestAnimationFrame(() => {
            overlay.style.opacity = '1';
        });
    }
    
    /**
     * Schließt ein Overlay mit Animation
     * @param {string} overlayId - ID des Overlays
     */
    closeOverlay(overlayId) {
        const overlay = this.elements[overlayId];
        if (!overlay) return;
        
        // Animation
        overlay.style.opacity = '0';
        
        // Nach Animation entfernen
        setTimeout(() => {
            overlay.classList.remove('active');
            this.activeOverlays.delete(overlayId);
            
            // Body scrollen wieder erlauben wenn keine Overlays mehr offen
            if (this.activeOverlays.size === 0) {
                document.body.style.overflow = '';
            }
        }, 300);
    }
    
    /**
     * Schließt alle offenen Overlays
     */
    closeAllOverlays() {
        this.activeOverlays.forEach(overlayId => {
            this.closeOverlay(overlayId);
        });
    }
    
    /**
     * ESC-Taste schließt aktive Overlays
     */
    setupEscapeKey() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeOverlays.size > 0) {
                // Das zuletzt geöffnete Overlay schließen
                const lastOverlay = Array.from(this.activeOverlays).pop();
                this.closeOverlay(lastOverlay);
            }
        });
    }
    
    /**
     * Klick außerhalb des Overlay-Inhalts schließt es
     */
    setupOutsideClick() {
        // Für jedes Overlay
        Object.entries(this.elements).forEach(([key, element]) => {
            if (key.includes('Overlay') && element) {
                element.addEventListener('click', (e) => {
                    // Nur schließen wenn direkt auf Overlay geklickt (nicht auf Inhalt)
                    if (e.target === element) {
                        this.closeOverlay(key);
                    }
                });
            }
        });
    }
}

// Export für andere Module
window.UIControls = UIControls;