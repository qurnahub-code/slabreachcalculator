const fs = require('fs');
const path = require('path');

const dir = 'd:/Github/Portfolio/SLA breach calculator';

const footerTemplate = `<footer role="contentinfo">
  <div class="footer-logo">SLABreach<span>Calculator</span>.site</div>
  <div class="footer-links">
    <a href="/">Calculator</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/how-to-calculate-sla-breach-penalties/">How It Works</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/who-uses-sla-breach-calculators/">Use Cases</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/frequently-asked-questions-about-sla-breaches/">FAQ</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/about/">About</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/privacy/">Privacy</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/terms/">Terms</a>
    <span class="footer-sep" aria-hidden="true">·</span>
    <a href="/contact/">Contact</a>
  </div>
  <p class="footer-note">Free SLA Breach Calculator — Not legal advice · Results are estimates based on your inputs · Always verify against your contract language</p>
</footer>`;

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
    
    // Replace <footer role="contentinfo">...</footer>
    const footerRegex = /<footer role="contentinfo"[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, footerTemplate);
        fs.writeFileSync(filePath, content);
        console.log(`Updated footer in: ${filePath}`);
    } else {
        console.log(`No footer found in: ${filePath}`);
    }
});
console.log("Done");
