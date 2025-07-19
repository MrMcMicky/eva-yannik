const { chromium } = require('playwright');

async function testScrollSimple() {
    console.log('Simple scroll test...\n');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // Capture console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            console.log('JS Error:', msg.text());
        }
    });
    
    page.on('pageerror', error => {
        console.log('Page error:', error.message);
    });
    
    try {
        await page.goto('https://eva-yannik.assistent.my.id', { 
            waitUntil: 'networkidle'
        });
        
        // Debug: Check page structure
        const pageInfo = await page.evaluate(() => {
            const scrollBtn = document.querySelector('#scroll-down');
            const sections = document.querySelectorAll('.section');
            const container = document.querySelector('.snap-container');
            
            return {
                scrollButton: {
                    exists: !!scrollBtn,
                    visible: scrollBtn ? window.getComputedStyle(scrollBtn).display !== 'none' : false,
                    text: scrollBtn ? scrollBtn.textContent.trim() : null
                },
                sections: {
                    count: sections.length,
                    heights: Array.from(sections).map(s => s.offsetHeight)
                },
                container: {
                    exists: !!container,
                    scrollHeight: container ? container.scrollHeight : 0,
                    clientHeight: container ? container.clientHeight : 0
                }
            };
        });
        
        console.log('Page structure:', JSON.stringify(pageInfo, null, 2));
        
        if (pageInfo.scrollButton.exists) {
            // Try clicking
            await page.click('#scroll-down');
            await page.waitForTimeout(1500);
            
            const afterClick = await page.evaluate(() => ({
                scrollY: window.scrollY,
                containerScrollTop: document.querySelector('.snap-container')?.scrollTop || 0
            }));
            
            console.log('\nAfter click:', afterClick);
        }
        
    } catch (error) {
        console.error('Test error:', error.message);
    } finally {
        await browser.close();
    }
}

testScrollSimple();