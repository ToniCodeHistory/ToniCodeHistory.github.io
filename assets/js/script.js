document.addEventListener('DOMContentLoaded', () => {
    initializeYear();
    initializeSmoothScroll();
    loadDefaultTheme();
    initializeMobileNavigation();
    initializeHeaderAutoHide();
    initializeExternalLinks();
    initializeHeroAnimation();
    initializeScrollProgress();
    initializeFadeInAnimations();
});
// 初始化年份顯示
function initializeYear() {
    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
}
// 初始化平滑滾動
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const href = a.getAttribute('href');
            if (href === '#' || href === '') return;
            const el = document.querySelector(href);
            if (el) { 
                e.preventDefault(); 
                el.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
        });
    });
}
// 初始化手機版導覽選單
function initializeMobileNavigation() {
    const mobileToggle = document.getElementById('mobileNavToggle');
    const siteNav = document.getElementById('siteNav');
    if (!mobileToggle || !siteNav) return;
    // 設定初始可見性
    function setInitialNavVisibility() {
        if (window.innerWidth <= 700) {
            siteNav.classList.add('hidden');
            mobileToggle.setAttribute('aria-expanded', 'false');
        } else {
            siteNav.classList.remove('hidden');
            mobileToggle.setAttribute('aria-expanded', 'true');
        }
    }
    // 切換導覽選單
    function toggleNavigation() {
        const isHidden = siteNav.classList.contains('hidden');
        if (isHidden) {
            siteNav.classList.remove('hidden');
            mobileToggle.setAttribute('aria-expanded', 'true');
        } else {
            siteNav.classList.add('hidden');
            mobileToggle.setAttribute('aria-expanded', 'false');
        }
    }
    // 隱藏導覽選單
    function hideNavigation() {
        siteNav.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
    }
    setInitialNavVisibility();
    mobileToggle.addEventListener('click', toggleNavigation);
    window.addEventListener('resize', setInitialNavVisibility);
}
// 初始化標題列自動隱藏功能
function initializeHeaderAutoHide() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    const THRESHOLD = 60;
    let ticking = false;
    
    function handleScroll() {
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
    }
    window.addEventListener('scroll', handleScroll);
}
// 初始化外部連結處理
function initializeExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(a => {
        try {
            const url = new URL(a.href);
            const isExternal = url.origin !== location.origin;
            if (isExternal) {
                if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
                if (!a.hasAttribute('rel')) a.setAttribute('rel', 'noopener noreferrer');
                a.classList.add('external');
                if (!a.getAttribute('aria-label')) {
                    a.setAttribute('aria-label', a.textContent.trim() + '（外部連結，在新分頁開啟）');
                }
            }
        } catch (e) {
            // 忽略無效的 URL
        }
    });
}
// 初始化 hero section 動畫
function initializeHeroAnimation() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        observer.observe(hero);
    } else {
        // 回退方案：載入後延遲添加類別
        window.addEventListener('load', () => {
            setTimeout(() => hero.classList.add('in-view'), 120);
        });
    }
}
// 載入並初始化主題系統
function loadDefaultTheme() {
    const toggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    
    if (!toggle) return;

    // 主題配置
    const themes = ['system', 'light', 'dark'];
    const themeIcons = {
        system: '🖥️',
        light: '☀️',
        dark: '🌙'
    };
    const themeLabels = {
        system: '切換主題（目前：跟隨系統）',
        light: '切換主題（目前：淺色）',
        dark: '切換主題（目前：深色）'
    };

    // 初始化主題狀態
    const saved = localStorage.getItem('theme');
    const initial = saved && themes.includes(saved) ? saved : 'system';
    let currentThemeIndex = themes.indexOf(initial);

    // 應用主題到頁面
    function applyTheme(themeMode) {
        if (themeMode === 'system') {
            root.removeAttribute('data-theme');
        } else {
            root.setAttribute('data-theme', themeMode);
        }
        localStorage.setItem('theme', themeMode);
    }

    // 更新切換按鈕圖示和標籤
    function updateToggleIcon() {
        const currentTheme = themes[currentThemeIndex];
        toggle.innerHTML = themeIcons[currentTheme];
        toggle.setAttribute('aria-label', themeLabels[currentTheme]);
    }

    // 處理主題切換
    function handleThemeToggle() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        applyTheme(newTheme);
        updateToggleIcon();
    }

    // 初始化
    applyTheme(initial);
    updateToggleIcon();
    
    // 事件監聽器
    toggle.addEventListener('click', handleThemeToggle);
    
    // 監聽主題屬性變化以更新圖示（為了相容性）
    const observer = new MutationObserver(updateToggleIcon);
    observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
}

// 初始化滾動進度條
function initializeScrollProgress() {
    // 創建進度條元素
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    function updateProgress() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const progress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // 初始化
}

// 初始化淡入動畫
function initializeFadeInAnimations() {
    const elements = document.querySelectorAll('.section, .timeline li, .card');
    
    // 為元素添加淡入類別
    elements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        elements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // 回退方案：載入後添加可見類別
        elements.forEach(el => {
            el.classList.add('visible');
        });
    }
}