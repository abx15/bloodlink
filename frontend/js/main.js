// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true
});

// Initialize Swiper (Testimonials)
const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
        delay: 5000,
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        768: {
            slidesPerView: 2,
            spaceBetween: 30,
        },
        1024: {
            slidesPerView: 3,
            spaceBetween: 40,
        },
    }
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const html = document.documentElement;

// Check for saved user preference
if (localStorage.getItem('darkMode') === 'true') {
    html.classList.add('dark');
}

darkModeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.setItem('darkMode', html.classList.contains('dark'));
});

// Mobile Menu Toggle
const mobileMenuButton = document.getElementById('mobileMenuButton');
const mobileMenu = document.getElementById('mobileMenu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Load Lottie Animations
if (document.getElementById('heroAnimation')) {
    const heroAnimation = lottie.loadAnimation({
        container: document.getElementById('heroAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/blood-donation.json'
    });
}

if (document.getElementById('howItWorksAnimation')) {
    const howItWorksAnimation = lottie.loadAnimation({
        container: document.getElementById('howItWorksAnimation'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'assets/animations/how-it-works.json'
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// GSAP Animations
gsap.from(".nav-link", {
    duration: 0.5,
    y: -50,
    opacity: 0,
    stagger: 0.1,
    delay: 0.5
});

gsap.from("#darkModeToggle, #mobileMenuButton", {
    duration: 0.5,
    opacity: 0,
    x: 20,
    delay: 0.8
});