// ================= ГЛОБАЛЬНІ ЗМІННІ МЕНЮ =================
let products = []; 
let currentCategory = 'all';
let currentSort = 'default';
let currentMinPrice = 0;
let currentMaxPrice = 10000;

let menuGrid = document.getElementById('full-menu-grid');
let previewContainer = document.getElementById('preview-container');

// ================= ЗАВАНТАЖЕННЯ ДАНИХ З СЕРВЕРА =================
async function fetchProducts() {
    try {
        const response = await fetch('https://archi-pizza.onrender.com/products');
        if (!response.ok) throw new Error('Помилка завантаження товарів');
        
        products = await response.json();
        initApp();
    } catch (error) {
        console.error("Не вдалося завантажити меню:", error);
        if (menuGrid) menuGrid.innerHTML = '<h2 class="category-group-title">Помилка завантаження меню. Спробуйте пізніше.</h2>';
    }
}

function initApp() {
    window.updatePreviewProducts();

    if (previewContainer) {
        previewContainer.innerHTML = "";
        for (let i = 0; i < 3; i++) {
            if (products[i]) {
                previewContainer.innerHTML += productCard(products[i]);
            }
        }
    }

    let savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
        let word = savedQuery.toLowerCase();
        localStorage.removeItem('searchQuery');

        let found = products.filter(item =>
            item.name.toLowerCase().includes(word) ||
            (item.description && item.description.toLowerCase().includes(word))
        );

        currentCategory = 'all';
        window.updateMenu(found);

        let menuSearchInput = document.getElementById("search-input");
        if (menuSearchInput) menuSearchInput.value = savedQuery;
    } else {
        if (menuGrid) window.updateMenu();
    }
}

// ================= ГЕНЕРАЦІЯ ШАБЛОНУ КАРТКИ =================
function productCard(item) {
    let details = '';
    let sizeSelector = '';
    let isInCart = false;
    let currentQuantity = 1;

    const currentCart = window.cart || [];
    for (let i = 0; i < currentCart.length; i++) {
        if (currentCart[i].id == item.id) {
            isInCart = true;
            currentQuantity = currentCart[i].quantity;
            break;
        }
    }

    let buttonHTML = '';
    let quantityHTML = `
        <div class="card-qty-picker">
            <button onclick="window.changeCardQty(this, -1)">-</button>
            <span class="qty-value">${currentQuantity}</span>
            <button onclick="window.changeCardQty(this, 1)">+</button>
        </div>`;

    if (isInCart) {
        buttonHTML = '<button class="add-to-cart in-cart" disabled>В кошику</button>';
    } else {
        buttonHTML = `<button class="add-to-cart" onclick="window.addToCart(event, '${item.id}')">Купити</button>`;
    }

    if (item.categoria === "pizza") {
        details = '<div class="pizza-description-wrapper">' +
            '<p class="pizza-description">' +
            '<span class="comp-label">Склад:</span> ' + item.description +
            '</p>' +
            '<a href="product.html?id=' + item.id + '" class="details-link-inline">Детальніше</a>' +
            '</div>';
    }

    if (item.categoria === "drinks" && item.sizes && item.sizes.length > 0) {
        sizeSelector = '<div class="size-selector">';
        for (let j = 0; j < item.sizes.length; j++) {
            let s = item.sizes[j];
            let activeClass = (j === 0) ? 'active' : '';
            sizeSelector += '<button class="size-btn ' + activeClass + '" onclick="window.changeSize(event, this, ' + s.price + ', \'' + s.name + '\')">' + s.name + '</button>';
        }
        sizeSelector += '</div>';
    }

    let adminButtonsHTML = '';
    const user = JSON.parse(sessionStorage.getItem('current_user'));
    if (user && user.role === 'admin') {
        adminButtonsHTML = `
            <div class="admin-actions">
                <button class="btn-edit" onclick="window.editProduct('${item.id}', event)">✏️ Редагувати</button>
                <button class="btn-delete" onclick="window.deleteProduct('${item.id}', event)">🗑️ Видалити</button>
            </div>
        `;
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
        adminButtonsHTML +
        '</div>';
}

// ================= ФУНКЦІЇ КАРТКИ ТА ФІЛЬТРІВ =================
window.changeSize = function(event, btn, newPrice, newWeight) {
    event.stopPropagation();
    let card = btn.closest('.pizza-card');
    card.querySelector('.price').innerText = newPrice + " грн";
    card.querySelector('.weight').innerText = newWeight;
    let buttons = card.querySelectorAll('.size-btn');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
    }
    btn.classList.add('active');
};

window.addToCart = function(event, productId) {
    event.stopPropagation();
    let product = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id == productId) {
            product = products[i];
            break;
        }
    }

    if (!product) return;

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

    if (!window.cart) window.cart = [];
    window.cart.push(cartItem);
    
    let btn = event.target;
    btn.innerText = "В кошику";
    btn.classList.add("in-cart");
    btn.disabled = true;

    if (typeof window.saveCart === 'function') window.saveCart();
    if (typeof window.updateCartIcon === 'function') window.updateCartIcon();
};

window.updateMenu = function(searchResult = null) {
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

    const user = JSON.parse(sessionStorage.getItem('current_user'));
    const isAdmin = user && user.role === 'admin';

    for (let i = 0; i < cats.length; i++) {
        let currentCatg = cats[i];
        let title = categoryNames[currentCatg] || currentCatg;
        menuGrid.innerHTML += '<h2 class="category-group-title">' + title + '</h2>';

        let groupGrid = document.createElement('div');
        groupGrid.className = 'pizza-grid';

        if (isAdmin && i === 0) {
            groupGrid.innerHTML += `
                <div class="pizza-card admin-add-card" onclick="window.createNewProduct()">
                    <div class="add-card-content">
                        <span class="add-icon">+</span>
                        <p>Додати новий товар</p>
                    </div>
                </div>
            `;
        }

        for (let j = 0; j < itemsToDisplay.length; j++) {
            if (itemsToDisplay[j].categoria == currentCatg) {
                groupGrid.innerHTML += productCard(itemsToDisplay[j]);
            }
        }
        menuGrid.appendChild(groupGrid);
    }
};

window.updatePreviewProducts = function() {
    if (!previewContainer) return; 
    
    previewContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        if (products[i]) {
            previewContainer.innerHTML += productCard(products[i]);
        }
    }
};

window.handleSort = function() {
    currentSort = document.getElementById('sort-select').value;
    window.updateMenu();
};

// ================= ПОШУК ТА ПАНЕЛЬ ЦІН =================
let minPriceInput = document.getElementById("min-price");
let maxPriceInput = document.getElementById("max-price");
let priceFilterBtn = document.getElementById("sort-by-price");

if (priceFilterBtn) {
    priceFilterBtn.addEventListener("click", function () {
        currentMinPrice = minPriceInput.value !== "" ? parseInt(minPriceInput.value) : 0;
        currentMaxPrice = maxPriceInput.value !== "" ? parseInt(maxPriceInput.value) : 10000;

        if (currentMinPrice > currentMaxPrice) {
            let temp = currentMinPrice;
            currentMinPrice = currentMaxPrice;
            currentMaxPrice = temp;
            minPriceInput.value = currentMinPrice;
            maxPriceInput.value = currentMaxPrice;
        }
        window.updateMenu();
    });
}

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

if (searchBtn) searchBtn.addEventListener("click", searchProducts);
if (searchInput) {
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") searchProducts(event);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetchProducts();

    let filters = document.querySelectorAll('.filter-btn');
    for (let i = 0; i < filters.length; i++) {
        filters[i].addEventListener('click', function () {
            currentCategory = this.dataset.categoria;
            for (let j = 0; j < filters.length; j++) {
                filters[j].classList.remove('active');
            }
            this.classList.add('active');
            window.updateMenu();
        });
    }
});


// ================= ДИНАМІЧНЕ СТВОРЕННЯ МОДАЛКИ АДМІНА (ПРОКАЧАНЕ) =================
function injectAdminModal() {
    if (document.getElementById('admin-product-modal')) return;

    const modalHTML = `
    <div id="admin-product-modal" class="modal-overlay" style="display: none;">
      <div class="modal-content" style="max-width: 500px; max-height: 90vh; overflow-y: auto;">
        <button class="close-modal" id="closeAdminModal">&times;</button>

        <h2 id="admin-modal-title">Додати новий товар</h2>

        <form id="admin-product-form">
          <input type="hidden" id="admin-prod-id">

          <div class="form-group">
            <label for="admin-prod-name">Назва товару *</label>
            <input type="text" id="admin-prod-name" class="form-control" placeholder="Наприклад: Маргарита" required>
          </div>

          <div class="form-group">
            <label for="admin-prod-category">Категорія *</label>
            <select id="admin-prod-category" class="form-control">
              <option value="pizza">Піца</option>
              <option value="drinks">Напої</option>
              <option value="deserts">Десерти</option>
            </select>
          </div>

          <div class="form-group">
            <label for="admin-prod-img">Посилання на зображення *</label>
            <input type="text" id="admin-prod-img" class="form-control" placeholder="img/pizza/margarita.png" required>
          </div>

          <div id="admin-standard-price-block">
              <div class="form-group">
                <label for="admin-prod-price">Ціна (грн) *</label>
                <input type="number" id="admin-prod-price" class="form-control" min="0" placeholder="250">
              </div>

              <div class="form-group">
                <label for="admin-prod-weight">Вага/Об'єм *</label>
                <input type="text" id="admin-prod-weight" class="form-control" placeholder="450г">
              </div>
          </div>

          <div id="admin-drinks-sizes-block" style="display: none; border: 1px dashed var(--archi-gold); padding: 15px; border-radius: 12px; margin-bottom: 20px;">
              <h4 style="margin: 0 0 10px 0; color: var(--archi-navy);">Варіанти об'ємів та цін</h4>
              <div id="sizes-inputs-container">
                  </div>
              <button type="button" id="add-size-row-btn" style="background:#f0f4f8; border:1px solid #ccc; padding: 6px 12px; border-radius: 8px; cursor:pointer; font-weight:600; font-size:12px; margin-top:5px;">+ Додати варіант об'єму</button>
          </div>

          <div class="form-group">
            <label for="admin-prod-description">Склад / Опис</label>
            <textarea id="admin-prod-description" class="form-control" rows="3" placeholder="Моцарела, томати..."></textarea>
          </div>

          <button type="submit" class="auth-submit" id="admin-submit-btn">Зберегти товар</button>
        </form>
      </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    setupAdminFormListeners();
}


function setupAdminFormListeners() {
    const adminForm = document.getElementById('admin-product-form');
    const adminModal = document.getElementById('admin-product-modal');
    const closeAdminModalBtn = document.getElementById('closeAdminModal');
    const categorySelect = document.getElementById('admin-prod-category');
    
    const standardBlock = document.getElementById('admin-standard-price-block');
    const drinksBlock = document.getElementById('admin-drinks-sizes-block');
    const addSizeBtn = document.getElementById('add-size-row-btn');

    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            toggleAdminPriceFields(this.value);
        });
    }

    if (addSizeBtn) {
        addSizeBtn.addEventListener('click', () => {
            addSizeRow("", "");
        });
    }

    if (adminForm) {
        adminForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const id = document.getElementById('admin-prod-id').value;
            const category = categorySelect.value;
            
            let finalPrice = 0;
            let finalWeight = "";
            let finalSizes = [];

            if (category === 'drinks') {
                const rows = document.querySelectorAll('.size-input-row');
                rows.forEach(row => {
                    const name = row.querySelector('.size-name-input').value.trim();
                    const price = parseInt(row.querySelector('.size-price-input').value);
                    if (name && price) {
                        finalSizes.push({ name: name, price: price });
                    }
                });

                if (finalSizes.length > 0) {
                    finalPrice = finalSizes[0].price;
                    finalWeight = finalSizes[0].name;
                }
            } else {

                finalPrice = parseInt(document.getElementById('admin-prod-price').value) || 0;
                finalWeight = document.getElementById('admin-prod-weight').value.trim();
            }
            
            const productData = {
                name: document.getElementById('admin-prod-name').value.trim(),
                categoria: category,
                img: document.getElementById('admin-prod-img').value.trim(),
                price: finalPrice,
                weight: finalWeight,
                description: document.getElementById('admin-prod-description').value.trim(),
                sizes: finalSizes
            };

            let url = 'https://archi-pizza.onrender.com/products';
            let method = 'POST';

            if (id) {
                url = `https://archi-pizza.onrender.com/products/${id}`;
                method = 'PUT';
            }

            try {
                const response = await fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (response.ok) {
                    alert(id ? "Товар успішно оновлено!" : "Товар успішно додано!");
                    if (adminModal) adminModal.style.display = 'none';
                    window.location.reload();
                } else {
                    alert("Помилка сервера при збереженні товару.");
                }
            } catch (error) {
                console.error("Помилка відправки даних:", error);
            }
        });
    }

    if (closeAdminModalBtn) {
        closeAdminModalBtn.addEventListener('click', () => {
            if (adminModal) adminModal.style.display = 'none';
        });
    }
}

function toggleAdminPriceFields(category) {
    const standardBlock = document.getElementById('admin-standard-price-block');
    const drinksBlock = document.getElementById('admin-drinks-sizes-block');
    const container = document.getElementById('sizes-inputs-container');

    if (category === 'drinks') {
        standardBlock.style.display = 'none';
        drinksBlock.style.display = 'block';

        document.getElementById('admin-prod-price').removeAttribute('required');
        document.getElementById('admin-prod-weight').removeAttribute('required');

        if (container && container.children.length === 0) {
            addSizeRow("0.5л", "");
        }
    } else {
        standardBlock.style.display = 'block';
        drinksBlock.style.display = 'none';
        
        document.getElementById('admin-prod-price').setAttribute('required', '');
        document.getElementById('admin-prod-weight').setAttribute('required', '');
    }
}

function addSizeRow(nameValue = "", priceValue = "") {
    const container = document.getElementById('sizes-inputs-container');
    if (!container) return;

    const row = document.createElement('div');
    row.className = 'size-input-row';
    row.style = 'display: flex; gap: 10px; margin-bottom: 8px; align-items: center;';
    
    row.innerHTML = `
        <input type="text" class="form-control size-name-input" placeholder="0.5л" value="${nameValue}" style="flex:1; padding: 8px;" required>
        <input type="number" class="form-control size-price-input" placeholder="Ціна" value="${priceValue}" style="width: 100px; padding: 8px;" required>
        <button type="button" onclick="this.parentElement.remove()" style="background: none; border: none; color: red; font-size: 1.2rem; cursor: pointer; padding: 0 5px;">✕</button>
    `;
    container.appendChild(row);
}

// ================= ГЛОБАЛЬНІ ФУНКЦІЇ ДЛЯ КНОПОК КАРТКИ =================

window.createNewProduct = function() {
    injectAdminModal();

    const adminModal = document.getElementById('admin-product-modal');
    const adminForm = document.getElementById('admin-product-form');
    const container = document.getElementById('sizes-inputs-container');

    if (adminForm && adminModal) {
        adminForm.reset();
        if (container) container.innerHTML = ""; 
        document.getElementById('admin-prod-id').value = "";
        document.getElementById('admin-modal-title').textContent = "Додати новий товар";
        
        document.getElementById('admin-prod-category').value = "pizza";
        
        if (typeof toggleAdminPriceFields === 'function') {
            toggleAdminPriceFields("pizza");
        }
        
        adminModal.style.display = 'flex';
    }
};

window.editProduct = async function(id, event) {
    if (event) event.stopPropagation();
    
    injectAdminModal();

    const adminModal = document.getElementById('admin-product-modal');
    const container = document.getElementById('sizes-inputs-container');
    if (container) container.innerHTML = ""; 

    try {
        const response = await fetch(`https://archi-pizza.onrender.com/products/${id}`);
        if (!response.ok) throw new Error("Не вдалося завантажити дані товару");
        const product = await response.json();

        document.getElementById('admin-prod-id').value = product.id;
        document.getElementById('admin-prod-name').value = product.name;
        document.getElementById('admin-prod-category').value = product.categoria;
        document.getElementById('admin-prod-img').value = product.img;
        document.getElementById('admin-prod-description').value = product.description || "";

        toggleAdminPriceFields(product.categoria);

        if (product.categoria === 'drinks' && product.sizes && product.sizes.length > 0) {
            product.sizes.forEach(s => {
                addSizeRow(s.name, s.price);
            });
        } else {
            document.getElementById('admin-prod-price').value = product.price;
            document.getElementById('admin-prod-weight').value = product.weight;
        }

        document.getElementById('admin-modal-title').textContent = "Редагувати товар";
        if (adminModal) adminModal.style.display = 'flex';
    } catch (error) {
        console.error("Помилка:", error);
        alert("Помилка завантаження даних товару.");
    }
};

window.deleteProduct = async function(id, event) {
    if (event) event.stopPropagation();
    if (confirm(`Ви впевнені, що хочете видалити товар з ID: ${id}?`)) {
        try {
            const response = await fetch(`https://archi-pizza.onrender.com/products/${id}`, { method: 'DELETE' });
            if (response.ok) {
                alert("Товар успішно видалено!");
                window.location.reload();
            } else {
                alert("Не вдалося видалити товар.");
            }
        } catch (error) {
            console.error("Помилка:", error);
        }
    }
};