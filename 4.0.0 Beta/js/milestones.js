/**
 * milestones.js - Meilensteine Tracking
 * Zeigt wichtige Momente in der Beziehung an
 * 
 * Für Anfänger: Dieser Code verwaltet die besonderen Tage und Ereignisse
 */

class MilestonesTracker {
    constructor() {
        // Start-Datum der Beziehung
        this.startDate = new Date('2025-01-21T00:00:00+01:00');
        
        // Container für Meilensteine
        this.container = document.querySelector('.milestones-grid');
        
        // Button zum Ein/Ausblenden erreichter Meilensteine
        this.toggleButton = document.getElementById('toggleReachedBtn');
        
        // Zeige erreichte Meilensteine?
        this.showReached = true;
        
        // Vordefinierte Meilensteine
        this.milestones = [
            { days: 1, label: 'Erster Tag', emoji: '🌟' },
            { days: 7, label: 'Eine Woche', emoji: '💕' },
            { days: 30, label: 'Ein Monat', emoji: '🎉' },
            { days: 100, label: '100 Tage', emoji: '💯' },
            { days: 182, label: '6 Monate', emoji: '🌈' },
            { days: 365, label: 'Ein Jahr', emoji: '🎊' },
            { days: 500, label: '500 Tage', emoji: '✨' },
            { days: 730, label: '2 Jahre', emoji: '💍' },
            { days: 1000, label: '1000 Tage', emoji: '🏆' },
            { days: 1095, label: '3 Jahre', emoji: '💎' }
        ];
    }
    
    /**
     * Initialisiert das Meilensteine-System
     */
    init() {
        if (!this.container) {
            console.warn('Meilensteine-Container nicht gefunden');
            return;
        }
        
        // Meilensteine anzeigen
        this.update();
        
        // Toggle-Button einrichten
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggleReached());
        }
        
        // Täglich um Mitternacht updaten
        this.scheduleMidnightUpdate();
    }
    
    /**
     * Aktualisiert die Meilenstein-Anzeige
     */
    update() {
        const today = new Date();
        const daysTogether = this.calculateDays(this.startDate, today);
        
        // Container leeren
        this.container.innerHTML = '';
        
        // Jeden Meilenstein prüfen und anzeigen
        this.milestones.forEach(milestone => {
            const isReached = daysTogether >= milestone.days;
            
            // Überspringe erreichte wenn ausgeblendet
            if (isReached && !this.showReached) return;
            
            // Meilenstein-Element erstellen
            const element = this.createMilestoneElement(milestone, isReached, daysTogether);
            this.container.appendChild(element);
        });
        
        // Speziellen "Heute" Meilenstein hinzufügen
        this.addTodayMilestone(daysTogether);
    }
    
    /**
     * Erstellt ein Meilenstein-Element
     * @param {Object} milestone - Meilenstein-Daten
     * @param {boolean} isReached - Wurde er erreicht?
     * @param {number} currentDays - Aktuelle Anzahl Tage
     * @returns {HTMLElement} Das Meilenstein-Element
     */
    createMilestoneElement(milestone, isReached, currentDays) {
        const div = document.createElement('div');
        div.className = `milestone ${isReached ? 'reached' : 'upcoming'}`;
        
        // Inhalt
        div.innerHTML = `
            <div class="milestone-emoji">${milestone.emoji}</div>
            <div class="milestone-label">${milestone.label}</div>
            <div class="milestone-days">Tag ${milestone.days}</div>
            ${!isReached ? `<div class="milestone-countdown">Noch ${milestone.days - currentDays} Tage</div>` : ''}
        `;
        
        // Animation beim Hover
        div.addEventListener('mouseenter', () => {
            div.style.transform = 'translateY(-5px)';
        });
        
        div.addEventListener('mouseleave', () => {
            div.style.transform = 'translateY(0)';
        });
        
        return div;
    }
    
    /**
     * Fügt den aktuellen Tag als speziellen Meilenstein hinzu
     * @param {number} days - Anzahl Tage zusammen
     */
    addTodayMilestone(days) {
        const div = document.createElement('div');
        div.className = 'milestone today special';
        
        div.innerHTML = `
            <div class="milestone-emoji">💕</div>
            <div class="milestone-label">Heute</div>
            <div class="milestone-days">Tag ${days}</div>
            <div class="milestone-special">Jeder Tag ist besonders!</div>
        `;
        
        // Am Anfang einfügen
        this.container.insertBefore(div, this.container.firstChild);
    }
    
    /**
     * Berechnet die Anzahl Tage zwischen zwei Daten
     * @param {Date} start - Startdatum
     * @param {Date} end - Enddatum
     * @returns {number} Anzahl Tage
     */
    calculateDays(start, end) {
        const diff = end - start;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
    
    /**
     * Zeigt/Versteckt erreichte Meilensteine
     */
    toggleReached() {
        this.showReached = !this.showReached;
        
        // Button-Text aktualisieren
        if (this.toggleButton) {
            this.toggleButton.textContent = this.showReached 
                ? 'Erreichte ausblenden' 
                : 'Erreichte anzeigen';
        }
        
        // Neu rendern
        this.update();
    }
    
    /**
     * Plant Update um Mitternacht
     */
    scheduleMidnightUpdate() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow - now;
        
        // Um Mitternacht updaten
        setTimeout(() => {
            this.update();
            // Nächsten Tag planen
            this.scheduleMidnightUpdate();
        }, msUntilMidnight);
    }
}

// Export für andere Module
window.MilestonesTracker = MilestonesTracker;