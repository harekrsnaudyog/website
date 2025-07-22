// contact.js for Harekrsna Udyog

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

    // ========== Contact Form Handling ==========
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                name: this.querySelector('#name').value.trim(),
                email: this.querySelector('#email').value.trim(),
                phone: this.querySelector('#phone').value.trim(),
                subject: this.querySelector('#subject').value.trim(),
                message: this.querySelector('#message').value.trim()
            };
            
            // Validate form
            if (validateForm(formData)) {
                // In a real application, you would send this data to your server
                console.log('Form data:', formData);
                
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // For demo purposes, we're not actually submitting
                // In production, you would remove this timeout and uncomment the form submission
                setTimeout(() => {
                    // this.submit();
                }, 2000);
            }
        });
    }

    // ========== Form Validation ==========
    function validateForm(formData) {
        // Check required fields
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            showNotification('Please fill in all required fields marked with *', 'error');
            return false;
        }
        
        // Validate email format
        if (!validateEmail(formData.email)) {
            showNotification('Please enter a valid email address', 'error');
            return false;
        }
        
        // Validate phone number if provided
        if (formData.phone && !validatePhone(formData.phone)) {
            showNotification('Please enter a valid phone number', 'error');
            return false;
        }
        
        return true;
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }

    // ========== Interactive Contact Items ==========
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.backgroundColor = 'var(--secondary-color)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.contact-icon');
            icon.style.transform = 'scale(1)';
            icon.style.backgroundColor = 'var(--primary-color)';
        });
    });

    // ========== Social Media Links ==========
    const socialLinks = document.querySelectorAll('.social-icons a');
    
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

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
        }, 5000);
    }

    // ========== Map Interaction ==========
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
        });
        
        mapContainer.addEventListener('mouseleave', function() {
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
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
        const navItems = document.querySelectorAll('nav ul li a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            }
        });
    }

    // Initial highlight check
    highlightActiveLink();
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
    
    /* Animation for contact icons */
    .contact-icon {
        transition: all 0.3s ease;
    }
    
    /* Animation for social icons */
    .social-icons a {
        transition: transform 0.3s ease, color 0.3s ease;
    }
    
    /* Map container animation */
    .map-container {
        transition: box-shadow 0.3s ease;
    }
    
    /* Form input focus effects */
    .form-group input:focus,
    .form-group textarea:focus {
        box-shadow: 0 0 0 3px rgba(74, 139, 41, 0.2);
    }
`;
document.head.appendChild(notificationStyles);