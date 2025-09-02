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
    // choose initial theme: saved preference or system preference (prefers-color-scheme)
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ? saved : (prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme', initial);

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
        // set initial visibility according to viewport width
        if (window.innerWidth <= 700) {
            siteNav.classList.add('hidden');
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            siteNav.classList.remove('hidden');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }

        // toggle nav and keep aria-expanded in sync (use class only, CSS handles visibility)
        mobileToggle.addEventListener('click', () => {
            const isHidden = siteNav.classList.contains('hidden');
            if (isHidden) {
                siteNav.classList.remove('hidden');
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                siteNav.classList.add('hidden');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // hide nav when clicking a link and update aria state
        siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            siteNav.classList.add('hidden');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }));

        // keep state consistent when resizing the window
        window.addEventListener('resize', () => {
            if (window.innerWidth > 700) {
                // on larger screens the nav should be visible
                siteNav.classList.remove('hidden');
                mobileToggle.setAttribute('aria-expanded', 'true');
            } else {
                // on small screens hide nav by default
                siteNav.classList.add('hidden');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // header hide-on-scroll: hide header when scrolling down a bit, show when scrolling up
    (function () {
        const header = document.querySelector('.site-header');
        if (!header) return;

        let lastScroll = 0;
        const THRESHOLD = 60; // start hiding after this many pixels
        let ticking = false;

        window.addEventListener('scroll', () => {
            const current = window.pageYOffset || document.documentElement.scrollTop;
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const shouldHide = (current > lastScroll && current > THRESHOLD);
                    const isHidden = header.classList.contains('hidden');
                    if (shouldHide && !isHidden) header.classList.add('hidden');
                    if (!shouldHide && isHidden) header.classList.remove('hidden');
                    lastScroll = Math.max(0, current);
                    ticking = false;
                });
                ticking = true;
            }
        });
    })();

    // Ensure external http/https links open safely and mark them for screen readers
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        try {
            const url = new URL(a.href);
            const isExternal = url.origin !== location.origin;
            if (isExternal) {
                // enforce safe attributes if not provided
                if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
                if (!a.hasAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
                a.classList.add('external');
                // if the link already has text, add an accessible hint only if none present
                if (!a.getAttribute('aria-label')) {
                    a.setAttribute('aria-label', a.textContent.trim() + '（外部連結，在新分頁開啟）');
                }
            }
        } catch (e) {
            // ignore invalid URLs
        }
    });

    // slide-in animation: observe .hero and add .in-view when it enters viewport
    const hero = document.querySelector('.hero');
    if (hero) {
        if ('IntersectionObserver' in window) {
            const io = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });
            io.observe(hero);
        } else {
            // fallback: add class after a short delay on load
            window.addEventListener('load', () => setTimeout(() => hero.classList.add('in-view'), 120));
        }
    }
});
