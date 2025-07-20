/**
 * DARK MODE MODUL
 * Von: MrMcMicky (Michael)
 * Version: 1.0
 * 
 * Dieses Modul implementiert die Dark Mode Funktionalität
 * für die Eva & Yannik Website.
 * 
 * FUNKTIONEN:
 * - Manuelles Umschalten zwischen Light/Dark Mode
 * - Automatische Erkennung der System-Einstellung
 * - Speicherung der Präferenz im localStorage
 * - Sanfte Übergänge zwischen den Themes
 * 
 * KONZEPTE FÜR YANNIK:
 * 
 * 1. localStorage - Der Browser-Speicher
 *    localStorage ist wie ein kleiner Speicher im Browser,
 *    wo wir Daten speichern können, die auch nach dem
 *    Schließen des Browsers erhalten bleiben.
 * 
 * 2. Media Queries in JavaScript
 *    Mit window.matchMedia können wir CSS Media Queries
 *    in JavaScript nutzen und auf Änderungen reagieren.
 * 
 * 3. Event Listener Pattern
 *    Wir "hören" auf verschiedene Events (Klicks, Änderungen)
 *    und reagieren darauf mit unseren Funktionen.
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Transition beim ersten Laden verhindern
 * - Keyboard Shortcut (z.B. Ctrl+D) für schnelles Umschalten
 * - Verschiedene Dark Mode Stufen (Dim, Dark, Midnight)
 * - Zeitbasiertes automatisches Umschalten
 */

window.darkModeModule = (function() {
    'use strict';
    
    // ========================================
    // KONSTANTEN UND KONFIGURATION
    // ========================================
    
    // Schlüssel für localStorage
    const STORAGE_KEY = 'eva-yannik-theme';
    
    // Mögliche Theme-Werte
    const THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        AUTO: 'auto' // Folgt System-Einstellung
    };
    
    // DOM Elemente (werden in init() gesetzt)
    let darkModeToggle = null;
    let darkModeSwitch = null;
    let rootElement = null;
    
    // Aktueller Theme-Status
    let currentTheme = THEMES.AUTO;
    let systemPrefersDark = false;
    
    // ========================================
    // HILFSFUNKTIONEN
    // ========================================
    
    /**
     * Prüft ob das System Dark Mode bevorzugt
     * @returns {boolean} true wenn System im Dark Mode ist
     */
    function checkSystemPreference() {
        // window.matchMedia prüft CSS Media Queries
        // prefers-color-scheme: dark ist true wenn System Dark Mode hat
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    /**
     * Lädt die gespeicherte Theme-Präferenz
     * @returns {string} Das gespeicherte Theme oder 'auto'
     */
    function loadThemePreference() {
        try {
            // localStorage.getItem liest Daten aus dem Browser-Speicher
            const saved = localStorage.getItem(STORAGE_KEY);
            
            // Prüfe ob gespeicherter Wert gültig ist
            if (saved && Object.values(THEMES).includes(saved)) {
                return saved;
            }
        } catch (error) {
            // Falls localStorage nicht verfügbar ist (z.B. Private Mode)
            console.warn('localStorage nicht verfügbar:', error);
        }
        
        // Standard: Auto (folgt System)
        return THEMES.AUTO;
    }
    
    /**
     * Speichert die Theme-Präferenz
     * @param {string} theme - Das zu speichernde Theme
     */
    function saveThemePreference(theme) {
        try {
            // localStorage.setItem speichert Daten im Browser
            localStorage.setItem(STORAGE_KEY, theme);
            console.log(`✅ Theme gespeichert: ${theme}`);
        } catch (error) {
            console.warn('Konnte Theme nicht speichern:', error);
        }
    }
    
    /**
     * Wendet das Theme auf die Website an
     * @param {boolean} isDark - true für Dark Mode, false für Light Mode
     */
    function applyTheme(isDark) {
        if (!rootElement) return;
        
        // data-theme Attribut steuert welche CSS-Variablen aktiv sind
        if (isDark) {
            rootElement.setAttribute('data-theme', 'dark');
            console.log('🌙 Dark Mode aktiviert');
        } else {
            rootElement.setAttribute('data-theme', 'light');
            console.log('☀️ Light Mode aktiviert');
        }
        
        // Update Toggle-Button Status
        updateToggleUI(isDark);
        
        // Event für andere Module die reagieren möchten
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { isDark: isDark }
        }));
    }
    
    /**
     * Aktualisiert die UI des Toggle-Buttons
     * @param {boolean} isDark - true wenn Dark Mode aktiv
     */
    function updateToggleUI(isDark) {
        if (!darkModeSwitch) return;
        
        // Toggle den Switch
        darkModeSwitch.checked = isDark;
        
        // Entferne disabled Status
        darkModeSwitch.disabled = false;
        darkModeToggle.classList.remove('disabled');
        
        // Update Badge Text
        const badge = darkModeToggle.querySelector('.setting-badge');
        if (badge) {
            badge.style.display = 'none'; // Verstecke "Coming soon"
        }
    }
    
    /**
     * Berechnet welches Theme aktiv sein sollte
     * @returns {boolean} true wenn Dark Mode aktiv sein soll
     */
    function shouldUseDarkMode() {
        switch (currentTheme) {
            case THEMES.DARK:
                return true;
            case THEMES.LIGHT:
                return false;
            case THEMES.AUTO:
            default:
                return systemPrefersDark;
        }
    }
    
    /**
     * Toggle zwischen Light und Dark Mode
     */
    function toggleTheme() {
        // Wenn Auto-Mode aktiv, wechsle basierend auf aktuellem Zustand
        if (currentTheme === THEMES.AUTO) {
            currentTheme = systemPrefersDark ? THEMES.LIGHT : THEMES.DARK;
        } else {
            // Sonst einfach togglen
            currentTheme = currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
        }
        
        // Speichere und wende an
        saveThemePreference(currentTheme);
        applyTheme(shouldUseDarkMode());
    }
    
    /**
     * Behandelt Änderungen der System-Präferenz
     */
    function handleSystemPreferenceChange() {
        systemPrefersDark = checkSystemPreference();
        
        // Nur anwenden wenn Auto-Mode aktiv ist
        if (currentTheme === THEMES.AUTO) {
            applyTheme(systemPrefersDark);
        }
    }
    
    /**
     * Erstellt den funktionierenden Dark Mode Toggle
     */
    function createDarkModeToggle() {
        // Finde die Dark Mode Setting-Zeile
        darkModeToggle = document.querySelector('.setting-item');
        if (!darkModeToggle) {
            console.error('Dark Mode Toggle Element nicht gefunden!');
            return;
        }
        
        // Erstelle einen echten Toggle-Switch
        const switchHTML = `
            <label class="switch-wrapper">
                <input type="checkbox" id="darkModeSwitch" class="switch-input">
                <span class="switch-slider"></span>
            </label>
        `;
        
        // Ersetze den disabled Switch
        const controlDiv = darkModeToggle.querySelector('.setting-control');
        if (controlDiv) {
            controlDiv.innerHTML = switchHTML;
            darkModeSwitch = document.getElementById('darkModeSwitch');
            
            // Event Listener für Toggle
            darkModeSwitch.addEventListener('change', function() {
                toggleTheme();
            });
        }
    }
    
    /**
     * Fügt die notwendigen CSS-Styles für den Toggle hinzu
     */
    function addToggleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Dark Mode Toggle Styles */
            .switch-wrapper {
                position: relative;
                display: inline-block;
                width: 48px;
                height: 24px;
            }
            
            .switch-input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            
            .switch-slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .3s;
                border-radius: 24px;
            }
            
            .switch-slider:before {
                position: absolute;
                content: "";
                height: 18px;
                width: 18px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
            }
            
            .switch-input:checked + .switch-slider {
                background-color: var(--primary);
            }
            
            .switch-input:checked + .switch-slider:before {
                transform: translateX(24px);
            }
            
            /* Dark Mode spezifische Anpassungen */
            [data-theme="dark"] .info-overlay,
            [data-theme="dark"] .settings-overlay,
            [data-theme="dark"] .bible-overlay {
                background: var(--overlay-bg);
            }
            
            [data-theme="dark"] .info-content,
            [data-theme="dark"] .settings-content,
            [data-theme="dark"] .bible-content {
                background: var(--background-secondary);
                color: var(--text);
            }
            
            [data-theme="dark"] .info-item,
            [data-theme="dark"] .setting-item {
                background: var(--card-bg);
                color: var(--text);
            }
            
            [data-theme="dark"] .version-history-content {
                background: var(--background-secondary);
                color: var(--text);
            }
            
            /* Countdown Elemente */
            [data-theme="dark"] .time {
                background: var(--card-bg);
                color: var(--countdown-text);
                border: 1px solid var(--border-color);
            }
            
            [data-theme="dark"] .time .label {
                color: var(--text-light);
            }
        `;
        document.head.appendChild(style);
    }
    
    // ========================================
    // ÖFFENTLICHE API
    // ========================================
    
    return {
        /**
         * Initialisiert das Dark Mode Modul
         */
        init: function() {
            console.log('🌓 Dark Mode Modul wird initialisiert...');
            
            // Setze Root Element
            rootElement = document.documentElement;
            
            // Lade Präferenzen
            currentTheme = loadThemePreference();
            systemPrefersDark = checkSystemPreference();
            
            // Füge Styles hinzu
            addToggleStyles();
            
            // Wende initiales Theme an
            applyTheme(shouldUseDarkMode());
            
            // Warte bis Settings-Menü geladen ist
            setTimeout(() => {
                createDarkModeToggle();
            }, 100);
            
            // Höre auf System-Änderungen
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            // Moderne Browser
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleSystemPreferenceChange);
            } else {
                // Ältere Browser
                mediaQuery.addListener(handleSystemPreferenceChange);
            }
            
            // Keyboard Shortcut: Alt+D für Dark Mode Toggle
            document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 'd') {
                    e.preventDefault();
                    toggleTheme();
                }
            });
            
            console.log('✅ Dark Mode Modul initialisiert');
        },
        
        /**
         * Öffentliche Methode zum Theme wechseln
         */
        toggle: toggleTheme,
        
        /**
         * Gibt aktuelles Theme zurück
         * @returns {string} Aktuelles Theme
         */
        getCurrentTheme: function() {
            return currentTheme;
        },
        
        /**
         * Setzt ein spezifisches Theme
         * @param {string} theme - 'light', 'dark' oder 'auto'
         */
        setTheme: function(theme) {
            if (Object.values(THEMES).includes(theme)) {
                currentTheme = theme;
                saveThemePreference(theme);
                applyTheme(shouldUseDarkMode());
            }
        }
    };
})();