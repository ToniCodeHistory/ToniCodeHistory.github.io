// 現代化 JavaScript 功能
document.addEventListener('DOMContentLoaded', function() {
    initializeYear();
    initializeSmoothScroll();
    initializeScrollEffects();
});

// 初始化年份顯示
function initializeYear() {
    const year = document.getElementById('year');
    if (year) {
        year.textContent = new Date().getFullYear();
    }
}

// 初始化平滑滾動
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) { 
                e.preventDefault(); 
                target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            }
        });
    });
}

// 初始化滾動效果
function initializeScrollEffects() {
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}