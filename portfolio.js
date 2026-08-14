// ===== INITIALIZE THEME =====
(function () {
    var saved = localStorage.getItem('portfolio-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
})();

// ===== GLOBAL CLICK FUNCTIONS =====
window.toggleTheme = function (e) {
    if (e) e.preventDefault();
    var html = document.documentElement;
    var current = html.getAttribute('data-theme') || 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('portfolio-theme', next);
};

window.toggleMobileMenu = function (e) {
    if (e) e.preventDefault(); // Prevents screen jump
    var menu = document.getElementById('mobile-menu');
    var toggle = document.getElementById('menu-toggle');
    if (menu && toggle) {
        var isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen.toString());
        toggle.classList.toggle('active', isOpen);
    }
};

window.closeMobileMenu = function (e) {
    var menu = document.getElementById('mobile-menu');
    var toggle = document.getElementById('menu-toggle');
    if (menu) menu.classList.remove('open');
    if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('active');
    }
};

// ===== SMOOTH SCROLLING =====
document.addEventListener('click', function (e) {
    var anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        var href = anchor.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var navbar = document.querySelector('.navbar');
                var navHeight = navbar ? navbar.offsetHeight : 70;
                var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 10;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        }
    }
});

// ===== MAIN INIT (Called by Blazor) =====
// Added flag to prevent duplicate event bindings if Blazor re-renders
let isPortfolioInitialized = false;

window.portfolioInit = function () {
    if (isPortfolioInitialized) {
        //console.log("Portfolio already initialized, skipping re-init.");
        return;
    }

    //console.log("Portfolio JS loaded and portfolioInit called!");
    
    initScrollAnimations();
    initSkillBars();
    initBackToTop();
    initActiveNavLinks();
    initNavbarScroll();
    
    isPortfolioInitialized = true;
};

function initNavbarScroll() {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initScrollAnimations() {
    var els = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    if (!els.length || typeof IntersectionObserver === 'undefined') {
        els.forEach(function (el) { el.classList.add('animated'); });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { observer.observe(el); });
}

function initSkillBars() {
    var bars = document.querySelectorAll('.skill-fill');
    if (!bars.length || typeof IntersectionObserver === 'undefined') {
        bars.forEach(function (bar) {
            bar.style.width = (bar.getAttribute('data-width') || '0') + '%';
        });
        return;
    }
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var bar = entry.target;
                var width = bar.getAttribute('data-width') || '0';
                setTimeout(function () { bar.style.width = width + '%'; }, 150);
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.4 });
    bars.forEach(function (bar) {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    function onScroll() {
        btn.classList.toggle('visible', window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

function initActiveNavLinks() {
    var sections = document.querySelectorAll('section[id]');
    var links = document.querySelectorAll('.desktop-nav-menu .nav-link[href^="#"]');
    if (!sections.length || !links.length) return;
    function onScroll() {
        var current = sections[0].getAttribute('id');
        var navHeight = 90;
        sections.forEach(function (sec) {
            if (window.scrollY >= sec.offsetTop - navHeight) {
                current = sec.getAttribute('id');
            }
        });
        links.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}