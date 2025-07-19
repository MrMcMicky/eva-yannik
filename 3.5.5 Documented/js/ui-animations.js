/**
 * UI ANIMATIONEN MODUL
 * Von: MrMcMicky (Michael)
 * 
 * Dieses Modul kümmert sich um alle UI-Animationen und Übergänge.
 * Es macht die Website lebendiger und interaktiver.
 * 
 * LERNPUNKTE FÜR YANNIK:
 * 1. RequestAnimationFrame ist besser als setTimeout für Animationen
 * 2. CSS Transitions sind performanter als JavaScript-Animationen
 * 3. Touch-Events machen Mobile-Interaktionen besser
 * 
 * ANIMATIONEN:
 * - Smooth Scroll zwischen Sections
 * - Parallax-Effekte
 * - Hover-Animationen
 * - Loading-Animationen
 * 
 * VERBESSERUNGSMÖGLICHKEITEN:
 * - Intersection Observer für Scroll-Animationen
 * - Web Animations API für komplexere Animationen
 * - GSAP Library für professionelle Animationen
 */

// Konfiguration
const SCROLL_DURATION = 800; // Millisekunden
const PARALLAX_SPEED = 0.5;
const ANIMATION_BREAKPOINT = 768; // Mobile Breakpoint

/**
 * Initialisiert Smooth Scrolling für Anchor-Links
 */
function initSmoothScroll() {
    // Finde alle Links die zu Anchors führen
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Ignoriere wenn nur "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                smoothScrollTo(target);
            }
        });
    });
    
    // VERBESSERUNG: Smooth Scroll für Maus-Rad
    // Aber vorsichtig - kann nervig sein wenn übertrieben
}

/**
 * Scrollt smooth zu einem Element
 * @param {HTMLElement} target - Ziel-Element
 * @param {number} offset - Offset vom oberen Rand (optional)
 */
function smoothScrollTo(target, offset = 0) {
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition - offset;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / SCROLL_DURATION, 1);
        
        // Easing Funktion für smoothe Bewegung
        const easeInOutCubic = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        window.scrollTo(0, startPosition + distance * easeInOutCubic);
        
        if (timeElapsed < SCROLL_DURATION) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

/**
 * Initialisiert Parallax-Effekte
 * HINWEIS: Kann Performance-intensiv sein - sparsam verwenden!
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;
    
    // Nur auf Desktop aktivieren
    if (window.innerWidth < ANIMATION_BREAKPOINT) return;
    
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.parallax || PARALLAX_SPEED;
            const yPos = -(scrolled * speed);
            
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    // Throttle mit requestAnimationFrame
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

/**
 * Initialisiert Hover-Effekte für interaktive Elemente
 */
function initHoverEffects() {
    // Füge Hover-Klasse für Touch-Devices hinzu
    document.addEventListener('touchstart', function() {}, true);
    
    // Magnetischer Hover-Effekt für Buttons
    const magneticButtons = document.querySelectorAll('.bible-button, .menu-button');
    
    magneticButtons.forEach(button => {
        let boundingRect = button.getBoundingClientRect();
        
        // Update bounding rect on resize
        window.addEventListener('resize', () => {
            boundingRect = button.getBoundingClientRect();
        });
        
        button.addEventListener('mousemove', (e) => {
            const x = e.clientX - boundingRect.left - boundingRect.width / 2;
            const y = e.clientY - boundingRect.top - boundingRect.height / 2;
            
            // Magnetischer Effekt (subtil!)
            const moveX = x * 0.1;
            const moveY = y * 0.1;
            
            button.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });
}

/**
 * Initialisiert Lade-Animationen
 */
function initLoadingAnimations() {
    // Fade-in Animation für Hauptcontent
    const mainContent = document.querySelector('.snap-container');
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(20px)';
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                mainContent.style.transition = 'opacity 1s ease, transform 1s ease';
                mainContent.style.opacity = '1';
                mainContent.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    // Staggered Animation für Menü-Buttons
    const menuButtons = document.querySelectorAll('.menu-button-container');
    menuButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateX(0)';
        }, 500 + index * 100);
    });
}

/**
 * Initialisiert Scroll-Indikator Animation
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;
    
    // Bounce Animation
    scrollIndicator.style.animation = 'bounce 2s infinite';
    
    // Mache den Scroll-Indikator klickbar
    scrollIndicator.style.cursor = 'pointer';
    
    // Click Handler - scrollt zur zweiten Section
    scrollIndicator.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Finde die zweite Section
        const sections = document.querySelectorAll('.section');
        if (sections.length > 1) {
            const targetSection = sections[1];
            smoothScrollTo(targetSection);
        } else {
            // Fallback: Scrolle um Viewport-Höhe
            window.scrollBy({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        }
    });
    
    // Verstecke bei Scroll
    let hidden = false;
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100 && !hidden) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.pointerEvents = 'none';
            hidden = true;
        } else if (window.pageYOffset <= 100 && hidden) {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.pointerEvents = 'auto';
            hidden = false;
        }
    });
}

/**
 * Initialisiert Konfetti-Animation für besondere Momente
 * @param {number} duration - Dauer in Millisekunden
 */
function celebrateWithConfetti(duration = 3000) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            opacity: ${Math.random() * 0.5 + 0.5};
            transform: rotate(${Math.random() * 360}deg);
            z-index: 9999;
        `;
        
        document.body.appendChild(confetti);
        
        // Animiere Konfetti
        const animation = confetti.animate([
            { 
                transform: `translateY(0) rotate(0deg)`,
                opacity: 1 
            },
            { 
                transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`,
                opacity: 0 
            }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
    
    setTimeout(() => {
        document.querySelectorAll('.confetti').forEach(c => c.remove());
    }, duration + 3000);
}

/**
 * Initialisiert Ripple-Effekt für Klicks
 */
function initRippleEffect() {
    const rippleElements = document.querySelectorAll('.bible-button, button');
    
    rippleElements.forEach(element => {
        element.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
}

/**
 * Füge benötigte CSS für Animationen hinzu
 */
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Bounce Animation für Scroll-Indikator */
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        /* Ripple Animation */
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Glow Pulse für wichtige Buttons */
        @keyframes glow-pulse {
            0%, 100% {
                box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            }
            50% {
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
            }
        }
        
        /* Smooth Transitions als Default */
        * {
            transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
        }
        
        /* Verhindere Layout-Shifts */
        img, video {
            max-width: 100%;
            height: auto;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initialisiert alle UI-Animationen
 */
function initUIAnimations() {
    // Füge Animation Styles hinzu
    addAnimationStyles();
    
    // Initialisiere alle Animationen
    initSmoothScroll();
    initParallax();
    initHoverEffects();
    initLoadingAnimations();
    initScrollIndicator();
    initRippleEffect();
    
    // Exportiere Konfetti-Funktion für andere Module
    window.celebrate = celebrateWithConfetti;
    
    console.log('✅ UI Animationen geladen');
}

// Exportiere Modul
window.uiAnimationsModule = {
    init: initUIAnimations,
    smoothScrollTo,
    celebrate: celebrateWithConfetti
};