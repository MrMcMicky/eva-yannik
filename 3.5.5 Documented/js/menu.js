/**
 * MENÜ SYSTEM MODUL
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul verwaltet alle Menüs und Overlays der Website.
 * Es kümmert sich um die animierten Buttons und deren Inhalte.
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. CSS Klassen Toggle ist effizienter als inline Styles
 * 2. Event Delegation spart Memory bei vielen ähnlichen Elementen
 * 3. Backdrop-Pattern für Modals ist ein UI/UX Standard
 * 
 * MENÜ-STRUKTUR:
 * - Hauptmenü (Hamburger): Navigation
 * - Bibel-Menü: Bibelverse
 * - Einstellungen: Dark Mode (coming soon)
 * - Info: Über die Website
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Keyboard Navigation (Tab, Escape)
 * - Swipe-Gesten für Mobile
 * - Menü-Positionen anpassen bei kleinen Bildschirmen
 * - Animierte Icons (Lottie oder SVG Animationen)
 */

// Menü-Status
let isMenuOpen = false;
let isAnimating = false;
let activeOverlay = null;

// Alle Menü-Konfigurationen
const MENU_CONFIG = {
    main: {
        button: 'newMenuButton',
        overlay: null, // Hauptmenü hat kein Overlay, nur andere Buttons
        toggleButtons: ['bibleButton', 'newSettingsButton', 'infoButton']
    },
    bible: {
        button: 'bibleButton',
        overlay: 'bibleOverlay',
        closeButton: 'closeBible'
    },
    settings: {
        button: 'newSettingsButton',
        overlay: 'settingsOverlay',
        closeButton: 'closeSettings'
    },
    info: {
        button: 'infoButton',
        overlay: 'infoOverlay',
        closeButton: 'closeInfo'
    },
    upcomingFeatures: {
        button: 'rightMenuButton',
        overlay: 'upcomingFeaturesOverlay',
        closeButton: 'closeUpcomingFeatures'
    },
    versionHistory: {
        button: 'showVersionHistory',
        overlay: 'versionHistoryOverlay',
        closeButton: 'closeVersionHistory'
    }
};

/**
 * Initialisiert das Hauptmenü (Hamburger)
 */
function initMainMenu() {
    const menuButton = document.getElementById(MENU_CONFIG.main.button);
    const toggleButtons = MENU_CONFIG.main.toggleButtons.map(id => document.getElementById(id));
    
    if (!menuButton) {
        console.error('Hauptmenü-Button nicht gefunden!');
        return;
    }
    
    // Setze initialen Zustand
    toggleButtons.forEach(btn => {
        if (btn) {
            btn.style.display = 'block';
            btn.classList.remove('visible');
        }
    });
    
    // Click Handler für Menü-Toggle
    menuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleMainMenu();
    });
    
    // Schließe Menü beim Klick außerhalb
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !menuButton.contains(e.target) && 
            !toggleButtons.some(btn => btn && btn.contains(e.target))) {
            closeMainMenu();
        }
    });
    
    // Speichere Klick-Status für Glow-Effekt
    checkButtonGlowStatus();
}

/**
 * Toggle Hauptmenü mit Animation
 */
function toggleMainMenu() {
    if (isAnimating) return;
    
    isMenuOpen = !isMenuOpen;
    isAnimating = true;
    
    const menuButton = document.getElementById(MENU_CONFIG.main.button);
    const toggleButtons = MENU_CONFIG.main.toggleButtons.map(id => document.getElementById(id));
    
    // Toggle aktiv-Status
    menuButton.classList.toggle('active', isMenuOpen);
    
    if (isMenuOpen) {
        // Öffne mit gestaffelter Animation (von oben nach unten)
        toggleButtons.forEach((btn, index) => {
            if (!btn) return;
            
            // Animations-Properties
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.transitionDelay = `${index * 50 + 50}ms`;
            
            // Force reflow für Animation
            void btn.offsetHeight;
            
            // Starte Animation
            btn.classList.add('visible');
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.opacity = '1';
        });
        
        // Animation fertig
        setTimeout(() => {
            isAnimating = false;
        }, 400);
        
    } else {
        closeMainMenu();
    }
}

/**
 * Schließt das Hauptmenü mit Animation
 */
function closeMainMenu() {
    if (!isMenuOpen) return;
    
    const toggleButtons = MENU_CONFIG.main.toggleButtons.map(id => document.getElementById(id));
    
    // Schließe mit umgekehrter Animation (von unten nach oben)
    toggleButtons.slice().reverse().forEach((btn, index) => {
        if (!btn) return;
        
        btn.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.transitionDelay = `${index * 30}ms`;
        btn.style.transform = 'translateY(-10px) scale(0.95)';
        btn.style.opacity = '0';
        
        setTimeout(() => {
            btn.classList.remove('visible');
            setTimeout(() => {
                btn.style.transform = 'translateY(-20px) scale(0.9)';
                btn.style.transition = '';
                btn.style.transitionDelay = '';
            }, 250);
        }, 50);
    });
    
    // Update Status
    isMenuOpen = false;
    document.getElementById(MENU_CONFIG.main.button)?.classList.remove('active');
    
    setTimeout(() => {
        isAnimating = false;
    }, 350);
}

/**
 * Initialisiert ein Overlay-Menü (Bibel, Settings, Info)
 * @param {string} menuKey - Schlüssel aus MENU_CONFIG
 */
function initOverlayMenu(menuKey) {
    const config = MENU_CONFIG[menuKey];
    if (!config || !config.overlay) return;
    
    const button = document.getElementById(config.button);
    const overlay = document.getElementById(config.overlay);
    const closeButton = document.getElementById(config.closeButton);
    
    if (!button || !overlay) {
        console.error(`Menü ${menuKey} nicht vollständig gefunden`);
        return;
    }
    
    // Öffnen
    button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openOverlay(overlay);
        
        // Speichere dass Button geklickt wurde (für Glow-Effekt)
        saveButtonClickStatus(config.button);
    });
    
    // Schließen via Close-Button
    if (closeButton) {
        closeButton.addEventListener('click', () => closeOverlay(overlay));
    }
    
    // Schließen via Backdrop-Klick
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeOverlay(overlay);
        }
    });
    
    // Schließen via ESC-Taste
    // Wird in openOverlay registriert
}

/**
 * Öffnet ein Overlay mit Animation
 * @param {HTMLElement} overlay - Das zu öffnende Overlay
 */
function openOverlay(overlay) {
    if (!overlay || activeOverlay) return;
    
    activeOverlay = overlay;
    
    // Verschiedene Overlay-Typen haben unterschiedliche Display-Eigenschaften
    if (overlay.id === 'infoOverlay' || overlay.id === 'settingsOverlay' || 
        overlay.id === 'upcomingFeaturesOverlay') {
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'block';
    }
    
    // Force reflow für Animation
    void overlay.offsetHeight;
    
    // Starte Einblend-Animation
    if (overlay.id === 'versionHistoryOverlay' || overlay.id === 'bibleOverlay') {
        overlay.classList.add('active');
    } else {
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }
    
    // Verhindere Scrollen im Hintergrund
    document.body.style.overflow = 'hidden';
    
    // ESC-Taste Handler
    const escHandler = (e) => {
        if (e.key === 'Escape') {
            closeOverlay(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    };
    document.addEventListener('keydown', escHandler);
    
    // Animate developer card if in info overlay
    if (overlay.id === 'infoOverlay') {
        const developerCard = document.getElementById('developerCard');
        if (developerCard) {
            developerCard.classList.remove('animate-in');
            void developerCard.offsetWidth;
            setTimeout(() => {
                developerCard.classList.add('animate-in');
            }, 150);
        }
    }
    
    // VERBESSERUNG: Fokus-Management für Accessibility
    // Setze Fokus auf erstes interaktives Element
    const firstFocusable = overlay.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
    }
}

/**
 * Schließt ein Overlay mit Animation
 * @param {HTMLElement} overlay - Das zu schließende Overlay
 */
function closeOverlay(overlay) {
    if (!overlay || activeOverlay !== overlay) return;
    
    // Starte Ausblend-Animation
    overlay.classList.remove('active', 'show');
    
    // Warte auf Animation
    setTimeout(() => {
        overlay.style.display = 'none';
        activeOverlay = null;
        
        // Erlaube wieder Scrollen
        document.body.style.overflow = '';
    }, 300);
}

/**
 * Prüft und setzt Glow-Status für Buttons
 */
function checkButtonGlowStatus() {
    // Liste aller Buttons die Glow haben können
    const glowButtons = [
        'newMenuButton',
        'bibleButton',
        'newSettingsButton',
        'infoButton',
        'rightMenuButton'
    ];
    
    glowButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button && localStorage.getItem(`${buttonId}Clicked`) === 'true') {
            button.classList.add('hide-glow');
        }
    });
}

/**
 * Speichert dass ein Button geklickt wurde
 * @param {string} buttonId - ID des geklickten Buttons
 */
function saveButtonClickStatus(buttonId) {
    const button = document.getElementById(buttonId);
    if (button && !button.classList.contains('hide-glow')) {
        button.classList.add('hide-glow');
        localStorage.setItem(`${buttonId}Clicked`, 'true');
    }
}

/**
 * Initialisiert das Right Menu Button mit spezieller Funktionalität
 * Öffnet Info und dann Upcoming Features
 */
function initRightMenuButton() {
    const rightMenuButton = document.getElementById('rightMenuButton');
    const infoOverlay = document.getElementById('infoOverlay');
    const upcomingFeaturesOverlay = document.getElementById('upcomingFeaturesOverlay');
    
    if (!rightMenuButton) return;
    
    // Override the standard click handler
    rightMenuButton.removeEventListener('click', rightMenuButton._standardHandler);
    
    rightMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Save button click status
        saveButtonClickStatus('rightMenuButton');
        
        // Open info overlay first
        if (infoOverlay) {
            openOverlay(infoOverlay);
            
            // After 0.5 seconds, open upcoming features (without closing info)
            setTimeout(() => {
                if (upcomingFeaturesOverlay) {
                    upcomingFeaturesOverlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }, 500);
        }
    });
}

/**
 * Initialisiert das Feature Discovery Banner
 * Zeigt einen Hinweis auf neue Features
 */
function initFeatureDiscoveryBanner() {
    const banner = document.getElementById('featureDiscoveryBanner');
    const closeBtn = document.getElementById('closeFeatureBanner');
    const rightMenuBtn = document.getElementById('rightMenuButton');
    
    if (!banner || !closeBtn || !rightMenuBtn) return;
    
    // Prüfe ob Banner bereits geschlossen wurde
    if (localStorage.getItem('featureBannerClosed') === 'true') {
        return;
    }
    
    // Positioniere Banner relativ zum Button
    function positionBanner() {
        const buttonRect = rightMenuBtn.getBoundingClientRect();
        const bannerRect = banner.getBoundingClientRect();
        
        const bannerTop = buttonRect.top + (buttonRect.height / 2) - (bannerRect.height / 2);
        
        banner.style.top = `${bannerTop}px`;
        banner.style.right = `${window.innerWidth - buttonRect.left + 15}px`;
    }
    
    // Zeige Banner nach kurzer Verzögerung
    setTimeout(() => {
        positionBanner();
        window.addEventListener('resize', positionBanner);
        
        banner.style.display = 'flex';
        void banner.offsetHeight; // Force reflow
        
        setTimeout(() => {
            positionBanner();
            banner.style.opacity = '1';
            banner.style.transform = 'translateX(0)';
        }, 50);
    }, 1000);
    
    // Schließen-Handler
    function closeBanner() {
        banner.style.opacity = '0';
        banner.style.transform = 'translateX(10px)';
        setTimeout(() => {
            banner.style.display = 'none';
            localStorage.setItem('featureBannerClosed', 'true');
        }, 300);
    }
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeBanner();
    });
    
    // Verstecke auch wenn Right Menu Button geklickt wird
    rightMenuBtn.addEventListener('click', closeBanner);
}

/**
 * Initialisiert das gesamte Menü-System
 */
function initMenuSystem() {
    // Hauptmenü
    initMainMenu();
    
    // Overlay-Menüs
    initOverlayMenu('bible');
    initOverlayMenu('settings');
    initOverlayMenu('info');
    initOverlayMenu('upcomingFeatures');
    initOverlayMenu('versionHistory');
    
    // Feature Discovery Banner
    initFeatureDiscoveryBanner();
    
    // Special handling for right menu button
    initRightMenuButton();
    
    console.log('✅ Menü-System bereit');
}

// Exportiere Modul
window.menuModule = {
    init: initMenuSystem,
    openOverlay,
    closeOverlay,
    closeMainMenu
};