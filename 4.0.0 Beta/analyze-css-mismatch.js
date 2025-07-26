// Analyze CSS class mismatches between HTML and CSS
const fs = require('fs');

console.log('🔍 Analyzing CSS class mismatches...\n');

// Read files
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('style.css', 'utf8');

// Extract classes from HTML
const htmlClasses = new Set();
const htmlClassMatches = html.matchAll(/class="([^"]*)"/g);
for (const match of htmlClassMatches) {
    const classes = match[1].split(' ');
    classes.forEach(cls => htmlClasses.add(cls));
}

// Extract classes from CSS
const cssClasses = new Set();
const cssClassMatches = css.matchAll(/\.([a-zA-Z0-9_-]+)/g);
for (const match of cssClassMatches) {
    cssClasses.add(match[1]);
}

// Find mismatches
const htmlOnly = [...htmlClasses].filter(cls => !cssClasses.has(cls));
const cssOnly = [...cssClasses].filter(cls => !htmlClasses.has(cls));

console.log('📊 Analysis Results:\n');
console.log(`HTML has ${htmlClasses.size} unique classes`);
console.log(`CSS has ${cssClasses.size} unique classes`);

console.log('\n❌ Classes in HTML but NOT in CSS:');
htmlOnly.forEach(cls => console.log(`  - .${cls}`));

console.log('\n⚠️  Important CSS classes NOT used in HTML:');
const importantCssOnly = cssOnly.filter(cls => 
    cls.includes('button') || 
    cls.includes('menu') || 
    cls.includes('overlay') ||
    cls.includes('nav') ||
    cls.includes('countdown') ||
    cls.includes('milestone')
);
importantCssOnly.forEach(cls => console.log(`  - .${cls}`));

console.log('\n💡 Recommendations:');
if (htmlOnly.length > 0) {
    console.log('- Add missing CSS rules for HTML classes');
}
if (importantCssOnly.length > 0) {
    console.log('- Update HTML to use existing CSS classes');
}