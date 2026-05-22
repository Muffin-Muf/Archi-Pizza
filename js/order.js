document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('current_user'));
    if (user) {
        if (document.getElementById('order-name')) document.getElementById('order-name').value = user.login;
        if (document.getElementById('order-phone') && user.phone) document.getElementById('order-phone').value = user.phone;
    }

    renderCheckoutList();

    const block1 = document.getElementById('checkout-block-1');
    const block2 = document.getElementById('checkout-block-2');
    const ind1 = document.getElementById('ind-step-1');
    const ind2 = document.getElementById('ind-step-2');

    const deliveryTypeSelect = document.getElementById('order-delivery-type');
    const addressWrapper = document.getElementById('address-fields-wrapper');
    const addressInput = document.getElementById('order-address');


    if (deliveryTypeSelect && addressWrapper) {
        deliveryTypeSelect.addEventListener('change', function() {
            if (this.value === 'pickup') {
                addressWrapper.style.display = 'none';
                if (addressInput) addressInput.removeAttribute('required');
            } else {
                addressWrapper.style.display = 'block';
                if (addressInput) addressInput.setAttribute('required', '');
            }
        });
    }

    document.getElementById('goToStep2').addEventListener('click', () => {
        const currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
        if (currentCart.length === 0) {
            alert("Ваш кошик порожній!");
            return;
        }
        
        block1.classList.remove('active');
        block2.classList.add('active');
        ind1.classList.remove('active');
        ind2.classList.add('active');
    });

    document.getElementById('backToStep1').addEventListener('click', () => {
        block2.classList.remove('active');
        block1.classList.add('active');
        ind2.classList.remove('active');
        ind1.classList.add('active');
    });

    document.getElementById('final-order-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
        const deliveryType = deliveryTypeSelect.value;
        
        const orderData = {
            userLogin: user ? user.login : "Гість",
            customerSurname: document.getElementById('order-surname').value.trim(),
            customerName: document.getElementById('order-name').value.trim(),
            customerPhone: document.getElementById('order-phone').value.trim(),
            deliveryMethod: deliveryType === 'delivery' ? "Кур'єрська доставка" : "Самовивіз",
            
            address: deliveryType === 'delivery' ? document.getElementById('order-address').value.trim() : "Адреса піцерії (Самовивіз)",
            flat: deliveryType === 'delivery' ? document.getElementById('order-flat').value.trim() : "-",
            payment: deliveryType === 'delivery' ? document.getElementById('order-payment').value : "Оплата при отриманні в піцерії",
            
            comment: document.getElementById('order-comment').value.trim(),
            items: currentCart,
            totalPrice: document.getElementById('checkout-total').innerText,
            date: new Date().toLocaleString()
        };

        console.log("Замовлення успішно сформовано для Archi-Pizza:", orderData);

        alert(`Дякуємо, ${orderData.customerName}! Ваше замовлення прийнято. ${deliveryType === 'delivery' ? "Кур'єр вже збирається! 🛵" : "Очікуємо на Вас у піцерії! 🍕"}`);
        
        localStorage.removeItem('archi_cart');
        if (window.cart) window.cart = [];
        
        window.location.href = 'index.html';
    });
});

function renderCheckoutList() {
    const container = document.getElementById('checkout-items-list');
    const totalDisplay = document.getElementById('checkout-total');
    if (!container) return;

    const currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
    container.innerHTML = "";
    let totalSum = 0;

    if (currentCart.length === 0) {
        container.innerHTML = "<h3 style='text-align:center; padding: 30px; color:#999;'>У замовленні немає товарів</h3>";
        if (totalDisplay) totalDisplay.innerText = "0 грн";
        return;
    }

    currentCart.forEach((item, index) => {
        let itemSum = item.price * item.quantity;
        totalSum += itemSum;

        let addonsHtml = "";
        if (item.addons && item.addons.length > 0) {
            addonsHtml = `
                <div class="checkout-item-addons" style="font-size: 0.85rem; color: #718096; margin-top: 4px; font-weight: 500;">
                    <strong>Додатки:</strong> ${item.addons.join(', ')}
                </div>
            `;
        }

        container.innerHTML += `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    ${addonsHtml} </div>
                
                <div class="card-qty-picker" style="margin-right: 20px;">
                    <button onclick="changeCheckoutQty(${index}, -1)">-</button>
                    <span class="qty-value" style="padding: 0 10px; font-weight:700;">${item.quantity}</span>
                    <button onclick="changeCheckoutQty(${index}, 1)">+</button>
                </div>
                
                <span style="font-weight:800; min-width: 80px; text-align:right;">${itemSum} грн</span>
                <button onclick="removeCheckoutItem(${index})" style="background:none; border:none; color:red; cursor:pointer; font-size:1.2rem; margin-left:20px;">✕</button>
            </div>
        `;
    });

    if (totalDisplay) totalDisplay.innerText = totalSum + " грн";
}

window.changeCheckoutQty = function(index, delta) {
    let currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
    if (!currentCart[index]) return;

    currentCart[index].quantity += delta;
    if (currentCart[index].quantity <= 0) {
        currentCart.splice(index, 1);
    }

    localStorage.setItem('archi_cart', JSON.stringify(currentCart));
    if (window.cart) window.cart = currentCart;
    if (typeof window.updateCartIcon === 'function') window.updateCartIcon();

    renderCheckoutList();
};

window.removeCheckoutItem = function(index) {
    let currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
    currentCart.splice(index, 1);

    localStorage.setItem('archi_cart', JSON.stringify(currentCart));
    if (window.cart) window.cart = currentCart;
    if (typeof window.updateCartIcon === 'function') window.updateCartIcon();

    renderCheckoutList();
};