// checkout.js - Complete Checkout Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    // ========== Load Cart Data ==========
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItems = document.getElementById('orderItems');
    const orderTotals = document.getElementById('orderTotals');
    const checkoutForm = document.getElementById('checkoutForm');
    sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    
    // ========== Initialize Checkout ==========
    function initCheckout() {
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        renderOrderItems();
        renderOrderTotals();
        setupFormValidation();
    }
    
    // ========== Render Order Items ==========
    function renderOrderItems() {
        orderItems.innerHTML = cart.map(item => `
            <div class="summary-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>₹${formatPrice(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }
    
    // ========== Render Order Totals ==========
    function renderOrderTotals() {
        const subtotal = calculateSubtotal();
        const shipping = calculateShipping(subtotal);
        const total = subtotal + shipping;
        
        orderTotals.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${formatPrice(subtotal)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'FREE' : '₹' + formatPrice(shipping)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>₹${formatPrice(total)}</span>
            </div>
        `;
    }
    
    // ========== Form Validation ==========
    function setupFormValidation() {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                // In a real app, you would process the payment and order here
                processOrder();
            }
        });
    }
    
    function validateForm() {
        const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--secondary-color)';
                isValid = false;
            } else {
                field.style.borderColor = 'var(--gray)';
            }
        });
        
        // Validate email format
        const email = document.getElementById('email');
        if (!validateEmail(email.value.trim())) {
            email.style.borderColor = 'var(--secondary-color)';
            isValid = false;
        }
        
        // Validate phone number
        const phone = document.getElementById('phone');
        if (!validatePhone(phone.value.trim())) {
            phone.style.borderColor = 'var(--secondary-color)';
            isValid = false;
        }
        
        if (!isValid) {
            showNotification('Please fill all required fields correctly', 'error');
        }
        
        return isValid;
    }
    
    // ========== Process Order ==========
    function processOrder() {
        // Create order object
        const order = {
            customer: {
                name: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                address: document.getElementById('address').value.trim(),
                city: document.getElementById('city').value.trim(),
                state: document.getElementById('state').value.trim(),
                zip: document.getElementById('zip').value.trim(),
                country: document.getElementById('country').value,
                notes: document.getElementById('notes').value.trim()
            },
            payment: document.querySelector('input[name="payment"]:checked').value,
            items: cart,
            subtotal: calculateSubtotal(),
            shipping: calculateShipping(calculateSubtotal()),
            total: calculateSubtotal() + calculateShipping(calculateSubtotal()),
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // In a real app, you would send this to your backend
        console.log('Order submitted:', order);
        
        // For demo purposes, we'll simulate order processing
        showNotification('Your order has been placed successfully!');
        
        // Clear cart and redirect to confirmation
        setTimeout(() => {
            localStorage.removeItem('cart');
            window.location.href = 'order-confirmation.html';
        }, 2000);
    }
    
    // ========== Helper Functions ==========
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }
    
    function calculateShipping(subtotal) {
        return subtotal > 2000 ? 0 : 50; // Free shipping over ₹2000
    }
    
    function formatPrice(price) {
        return price.toLocaleString('en-IN');
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePhone(phone) {
        const re = /^[0-9]{10,15}$/;
        return re.test(phone);
    }
    
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
    
    // ========== Initialize ==========
    initCheckout();
});