const fs = require('fs');
const path = require('path');

const dir = 'd:/Github/Portfolio/SLA breach calculator';

// 1. Read index.html
let indexHtml = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

// Regex to extract the 3 sections
const howToRegex = /<!-- ══ HOW IT WORKS ══ -->\s*<section[\s\S]*?<\/section>/;
const useCasesRegex = /<!-- ══ USE CASES ══ -->\s*<section[\s\S]*?<\/section>/;
const faqRegex = /<!-- ══ FAQ ══ -->\s*<section[\s\S]*?<\/section>/;

const howToHtml = indexHtml.match(howToRegex)[0];
const useCasesHtml = indexHtml.match(useCasesRegex)[0];
const faqHtml = indexHtml.match(faqRegex)[0];

// Remove them from index.html (and leave a placeholder if needed, but we'll just remove them)
indexHtml = indexHtml.replace(howToRegex, '');
indexHtml = indexHtml.replace(useCasesRegex, '');
indexHtml = indexHtml.replace(faqRegex, '');

// Save index.html
fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);

// 2. Create the new pages using about/index.html as template
const templateHtml = fs.readFileSync(path.join(dir, 'about', 'index.html'), 'utf8');

function createPage(folderName, title, description, contentHtml) {
    const targetDir = path.join(dir, folderName);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    
    let newHtml = templateHtml;
    // Replace metadata
    newHtml = newHtml.replace(/<title>.*?<\/title>/, `<title>${title} | SLABreachCalculator.site</title>`);
    newHtml = newHtml.replace(/content="About SLABreachCalculator\.site"/, `content="${title}"`);
    newHtml = newHtml.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${description}"`);
    newHtml = newHtml.replace(/<meta property="og:description" content=".*?"/, `<meta property="og:description" content="${description}"`);
    
    // Replace hero content
    newHtml = newHtml.replace(/<h1 id="page-heading".*?<\/h1>/, `<h1 id="page-heading" class="page-title">${title}</h1>`);
    newHtml = newHtml.replace(/<p class="hero-sub">.*?<\/p>/, `<p class="hero-sub">${description}</p>`);
    newHtml = newHtml.replace(/<div class="hero-eyebrow">About Us<\/div>/, `<div class="hero-eyebrow">Guide</div>`);
    
    // Replace the main container content
    // We want to replace everything inside <div class="container"> ... </div> right after <section class="hero"...>
    const containerStart = newHtml.indexOf('<div class="container">');
    const containerEnd = newHtml.indexOf('<footer', containerStart);
    // actually, let's just do a regex replace of the content-cards
    const containerRegex = /<div class="container">[\s\S]*?<footer/;
    newHtml = newHtml.replace(containerRegex, `<div class="container">\n${contentHtml}\n</div>\n\n<footer`);
    
    // In FAQ, we need the JS script for toggling FAQ if it's not present globally
    // The toggleFaq function is in index.html, we need to inject it into faq page
    if (folderName.includes('faq')) {
        const toggleScript = `\n<script>\nfunction toggleFaq(el) {\n  const item = el.parentElement;\n  const isOp = item.classList.contains('open');\n  document.querySelectorAll('.faq-item').forEach(i => {\n    i.classList.remove('open');\n    i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');\n  });\n  if (!isOp) {\n    item.classList.add('open');\n    el.setAttribute('aria-expanded', 'true');\n  }\n}\n</script>\n</body>`;
        newHtml = newHtml.replace(/<\/body>/, toggleScript);
    }
    
    fs.writeFileSync(path.join(targetDir, 'index.html'), newHtml);
}

createPage('how-to-calculate-sla-breach-penalties', 'How to Calculate SLA Breach Penalties', 'Learn the standard formulas and step-by-step processes for calculating SLA breach penalties and service credits.', howToHtml);
createPage('who-uses-sla-breach-calculators', 'Who Uses SLA Breach Calculators?', 'Discover how IT managers, procurement teams, and operations directors use SLA breach calculators to enforce contracts.', useCasesHtml);
createPage('frequently-asked-questions-about-sla-breaches', 'SLA Breach FAQ', 'Frequently asked questions about SLA breach penalties, service credits, and contract enforcement.', faqHtml);

console.log("Pages created.");

// 3. Update links across all HTML files
function walk(dirPath, callback) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('.git')) {
            walk(fullPath, callback);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.xml') || fullPath.endsWith('.txt')) {
            callback(fullPath);
        }
    });
}

const replacements = {
    '/about.html': '/about/',
    '/privacy.html': '/privacy/',
    '/terms.html': '/terms/',
    '/contact.html': '/contact/',
    '#how-to-calculate-sla-breach-penalties': '/how-to-calculate-sla-breach-penalties/',
    '#frequently-asked-questions-about-sla-breaches': '/frequently-asked-questions-about-sla-breaches/',
    '#who-uses-sla-breach-calculators': '/who-uses-sla-breach-calculators/'
};

walk(dir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;
    for (const [oldVal, newVal] of Object.entries(replacements)) {
        // use regex to replace all globally
        // escape oldVal for regex
        const regex = new RegExp(oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        if (regex.test(content)) {
            content = content.replace(regex, newVal);
            changed = true;
        }
    }
    
    // Update sitemap.xml entries to use trailing slashes instead of .html
    if (filePath.endsWith('sitemap.xml')) {
        content = content.replace(/\.html/g, '/');
        changed = true;
    }
    
    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated links in: ${filePath}`);
    }
});

console.log("Done updating links.");
