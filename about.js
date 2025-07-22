// about.js for Harekrsna Udyog

document.addEventListener('DOMContentLoaded', function() {
    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.querySelector('i').classList.add('fa-bars');
                menuToggle.querySelector('i').classList.remove('fa-times');
            }
        });
    });

    // ========== Shopping Cart Functionality ==========
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartLink = document.querySelector('nav ul li:last-child a');
    
    // Update cart count display
    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${totalItems})`;
    }
    
    // Initialize cart count
    updateCartCount();

    // ========== Team Member Interaction ==========
    const teamMembers = document.querySelectorAll('.team-member');
    
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            const img = this.querySelector('.member-img img');
            img.style.transform = 'scale(1.1)';
        });
        
        member.addEventListener('mouseleave', function() {
            const img = this.querySelector('.member-img img');
            img.style.transform = 'scale(1)';
        });
    });

    // ========== Value Cards Animation ==========
    const valueCards = document.querySelectorAll('.value-card');
    
    valueCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.value-icon i');
            icon.style.transform = 'rotateY(180deg)';
            setTimeout(() => {
                icon.style.transform = 'rotateY(360deg)';
            }, 300);
        });
    });

    // ========== Image Hover Effects ==========
    const aboutImage = document.querySelector('.about-image img');
    if (aboutImage) {
        aboutImage.parentElement.addEventListener('mouseenter', function() {
            aboutImage.style.transform = 'scale(1.05)';
        });
        
        aboutImage.parentElement.addEventListener('mouseleave', function() {
            aboutImage.style.transform = 'scale(1)';
        });
    }

    // ========== Smooth Scrolling ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== Active Link Highlighting ==========
    function highlightActiveLink() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('nav ul li a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id') || '';
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === `#${current}` || 
                (current === '' && href === 'about.html')) {
                item.classList.add('active');
            }
        });
    }

    // Initial highlight check
    highlightActiveLink();
    
    // Check on scroll
    window.addEventListener('scroll', highlightActiveLink);

    // ========== Notification System ==========
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // ========== Add to Cart Demo (for any products on page) ==========
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') {
            const buttonText = e.target.textContent.trim();
            if (buttonText === 'Add to Cart' || buttonText === 'Add') {
                e.preventDefault();
                cartCount++;
                updateCartCount();
                showNotification('Item added to cart!');
          }
        }
    });

    // ========== Lazy Loading for Images ==========
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
});

// ========== Add some styles for our notification system ==========
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 25px;
        background-color: #4a8b29;
        color: white;
        border-radius: 5px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.2);
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification.show {
        transform: translateY(0);
        opacity: 1;
    }
    
    .notification.error {
        background-color: #ff6b6b;
    }
    
    .notification i {
        font-size: 20px;
    }
    
    /* Animation for value icons */
    .value-icon i {
        transition: transform 0.6s ease;
    }
    
    /* Responsive adjustments */
    @media (max-width: 768px) {
        .team-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 480px) {
        .team-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(notificationStyles);