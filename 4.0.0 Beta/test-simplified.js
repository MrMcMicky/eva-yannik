// Test der vereinfachten Version ohne Browser
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing simplified version...\n');

// Check if all files exist
const requiredFiles = [
    'index-simplified.html',
    'style.css',
    'js/main.js',
    'js/countdown.js',
    'js/ui-controls.js',
    'js/milestones.js',
    'js/splash-screen.js',
    'images/breit.jpg',
    'images/lang.jpg'
];

console.log('📁 Checking files:');
let allFilesExist = true;
requiredFiles.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
    if (!exists) allFilesExist = false;
});

if (!allFilesExist) {
    console.log('\n❌ Some files are missing!');
    process.exit(1);
}

// Check HTML structure
console.log('\n🔍 Checking HTML structure:');
const html = fs.readFileSync(path.join(__dirname, 'index-simplified.html'), 'utf8');

const checks = [
    { name: 'UTF-8 charset', pattern: /<meta charset="UTF-8">/ },
    { name: 'Viewport meta', pattern: /<meta name="viewport"/ },
    { name: 'Title', pattern: /<title>Eva & Yannik/ },
    { name: 'Countdown section', pattern: /id="countdown"/ },
    { name: 'All time units', pattern: /id="days".*id="hours".*id="minutes".*id="seconds"/s },
    { name: 'Navigation buttons', pattern: /id="newMenuButton".*id="bibleButton".*id="newSettingsButton".*id="infoButton"/s },
    { name: 'All overlays', pattern: /menu-overlay.*bible-overlay.*settings-overlay.*info-overlay/s },
    { name: 'JavaScript includes', pattern: /countdown\.js.*ui-controls\.js.*milestones\.js.*splash-screen\.js.*main\.js/s }
];

checks.forEach(check => {
    const passed = check.pattern.test(html);
    console.log(`  ${passed ? '✅' : '❌'} ${check.name}`);
});

// Check JavaScript syntax
console.log('\n🔧 Checking JavaScript syntax:');
const jsFiles = [
    'js/main.js',
    'js/countdown.js',
    'js/ui-controls.js',
    'js/milestones.js',
    'js/splash-screen.js'
];

jsFiles.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(__dirname, file), 'utf8');
        // Basic syntax check
        new Function(content);
        console.log(`  ✅ ${file} - Valid syntax`);
    } catch (error) {
        console.log(`  ❌ ${file} - Syntax error: ${error.message}`);
    }
});

console.log('\n✨ Test complete!');