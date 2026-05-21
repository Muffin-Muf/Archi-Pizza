document.addEventListener('DOMContentLoaded', () => {
    // Автоматично заповнюємо профіль користувача, якщо він залогінений
    const user = JSON.parse(sessionStorage.getItem('current_user'));
    if (user) {
        if (document.getElementById('order-name')) document.getElementById('order-name').value = user.login;
        if (document.getElementById('order-phone') && user.phone) document.getElementById('order-phone').value = user.phone;
    }

    renderCheckoutList();

    // ЕЛЕМЕНТИ КЕРУВАННЯ КРОКАМИ
    const block1 = document.getElementById('checkout-block-1');
    const block2 = document.getElementById('checkout-block-2');
    const ind1 = document.getElementById('ind-step-1');
    const ind2 = document.getElementById('ind-step-2');

    // ЕЛЕМЕНТИ ДИНАМІЧНОЇ АДРЕСИ
    const deliveryTypeSelect = document.getElementById('order-delivery-type');
    const addressWrapper = document.getElementById('address-fields-wrapper');
    const addressInput = document.getElementById('order-address');

    // ДИНАМІЧНЕ ХОВАННЯ ПОЛІВ АДРЕСИ
// ДИНАМІЧНЕ ХОВАННЯ ПОЛІВ АДРЕСИ (ВИПРАВЛЕНО)
    if (deliveryTypeSelect && addressWrapper) {
        deliveryTypeSelect.addEventListener('change', function() {
            if (this.value === 'pickup') {
                // Якщо самовивіз — ховаємо адресу і прибираємо обов'язковість
                addressWrapper.style.display = 'none';
                if (addressInput) addressInput.removeAttribute('required');
            } else {
                // Якщо доставка — показуємо і повертаємо обов'язковість (Тепер працює!)
                addressWrapper.style.display = 'block';
                if (addressInput) addressInput.setAttribute('required', '');
            }
        });
    }

    // Клік "Продовжити" -> Перехід на крок 2
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

    // Клік "Назад" -> Повернення на крок 1
    document.getElementById('backToStep1').addEventListener('click', () => {
        block2.classList.remove('active');
        block1.classList.add('active');
        ind2.classList.remove('active');
        ind1.classList.add('active');
    });

    // ФІНАЛЬНЕ ВІДПРАВЛЕННЯ ФОРМИ
    document.getElementById('final-order-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const currentCart = JSON.parse(localStorage.getItem('archi_cart')) || [];
        const deliveryType = deliveryTypeSelect.value;
        
        // Збираємо анкетні дані з урахуванням нових змін
        const orderData = {
            userLogin: user ? user.login : "Гість",
            customerSurname: document.getElementById('order-surname').value.trim(),
            customerName: document.getElementById('order-name').value.trim(),
            customerPhone: document.getElementById('order-phone').value.trim(),
            deliveryMethod: deliveryType === 'delivery' ? "Кур'єрська доставка" : "Самовивіз",
            
            // Якщо самовивіз, адресу записуємо як "Самовивіз", інакше — з інпутів
            address: deliveryType === 'delivery' ? document.getElementById('order-address').value.trim() : "Адреса піцерії (Самовивіз)",
            flat: deliveryType === 'delivery' ? document.getElementById('order-flat').value.trim() : "-",
            payment: deliveryType === 'delivery' ? document.getElementById('order-payment').value : "Оплата при отриманні в піцерії",
            
            comment: document.getElementById('order-comment').value.trim(),
            items: currentCart,
            totalPrice: document.getElementById('checkout-total').innerText,
            date: new Date().toLocaleString()
        };

        console.log("Замовлення успішно сформовано для Archi-Pizza:", orderData);
        
        // Тут твій майбутній POST запит:
        // await fetch('http://localhost:3000/orders', { method: 'POST', body: JSON.stringify(orderData) });

        alert(`Дякуємо, ${orderData.customerName}! Ваше замовлення прийнято. ${deliveryType === 'delivery' ? "Кур'єр вже збирається! 🛵" : "Очікуємо на Вас у піцерії! 🍕"}`);
        
        // Очищаємо кошик після успішного виконання замовлення
        localStorage.removeItem('archi_cart');
        if (window.cart) window.cart = [];
        
        window.location.href = 'index.html';
    });
});

// ФУНКЦІЯ ВИВЕДЕННЯ ТОВАРІВ НА СТОРІНЦІ ОФОРМЛЕННЯ
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

        container.innerHTML += `
            <div class="checkout-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="checkout-item-info">
                    <h4>${item.name}</h4>
                    <span style="color: var(--archi-navy); font-weight:700;">${item.price} грн</span>
                </div>
                
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