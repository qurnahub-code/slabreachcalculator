const fs = require('fs');
const path = require('path');

const dir = 'd:/Github/Portfolio/SLA breach calculator';

const mobileCss = `
.mobile-menu-btn { display: none; background: none; border: none; color: var(--white); cursor: pointer; padding: 4px; z-index: 101; }
@media (max-width: 768px) {
  .mobile-menu-btn { display: block; }
  header { position: relative; padding: 14px 20px; }
  .nav-links { position: absolute; top: 100%; left: 0; right: 0; background: rgba(6,13,27,0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); flex-direction: column; padding: 20px; gap: 12px; clip-path: inset(0 0 100% 0); transition: clip-path 300ms cubic-bezier(0.23, 1, 0.32, 1); pointer-events: none; align-items: stretch; }
  .nav-links.open { clip-path: inset(0 0 0 0); pointer-events: auto; }
  .nav-link { font-size: 15px; padding: 10px 14px; text-align: center; border-radius: var(--radius); }
}
`;

const mobileJs = `
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
      menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
      });
    }
  });
</script>
</body>`;

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
    let changed = false;

    // 1. Check if mobile CSS is present
    if (!content.includes('.mobile-menu-btn { display: none;')) {
        content = content.replace('</style>', mobileCss + '\n</style>');
        changed = true;
    }

    // 2. Check if Javascript is present
    if (!content.includes('navMenu.classList.toggle(')) {
        content = content.replace('</body>', mobileJs);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed mobile menu in: ' + filePath);
    }
});
console.log('Done');
