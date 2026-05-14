// Common Navigation & Interactions
document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Initialize cart count badge on load
    updateCartBadge();
    
    // Add current year to footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Stagger repeated visual elements as they render.
    document.querySelectorAll('.products-grid, .categories-grid, .team-grid').forEach((grid) => {
        Array.from(grid.children).forEach((item, index) => {
            item.style.setProperty('--stagger-index', index);
        });
    });

    // Scroll Reveal Animation Logic
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.16,
            rootMargin: '0px 0px -60px 0px'
        });

        reveals.forEach((element) => revealObserver.observe(element));
    } else {
        reveals.forEach((element) => element.classList.add('active'));
    }

    function updateScrollEffects() {
        const scrolled = window.scrollY > 20;

        if (navbar) {
            navbar.classList.toggle('scrolled', scrolled);
        }

        if (!prefersReducedMotion) {
            const hero = document.querySelector('.hero');
            const pageHeader = document.querySelector('.page-header');

            if (hero) {
                hero.style.backgroundPosition = `center ${Math.round(window.scrollY * 0.28)}px`;
            }

            if (pageHeader) {
                pageHeader.style.backgroundPosition = `center ${Math.round(window.scrollY * 0.18)}px`;
            }
        }
    }

    window.addEventListener('scroll', updateScrollEffects, { passive: true });
    updateScrollEffects();
});

// Toast Notification System
function showToast(message) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span>${message}</span>
        <span style="cursor:pointer;" onclick="this.parentElement.remove()">✕</span>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Global Cart Badge Updater
function updateCartBadge() {
    const badge = document.querySelector('.cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('jewellery_cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        
        // Hide badge if 0
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Utility to format price in Indian Rupees
function formatPrice(price) {
    return '₹' + Math.round(price).toLocaleString('en-IN');
}
