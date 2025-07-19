/**
 * BROWSER TESTS FÜR EVA & YANNIK WEBSITE
 * Von: MrMcMicky (Michael)
 * 
 * Umfassende Tests für alle Features der Website
 * Verwendet Playwright für Cross-Browser Testing
 */

const { chromium } = require('playwright');
const fs = require('fs');

// Test-Konfiguration
const TEST_URL = 'https://eva-yannik.assistent.my.id';
const SCREENSHOT_DIR = './test-screenshots';

// Erstelle Screenshot-Verzeichnis
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
}

// Test-Report
let testResults = {
    passed: 0,
    failed: 0,
    tests: []
};

// Hilfsfunktion für Test-Logging
function logTest(name, passed, error = null) {
    const result = {
        name,
        passed,
        error: error ? error.message : null,
        timestamp: new Date().toISOString()
    };
    
    testResults.tests.push(result);
    
    if (passed) {
        testResults.passed++;
        console.log(`✅ ${name}`);
    } else {
        testResults.failed++;
        console.error(`❌ ${name}: ${error.message}`);
    }
}

// Haupttest-Funktion
async function runTests() {
    console.log('🚀 Starte Browser-Tests für Eva & Yannik Website...\n');
    
    const browser = await chromium.launch({
        headless: true, // Headless für Server ohne Display
        slowMo: 0 // Keine Verlangsamung im Headless-Modus
    });
    
    try {
        // Test verschiedene Viewports
        const viewports = [
            { name: 'Desktop', width: 1920, height: 1080 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Mobile', width: 375, height: 812 }
        ];
        
        for (const viewport of viewports) {
            console.log(`\n📱 Teste ${viewport.name} Ansicht...`);
            
            const context = await browser.newContext({
                viewport: { width: viewport.width, height: viewport.height },
                locale: 'de-DE',
                timezoneId: 'Europe/Zurich'
            });
            
            const page = await context.newPage();
            
            // Aktiviere Konsolen-Logging
            page.on('console', msg => {
                if (msg.type() === 'error') {
                    console.error('Browser Console Error:', msg.text());
                }
            });
            
            // Test 1: Seite lädt erfolgreich
            try {
                await page.goto(TEST_URL, { waitUntil: 'networkidle' });
                await page.screenshot({ 
                    path: `${SCREENSHOT_DIR}/${viewport.name.toLowerCase()}-initial.png`,
                    fullPage: true 
                });
                logTest(`${viewport.name}: Seite lädt erfolgreich`, true);
            } catch (error) {
                logTest(`${viewport.name}: Seite lädt erfolgreich`, false, error);
            }
            
            // Test 2: Countdown funktioniert
            try {
                await page.waitForSelector('#countdown', { timeout: 5000 });
                const countdown = await page.$('#countdown');
                
                // Warte 2 Sekunden und prüfe ob sich Sekunden ändern
                const secondsBefore = await page.textContent('#seconds');
                await page.waitForTimeout(2000);
                const secondsAfter = await page.textContent('#seconds');
                
                if (secondsBefore !== secondsAfter) {
                    logTest(`${viewport.name}: Countdown funktioniert`, true);
                } else {
                    throw new Error('Countdown ändert sich nicht');
                }
            } catch (error) {
                logTest(`${viewport.name}: Countdown funktioniert`, false, error);
            }
            
            // Test 3: Meilensteine werden angezeigt
            try {
                await page.waitForSelector('#milestones-list', { timeout: 5000 });
                const milestones = await page.$$('#milestones-list li');
                
                if (milestones.length > 0) {
                    logTest(`${viewport.name}: Meilensteine werden angezeigt (${milestones.length} gefunden)`, true);
                } else {
                    throw new Error('Keine Meilensteine gefunden');
                }
            } catch (error) {
                logTest(`${viewport.name}: Meilensteine werden angezeigt`, false, error);
            }
            
            // Test 4: Easter Egg - Sekunden klicken
            if (viewport.name === 'Desktop') {
                try {
                    const secondsElement = await page.$('#seconds');
                    
                    // Klicke 5x schnell
                    for (let i = 0; i < 5; i++) {
                        await secondsElement.click();
                        await page.waitForTimeout(100);
                    }
                    
                    // Warte auf Herzen
                    await page.waitForTimeout(1000);
                    const hearts = await page.$$('.floating-heart');
                    
                    await page.screenshot({ 
                        path: `${SCREENSHOT_DIR}/easter-egg-hearts.png`,
                        fullPage: true 
                    });
                    
                    if (hearts.length > 0) {
                        logTest('Easter Egg: Schwebende Herzen', true);
                    } else {
                        throw new Error('Keine Herzen erschienen');
                    }
                } catch (error) {
                    logTest('Easter Egg: Schwebende Herzen', false, error);
                }
                
                // Test 5: Easter Egg - "love" tippen
                try {
                    await page.keyboard.type('love');
                    await page.waitForTimeout(1000);
                    
                    const heartsAfterTyping = await page.$$('.floating-heart');
                    
                    if (heartsAfterTyping.length > 0) {
                        logTest('Easter Egg: Love tippen', true);
                    } else {
                        throw new Error('Keine Herzen nach "love" tippen');
                    }
                } catch (error) {
                    logTest('Easter Egg: Love tippen', false, error);
                }
            }
            
            // Test 6: Menü-System
            try {
                // Öffne Hauptmenü
                await page.click('#newMenuButton');
                await page.waitForTimeout(500);
                
                // Prüfe ob andere Buttons sichtbar sind
                const bibleButtonVisible = await page.isVisible('#bibleButton.visible');
                
                if (bibleButtonVisible) {
                    await page.screenshot({ 
                        path: `${SCREENSHOT_DIR}/${viewport.name.toLowerCase()}-menu-open.png` 
                    });
                    logTest(`${viewport.name}: Menü-System funktioniert`, true);
                    
                    // Schließe Menü wieder
                    await page.click('#newMenuButton');
                } else {
                    throw new Error('Menü-Buttons nicht sichtbar');
                }
            } catch (error) {
                logTest(`${viewport.name}: Menü-System funktioniert`, false, error);
            }
            
            // Test 7: Bibel-Menü
            try {
                // Öffne Menü und dann Bibel
                await page.click('#newMenuButton');
                await page.waitForTimeout(500);
                await page.click('#bibleButton');
                await page.waitForTimeout(500);
                
                const bibleOverlay = await page.$('#bibleOverlay.show');
                
                if (bibleOverlay) {
                    await page.screenshot({ 
                        path: `${SCREENSHOT_DIR}/${viewport.name.toLowerCase()}-bible-menu.png` 
                    });
                    logTest(`${viewport.name}: Bibel-Menü öffnet sich`, true);
                    
                    // Schließe Overlay
                    await page.click('#closeBible');
                } else {
                    throw new Error('Bibel-Overlay nicht sichtbar');
                }
            } catch (error) {
                logTest(`${viewport.name}: Bibel-Menü öffnet sich`, false, error);
            }
            
            // Test 8: Performance Metriken
            try {
                const metrics = await page.evaluate(() => {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    return {
                        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0
                    };
                });
                
                console.log(`\n📊 Performance Metriken (${viewport.name}):`);
                console.log(`   DOM Content Loaded: ${metrics.domContentLoaded.toFixed(2)}ms`);
                console.log(`   Load Complete: ${metrics.loadComplete.toFixed(2)}ms`);
                console.log(`   First Paint: ${metrics.firstPaint.toFixed(2)}ms`);
                
                // Performance sollte unter 3 Sekunden sein
                if (metrics.loadComplete < 3000) {
                    logTest(`${viewport.name}: Performance ist gut`, true);
                } else {
                    throw new Error(`Ladezeit zu hoch: ${metrics.loadComplete}ms`);
                }
            } catch (error) {
                logTest(`${viewport.name}: Performance ist gut`, false, error);
            }
            
            // Test 9: JavaScript Fehler
            try {
                const jsErrors = await page.evaluate(() => {
                    return window.jsErrors || [];
                });
                
                if (jsErrors.length === 0) {
                    logTest(`${viewport.name}: Keine JavaScript Fehler`, true);
                } else {
                    throw new Error(`${jsErrors.length} JavaScript Fehler gefunden`);
                }
            } catch (error) {
                logTest(`${viewport.name}: Keine JavaScript Fehler`, false, error);
            }
            
            // Test 10: Mobile Touch (nur für Mobile)
            if (viewport.name === 'Mobile') {
                try {
                    // Teste Touch auf Sekunden für Easter Egg
                    const secondsElement = await page.$('#seconds');
                    const box = await secondsElement.boundingBox();
                    
                    // Simuliere 5 Taps
                    for (let i = 0; i < 5; i++) {
                        await page.tap('#seconds');
                        await page.waitForTimeout(100);
                    }
                    
                    await page.waitForTimeout(1000);
                    const mobileHearts = await page.$$('.floating-heart');
                    
                    if (mobileHearts.length > 0) {
                        logTest('Mobile: Touch Easter Egg funktioniert', true);
                    } else {
                        throw new Error('Touch Easter Egg funktioniert nicht');
                    }
                } catch (error) {
                    logTest('Mobile: Touch Easter Egg funktioniert', false, error);
                }
            }
            
            await context.close();
        }
        
    } catch (error) {
        console.error('Kritischer Fehler:', error);
    } finally {
        await browser.close();
    }
    
    // Test-Zusammenfassung
    console.log('\n📊 TEST-ZUSAMMENFASSUNG:');
    console.log(`✅ Bestanden: ${testResults.passed}`);
    console.log(`❌ Fehlgeschlagen: ${testResults.failed}`);
    console.log(`📈 Erfolgsrate: ${((testResults.passed / (testResults.passed + testResults.failed)) * 100).toFixed(1)}%`);
    
    // Speichere Test-Report
    fs.writeFileSync(
        'test-report.json',
        JSON.stringify(testResults, null, 2)
    );
    
    console.log('\n📁 Screenshots gespeichert in:', SCREENSHOT_DIR);
    console.log('📄 Test-Report gespeichert als: test-report.json');
}

// Führe Tests aus
runTests().catch(console.error);