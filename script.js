document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dark mode toggle
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('img');
    
    // Check if user has previously set a theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeIcon.src = 'images/darkmode-icon.png';
        themeIcon.alt = 'DarkMode icon';
    }
    
    // Toggle between icons
    themeToggle.addEventListener('click', function() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        
        if (isDarkMode) {
            themeIcon.src = 'images/darkmode-icon.png';
            themeIcon.alt = 'DarkMode icon';
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.src = 'images/lightmode-icon.png';
            themeIcon.alt = 'LightMode icon';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Highlight active section in the navigation
    function highlightActiveSection() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
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
    
    window.addEventListener('scroll', highlightActiveSection);
    
    highlightActiveSection();

    const subtitle = document.querySelector('.subtitle');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                subtitle.classList.remove('typing');
                void subtitle.offsetWidth;
                subtitle.classList.add('typing');
            }
        });
    }, { threshold: 0.5 });

    observer.observe(subtitle);
}); 