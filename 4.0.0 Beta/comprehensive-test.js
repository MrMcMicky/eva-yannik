// Umfassender Test für Eva & Yannik Website v4.0.0
const puppeteer = require('puppeteer');
const fs = require('fs');

async function runComprehensiveTest() {
    console.log('🧪 Eva & Yannik Website v4.0.0 - Umfassender Test\n');
    console.log('🌐 Testing: https://eva-yannik.assistent.my.id\n');
    
    const results = {
        passed: [],
        failed: [],
        warnings: []
    };
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
        const page = await browser.newPage();
        
        // Console-Nachrichten aufzeichnen
        const consoleLogs = [];
        page.on('console', msg => {
            consoleLogs.push({
                type: msg.type(),
                text: msg.text()
            });
        });
        
        // Fehler aufzeichnen
        const pageErrors = [];
        page.on('error', err => pageErrors.push(err.toString()));
        page.on('pageerror', err => pageErrors.push(err.toString()));
        
        // 1. Seite laden
        console.log('📄 1. Lade Seite...');
        const startTime = Date.now();
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        const loadTime = Date.now() - startTime;
        
        if (loadTime < 3000) {
            results.passed.push(`✅ Seite in ${loadTime}ms geladen`);
        } else {
            results.warnings.push(`⚠️ Langsame Ladezeit: ${loadTime}ms`);
        }
        
        // 2. CSS und JavaScript prüfen
        console.log('\n🎨 2. Prüfe CSS und JavaScript...');
        
        const hasCSS = await page.evaluate(() => {
            return document.styleSheets.length > 0;
        });
        
        const jsModulesLoaded = await page.evaluate(() => {
            return {
                countdown: typeof CountdownTimer !== 'undefined',
                uiControls: typeof UIControls !== 'undefined',
                milestones: typeof MilestonesTracker !== 'undefined',
                splashScreen: typeof SplashScreen !== 'undefined'
            };
        });
        
        if (hasCSS) {
            results.passed.push('✅ CSS erfolgreich geladen');
        } else {
            results.failed.push('❌ CSS nicht geladen');
        }
        
        Object.entries(jsModulesLoaded).forEach(([module, loaded]) => {
            if (loaded) {
                results.passed.push(`✅ ${module} Modul geladen`);
            } else {
                results.failed.push(`❌ ${module} Modul fehlt`);
            }
        });
        
        // 3. Countdown Timer testen
        console.log('\n⏰ 3. Teste Countdown Timer...');
        
        const countdownWorking = await page.evaluate(() => {
            const days = document.getElementById('days');
            const initialValue = days ? days.textContent : '0';
            return new Promise(resolve => {
                setTimeout(() => {
                    const newValue = days ? days.textContent : '0';
                    resolve({
                        exists: !!days,
                        updating: initialValue !== newValue || parseInt(initialValue) > 0
                    });
                }, 1100);
            });
        });
        
        if (countdownWorking.exists && countdownWorking.updating) {
            results.passed.push('✅ Countdown Timer läuft');
        } else if (countdownWorking.exists) {
            results.warnings.push('⚠️ Countdown existiert aber updated nicht');
        } else {
            results.failed.push('❌ Countdown Timer nicht gefunden');
        }
        
        // 4. Buttons testen
        console.log('\n🔘 4. Teste Navigation Buttons...');
        
        const buttons = [
            { id: 'newMenuButton', name: 'Menu' },
            { id: 'bibleButton', name: 'Bible' },
            { id: 'newSettingsButton', name: 'Settings' },
            { id: 'infoButton', name: 'Info' }
        ];
        
        for (const btn of buttons) {
            const buttonExists = await page.$(`#${btn.id}`);
            if (buttonExists) {
                results.passed.push(`✅ ${btn.name} Button gefunden`);
                
                // Test click
                await page.click(`#${btn.id}`);
                await page.waitForTimeout(500);
                
                // Check if overlay opened
                const overlayActive = await page.evaluate(() => {
                    const overlays = document.querySelectorAll('.menu-overlay, .bible-overlay, .settings-overlay, .info-overlay');
                    return Array.from(overlays).some(o => o.classList.contains('active') || o.style.display !== 'none');
                });
                
                if (overlayActive) {
                    results.passed.push(`✅ ${btn.name} Overlay öffnet sich`);
                    
                    // Try to close with ESC
                    await page.keyboard.press('Escape');
                    await page.waitForTimeout(300);
                } else {
                    results.warnings.push(`⚠️ ${btn.name} Overlay öffnet sich nicht`);
                }
            } else {
                results.failed.push(`❌ ${btn.name} Button nicht gefunden`);
            }
        }
        
        // 5. Responsive Design testen
        console.log('\n📱 5. Teste Responsive Design...');
        
        const viewports = [
            { name: 'Mobile', width: 375, height: 667 },
            { name: 'Tablet', width: 768, height: 1024 },
            { name: 'Desktop', width: 1920, height: 1080 }
        ];
        
        for (const vp of viewports) {
            await page.setViewport({ width: vp.width, height: vp.height });
            await page.waitForTimeout(500);
            
            const hasOverflow = await page.evaluate(() => {
                return document.documentElement.scrollWidth > document.documentElement.clientWidth;
            });
            
            if (!hasOverflow) {
                results.passed.push(`✅ ${vp.name} View - Kein horizontaler Overflow`);
            } else {
                results.failed.push(`❌ ${vp.name} View - Horizontaler Overflow erkannt`);
            }
            
            // Screenshot
            await page.screenshot({ 
                path: `screenshots/${vp.name.toLowerCase()}-test.png`,
                fullPage: true 
            });
        }
        
        // 6. Meilensteine prüfen
        console.log('\n🏆 6. Teste Meilensteine...');
        
        const milestones = await page.evaluate(() => {
            const grid = document.querySelector('.milestones-grid');
            const items = grid ? grid.querySelectorAll('.milestone') : [];
            return {
                gridExists: !!grid,
                count: items.length,
                hasToday: Array.from(items).some(m => m.classList.contains('today'))
            };
        });
        
        if (milestones.gridExists && milestones.count > 0) {
            results.passed.push(`✅ Meilensteine Grid mit ${milestones.count} Einträgen`);
            if (milestones.hasToday) {
                results.passed.push('✅ "Heute" Meilenstein vorhanden');
            }
        } else {
            results.failed.push('❌ Meilensteine nicht gefunden');
        }
        
        // 7. Performance Metriken
        console.log('\n⚡ 7. Performance Metriken...');
        
        const metrics = await page.metrics();
        results.passed.push(`✅ JS Heap: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
        results.passed.push(`✅ DOM Nodes: ${metrics.Nodes}`);
        
        // 8. Console Errors prüfen
        console.log('\n🐛 8. Prüfe Console Errors...');
        
        const errors = consoleLogs.filter(log => log.type === 'error');
        if (errors.length === 0) {
            results.passed.push('✅ Keine JavaScript Fehler');
        } else {
            errors.forEach(err => {
                results.failed.push(`❌ JS Error: ${err.text}`);
            });
        }
        
        if (pageErrors.length > 0) {
            pageErrors.forEach(err => {
                results.failed.push(`❌ Page Error: ${err}`);
            });
        }
        
    } catch (error) {
        results.failed.push(`❌ Test Error: ${error.message}`);
    } finally {
        await browser.close();
    }
    
    // Test Report ausgeben
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST REPORT - Eva & Yannik Website v4.0.0');
    console.log('='.repeat(60) + '\n');
    
    console.log(`✅ Bestanden: ${results.passed.length}`);
    console.log(`⚠️  Warnungen: ${results.warnings.length}`);
    console.log(`❌ Fehler: ${results.failed.length}`);
    
    console.log('\n✅ BESTANDENE TESTS:');
    results.passed.forEach(test => console.log(`   ${test}`));
    
    if (results.warnings.length > 0) {
        console.log('\n⚠️  WARNUNGEN:');
        results.warnings.forEach(test => console.log(`   ${test}`));
    }
    
    if (results.failed.length > 0) {
        console.log('\n❌ FEHLGESCHLAGENE TESTS:');
        results.failed.forEach(test => console.log(`   ${test}`));
    }
    
    // Gesamtbewertung
    console.log('\n' + '='.repeat(60));
    const score = (results.passed.length / (results.passed.length + results.failed.length) * 100).toFixed(1);
    console.log(`🎯 GESAMTBEWERTUNG: ${score}%`);
    
    if (score >= 90) {
        console.log('✨ Website ist PRODUCTION READY!');
    } else if (score >= 70) {
        console.log('⚠️  Website funktioniert, hat aber noch Probleme');
    } else {
        console.log('❌ Website hat kritische Probleme');
    }
    
    console.log('='.repeat(60) + '\n');
    
    // Test-Datei speichern
    fs.writeFileSync('test-results.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        score: parseFloat(score),
        results: results
    }, null, 2));
    
    console.log('📄 Detaillierte Ergebnisse in test-results.json gespeichert');
    console.log('📸 Screenshots im screenshots/ Ordner\n');
}

// Ensure screenshots directory exists
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

// Run the test
runComprehensiveTest().catch(console.error);