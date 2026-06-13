const fs = require('fs');
const path = require('path');

const dir = 'd:/Github/Portfolio/SLA breach calculator';

const navLinksTemplate = `  <nav class="nav-links" id="navMenu" aria-label="Site navigation" style="flex-wrap: wrap; justify-content: flex-end;">
    <a href="/" class="nav-link{CALC_ACTIVE}">Calculator</a>
    <a href="/how-to-calculate-sla-breach-penalties/" class="nav-link{HOW_ACTIVE}">How It Works</a>
    <a href="/who-uses-sla-breach-calculators/" class="nav-link{USES_ACTIVE}">Use Cases</a>
    <a href="/blog/" class="nav-link{BLOG_ACTIVE}">Blog</a>
    <a href="/frequently-asked-questions-about-sla-breaches/" class="nav-link{FAQ_ACTIVE}">FAQ</a>
    <a href="/about/" class="nav-link{ABOUT_ACTIVE}">About</a>
    <a href="/contact/" class="nav-link{CONTACT_ACTIVE}">Contact</a>
  </nav>`;

function walk(dirPath, callback) {
    fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory() && !fullPath.includes('.git')) {
            walk(fullPath, callback);
        } else if (fullPath.endsWith('.html')) {
            callback(fullPath);
        }
    });
}

walk(dir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Determine which page we are on
    let calcActive = '';
    let howActive = '';
    let usesActive = '';
    let faqActive = '';
    let aboutActive = '';
    let contactActive = '';
    let blogActive = '';
    
    if (filePath.replace(/\\/g, '/').endsWith('/SLA breach calculator/index.html')) {
        calcActive = ' active';
    } else if (filePath.includes('how-to-calculate')) {
        howActive = ' active';
    } else if (filePath.includes('who-uses')) {
        usesActive = ' active';
    } else if (filePath.includes('frequently-asked')) {
        faqActive = ' active';
    } else if (filePath.includes('about')) {
        aboutActive = ' active';
    } else if (filePath.includes('contact')) {
        contactActive = ' active';
    } else if (filePath.includes('blog')) {
        blogActive = ' active';
    }
    
    let newNav = navLinksTemplate
        .replace('{CALC_ACTIVE}', calcActive)
        .replace('{HOW_ACTIVE}', howActive)
        .replace('{USES_ACTIVE}', usesActive)
        .replace('{FAQ_ACTIVE}', faqActive)
        .replace('{ABOUT_ACTIVE}', aboutActive)
        .replace('{CONTACT_ACTIVE}', contactActive)
        .replace('{BLOG_ACTIVE}', blogActive);
        
    // Replace existing nav
    // Matches <nav class="nav-links" ...> ... </nav>
    const navRegex = /<nav class="nav-links"[\s\S]*?<\/nav>/;
    
    if (navRegex.test(content)) {
        content = content.replace(navRegex, newNav);
        
        // Also add flex-wrap to header if not present
        if (!content.includes('<header role="banner" style="flex-wrap: wrap;">')) {
            content = content.replace('<header role="banner">', '<header role="banner" style="flex-wrap: wrap;">');
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated navbar in: ${filePath}`);
    }
});
console.log("Done");
