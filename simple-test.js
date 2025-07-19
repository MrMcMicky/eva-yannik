const { chromium } = require('playwright');

async function simpleTest() {
    console.log('Starting simple test...');
    
    const browser = await chromium.launch({
        headless: true
    });
    
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => {
        console.log('Browser console:', msg.text());
    });
    
    // Capture errors
    page.on('pageerror', error => {
        console.error('Page error:', error.message);
    });
    
    try {
        console.log('Loading page...');
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        console.log('Page loaded, taking screenshot...');
        await page.screenshot({ path: 'test-page.png', fullPage: true });
        
        // Check if countdown exists
        const countdown = await page.$('#countdown');
        console.log('Countdown found:', !!countdown);
        
        // Check if modules loaded
        const modulesLoaded = await page.evaluate(() => {
            return {
                countdownModule: typeof window.countdownModule !== 'undefined',
                milestonesModule: typeof window.milestonesModule !== 'undefined',
                easterEggsModule: typeof window.easterEggsModule !== 'undefined',
                menuModule: typeof window.menuModule !== 'undefined',
                uiAnimationsModule: typeof window.uiAnimationsModule !== 'undefined',
                performanceModule: typeof window.performanceModule !== 'undefined'
            };
        });
        
        console.log('\nModules loaded:', modulesLoaded);
        
        // Get seconds value
        const seconds = await page.textContent('#seconds');
        console.log('Current seconds:', seconds);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

simpleTest();