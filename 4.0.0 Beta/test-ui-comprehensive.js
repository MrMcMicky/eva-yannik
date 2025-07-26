// Comprehensive UI Testing Script gemäß SuperClaude Standards
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function comprehensiveUITest() {
    console.log('🧪 SuperClaude Comprehensive UI/UX Testing\n');
    console.log('Testing according to SERVER_RULES.md specifications...\n');
    
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    const results = {
        functional: [],
        visual: [],
        responsive: [],
        performance: [],
        accessibility: []
    };
    
    try {
        // Test 1: Desktop View
        console.log('📱 Testing Desktop View (1920x1080)...');
        await page.setViewport({ width: 1920, height: 1080 });
        await page.goto('https://eva-yannik.assistent.my.id', { waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'screenshots/desktop-full.png', fullPage: true });
        
        // Check if CSS is loading
        const hasStyles = await page.evaluate(() => {
            const styles = window.getComputedStyle(document.body);
            return {
                fontFamily: styles.fontFamily,
                backgroundColor: styles.backgroundColor,
                hasCSS: document.styleSheets.length > 0
            };
        });
        console.log('CSS Status:', hasStyles);
        
        // Test all buttons
        console.log('\n🔘 Testing Buttons...');
        const buttons = await page.evaluate(() => {
            const btns = document.querySelectorAll('button');
            return Array.from(btns).map(btn => ({
                id: btn.id,
                text: btn.textContent.trim(),
                visible: btn.offsetParent !== null,
                styles: {
                    backgroundColor: window.getComputedStyle(btn).backgroundColor,
                    width: btn.offsetWidth,
                    height: btn.offsetHeight
                }
            }));
        });
        console.log('Buttons found:', buttons);
        
        // Test 2: Mobile View
        console.log('\n📱 Testing Mobile View (375x667)...');
        await page.setViewport({ width: 375, height: 667 });
        await page.reload({ waitUntil: 'networkidle2' });
        await page.screenshot({ path: 'screenshots/mobile-full.png', fullPage: true });
        
        // Check responsive issues
        const mobileIssues = await page.evaluate(() => {
            const issues = [];
            
            // Check if elements overflow
            const elements = document.querySelectorAll('*');
            elements.forEach(el => {
                if (el.scrollWidth > el.clientWidth) {
                    issues.push({
                        element: el.tagName + (el.id ? '#' + el.id : ''),
                        issue: 'Horizontal overflow',
                        width: el.scrollWidth
                    });
                }
            });
            
            // Check button sizes
            const buttons = document.querySelectorAll('button');
            buttons.forEach(btn => {
                if (btn.offsetWidth < 44 || btn.offsetHeight < 44) {
                    issues.push({
                        element: 'Button ' + btn.id,
                        issue: 'Too small for mobile (< 44px)',
                        size: `${btn.offsetWidth}x${btn.offsetHeight}`
                    });
                }
            });
            
            return issues;
        });
        console.log('Mobile Issues:', mobileIssues);
        
        // Test 3: Menu functionality
        console.log('\n🍔 Testing Menu...');
        const menuButton = await page.$('#newMenuButton');
        if (menuButton) {
            await menuButton.click();
            await page.waitForTimeout(500);
            await page.screenshot({ path: 'screenshots/menu-open.png' });
            
            const menuVisible = await page.evaluate(() => {
                const menu = document.querySelector('.menu-overlay');
                return menu && menu.classList.contains('active');
            });
            console.log('Menu opens:', menuVisible);
        } else {
            console.log('❌ Menu button not found!');
        }
        
        // Test 4: CSS Classes Analysis
        console.log('\n🎨 Analyzing CSS Classes...');
        const cssAnalysis = await page.evaluate(() => {
            const analysis = {
                totalElements: document.querySelectorAll('*').length,
                elementsWithoutStyles: [],
                missingClasses: []
            };
            
            // Check important elements
            const importantSelectors = [
                '.splash-screen', '.countdown', '.milestone', '.nav-button',
                '.menu-overlay', '.time-unit', '.site-title'
            ];
            
            importantSelectors.forEach(selector => {
                const el = document.querySelector(selector);
                if (!el) {
                    analysis.missingClasses.push(selector);
                } else {
                    const styles = window.getComputedStyle(el);
                    if (styles.display === 'none' || !styles.backgroundColor) {
                        analysis.elementsWithoutStyles.push({
                            selector,
                            display: styles.display,
                            bg: styles.backgroundColor
                        });
                    }
                }
            });
            
            return analysis;
        });
        console.log('CSS Analysis:', cssAnalysis);
        
        // Generate report
        console.log('\n📋 TEST REPORT\n');
        console.log('✅ Tests Completed');
        console.log('📸 Screenshots saved to screenshots/');
        console.log('\n⚠️  Issues Found:');
        if (mobileIssues.length > 0) {
            console.log('- Mobile responsive issues detected');
        }
        if (cssAnalysis.missingClasses.length > 0) {
            console.log('- Missing CSS classes:', cssAnalysis.missingClasses);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Create screenshots directory
if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
}

// Run tests
comprehensiveUITest();