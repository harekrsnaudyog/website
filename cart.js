// cart.js - Complete Cart Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ========== Cart State Management ==========
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.getElementById('cartContent');
    const cartLink = document.querySelector('nav ul li:last-child a');
    
    // ========== Initialize Cart ==========
    function initCart() {
        renderCart();
        updateCartCount();
        setupEventListeners();
    }

    // ========== Render Cart Content ==========
    function renderCart() {
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }

        const subtotal = calculateSubtotal();
        const shipping = calculateShipping(subtotal);
        const total = subtotal + shipping;

        cartContent.innerHTML = `
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => renderCartItem(item)).join('')}
                </tbody>
            </table>

            <div class="cart-actions">
                <div class="coupon-section">
                    <h3>Apply Coupon</h3>
                    <div class="coupon-input">
                        <input type="text" placeholder="Enter coupon code" id="couponCode">
                        <button class="btn" id="applyCoupon">Apply</button>
                    </div>
                </div>

                <div class="total-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>₹${formatPrice(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span>${shipping === 0 ? 'FREE' : '₹' + formatPrice(shipping)}</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total:</span>
                        <span>₹${formatPrice(total)}</span>
                    </div>
                    <div class="checkout-btn">
                        <button class="btn btn-secondary" id="proceedToCheckout">Proceed to Checkout</button>
                    </div>
                </div>
            </div>

            <div class="continue-shopping">
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
    }

    // ========== Helper Functions ==========
    function renderCartItem(item) {
        return `
            <tr data-id="${item.id}">
                <td><img src="${item.image}" alt="${item.name}"></td>
                <td>${item.name}</td>
                <td>₹${formatPrice(item.price)}</td>
                <td>
                    <div class="quantity-control">
                        <button class="decrement">-</button>
                        <input type="number" value="${item.quantity}" min="1">
                        <button class="increment">+</button>
                    </div>
                </td>
                <td>₹${formatPrice(item.price * item.quantity)}</td>
                <td><button class="btn btn-secondary remove-item">Remove</button></td>
            </tr>
        `;
    }

    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    function calculateShipping(subtotal) {
        return subtotal > 2000 ? 0 : 50; // Free shipping over ₹2000
    }

    function formatPrice(price) {
        return price.toLocaleString('en-IN');
    }

    function showEmptyCart() {
        cartContent.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything to your cart yet</p>
                <a href="products.html" class="btn">Continue Shopping</a>
            </div>
        `;
    }

    // ========== Event Handlers ==========
    function setupEventListeners() {
        // Quantity controls
        document.querySelectorAll('.decrement').forEach(btn => {
            btn.addEventListener('click', handleDecrement);
        });

        document.querySelectorAll('.increment').forEach(btn => {
            btn.addEventListener('click', handleIncrement);
        });

        document.querySelectorAll('.quantity-control input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });

        // Remove items
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', handleRemoveItem);
        });

        // Coupon application
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', handleApplyCoupon);
        }

        // Checkout button
        const checkoutBtn = document.getElementById('proceedToCheckout');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', handleCheckout);
        }
    }

    function handleDecrement(e) {
        const input = e.target.nextElementSibling;
        if (input.value > 1) {
            input.value--;
            updateCartItem(e.target.closest('tr'), parseInt(input.value));
        }
    }

    function handleIncrement(e) {
        const input = e.target.previousElementSibling;
        input.value++;
        updateCartItem(e.target.closest('tr'), parseInt(input.value));
    }

    function handleQuantityChange(e) {
        const value = parseInt(e.target.value);
        if (value >= 1) {
            updateCartItem(e.target.closest('tr'), value);
        } else {
            e.target.value = 1;
        }
    }

    function handleRemoveItem(e) {
        const itemId = e.target.closest('tr').dataset.id;
        cart = cart.filter(item => item.id != itemId);
        saveCart();
        renderCart();
        showNotification('Item removed from cart');
    }

    function handleApplyCoupon() {
        const couponCode = document.getElementById('couponCode').value.trim();
        if (couponCode) {
            // In a real app, you would validate the coupon with your backend
            showNotification('Coupon applied successfully!');
        } else {
            showNotification('Please enter a coupon code', 'error');
        }
    }

    function handleCheckout() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }
        
        // Save cart before proceeding
        saveCart();
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }

    // ========== Cart Operations ==========
    function updateCartItem(row, newQuantity) {
        const itemId = row.dataset.id;
        const itemIndex = cart.findIndex(item => item.id == itemId);
        
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = newQuantity;
            saveCart();
            renderCart();
        }
    }

    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    function updateCartCount() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartLink.innerHTML = `<i class="fas fa-shopping-cart"></i> Cart (${totalItems})`;
    }

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

    // ========== Initialize ==========
    initCart();
});