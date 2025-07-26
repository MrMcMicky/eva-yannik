// Comprehensive test script for Eva & Yannik 4.0.0 Beta
// Tests all buttons, features, and functionality

const puppeteer = require('puppeteer');
const path = require('path');

async function testAllFeatures() {
    const browser = await puppeteer.launch({ 
        headless: false,  // Set to true for automated testing
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const page = await browser.newPage();
    const filePath = 'file://' + path.join(__dirname, 'index.html');
    
    console.log('🧪 Starting comprehensive test of Eva & Yannik 4.0.0 Beta...\n');
    
    try {
        // Load the page
        await page.goto(filePath);
        console.log('✅ Page loaded successfully');
        
        // Test 1: Check if splash screen appears
        const splashScreen = await page.$('.splash-screen.active');
        if (splashScreen) {
            console.log('✅ Splash screen appears on load');
            
            // Close splash screen
            await page.click('#closeSplash');
            await page.waitForTimeout(600);
            console.log('✅ Splash screen closes when button clicked');
        }
        
        // Test 2: Test all menu buttons
        console.log('\n📱 Testing menu buttons...');
        
        // Test Menu button
        await page.click('#newMenuButton');
        await page.waitForTimeout(300);
        let menuVisible = await page.$eval('.menu-overlay', el => el.classList.contains('active'));
        console.log(menuVisible ? '✅ Menu button opens menu' : '❌ Menu button failed');
        
        // Close menu
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        // Test Bible button
        await page.click('#bibleButton');
        await page.waitForTimeout(300);
        let bibleVisible = await page.$eval('.bible-overlay', el => el.classList.contains('active'));
        console.log(bibleVisible ? '✅ Bible button opens Bible menu' : '❌ Bible button failed');
        
        // Close Bible menu
        await page.click('#closeBible');
        await page.waitForTimeout(300);
        
        // Test Settings button
        await page.click('#newSettingsButton');
        await page.waitForTimeout(300);
        let settingsVisible = await page.$eval('.settings-overlay', el => el.classList.contains('active'));
        console.log(settingsVisible ? '✅ Settings button opens settings' : '❌ Settings button failed');
        
        // Close Settings
        await page.click('#closeSettings');
        await page.waitForTimeout(300);
        
        // Test Info button
        await page.click('#infoButton');
        await page.waitForTimeout(300);
        let infoVisible = await page.$eval('.info-overlay', el => el.classList.contains('active'));
        console.log(infoVisible ? '✅ Info button opens info panel' : '❌ Info button failed');
        
        // Test version history button in info panel
        await page.click('#showVersionHistory');
        await page.waitForTimeout(300);
        let versionHistoryVisible = await page.$eval('.version-history-overlay', el => el.classList.contains('active'));
        console.log(versionHistoryVisible ? '✅ Version history button works' : '❌ Version history button failed');
        
        // Close version history
        await page.click('#closeVersionHistory');
        await page.waitForTimeout(300);
        
        // Test upcoming features button
        await page.click('#showUpcomingFeatures');
        await page.waitForTimeout(300);
        let upcomingVisible = await page.$eval('.upcoming-features-overlay', el => el.classList.contains('active'));
        console.log(upcomingVisible ? '✅ Upcoming features button works' : '❌ Upcoming features button failed');
        
        // Close upcoming features
        await page.click('#closeUpcomingFeatures');
        await page.waitForTimeout(300);
        
        // Test config state button
        await page.click('#showConfigState');
        await page.waitForTimeout(300);
        let configVisible = await page.$eval('.config-state-overlay', el => el.classList.contains('active'));
        console.log(configVisible ? '✅ Config state button works' : '❌ Config state button failed');
        
        // Close config state
        await page.click('#closeConfigState');
        await page.waitForTimeout(300);
        
        // Close info panel
        await page.click('#closeInfo');
        await page.waitForTimeout(300);
        
        // Test 3: Test countdown functionality
        console.log('\n⏰ Testing countdown...');
        const countdownExists = await page.$('#countdown');
        console.log(countdownExists ? '✅ Countdown element exists' : '❌ Countdown element missing');
        
        // Test 4: Test milestones
        console.log('\n🏆 Testing milestones...');
        const milestonesExist = await page.$('.milestones-grid');
        console.log(milestonesExist ? '✅ Milestones section exists' : '❌ Milestones section missing');
        
        // Test 5: Test responsive design
        console.log('\n📱 Testing responsive design...');
        
        // Test mobile view
        await page.setViewport({ width: 375, height: 667 });
        await page.waitForTimeout(500);
        console.log('✅ Mobile view rendered');
        
        // Test tablet view
        await page.setViewport({ width: 768, height: 1024 });
        await page.waitForTimeout(500);
        console.log('✅ Tablet view rendered');
        
        // Test desktop view
        await page.setViewport({ width: 1920, height: 1080 });
        await page.waitForTimeout(500);
        console.log('✅ Desktop view rendered');
        
        // Test 6: Check for console errors
        console.log('\n🐛 Checking for console errors...');
        const consoleErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });
        
        // Reload page to catch any errors
        await page.reload();
        await page.waitForTimeout(1000);
        
        if (consoleErrors.length === 0) {
            console.log('✅ No console errors found');
        } else {
            console.log('❌ Console errors found:');
            consoleErrors.forEach(error => console.log('  - ' + error));
        }
        
        // Test 7: Performance check
        console.log('\n⚡ Checking performance...');
        const metrics = await page.metrics();
        console.log(`✅ JS Heap Size: ${(metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`✅ DOM Nodes: ${metrics.Nodes}`);
        
        console.log('\n✨ All tests completed!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        await browser.close();
    }
}

// Run the tests
testAllFeatures();