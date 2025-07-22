// order-confirmation.js - Complete Order Confirmation Functionality

document.addEventListener('DOMContentLoaded', function() {
    // ========== Mobile Menu Toggle ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    // ========== Load Order Data ==========
    // Try to load order from sessionStorage (from checkout process)
    // If not found, check URL parameters (for direct links)
    // If still not found, generate demo data
    let orderData = loadOrderData();
    
    // ========== Render Order Details ==========
    function renderOrderDetails() {
        if (!orderData) {
            showErrorState();
            return;
        }
        
        // Format date
        const orderDate = new Date(orderData.date);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
        };
        
        // Display order info
        document.getElementById('orderNum').textContent = extractOrderNumber(orderData.orderNumber);
        document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('en-IN', options);
        document.getElementById('paymentMethod').textContent = formatPaymentMethod(orderData.payment);
        document.getElementById('orderTotal').textContent = '₹' + formatPrice(orderData.total);
        
        // Display shipping info
        if (orderData.customer) {
            document.getElementById('shippingName').textContent = orderData.customer.name;
            document.getElementById('shippingAddress').textContent = orderData.customer.address;
            document.getElementById('shippingCity').textContent = `${orderData.customer.city}, ${orderData.customer.state} - ${orderData.customer.zip}`;
            document.getElementById('shippingCountry').textContent = orderData.customer.country;
            document.getElementById('shippingPhone').textContent = formatPhoneNumber(orderData.customer.phone);
        }
        
        // Display order items
        const orderItems = document.getElementById('orderItems');
        if (orderData.items && orderData.items.length > 0) {
            orderItems.innerHTML = orderData.items.map(item => `
                <div class="summary-item">
                    <span>${item.name} × ${item.quantity}</span>
                    <span>₹${formatPrice(item.price * item.quantity)}</span>
                </div>
            `).join('');
        } else {
            orderItems.innerHTML = '<div class="summary-item">No items found in order</div>';
        }
        
        // Show delivery estimate
        showDeliveryEstimate(orderDate);
    }
    
    // ========== Helper Functions ==========
    function loadOrderData() {
        // 1. Try to get from sessionStorage (from checkout flow)
        const sessionOrder = JSON.parse(sessionStorage.getItem('lastOrder'));
        if (sessionOrder) return sessionOrder;
        
        // 2. Try to get from URL parameters (for email links)
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('order_id');
        if (orderId) {
            // In a real app, you would fetch order details from your backend
            return fetchOrderFromServer(orderId);
        }
        
        // 3. Generate demo data (for development/testing)
        return generateDemoOrder();
    }
    
    function fetchOrderFromServer(orderId) {
        // This is a placeholder for real API call
        // In production, you would make an actual fetch request to your backend
        console.log(`Would fetch order ${orderId} from server`);
        return generateDemoOrder(); // Using demo data for this example
    }
    
    function generateDemoOrder() {
        // This is just for demo purposes
        const demoItems = [
            {
                id: 1,
                name: "Men's Cotton Shirt",
                price: 999,
                quantity: 1,
                image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            },
            {
                id: 2,
                name: "Women's Printed Kurti",
                price: 1299,
                quantity: 2,
                image: "https://images.unsplash.com/photo-1595341595379-cf0f2a7ab4a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            }
        ];
        
        const subtotal = demoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal > 2000 ? 0 : 50;
        
        return {
            orderNumber: 'HKU-' + Math.floor(100000 + Math.random() * 900000),
            date: new Date().toISOString(),
            payment: 'cod',
            customer: {
                name: "Rahul Sharma",
                email: "rahul@example.com",
                phone: "9876543210",
                address: "123 Fashion Street",
                city: "Delhi",
                state: "Delhi",
                zip: "110001",
                country: "India",
                notes: "Please deliver before 5 PM"
            },
            items: demoItems,
            subtotal: subtotal,
            shipping: shipping,
            total: subtotal + shipping,
            status: 'processing'
        };
    }
    
    function extractOrderNumber(fullNumber) {
        // Extract just the numeric part for display
        return fullNumber.includes('-') ? fullNumber.split('-')[1] : fullNumber;
    }
    
    function formatPrice(price) {
        return price.toLocaleString('en-IN');
    }
    
    function formatPaymentMethod(method) {
        const methods = {
            'cod': 'Cash on Delivery (COD)',
            'credit': 'Credit/Debit Card',
            'upi': 'UPI Payment',
            'paypal': 'PayPal',
            'wallet': 'Mobile Wallet'
        };
        return methods[method] || method.charAt(0).toUpperCase() + method.slice(1);
    }
    
    function formatPhoneNumber(phone) {
        // Simple Indian phone number formatting
        if (phone.length === 10) {
            return `${phone.substring(0, 5)} ${phone.substring(5)}`;
        }
        return phone;
    }
    
    function showDeliveryEstimate(orderDate) {
        // Calculate estimated delivery date (3-5 business days)
        const deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 3 + Math.floor(Math.random() * 3));
        
        const options = { weekday: 'long', month: 'short', day: 'numeric' };
        const deliveryStr = deliveryDate.toLocaleDateString('en-IN', options);
        
        // Create delivery estimate element
        const deliveryInfo = document.createElement('div');
        deliveryInfo.className = 'delivery-estimate';
        deliveryInfo.innerHTML = `
            <i class="fas fa-truck"></i>
            <span>Expected delivery: <strong>${deliveryStr}</strong></span>
        `;
        
        // Insert after order items
        const orderItems = document.getElementById('orderItems');
        orderItems.appendChild(deliveryInfo);
    }
    
    function showErrorState() {
        // Show error message if order data couldn't be loaded
        const confirmationIcon = document.querySelector('.confirmation-icon');
        const sectionTitle = document.querySelector('.section-title');
        const confirmationMessage = document.querySelector('.confirmation-message');
        
        confirmationIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
        confirmationIcon.style.color = 'var(--secondary-color)';
        
        sectionTitle.textContent = 'Order Not Found';
        
        confirmationMessage.innerHTML = `
            <p>We couldn't retrieve your order details. Please check your email for confirmation or contact our support team.</p>
            <a href="contact.html" class="btn" style="margin-top: 15px;">Contact Support</a>
        `;
        
        document.querySelector('.order-details').style.display = 'none';
    }
    
    // ========== Initialize ==========
    renderOrderDetails();

    // ========== Add some styles for our delivery estimate ==========
    const deliveryStyles = document.createElement('style');
    deliveryStyles.textContent = `
        .delivery-estimate {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed var(--gray);
            color: var(--primary-color);
        }
        
        .delivery-estimate i {
            font-size: 20px;
        }
        
        .delivery-estimate span {
            font-size: 15px;
        }
    `;
    document.head.appendChild(deliveryStyles);
});