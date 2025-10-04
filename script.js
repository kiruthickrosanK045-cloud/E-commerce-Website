// User authentication state
let currentUser = null;
let isLoggedIn = false;

// Cart state
let cart = [];
let selectedSizes = {};
const products = [
    { id: 1, name: "Men's Casual Cotton Shirt", price: 799, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop', description: 'Soft cotton, slim fit, available in pastel shades' },
    { id: 2, name: "Men's Formal Blazer", price: 2999, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=400&fit=crop', description: 'Premium fabric, tailored fit, perfect for office & events' },
    { id: 3, name: "Men's Linen Kurta", price: 1499, image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop', description: 'Comfortable, breathable, ideal for ethnic wear' },
    { id: 4, name: "Men's Denim Jacket", price: 1899, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop', description: 'Rugged, stylish, with button closure' },
    { id: 5, name: "Men's Polo T-Shirt", price: 699, image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=400&fit=crop', description: 'Classic collar, casual & sporty' },
    { id: 6, name: "Women's Summer Floral Dress", price: 1499, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop', description: 'Lightweight, flowy, knee-length, floral prints' },
    { id: 7, name: "Women's Maxi Gown", price: 2199, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=400&fit=crop', description: 'Elegant evening wear, chiffon fabric, full length' },
    { id: 8, name: "Women's Denim Skirt", price: 1099, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=400&fit=crop', description: 'A-line fit, casual & chic' },
    { id: 9, name: "Women's Saree (Silk Blend)", price: 2999, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop', description: 'Traditional wear with rich embroidery' },
    { id: 10, name: "Women's Anarkali Kurti", price: 1699, image: 'https://i.pinimg.com/736x/b9/0c/95/b90c95aad36daff037788a9044924dab.jpg', description: 'Floor-length ethnic dress, festive wear' },
    { id: 11, name: "Unisex Hoodie (Oversized)", price: 1299, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop', description: 'Soft fleece, trendy streetwear' },
    { id: 12, name: "Unisex Sweatshirt", price: 999, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop', description: 'Round neck, warm and casual' },
    { id: 13, name: "Kids' Party Dress (Girls)", price: 1199, image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=400&fit=crop', description: 'Cute frills, satin fabric, bow design' },
    { id: 14, name: "Kids' Shirt & Jeans Set (Boys)", price: 1399, image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=400&fit=crop', description: 'Stylish 2-piece outfit for casual wear' },
    { id: 15, name: "Couple Matching T-Shirts", price: 1499, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop', description: 'Set of 2 - Fun prints, 100% cotton, perfect for couples' }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    checkLoginStatus();
    renderProducts();
    updateCart();
    
    // Close auth modals when clicking outside
    window.addEventListener('click', function(event) {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                closeAuthModals();
            }
        });
        
        // Close cart when clicking overlay
        const cartOverlay = document.getElementById('cartOverlay');
        if (event.target === cartOverlay) {
            toggleCart();
        }
    });

    // Add scroll event listener to check login status when scrolling to protected sections
    window.addEventListener('scroll', function() {
        checkSectionAccess();
    });
});

// Initialize authentication
function initializeAuth() {
    try {
        const savedUser = sessionStorage.getItem('luxeshop_user');
        if (savedUser) {
            currentUser = JSON.parse(savedUser);
            isLoggedIn = true;
            updateLoginButton();
            hideLoginOverlay();
            console.log('User session restored:', currentUser.name);
        }
    } catch (e) {
        console.log('No existing session found');
    }
}

// Check login status and redirect if not logged in
function checkLoginStatus() {
    if (!isLoggedIn) {
        // Show login modal automatically
        setTimeout(() => {
            openLoginModal();
        }, 1000);
        
        // Show login overlay for protected content
        showLoginOverlay();
    }
}

// Show login required overlay for protected content
function showLoginOverlay() {
    // Remove existing overlay if any
    hideLoginOverlay();
    
    const overlay = document.createElement('div');
    overlay.className = 'login-required-overlay';
    overlay.id = 'loginOverlay';
    overlay.innerHTML = `
        <div class="login-required-content">
            <h2>🔐 Welcome to LuxeShop</h2>
            <p>Please log in to explore our premium fashion collection and access all features</p>
            <button class="auth-submit-btn" onclick="openLoginModal()">Login / Sign Up</button>
        </div>
    `;
    document.body.appendChild(overlay);
    
    // Add styles for the overlay
    if (!document.querySelector('#loginOverlayStyles')) {
        const style = document.createElement('style');
        style.id = 'loginOverlayStyles';
        style.textContent = `
            .login-required-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(15, 15, 15, 0.98);
                backdrop-filter: blur(20px);
                z-index: 2500;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.5s ease-out;
            }
            
            .login-required-content {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 3rem;
                text-align: center;
                max-width: 500px;
                width: 90%;
                backdrop-filter: blur(10px);
            }
            
            .login-required-content h2 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .login-required-content p {
                color: rgba(255, 255, 255, 0.8);
                margin-bottom: 2rem;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .content-protected {
                filter: blur(5px);
                pointer-events: none;
                user-select: none;
            }
        `;
        document.head.appendChild(style);
    }
}

// Hide login overlay
function hideLoginOverlay() {
    const overlay = document.getElementById('loginOverlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Remove content protection
    const protectedSections = document.querySelectorAll('#products, #about, .products-section, .about-section');
    protectedSections.forEach(section => {
        section.classList.remove('content-protected');
    });
}

// Check section access when scrolling
function checkSectionAccess() {
    if (!isLoggedIn) {
        const productsSection = document.getElementById('products');
        const aboutSection = document.getElementById('about');
        
        if (productsSection || aboutSection) {
            const productsRect = productsSection.getBoundingClientRect();
            const aboutRect = aboutSection.getBoundingClientRect();
            
            // If user scrolls near protected sections, show login modal
            if ((productsRect.top < window.innerHeight - 100 && productsRect.bottom > 0) ||
                (aboutRect.top < window.innerHeight - 100 && aboutRect.bottom > 0)) {
                openLoginModal();
            }
        }
    }
}

// Save user session
function saveUserSession() {
    if (currentUser) {
        try {
            sessionStorage.setItem('luxeshop_user', JSON.stringify(currentUser));
        } catch (e) {
            console.log('Unable to save session');
        }
    }
}

// Clear user session
function clearUserSession() {
    try {
        sessionStorage.removeItem('luxeshop_user');
    } catch (e) {
        console.log('Unable to clear session');
    }
}

// Authentication Modal Functions
function openLoginModal() {
    closeAuthModals();
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function switchToSignup() {
    closeAuthModals();
    const modal = document.getElementById('signupModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function switchToLogin() {
    closeAuthModals();
    const modal = document.getElementById('loginModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function openForgotPasswordModal() {
    closeAuthModals();
    const modal = document.getElementById('forgotPasswordModal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAuthModals() {
    const modals = document.querySelectorAll('.auth-modal');
    modals.forEach(modal => modal.classList.remove('active'));
    document.body.style.overflow = 'auto';
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('loginIdentifier').value;
    const password = document.getElementById('loginPassword').value;
    
    if (identifier && password) {
        currentUser = {
            identifier: identifier,
            name: identifier.split('@')[0] || identifier.split('+')[0] || 'User'
        };
        
        isLoggedIn = true;
        saveUserSession();
        
        showNotification('✓ Login successful! Welcome back!');
        closeAuthModals();
        updateLoginButton();
        hideLoginOverlay();
        
        // Clear form
        document.getElementById('loginIdentifier').value = '';
        document.getElementById('loginPassword').value = '';
    } else {
        showNotification('⚠️ Please fill in all fields!');
    }
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const identifier = document.getElementById('signupIdentifier').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('⚠️ Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showNotification('⚠️ Password must be at least 6 characters!');
        return;
    }
    
    currentUser = {
        name: name,
        identifier: identifier
    };
    
    isLoggedIn = true;
    saveUserSession();
    
    showNotification('✓ Account created successfully! Welcome to LuxeShop!');
    closeAuthModals();
    updateLoginButton();
    hideLoginOverlay();
    
    // Clear form
    document.getElementById('signupName').value = '';
    document.getElementById('signupIdentifier').value = '';
    document.getElementById('signupPassword').value = '';
    document.getElementById('signupConfirmPassword').value = '';
}

// Handle Forgot Password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const identifier = document.getElementById('forgotPasswordIdentifier').value;
    
    if (identifier) {
        showNotification('✓ Password reset link sent! Check your email/phone.');
        closeAuthModals();
        document.getElementById('forgotPasswordIdentifier').value = '';
    } else {
        showNotification('⚠️ Please enter your email or phone number!');
    }
}

// Update login button
function updateLoginButton() {
    const loginBtn = document.querySelector('.login-btn');
    if (currentUser) {
        loginBtn.textContent = `Hi, ${currentUser.name}`;
        loginBtn.onclick = logout;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = openLoginModal;
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        isLoggedIn = false;
        clearUserSession();
        updateLoginButton();
        showNotification('✓ Logged out successfully!');
        
        // Clear cart on logout
        cart = [];
        selectedSizes = {};
        updateCart();
        
        // Show login overlay and modal
        showLoginOverlay();
        setTimeout(() => {
            openLoginModal();
        }, 500);
    }
}

// Product Functions
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                
                <!-- Size options -->
                <div class="size-options" id="sizeOptions${product.id}">
                    ${["S","M","L","XL"].map(size => `
                        <button class="size-btn" onclick="selectSize(${product.id}, '${size}')">${size}</button>
                    `).join('')}
                </div>

                <div class="product-footer">
                    <div class="product-price">₹${product.price}</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})" ${!isLoggedIn ? 'disabled' : ''}>
                        ${!isLoggedIn ? 'Login to Shop' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Size selection
function selectSize(productId, size) {
    if (!isLoggedIn) {
        openLoginModal();
        return;
    }

    selectedSizes[productId] = size;
    sessionStorage.setItem('luxeshop_selectedSizes', JSON.stringify(selectedSizes));
    
    const sizeOptions = document.getElementById(`sizeOptions${productId}`);
    if (sizeOptions) {
        const buttons = sizeOptions.querySelectorAll('.size-btn');
        buttons.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === size) {
                btn.classList.add('selected');
            }
        });
    }
}

// Add to cart with login check
function addToCart(productId) {
    if (!isLoggedIn) {
        openLoginModal();
        showNotification('🔐 Please login to add items to cart');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    const selectedSize = selectedSizes[productId];
    
    if (!selectedSize) {
        showNotification('⚠️ Please select a size first!');
        const sizeOptions = document.getElementById(`sizeOptions${productId}`);
        if (sizeOptions) {
            sizeOptions.style.animation = 'shake 0.5s';
            setTimeout(() => {
                sizeOptions.style.animation = '';
            }, 500);
        }
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId && item.size === selectedSize);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, size: selectedSize, quantity: 1 });
    }
    
    updateCart();
    showNotification(`✓ ${product.name} (Size: ${selectedSize}) added to cart!`);
    
    setTimeout(() => {
        toggleCart();
    }, 800);
}

// Cart Functions
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    updateCart();
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name} (Size: ${item.size})</div>
                    <div class="cart-item-price">₹${item.price} × ${item.quantity}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="decreaseQuantity(${item.id}, '${item.size}')">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${item.id}, '${item.size}')">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')">
                        Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
}

function increaseQuantity(productId, size) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

function decreaseQuantity(productId, size) {
    const item = cart.find(i => i.id === productId && i.size === size);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            cart = cart.filter(i => !(i.id === productId && i.size === size));
        }
        updateCart();
    }
}

function toggleCart() {
    if (!isLoggedIn) {
        openLoginModal();
        showNotification('🔐 Please login to view your cart');
        return;
    }
    
    const modal = document.getElementById('cartModal');
    const overlay = document.getElementById('cartOverlay');
    modal.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Checkout Functions
function proceedToCheckout() {
    if (!isLoggedIn) {
        openLoginModal();
        showNotification('🔐 Please login to proceed to checkout');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('⚠️ Your cart is empty!');
        return;
    }
    
    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';

    // Fill order items in checkout
    const checkoutItems = document.getElementById('checkoutOrderItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    checkoutItems.innerHTML = cart.map(item => `
        <div>${item.name} (Size: ${item.size}) × ${item.quantity} - ₹${item.price * item.quantity}</div>
    `).join('');
    checkoutTotal.textContent = `₹${cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2)}`;
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function goToPaymentStep() {
    document.getElementById('contactDetailsStep').classList.add('hidden');
    document.getElementById('paymentStep').classList.remove('hidden');
    document.getElementById('step1Indicator').classList.remove('active');
    document.getElementById('step2Indicator').classList.add('active');
}

function goBackToContact() {
    document.getElementById('paymentStep').classList.add('hidden');
    document.getElementById('contactDetailsStep').classList.remove('hidden');
    document.getElementById('step2Indicator').classList.remove('active');
    document.getElementById('step1Indicator').classList.add('active');
}

function selectPaymentMethod(method) {
  // Remove selected class from all payment options
  const paymentOptions = document.querySelectorAll('.payment-option');
  paymentOptions.forEach(option => {
    option.classList.remove('selected');
  });
  
  // Add selected class to clicked option
  const selectedOption = event.currentTarget;
  selectedOption.classList.add('selected');
  
  // Check the radio button
  const radio = selectedOption.querySelector('input[type="radio"]');
  radio.checked = true;
  
  // Show/hide UPI details
  const upiDetails = document.getElementById('upiDetails');
  if (method === 'upi') {
    upiDetails.classList.remove('hidden');
  } else {
    upiDetails.classList.add('hidden');
  }
}

function placeOrder() {
    if (!isLoggedIn) {
        openLoginModal();
        return;
    }
    
    showNotification('✅ Order placed successfully!');
    cart = [];
    selectedSizes = {};
    updateCart();
    closeCheckout();
    toggleCart();
}

// Notification system
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}