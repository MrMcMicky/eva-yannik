/**
 * MILESTONES MODUL
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul verwaltet die Meilensteine eurer Beziehung.
 * Es zeigt vergangene und zukünftige wichtige Daten an.
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. Arrays und Objekte sind perfekt für strukturierte Daten
 * 2. DOM-Manipulation: createElement() ist sicherer als innerHTML
 * 3. Responsive Design: Mobile vs Desktop unterschiedliche Darstellung
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Daten aus JSON-Datei laden (einfacher zu pflegen)
 * - Animationen beim Erreichen neuer Meilensteine
 * - Push-Benachrichtigungen für kommende Meilensteine
 * - Eigene Meilensteine hinzufügen können
 */

// Konfiguration für mobile Ansicht
const MOBILE_BREAKPOINT = 768; // Pixel
let showReachedMilestones = false;

/**
 * Formatiert ein Datum in deutsches Format
 * @param {Date} date - Das zu formatierende Datum
 * @returns {string} - Formatiertes Datum (TT.MM.JJJJ)
 */
function formatDate(date) {
    // VERBESSERUNG: Verwende Intl.DateTimeFormat für bessere Lokalisierung
    // const formatter = new Intl.DateTimeFormat('de-CH');
    // return formatter.format(date);
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // +1 weil Monate bei 0 beginnen!
    const year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

/**
 * Berechnet die Differenz zwischen zwei Daten in Tagen
 * @param {Date} from - Startdatum
 * @param {Date} to - Enddatum
 * @returns {number} - Anzahl Tage zwischen den Daten
 */
function getDaysDiff(from, to) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    return Math.floor((to - from) / MS_PER_DAY);
}

/**
 * Definition aller Meilensteine
 * TIPP: Du könntest hier eigene, persönliche Meilensteine hinzufügen!
 */
const MILESTONES = [
    { label: '1 Woche zusammen', days: 7 },
    { label: '1 Monat zusammen', days: 30 },
    { label: '100 Tage zusammen', days: 100 },
    { label: '6 Monate zusammen', days: 183 }, // ~6 Monate (nicht exakt wegen unterschiedlicher Monatslängen)
    { label: '200 Tage zusammen', days: 200 },
    { label: '1 Jahr zusammen ❤️', days: 365 }, // Emoji für besondere Meilensteine!
    { label: '1.5 Jahre zusammen', days: 547 },
    { label: '500 Tage zusammen', days: 500 },
    { label: '2 Jahre zusammen', days: 730 },
    { label: '750 Tage zusammen', days: 750 },
    { label: '1000 Tage zusammen 🎉', days: 1000 }, // Großer Meilenstein!
    { label: '3 Jahre zusammen', days: 1095 },
    { label: '4 Jahre zusammen', days: 1460 },
    { label: '5 Jahre zusammen', days: 1825 },
    { label: '10 Jahre zusammen 💍', days: 3650 }, // Vielleicht Zeit für einen Ring? 😉
    { label: '25 Jahre zusammen (Silberhochzeit)', days: 9125 },
    { label: '50 Jahre zusammen (Goldene Hochzeit)', days: 18250 }
];

/**
 * Erstellt ein einzelnes Meilenstein-Element
 * @param {Object} milestone - Meilenstein-Objekt
 * @param {Date} startDate - Startdatum der Beziehung
 * @param {Date} now - Aktuelles Datum
 * @returns {HTMLElement} - Das erstellte Listenelement
 */
function createMilestoneElement(milestone, startDate, now) {
    const milestoneDate = new Date(startDate.getTime() + milestone.days * 24 * 60 * 60 * 1000);
    const daysDiff = getDaysDiff(milestoneDate, now);
    
    // Erstelle Listenelement
    const li = document.createElement('li');
    
    // Titel des Meilensteins
    const title = document.createElement('div');
    title.className = 'milestone-title';
    title.textContent = milestone.label;
    
    // Detail-Informationen
    const detail = document.createElement('div');
    detail.className = 'milestone-detail';
    
    // Prüfe ob Meilenstein erreicht wurde
    if (now >= milestoneDate) {
        li.className = 'reached';
        detail.textContent = `Erreicht am ${formatDate(milestoneDate)} (vor ${Math.abs(daysDiff)} Tagen)`;
        
        // VERBESSERUNG: Füge eine kleine Animation für kürzlich erreichte Meilensteine hinzu
        if (Math.abs(daysDiff) < 7) {
            li.classList.add('recently-reached');
        }
    } else {
        li.className = 'upcoming';
        detail.textContent = `In ${daysDiff} Tagen am ${formatDate(milestoneDate)}`;
        
        // VERBESSERUNG: Markiere bald kommende Meilensteine
        if (daysDiff < 30) {
            li.classList.add('coming-soon');
        }
    }
    
    // Füge Elemente zusammen
    li.appendChild(title);
    li.appendChild(detail);
    
    return li;
}

/**
 * Rendert alle Meilensteine in die Liste
 */
function renderMilestones() {
    const startDate = new Date(2025, 0, 21); // 21. Januar 2025 (Monate beginnen bei 0!)
    const now = new Date();
    
    // Finde das Listen-Element
    const list = document.getElementById('milestones-list');
    if (!list) {
        console.error('Meilenstein-Liste nicht gefunden!');
        return;
    }
    
    // Leere die Liste (für Re-Rendering)
    list.innerHTML = '';
    
    // Erstelle alle Meilenstein-Elemente
    MILESTONES.forEach(milestone => {
        const element = createMilestoneElement(milestone, startDate, now);
        list.appendChild(element);
    });
    
    // Update Mobile UI nach dem Rendern
    updateMobileUI();
}

/**
 * Prüft ob wir uns in der mobilen Ansicht befinden
 * @returns {boolean} - true wenn Mobile, false wenn Desktop
 */
function isMobileView() {
    return window.innerWidth < MOBILE_BREAKPOINT;
}

/**
 * Aktualisiert die UI basierend auf der Bildschirmgröße
 */
function updateMobileUI() {
    const toggleBtn = document.getElementById('toggleReachedBtn');
    const milestoneItems = document.querySelectorAll('#milestones-list li');
    
    if (!toggleBtn) return;
    
    if (isMobileView()) {
        // Mobile: Zeige Toggle-Button und verstecke erreichte Meilensteine initial
        toggleBtn.classList.add('mobile-visible');
        toggleBtn.style.display = 'flex';
        
        milestoneItems.forEach(item => {
            if (item.classList.contains('reached')) {
                if (showReachedMilestones) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            }
        });
    } else {
        // Desktop: Verstecke Button und zeige alle Meilensteine
        toggleBtn.classList.remove('mobile-visible');
        toggleBtn.style.display = 'none';
        
        milestoneItems.forEach(item => {
            item.classList.remove('hidden');
        });
    }
}

/**
 * Toggle-Funktion für erreichte Meilensteine (Mobile)
 */
function toggleReachedMilestones() {
    showReachedMilestones = !showReachedMilestones;
    
    const toggleBtn = document.getElementById('toggleReachedBtn');
    if (toggleBtn) {
        toggleBtn.classList.toggle('active', showReachedMilestones);
    }
    
    updateMobileUI();
}

/**
 * Initialisiert das Meilenstein-System
 */
function initMilestones() {
    // Render Meilensteine
    renderMilestones();
    
    // Event Listener für Toggle-Button
    const toggleBtn = document.getElementById('toggleReachedBtn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleReachedMilestones);
    }
    
    // Resize Handler mit Debouncing für bessere Performance
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateMobileUI, 100);
    });
    
    // VERBESSERUNG: Update Meilensteine um Mitternacht
    // So werden neue Meilensteine automatisch angezeigt
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const msUntilMidnight = tomorrow - now;
    setTimeout(() => {
        renderMilestones();
        // Dann jeden Tag um Mitternacht updaten
        setInterval(renderMilestones, 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
}

// Exportiere Funktionen
window.milestonesModule = {
    init: initMilestones,
    render: renderMilestones,
    toggle: toggleReachedMilestones
};