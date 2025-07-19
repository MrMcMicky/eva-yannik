const puppeteer = require('puppeteer');

(async () => {
    console.log('Starting website issue detection...');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set mobile viewport
    await page.setViewport({
        width: 375,
        height: 812,
        isMobile: true,
        hasTouch: true
    });
    
    // Listen for console messages
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console Error:', msg.text());
        }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
        console.log('Page Error:', error.message);
    });
    
    await page.goto('https://eva-yannik.assistent.my.id', {
        waitUntil: 'networkidle2'
    });
    
    console.log('\n=== CHECKING SCROLL-DOWN ARROW ===');
    
    // Check for scroll indicator
    const scrollIndicator = await page.$('.scroll-indicator');
    if (scrollIndicator) {
        console.log('✓ Scroll indicator found');
        
        // Check if it has click handler
        const hasClickHandler = await page.evaluate(() => {
            const element = document.querySelector('.scroll-indicator');
            if (!element) return false;
            
            // Check for inline onclick
            if (element.onclick) return true;
            
            // Check if element or its children have cursor:pointer
            const computedStyle = window.getComputedStyle(element);
            return computedStyle.cursor === 'pointer';
        });
        
        console.log('Has click handler:', hasClickHandler ? 'YES' : 'NO');
        
        // Try clicking
        try {
            await scrollIndicator.click();
            await page.waitForTimeout(1000);
            
            const scrolled = await page.evaluate(() => window.pageYOffset);
            console.log('Page scrolled to:', scrolled, 'px');
        } catch (e) {
            console.log('Error clicking scroll indicator:', e.message);
        }
    } else {
        console.log('✗ Scroll indicator NOT found');
    }
    
    console.log('\n=== CHECKING MOBILE MENU ===');
    
    // Check for hamburger menu button
    const menuButton = await page.$('#newMenuButton');
    if (menuButton) {
        console.log('✓ Menu button found');
        
        // Get initial state
        const initialMenuState = await page.evaluate(() => {
            const buttons = ['bibleButton', 'newSettingsButton', 'infoButton']
                .map(id => document.getElementById(id));
            return buttons.map(btn => ({
                id: btn?.id,
                visible: btn?.classList.contains('visible'),
                display: btn ? window.getComputedStyle(btn).display : 'none',
                opacity: btn ? window.getComputedStyle(btn).opacity : '0'
            }));
        });
        
        console.log('Initial menu state:', JSON.stringify(initialMenuState, null, 2));
        
        // Click menu button
        await menuButton.click();
        await page.waitForTimeout(500);
        
        // Get state after click
        const afterClickState = await page.evaluate(() => {
            const buttons = ['bibleButton', 'newSettingsButton', 'infoButton']
                .map(id => document.getElementById(id));
            return buttons.map(btn => ({
                id: btn?.id,
                visible: btn?.classList.contains('visible'),
                display: btn ? window.getComputedStyle(btn).display : 'none',
                opacity: btn ? window.getComputedStyle(btn).opacity : '0'
            }));
        });
        
        console.log('After click state:', JSON.stringify(afterClickState, null, 2));
        
    } else {
        console.log('✗ Menu button NOT found');
    }
    
    console.log('\n=== CHECKING RIGHT BUTTON ===');
    
    const rightButton = await page.$('#rightMenuButton');
    if (rightButton) {
        console.log('✓ Right button found');
        
        await rightButton.click();
        await page.waitForTimeout(1000);
        
        // Check if any overlay opened
        const overlaysOpen = await page.evaluate(() => {
            const overlays = ['infoOverlay', 'upcomingFeaturesOverlay'];
            return overlays.map(id => {
                const el = document.getElementById(id);
                return {
                    id,
                    display: el ? window.getComputedStyle(el).display : 'none',
                    hasActiveClass: el?.classList.contains('active')
                };
            });
        });
        
        console.log('Overlays state:', JSON.stringify(overlaysOpen, null, 2));
    } else {
        console.log('✗ Right button NOT found');
    }
    
    // Check for JavaScript errors
    console.log('\n=== CHECKING FOR JS ERRORS ===');
    const jsErrors = await page.evaluate(() => {
        const errors = [];
        
        // Check if modules are loaded
        if (!window.menuModule) errors.push('menuModule not loaded');
        if (!window.uiAnimationsModule) errors.push('uiAnimationsModule not loaded');
        if (!window.countdownModule) errors.push('countdownModule not loaded');
        
        return errors;
    });
    
    if (jsErrors.length > 0) {
        console.log('JavaScript errors found:', jsErrors);
    } else {
        console.log('✓ All modules loaded correctly');
    }
    
    await browser.close();
    console.log('\n=== TEST COMPLETE ===');
})();