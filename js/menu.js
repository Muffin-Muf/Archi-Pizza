let products = [
    { id: 1, name: "Маргарита", categoria: "pizza", type: "margaruta", price: 270, weight: '700 гр', img: "img/маргарита.jpg", description: "Соус Пелаті, моцарелла, томати свіжі" },
    { id: 2, name: "Папероні", categoria: "pizza", type: "paperoni", price: 290, weight: '700 гр', img: "img/паперони(1).jpg", description: "Соус Пелаті, моцарелла, папероні, соус барбекю" },
    { id: 3, name: "4 сира", categoria: "pizza", type: "4cheese", price: 320, weight: '700 гр', img: "img/4сыра.jpg", description: "Cоус вершковий, моцарелла, сир мааздам, сир твердий, сир Дор Блю" },
    { id: 4, name: "4 м'яса", categoria: "pizza", type: "4meat", price: 320, weight: '800 гр', img: "img/4мяса.jpg", description: "Сосу Пелаті, шинка, салямі, бекон, мисливські ковбаски, печериці, моцарелла, томати свіжі" },
    { id: 5, name: "Сімейна", categoria: "pizza", type: "family", price: 300, weight: '750 гр', img: "img/семейная.jpg", description: "Соус Пелаті, соус частниковий, шинка, курочка копчена, мисливські ковбаски, печериці, моцарелла, кукурудза, томати свіжі" },
    { id: 6, name: "Карбонара", categoria: "pizza", type: "carbonara", price: 290, weight: '700 гр', img: "img/карбонара.jpg", description: "Соус часниковий, шинка, бекон, печериці, моцарелла, томати свіжі" },
    { id: 7, name: "Барбекю", categoria: "pizza", type: "bbq", price: 290, weight: '700 гр', img: "img/барбекю.jpg", description: "Соус барбекю, курочка копчена, мисливські ковбаски, печериці, цибуля синя, моцарелла, томати свіжі" },
    { id: 8, name: "Американо", categoria: "pizza", type: "americano", price: 290, weight: '700 гр', img: "img/американо.jpg", description: "Соус барбекю, салямі, мисливські ковбаски, печериці, цибуля синя, моцарелла, перець болгарський" },
    { id: 9, name: "Гавайська", categoria: "pizza", type: "gavai", price: 290, weight: '700 гр', img: "img/гавайская.jpg", description: "Соус Пелаті, філе куряче, ананаси, моцарелла, кукурудза, томати свіжі, орегано" },
    { id: 10, name: "Українська", categoria: "pizza", type: "ukrainian", price: 290, weight: '700 гр', img: "img/украинская.jpg", description: "Соус Пелаті, ковбаски домашні, бекон, печериці, моцарелла, цибуля синя, огірки мариновані" },
    { id: 11, name: "Італійська", categoria: "pizza", type: "italian", price: 280, weight: '700 гр', img: "img/италия.jpg", description: "Соус Пелаті, салямі, моцарелла, перець болгарський" },
    { id: 12, name: "Цезар", categoria: "pizza", type: "cezar", price: 290, weight: '700 гр', img: "img/цезар.png", description: "Соус часниковий, курочка копчена, бекон, моцарелла, томати, пармезан" },
    { id: 13, name: "Джульєн", categoria: "pizza", type: "julien", price: 290, weight: '700 гр', img: "img/джульен.jpg", description: "Соус вершковий, філе куряче, печериці, моцарелла, пармезан" },
    { id: 14, name: "Пікантна", categoria: "pizza", type: "pikantna", price: 295, weight: '700 гр', img: "img/пекантная.jpg", description: "Соус часниковий, курочка копчена, бекон, моцарелла, сир Дор Блю" },
    { id: 15, name: "Піца з тунцем", categoria: "pizza", type: "tunec", price: 300, weight: '700 гр', img: "img/тунец.jpg", description: "Соус часниковий, тунець консервований, моцарелла, оливки, ананасиб " },
    { id: 16, name: "Діабло", categoria: "pizza", type: "diablo", price: 300, weight: '700 гр', img: "img/4мяса.jpg", description: "Соус Пелаті, соус шрірача, соус барбекю, салямі чорізо, салямі, печериці,моцарелла, перець болгарський, перець халапеньо" },
    { id: 17, name: "Coca-Cola", categoria: "drinks", type: "cola", price: 40, weight: "0.5 л", sizes: [{ name: "0.5 л", price: 40 }, { name: "1 л", price: 60 }, { name: "1.5 л", price: 75 }, { name: "2 л", price: 90 }], img: "img/drinks/cocacola.jpg" },
    { id: 18, name: "Pepsi", categoria: "drinks", type: "cola", price: 40, weight: "0.5 л", sizes: [{ name: "0.5 л", price: 40 }, { name: "1 л", price: 60 }, { name: "1.5 л", price: 75 }, { name: "2 л", price: 90 }], img: "img/drinks/pepsi.jpg" },
    { id: 19, name: "Fanta", categoria: "drinks", type: "cola", price: 40, weight: "0.5 л", sizes: [{ name: "0.5 л", price: 40 }, { name: "1 л", price: 60 }, { name: "1.5 л", price: 75 }, { name: "2 л", price: 90 }], img: "img/drinks/fanta.jpg" },
    { id: 20, name: "Sprite", categoria: "drinks", type: "cola", price: 40, weight: "0.5 л", sizes: [{ name: "0.5 л", price: 40 }, { name: "1 л", price: 60 }, { name: "1.5 л", price: 75 }, { name: "2 л", price: 90 }], img: "img/drinks/sprait.jpg" },
    { id: 21, name: "Садочок Яблука-Виноград", categoria: "drinks", type: "juice", price: 40, weight: "0.5 л", sizes: [{ name: "0.2 л", price: 40 }, { name: "0.5 л", price: 60 }, { name: "0.95 л", price: 75 }, { name: "1.93 л", price: 90 }], img: "img/drinks/SadAplGrap.jpg" },
    { id: 22, name: "Садочок Томатний", categoria: "drinks", type: "juice", price: 40, weight: "0.5 л", sizes: [{ name: "0.2 л", price: 40 }, { name: "0.5 л", price: 60 }, { name: "0.95 л", price: 75 }, { name: "1.93 л", price: 90 }], img: "img/drinks/SadTom.jpg" },
];

let currentCategory = 'all';
let currentSort = 'default';
let currentMinPrice = 0;
let currentMaxPrice = 10000;
let cart = [];

if (localStorage.getItem('archi_cart')) {
    cart = JSON.parse(localStorage.getItem('archi_cart'));
}

let menuGrid = document.getElementById('full-menu-grid');
let previewContainer = document.getElementById('preview-container');

if (previewContainer) {
    previewContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        if (products[i]) {
            previewContainer.innerHTML += productCard(products[i]);
        }
    }
}

window.changeCardQty = function(btn, delta) {
    const card = btn.closest('.pizza-card');
    const productId = parseInt(card.id.replace('product-', '')); 
    const display = card.querySelector('.qty-value');
    
    let currentQty = parseInt(display.innerText);
    let newQty = currentQty + delta;
    
    if (newQty < 1) newQty = 1;
    
    display.innerText = newQty;

    let cartItemIndex = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cartItemIndex = i;
            break;
        }
    }

    if (cartItemIndex !== -1) {
        cart[cartItemIndex].quantity = newQty;
        
        saveCart();   
        updateCartIcon();  
        if (typeof renderCart === 'function') {
            renderCart(); 
        }
    }
};

function productCard(item) {
    let details = '';
    let sizeSelector = '';
    let isInCart = false;
    let currentQuantity = 1;

    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === item.id) {
            isInCart = true;
            currentQuantity = cart[i].quantity; // Беремо кількість із кошика
            break;
        }
    }

    let buttonHTML = '';
    let quantityHTML = `
        <div class="card-qty-picker">
            <button onclick="changeCardQty(this, -1)">-</button>
            <span class="qty-value">${currentQuantity}</span>
            <button onclick="changeCardQty(this, 1)">+</button>
        </div>`;

    if (isInCart) {
        buttonHTML = '<button class="add-to-cart in-cart" disabled>В кошику</button>';
    } else {
        buttonHTML = '<button class="add-to-cart" onclick="addToCart(event, ' + item.id + ')">Купити</button>';
    }

    if (item.categoria === "pizza") {
        details = '<div class="pizza-description-wrapper">' +
            '<p class="pizza-description">' +
            '<span class="comp-label">Склад:</span> ' + item.description +
            '</p>' +
            '<a href="product.html?id=' + item.id + '" class="details-link-inline">Детальніше</a>' +
            '</div>';
    }

    if (item.sizes && item.sizes.length > 0) {
        sizeSelector = '<div class="size-selector">';
        for (let j = 0; j < item.sizes.length; j++) {
            let s = item.sizes[j];
            let activeClass = (j === 0) ? 'active' : '';
            sizeSelector += '<button class="size-btn ' + activeClass + '" onclick="changeSize(event, this, ' + s.price + ', \'' + s.name + '\')">' + s.name + '</button>';
        }
        sizeSelector += '</div>';
    }

    return '<div class="pizza-card animate-fade" id="product-' + item.id + '">' +
        '<div class="pizza-img-wrapper"><img src="' + item.img + '"></div>' +
        '<h3>' + item.name + '</h3>' +
        details +
        sizeSelector +
        '<div class="pizza-meta">' +
        '<span class="price">' + item.price + ' грн</span>' +
        '<span class="weight">' + item.weight + '</span>' +
        '</div>' +
        '<div class="card-buttons">' + buttonHTML + quantityHTML + '</div>' +
        '</div>';
}

function changeSize(event, btn, newPrice, newWeight) {
    event.stopPropagation();
    let card = btn.closest('.pizza-card');
    card.querySelector('.price').innerText = newPrice + " грн";
    card.querySelector('.weight').innerText = newWeight;
    let buttons = card.querySelectorAll('.size-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    btn.classList.add('active');
}

function addToCart(event, productId) {
    event.stopPropagation();
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === productId) {
            product = products[i];
            break;
        }
    }

    let card = document.getElementById('product-' + productId);
    let currentPrice = parseInt(card.querySelector('.price').innerText);


    let qtyElement = card.querySelector('.qty-value');
    let selectedQuantity = qtyElement ? parseInt(qtyElement.innerText) : 1;

    let cartItem = {
        id: product.id,
        originalId: product.id,
        name: product.name,
        price: currentPrice,
        img: product.img,
        quantity: selectedQuantity
    };

    cart.push(cartItem);
    let btn = event.target;
    btn.innerText = "В кошику";
    btn.classList.add("in-cart");
    btn.disabled = true;

    saveCart();
    updateCartIcon();
}

function updateMenu(searchResult = null) {
    if (menuGrid == null) return;
    menuGrid.innerHTML = "";

    let itemsToDisplay = [];

    if (searchResult !== null) {
        itemsToDisplay = searchResult;
    } else {
        for (let i = 0; i < products.length; i++) {
            let item = products[i];
            if (currentCategory === 'all' || item.categoria === currentCategory) {
                itemsToDisplay.push(item);
            }
        }
    }

    itemsToDisplay = itemsToDisplay.filter(item =>
        item.price >= currentMinPrice && item.price <= currentMaxPrice
    );

    if (currentSort === 'price-asc') {
        itemsToDisplay.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-desc') {
        itemsToDisplay.sort((a, b) => b.price - a.price);
    } else if (currentSort === 'name-asc') {
        itemsToDisplay.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (itemsToDisplay.length === 0) {
        menuGrid.innerHTML = '<h2 class="category-group-title">Нічого не знайдено</h2>';
        return;
    }

    let categoryNames = { 'pizza': 'Піца (36 см)', 'drinks': 'Напої', 'deserts': 'Десерти' };
    let cats = [];
    for (let i = 0; i < itemsToDisplay.length; i++) {
        if (cats.indexOf(itemsToDisplay[i].categoria) === -1) {
            cats.push(itemsToDisplay[i].categoria);
        }
    }

    for (let i = 0; i < cats.length; i++) {
        let currentCatg = cats[i];
        let title = categoryNames[currentCatg] || currentCatg;
        menuGrid.innerHTML += '<h2 class="category-group-title">' + title + '</h2>';

        let groupGrid = document.createElement('div');
        groupGrid.className = 'pizza-grid';
        for (let j = 0; j < itemsToDisplay.length; j++) {
            if (itemsToDisplay[j].categoria == currentCatg) {
                groupGrid.innerHTML += productCard(itemsToDisplay[j]);
            }
        }
        menuGrid.appendChild(groupGrid);
    }
}

let minPriceInput = document.getElementById("min-price");
let maxPriceInput = document.getElementById("max-price");
let priceFilterBtn = document.getElementById("sort-by-price");

if (priceFilterBtn) {
    priceFilterBtn.addEventListener("click", function () {
        if (minPriceInput.value !== "") {
            currentMinPrice = parseInt(minPriceInput.value);
        } else {
            currentMinPrice = 0;
        }

        if (maxPriceInput.value !== "") {
            currentMaxPrice = parseInt(maxPriceInput.value);
        } else {
            currentMaxPrice = 10000;
        }

        if (currentMinPrice > currentMaxPrice) {
            let qwerty = currentMinPrice;
            currentMinPrice = currentMaxPrice;
            currentMaxPrice = qwerty;

            minPriceInput.value = currentMinPrice;
            maxPriceInput.value = currentMaxPrice;
        }

        updateMenu();
    });
}

function saveCart() {
    localStorage.setItem('archi_cart', JSON.stringify(cart));
}

function updateCartIcon() {
    let total = 0;
    for (let k = 0; k < cart.length; k++) {
        total += cart[k].quantity;
    }

    let cartCount1 = document.querySelector('.cart-count');
    if (cartCount1) {
        cartCount1.innerText = total;
    }

    let cartCount2 = document.querySelector('.cart-count-overlay');
    if (cartCount2) {
        cartCount2.innerText = total;
    }
}

function handleSort() {
    currentSort = document.getElementById('sort-select').value;
    updateMenu();
}

window.addToCart = addToCart;
window.changeSize = changeSize;
window.handleSort = handleSort;
window.updateMenu = updateMenu;

document.addEventListener('DOMContentLoaded', function () {
    updateCartIcon();
    if (menuGrid) updateMenu();
    let filters = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener('click', function () {
            currentCategory = this.dataset.categoria;
            for (let j = 0; j < filters.length; j++) {
                filters[j].classList.remove('active');
            }
            this.classList.add('active');
            updateMenu();
        });
    }
});

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('open');
    document.getElementById('cart-overlay').classList.toggle('open');
    renderCart();
}

window.renderCart = function () {
    let container = document.getElementById('cart-items-container');
    let totalDisplay = document.getElementById('cart-total-price');
    if (!container) return;

    let savedCart = localStorage.getItem('archi_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }

    container.innerHTML = "";
    let totalSum = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p style='text-align:center; padding: 50px 0; color:#999;'>Кошик порожній</p>";
        if (totalDisplay) totalDisplay.innerText = "0 грн";
        return;
    }

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let itemSum = item.price * item.quantity;
        totalSum = totalSum + itemSum;

        container.innerHTML += '<div class="cart-item-sidebar">' +
            '<img src="' + item.img + '" class="cart-img">' +
            '<div class="cart-info">' +
            '<h4>' + item.name + '</h4>' +
            '<div class="cart-controls">' +
            '<div class="qty-picker">' +
            '<button onclick="changeCartQty(' + i + ', -1)">-</button>' +
            '<span>' + item.quantity + '</span>' +
            '<button onclick="changeCartQty(' + i + ', 1)">+</button>' +
            '</div>' +
            '<span class="item-price-total">' + itemSum + ' грн</span>' +
            '</div></div>' +
            '<button class="remove-item" onclick="removeFromCart(' + i + ')">✕</button>' +
            '</div>';
    }

    if (typeof window.checkCartStatus === 'function') {
        window.checkCartStatus();
    }

    if (totalDisplay) totalDisplay.innerText = totalSum + " грн";

    let buyBtn = document.querySelector('.buy-btn');
    if (buyBtn && typeof currentPizza !== 'undefined' && currentPizza !== null) {
        let isInCart = false;
        for (let i = 0; i < cart.length; i++) {
            if (cart[i].originalId === currentPizza.id) {
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
}

window.changeCartQty = function (index, delta) {
    cart[index].quantity = cart[index].quantity + delta;
    if (cart[index].quantity <= 0) {
        let newCart = [];
        for (let i = 0; i < cart.length; i++) {
            if (i !== index) newCart.push(cart[i]);
        }
        cart = newCart;
    }
    saveCart();
    updateCartIcon();
    renderCart();
    if (typeof window.checkCartStatus === 'function') {
        window.checkCartStatus();
    }
    if (typeof updateMenu === 'function') updateMenu();
};

window.removeFromCart = function (index) {
    let newCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (i !== index) newCart.push(cart[i]);
    }
    cart = newCart;
    saveCart();
    updateCartIcon();
    renderCart();

    if (typeof window.checkCartStatus === 'function') {
        window.checkCartStatus();
    }
    if (typeof updateMenu === 'function') updateMenu();
}



// Функція пошуку

let searchInput = document.getElementById("search-input");
let searchBtn = document.getElementById("search-button");


function searchProducts(event) {
    if (event) event.preventDefault();

    let word = searchInput.value.trim();

    if (word.length > 0) {
        localStorage.setItem('searchQuery', word);
        window.location.href = 'menu.html';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    let savedQuery = localStorage.getItem('searchQuery');

    if (savedQuery) {
        let word = savedQuery.toLowerCase();

        localStorage.removeItem('searchQuery');

        if (typeof products !== 'undefined') {
            let found = products.filter(item =>
                item.name.toLowerCase().includes(word) ||
                (item.description && item.description.toLowerCase().includes(word))
            );

            if (typeof updateMenu === 'function') {
                currentCategory = 'all';
                updateMenu(found);

                let menuSearchInput = document.getElementById("search-input");
                if (menuSearchInput) menuSearchInput.value = savedQuery;
            }
        }
    } else {
        if (typeof updateMenu === 'function') updateMenu();
    }
});

if (searchBtn) {
    searchBtn.addEventListener("click", searchProducts);
}

if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            searchProducts(event);
        }
    });
}