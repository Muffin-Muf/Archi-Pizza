// ================= ВХІДНІ ЕЛЕМЕНТИ UI =================
const authBtn = document.getElementById("authBtn");
const authTitle = document.querySelector('.auth-title');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegLink = document.getElementById('switchToReg');

// Елементи бічної панелі профілю
const sidebar = document.getElementById('profile-sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const logoutBtn = document.getElementById('logoutBtn');

// ================= МОДАЛЬНЕ ВІКНО =================
function openModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'flex';
    showLogin(); // При відкритті завжди показуємо Вхід
}

function closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';
}

function showLogin() {
    if (authTitle) authTitle.textContent = "Вхід";
    if (loginForm) loginForm.classList.add('active');
    if (registerForm) registerForm.classList.remove('active');
}

function showRegister() {
    if (authTitle) authTitle.textContent = "Реєстрація";
    if (registerForm) registerForm.classList.add('active');
    if (loginForm) loginForm.classList.remove('active');
}

// Навішування базових подій модалки та бічної панелі
if (authBtn) {
    authBtn.addEventListener('click', function (e) {
        const user = JSON.parse(sessionStorage.getItem('current_user'));

        if (user) {
            // Шукаємо панель безпосередньо в момент кліку!
            const dynamicSidebar = document.getElementById('profile-sidebar');

            if (dynamicSidebar) {
                dynamicSidebar.classList.add('active');
                console.log("Клас active успішно додано до панелі!");
            } else {
                console.error("Помилка: Елемент з id='profile-sidebar' не знайдено в HTML!");
                alert("Компонент профілю не знайдено на сторінці.");
            }
        } else {
            // Якщо користувач не увійшов — відкриваємо модалку входу
            openModal();
        }
    });
}

if (document.getElementById('closeAuth')) {
    document.getElementById('closeAuth').addEventListener('click', closeModal);
}

if (switchToRegLink) {
    switchToRegLink.addEventListener('click', function (e) {
        e.preventDefault();
        showRegister();
    });
}

if (closeSidebar) {
    closeSidebar.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('active');
    });
}

// ================= РОБОТА З БАЗОЮ ДАНИХ (json-server) =================
const db = {
    async saveUser(user) {
        try {
            const checkResponse = await fetch(`http:https://archi-pizza.onrender.com/users?login=${user.login}`);
            const existingUsers = await checkResponse.json();

            if (existingUsers.length > 0) {
                alert("Користувач з таким логіном вже існує!");
                return false;
            }

            const newUser = { ...user, role: "user" };
            const response = await fetch('https://archi-pizza.onrender.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });

            if (!response.ok) throw new Error('Помилка сервера при реєстрації');

            alert("Реєстрація успішна! Тепер увійдіть.");
            showLogin();
            return true;
        } catch (error) {
            console.error("Помилка реєстрації:", error);
            alert("Не вдалося зареєструватися. Спробуйте пізніше.");
            return false;
        }
    },

    async getUser(loginOrEmail, password) {
        try {
            let response = await fetch(`https://archi-pizza.onrender.com/users?login=${loginOrEmail}`);
            let users = await response.json();

            if (users.length === 0) {
                response = await fetch(`https://archi-pizza.onrender.com/users?email=${loginOrEmail}`);
                users = await response.json();
            }

            if (users.length > 0) {
                const foundUser = users[0];
                if (foundUser.password === password) {
                    return foundUser;
                }
            }
            return null;
        } catch (error) {
            console.error("Помилка авторизації:", error);
            return null;
        }
    }
};

// ================= ОНОВЛЕННЯ UI ПІСЛЯ ВХОДУ (ЄДИНА ВЕРСІЯ) =================
function updateAuthUI(user) {
    const authBtn = document.getElementById('authBtn');
    if (!authBtn) return;

    // Шукаємо текстовий вузол всередині або міняємо текст самої кнопки
    const authText = authBtn.querySelector('.auth-text');
    if (authText) {
        authText.textContent = "Мій акаунт";
    } else {
        authBtn.textContent = "Мій акаунт";
    }

    authBtn.classList.add('logged-in');
    authBtn.style.color = "#ffcc00";
    authBtn.title = `Профіль: ${user.login}`;

    // Заповнюємо дані в бічній панелі профілю, якщо елементи існують
    const sLogin = document.getElementById('sidebar-login');
    const sEmail = document.getElementById('sidebar-email');
    const sRole = document.getElementById('sidebar-role');

    if (sLogin) sLogin.textContent = user.login;
    if (sEmail) sEmail.textContent = user.email;
    if (sRole) sRole.textContent = user.role || 'user';
}

// ================= ОБРОБКА ФОРМ =================
if (registerForm) {
    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const login = document.getElementById('reg-login').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-pass').value;
        const confirm = document.getElementById('reg-pass-confirm').value;

        if (pass !== confirm) {
            alert("Паролі не збігаються!");
            return;
        }
        if (pass.length < 6) {
            alert("Пароль занадто короткий (мінімум 6 символів)!");
            return;
        }
        await db.saveUser({ login, email, password: pass });
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const loginInput = document.getElementById('login-user').value.trim();
        const passInput = document.getElementById('login-pass').value;

        if (!loginInput || !passInput) {
            alert("Будь ласка, заповніть усі поля!");
            return;
        }

        const user = await db.getUser(loginInput, passInput);

        if (user) {
            sessionStorage.setItem('current_user', JSON.stringify(user));
            updateAuthUI(user);
            closeModal();

            if (user.role === 'admin') {
                alert(`Вітаємо, ${user.name || user.login}! Перенаправлення в панель керування...`);
                window.location.reload();
            } else {
                alert(`Ви успішно увійшли, ${user.login}!`);
                window.location.reload();
            }
        } else {
            alert("Невірний логін, email або пароль!");
        }
    });
}

// ================= СЛУХАЧІ ЗАВАНТАЖЕННЯ СТОРІНКИ =================
window.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(sessionStorage.getItem('current_user'));
    if (user) {
        updateAuthUI(user);
    }
});

// Логіка виходу з акаунту
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('current_user');
        alert("Ви вийшли з акаунту");
        window.location.reload();
    });
}

// Обробник кошика/замовлення
const orderButton = document.getElementById('orderBtn');
if (orderButton) {
    orderButton.addEventListener('click', function () {
        if (typeof handleCartOrder === 'function') {
            handleCartOrder();
        }
    });
}




















// Керування появою кнопок скролу та кошика
const scrollToTopBtn = document.getElementById('scrollToTop');
const cartOverlayBtn = document.querySelector('.cart-btn-overlay');

window.addEventListener('scroll', () => {
    // Якщо прокрутили сторінку більше ніж на 300px
    if (window.scrollY > 300) {
        if (scrollToTopBtn) scrollToTopBtn.classList.add('visible');
        if (cartOverlayBtn) cartOverlayBtn.classList.add('visible');
    } else {
        if (scrollToTopBtn) scrollToTopBtn.classList.remove('visible');
        if (cartOverlayBtn) cartOverlayBtn.classList.remove('visible');
    }
});

// Логіка самого кліку для плавного підйому вгору (про всяк випадок)
if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // плавний скрол
        });
    });
}