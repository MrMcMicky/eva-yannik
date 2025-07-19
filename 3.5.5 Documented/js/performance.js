/**
 * PERFORMANCE OPTIMIERUNGEN
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul implementiert verschiedene Performance-Optimierungen
 * um die Website schneller zu machen.
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. Lazy Loading spart Bandbreite und lädt schneller
 * 2. IntersectionObserver ist effizienter als scroll Events
 * 3. WebP Bilder sind 25-35% kleiner als JPEG
 * 
 * IMPLEMENTIERTE OPTIMIERUNGEN:
 * - Lazy Loading für Bilder
 * - Preloading für kritische Ressourcen  
 * - Request Idle Callback für nicht-kritische Tasks
 * - Performance Monitoring
 */

/**
 * Lazy Loading für Bilder
 * Lädt Bilder erst wenn sie fast im Viewport sind
 */
function initLazyLoading() {
    // Finde alle Bilder mit data-src Attribut
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        // Moderne Browser - verwende IntersectionObserver
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Lade das Bild
                    img.src = img.dataset.src;
                    
                    // Wenn srcset vorhanden, auch das laden
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                    }
                    
                    // Entferne data-Attribute
                    img.removeAttribute('data-src');
                    img.removeAttribute('data-srcset');
                    
                    // Füge loaded Klasse für Fade-in Animation hinzu
                    img.classList.add('loaded');
                    
                    // Stoppe Beobachtung für dieses Bild
                    observer.unobserve(img);
                }
            });
        }, {
            // Lade Bilder wenn sie 100px vor dem Viewport sind
            rootMargin: '100px'
        });
        
        // Beobachte alle lazy Images
        lazyImages.forEach(img => imageObserver.observe(img));
        
    } else {
        // Fallback für ältere Browser
        // Lade alle Bilder sofort
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
            }
        });
    }
}

/**
 * Preload kritische Ressourcen
 * Verbessert die Ladezeit für wichtige Assets
 */
function preloadCriticalAssets() {
    const criticalAssets = [
        { href: 'love.jpg', as: 'image' },
        { href: 'style.css', as: 'style' },
        { href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap', as: 'style' }
    ];
    
    criticalAssets.forEach(asset => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = asset.href;
        link.as = asset.as;
        
        // Für Fonts crossorigin hinzufügen
        if (asset.as === 'font') {
            link.crossOrigin = 'anonymous';
        }
        
        document.head.appendChild(link);
    });
}

/**
 * Optimiere Font Loading
 * Verhindert FOIT (Flash of Invisible Text)
 */
function optimizeFontLoading() {
    // Font Face Observer Alternative
    if ('fonts' in document) {
        // Warte auf Font Loading
        Promise.all([
            document.fonts.load('400 1em Quicksand'),
            document.fonts.load('600 1em Quicksand'),
            document.fonts.load('700 1em Quicksand')
        ]).then(() => {
            document.documentElement.classList.add('fonts-loaded');
        }).catch(() => {
            // Fallback wenn Fonts nicht laden
            console.warn('Fonts konnten nicht geladen werden');
        });
    }
}

/**
 * Request Idle Callback für nicht-kritische Tasks
 * Führt Aufgaben aus wenn der Browser idle ist
 */
function scheduleIdleTasks() {
    if ('requestIdleCallback' in window) {
        // Lade Analytics oder andere nicht-kritische Scripts
        requestIdleCallback(() => {
            // Beispiel: Google Analytics laden
            // loadAnalytics();
            
            // Beispiel: Service Worker registrieren
            if ('serviceWorker' in navigator) {
                // navigator.serviceWorker.register('/sw.js');
            }
        });
    }
}

/**
 * Performance Monitoring
 * Misst und loggt wichtige Performance-Metriken
 */
function monitorPerformance() {
    if ('PerformanceObserver' in window) {
        // Largest Contentful Paint (LCP)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                console.log('LCP:', lastEntry.startTime);
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            // LCP nicht unterstützt
        }
        
        // First Input Delay (FID)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    const delay = entry.processingStart - entry.startTime;
                    console.log('FID:', delay);
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
            // FID nicht unterstützt
        }
        
        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        try {
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                        console.log('CLS:', clsValue);
                    }
                }
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
            // CLS nicht unterstützt
        }
    }
}

/**
 * Reduziere JavaScript Execution Time
 * Teilt lange Tasks in kleinere Chunks auf
 */
function chunkLongTasks(tasks, chunkSize = 5) {
    let index = 0;
    
    function processChunk() {
        const endIndex = Math.min(index + chunkSize, tasks.length);
        
        while (index < endIndex) {
            tasks[index]();
            index++;
        }
        
        if (index < tasks.length) {
            // Gib Browser Zeit zum Atmen
            requestAnimationFrame(processChunk);
        }
    }
    
    processChunk();
}

/**
 * Debounce Funktion für Events
 * Verhindert zu häufige Funktionsaufrufe
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle Funktion für Events
 * Limitiert Funktionsaufrufe auf bestimmte Rate
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Optimiere Scroll Performance
 */
function optimizeScrollPerformance() {
    let ticking = false;
    
    function updateScrollPosition() {
        // Scroll-abhängige Updates hier
        ticking = false;
    }
    
    // Verwende RAF statt direktem scroll handler
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollPosition);
            ticking = true;
        }
    }, { passive: true }); // Passive listener für bessere Performance
}

/**
 * Füge Performance CSS hinzu
 */
function addPerformanceStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Lazy Loading Styles */
        img[data-src] {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        img.loaded {
            opacity: 1;
        }
        
        /* Hardware Acceleration für Animationen */
        .floating-heart,
        .christian-symbol,
        .menu-button {
            will-change: transform;
            transform: translateZ(0); /* Force GPU acceleration */
        }
        
        /* Verhindere Layout Shifts */
        img {
            aspect-ratio: attr(width) / attr(height);
        }
        
        /* Font Loading Optimierung */
        .fonts-loaded body {
            font-family: 'Quicksand', sans-serif;
        }
        
        /* Reduziere Repaints */
        .countdown-timer {
            contain: layout style paint;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialisiere alle Performance-Optimierungen
 */
function initPerformanceOptimizations() {
    // CSS zuerst für sofortige Wirkung
    addPerformanceStyles();
    
    // Kritische Optimierungen
    initLazyLoading();
    optimizeFontLoading();
    optimizeScrollPerformance();
    
    // Nicht-kritische Optimierungen verzögert
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            preloadCriticalAssets();
            monitorPerformance();
            scheduleIdleTasks();
        });
    } else {
        setTimeout(() => {
            preloadCriticalAssets();
            monitorPerformance();
            scheduleIdleTasks();
        }, 1000);
    }
    
    console.log('✅ Performance-Optimierungen aktiv');
}

// Exportiere Modul und Hilfsfunktionen
window.performanceModule = {
    init: initPerformanceOptimizations,
    debounce,
    throttle,
    chunkLongTasks
};