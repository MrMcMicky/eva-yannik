const { chromium } = require('playwright');

async function testMobileNav() {
    console.log('Testing mobile navigation...\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });
        
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle'
        });
        
        // Check for menu button
        const menuButton = await page.$('#newMenuButton');
        if (!menuButton) {
            console.log('❌ Menu button not found!');
            return;
        }
        
        console.log('✅ Menu button found!');
        
        // Check initial state of hidden buttons
        const initialState = await page.evaluate(() => {
            const buttons = ['#bibleButton', '#newSettingsButton', '#infoButton'];
            return buttons.map(id => {
                const btn = document.querySelector(id);
                if (!btn) return { id, found: false };
                
                const style = window.getComputedStyle(btn);
                return {
                    id,
                    found: true,
                    opacity: style.opacity,
                    display: style.display,
                    visible: style.opacity === '1' && style.display !== 'none'
                };
            });
        });
        
        console.log('Initial button states:', initialState);
        
        // Click menu button
        await menuButton.click();
        await page.waitForTimeout(1000); // Wait for animation
        
        // Check state after click
        const afterClick = await page.evaluate(() => {
            const buttons = ['#bibleButton', '#newSettingsButton', '#infoButton'];
            return buttons.map(id => {
                const btn = document.querySelector(id);
                if (!btn) return { id, found: false };
                
                const style = window.getComputedStyle(btn);
                return {
                    id,
                    found: true,
                    opacity: style.opacity,
                    display: style.display,
                    visible: style.opacity === '1' && style.display !== 'none'
                };
            });
        });
        
        console.log('\nAfter clicking menu:', afterClick);
        
        // Check if any button became visible
        const anyVisible = afterClick.some(btn => btn.visible);
        console.log('\n' + (anyVisible ? '✅ Menu works!' : '❌ Menu not working'));
        
    } catch (error) {
        console.error('Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testMobileNav();