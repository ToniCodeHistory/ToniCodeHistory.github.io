document.addEventListener('DOMContentLoaded', () => {
    // year
    const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();

    // smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#' || href === '') return;
            const el = document.querySelector(href);
            if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
        });
    });

    // theme toggle
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);

    function setTheme(t) {
        root.setAttribute('data-theme', t);
        localStorage.setItem('theme', t);
    }

    toggle.addEventListener('click', () => {
        const cur = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(cur);
        updateToggleIcon();
    });

    // initial button icon
    function updateToggleIcon() {
        const isDark = root.getAttribute('data-theme') === 'dark';
        toggle.innerHTML = isDark ? '🌙' : '☀️';
    }
    updateToggleIcon();
    // observe theme changes to update icon
    const obs = new MutationObserver(() => updateToggleIcon());
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });

    // mobile nav toggle
    const mobileToggle = document.getElementById('mobileNavToggle');
    const siteNav = document.getElementById('siteNav');
    if (mobileToggle && siteNav) {
        mobileToggle.addEventListener('click', () => {
            siteNav.classList.toggle('hidden');
        });
        // hide nav when clicking a link
        siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => siteNav.classList.add('hidden')));
    }
});
