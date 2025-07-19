const { chromium } = require('playwright');

async function testScrollDebug() {
    console.log('Testing scroll functionality with debugging...');
    
    const browser = await chromium.launch({
        headless: false, // Show browser for debugging
        slowMo: 1000 // Slow down actions
    });
    
    const page = await browser.newPage();
    
    // Capture all console logs
    page.on('console', msg => {
        console.log('Browser console:', msg.type(), msg.text());
    });
    
    try {
        console.log('Loading page...');
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Check if modules are loaded
        const modulesLoaded = await page.evaluate(() => {
            return {
                uiAnimationsModule: typeof window.uiAnimationsModule !== 'undefined',
                scrollDownElement: !!document.querySelector('#scroll-down'),
                sections: document.querySelectorAll('.section').length
            };
        });
        
        console.log('Page state:', modulesLoaded);
        
        // Check for errors
        const errors = await page.evaluate(() => {
            // Try to manually trigger the scroll
            const scrollButton = document.querySelector('#scroll-down');
            if (scrollButton) {
                // Check if event listener is attached
                const hasListener = scrollButton.onclick !== null || 
                                  scrollButton.getAttribute('onclick') !== null;
                
                // Try to find sections
                const sections = document.querySelectorAll('.section');
                
                return {
                    buttonFound: true,
                    hasListener: hasListener,
                    sectionsFound: sections.length,
                    buttonHTML: scrollButton.outerHTML.substring(0, 100)
                };
            }
            return { buttonFound: false };
        });
        
        console.log('Debug info:', errors);
        
        // Try to manually trigger scroll
        await page.evaluate(() => {
            const sections = document.querySelectorAll('.section');
            if (sections.length > 1) {
                console.log('Manually scrolling to section 2...');
                sections[1].scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
        
        await page.waitForTimeout(2000);
        
        const finalScroll = await page.evaluate(() => window.pageYOffset);
        console.log('Final scroll position:', finalScroll);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        console.log('Press Ctrl+C to close browser...');
        // Keep browser open for manual inspection
        await new Promise(() => {});
    }
}

testScrollDebug();