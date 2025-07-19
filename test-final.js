const { chromium } = require('playwright');

async function testFinal() {
    console.log('Final test of all fixes...\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    try {
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle'
        });
        
        // Test 1: Scroll functionality
        console.log('1. Testing scroll...');
        const scrollBefore = await page.evaluate(() => 
            document.querySelector('.snap-container').scrollTop
        );
        
        await page.click('#scroll-down');
        await page.waitForTimeout(1000);
        
        const scrollAfter = await page.evaluate(() => 
            document.querySelector('.snap-container').scrollTop
        );
        
        console.log(`   Before: ${scrollBefore}, After: ${scrollAfter}`);
        console.log(`   ${scrollAfter > scrollBefore ? '✅ Scroll works!' : '❌ Scroll failed'}\n`);
        
        // Test 2: Mobile menu (with viewport change)
        console.log('2. Testing mobile menu...');
        await page.setViewportSize({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        
        // Remove banner that might block clicks
        await page.evaluate(() => {
            const banner = document.querySelector('#featureDiscoveryBanner');
            if (banner) banner.remove();
        });
        
        // Try to click menu button with force
        const menuClicked = await page.evaluate(() => {
            const menuBtn = document.querySelector('#newMenuButton');
            if (menuBtn) {
                menuBtn.click();
                return true;
            }
            return false;
        });
        
        if (menuClicked) {
            await page.waitForTimeout(1000);
            
            const buttonsVisible = await page.evaluate(() => {
                const buttons = ['#bibleButton', '#newSettingsButton', '#infoButton'];
                return buttons.map(id => {
                    const btn = document.querySelector(id);
                    const style = btn ? window.getComputedStyle(btn) : null;
                    return style ? style.opacity === '1' : false;
                });
            });
            
            const anyVisible = buttonsVisible.some(v => v);
            console.log(`   Buttons visible: ${buttonsVisible}`);
            console.log(`   ${anyVisible ? '✅ Menu works!' : '❌ Menu failed'}\n`);
        } else {
            console.log('   ❌ Could not click menu button\n');
        }
        
        // Test 3: Check for JS errors
        const jsErrors = await page.evaluate(() => {
            return window.jsErrors || [];
        });
        
        console.log('3. JavaScript errors:', jsErrors.length > 0 ? jsErrors : 'None');
        
    } catch (error) {
        console.error('Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testFinal();