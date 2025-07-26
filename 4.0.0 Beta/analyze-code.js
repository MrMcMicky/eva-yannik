// Code analysis for Eva & Yannik 4.0.0 Beta
// Analyzes structure, complexity, and potential issues

const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing Eva & Yannik 4.0.0 Beta...\n');

// Read HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

// Analysis results
const analysis = {
    features: [],
    buttons: [],
    eventListeners: [],
    complexFunctions: [],
    potentialIssues: [],
    improvements: []
};

// Find all buttons
const buttonMatches = htmlContent.matchAll(/<button[^>]*id="([^"]*)"[^>]*>([^<]*)</g);
for (const match of buttonMatches) {
    analysis.buttons.push({
        id: match[1],
        text: match[2].trim()
    });
}

// Find all event listeners
const listenerMatches = htmlContent.matchAll(/addEventListener\(['"]([^'"]*)['"]/g);
for (const match of listenerMatches) {
    if (!analysis.eventListeners.includes(match[1])) {
        analysis.eventListeners.push(match[1]);
    }
}

// Identify features
if (htmlContent.includes('countdown')) analysis.features.push('Countdown Timer');
if (htmlContent.includes('milestones')) analysis.features.push('Milestones Tracking');
if (htmlContent.includes('splash-screen')) analysis.features.push('Splash Screen');
if (htmlContent.includes('bible-overlay')) analysis.features.push('Bible Feature');
if (htmlContent.includes('settings-overlay')) analysis.features.push('Settings Panel');
if (htmlContent.includes('version-history')) analysis.features.push('Version History');
if (htmlContent.includes('dark-mode')) analysis.features.push('Dark Mode Support');

// Check for complex inline JavaScript
const scriptTags = htmlContent.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
let totalInlineJS = 0;
scriptTags.forEach(script => {
    const content = script.replace(/<\/?script[^>]*>/g, '');
    totalInlineJS += content.length;
});

// Identify potential issues
if (totalInlineJS > 5000) {
    analysis.potentialIssues.push({
        type: 'Code Organization',
        issue: `Large amount of inline JavaScript (${totalInlineJS} characters)`,
        severity: 'Medium',
        suggestion: 'Consider moving JavaScript to separate files'
    });
}

// Check for repeated code patterns
const functionCounts = {};
const functionMatches = htmlContent.matchAll(/function\s+(\w+)|const\s+(\w+)\s*=\s*function/g);
for (const match of functionMatches) {
    const funcName = match[1] || match[2];
    functionCounts[funcName] = (functionCounts[funcName] || 0) + 1;
}

// Find duplicate function definitions
Object.entries(functionCounts).forEach(([name, count]) => {
    if (count > 1) {
        analysis.potentialIssues.push({
            type: 'Duplicate Function',
            issue: `Function '${name}' defined ${count} times`,
            severity: 'High',
            suggestion: 'Remove duplicate function definitions'
        });
    }
});

// Check for accessibility
if (!htmlContent.includes('aria-label')) {
    analysis.potentialIssues.push({
        type: 'Accessibility',
        issue: 'Missing ARIA labels on interactive elements',
        severity: 'Low',
        suggestion: 'Add aria-label attributes to buttons and interactive elements'
    });
}

// Suggest improvements for beginners
analysis.improvements.push({
    area: 'Code Organization',
    current: 'All JavaScript is inline in HTML',
    improved: 'Separate JavaScript into modules:\n  - countdown.js (timer logic)\n  - ui-controls.js (buttons and overlays)\n  - animations.js (visual effects)\n  - main.js (initialization)'
});

analysis.improvements.push({
    area: 'Variable Naming',
    current: 'Some variables use unclear names',
    improved: 'Use descriptive names:\n  - btn → closeButton\n  - el → element\n  - cfg → configuration'
});

analysis.improvements.push({
    area: 'Comments',
    current: 'Limited comments in code',
    improved: 'Add comments explaining:\n  - What each function does\n  - Complex logic\n  - Configuration options'
});

// Print analysis results
console.log('📊 ANALYSIS RESULTS\n');

console.log('✨ Features Found:');
analysis.features.forEach(feature => console.log(`  - ${feature}`));

console.log('\n🔘 Buttons Found:');
analysis.buttons.forEach(btn => console.log(`  - ${btn.id}: "${btn.text || 'Icon Button'}"`));

console.log('\n👂 Event Listeners:');
analysis.eventListeners.forEach(event => console.log(`  - ${event}`));

console.log('\n⚠️  Potential Issues:');
if (analysis.potentialIssues.length === 0) {
    console.log('  ✅ No major issues found');
} else {
    analysis.potentialIssues.forEach(issue => {
        console.log(`  - [${issue.severity}] ${issue.type}: ${issue.issue}`);
        console.log(`    → ${issue.suggestion}`);
    });
}

console.log('\n💡 Improvements for Beginners:');
analysis.improvements.forEach(imp => {
    console.log(`\n  ${imp.area}:`);
    console.log(`  Current: ${imp.current}`);
    console.log(`  Better: ${imp.improved}`);
});

console.log('\n📈 Code Statistics:');
console.log(`  - HTML file size: ${(htmlContent.length / 1024).toFixed(2)} KB`);
console.log(`  - CSS file size: ${(cssContent.length / 1024).toFixed(2)} KB`);
console.log(`  - Inline JavaScript: ${(totalInlineJS / 1024).toFixed(2)} KB`);
console.log(`  - Total buttons: ${analysis.buttons.length}`);
console.log(`  - Event types: ${analysis.eventListeners.length}`);

// Save analysis to file
fs.writeFileSync(
    path.join(__dirname, 'code-analysis.json'),
    JSON.stringify(analysis, null, 2)
);

console.log('\n✅ Analysis complete! Results saved to code-analysis.json');