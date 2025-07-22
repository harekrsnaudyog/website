// products.js for Harekrsna Udyog

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

    // ========== Product Data ==========
    const products = [
        {
            id: 1,
            name: "Boys Cotton T-shirt",
            collection: "kids",
            type: "shirts",
            price: 499,
            image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Comfortable cotton t-shirt for boys with printed design.",
            rating: 4.5,
            colors: ["Red", "Blue", "Green"],
            sizes: ["S", "M", "L"]
        },
        {
            id: 2,
            name: "Girls Frock Dress",
            collection: "kids",
            type: "dresses",
            price: 799,
            image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Beautiful frock dress for girls with floral pattern.",
            rating: 4.8,
            colors: ["Pink", "Yellow", "White"],
            sizes: ["2-3 Years", "4-5 Years", "6-7 Years"]
        },
        {
            id: 3,
            name: "Men's Formal Shirt",
            collection: "men",
            type: "shirts",
            price: 999,
            image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Premium quality formal shirt for men.",
            rating: 4.3,
            colors: ["White", "Blue", "Gray"],
            sizes: ["S", "M", "L", "XL"]
        },
        {
            id: 4,
            name: "Men's Jeans",
            collection: "men",
            type: "pants",
            price: 1299,
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Slim fit jeans for men with stretch fabric.",
            rating: 4.7,
            colors: ["Blue", "Black", "Gray"],
            sizes: ["28", "30", "32", "34"]
        },
        {
            id: 5,
            name: "Women's Kurti",
            collection: "women",
            type: "ethnic",
            price: 899,
            image: "https://images.unsplash.com/photo-1595341595379-cf0f2a7ab4a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Traditional kurti with modern design.",
            rating: 4.6,
            colors: ["Red", "Blue", "Green", "Yellow"],
            sizes: ["S", "M", "L"]
        },
        {
            id: 6,
            name: "Women's Palazzo",
            collection: "women",
            type: "pants",
            price: 699,
            image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Comfortable palazzo pants for women.",
            rating: 4.4,
            colors: ["Black", "White", "Navy"],
            sizes: ["S", "M", "L"]
        },
        {
            id: 7,
            name: "Kids Jacket",
            collection: "kids",
            type: "accessories",
            price: 899,
            image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Warm jacket for kids with hood.",
            rating: 4.2,
            colors: ["Red", "Blue", "Pink"],
            sizes: ["2-4 Years", "5-7 Years"]
        },
        {
            id: 8,
            name: "Men's T-shirt",
            collection: "men",
            type: "shirts",
            price: 599,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
            description: "Casual round neck t-shirt for men.",
            rating: 4.1,
            colors: ["Black", "White", "Gray"],
            sizes: ["S", "M", "L", "XL"]
        }
    ];

    // ========== DOM Elements ==========
    const productGrid = document.getElementById('productGrid');
    const collectionFilter = document.querySelectorAll('.collection-filter button');
    const productTypes = document.querySelectorAll('.product-types button');
    const urlParams = new URLSearchParams(window.location.search);

    // ========== Current Filters ==========
    let currentCollection = urlParams.get('collection') || 'all';
    let currentType = urlParams.get('type') || 'all';
    let sortBy = 'default';

    // ========== Initialize the page ==========
    function init() {
        // Set active filter buttons based on URL params
        setActiveFilters();
        renderProducts();
        setupEventListeners();
    }

    // ========== Set active filter buttons ==========
    function setActiveFilters() {
        // Collection filter
        collectionFilter.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.collection === currentCollection) {
                button.classList.add('active');
            }
        });
        
        // Product type filter
        productTypes.forEach(button => {
            button.classList.remove('active');
            if (button.dataset.type === currentType) {
                button.classList.add('active');
            }
        });
    }

    // ========== Render products based on filters ==========
    function renderProducts() {
        productGrid.innerHTML = '';
        
        // Filter products
        let filteredProducts = products.filter(product => {
            const collectionMatch = currentCollection === 'all' || product.collection === currentCollection;
            const typeMatch = currentType === 'all' || product.type === currentType;
            return collectionMatch && typeMatch;
        });
        
        // Sort products
        filteredProducts = sortProducts(filteredProducts);
        
        // Display message if no products found
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="no-products" style="grid-column:1/-1; text-align:center; padding:40px;">
                    <i class="fas fa-box-open" style="font-size:48px; color:#ccc; margin-bottom:20px;"></i>
                    <h3>No products found</h3>
                    <p>We couldn't find any products matching your selection.</p>
                    <button class="btn" onclick="resetFilters()">Reset Filters</button>
                </div>
            `;
            return;
        }
        
        // Render products
        filteredProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-img">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-badge">${formatText(product.collection)}</div>
                </div>
                <div class="product-info">
                    <div class="product-meta">
                        <span class="product-type">${formatText(product.type)}</span>
                        <div class="product-rating">
                            ${renderRatingStars(product.rating)}
                            <span>${product.rating}</span>
                        </div>
                    </div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">₹${product.price.toLocaleString('en-IN')}</span>
                        <div class="product-actions">
                            <a href="product-detail.html?id=${product.id}" class="btn btn-view">View</a>
                            <button class="btn btn-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productGrid.appendChild(productCard);
        });
    }

    // ========== Render rating stars ==========
    function renderRatingStars(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }

    // ========== Sort products ==========
    function sortProducts(products) {
        switch(sortBy) {
            case 'price-low':
                return [...products].sort((a, b) => a.price - b.price);
            case 'price-high':
                return [...products].sort((a, b) => b.price - a.price);
            case 'rating':
                return [...products].sort((a, b) => b.rating - a.rating);
            case 'name-asc':
                return [...products].sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return [...products].sort((a, b) => b.name.localeCompare(a.name));
            default:
                return products;
        }
    }

    // ========== Format text (capitalize, etc.) ==========
    function formatText(text) {
        return text.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // ========== Reset all filters ==========
    function resetFilters() {
        currentCollection = 'all';
        currentType = 'all';
        sortBy = 'default';
        
        // Update URL without reload
        const url = new URL(window.location);
        url.searchParams.delete('collection');
        url.searchParams.delete('type');
        window.history.pushState({}, '', url);
        
        setActiveFilters();
        renderProducts();
    }

    // ========== Add to cart ==========
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update UI
        updateCartCount();
        
        // Show notification
        showNotification(`${product.name} added to cart!`);
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

    // ========== Set up event listeners ==========
    function setupEventListeners() {
        // Collection filter
        collectionFilter.forEach(button => {
            button.addEventListener('click', () => {
                currentCollection = button.dataset.collection;
                
                // Update URL
                const url = new URL(window.location);
                if (currentCollection === 'all') {
                    url.searchParams.delete('collection');
                } else {
                    url.searchParams.set('collection', currentCollection);
                }
                window.history.pushState({}, '', url);
                
                renderProducts();
            });
        });
        
        // Product type filter
        productTypes.forEach(button => {
            button.addEventListener('click', () => {
                currentType = button.dataset.type;
                
                // Update URL
                const url = new URL(window.location);
                if (currentType === 'all') {
                    url.searchParams.delete('type');
                } else {
                    url.searchParams.set('type', currentType);
                }
                window.history.pushState({}, '', url);
                
                renderProducts();
            });
        });
        
        // Add to cart buttons (delegated event)
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('btn-cart') || e.target.closest('.btn-cart')) {
                e.preventDefault();
                const button = e.target.classList.contains('btn-cart') ? e.target : e.target.closest('.btn-cart');
                const productId = parseInt(button.dataset.id);
                addToCart(productId);
            }
        });
    }

    // ========== Initialize the page ==========
    init();
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
    
    /* Product card badges */
    .product-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background-color: var(--primary-color);
        color: white;
        padding: 5px 10px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: bold;
    }
    
    /* Responsive grid adjustments */
    @media (max-width: 768px) {
        .product-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    
    @media (max-width: 480px) {
        .product-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(notificationStyles);