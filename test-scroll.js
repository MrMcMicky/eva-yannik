const { chromium } = require('playwright');

async function testScroll() {
    console.log('Testing scroll functionality...');
    
    const browser = await chromium.launch({
        headless: true
    });
    
    const page = await browser.newPage();
    
    // Capture console logs
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('Console error:', msg.text());
        }
    });
    
    try {
        console.log('Loading page...');
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        // Wait for the scroll button to be visible
        console.log('Looking for scroll button...');
        const scrollButton = await page.$('#scroll-down');
        
        if (scrollButton) {
            console.log('✅ Scroll button found!');
            
            // Check if it's visible
            const isVisible = await scrollButton.isVisible();
            console.log('Button visible:', isVisible);
            
            // Get initial scroll position
            const initialScroll = await page.evaluate(() => window.pageYOffset);
            console.log('Initial scroll position:', initialScroll);
            
            // Click the scroll button
            console.log('Clicking scroll button...');
            await scrollButton.click();
            
            // Wait for scroll animation
            await page.waitForTimeout(1000);
            
            // Check new scroll position
            const newScroll = await page.evaluate(() => window.pageYOffset);
            console.log('New scroll position:', newScroll);
            
            if (newScroll > initialScroll) {
                console.log('✅ Scroll works! Scrolled from', initialScroll, 'to', newScroll);
            } else {
                console.log('❌ Scroll did not work. Position unchanged.');
            }
        } else {
            console.log('❌ Scroll button not found!');
        }
        
        // Test mobile menu too
        console.log('\nTesting mobile menu...');
        await page.setViewportSize({ width: 375, height: 667 }); // iPhone size
        
        const mobileMenuButton = await page.$('#mobile-menu-toggle');
        if (mobileMenuButton) {
            console.log('✅ Mobile menu button found!');
            
            // Click to open
            await mobileMenuButton.click();
            await page.waitForTimeout(500);
            
            // Check if buttons are visible
            const buttonsVisible = await page.evaluate(() => {
                const buttons = document.querySelectorAll('.menu-button-container');
                return Array.from(buttons).some(btn => 
                    window.getComputedStyle(btn).opacity === '1'
                );
            });
            
            console.log('Menu buttons visible after click:', buttonsVisible);
        } else {
            console.log('❌ Mobile menu button not found!');
        }
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await browser.close();
    }
}

testScroll();