// 現代化 JavaScript 功能
document.addEventListener('DOMContentLoaded', function() {
    initializeYear();
    initializeSmoothScroll();
    initializeScrollEffects();
    initializeContainerHoverEffects();
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

// 初始化容器 hover 效果
function initializeContainerHoverEffects() {
    const containers = document.querySelectorAll('.container');
    
    containers.forEach(function(container) {
        let lastMouseY = 0;
        let isFirstMove = true;
        
        container.addEventListener('mouseenter', function(e) {
            lastMouseY = e.clientY;
            isFirstMove = true;
        });
        
        container.addEventListener('mousemove', function(e) {
            if (isFirstMove) {
                isFirstMove = false;
                return;
            }
            
            const currentMouseY = e.clientY;
            const deltaY = currentMouseY - lastMouseY;
            
            // 移除之前的類
            container.classList.remove('move-up', 'move-down');
            
            // 根據滑鼠移動方向添加類
            if (deltaY < 0) {
                // 向上移動
                container.classList.add('move-up');
            } else if (deltaY > 0) {
                // 向下移動
                container.classList.add('move-down');
            }
            
            lastMouseY = currentMouseY;
        });
        
        container.addEventListener('mouseleave', function() {
            // 離開時移除所有方向類
            container.classList.remove('move-up', 'move-down');
        });
    });
}