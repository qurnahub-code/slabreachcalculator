const fs = require('fs');
const path = require('path');

const dir = 'd:/Github/Portfolio/SLA breach calculator';

const headerTemplate = `<header role="banner" style="flex-wrap: wrap;">
  <a href="/" class="logo" aria-label="SLABreachCalculator.site Home">
    <div class="logo-icon" aria-hidden="true">⚡</div>
    SLABreach<span>Calculator</span>.site
  </a>
  <button class="mobile-menu-btn" id="menuToggle" aria-label="Toggle menu">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
  </button>
  <nav class="nav-links" id="navMenu" aria-label="Site navigation" style="display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end;">
    <a href="/" class="nav-link{CALC_ACTIVE}">Calculator</a>
    <a href="/how-to-calculate-sla-breach-penalties/" class="nav-link{HOW_ACTIVE}">How It Works</a>
    <a href="/who-uses-sla-breach-calculators/" class="nav-link{USES_ACTIVE}">Use Cases</a>
    <a href="/blog/" class="nav-link{BLOG_ACTIVE}">Blog</a>
    <a href="/frequently-asked-questions-about-sla-breaches/" class="nav-link{FAQ_ACTIVE}">FAQ</a>
    <a href="/about/" class="nav-link{ABOUT_ACTIVE}">About</a>
    <a href="/contact/" class="nav-link{CONTACT_ACTIVE}">Contact</a>
  </nav>
</header>`;

const navCss = `
.nav-links { display: flex; gap: 6px; flex-wrap: wrap; justify-content: flex-end; }
.nav-link { font-size: 13px; color: var(--slate-400); text-decoration: none; padding: 6px 12px; border-radius: var(--radius); transition: all 0.15s; }
.nav-link:hover { color: var(--white); background: rgba(255,255,255,0.06); }
.nav-link.active { color: var(--blue-300); background: rgba(59,130,246,0.08); }
`;

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
    
    // Determine active page
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
    
    let newHeader = headerTemplate
        .replace('{CALC_ACTIVE}', calcActive)
        .replace('{HOW_ACTIVE}', howActive)
        .replace('{USES_ACTIVE}', usesActive)
        .replace('{BLOG_ACTIVE}', blogActive)
        .replace('{FAQ_ACTIVE}', faqActive)
        .replace('{ABOUT_ACTIVE}', aboutActive)
        .replace('{CONTACT_ACTIVE}', contactActive);
        
    // Replace <header role="banner">...</header>
    const headerRegex = /<header role="banner"[\s\S]*?<\/header>/;
    if (headerRegex.test(content)) {
        content = content.replace(headerRegex, newHeader);
        
        // Add CSS to index.html if missing
        if (filePath.replace(/\\/g, '/').endsWith('/SLA breach calculator/index.html')) {
            if (!content.includes('.nav-link {')) {
                content = content.replace('</style>', navCss + '</style>');
            }
        }
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated header in: ${filePath}`);
    } else {
        console.log(`No header found in: ${filePath}`);
    }
});
console.log("Done");
