// ================= ГЛОБАЛЬНІ ЗМІННІ КОШИКА =================
window.cart = [];

if (localStorage.getItem('archi_cart')) {
    window.cart = JSON.parse(localStorage.getItem('archi_cart'));
}

// ================= ФУНКЦІЇ КЕРУВАННЯ КОШИКОМ =================
window.saveCart = function() {
    localStorage.setItem('archi_cart', JSON.stringify(window.cart));
};

window.updateCartIcon = function() {
    let total = 0;
    for (let k = 0; k < window.cart.length; k++) {
        total += window.cart[k].quantity;
    }

    let cartCount1 = document.querySelector('.cart-count');
    if (cartCount1) cartCount1.innerText = total;

    let cartCount2 = document.querySelector('.cart-count-overlay');
    if (cartCount2) cartCount2.innerText = total;
};

window.toggleCart = function() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer) drawer.classList.toggle('open');
    if (overlay) overlay.classList.toggle('open');
    window.renderCart();
};

window.renderCart = function () {
    let container = document.getElementById('cart-items-container');
    let totalDisplay = document.getElementById('cart-total-price');
    if (!container) return;

    let savedCart = localStorage.getItem('archi_cart');
    window.cart = savedCart ? JSON.parse(savedCart) : [];

    container.innerHTML = "";
    let totalSum = 0;

    if (window.cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 50px 0; color:#999;'>Кошик порожній</p>";
        if (totalDisplay) totalDisplay.innerText = "0 грн";
        return;
    }

    for (let i = 0; i < window.cart.length; i++) {
        let item = window.cart[i];
        let itemSum = item.price * item.quantity;
        totalSum += itemSum;

        let addonsHtml = "";
        if (item.addons && item.addons.length > 0) {
            addonsHtml = '<div class="cart-item-addons">Додатки: ' + item.addons.join(', ') + '</div>';
        }

        container.innerHTML += '<div class="cart-item-sidebar">' +
            '<img src="' + item.img + '" class="cart-img">' +
            '<div class="cart-info">' +
            '<h4>' + item.name + '</h4>' +
            addonsHtml + 
            '<div class="cart-controls">' +
            '<div class="qty-picker">' +
            '<button onclick="window.changeCartQtyViaIndex(' + i + ', -1)">-</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="window.changeCartQtyViaIndex(' + i + ', 1)">+</button>' +
            '</div>' +
            '<span class="item-price-total">' + itemSum + ' грн</span>' +
            '</div></div>' +
            '<button class="remove-item" onclick="window.removeFromCart(' + i + ')">✕</button>' +
            '</div>';
    }

    if (typeof window.checkCartStatus === 'function') {
        window.checkCartStatus();
    }

    if (totalDisplay) totalDisplay.innerText = totalSum + " грн";

    let buyBtn = document.querySelector('.buy-btn');
    if (buyBtn && typeof currentPizza !== 'undefined' && currentPizza !== null) {
        let isInCart = false;
        for (let i = 0; i < window.cart.length; i++) {
            if (window.cart[i].originalId == currentPizza.id) {
                isInCart = true;
                break;
            }
        }
        if (!isInCart) {
            buyBtn.innerText = "Купити піцу";
            buyBtn.classList.remove('in-cart');
            buyBtn.disabled = false;
        } else {
            buyBtn.innerText = "В кошику";
            buyBtn.classList.add('in-cart');
            buyBtn.disabled = true;
        }
    }

    const orderBtn = document.getElementById('orderBtn');
    if (orderBtn) {
        if (window.cart.length === 0) {
            orderBtn.style.backgroundColor = '#ccc';
            orderBtn.style.cursor = 'not-allowed';
            orderBtn.title = "Додайте товари в кошик";
        } else {
            orderBtn.style.backgroundColor = '';
            orderBtn.style.cursor = 'pointer';
            orderBtn.title = "";
        }
    }
};

window.changeCartQtyViaIndex = function (index, delta) {
    window.cart[index].quantity += delta;
    if (window.cart[index].quantity <= 0) {
        window.cart.splice(index, 1);
    }
    window.saveCart();
    window.updateCartIcon();
    window.renderCart();
    
    if (typeof window.checkCartStatus === 'function') window.checkCartStatus();
    if (typeof window.updateMenu === 'function') window.updateMenu();
    if (typeof window.updatePreviewProducts === 'function') window.updatePreviewProducts(); 
};

window.changeCardQty = function(btn, delta) {
    const card = btn.closest('.pizza-card');
    const productId = card.id.replace('product-', ''); 
    const display = card.querySelector('.qty-value');
    
    let currentQty = parseInt(display.innerText);
    let newQty = currentQty + delta;
    if (newQty < 1) newQty = 1;
    
    display.innerText = newQty;

    let cartItemIndex = -1;
    for (let i = 0; i < window.cart.length; i++) {
        if (window.cart[i].id == productId) {
            cartItemIndex = i;
            break;
        }
    }

    if (cartItemIndex !== -1) {
        window.cart[cartItemIndex].quantity = newQty;
        window.saveCart();   
        window.updateCartIcon();  
        if (typeof window.renderCart === 'function') window.renderCart(); 
        if (typeof window.updatePreviewProducts === 'function') window.updatePreviewProducts();
    }
};

window.removeFromCart = function (index) {
    window.cart.splice(index, 1);
    window.saveCart();
    window.updateCartIcon();
    window.renderCart();

    if (typeof window.checkCartStatus === 'function') window.checkCartStatus();
    if (typeof window.updateMenu === 'function') window.updateMenu();
    if (typeof window.updatePreviewProducts === 'function') window.updatePreviewProducts(); 
};

document.addEventListener('DOMContentLoaded', () => {
    window.updateCartIcon();
});

// ================= ОБРОБКА ОФОРМЛЕННЯ ЗАМОВЛЕННЯ =================
document.addEventListener('click', function(e) {
    if (e.target && e.target.id === 'orderBtn') {
        e.preventDefault();

        if (!window.cart || window.cart.length === 0) {
            alert("Ваш кошик порожній! Додайте щось смачненьке з меню.");
            return;
        }

        const user = JSON.parse(sessionStorage.getItem('current_user'));

        if (user) {
            console.log("Перенаправлення авторизованого користувача на сторінку оформлення...");
            
            if (typeof window.handleCartOrder === 'function') {
                window.handleCartOrder();
            }

            window.location.href = 'order.html';
        } else {
            alert("Щоб оформити замовлення, будь ласка, увійдіть у свій акаунт або зареєструйтеся!");
            
            const drawer = document.getElementById('cart-drawer');
            const overlay = document.getElementById('cart-overlay');
            if (drawer) drawer.classList.remove('open');
            if (overlay) overlay.classList.remove('open');

            if (typeof window.openModal === 'function') {
                window.openModal();
            } else if (typeof openModal === 'function') {
                openModal();
            }
        }
    }
});