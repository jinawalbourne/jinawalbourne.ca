document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('nav a');
    const headerHashLinks = document.querySelectorAll('.site-header a[href^="#"]');
    const sections = document.querySelectorAll('.section');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function getHeaderOffset() {
        return (header ? header.getBoundingClientRect().height : 0) + 14;
    }

    headerHashLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const href = this.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            const targetSection = document.querySelector(href);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            const targetTop = targetSection.id === 'home'
                ? 0
                : window.scrollY + targetSection.getBoundingClientRect().top - getHeaderOffset();

            window.scrollTo({
                top: Math.max(targetTop, 0),
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
        });
    });

    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('img') : null;

    function getSavedTheme() {
        try {
            return localStorage.getItem('theme');
        } catch (error) {
            return null;
        }
    }

    function saveTheme(theme) {
        try {
            localStorage.setItem('theme', theme);
        } catch (error) {
            return;
        }
    }

    function applyTheme(theme, shouldSave) {
        const isDarkMode = theme === 'dark';

        body.classList.toggle('dark-mode', isDarkMode);

        if (themeIcon) {
            themeIcon.src = isDarkMode ? 'images/darkmode-icon.png' : 'images/lightmode-icon.png';
        }

        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', String(isDarkMode));
            themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light theme' : 'Switch to dark theme');
        }

        if (shouldSave) {
            saveTheme(theme);
        }
    }

    const savedTheme = getSavedTheme();
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(initialTheme, false);

    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            applyTheme(body.classList.contains('dark-mode') ? 'light' : 'dark', true);
        });
    }

    function highlightActiveSection() {
        const offset = getHeaderOffset() + 24;
        const scrollPosition = window.scrollY + offset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));

                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection, { passive: true });
    window.addEventListener('resize', highlightActiveSection);
    highlightActiveSection();

    const revealItems = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -8% 0px',
            threshold: 0.12
        });

        revealItems.forEach(item => revealObserver.observe(item));
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }
});
