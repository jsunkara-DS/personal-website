/**
 * JASWANTH SUNKARA Personal Website
 * Main JavaScript functionality
 */

// Configuration
const CONFIG = {
    typingTexts: [
        "Full Stack Developer",
        "UI/UX Designer", 
        "Problem Solver",
        "Tech Enthusiast",
        "Creative Thinker"
    ],
    typingSpeed: 100,
    deleteSpeed: 50,
    pauseDuration: 2000,
    scrollOffset: 80,
    animationThreshold: 0.1
};

// State management
const state = {
    currentTextIndex: 0,
    currentCharIndex: 0,
    isDeleting: false,
    isDarkMode: localStorage.getItem('theme') === 'dark',
    isMobileMenuOpen: false
};

/**
 * Typing Effect for Hero Section
 */
class TypingEffect {
    constructor() {
        this.element = document.getElementById('typingText');
        this.init();
    }

    init() {
        if (this.element) {
            this.type();
        }
    }

    type() {
        const currentText = CONFIG.typingTexts[state.currentTextIndex];
        
        if (state.isDeleting) {
            this.element.textContent = currentText.substring(0, state.currentCharIndex - 1);
            state.currentCharIndex--;
        } else {
            this.element.textContent = currentText.substring(0, state.currentCharIndex + 1);
            state.currentCharIndex++;
        }

        let speed = state.isDeleting ? CONFIG.deleteSpeed : CONFIG.typingSpeed;

        if (!state.isDeleting && state.currentCharIndex === currentText.length) {
            speed = CONFIG.pauseDuration;
            state.isDeleting = true;
        } else if (state.isDeleting && state.currentCharIndex === 0) {
            state.isDeleting = false;
            state.currentTextIndex = (state.currentTextIndex + 1) % CONFIG.typingTexts.length;
            speed = 500;
        }

        setTimeout(() => this.type(), speed);
    }
}

/**
 * Dark Mode Management
 */
class DarkModeManager {
    constructor() {
        this.toggle = document.getElementById('darkModeToggle');
        this.icon = this.toggle?.querySelector('i');
        this.init();
    }

    init() {
        if (!this.toggle) return;

        this.applyTheme();
        this.toggle.addEventListener('click', () => this.toggleTheme());
    }

    applyTheme() {
        if (state.isDarkMode) {
            document.body.classList.add('dark-mode');
            this.icon?.classList.replace('fa-moon', 'fa-sun');
        } else {
            document.body.classList.remove('dark-mode');
            this.icon?.classList.replace('fa-sun', 'fa-moon');
        }
    }

    toggleTheme() {
        state.isDarkMode = !state.isDarkMode;
        this.applyTheme();
        localStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
    }
}

/**
 * Mobile Menu Management
 */
class MobileMenu {
    constructor() {
        this.toggle = document.getElementById('mobileMenuToggle');
        this.menu = document.getElementById('mobileMenu');
        this.icon = this.toggle?.querySelector('i');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.toggle.addEventListener('click', () => this.toggleMenu());
        this.setupLinkListeners();
    }

    toggleMenu() {
        state.isMobileMenuOpen = !state.isMobileMenuOpen;
        
        if (state.isMobileMenuOpen) {
            this.menu.classList.remove('hidden');
            this.menu.classList.add('mobile-menu-enter');
            this.icon?.classList.replace('fa-bars', 'fa-times');
        } else {
            this.menu.classList.add('hidden');
            this.icon?.classList.replace('fa-times', 'fa-bars');
        }
    }

    setupLinkListeners() {
        const links = this.menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }

    closeMenu() {
        state.isMobileMenuOpen = false;
        this.menu.classList.add('hidden');
        this.icon?.classList.replace('fa-times', 'fa-bars');
    }
}

/**
 * Smooth Scrolling
 */
class SmoothScrolling {
    constructor() {
        this.init();
    }

    init() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });
    }

    handleLinkClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            const navHeight = document.querySelector('nav')?.offsetHeight || 0;
            const targetPosition = targetElement.offsetTop - navHeight - CONFIG.scrollOffset;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

/**
 * Skill Bars Animation
 */
class SkillBars {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-bar');
        this.animated = new Set();
        this.init();
    }

    init() {
        if (this.skillBars.length === 0) return;

        window.addEventListener('scroll', () => this.checkVisibility());
        this.checkVisibility(); // Initial check
    }

    checkVisibility() {
        this.skillBars.forEach(bar => {
            if (this.animated.has(bar)) return;

            const rect = bar.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                this.animateBar(bar);
                this.animated.add(bar);
            }
        });
    }

    animateBar(bar) {
        const width = bar.style.width || bar.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1];
        if (width) {
            bar.style.width = '0%';
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        }
    }
}

/**
 * Fade In Animations
 */
class FadeInAnimations {
    constructor() {
        this.observerOptions = {
            threshold: CONFIG.animationThreshold,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const sections = document.querySelectorAll('section');
        sections.forEach(section => observer.observe(section));
    }
}

/**
 * Contact Form Handler
 */
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name')?.value,
            email: document.getElementById('email')?.value,
            message: document.getElementById('message')?.value
        };

        if (this.validateForm(formData)) {
            this.submitForm(formData);
        }
    }

    validateForm(data) {
        if (!data.name || !data.email || !data.message) {
            NotificationManager.show('Please fill in all fields', 'error');
            return false;
        }

        if (!this.isValidEmail(data.email)) {
            NotificationManager.show('Please enter a valid email address', 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    submitForm(data) {
        // Here you would normally send data to a server
        console.log('Form submitted:', data);
        NotificationManager.show('Message sent successfully! I\'ll get back to you soon.', 'success');
        this.form.reset();
    }
}

/**
 * Notification System
 */
class NotificationManager {
    static show(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

/**
 * Active Navigation Highlighting
 */
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        let current = '';
        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - navHeight - 50) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('text-purple-600');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-purple-600');
            }
        });
    }
}

/**
 * Parallax Effect
 */
class ParallaxEffect {
    constructor() {
        this.heroSection = document.getElementById('home');
        this.init();
    }

    init() {
        if (!this.heroSection) return;

        window.addEventListener('scroll', () => this.updateParallax());
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = this.heroSection.querySelectorAll('.fade-in');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
}

/**
 * Performance Optimizations
 */
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        // Add loaded class to body
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // Prevent context menu on images
        document.addEventListener('contextmenu', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });

        // Add GPU acceleration to animated elements
        this.addGPUAcceleration();
    }

    addGPUAcceleration() {
        const animatedElements = document.querySelectorAll('.card-hover, .fade-in');
        animatedElements.forEach(element => {
            element.classList.add('gpu-accelerated');
        });
    }
}

/**
 * Application Initialization
 */
class App {
    constructor() {
        this.components = [];
        this.init();
    }

    init() {
        // Initialize all components
        this.components = [
            new TypingEffect(),
            new DarkModeManager(),
            new MobileMenu(),
            new SmoothScrolling(),
            new SkillBars(),
            new FadeInAnimations(),
            new ContactForm(),
            new ActiveNavigation(),
            new ParallaxEffect(),
            new PerformanceOptimizer()
        ];

        console.log('🚀 JASWANTH SUNKARA Website initialized');
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Export for potential module usage
window.JaswanthWebsite = {
    App,
    NotificationManager,
    CONFIG
};
